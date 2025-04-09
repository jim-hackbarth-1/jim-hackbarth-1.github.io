
import { KitMessenger, KitRenderer } from "../../../../ui-kit.js";
import {
    BaseStroke,
    ChangeSet,
    ChangeType,
    ColorStroke,
    EntityReference,
    GradientStroke,
    GradientType,
    ImageArrayStroke,
    InputUtilities,
    MapWorkerClient,
    MapWorkerInputMessageType,
    TileStroke
} from "../../../../domain/references.js";
import { EditorModel } from "../../editor/editor.js";

export function createModel() {
    return new StrokeViewModel();
}

export class StrokeViewModel {

    // event handlers
    async onRenderStart(componentId, modelInput) {
        this.componentId = componentId;
        this.mapItemTemplateRef = modelInput?.mapItemTemplateRef;
        this.strokeId = null;
        this.stroke = null;
        if (modelInput?.stroke) {
            this.strokeId = modelInput.stroke.id;
            this.stroke = await this.#getStroke();
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
                const strokeTypes = [
                    BaseStroke.name,
                    ColorStroke.name,
                    GradientStroke.name,
                    TileStroke.name,
                    ImageArrayStroke.name
                ];
                const strokeChange = message.data.changeSet.changes.some(c => strokeTypes.includes(c.changeObjectType));
                reRender = strokeChange;
            }
            if (reRender) {
                this.stroke = await this.#getStroke();
                await this.#reRenderElement("if-stroke-visible");
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

    getStrokeType() {
        if (this.stroke?.color) {
            return ColorStroke.name;
        }
        if (this.stroke?.gradientType) {
            return GradientStroke.name;
        }
        if (this.stroke?.imageSrc) {
            return TileStroke.name;
        }
        if (this.stroke?.imageSources) {
            return ImageArrayStroke.name;
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
        const originalStroke = (await this.#getStroke()).getData();
        this.#update();
        this.validationResult = await this.#validate();
        if (this.validationResult.isValid) {
            const componentElement = KitRenderer.getComponentElement(this.componentId);
            let element = componentElement.querySelector(`#${elementId}`);
            let propertyName = null;
            let oldValue = null;
            let newValue = null;
            let changeObjectType = null;
            switch (elementId) {
                case "stroke-width":
                    propertyName = "width";
                    oldValue = originalStroke.width;
                    newValue = parseInt(element.value);
                    changeObjectType = BaseStroke.name;
                    break;
                case "stroke-color":
                    propertyName = "color";
                    oldValue = originalStroke.color;
                    newValue = InputUtilities.cleanseString(element.value.trim());
                    changeObjectType = ColorStroke.name;
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
                        strokeId: this.stroke.id
                    }
                ];
                await this.#updateMap(changes);
            }
        }
        else {
            await this.#reRenderElement("if-stroke-visible");
        }
    }

    // helpers
    async #getStroke() {
        const map = await MapWorkerClient.getMap();
        const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, this.mapItemTemplateRef));
        if (mapItemTemplate) {
            if (this.isForCaption) {
                return mapItemTemplate.caption.borderStroke;
            }
            else {
                return mapItemTemplate.strokes.find(s => s.id == this.strokeId);
            }
        }
        return null;
    }

    #update() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        this.stroke.width = parseInt(componentElement.querySelector("#stroke-width").value);
        if (this.stroke.color) {
            this.stroke.color = InputUtilities.cleanseString(componentElement.querySelector("#stroke-color").value.trim());
        }
    }

    async #validate() {
        const validationResult = {
            isValid: false
        };
        const map = await MapWorkerClient.getMap();
        if (this.stroke) {

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
