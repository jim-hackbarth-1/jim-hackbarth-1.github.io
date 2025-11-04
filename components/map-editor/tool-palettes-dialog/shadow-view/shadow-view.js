
import {
    ChangeType,
    EntityReference,
    MapItemTemplate,
    MapWorkerClient,
    MapWorkerInputMessageType,
    Shadow
} from "../../../../domain/references.js";
import { ToolPalettesDialogModel } from "../tool-palettes-dialog.js";

export function createModel() {
    return new ShadowViewModel();
}

class ShadowViewModel {

    // event handlers
    async init(kitElement, kitObjects) {
        this.#kitElement = kitElement;
        ShadowViewModel.#dialogModel = kitObjects.find(o => o.alias == "dialogModel")?.object;
        ShadowViewModel.#map = await MapWorkerClient.getMap();
        const parts = ShadowViewModel.#dialogModel.getSelectedDetailComponentInfo().id.split("-");
        ShadowViewModel.#shadowType = parts[0];
        const mapItemTemplateRef = ToolPalettesDialogModel.deSerializeRef(parts[1]);
        ShadowViewModel.#mapItemTemplate
            = ShadowViewModel.#map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, mapItemTemplateRef));
        ShadowViewModel.#shadow = null;
        if (ShadowViewModel.#shadowType == "shadow") {
            ShadowViewModel.#shadow = ShadowViewModel.#mapItemTemplate.shadow;
        }
        if (ShadowViewModel.#shadowType == "caption.shadow") {
            ShadowViewModel.#shadow = ShadowViewModel.#mapItemTemplate.caption.shadow;
        }
        if (ShadowViewModel.#shadowType == "caption.text.shadow") {
            ShadowViewModel.#shadow = ShadowViewModel.#mapItemTemplate.caption.textShadow;
        }
    }

    // methods
    getTitle() {
        let title = "Shadow";
        if (ShadowViewModel.#shadowType == "caption.shadow") {
            title = "Caption shadow";
        }
        if (ShadowViewModel.#shadowType == "caption.text.shadow") {
            title = "Caption text shadow";
        }
        return title;
    }

    getMapItemTemplateName() {
        const name = ShadowViewModel.#mapItemTemplate.ref.name;
        return name.length > 25 ? name.slice(0, 25) + "..." : name;
    }

    async editMapItemTemplate() {
        const refId = ToolPalettesDialogModel.serializeRef(ShadowViewModel.#mapItemTemplate.ref);
        await ShadowViewModel.#dialogModel.selectNavItemByRefId(`map.item.template-${refId}`);
    }

    isFromTemplate() {
        return ShadowViewModel.#mapItemTemplate.ref.isFromTemplate;
    }

    async saveShadow() {
        const validationResult = this.#validate();
        if (validationResult.isValid) {
            const currentShadow = ShadowViewModel.#shadow;
            const updatedShadow = new Shadow(validationResult.shadowData).getData();
            if (JSON.stringify(currentShadow) != JSON.stringify(updatedShadow)) {
                let propertyName = "shadow";
                let oldValue = currentShadow.getData();
                let newValue = updatedShadow;
                if (ShadowViewModel.#shadowType.startsWith("caption.")) {
                    oldValue = ShadowViewModel.#mapItemTemplate.caption.getData();
                    propertyName = "caption";
                    newValue = oldValue;
                    if (ShadowViewModel.#shadowType == "caption.shadow") {
                        newValue.shadow = updatedShadow;
                    }
                    else {
                        newValue.textShadow = updatedShadow;
                    }
                }
                const changes = [
                    {
                        changeType: ChangeType.Edit,
                        changeObjectType: MapItemTemplate.name,
                        propertyName: propertyName,
                        oldValue: oldValue,
                        newValue: newValue,
                        mapItemTemplateRef: ShadowViewModel.#mapItemTemplate.ref.getData()
                    }
                ]
                MapWorkerClient.postWorkerMessage({
                    messageType: MapWorkerInputMessageType.UpdateMap,
                    changeSet: { changes: changes }
                });
            }
        }
    }

    getColor() {
        return ShadowViewModel.#shadow.color;
    }

    getBlur() {
        return ShadowViewModel.#shadow.blur;
    }

    getOffsetX() {
        return ShadowViewModel.#shadow.offsetX;
    }

    getOffsetY() {
        return ShadowViewModel.#shadow.offsetY;
    }

    getRenderingOrder() {
        return ShadowViewModel.#shadow.renderingOrder;
    }

    validate() {
        this.#validate();
    }

    // helpers
    static #dialogModel = null;
    #kitElement = null;
    static #map = null;
    static #mapItemTemplate = null;
    static #shadowType = null;
    static #shadow = null;

    #validate() {
        let isValid = true;
        const validationLabels = this.#kitElement.querySelectorAll(".validation-message");
        for (const label of validationLabels) {
            label.classList.remove("active");
            label.innerHTML = "";
        }

        const color = this.#kitElement.querySelector("#shadow-color").getAttribute("value");
        if (!color || !color.match(/^#[0-9a-f]{6}/i)) {
            this.#showValidationMessage("#shadow-color-validation", "Valid hex color value (e.g. '#c0c0c0') required.");
            isValid = false;
        }

        const blur = parseInt(this.#kitElement.querySelector("#shadow-blur").value);
        if (isNaN(blur)) {
            this.#showValidationMessage("#shadow-blur-validation", "Blur is required.");
            isValid = false;
        }
        if (blur < 0 || blur > 100) {
            this.#showValidationMessage("#shadow-blur-validation", "Blur must be an integer between 0 and 100.");
            isValid = false;
        }

        const offsetX = parseInt(this.#kitElement.querySelector("#shadow-offset-x").value);
        const offsetY = parseInt(this.#kitElement.querySelector("#shadow-offset-y").value);
        if (isNaN(offsetX) || isNaN(offsetY)) {
            this.#showValidationMessage("#shadow-offset-validation", "Offset x and y values are required.");
            isValid = false;
        }
        if (offsetX < -100 || offsetX > 100 || offsetY < -100 || offsetY > 100) {
            this.#showValidationMessage("#shadow-offset-validation", "Offset x and y values must be integers between -100 and 100.");
            isValid = false;
        }

        const renderingOrder = this.#kitElement.querySelector("#shadow-rendering-order").value;
        if (!renderingOrder) {
            this.#showValidationMessage("#shadow-rendering-order-validation", "Rendering order is required.");
            isValid = false;
        }

        // enable/disable save button
        const enabled = (isValid && !this.isFromTemplate());
        this.#kitElement.querySelector("#save-button").disabled = !enabled;

        return {
            isValid: isValid,
            shadowData: {
                color: color,
                blur: blur,
                offsetX: offsetX,
                offsetY: offsetY,
                renderingOrder: renderingOrder
            }
        };
    }

    #showValidationMessage(selector, message) {
        const element = this.#kitElement.querySelector(selector);
        element.innerHTML = message;
        element.classList.add("active");
        element.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
}
