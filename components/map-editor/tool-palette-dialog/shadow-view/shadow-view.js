
import { KitDependencyManager, KitRenderer } from "../../../../ui-kit.js";
import { RenderingOrder } from "../../../../domain/references.js";
import { DomHelper } from "../../../shared/dom-helper.js";

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

    async onRenderComplete() {
        this.#loadLists();
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

    isForCaption() {
        return this.isCaptionShadow || this.isCaptionTextShadow;
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

        const color = DomHelper.getElement(this.#componentElement, "#shadow-color")?.value;
        if (!color || !color.match(/^#[0-9a-f]{6}/i)) {
            DomHelper.getElement(this.#componentElement, "#validation-shadow-color").innerHTML = "Valid hex color value (e.g. '#c0c0c0') required.";
            isValid = false;
        }

        const blur = parseInt(DomHelper.getElement(this.#componentElement, "#shadow-blur")?.value);
        if (isNaN(blur) || blur < 0 || blur > 100) {
            DomHelper.getElement(this.#componentElement, "#validation-shadow-blur").innerHTML = "Valid number between 0 and 100 required.";
            isValid = false;
        }

        const offsetX = parseInt(DomHelper.getElement(this.#componentElement, "#shadow-offset-x")?.value);
        if (isNaN(offsetX) || offsetX < -100 || offsetX > 100) {
            DomHelper.getElement(this.#componentElement, "#validation-shadow-offset-x").innerHTML = "Valid number between -100 and 100 required.";
            isValid = false;
        }

        const offsetY = parseInt(DomHelper.getElement(this.#componentElement, "#shadow-offset-y")?.value);
        if (isNaN(offsetY) || offsetY < -100 || offsetY > 100) {
            DomHelper.getElement(this.#componentElement, "#validation-shadow-offset-y").innerHTML = "Valid number between -100 and 100 required.";
            isValid = false;
        }

        const renderingOrder = DomHelper.getElement(this.#componentElement, "#shadow-rendering-order")?.value ?? RenderingOrder.BelowStrokes;

        return {
            isValid: isValid,
            color: color,
            blur: blur,
            offsetX: offsetX,
            offsetY: offsetY,
            renderingOrder: renderingOrder
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

    #loadLists() {
        const renderingOrderList = [
            { value: RenderingOrder.BelowStrokes, label: "Below strokes (default)" },
            { value: RenderingOrder.AboveStrokes, label: "Above strokes" }
        ];
        const shadow = this.#getShadow();
        const selectedRenderingOrder = shadow?.renderingOrder ?? RenderingOrder.BelowStrokes;
        const selectElement = DomHelper.getElement(this.#componentElement, "#shadow-rendering-order");
        if (selectElement) {
            const appDocument = KitDependencyManager.getDocument();
            for (const renderingOrder of renderingOrderList) {
                const option = appDocument.createElement("option");
                option.value = renderingOrder.value;
                option.title = renderingOrder.label;
                option.innerHTML = renderingOrder.label;
                option.selected = (renderingOrder.value == selectedRenderingOrder);
                selectElement.appendChild(option);
            }
        }
    }
}
