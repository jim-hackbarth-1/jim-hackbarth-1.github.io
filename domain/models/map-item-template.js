
import {
    BaseFill,
    BaseStroke,
    Caption,
    ChangeEventType,
    ChangeType,
    ColorFill,
    ColorStroke,
    EntityReference,
    GradientFill,
    GradientStroke,
    ImageArrayFill,
    ImageArrayStroke,
    Shadow,
    TileFill,
    TileStroke
} from "../references.js";

export class MapItemTemplate {

    // constructor
    constructor(data) {
        this.#ref = new EntityReference(data?.ref);
        this.#fills = [];
        this.#strokes = [];
        if (data) {
            this.#thumbnailSrc = data.thumbnailSrc;
            if (data.fills) {
                for (const fill of data.fills) {
                    if (fill.color) {
                        this.#fills.push(new ColorFill(fill));
                    }
                    if (fill.gradientType) {
                        this.#fills.push(new GradientFill(fill));
                    }
                    if (fill.imageSrc) {
                        this.#fills.push(new TileFill(fill));
                    }
                    if (fill.imageSources) {
                        this.#fills.push(new ImageArrayFill(fill));
                    }
                }
            }
            if (data.strokes) {
                for (const stroke of data.strokes) {
                    if (stroke.color) {
                        this.#strokes.push(new ColorStroke(stroke));
                    }
                    if (stroke.gradientType) {
                        this.#strokes.push(new GradientStroke(stroke));
                    }
                    if (stroke.imageSrc) {
                        this.#strokes.push(new TileStroke(stroke));
                    }
                    if (stroke.imageSources) {
                        this.#strokes.push(new ImageArrayStroke(stroke));
                    }
                }
            }
            if (data.shadow) {
                this.#shadow = new Shadow(data.shadow);
            }
            this.#z = data.z;
            if (data.caption) {
                this.#caption = new Caption(data.caption);
            }
        }
        this.#eventListeners = {};
        this.#addChangeEventListeners(this.#caption);
    }

    // properties
    /** @type {EntityReference}  */
    #ref;
    get ref() {
        return this.#ref;
    }

    /** @type {string}  */
    #thumbnailSrc;
    get thumbnailSrc() {
        return this.#thumbnailSrc;
    }
    set thumbnailSrc(thumbnailSrc) {
        this.#beforeChange({ changeType: ChangeType.MapItemTemplateProperty, changeData: { propertyName: "thumbnailSrc", propertyValue: this.thumbnailSrc } });
        this.#thumbnailSrc = thumbnailSrc;
        this.#afterChange({ changeType: ChangeType.MapItemTemplateProperty, changeData: { propertyName: "thumbnailSrc", propertyValue: this.thumbnailSrc } });
    }

    /** @type {BaseFill[]}  */
    #fills;
    get fills() {
        return this.#fills;
    }
    set fills(fills) {
        this.#beforeChange({ changeType: ChangeType.MapItemTemplateProperty, changeData: { propertyName: "fills", propertyValue: this.fills } });
        this.#fills = fills ?? [];
        this.#afterChange({ changeType: ChangeType.MapItemTemplateProperty, changeData: { propertyName: "fills", propertyValue: this.fills } });
    }

    /** @type {BaseStroke[]}  */
    #strokes;
    get strokes() {
        return this.#strokes;
    }
    set strokes(strokes) {
        this.#beforeChange({ changeType: ChangeType.MapItemTemplateProperty, changeData: { propertyName: "strokes", propertyValue: this.strokes } });
        this.#strokes = strokes ?? [];
        this.#afterChange({ changeType: ChangeType.MapItemTemplateProperty, changeData: { propertyName: "strokes", propertyValue: this.strokes } });
    }

    /** @type {Shadow}  */
    #shadow;
    get shadow() {
        return this.#shadow;
    }
    set shadow(shadow) {
        this.#beforeChange({ changeType: ChangeType.MapItemTemplateProperty, changeData: { propertyName: "shadow", propertyValue: this.shadow } });
        this.#shadow = shadow;
        this.#afterChange({ changeType: ChangeType.MapItemTemplateProperty, changeData: { propertyName: "shadow", propertyValue: this.shadow } });
    }

    /** @type {number}  */
    #z;
    get z() {
        return this.#z;
    }
    set z(z) {
        this.#beforeChange({ changeType: ChangeType.MapItemTemplateProperty, changeData: { propertyName: "z", propertyValue: this.z } });
        this.#z = z;
        this.#afterChange({ changeType: ChangeType.MapItemTemplateProperty, changeData: { propertyName: "z", propertyValue: this.z } });
    }

