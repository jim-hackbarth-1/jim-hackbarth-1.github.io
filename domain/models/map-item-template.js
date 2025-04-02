
import {
    BaseFill,
    BaseStroke,
    Caption,
    ChangeSet,
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
        this.#defaultZGroup = InputUtilities.cleanseNumber(data?.z);
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
        const changeSet = this.#getPropertyChange("thumbnailSrc", this.#thumbnailSrc, thumbnailSrc);
        this.#thumbnailSrc = thumbnailSrc;
        this.#onChange(changeSet);
    }

    /** @type {BaseFill[]}  */
    #fills;
    get fills() {
        return this.#fills;
    }
    set fills(fills) {
        const changeSet = this.#getPropertyChange("fills", this.#getListData(this.#fills), this.#getListData(fills));
        this.#fills = fills;
        this.#onChange(changeSet);
    }

    /** @type {BaseStroke[]}  */
    #strokes;
    get strokes() {
        return this.#strokes;
    }
    set strokes(strokes) {
        const changeSet = this.#getPropertyChange("strokes", this.#getListData(this.#strokes), this.#getListData(strokes));
        this.#strokes = strokes;
        this.#onChange(changeSet);
    }

    /** @type {Shadow}  */
    #shadow;
    get shadow() {
        return this.#shadow;
    }
    set shadow(shadow) {
        const changeSet = this.#getPropertyChange("shadow", this.#shadow, shadow);
        this.#shadow = shadow;
        this.#onChange(changeSet);
    }

    /** @type {number}  */
    #defaultZGroup;
    get defaultZGroup() {
        return this.#defaultZGroup;
    }
    set defaultZGroup(defaultZGroup) {
        const changeSet = this.#getPropertyChange("defaultZGroup", this.#defaultZGroup, defaultZGroup);
        this.#defaultZGroup = defaultZGroup;
        this.#onChange(changeSet);
    }

    /** @type {Caption}  */
    #caption;
    get caption() {
        return this.#caption;
    }
    set caption(caption) {
        const changeSet = this.#getPropertyChange("caption", this.#caption, caption);
        this.#removeChangeEventListeners(this.#caption);
        this.#caption = caption;
        this.#addChangeEventListeners(this.#caption);
        this.#onChange(changeSet);
    }

    /** @type {string}  */
    #tags;
    get tags() {
        return this.#tags;
    }
    set tags(tags) {
        const changeSet = this.#getPropertyChange("tags", this.#tags, tags);
        this.#tags = tags;
        this.#onChange(changeSet);
    }

    // methods
    getData() {
        return {
            ref: this.#ref ? this.#ref.getData() : null,
            thumbnailSrc: this.#thumbnailSrc,
            fills: this.#getListData(this.#fills),
            strokes: this.#getListData(this.#strokes),
            shadow: this.#shadow ? this.#shadow.getData() : null,
            defaultZGroup: this.#defaultZGroup,
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
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
        const index = this.#eventListeners[eventName].findIndex(l => l === listener);
        if (index > -1) {
            this.#eventListeners[eventName].splice(index, 1);
        }
    }

    addFill(fill) {
        if (!fill) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (this.fills.some(f => f.id == fill.id)) {
            throw new Error(ErrorMessage.ItemAlreadyExistsInList);
        }
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: MapItemTemplate.name,
            propertyName: "fills",
            itemIndex: this.fills.length,
            itemValue: fill.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#fills.push(fill);
        this.#onChange(changeSet);
    }

    insertFill(fill, index) {
        if (!fill) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (this.fills.some(f => f.id == fill.id)) {
            throw new Error(ErrorMessage.ItemAlreadyExistsInList);
        }
        if (index < 0 || index > this.fills.length) {
            throw new Error(ErrorMessage.InvalidIndex);
        }
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: MapItemTemplate.name,
            propertyName: "fills",
            itemIndex: index,
            itemValue: fill.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#fills.splice(index, 0, fill);
        this.#onChange(changeSet);
    }

    removeFill(fill) {
        const index = this.#fills.findIndex(f => f.id === fill.id);
        if (index > -1) {
            const changeData = {
                changeType: ChangeType.Delete,
                changeObjectType: MapItemTemplate.name,
                propertyName: "fills",
                itemIndex: index,
                itemValue: fill.getData()
            };
            const changeSet = new ChangeSet({ changes: [changeData] });
            this.#fills.splice(index, 1);
            this.#onChange(changeSet);
        }
    }

    clearFills() {
        this.fills = [];
    }

    addStroke(stroke) {
        if (!stroke) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (this.strokes.some(s => s.id == stroke.id)) {
            throw new Error(ErrorMessage.ItemAlreadyExistsInList);
        }
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: MapItemTemplate.name,
            propertyName: "strokes",
            itemIndex: this.strokes.length,
            itemValue: stroke.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#strokes.push(stroke);
        this.#onChange(changeSet);
    }

    insertStroke(stroke, index) {
        if (!stroke) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (this.strokes.some(s => s.id == stroke.id)) {
            throw new Error(ErrorMessage.ItemAlreadyExistsInList);
        }
        if (index < 0 || index > this.strokes.length) {
            throw new Error(ErrorMessage.InvalidIndex);
        }
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: MapItemTemplate.name,
            propertyName: "strokes",
            itemIndex: index,
            itemValue: stroke.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#strokes.splice(index, 0, stroke);
        this.#onChange(changeSet);
    }

    removeStroke(stroke) {
        const index = this.#strokes.findIndex(s => s.id === stroke.id);
        if (index > -1) {
            const changeData = {
                changeType: ChangeType.Delete,
                changeObjectType: MapItemTemplate.name,
                propertyName: "strokes",
                itemIndex: index,
                itemValue: stroke.getData()
            };
            const changeSet = new ChangeSet({ changes: [changeData] });
            this.#strokes.splice(index, 1);
            this.#onChange(changeSet);
        }
    }

    clearStrokes() {
        this.strokes = [];
    }

    applyChange(change, undoing) {
        if (change.changeType == ChangeType.Edit) {
            this.#applyPropertyChange(change.propertyName, undoing ? change.oldValue : change.newValue);
        }
        if (change.changeType == ChangeType.Insert) {
            if (undoing) {
                this.#applyPropertyDelete(change.propertyName, change.itemValue);
            }
            else {
                this.#applyPropertyInsert(change.propertyName, change.itemIndex, change.itemValue);
            }
        }
        if (change.changeType == ChangeType.Delete) {
            if (undoing) {
                this.#applyPropertyInsert(change.propertyName, change.itemIndex, change.itemValue);
            }
            else {
                this.#applyPropertyDelete(change.propertyName, change.itemValue);
            }
        }
    }

    #applyPropertyChange(propertyName, propertyValue) {
        switch (propertyName) {
            case "thumbnailSrc":
                this.thumbnailSrc = InputUtilities.cleanseSvg(propertyValue);
                break;
            case "fills":
                let fills = [];
                if (propertyValue) {
                    for (const fill of propertyValue) {
                        if (fill.color) {
                            this.addFill(new ColorFill(value));
                        }
                        if (fill.gradientType) {
                            this.addFill(new GradientFill(value));
                        }
                        if (fill.imageSrc) {
                            this.addFill(new TileFill(value));
                        }
                        if (fill.imageSources) {
                            this.addFill(new ImageArrayFill(value));
                        }
                    }
                }
                this.fills = fills;
                break;
            case "strokes":
                let strokes = [];
                if (propertyValue) {
                    for (const stroke of propertyValue) {
                        if (stroke.color) {
                            this.addStroke(new ColorStroke(value));
                        }
                        if (stroke.gradientType) {
                            this.addStroke(new GradientStroke(value));
                        }
                        if (stroke.imageSrc) {
                            this.addStroke(new TileStroke(value));
                        }
                        if (stroke.imageSources) {
                            this.addStroke(new ImageArrayStroke(value));
                        }
                    }
                }
                this.strokes = strokes;
                break;
            case "shadow":
                this.shadow = propertyValue ? new Shadow(propertyValue) : null;
                break;
            case "defaultZGroup":
                this.defaultZGroup = InputUtilities.cleanseNumber(propertyValue);
                break;
            case "caption":
                this.caption = propertyValue ? new Caption(propertyValue) : null;
                break;
            case "tags":
                this.tags = InputUtilities.cleanseString(propertyValue);
                break;
        }
    }

    #applyPropertyInsert(propertyName, index, value) {
        if (propertyName == "fills") {
            if (value?.color) {
                this.insertFill(new ColorFill(value), index);
            }
            if (value?.gradientType) {
                this.insertFill(new GradientFill(value), index);
            }
            if (value?.imageSrc) {
                this.insertFill(new TileFill(value), index);
            }
            if (value?.imageSources) {
                this.insertFill(new ImageArrayFill(value), index);
            }
        }
        if (propertyName == "strokes") {
            if (value?.color) {
                this.insertStroke(new ColorStroke(value), index);
            }
            if (value?.gradientType) {
                this.insertStroke(new GradientStroke(value), index);
            }
            if (value?.imageSrc) {
                this.insertStroke(new TileStroke(value), index);
            }
            if (value?.imageSources) {
                this.insertStroke(new ImageArrayStroke(value), index);
            }
        }
    }

    #applyPropertyDelete(propertyName, value) {
        if (propertyName == "fills") {
            if (value?.color) {
                this.removeFill(new ColorFill(value));
            }
            if (value?.gradientType) {
                this.removeFill(new GradientFill(value));
            }
            if (value?.imageSrc) {
                this.removeFill(new TileFill(value));
            }
            if (value?.imageSources) {
                this.removeFill(new ImageArrayFill(value));
            }
        }
        if (propertyName == "strokes") {
            if (value?.color) {
                this.removeFill(new ColorStroke(value));
            }
            if (value?.gradientType) {
                this.removeFill(new GradientStroke(value));
            }
            if (value?.imageSrc) {
                this.removeFill(new TileStroke(value));
            }
            if (value?.imageSources) {
                this.removeFill(new ImageArrayStroke(value));
            }
        }
    }

    // helpers
    #eventListeners;

    #onChange = (changeSet) => {
        if (this.#eventListeners[Change.ChangeEvent]) {
            if (changeSet?.changes) {
                for (const change of changeSet.changes) {
                    change.mapItemTemplateRef = this.ref.getData();
                }
            }
            for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                listener(changeSet);
            }
        }
    }

    #getPropertyChange(propertyName, v1, v2) {
        return ChangeSet.getPropertyChange(MapItemTemplate.name, propertyName, v1, v2);
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

    #getListData(list) {
        return list ? list.map(x => x.getData ? x.getData() : x) : null;
    }
}
