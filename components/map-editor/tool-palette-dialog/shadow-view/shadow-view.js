
import { KitRenderer } from "../../../../ui-kit.js";

export function createModel() {
    return new ShadowViewModel();
}

export class ShadowViewModel {

    // event handlers
    async onRenderStart(componentId, modelInput) {
        this.componentId = componentId;
        this.mapItemTemplateViewModel = modelInput.mapItemTemplateViewModel;
        this.captionViewModel = modelInput.captionViewModel;
        this.isCaptionTextShadow = modelInput.isCaptionTextShadow;
        this.isCaptionShadow = modelInput.isCaptionShadow;
        this.mapItemTemplate = modelInput.mapItemTemplate;
    }

    onKeyDown(event) {
        event.stopPropagation();
    }

    // methods
    isDisabled() {
        if (this.mapItemTemplate?.ref) {
            return (this.mapItemTemplate.ref.isBuiltIn || this.mapItemTemplate.ref.isFromTemplate) ? "disabled" : null;
        }
        return "disabled";
    }

    getColor() {
        return this.#getShadow()?.color ?? "#000000";
    }

    getBlur() {
        return this.#getShadow()?.blur ?? 0;
    }

    getOffset() {
        const offsetX = this.#getShadow()?.offsetX;
        const offsetY = this.#getShadow()?.offsetY;
        return { x: offsetX ?? 0, y: offsetY ?? 0 };
    }

    async update() {
        if (this.captionViewModel) {
            await this.captionViewModel.update();
            return;
        }
        if (this.mapItemTemplateViewModel) {
            await this.mapItemTemplateViewModel.update("shadow");
        }
    }

    validate() {
        let isValid = true;

        const color = this.#getElement("#shadow-color")?.value;
        if (!color || !color.match(/^#[0-9a-f]{6}/i)) {
            this.#getElement("#validation-shadow-color").innerHTML = "Valid hex color value (e.g. '#c0c0c0') required.";
            isValid = false;
        }

        const blur = parseInt(this.#getElement("#shadow-blur")?.value);
        if (isNaN(blur) || blur < 0 || blur > 100) {
            this.#getElement("#validation-shadow-blur").innerHTML = "Valid number between 0 and 100 required.";
            isValid = false;
        }

        const offsetX = parseInt(this.#getElement("#shadow-offset-x")?.value);
        if (isNaN(offsetX) || offsetX < -100 || offsetX > 100) {
            this.#getElement("#validation-shadow-offset-x").innerHTML = "Valid number between -100 and 100 required.";
            isValid = false;
        }

        const offsetY = parseInt(this.#getElement("#shadow-offset-y")?.value);
        if (isNaN(offsetY) || offsetY < -100 || offsetY > 100) {
            this.#getElement("#validation-shadow-offset-y").innerHTML = "Valid number between -100 and 100 required.";
            isValid = false;
        }

        return {
            isValid: isValid,
            color: color,
            blur: blur,
            offsetX: offsetX,
            offsetY: offsetY
        };
    }

    #componentElement;
    #getElement(selector) {
        if (!this.#componentElement) {
            this.#componentElement = KitRenderer.getComponentElement(this.componentId);
        }
        return this.#componentElement.querySelector(selector);
    }

    #getShadow() {
        let shadow = this.mapItemTemplate?.shadow;
        if (this.isCaptionTextShadow) {
            shadow = this.mapItemTemplate?.caption?.textShadow;
        }
        if (this.isCaptionShadow) {
            shadow = this.mapItemTemplate?.caption?.shadow;
        }
        return shadow;
    }
}
