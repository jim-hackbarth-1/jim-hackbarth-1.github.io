
import {
    Caption,
    ChangeType,
    EntityReference,
    MapItemTemplate,
    MapWorkerClient,
    MapWorkerInputMessageType,
    PathStyle,
    PathStyleType
} from "../../../../domain/references.js";
import { ToolPalettesDialogModel } from "../tool-palettes-dialog.js";

export function createModel() {
    return new CaptionViewModel();
}

class CaptionViewModel {

    // event handlers
    async init(kitElement, kitObjects) {
        this.#kitElement = kitElement;
        CaptionViewModel.#dialogModel = kitObjects.find(o => o.alias == "dialogModel")?.object;
        CaptionViewModel.#map = await MapWorkerClient.getMap();
        const parts = CaptionViewModel.#dialogModel.getSelectedDetailComponentInfo().id.split("-");
        const mapItemTemplateRef = ToolPalettesDialogModel.deSerializeRef(parts[1]);
        CaptionViewModel.#mapItemTemplate
            = CaptionViewModel.#map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, mapItemTemplateRef));
        CaptionViewModel.#caption = CaptionViewModel.#mapItemTemplate.caption;
    }

    // methods
    getTitle() {
        return "Caption";
    }

    getMapItemTemplateName() {
        const name = CaptionViewModel.#mapItemTemplate.ref.name;
        return name.length > 25 ? name.slice(0, 25) + "..." : name;
    }

