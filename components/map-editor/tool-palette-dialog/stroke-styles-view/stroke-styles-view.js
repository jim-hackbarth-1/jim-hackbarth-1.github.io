
import { KitRenderer } from "../../../../ui-kit.js";
import { PathStyleOption } from "../../../../domain/references.js";
import { DomHelper } from "../../../shared/dom-helper.js";

export function createModel() {
    return new StrokeStylesViewModel();
}

export class StrokeStylesViewModel {

    // event handlers
    async onRenderStart(componentId, modelInput) {
        this.componentId = componentId;
        this.pathStyleViewModel = modelInput.pathStyleViewModel;
    }

    onKeyDown(event) {
        event.stopPropagation();
    }

    // methods
    getOption(optionName) {
        if (this.pathStyleViewModel) {
            return this.pathStyleViewModel.getOption(optionName);
        }
        return null;
    }

    getOffset() {
        if (this.pathStyleViewModel) {
            return this.pathStyleViewModel.getOption(PathStyleOption.StrokeOffset) ?? { x: 0, y: 0 };
        }
        return { x: 0, y: 0 };
    }

    isSelected(optionName, optionValue) {
        if (this.pathStyleViewModel) {
            const currentValue = this.pathStyleViewModel.getOption(optionName);
            if (currentValue == optionValue) {
                return "selected";
            }
        }
        return "";
    }

    async update() {
        if (this.pathStyleViewModel) {
            await this.pathStyleViewModel.update();
        }
    }

    validate() {
        let isValid = true;

        const width = parseInt(DomHelper.getElement(this.#componentElement, "#width")?.value);
        if (isNaN(width) || width < 1 || width > 100) {
            DomHelper.getElement(this.#componentElement, "#validation-width").innerHTML = "Valid number between 1 and 100 required.";
            isValid = false;
        }

        let dash = DomHelper.getElement(this.#componentElement, "#dash")?.value;
        if (dash) {
            dash = dash.replaceAll(' ', '').split(',').map(d => parseInt(d));
        }
        else {
            dash = [];
        }
        if (dash.some(d => isNaN(d))) {
            DomHelper.getElement(this.#componentElement, "#validation-dash").innerHTML = "Invalid dash string format. Comma-delimited list of integers expected.";
            isValid = false;
        }
        if (dash.some(d => d < 1 || d > 100)) {
            DomHelper.getElement(this.#componentElement, "#validation-dash").innerHTML = "Invalid dash value. Dash values must be integers between 1 and 100.";
            isValid = false;
        }

        const dashOffset = parseInt(DomHelper.getElement(this.#componentElement, "#dash-offset")?.value);
        if (isNaN(dashOffset) || dashOffset < 0 || dashOffset > 100) {
            DomHelper.getElement(this.#componentElement, "#validation-dash-offset").innerHTML = "Valid number between 0 and 100 required.";
            isValid = false;
        }

        const endCap = DomHelper.getElement(this.#componentElement, "#end-cap")?.value;
        const endCaps = ["round", "butt", "square"];
        if (!endCaps.includes(endCap)) {
            DomHelper.getElement(this.#componentElement, "#validation-end-cap").innerHTML = "Valid end cap value required.";
            isValid = false;
        }

        const join = DomHelper.getElement(this.#componentElement, "#join")?.value;
        const joins = ["round", "bevel", "miter"];
        if (!joins.includes(join)) {
            DomHelper.getElement(this.#componentElement, "#validation-join").innerHTML = "Valid join value required.";
            isValid = false;
        }

        const offsetX = parseInt(DomHelper.getElement(this.#componentElement, "#offset-x")?.value);
        if (isNaN(offsetX) || offsetX < -100 || offsetX > 100) {
            DomHelper.getElement(this.#componentElement, "#validation-offset-x").innerHTML = "Valid number between -100 and 100 required.";
            isValid = false;
        }

        const offsetY = parseInt(DomHelper.getElement(this.#componentElement, "#offset-y")?.value);
        if (isNaN(offsetY) || offsetY < -100 || offsetY > 100) {
            DomHelper.getElement(this.#componentElement, "#validation-offset-y").innerHTML = "Valid number between -100 and 100 required.";
            isValid = false;
        }

        return {
            isValid: isValid,
            width: width,
            dash: dash,
            dashOffset: dashOffset,
            endCap: endCap,
            join: join,
            offset: { x: offsetX, y: offsetY }
        };
    }

    // helpers
    #componentElementInternal;
    get #componentElement() {
        if (!this.#componentElementInternal) {
            this.#componentElementInternal = KitRenderer.getComponentElement(this.componentId);
        }
        return this.#componentElementInternal
    }
}
