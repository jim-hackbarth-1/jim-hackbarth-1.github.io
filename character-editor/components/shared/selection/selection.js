
import { Character, Sources, Utilities } from "../../../domain/references.js";

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

    async toggleDropDown(event) {
        let sectionExpanded = this.#kitElement.querySelector(".selection-expanded");
        const isHidden = sectionExpanded.classList.contains("hidden");
        this.hideExpandedSections();
        if (isHidden) {
            this.#options = this.#selectionModel.getOptions(this.#selectionModel.name);
            await UIKit.renderer.renderElement(this.#kitElement.querySelector(".selection-expanded"));
            sectionExpanded = this.#kitElement.querySelector(".selection-expanded");
            sectionExpanded.classList.remove("hidden");
        }
        else {
            sectionExpanded.classList.add("hidden");
        }
        if (event) {
            event.stopPropagation();
        }
    }

    getOptions() {
        return this.#getOptions();
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
        const element = this.#kitElement.querySelector(".collapsed-option-label");
        element.querySelector("label").innerText = text ?? "Choose an option ...";
        if (value) {
            element.classList.remove("selection-required");
        }
        else {
            element.classList.add("selection-required");
        }
    }

    async #onValueChanged(optionValue) {
        if (this.#selectionModel.updateSelection) {
            const option = this.#getSelectedOption(optionValue);
            if (!option.isDisabled) {
                if (this.#selectionModel.maxSelections == 1) {
                    this.#selectionModel.currentSelections = [{ value: option.value, text: option.text }];
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
                            .map(o => ({ value: o.value, text: o.text }));
                        this.toggleDropDown();
                        this.#displayCurrentSelection();
                        await this.#selectionModel.updateSelection(
                            this.#selectionModel.name, this.#selectionModel.currentSelections);
                    }
                }
            }
        }
    }

    #getOptions() {
        if (this.#selectionModel.useLanguages) {
            const character = Character.currentCharacter;
            const selectedLanguages = character.selections.find(s => s.name == this.#selectionModel.name)?.values ?? [];
            return this.#getLanguages(character, selectedLanguages);
        }
        return this.#options ?? [];
    }

    #getSelectedOption(optionValue) {
        if (optionValue == "null") {
            optionValue = null;
        }
        let option = null;
        if (this.#selectionModel.useLanguages) {
            const character = Character.currentCharacter;
            return option = Sources.getLanguages(character.sources).find(l => l.value == optionValue);
        }
        return this.#options.find(o => o.value == optionValue);
    }

    #getLanguages(character, selectedLanguages) {
        let optionValues = [...Sources.getLanguages(character.sources)];
        for (const optionValue of optionValues) {
            optionValue.noteText = optionValue.source.title;
            optionValue.isSelected = (selectedLanguages.includes(optionValue.value));
        }
        optionValues = Utilities.sort(optionValues, "text");
        optionValues.unshift({ value: null, text: "Choose a language ..." });
        return optionValues;
    }

}
