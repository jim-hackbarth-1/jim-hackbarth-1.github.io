
import { ChangeEventType, ChangeType, EntityReference } from "../references.js";

export class MapItem {

    // constructor
    constructor(data) {
        if (data) {
            this.#pathData = data.pathData;
            this.#mapItemTemplateRef = data.mapItemTemplateRef;
            this.#z = data.z;
            this.#isHidden = data.isHidden;
            this.#isCaptionVisible = data.isCaptionVisible;
            this.#captionText = data.captionText;
            this.#captionLocation = data.captionLocation;
            this.#rotation = data.rotation;
        }
        this.#eventListeners = {};
    }

    // properties
    /** @type {string}  */
    #pathData;
    get pathData() {
        return this.#pathData;
    }
    set pathData(pathData) {
        if (!pathData) {
            throw new Error(ErrorMessage.NullValue);
        }
        this.#beforeChange({ changeType: ChangeType.MapItemProperty, changeData: { propertyName: "pathData", propertyValue: this.pathData } });
        this.#pathData = pathData;
        this.#afterChange({ changeType: ChangeType.MapItemProperty, changeData: { propertyName: "pathData", propertyValue: this.pathData } });
    }

    /** @type {EntityReference}  */
    #mapItemTemplateRef;
    get mapItemTemplateRef() {
        return this.#mapItemTemplateRef;
    }
    set mapItemTemplateRef(mapItemTemplateRef) {
        if (!mapItemTemplateRef) {
            throw new Error(ErrorMessage.NullValue);
        }
        this.#beforeChange({ changeType: ChangeType.MapItemProperty, changeData: { propertyName: "mapItemTemplateRef", propertyValue: this.mapItemTemplateRef } });
        this.#mapItemTemplateRef = mapItemTemplateRef;
        this.#afterChange({ changeType: ChangeType.MapItemProperty, changeData: { propertyName: "mapItemTemplateRef", propertyValue: this.mapItemTemplateRef } });
    }

    /** @type {number}  */
    #z;
    get z() {
        return this.#z;
    }
    set z(z) {
        this.#beforeChange({ changeType: ChangeType.MapItemProperty, changeData: { propertyName: "z", propertyValue: this.z } });
        this.#z = z;
        this.#beforeChange({ changeType: ChangeType.MapItemProperty, changeData: { propertyName: "z", propertyValue: this.z } });
    }

    /** @type {boolean}  */
    #isHidden;
    get isHidden() {
        return this.#isHidden;
    }
    set isHidden(isHidden) {
        this.#beforeChange({ changeType: ChangeType.MapItemProperty, changeData: { propertyName: "isHidden", propertyValue: this.isHidden } });
        this.#isHidden = isHidden;
        this.#afterChange({ changeType: ChangeType.MapItemProperty, changeData: { propertyName: "isHidden", propertyValue: this.isHidden } });
    }

    /** @type {boolean}  */
    #isCaptionVisible;
    get isCaptionVisible() {
        return this.#isCaptionVisible;
    }
    set isCaptionVisibile(isCaptionVisible) {
        this.#beforeChange({ changeType: ChangeType.MapItemProperty, changeData: { propertyName: "isCaptionVisible", propertyValue: this.isCaptionVisible } });
        this.#isCaptionVisible = isCaptionVisible;
        this.#afterChange({ changeType: ChangeType.MapItemProperty, changeData: { propertyName: "isCaptionVisible", propertyValue: this.isCaptionVisible } });
    }

    /** @type {string}  */
    #captionText;
    get captionText() {
        return this.#captionText;
    }
    set captionText(captionText) {
        this.#beforeChange({ changeType: ChangeType.MapItemProperty, changeData: { propertyName: "captionText", propertyValue: this.captionText } });
        this.#captionText = captionText;
        this.#afterChange({ changeType: ChangeType.MapItemProperty, changeData: { propertyName: "captionText", propertyValue: this.captionText } });
    }

    /** @type {{x: number, y: number}} */
    #captionLocation;
    get captionLocation() {
        return this.#captionLocation;
    }
    set captionLocation(captionLocation) {
        this.#beforeChange({ changeType: ChangeType.MapItemProperty, changeData: { propertyName: "captionLocation", propertyValue: this.captionLocation } });
        this.#captionLocation = captionLocation;
        this.#afterChange({ changeType: ChangeType.MapItemProperty, changeData: { propertyName: "captionLocation", propertyValue: this.captionLocation } });
    }

    /** @type {{itemRotation: number, tileRotation: number}} */
    #rotation;
    get rotation() {
        return this.#rotation;
    }
    set rotation(rotation) {
        this.#beforeChange({ changeType: ChangeType.MapItemProperty, changeData: { propertyName: "rotation", propertyValue: this.rotation } });
        this.#rotation = rotation;
        this.#afterChange({ changeType: ChangeType.MapItemProperty, changeData: { propertyName: "rotation", propertyValue: this.rotation } });
    }

    // methods
    getData() {
        return {
            pathData: this.#pathData,
            mapItemTemplateRef: this.#mapItemTemplateRef,
            z: this.#z,
            isHidden: this.#isHidden,
            isCaptionVisible: this.#isCaptionVisible,
            captionText: this.#captionText,
            captionLocation: this.#captionLocation,
            rotation: this.#rotation
        };
    }

    addEventListener(eventName, listener) {
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
        this.#eventListeners[eventName].push(listener);
    }

    removeEventListener(eventName, listener) {
        const index = this.#eventListeners[eventName].findIndex(l => l === listener);
        if (index > -1) {
            this.#eventListeners.splice(index, 1);
        }
    }

    render(canvas, context, map) {
        if (this.isHidden != true) {
            const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, this.mapItemTemplateRef));
            if (mapItemTemplate) {
                const path = new Path2D(this.pathData);
                context.setLineDash(mapItemTemplate.strokes[0].dash);
                context.strokeStyle = mapItemTemplate.strokes[0].color;
                context.lineWidth = mapItemTemplate.strokes[0].width;
                context.stroke(path);
                context.fillStyle = mapItemTemplate.fills[0].color;
                context.fill(path);
                context.restore();
            }
        }
    }

    // helpers
    #eventListeners;

    #beforeChange = (change) => {
        if (this.#eventListeners[ChangeEventType.beforeChangeEvent]) {
            for (const listener of this.#eventListeners[ChangeEventType.beforeChangeEvent]) {
                listener(change);
            }
        }
    }

    #afterChange = (change) => {
        if (this.#eventListeners[ChangeEventType.afterChangeEvent]) {
            for (const listener of this.#eventListeners[ChangeEventType.afterChangeEvent]) {
                listener(change);
            }
        }
    }
}
