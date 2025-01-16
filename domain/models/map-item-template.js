
import {
    BaseFill,
    BaseStroke,
    Caption,
    ChangeType,
    ColorFill,
    ColorStroke,
    EntityReference,
    GradientFill,
    GradientStroke,
    ImageArrayFill,
    ImageArrayStroke,
    InputUtilities,
    Shadow,
    TileFill,
    TileStroke
} from "../references.js";

export class MapItemTemplate {

    // constructor
    constructor(data) {
        this.#ref = new EntityReference(data?.ref);
        this.#thumbnailSrc = InputUtilities.cleanseSvg(data?.thumbnailSrc);
        this.#fills = [];
        if (data?.fills) {
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
        this.#strokes = [];
        if (data?.strokes) {
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
        if (data?.shadow) {
            this.#shadow = new Shadow(data.shadow);
        }
        this.#z = InputUtilities.cleanseNumber(data?.z);
        if (data?.caption) {
            this.#caption = new Caption(data.caption);
        }
        this.#tags = InputUtilities.cleanseString(data?.tags);
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
        const change = this.#getPropertyChange("thumbnailSrc", this.#thumbnailSrc, thumbnailSrc);
        this.#thumbnailSrc = thumbnailSrc;
        this.#onChange(change);
    }

    /** @type {BaseFill[]}  */
    #fills;
    get fills() {
        return this.#fills;
    }
    set fills(fills) {
        const change = this.#getPropertyChange("fills", this.#fills, fills);
        this.#fills = fills;
        this.#onChange(change);
    }

    /** @type {BaseStroke[]}  */
    #strokes;
    get strokes() {
        return this.#strokes;
    }
    set strokes(strokes) {
        const change = this.#getPropertyChange("strokes", this.#strokes, strokes);
        this.#strokes = strokes;
        this.#onChange(change);
    }

    /** @type {Shadow}  */
    #shadow;
    get shadow() {
        return this.#shadow;
    }
    set shadow(shadow) {
        const change = this.#getPropertyChange("shadow", this.#shadow, shadow);
        this.#shadow = shadow;
        this.#onChange(change);
    }

    /** @type {number}  */
    #z;
    get z() {
        return this.#z;
    }
    set z(z) {
        const change = this.#getPropertyChange("z", this.#z, z);
        this.#z = z;
        this.#onChange(change);
    }

    /** @type {Caption}  */
    #caption;
    get caption() {
        return this.#caption;
    }
    set caption(caption) {
        const change = this.#getPropertyChange("caption", this.#caption, caption);
        this.#removeChangeEventListeners(this.#caption);
        this.#caption = caption;
        this.#addChangeEventListeners(this.#caption);
        this.#onChange(change);
    }

    /** @type {string}  */
    #tags;
    get tags() {
        return this.#tags;
    }
    set tags(tags) {
        const change = this.#getPropertyChange("tags", this.#tags, tags);
        this.#tags = tags;
        this.#onChange(change);
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
            caption: this.#caption ? this.#caption.getData() : null,
            tags: this.#tags
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
            this.#eventListeners[eventName].splice(index, 1);
        }
    }

    addFill(fill) {
        if (!fill) {
            throw new Error(ErrorMessage.NullValue);
        }
        const change = new Change({
            changeObjectType: MapItemTemplate.name,
            changeObjectRef: this.ref,
            changeType: ChangeType.Insert,
            changeData: { propertyName: "fills", indices: [this.fills.length] }
        });
        this.#fills.push(fill);
        this.#onChange(change);
    }

    insertFill(fill, index) {
        if (!fill) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (index < 0 || index > this.fills.length) {
            throw new Error(ErrorMessage.InvalidIndex);
        }
        const change = new Change({
            changeObjectType: MapItemTemplate.name,
            changeObjectRef: this.ref,
            changeType: ChangeType.Insert,
            changeData: { propertyName: "fills", indices: [index] }
        });
        this.#fills.splice(index, 0, fill);
        this.#onChange(change);
    }

    removeFill(fill) {
        const index = this.#fills.findIndex(f => f === fill);
        if (index > -1) {
            const change = new Change({
                changeObjectType: MapItemTemplate.name,
                changeObjectRef: this.ref,
                changeType: ChangeType.Delete,
                changeData: {
                    propertyName: "fills",
                    fills: [{ fillData: fill.getData(), index: index }]
                }
            });
            this.#fills.splice(index, 1);
            this.#onChange(change);
        }
    }

    clearFills() {
        this.fills = [];
    }

    addStroke(stroke) {
        if (!stroke) {
            throw new Error(ErrorMessage.NullValue);
        }
        const change = new Change({
            changeObjectType: MapItemTemplate.name,
            changeObjectRef: this.ref,
            changeType: ChangeType.Insert,
            changeData: { propertyName: "strokes", indices: [this.strokes.length] }
        });
        this.#strokes.push(stroke);
        this.#onChange(change);
    }

    insertStroke(stroke, index) {
        if (!stroke) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (index < 0 || index > this.strokes.length) {
            throw new Error(ErrorMessage.InvalidIndex);
        }
        const change = new Change({
            changeObjectType: MapItemTemplate.name,
            changeObjectRef: this.ref,
            changeType: ChangeType.Insert,
            changeData: { propertyName: "strokes", indices: [index] }
        });
        this.#strokes.splice(index, 0, stroke);
        this.#onChange(change);
    }

    removeStroke(stroke) {
        const index = this.#strokes.findIndex(s => s === stroke);
        if (index > -1) {
            const change = new Change({
                changeObjectType: MapItemTemplate.name,
                changeObjectRef: this.ref,
                changeType: ChangeType.Delete,
                changeData: {
                    propertyName: "strokes",
                    strokes: [{ strokeData: stroke.getData(), index: index }]
                }
            });
            this.#strokes.splice(index, 1);
            this.#onChange(change);
        }
    }

    clearStrokes() {
        this.strokes = [];
    }

    // helpers
    #eventListeners;

    #onChange = (change) => {
        if (this.#eventListeners[Change.ChangeEvent]) {
            for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                listener(change);
            }
        }
    }

    #getPropertyChange(propertyName, oldValue, newValue) {
        return new Change({
            changeObjectType: MapItemTemplate.name,
            changeObjectRef: this.ref,
            changeType: ChangeType.Edit,
            changeData: [
                {
                    propertyName: propertyName,
                    oldValue: oldValue,
                    newValue: newValue
                }
            ]
        });
    }

    #addChangeEventListeners(source) {
        if (source) {
            source.addEventListener(Change.ChangeEvent, this.#onChange);
        }
    }

    #removeChangeEventListeners(source) {
        if (source) {
            source.removeEventListener(Change.ChangeEvent, this.#onChange);
        }
    }
}
