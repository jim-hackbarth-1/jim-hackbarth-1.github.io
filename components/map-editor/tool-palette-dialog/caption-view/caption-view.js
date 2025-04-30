
import { KitDependencyManager, KitRenderer } from "../../../../ui-kit.js";
import { Caption, FontVariantCap, PathStyle, PathStyleType } from "../../../../domain/references.js";

export function createModel() {
    return new CaptionViewModel();
}

export class CaptionViewModel {

    // event handlers
    async onRenderStart(componentId, modelInput) {
        this.componentId = componentId;
        this.mapItemTemplateViewModel = modelInput.mapItemTemplateViewModel;
        this.mapItemTemplate = modelInput.mapItemTemplate;
    }

    async onRenderComplete() {
        this.#loadLists();
    }

    onKeyDown(event) {
        event.stopPropagation();
    }

    onDetailsToggleEvent(event) {
        if (this.mapItemTemplateViewModel) {
            this.mapItemTemplateViewModel.onDetailsToggleEvent(event);
        }
    }

    // methods
    isVisible() {
        if (this.mapItemTemplate) {
            return true;
        }
        return false;
    }

    isDisabled() {
        if (this.mapItemTemplate?.ref) {
            return (this.mapItemTemplate.ref.isBuiltIn || this.mapItemTemplate.ref.isFromTemplate) ? "disabled" : null;
        }
        return "disabled";
    }

    getMapItemTemplateViewModel() {
        return this.mapItemTemplateViewModel;
    }

    getMapItemTemplate() {
        return this.mapItemTemplate;
    }

    getMapItemTemplateRef() {
        return this.mapItemTemplate?.ref;
    }

    getBackgroundFill() {
        return this.mapItemTemplate?.caption.backgroundFill;
    }

    hasBackgroundFill() {
        if (this.getBackgroundFill()) {
            return true;
        }
        return false
    }

    async addBackgroundFill() {
        const captionData = this.#getCaptionFromInput().getData();
        captionData.backgroundFill = {
            options: PathStyle.getOptionDefaults(PathStyleType.ColorFill)
        };
        await this.mapItemTemplateViewModel.updateCaption(new Caption(captionData));
    }

    getBorderStroke() {
        return this.mapItemTemplate?.caption.borderStroke;
    }

    hasBorderStroke() {
        if (this.getBorderStroke()) {
            return true;
        }
        return false
    }

    async addBorderStroke() {
        const captionData = this.#getCaptionFromInput().getData();
        captionData.borderStroke = {
            options: PathStyle.getOptionDefaults(PathStyleType.ColorStroke)
        };
        await this.mapItemTemplateViewModel.updateCaption(new Caption(captionData));
    }

    getValidationMessage(optionName) {
        return ""; // TODO: field validation
    }

    async updateCaption() {
        if (this.mapItemTemplateViewModel) {
            const caption = this.#getCaptionFromInput();
            await this.mapItemTemplateViewModel.updateCaption(caption);
        }
    }

    getDefaultText() {
        if (this.mapItemTemplate?.caption) {
            return this.mapItemTemplate.caption.defaultText;
        }
        return "";
    }

    getFontColor() {
        if (this.mapItemTemplate?.caption) {
            return this.mapItemTemplate.caption.fontColor;
        }
        return "#000000";
    }

    getFontOutlineColor() {
        if (this.mapItemTemplate?.caption) {
            return this.mapItemTemplate.caption.fontOutlineColor;
        }
        return "#000000";
    }

    getOpacity() {
        if (this.mapItemTemplate?.caption) {
            return this.mapItemTemplate.caption.opacity * 100;
        }
        return 100;
    }

    getFont() {
        if (this.mapItemTemplate?.caption) {
            return this.mapItemTemplate.caption.font;
        }
        return "sans-serif";
    }

    getFontVariantCaps() {
        if (this.mapItemTemplate?.caption) {
            return this.mapItemTemplate.caption.fontVariantCaps;
        }
        return "normal";
    }

    #getCaptionFromInput() {
        let backgroundFill = null;
        let borderStroke = null;
        if (this.mapItemTemplate.caption.backgroundFill) {
            backgroundFill = this.mapItemTemplate.caption.backgroundFill.getData();
        }
        if (this.mapItemTemplate.caption.borderStroke) {
            borderStroke = this.mapItemTemplate.caption.borderStroke.getData();
        }
        return new Caption({
            defaultText: this.#getElement("#map-item-template-caption-defaultText").value,
            fontColor: this.#getElement("#map-item-template-caption-fontColor").value,
            fontOutlineColor: this.#getElement("#map-item-template-caption-fontOutlineColor").value,
            textShadow: {
                color: this.#getElement("#map-item-template-caption-textShadow-Color").value,
                blur: parseInt(this.#getElement("#map-item-template-caption-textShadow-Blur").value),
                offsetX: parseInt(this.#getElement("#map-item-template-caption-textShadow-Offset-X").value),
                offsetY: parseInt(this.#getElement("#map-item-template-caption-textShadow-Offset-Y").value)
            },
            opacity: parseInt(this.#getElement("#map-item-template-caption-opacity").value) / 100,
            font: this.#getElement("#map-item-template-caption-font").value,
            fontVariantCaps: this.#getElement("#map-item-template-caption-fontVariantCaps").value,
            backgroundFill: backgroundFill,
            borderStroke: borderStroke,
            shadow: {
                color: this.#getElement("#map-item-template-caption-shadow-Color").value,
                blur: parseInt(this.#getElement("#map-item-template-caption-shadow-Blur").value),
                offsetX: parseInt(this.#getElement("#map-item-template-caption-shadow-Offset-X").value),
                offsetY: parseInt(this.#getElement("#map-item-template-caption-shadow-Offset-Y").value)
            },
        });
    }

    #componentElement;
    #getElement(selector) {
        if (!this.#componentElement) {
            this.#componentElement = KitRenderer.getComponentElement(this.componentId);
        }
        return this.#componentElement.querySelector(selector);
    }

    #getElements(selector) {
        if (!this.#componentElement) {
            this.#componentElement = KitRenderer.getComponentElement(this.componentId);
        }
        return this.#componentElement.querySelectorAll(selector);
    }

    #loadLists() {
        const appDocument = KitDependencyManager.getDocument();
        const variantCapsList = [
            { value: FontVariantCap.Normal, label: "Normal" },
            { value: FontVariantCap.SmallCaps, label: "Small caps" },
            { value: FontVariantCap.AllSmallCaps, label: "All small caps" },
            { value: FontVariantCap.PetiteCaps, label: "Petite caps (smaller than small caps)" },
            { value: FontVariantCap.AllPetiteCaps, label: "All petite caps (smaller than small caps)" },
            { value: FontVariantCap.Unicase, label: "Unicase" },
            { value: FontVariantCap.TitlingCaps, label: "Titling caps" },
        ];
        this.#loadList(appDocument, "map-item-template-caption-fontVariantCaps", variantCapsList, this.getFontVariantCaps());
    }

    #loadList(appDocument, elementId, list, selectedValue) {
        const selectElement = this.#getElement(`#${elementId}`);
        if (selectElement) {
            for (const item of list) {
                const option = appDocument.createElement("option");
                option.value = item.value;
                option.title = item.label;
                option.innerHTML = item.label;
                option.selected = (item.value == selectedValue);
                selectElement.appendChild(option);
            }
        }
    }
}
