
import { KitMessenger, KitRenderer } from "../../../../ui-kit.js";
import {
    BaseFill,
    ChangeSet,
    ChangeType,
    ColorFill,
    EntityReference,
    GradientFill,
    GradientType,
    ImageArrayFill,
    InputUtilities,
    MapWorkerClient,
    MapWorkerInputMessageType,
    TileFill
} from "../../../../domain/references.js";
import { EditorModel } from "../../editor/editor.js";

export function createModel() {
    return new FillViewModel();
}

export class FillViewModel {

    // event handlers
    async onRenderStart(componentId, modelInput) {
        this.componentId = componentId;
        this.mapItemTemplateRef = modelInput?.mapItemTemplateRef;
        this.fillId = null;
        this.fill = null;
        if (modelInput?.fill) {
            this.fillId = modelInput.fill.id;
            this.fill = await this.#getFill();
        }
        this.isForCaption = modelInput.isForCaption;
        this.validationResult = {
            isValid: false
        };
    }

    async onRenderComplete() {
        KitMessenger.subscribe(EditorModel.MapUpdatedNotificationTopic, this.componentId, this.onMapUpdated.name);
    }

    async onMapUpdated(message) {
        if (this.fill) {
            let reRender = false;
            if (message?.data?.changeSet?.changes) {
                const fillTypes = [
                    BaseFill.name,
                    ColorFill.name,
                    GradientFill.name,
                    TileFill.name,
                    ImageArrayFill.name
                ];
                const fillChange = message.data.changeSet.changes.some(c => fillTypes.includes(c.changeObjectType));
                reRender = fillChange;
            }
            if (reRender) {
                this.fill = await this.#getFill();
                await this.#reRenderElement("if-fill-visible");
            }
        }
    }

    onKeyDown(event) {
        event.stopPropagation();
    }

    // methods
    isDisabled() {
        if (this.mapItemTemplateRef) {
            return (this.mapItemTemplateRef.isBuiltIn || this.mapItemTemplateRef.isFromTemplate) ? "disabled" : null;
        }
        return "disabled";
    }

    getFillType() {
        if (this.fill?.color) {
            return ColorFill.name;
        }
        if (this.fill?.gradientType) {
            return GradientFill.name;
        }
        if (this.fill?.imageSrc) {
            return TileFill.name;
        }
        if (this.fill?.imageSources) {
            return ImageArrayFill.name;
        }
        return null;
    }

    isGradientTypeChecked(gradientType, matchingGradientType) {
        if (gradientType == matchingGradientType) {
            return "checked";
        }
        return null;
    }

    async updateProperty(elementId) {
        const originalFill = (await this.#getFill()).getData();
        this.#update();
        this.validationResult = await this.#validate();
        if (this.validationResult.isValid) {
            const componentElement = KitRenderer.getComponentElement(this.componentId);
            let element = componentElement.querySelector(`#${elementId}`);
            let propertyName = null;
            let oldValue = null;
            let newValue = null;
            let changeObjectType = null;
            // TODO: color stops
            // TODO: image sources
            switch (elementId) {
                //case "fill-opacity":
                //    propertyName = "opacity";
                //    oldValue = originalFill.opacity;
                //    newValue = parseInt(element.value);
                //    changeObjectType = BaseFill.name;
                //    break;
                case "fill-color":
                    propertyName = "color";
                    oldValue = originalFill.color;
                    newValue = InputUtilities.cleanseString(element.value.trim());
                    changeObjectType = ColorFill.name;
                    break;
                case "fill-gradient-type-linear":
                    propertyName = "gradientType";
                    oldValue = originalFill.gradientType;
                    newValue = GradientType.LinearGradient;
                    changeObjectType = GradientFill.name;
                    break;
                case "fill-gradient-type-radial":
                    propertyName = "gradientType";
                    oldValue = originalFill.gradientType;
                    newValue = GradientType.RadialGradient;
                    changeObjectType = GradientFill.name;
                    break;
                case "fill-image-source":
                    propertyName = "imageSrc";
                    oldValue = originalFill.imageSrc;
                    newValue = InputUtilities.cleanseString(element.value.trim());
                    changeObjectType = TileFill.name;
                    break;
                case "fill-image-array-offset-x":
                    propertyName = "offsetX";
                    oldValue = originalFill.offsetX;
                    newValue = parseInt(element.value);
                    changeObjectType = ImageArrayFill.name;
                    break;
                case "fill-image-array-offset-y":
                    propertyName = "offsetY";
                    oldValue = originalFill.offsetY;
                    newValue = parseInt(element.value);
                    changeObjectType = ImageArrayFill.name;
                    break;
            }
            if (propertyName) {
                const changes = [
                    {
                        changeType: ChangeType.Edit,
                        changeObjectType: changeObjectType,
                        propertyName: propertyName,
                        oldValue: oldValue,
                        newValue: newValue,
                        mapItemTemplateRef: this.mapItemTemplateRef.getData(),
                        fillId: this.fill.id
                    }
                ];
                await this.#updateMap(changes);
            }
        }
        else {
            await this.#reRenderElement("if-fill-visible");
        }
    }

    // helpers
    async #getFill() {
        const map = await MapWorkerClient.getMap();
        const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, this.mapItemTemplateRef));
        if (mapItemTemplate) {
            if (this.isForCaption) {
                return mapItemTemplate.caption.backgroundFill;
            }
            else {
                return mapItemTemplate.fills.find(f => f.id == this.fillId);
            }
        }
        return null;
    }

    #update() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        //this.fill.opacity = parseInt(componentElement.querySelector("#fill-opacity").value);
        if (this.fill.color) {
            this.fill.color = InputUtilities.cleanseString(componentElement.querySelector("#fill-color").value.trim());
        }
        if (this.fill.gradientType) {
            if (componentElement.querySelector("#fill-gradient-type-linear").checked) {
                this.fill.gradientType = GradientType.LinearGradient;
            }
            else {
                this.fill.gradientType = GradientType.RadialGradient;
            }
        }
        //if (this.fill.imageSrc) {
        //    this.fill.imageSrc = InputUtilities.cleanseString(componentElement.querySelector("#fill-image-source").value.trim());
        //}
        //if (this.fill.imageSources) {
        //    this.fill.offsetX = parseInt(componentElement.querySelector("#fill-image-array-offset-x").value);
        //    this.fill.offsetY = parseInt(componentElement.querySelector("#fill-image-array-offset-y").value);
        //}
    }

    async #validate() {
        const validationResult = {
            isValid: false
        };
        const map = await MapWorkerClient.getMap();
        if (this.fill) {

            // TODO: field validation
            validationResult.isValid = true;
        }
        return validationResult;
    }

    async #reRenderElement(elementId) {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        if (componentElement) {
            const element = componentElement.querySelector(`#${elementId}`);
            const componentId = element.getAttribute("data-kit-component-id");
            await KitRenderer.renderComponent(componentId);
        }
    }

    async #updateMap(changes) {

        // update local copy
        const map = await MapWorkerClient.getMap();
        map.applyChangeSet(new ChangeSet({ changes: changes }));

        // update map worker
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }
}
