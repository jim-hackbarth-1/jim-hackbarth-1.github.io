
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

    getIdPrefix() {
        let prefix = "map-item-template-shadow";
        if (this.isCaptionTextShadow) {
            prefix = "map-item-template-caption-textShadow"
        }
        if (this.isCaptionShadow) {
            prefix = "map-item-template-caption-shadow"
        }
        return prefix
    }

    getValidationMessage(optionName) {
        return ""; // TODO: field valiation
    }

    async updateShadow() {    
        if ((this.isCaptionTextShadow || this.isCaptionShadow) && this.captionViewModel) {
            await this.captionViewModel.updateCaption();
            return;
        }
        if (this.mapItemTemplateViewModel) {
            const shadow = this.#getShadowFromInput();
            await this.mapItemTemplateViewModel.updateShadow(shadow);
        }
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
