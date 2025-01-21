
import { Change, ChangeSet, ChangeType, EntityReference, InputUtilities, Path } from "../references.js";

export class MapItem {

    // constructor
    constructor(data) {
        this.#id = InputUtilities.cleanseString(data?.id) ?? crypto.randomUUID();
        this.#paths = [];
        if (data?.paths) {
            for (const pathData of data.paths) {
                const path = new Path(pathData);
                this.#paths.push(path);
                this.#addChangeEventListeners(path);
            }
            InputUtilities.validateIds(this.#paths);
        }
        this.#mapItemTemplateRef = new EntityReference(data?.mapItemTemplateRef);
        this.#z = InputUtilities.cleanseNumber(data?.z);
        this.#isHidden = InputUtilities.cleanseBoolean(data?.isHidden);
        this.#isCaptionVisible = InputUtilities.cleanseBoolean(data?.isCaptionVisible);
        this.#captionText = InputUtilities.cleanseString(data?.captionText);
        this.#captionLocation = InputUtilities.cleansePoint(data?.captionLocation);
        this.#bounds = InputUtilities.cleanseBounds(data?.bounds);
        this.#eventListeners = {};
    }

    // properties
    #id;
    get id() {
        return this.#id;
    }

    /** @type {Path[]}  */
    #paths;
    get paths() {
        return this.#paths ?? [];
    }
    set paths(paths) {
        if (this.#paths) {
            for (const path of this.#paths) {
                this.#removeChangeEventListeners(path);
            }
        }
        const changeSet = this.#getPropertyChange("paths", this.#getListData(this.#paths), this.#getListData(paths));
        InputUtilities.validateIds(paths);
        this.#paths = paths ?? [];
        for (const path of this.#paths) {
            this.#addChangeEventListeners(path);
        }
        this.#onChange(changeSet, true);
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
        const changeSet = this.#getPropertyChange("mapItemTemplateRef", this.#mapItemTemplateRef, mapItemTemplateRef);
        this.#mapItemTemplateRef = mapItemTemplateRef;
        this.#onChange(changeSet, true);
    }

    /** @type {number}  */
    #z;
    get z() {
        return this.#z;
    }
    set z(z) {
        const changeSet = this.#getPropertyChange("z", this.#z, z);
        this.#z = z;
        this.#onChange(changeSet, false);
    }

    /** @type {boolean}  */
    #isHidden;
    get isHidden() {
        return this.#isHidden;
    }
    set isHidden(isHidden) {
        const changeSet = this.#getPropertyChange("isHidden", this.#isHidden, isHidden);
        this.#isHidden = isHidden;
        this.#onChange(changeSet, false);
    }

    /** @type {boolean}  */
    #isCaptionVisible;
    get isCaptionVisible() {
        return this.#isCaptionVisible;
    }
    set isCaptionVisibile(isCaptionVisible) {
        const changeSet = this.#getPropertyChange("isCaptionVisible", this.#isCaptionVisible, isCaptionVisible);
        this.#isCaptionVisible = isCaptionVisible;
        this.#onChange(changeSet, false);
    }

    /** @type {string}  */
    #captionText;
    get captionText() {
        return this.#captionText;
    }
    set captionText(captionText) {
        const changeSet = this.#getPropertyChange("captionText", this.#captionText, captionText);
        this.#captionText = captionText;
        this.#onChange(changeSet, false);
    }

    /** @type {{x: number, y: number}} */
    #captionLocation;
    get captionLocation() {
        return this.#captionLocation;
    }
    set captionLocation(captionLocation) {
        const changeSet = this.#getPropertyChange("captionLocation", this.#captionLocation, captionLocation);
        this.#captionLocation = captionLocation;
        this.#onChange(changeSet, false);
    }

    /** @type {x: number, y: number, width: number, height: number} */
    #bounds;
    get bounds() {
        if (!this.#bounds) {
            let xMin = NaN, xMax = NaN, yMin = NaN, yMax = NaN;
            for (const path of this.paths) {
                const pathBounds = path.bounds;
                if (isNaN(xMin) || pathBounds.x < xMin) {
                    xMin = pathBounds.x;
                }
                if (isNaN(xMax) || pathBounds.x + pathBounds.width > xMax) {
                    xMax = pathBounds.x + pathBounds.width;
                }
                if (isNaN(yMin) || pathBounds.y < yMin) {
                    yMin = pathBounds.y;
                }
                if (isNaN(yMax) || pathBounds.y + pathBounds.height > yMax) {
                    yMax = pathBounds.y + pathBounds.height;
                }
            }
            this.#bounds = { x: xMin, y: yMin, width: xMax - xMin, height: yMax - yMin };
        }
        return this.#bounds;
    }

    // methods
    getData() {
        return {
            id: this.#id,
            paths: this.#getListData(this.#paths),
            mapItemTemplateRef: this.#mapItemTemplateRef.getData(),
            z: this.#z,
            isHidden: this.#isHidden,
            isCaptionVisible: this.#isCaptionVisible,
            captionText: this.#captionText,
            captionLocation: this.#captionLocation,
            bounds: this.#bounds
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

    addPath(path) {
        if (!path) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (this.paths.some(p => p.id == path.id)) {
            throw new Error(ErrorMessage.ItemAlreadyExistsInList);
        }
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: MapItem.name,
            propertyName: "paths",
            itemIndex: this.paths.length,
            itemValue: path.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#paths.push(path);
        this.#addChangeEventListeners(path);
        this.#onChange(changeSet, true);
    }

    insertPath(path, index) {
        if (!path) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (this.paths.some(p => p.id == path.id)) {
            throw new Error(ErrorMessage.ItemAlreadyExistsInList);
        }
        if (index < 0 || index > this.paths.length) {
            throw new Error(ErrorMessage.InvalidIndex);
        }
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: MapItem.name,
            propertyName: "paths",
            itemIndex: index,
            itemValue: path.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#paths.splice(index, 0, path);
        this.#addChangeEventListeners(path);
        this.#onChange(changeSet, true);
    }

    removePath(path) {
        const index = this.#paths.findIndex(p => p.id === path.id);
        if (index > -1) {
            const changeData = {
                changeType: ChangeType.Delete,
                changeObjectType: MapItem.name,
                propertyName: "paths",
                itemIndex: index,
                itemValue: path.getData()
            };
            const changeSet = new ChangeSet({ changes: [changeData] });
            const deleted = this.#paths.splice(index, 1);
            this.#removeChangeEventListeners(deleted[0]);
            this.#onChange(changeSet, true);
        }
    }

    render(context, map, options) {
        if (this.isHidden != true) {
            const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, this.mapItemTemplateRef));
            if (mapItemTemplate) {
                for (const path of this.paths) {
                    path.render(context, map, mapItemTemplate, options);
                }
            }
        }
    }

    isSelectedByPath(context, selectionBounds, selectionPath) {
        const bounds = this.bounds;
        if (bounds.x < selectionBounds.x
            || bounds.x + bounds.width > selectionBounds.x + selectionBounds.width
            || bounds.y < selectionBounds.y
            || bounds.y + bounds.height > selectionBounds.y + selectionBounds.height) {
            return false;
        }
        for (const path of this.paths) {
            if (!context.isPointInPath(selectionPath, path.start.x, path.start.y)) {
                return false;
            }
        }
        return true;
    }

    isSelectedByPoints(context, map, points) {
        const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, this.mapItemTemplateRef));
        const hasFill = mapItemTemplate.fills.length > 0;
        for (const path of this.paths) {
            const path2D = new Path2D(path.getPathInfo());
            for (const point of points) {
                if (hasFill) {
                    if (context.isPointInPath(path2D, point.x, point.y)) {
                        return true;
                    }
                }
                else {
                    if (context.isPointInStroke(path2D, point.x, point.y)) {
                        return true;
                    }
                }
            }
        }
        return false;
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
            case "paths":
                let paths = [];
                if (propertyValue) {
                    for (const path of propertyValue) {
                        paths.push(new Path(path));
                    }
                }
                this.paths = paths;
                break;
            case "mapItemTemplateRef":
                this.mapItemTemplateRef = new EntityReference(propertyValue);
                break;
            case "z":
                this.z = InputUtilities.cleanseNumber(propertyValue);
                break;
            case "isHidden":
                this.isHidden = InputUtilities.cleanseBoolean(propertyValue);
                break;
            case "isCaptionVisible":
                this.isCaptionVisible = InputUtilities.cleanseBoolean(propertyValue);
                break;
            case "captionText":
                this.captionText = InputUtilities.cleanseString(propertyValue);
                break;
            case "captionLocation":
                this.captionLocation = InputUtilities.cleansePoint(propertyValue);
                break;
        }
    }

    #applyPropertyInsert(propertyName, index, value) {
        if (propertyName == "paths") {
            this.insertPath(new Path(value), index);
        }
    }

    #applyPropertyDelete(propertyName, value) {
        if (propertyName == "paths") {
            this.removePath(new Path(value));
        }
    }

    // helpers
    #eventListeners;

    #onChange = (changeSet, invalidateBounds) => {
        if (this.#eventListeners[Change.ChangeEvent]) {
            if (changeSet?.changes) {
                for (const change of changeSet.changes) {
                    change.mapItemId = this.id;
                }
            }
            for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                listener(changeSet, invalidateBounds);
            }
        }
        if (invalidateBounds) {
            this.#bounds = null;
        }
    }

    #getPropertyChange(propertyName, v1, v2) {
        return ChangeSet.getPropertyChange(MapItem.name, propertyName, v1, v2);
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
