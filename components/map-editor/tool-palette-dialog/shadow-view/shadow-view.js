
import { KitRenderer } from "../../../../ui-kit.js";
import { Shadow } from "../../../../domain/references.js";

export function createModel() {
    return new ShadowViewModel();
}

export class ShadowViewModel {

    // event handlers
    async onRenderStart(componentId, modelInput) {
        this.componentId = componentId;
        this.mapItemTemplateViewModel = modelInput.mapItemTemplateViewModel;
        this.forCaption = modelInput.forCaption;
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

    getIdPrefix() {
        let prefix = "map-item-template-shadow";
        if (this.forCaption) {
            prefix = "map-item-template-caption-shadow"
        }
        return prefix
    }

    getValidationMessage(optionName) {
        return ""; // TODO: field valiation
    }

    async updateShadow() {
        if (this.mapItemTemplateViewModel) {
            const shadow = this.#getShadowFromInput();
            await this.mapItemTemplateViewModel.updateShadow(shadow);
        }
    }

    getColor() {
        if (this.mapItemTemplate?.shadow) {
            return this.mapItemTemplate.shadow.color;
        }
        return "#000000";
    }

    getBlur() {
        if (this.mapItemTemplate?.shadow) {
            return this.mapItemTemplate.shadow.blur;
        }
        return 0;
    }

    getOffset() {
        if (this.mapItemTemplate?.shadow) {
            return {
                x: this.mapItemTemplate.shadow.offsetX,
                y: this.mapItemTemplate.shadow.offsetY
            };
        }
        return { x: 0, y: 0 };
    }

    #getShadowFromInput() {
        const prefix = this.getIdPrefix();
        return new Shadow({
            color: this.#getElement(`#${prefix}-Color`).value,
            blur: parseInt(this.#getElement(`#${prefix}-Blur`).value),
            offsetX: parseInt(this.#getElement(`#${prefix}-Offset-X`).value),
            offsetY: parseInt(this.#getElement(`#${prefix}-Offset-Y`).value)
        });
    }

    #componentElement;
    #getElement(selector) {
        if (!this.#componentElement) {
            this.#componentElement = KitRenderer.getComponentElement(this.componentId);
        }
        return this.#componentElement.querySelector(selector);
    }
}
