
import { Change, ChangeType, EntityReference, InputUtilities, Path } from "../references.js";

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
        const change = this.#getPropertyChange("paths", this.#paths, paths);
        this.#validateUniqueIds(paths);
        this.#paths = paths ?? [];
        for (const path of this.#paths) {
            this.#addChangeEventListeners(path);
        }
        this.#onChange(change, true);
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
        const change = this.#getPropertyChange("mapItemTemplateRef", this.#mapItemTemplateRef, mapItemTemplateRef);
        this.#mapItemTemplateRef = mapItemTemplateRef;
        this.#onChange(change, true);
    }

    /** @type {number}  */
    #z;
    get z() {
        return this.#z;
    }
    set z(z) {
        const change = this.#getPropertyChange("z", this.#z, z);
        this.#z = z;
        this.#onChange(change, false);
    }

    /** @type {boolean}  */
    #isHidden;
    get isHidden() {
        return this.#isHidden;
    }
    set isHidden(isHidden) {
        const change = this.#getPropertyChange("isHidden", this.#isHidden, isHidden);
        this.#isHidden = isHidden;
        this.#onChange(change, false);
    }

    /** @type {boolean}  */
    #isCaptionVisible;
    get isCaptionVisible() {
        return this.#isCaptionVisible;
    }
    set isCaptionVisibile(isCaptionVisible) {
        const change = this.#getPropertyChange("isCaptionVisible", this.#isCaptionVisible, isCaptionVisible);
        this.#isCaptionVisible = isCaptionVisible;
        this.#onChange(change, false);
    }

    /** @type {string}  */
    #captionText;
    get captionText() {
        return this.#captionText;
    }
    set captionText(captionText) {
        const change = this.#getPropertyChange("captionText", this.#captionText, captionText);
        this.#captionText = captionText;
        this.#onChange(change, false);
    }

    /** @type {{x: number, y: number}} */
    #captionLocation;
    get captionLocation() {
        return this.#captionLocation;
    }
    set captionLocation(captionLocation) {
        const change = this.#getPropertyChange("captionLocation", this.#captionLocation, captionLocation);
        this.#captionLocation = captionLocation;
        this.#onChange(change, false);
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
            paths: this.#paths ? this.#paths.map(p => p.getData()) : null,
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
        const change = new Change({
            changeObjectType: MapItem.name,
            changeObjectRef: this.id,
            changeType: ChangeType.Insert,
            changeData: [{ pathId: path.id, index: this.paths.length }]
        });
        this.#paths.push(path);
        this.#addChangeEventListeners(path);
        this.#onChange(change, true);
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
        const change = new Change({
            changeObjectType: MapItem.name,
            changeObjectRef: this.id,
            changeType: ChangeType.Insert,
            changeData: [{ pathId: path.id, index: index }]
        });
        this.#paths.splice(index, 0, path);
        this.#addChangeEventListeners(path);
        this.#onChange(change, true);
    }

    removePath(path) {
        const index = this.#paths.findIndex(p => p.id === path.id);
        if (index > -1) {
            const change = new Change({
                changeObjectType: MapItem.name,
                changeObjectRef: this.id,
                changeType: ChangeType.Delete,
                changeData: [{ pathId: path.id, index: index }]
            });
            this.#paths.splice(index, 1);
            this.#removeChangeEventListeners(path);
            this.#onChange(change, true);
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

    // helpers
    #eventListeners;

    #onChange = (change, invalidateBounds) => {
        if (this.#eventListeners[Change.ChangeEvent]) {
            for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                listener(change, invalidateBounds);
            }
        }
        if (invalidateBounds) {
            this.#bounds = null;
        }
    }

    #getPropertyChange(propertyName, oldValue, newValue) {
        return new Change({
            changeObjectType: MapItem.name,
            changeObjectRef: this.id,
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

    #validateUniqueIds(paths) {
        if (paths) {
            const ids = [];
            for (const path of paths) {
                if (ids.includes(path.id)) {
                    throw new Error(ErrorMessage.ItemAlreadyExistsInList);
                }
                ids.push(path.id);
            }
        }
    }
}
