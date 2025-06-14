﻿
import { KitComponent, KitDependencyManager , KitRenderer } from "../../../../ui-kit.js";
import {
    ChangeType,
    FontVariantCap,
    MapItemTemplate,
    MapWorkerClient,
    MapWorkerInputMessageType,
    PathStyle,
    PathStyleType
} from "../../../../domain/references.js";
import { ToolPaletteDialogModel } from "../tool-palette-dialog.js";
import { DomHelper } from "../../../shared/dom-helper.js";

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
    isDisabled() {
        if (this.mapItemTemplate?.ref) {
            return (this.mapItemTemplate.ref.isBuiltIn || this.mapItemTemplate.ref.isFromTemplate) ? "disabled" : null;
        }
        return "disabled";
    }

    getMapItemTemplate() {
        return this.mapItemTemplate;
    }

    getPathStyleInfo(isCaptionBackgroundFill, isCaptionBorderStroke) {
        return {
            mapItemTemplateRef: this.mapItemTemplate?.ref,
            captionViewModel: this,
            isCaptionBackgroundFill: isCaptionBackgroundFill,
            isCaptionBorderStroke: isCaptionBorderStroke
        };
    }

    hasBackgroundFill() {
        if (this.mapItemTemplate.caption.backgroundFill) {
            return true;
        }
        return false
    }

    async addBackgroundFill() {
        const oldValue = this.mapItemTemplate.caption.getData();
        const newValue = this.mapItemTemplate.caption.getData();
        newValue.backgroundFill = {
            options: PathStyle.getOptionDefaults(PathStyleType.ColorFill)
        };
        const changes = [
            {
                changeType: ChangeType.Edit,
                changeObjectType: MapItemTemplate.name,
                propertyName: "caption",
                oldValue: oldValue,
                newValue: newValue,
                mapItemTemplateRef: this.mapItemTemplate.ref.getData()
            }
        ];
        await this.#updateMap(changes);
    }

    hasBorderStroke() {
        if (this.mapItemTemplate.caption.borderStroke) {
            return true;
        }
        return false
    }

    async addBorderStroke() {
        const oldValue = this.mapItemTemplate.caption.getData();
        const newValue = this.mapItemTemplate.caption.getData();
        newValue.borderStroke = {
            options: PathStyle.getOptionDefaults(PathStyleType.ColorStroke)
        };
        const changes = [
            {
                changeType: ChangeType.Edit,
                changeObjectType: MapItemTemplate.name,
                propertyName: "caption",
                oldValue: oldValue,
                newValue: newValue,
                mapItemTemplateRef: this.mapItemTemplate.ref.getData()
            }
        ];
        await this.#updateMap(changes);
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

    async update() {
        const validationResult = this.validate();
        if (validationResult.isValid) {
            const oldValue = this.mapItemTemplate.caption.getData();
            const newValue = validationResult.captionData;
            const changes = [
                {
                    changeType: ChangeType.Edit,
                    changeObjectType: MapItemTemplate.name,
                    propertyName: "caption",
                    oldValue: oldValue,
                    newValue: newValue,
                    mapItemTemplateRef: this.mapItemTemplate.ref.getData(),
                }
            ];
            await this.#updateMap(changes);
        }
    }

    validate() {
        let isValid = true;

        const defaultText = DomHelper.getElement(this.#componentElement, "#caption-default-text")?.value

        const fontColor = DomHelper.getElement(this.#componentElement, "#caption-font-color")?.value;
        if (!fontColor || !fontColor.match(/^#[0-9a-f]{6}/i)) {
            DomHelper.getElement(this.#componentElement, "#validation-caption-font-color").innerHTML = "Valid hex color value (e.g. '#c0c0c0') required.";
            isValid = false;
        }

        const fontOutlineColor = DomHelper.getElement(this.#componentElement, "#caption-font-outline-color")?.value;
        if (!fontOutlineColor || !fontOutlineColor.match(/^#[0-9a-f]{6}/i)) {
            DomHelper.getElement(this.#componentElement, "#validation-caption-font-outline-color").innerHTML = "Valid hex color value (e.g. '#c0c0c0') required.";
            isValid = false;
        }

        const textShadowComponent = DomHelper.findComponentByElementId(this.#componentElement, "caption-text-shadow");
        const textShadowModel = textShadowComponent.model;
        const textShadowValidationResult = textShadowModel.validate();
        isValid = isValid && textShadowValidationResult.isValid;
        const textShadow = {
            color: textShadowValidationResult.color,
            blur: textShadowValidationResult.blur,
            offsetX: textShadowValidationResult.offsetX,
            offsetY: textShadowValidationResult.offsetY,
        }

        let opacity = parseInt(DomHelper.getElement(this.#componentElement, "#caption-font-opacity")?.value);
        if (isNaN(opacity) || opacity < 0 || opacity > 100) {
            DomHelper.getElement(this.#componentElement, "#validation-caption-font-opacity").innerHTML = "Valid number between 0 and 100 required.";
            isValid = false;
        }
        opacity = opacity / 100;

        const font = DomHelper.getElement(this.#componentElement, "#caption-font")?.value
        if (!font || font.length == 0) {
            DomHelper.getElement(this.#componentElement, "#validation-caption-font").innerHTML = "Valid font string required.";
            isValid = false;
        }

        const caps = DomHelper.getElement(this.#componentElement, "#caption-font-caps")?.value
        if (!caps || caps.length == 0) {
            DomHelper.getElement(this.#componentElement, "#validation-caption-font-caps").innerHTML = "Valid font caps selection required.";
            isValid = false;
        }

        const backgroundFillComponent = DomHelper.findComponentByElementId(this.#componentElement, "caption-background-fill");
        const backgroundFillModel = backgroundFillComponent.model;
        const backgroundFillValidationResult = backgroundFillModel.validate();
        isValid = isValid && backgroundFillValidationResult.isValid;
        let backgroundFill = null;
        if (backgroundFillValidationResult.options.length > 0) {
            backgroundFill = {
                options: backgroundFillValidationResult.options
            };
        }

        const borderStrokeComponent = DomHelper.findComponentByElementId(this.#componentElement, "caption-border-stroke");
        const borderStrokeModel = borderStrokeComponent.model;
        const borderStrokeValidationResult = borderStrokeModel.validate();
        isValid = isValid && borderStrokeValidationResult.isValid;
        let borderStroke = null;
        if (borderStrokeValidationResult.options.length > 0) {
            borderStroke = {
                options: borderStrokeValidationResult.options
            };
        }

        const captionShadowComponent = DomHelper.findComponentByElementId(this.#componentElement, "caption-shadow");
        const captionShadowModel = captionShadowComponent.model;
        const captionShadowValidationResult = captionShadowModel.validate();
        isValid = isValid && captionShadowValidationResult.isValid;
        const captionShadow = {
            color: captionShadowValidationResult.color,
            blur: captionShadowValidationResult.blur,
            offsetX: captionShadowValidationResult.offsetX,
            offsetY: captionShadowValidationResult.offsetY,
        }

        return {
            isValid: isValid,
            captionData: {
                defaultText: defaultText,
                opacity: opacity,
                font: font,
                fontColor: fontColor,
                fontVariantCaps: caps,
                fontOutlineColor: fontOutlineColor,
                textShadow: textShadow,
                backgroundFill: backgroundFill,
                borderStroke: borderStroke,
                shadow: captionShadow
            }
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

    #loadLists() {      
        const capsList = [
            { value: FontVariantCap.Normal, label: "Normal" },
            { value: FontVariantCap.SmallCaps, label: "Small caps" },
            { value: FontVariantCap.AllSmallCaps, label: "All small caps" },
            { value: FontVariantCap.PetiteCaps, label: "Petite caps (smaller than small caps)" },
            { value: FontVariantCap.AllPetiteCaps, label: "All petite caps (smaller than small caps)" },
            { value: FontVariantCap.Unicase, label: "Unicase" },
            { value: FontVariantCap.TitlingCaps, label: "Titling caps" },
        ];
        const selectedCap = this.getFontVariantCaps();
        const selectElement = DomHelper.getElement(this.#componentElement, "#caption-font-caps");
        if (selectElement) {
            const appDocument = KitDependencyManager.getDocument();
            for (const cap of capsList) {
                const option = appDocument.createElement("option");
                option.value = cap.value;
                option.title = cap.label;
                option.innerHTML = cap.label;
                option.selected = (cap.value == selectedCap);
                selectElement.appendChild(option);
            }
        }
    }

    async #updateMap(changes) {
        ToolPaletteDialogModel.saveScrollPosition();
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }
}
