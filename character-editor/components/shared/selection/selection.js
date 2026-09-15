
export function createModel() {
    return new SelectionModel();
}

class SelectionModel {

    #kitElement;
    #selectionModel;
    #changeHandler;
    #getDetailHandler;

    async init(kitElement, kitObjects) {
        this.#kitElement = kitElement;
        this.#selectionModel = kitObjects.find(o => o.alias == "selectionModel")?.object; 
        this.#changeHandler = kitObjects.find(o => o.alias == "changeHandler")?.object;  
        this.#getDetailHandler = kitObjects.find(o => o.alias == "getDetailHandler")?.object; 
    }

    static #hideSectionExpandedRegistered;
    async onRendered() {
        if (!SelectionModel.#hideSectionExpandedRegistered) {
            const details = UIKit.document.documentElement.querySelectorAll("#editor-content > details");
            for (const detail of details) {
                detail.addEventListener("mousedown", (event) => this.hideExpandedSections());
                detail.addEventListener("touchstart", (event) => this.hideExpandedSections());
            }
            UIKit.document.documentElement
                .querySelector("#print-view-component")
                .addEventListener("mousedown", (event) => this.hideExpandedSections());
            UIKit.document.documentElement
                .querySelector("#heading-component")
                .addEventListener("mousedown", (event) => this.hideExpandedSections());
            UIKit.document.documentElement
                .querySelector("#print-view-component")
                .addEventListener("touchstart", (event) => this.hideExpandedSections());
            UIKit.document.documentElement
                .querySelector("#heading-component")
                .addEventListener("touchstart", (event) => this.hideExpandedSections());
            SelectionModel.#hideSectionExpandedRegistered = true;
        }
        const sectionExpanded = this.#kitElement.querySelector(".selection-expanded");
        if (sectionExpanded) {
            sectionExpanded.classList.add("hidden");
        }
        if (this.#selectionModel.maxSelections == 1) {
            const checkboxes = this.#kitElement.querySelectorAll(".option-checkbox");
            for (const checkbox of checkboxes) {
                checkbox.classList.add("hidden");
            }
        }
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

    getTitle() {
        return this.#selectionModel.title ?? "";
    }

    getCollapsedDisplayValue() {
        let displayValue = null;
        if (this.#selectionModel.options.length > 0) {
            displayValue = this.#selectionModel.options[0].text;
            if (this.#selectionModel.maxSelections == 1) {
                const selectedOption = this.#selectionModel.options.find(o => o.isSelected);
                if (selectedOption) {
                    displayValue = selectedOption?.text;
                }
            }
            else {
                const selectedCount = this.#selectionModel.options.filter(o => o.isSelected).length;
                if (selectedCount == this.#selectionModel.maxSelections) {
                    displayValue = `${selectedCount} selected`;
                }
            }
        }
        return displayValue ?? "";
    }

    toggleDropDown(event) {
        const sectionExpanded = this.#kitElement.querySelector(".selection-expanded");
        const isHidden = sectionExpanded.classList.contains("hidden");
        this.hideExpandedSections();
        if (isHidden) {
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
        return this.#selectionModel.options;
    }

    #togglingDetails;
    async toggleDetail(event, optionValue) {
        this.#togglingDetails = true;
        const elementId = `option-${optionValue}`;
        const optionElement = this.#kitElement.querySelector(`#${elementId}`);
        const isExpanded = optionElement.classList.contains("expanded");
        const allOptions = this.#kitElement.querySelectorAll(".option");
        for (const option of allOptions) {
            option.classList.remove("expanded");
        }
        if (isExpanded) {
            optionElement.classList.remove("expanded");
        }
        else {
            const optionDetailElement = optionElement.querySelector(".option-detail");
            if (this.#getDetailHandler) {
                optionDetailElement.innerHTML = await this.#getDetailHandler(this.#selectionModel.name, optionValue);
            }
            optionElement.classList.add("expanded");
        }       
    }

    async onOptionClick(event, optionValue) {
        if (this.#selectionModel.maxSelections == 1) {
            await this.#onValueChanged(optionValue);
        }
    }

    async onCheckboxClick(event, optionValue) {
        await this.#onValueChanged(optionValue);
        event.stopPropagation();
    }

    async #onValueChanged(optionValue) {
        if (!this.#togglingDetails) {
            if (this.#changeHandler) { 
                if (optionValue == "null") {
                    optionValue = null;
                }
                const option = this.#selectionModel.options.find(o => o.value == optionValue);
                if (!option.isDisabled) {
                    if (this.#selectionModel.maxSelections == 1) {
                        await this.#changeHandler(this.#selectionModel.name, [optionValue]);
                    }
                    else {
                        const selectedValues = [...this.#kitElement.querySelectorAll("input[type='checkbox']:checked")]
                            .map(c => c.getAttribute("data-option-value"));
                        if (
                            selectedValues.length == this.#selectionModel.maxSelections
                            || selectedValues.length == 0
                        ) {
                            await this.#changeHandler(this.#selectionModel.name, selectedValues);
                        }
                    }
                }
            }
        }
        this.#togglingDetails = false;
    }

}