    async editMapItemTemplate() {
        const refId = ToolPalettesDialogModel.serializeRef(CaptionViewModel.#mapItemTemplate.ref);
        await CaptionViewModel.#dialogModel.selectNavItemByRefId(`map.item.template-${refId}`);
    }

    isFromTemplate() {
        return CaptionViewModel.#mapItemTemplate.ref.isFromTemplate;
    }

    async saveCaption() {
        const validationResult = this.#validate();
        if (validationResult.isValid) {
            const currentCaption = CaptionViewModel.#caption;
            const updatedCaption = new Caption(validationResult.captionData).getData();
            if (JSON.stringify(currentCaption) != JSON.stringify(updatedCaption)) {
                const changes = [
                    {
                        changeType: ChangeType.Edit,
                        changeObjectType: MapItemTemplate.name,
                        propertyName: "caption",
                        oldValue: currentCaption.getData(),
                        newValue: updatedCaption,
                        mapItemTemplateRef: CaptionViewModel.#mapItemTemplate.ref.getData()
                    }
                ]
                MapWorkerClient.postWorkerMessage({
                    messageType: MapWorkerInputMessageType.UpdateMap,
                    changeSet: { changes: changes }
                });
            }
        }
    }

    getDefaultText() {
        return CaptionViewModel.#caption.defaultText;
    }

    getOpacity() {
        const opacity = CaptionViewModel.#caption.opacity;
        return (opacity ?? 1) * 100;
    }

    getFont() {
        return CaptionViewModel.#caption.font;
    }

    getFontVariantCaps() {
        return CaptionViewModel.#caption.fontVariantCaps;
    }

    getColor() {
        return CaptionViewModel.#caption.fontColor;
    }

    getOutlineColor() {
        return CaptionViewModel.#caption.fontOutlineColor;
    }

    validate() {
        this.#validate();
    }

    async editBackground() {
        const backgroundFill = CaptionViewModel.#caption.backgroundFill;
        if (backgroundFill) {
            const refId = ToolPalettesDialogModel.serializeRef(CaptionViewModel.#mapItemTemplate.ref);
            await CaptionViewModel.#dialogModel.selectNavItemByRefId(`caption.background-${refId}`);
        }
        else {
            const pathStyle = new PathStyle({
                options: PathStyle.getOptionDefaults(PathStyleType.ColorFill)
            });
            const oldValue = CaptionViewModel.#caption.getData();
            const newValue = CaptionViewModel.#caption.getData();
            newValue.backgroundFill = pathStyle.getData();
            const changes = [
                {
                    changeType: ChangeType.Edit,
                    changeObjectType: MapItemTemplate.name,
                    propertyName: "caption",
                    oldValue: oldValue,
                    newValue: newValue,
                    mapItemTemplateRef: CaptionViewModel.#mapItemTemplate.ref.getData()
                }
            ]
            MapWorkerClient.postWorkerMessage({
                messageType: MapWorkerInputMessageType.UpdateMap,
                changeSet: { changes: changes }
            });
        }
    }

    async editBorder() {
        const borderStroke = CaptionViewModel.#caption.borderStroke;
        if (borderStroke) {
            const refId = ToolPalettesDialogModel.serializeRef(CaptionViewModel.#mapItemTemplate.ref);
            await CaptionViewModel.#dialogModel.selectNavItemByRefId(`caption.border-${refId}`);
        }
        else {
            const pathStyle = new PathStyle({
                options: PathStyle.getOptionDefaults(PathStyleType.ColorStroke)
            });
            const oldValue = CaptionViewModel.#caption.getData();
            const newValue = CaptionViewModel.#caption.getData();
            newValue.borderStroke = pathStyle.getData();
            const changes = [
                {
                    changeType: ChangeType.Edit,
                    changeObjectType: MapItemTemplate.name,
                    propertyName: "caption",
                    oldValue: oldValue,
                    newValue: newValue,
                    mapItemTemplateRef: CaptionViewModel.#mapItemTemplate.ref.getData()
                }
            ]
            MapWorkerClient.postWorkerMessage({
                messageType: MapWorkerInputMessageType.UpdateMap,
                changeSet: { changes: changes }
            });
        }
    }

    async editShadow() {
        const refId = ToolPalettesDialogModel.serializeRef(CaptionViewModel.#mapItemTemplate.ref);
        await CaptionViewModel.#dialogModel.selectNavItemByRefId(`caption.shadow-${refId}`);
    }

    async editTextShadow() {
        const refId = ToolPalettesDialogModel.serializeRef(CaptionViewModel.#mapItemTemplate.ref);
        await CaptionViewModel.#dialogModel.selectNavItemByRefId(`caption.text.shadow-${refId}`);
    }

    // helpers
    static #dialogModel = null;
    #kitElement = null;
    static #map = null;
    static #mapItemTemplate = null;
    static #caption = null;

    #validate() {
        let isValid = true;
        const validationLabels = this.#kitElement.querySelectorAll(".validation-message");
        for (const label of validationLabels) {
            label.innerHTML = "";
        }

        const defaultText = this.#kitElement.querySelector("#caption-default-text").value;
        if (defaultText && !defaultText.match(/^[a-zA-Z0-9\s()]*$/)) {
            this.#kitElement.querySelector("#caption-default-text-validation").innerHTML
                = "Invalid character(s). Alpha-numeric only.";
            isValid = false;
        }

        let opacity = parseInt(this.#kitElement.querySelector("#caption-opacity").value);
        if (isNaN(opacity)) {
            this.#showValidationMessage(
                "#caption-opacity-validation",
                "Opacity is required.");
            isValid = false;
        }
        if (opacity < 0 || opacity > 100) {
            this.#showValidationMessage(
                "#caption-opacity-validation",
                "Opacity must be an integer between 0 and 100.");
            isValid = false;
        }
        opacity = opacity / 100;

        const font = this.#kitElement.querySelector("#caption-font").value;
        if (!font || font.length == 0) {
            this.#showValidationMessage(
                "#caption-font-validation",
                "Valid font string required.");
            isValid = false;
        }
        if (font && CaptionViewModel.#containsHtml(font)) {
            this.#kitElement.querySelector("#caption-font-validation").innerHTML
                = "Invalid character(s). &amp;, &lt;, &gt;, &apos;, and &quot; are not allowed.";
            isValid = false;
        }

        const fontVariantCaps = this.#kitElement.querySelector("#caption-font-variant-caps").value;
        if (!fontVariantCaps || fontVariantCaps.length == 0) {
            this.#showValidationMessage(
                "#caption-font-variant-caps-validation",
                "Valid font caps selection required.");
            isValid = false;
        }

        const fontColor = this.#kitElement.querySelector("#caption-color").getAttribute("value");
        if (!fontColor || !fontColor.match(/^#[0-9a-f]{6}/i)) {
            this.#showValidationMessage(
                "#caption-color-validation",
                "Valid hex color value (e.g. '#c0c0c0') required.");
            isValid = false;
        }

        const fontOutlineColor = this.#kitElement.querySelector("#caption-outline-color").getAttribute("value");
        if (!fontOutlineColor || !fontOutlineColor.match(/^#[0-9a-f]{6}/i)) {
            this.#showValidationMessage(
                "#caption-outline-color-validation",
                "Valid hex color value (e.g. '#c0c0c0') required.");
            isValid = false;
        }

        let backgroundFill = CaptionViewModel.#caption.backgroundFill;
        if (backgroundFill) {
            backgroundFill = backgroundFill.getData();
        }
        let borderStroke = CaptionViewModel.#caption.borderStroke;
        if (borderStroke) {
            borderStroke = borderStroke.getData();
        }
        const shadow = CaptionViewModel.#caption.shadow.getData();
        const textShadow = CaptionViewModel.#caption.textShadow.getData();

        // enable/disable save button
        const enabled = (isValid && !this.isFromTemplate());
        this.#kitElement.querySelector("#save-button").disabled = !enabled;

        return {
            isValid: isValid,
            captionData: {
                defaultText: defaultText,
                opacity: opacity,
                font: font,
                fontVariantCaps: fontVariantCaps,
                fontColor: fontColor,
                fontOutlineColor: fontOutlineColor,
                backgroundFill: backgroundFill,
                borderStroke: borderStroke,
                shadow: shadow,
                textShadow: textShadow
            }
        };
    }

    #showValidationMessage(selector, message) {
        const element = this.#kitElement.querySelector(selector);
        element.innerHTML = message;
        element.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    static #containsHtml(string) {
        return string.includes("&")
            || string.includes("<")
            || string.includes(">")
            || string.includes("'")
            || string.includes('"');
    }
}