    /** @type {Caption}  */
    #caption;
    get caption() {
        return this.#caption;
    }
    set caption(caption) {
        this.#beforeChange({ changeType: ChangeType.MapItemTemplateProperty, changeData: { propertyName: "caption", propertyValue: this.caption } });
        this.#removeChangeEventListeners(this.#caption);
        this.#caption = caption;
        this.#addChangeEventListeners(this.#caption);
        this.#afterChange({ changeType: ChangeType.MapItemTemplateProperty, changeData: { propertyName: "caption", propertyValue: this.caption } });
    }

    // methods
    getData() {
        const fills = [];
        for (const fill of this.fills) {
            fills.push(fill.getData());
        }
        const strokes = [];
        for (const stroke of this.strokes) {
            strokes.push(stroke.getData());
        }
        return {
            ref: this.#ref ? this.#ref.getData() : null,
            thumbnailSrc: this.#thumbnailSrc,
            fills: fills,
            strokes: strokes,
            shadow: this.#shadow ? this.#shadow.getData() : null,
            z: this.#z,
            caption: this.#caption ? this.#caption.getData() : null
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

    addFill(fill) {
        if (!fill) {
            throw new Error(ErrorMessage.NullValue);
        }
        this.#beforeChange({ changeType: ChangeType.MapItemTemplateAddFill, changeData: { fill: fill } });
        this.#fills.push(fill);
        this.#afterChange({ changeType: ChangeType.MapItemTemplateAddFill, changeData: { fill: fill } });
    }

    insertFill(index, fill) {
        if (!fill) {
            throw new Error(ErrorMessage.NullValue);
        }
        this.#beforeChange({ changeType: ChangeType.MapItemTemplateInsertFill, changeData: { index: index, fill: fill } });
        this.#fills.splice(index, 0, fill);
        this.#afterChange({ changeType: ChangeType.MapItemTemplateInsertFill, changeData: { index: index, fill: fill } });
    }

    removeFill(fill) {
        const index = this.#fills.findIndex(f => f === fill);
        if (index > -1) {
            this.#beforeChange({ changeType: ChangeType.MapItemTemplateRemoveFill, changeData: { index: index, fill: fill } });
            this.#fills.splice(index, 1);
            this.#afterChange({ changeType: ChangeType.MapItemTemplateRemoveFill, changeData: { index: index, fill: fill } });
        }
    }

    clearFills() {
        this.fills([]);
    }

    addStroke(stroke) {
        if (!stroke) {
            throw new Error(ErrorMessage.NullValue);
        }
        this.#beforeChange({ changeType: ChangeType.MapItemTemplateAddStroke, changeData: { stroke: stroke } });
        this.#strokes.push(stroke);
        this.#afterChange({ changeType: ChangeType.MapItemTemplateAddStroke, changeData: { stroke: stroke } });
    }

    insertStroke(index, stroke) {
        if (!stroke) {
            throw new Error(ErrorMessage.NullValue);
        }
        this.#beforeChange({ changeType: ChangeType.MapItemTemplateInsertStroke, changeData: { index: index, stroke: stroke } });
        this.#strokes.splice(index, 0, stroke);
        this.#afterChange({ changeType: ChangeType.MapItemTemplateInsertStroke, changeData: { index: index, stroke: stroke } });
    }

    removeStroke(stroke) {
        const index = this.#strokes.findIndex(s => s === stroke);
        if (index > -1) {
            this.#beforeChange({ changeType: ChangeType.MapItemTemplateRemoveStroke, changeData: { index: index, stroke: stroke } });
            this.#strokes.splice(index, 1);
            this.#afterChange({ changeType: ChangeType.MapItemTemplateRemoveStroke, changeData: { index: index, stroke: stroke } });
        }
    }

    clearStrokes() {
        this.strokes([]);
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

    #addChangeEventListeners(source) {
        if (source) {
            source.addEventListener(ChangeEventType.beforeChangeEvent, this.#beforeChange);
            source.addEventListener(ChangeEventType.afterChangeEvent, this.#afterChange);
        }
    }

    #removeChangeEventListeners(source) {
        if (source) {
            source.removeEventListener(ChangeEventType.beforeChangeEvent, this.#beforeChange);
            source.removeEventListener(ChangeEventType.afterChangeEvent, this.#afterChange);
        }
    }
}
