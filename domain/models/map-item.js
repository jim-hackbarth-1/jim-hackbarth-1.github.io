
import { Change, ChangeType, EntityReference, Path } from "../references.js";

export class MapItem {

    // constructor
    constructor(data) {
        this.#id = data?.id ?? crypto.randomUUID();
        this.#paths = [];
        if (data?.paths) {
            for (const path of data.paths) {
                path.mapItemId = this.id;
                this.#paths.push(new Path(path));
            }
        }
        this.#mapItemTemplateRef = data?.mapItemTemplateRef;
        this.#z = data?.z;
        this.#isHidden = data?.isHidden;
        this.#isCaptionVisible = data?.isCaptionVisible;
        this.#captionText = data?.captionText;
        this.#captionLocation = data?.captionLocation;
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
        const change = this.#getPropertyChange("paths", this.#paths, paths);
        if (paths) {
            for (const path of paths) {
                this.#setPathMapItemId(path);
            }
        }
        this.#validateUniqueIds(paths);
        this.#paths = paths;
        this.#onChange(change);
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

    /** @type {boolean}  */
    #isHidden;
    get isHidden() {
        return this.#isHidden;
    }
    set isHidden(isHidden) {
        const change = this.#getPropertyChange("isHidden", this.#isHidden, isHidden);
        this.#isHidden = isHidden;
        this.#onChange(change);
    }

    /** @type {boolean}  */
    #isCaptionVisible;
    get isCaptionVisible() {
        return this.#isCaptionVisible;
    }
    set isCaptionVisibile(isCaptionVisible) {
        const change = this.#getPropertyChange("isCaptionVisible", this.#isCaptionVisible, isCaptionVisible);
        this.#isCaptionVisible = isCaptionVisible;
        this.#onChange(change);
    }

    /** @type {string}  */
    #captionText;
    get captionText() {
        return this.#captionText;
    }
    set captionText(captionText) {
        const change = this.#getPropertyChange("captionText", this.#captionText, captionText);
        this.#captionText = captionText;
        this.#onChange(change);
    }

    /** @type {{x: number, y: number}} */
    #captionLocation;
    get captionLocation() {
        return this.#captionLocation;
    }
    set captionLocation(captionLocation) {
        const change = this.#getPropertyChange("captionLocation", this.#captionLocation, captionLocation);
        this.#captionLocation = captionLocation;
        this.#onChange(change);
    }

    // methods
    static cleanseData(data, inputUtilities) {
        if (!data) {
            return null;
        }
        const paths = [];
        if (data.paths) {
            for (const path of data.paths) {
                paths.push(Path.cleanseData(path, inputUtilities));
            }
        }
        return {
            id: inputUtilities.cleanseString(data.id),
            paths: paths,
            mapItemTemplateRef: EntityReference.cleanseData(data.mapItemTemplateRef),
            z: inputUtilities.cleanseNumber(data.z),
            isHidden: inputUtilities.cleanseBoolean(data.isHidden),
            isCaptionVisible: inputUtilities.cleanseBoolean(data.isCaptionVisible),
            captionText: inputUtilities.cleanseString(data.captionText),
            captionLocation: inputUtilities.cleansePoint(data.captionLocation)
        }
    }

    getData() {
        return {
            id: this.#id,
            paths: this.#paths ? this.#paths.map(p => p.getData()) : null,
            mapItemTemplateRef: this.#mapItemTemplateRef,
            z: this.#z,
            isHidden: this.#isHidden,
            isCaptionVisible: this.#isCaptionVisible,
            captionText: this.#captionText,
            captionLocation: this.#captionLocation
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
        this.#setPathMapItemId(path);
        this.#paths.push(path);
        this.#onChange(change);
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
        this.#setPathMapItemId(path);
        this.#paths.splice(index, 0, path);
        this.#onChange(change);
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
            this.#onChange(change);
        }
    }

    render(context, map) {
        if (this.isHidden != true) {
            const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, this.mapItemTemplateRef));
            const hasFill = mapItemTemplate.fills.length > 0;
            if (mapItemTemplate) {
                const scale = 1 / map.zoom;
                for (const path of this.paths) {
                    let pathInfo = path.getPathInfo();
                    if (hasFill) {
                        pathInfo += " z";
                    } 
                    const path2D = new Path2D(pathInfo);
                    context.setLineDash([]);
                    context.strokeStyle = mapItemTemplate.strokes[0].color;
                    context.lineWidth = mapItemTemplate.strokes[0].width * scale;
                    context.stroke(path2D);
                    context.save();
                    this.#renderClipPaths(context, path, hasFill);
                    context.fillStyle = mapItemTemplate.fills[0].color;
                    context.fill(path2D); 
                    context.restore();
                }
            }
        }
    }

    isSelectedByPath(context, selectionBounds, selectionPath) {
        const bounds = this.getBounds();
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

    getBounds() {
        let xMin = NaN, xMax = NaN, yMin = NaN, yMax = NaN;
        for (const path of this.paths) {
            const pathBounds = path.getBounds();
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
        return { x: xMin, y: yMin, width: xMax - xMin, height: yMax - yMin };
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

    #renderClipPaths(context, path, hasFill) {
        if (path?.clipPaths) {
            let outerPathInfo = path.getPathInfo();
            if (hasFill) {
                outerPathInfo += " z";
            }
            const outerPath = new Path2D(outerPathInfo);
            for (const clipPath of path.clipPaths) {
                let innerPathInfo = clipPath.getPathInfo();
                if (hasFill) {
                    innerPathInfo += " z";
                }
                const innerPath = new Path2D(innerPathInfo);
                context.stroke(innerPath);
                outerPath.addPath(innerPath);
            }
            context.clip(outerPath, "evenodd");
        }
    }

    #setPathMapItemId(path) {
        if (path) {
            path.mapItemId = this.id;
            if (path.clipPaths) {
                for (const clipPath of path.clipPaths) {
                    clipPath.mapItemId = this.id;
                }
            }
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
