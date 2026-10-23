
import { Sources, Utilities } from "../../../domain/references.js";
import { EditorViewModel } from "../../editor-view/editor-view.js";

export function createModel() {
    return new SelectionModel();
}

export class SelectionModel {

    #kitElement;
    #selectionModel;
    #options;

    async init(kitElement, kitObjects) {
        this.#kitElement = kitElement;
        this.#selectionModel = kitObjects.find(o => o.alias == "selectionModel")?.object; 
    }

    static #hideSectionExpandedRegistered;
    async onRendered() {
        if (!SelectionModel.#hideSectionExpandedRegistered) {
            const details = UIKit.document.documentElement.querySelectorAll("#editor-content > details");
            for (const detail of details) {
                detail.addEventListener("pointerdown", (event) => this.hideExpandedSections());
            }
            UIKit.document.documentElement
                .querySelector("#print-view-component")
                .addEventListener("pointerdown", (event) => this.hideExpandedSections());
            UIKit.document.documentElement
                .querySelector("#heading-component")
                .addEventListener("pointerdown", (event) => this.hideExpandedSections());
            SelectionModel.#hideSectionExpandedRegistered = true;
        }
        this.#displayCurrentSelection();
    }

    hideExpandedSections() {
        const allDetails = this.#kitElement.querySelectorAll(".option");
        for (const detail of allDetails) {
            detail.classList.remove("expanded");
        }
        const sections = UIKit.document.documentElement.querySelectorAll(".selection-expanded");
        for (const section of sections) {
            if (!section.classList.contains("hidden")) {
                section.classList.add("hidden");
            }
        }
    }

    hasSelectionModel() {
        if (this.#selectionModel) {
            return true;
        }
        return false;
    }

    getTitle() {
        const title = this.#selectionModel.title ?? "";
        if (title) {
            return `${title}:`;
        }
        return "";
    }

    getAlertMessage() {
        return this.#selectionModel.alertMessage ?? "";
    }

    async toggleDropDown(event) {
        if (!this.#selectionModel.locked) {
            let sectionExpanded = this.#kitElement.querySelector(".selection-expanded");
            const isHidden = sectionExpanded.classList.contains("hidden");
            this.hideExpandedSections();
            if (isHidden) {
                const sources = this.#selectionModel.sources;
                this.#applySourceOptions(sources);
                this.#options = this.#selectionModel.getOptions(this.#selectionModel.name, sources);
                await UIKit.renderer.renderElement(this.#kitElement.querySelector(".selection-expanded"));
                sectionExpanded = this.#kitElement.querySelector(".selection-expanded");
                sectionExpanded.classList.remove("hidden");
            }
            else {
                sectionExpanded.classList.add("hidden");
            }
        }
        if (event) {
            event.stopPropagation();
        }
    }

    getOptions() {
        return this.#options ?? [];
    }

    isMultiSelect() {
        return this.#selectionModel.maxSelections > 1;
    }

    async toggleDetail(optionValue) {
        const optionElement = this.#kitElement.querySelector(`.data-option-value-${optionValue}`)
        const isExpanded = optionElement.classList.contains("expanded");
        const allOptions = this.#kitElement.querySelectorAll(".option");
        for (const option of allOptions) {
            option.classList.remove("expanded");
        }
        if (!isExpanded) {
            const optionDetailElement = optionElement.querySelector(".option-detail");
            if (this.#selectionModel.getOptionDetail) {
                optionDetailElement.innerHTML
                    = await this.#selectionModel.getOptionDetail(this.#selectionModel.name, optionValue);
            }
            optionElement.classList.add("expanded");
        }
    }

    async onOptionClick(optionValue) {
        if (this.#selectionModel.maxSelections == 1) {
            await this.#onValueChanged(optionValue);
        }
    }

    async onCheckboxClick(event, optionValue) {
        await this.#onValueChanged(optionValue);
        event.stopPropagation();
    }

    #displayCurrentSelection() {
        let value = null;
        let text = null;
        const currentSelections = this.#selectionModel?.currentSelections ?? [];
        if (currentSelections.length == 1) {
            value = currentSelections[0].value;
            text = currentSelections[0].text;
        }
        if (currentSelections.length > 1) {
            value = "multiple";
            text = `${currentSelections.length} selected`;
        }
        const selectionElement = this.#kitElement.querySelector(".selection");
        const element = this.#kitElement.querySelector(".collapsed-option-label");
        if (element) {
            element.querySelector("label").innerHTML = text ?? "Choose an option ...";
            if (value) {
                selectionElement.classList.remove("selection-required");
            }
            else {
                selectionElement.classList.add("selection-required");
            }
        }
    }

    async #onValueChanged(optionValue) {
        if (this.#selectionModel.updateSelection) {
            if (optionValue == "null") {
                optionValue = null;
            }
            const option = this.#options.find(o => o.value == optionValue);
            if (!option.isDisabled) {
                if (this.#selectionModel.maxSelections == 1) {
                    this.#selectionModel.currentSelections = [{ value: option.value, text: option.text, source: option.source?.name }];
                    this.toggleDropDown();
                    this.#displayCurrentSelection();
                    await this.#selectionModel.updateSelection(
                        this.#selectionModel.name, this.#selectionModel.currentSelections);
                }
                else {
                    const selectedValues = [...this.#kitElement.querySelectorAll("input[type='checkbox']:checked")]
                        .map(c => c.getAttribute("data-option-value"));
                    if (
                        selectedValues.length == this.#selectionModel.maxSelections
                        || selectedValues.length == 0
                    ) {
                        this.#selectionModel.currentSelections = this.#options
                            .filter(o => selectedValues.includes(o.value))
                            .map(o => ({ value: o.value, text: o.text, source: o.source?.name }));
                        this.toggleDropDown();
                        this.#displayCurrentSelection();
                        await this.#selectionModel.updateSelection(
                            this.#selectionModel.name, this.#selectionModel.currentSelections);
                    }
                }
            }
        }
    }

    #applySourceOptions(sources) {
        const character = EditorViewModel.character;
        if (sources) {
            for (const source of sources) {
                if (source.name == "languages") {
                    source.options = this.#getLanguages(character);
                }
                if (source.name == "skills") {
                    source.options = this.#getSkills();
                }
                if (source.name == "spells") {
                    source.options = this.#getSpells(character);
                }
                if (source.name == "tools") {
                    source.options = this.#getTools(character);
                }
            }
        }
    }

    #getLanguages(character) {
        let options = [...Sources.getLanguages(character.sources)];
        for (const option of options) {
            option.noteText = option.source.title;
        }
        return options;
    }

    #getSkills(character) {
        return [...Sources.getSkills()];
    }

    #getSpells(character) {
        let options = [...Sources.getSpells(character.sources)];
        for (const option of options) {
            option.value = option.name,
            option.text = option.title,
            option.hasDetail = true,
            option.noteText = `Level ${option.level} - ${option.source.title}`;
        }
        return options;
    }

    #getTools(character) {
        return Sources.getEquipment(character.sources).filter(e => e.category == "tools");
    }

    #getSelectedOption(optionValue) {
        if (optionValue == "null") {
            optionValue = null;
        }
        return this.#options.find(o => o.value == optionValue);
    }

}
