
import { KitRenderer } from "../../../../ui-kit.js";
import { PathStyleOption } from "../../../../domain/references.js";

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

        const width = parseInt(this.#getElement("#width")?.value);
        if (isNaN(width) || width < 1 || width > 100) {
            this.#getElement("#validation-width").innerHTML = "Valid number between 1 and 100 required.";
            isValid = false;
        }

        let dash = this.#getElement("#dash")?.value;
        if (dash) {
            dash = dash.replaceAll(' ', '').split(',').map(d => parseInt(d));
        }
        else {
            dash = [];
        }
        if (dash.some(d => isNaN(d))) {
            this.#getElement("#validation-dash").innerHTML = "Invalid dash string format. Comma-delimited list of integers expected.";
            isValid = false;
        }
        if (dash.some(d => d < 1 || d > 100)) {
            this.#getElement("#validation-dash").innerHTML = "Invalid dash value. Dash values must be integers between 1 and 100.";
            isValid = false;
        }

        const dashOffset = parseInt(this.#getElement("#dash-offset")?.value);
        if (isNaN(dashOffset) || dashOffset < 0 || dashOffset > 100) {
            this.#getElement("#validation-dash-offset").innerHTML = "Valid number between 0 and 100 required.";
            isValid = false;
        }

        const endCap = this.#getElement("#end-cap")?.value;
        const endCaps = ["round", "butt", "square"];
        if (!endCaps.includes(endCap)) {
            this.#getElement("#validation-end-cap").innerHTML = "Valid end cap value required.";
            isValid = false;
        }

        const join = this.#getElement("#join")?.value;
        const joins = ["round", "bevel", "miter"];
        if (!joins.includes(join)) {
            this.#getElement("#validation-join").innerHTML = "Valid join value required.";
            isValid = false;
        }

        const offsetX = parseInt(this.#getElement("#offset-x")?.value);
        if (isNaN(offsetX) || offsetX < -100 || offsetX > 100) {
            this.#getElement("#validation-offset-x").innerHTML = "Valid number between -100 and 100 required.";
            isValid = false;
        }

        const offsetY = parseInt(this.#getElement("#offset-y")?.value);
        if (isNaN(offsetY) || offsetY < -100 || offsetY > 100) {
            this.#getElement("#validation-offset-y").innerHTML = "Valid number between -100 and 100 required.";
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
    #componentElement;
    #getElement(selector) {
        if (!this.#componentElement) {
            this.#componentElement = KitRenderer.getComponentElement(this.componentId);
        }
        return this.#componentElement.querySelector(selector);
    }
}
