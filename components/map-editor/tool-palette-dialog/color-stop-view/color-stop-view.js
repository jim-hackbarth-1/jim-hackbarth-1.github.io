
import { KitRenderer } from "../../../../ui-kit.js";
import { DomHelper } from "../../../shared/dom-helper.js";

export function createModel() {
    return new ColorStopViewModel();
}

export class ColorStopViewModel {

    // event handlers
    async onRenderStart(componentId, modelInput) {
        this.componentId = componentId;
        this.pathStyleViewModel = modelInput.pathStyleViewModel;
        this.colorStop = modelInput.colorStop;
    }

    onKeyDown(event) {
        event.stopPropagation();
    }

    // methods
    getOffset() {
        if (this.colorStop) {
            return this.colorStop.offset;
        }
        return 0;
    }

    getColor() {
        if (this.colorStop) {
            return this.colorStop.color;
        }
        return "#c0c0c0";
    }

    async update() {
        if (this.pathStyleViewModel) {
            await this.pathStyleViewModel.update();
        }
    }

    validate() {
        let isValid = true;

        const offset = parseInt(DomHelper.getElement(this.#componentElement, "#colorstop-offset")?.value);
        if (isNaN(offset) || offset < 0 || offset > 100) {
            DomHelper.getElement(this.#componentElement, "#validation-colorstop-offset").innerHTML = "Valid number between 0 and 100 required.";
            isValid = false;
        }

        const color = DomHelper.getElement(this.#componentElement, "#colorstop-color")?.value;
        if (!color || !color.match(/^#[0-9a-f]{6}/i)) {
            DomHelper.getElement(this.#componentElement, "#validation-colorstop-color").innerHTML = "Valid hex color value (e.g. '#c0c0c0') required.";
            isValid = false;
        }

        return {
            isValid: isValid,
            offset: offset,
            color: color
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
