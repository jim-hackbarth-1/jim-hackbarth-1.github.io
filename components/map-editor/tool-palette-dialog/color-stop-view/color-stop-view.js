
import { KitRenderer } from "../../../../ui-kit.js";

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

        const offset = parseInt(this.#getElement("#colorstop-offset")?.value);
        if (isNaN(offset) || offset < 0 || offset > 100) {
            this.#getElement("#validation-colorstop-offset").innerHTML = "Valid number between 0 and 100 required.";
            isValid = false;
        }

        const color = this.#getElement("#colorstop-color")?.value;
        if (!color || !color.match(/^#[0-9a-f]{6}/i)) {
            this.#getElement("#validation-colorstop-color").innerHTML = "Valid hex color value (e.g. '#c0c0c0') required.";
            isValid = false;
        }

        return {
            isValid: isValid,
            offset: offset,
            color: color
        };
    }

    // helpers
    #componentElement;
    #getElement(selector) {
        if (!this.#componentElement) {
            this.#componentElement = KitRenderer.getComponentElement(this.componentId);
        }
        return this.#componentElement.querySelector(selector);
    }
}
