
import { Change, ChangeType, EntityReference, PathArc, PathLines } from "../references.js";

export class MapItem {

    // constructor
    constructor(data) {
        this.#id = data?.id ?? crypto.randomUUID();
        this.#paths = [];
        if (data?.paths) {
            for (const path of data.paths) {
                if (path.pathType === PathLines.name) {
                    this.#paths.push(new PathLines(path));
                }
                if (path.pathType === PathArc.name) {
                    this.#paths.push(new PathArc(path));
                }
            }
        }
        this.#mapItemTemplateRef = data?.mapItemTemplateRef;
        this.#z = data?.z;
        this.#isHidden = data?.isHidden;
        this.#isCaptionVisible = data?.isCaptionVisible;
        this.#captionText = data?.captionText;
        this.#captionLocation = data?.captionLocation;
        this.#isSelected = data?.isSelected;
        this.#eventListeners = {};
    }

    // properties
    #id;
    get id() {
        return this.#id;
    }

    /** @type {MapItemPaths}  */
    #paths;
    get paths() {
        return this.#paths ?? [];
    }
    set paths(paths) {
        const change = this.#getPropertyChange("paths", this.#paths, paths);
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

    /** @type {boolean}  */
    #isSelected;
    get isSelected() {
        return this.#isSelected;
    }
    set isSelected(isSelected) {
        const change = this.#getPropertyChange("isSelected", this.#isSelected, isSelected);
        this.#isSelected = isSelected;
        this.#onChange(change);
    }

    // methods
    getData() {
        return {
            id: this.#id,
            paths: this.#paths ? this.#paths.map(p => p.getData()) : null,
            mapItemTemplateRef: this.#mapItemTemplateRef,
            z: this.#z,
            isHidden: this.#isHidden,
            isCaptionVisible: this.#isCaptionVisible,
            captionText: this.#captionText,
            captionLocation: this.#captionLocation,
            isSelected: this.#isSelected
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
        const change = new Change({
            changeObjectType: MapItem.name,
            changeObjectRef: this.id,
            changeType: ChangeType.Insert,
            changeData: [{ pathId: path.id, index: this.paths.length }]
        });
        this.#paths.push(path);
        this.#onChange(change);
    }

    insertPath(path, index) {
        if (!path) {
            throw new Error(ErrorMessage.NullValue);
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
            if (mapItemTemplate) {
                const scale = 1 / map.zoom;
                for (const path of this.paths) {
                    let pathInfo = path.getPathInfo();
                    if (mapItemTemplate.fills.length > 0) {
                        pathInfo += " z";
                    }
                    const path2D = new Path2D(pathInfo);
                    context.setLineDash([]);
                    context.strokeStyle = mapItemTemplate.strokes[0].color;
                    context.lineWidth = mapItemTemplate.strokes[0].width * scale;
                    context.stroke(path2D);
                    context.fillStyle = mapItemTemplate.fills[0].color;
                    context.fill(path2D);
                }
            }
        }
    }

    renderSelection(context, map) {
        if (this.isSelected) {
            const selectionBounds = this.getSelectionBounds(map);
            const width = selectionBounds.move.width;
            const height = selectionBounds.move.height;
            const scale = 1 / map.zoom;
            const handleSize = 10 * scale;

            this.#drawSelectionBounds(context, map, selectionBounds.move);
            if (width > handleSize && height > handleSize) {
                this.#drawSelectionBounds(context, map, selectionBounds.resizeSE);
            }
            if (width > 2 * handleSize && height > handleSize) {
                this.#drawSelectionBounds(context, map, selectionBounds.resizeSW);
            }
            if (width > 3 * handleSize && height > handleSize) {
                this.#drawSelectionBounds(context, map, selectionBounds.resizeS);
            }
            if (height > 2 * handleSize && width > handleSize) {
                this.#drawSelectionBounds(context, map, selectionBounds.resizeNE);
            }
            if (height > 3 * handleSize && width > handleSize) {
                this.#drawSelectionBounds(context, map, selectionBounds.resizeE);
            }
            if (width > 2 * handleSize && height > 2 * handleSize) {
                this.#drawSelectionBounds(context, map, selectionBounds.resizeNW);
            }
            if (width > 3 * handleSize && height > 2 * handleSize) {
                this.#drawSelectionBounds(context, map, selectionBounds.resizeN);
            }
            if (width > 2 * handleSize && height > 3 * handleSize) {
                this.#drawSelectionBounds(context, map, selectionBounds.resizeW);
            }
            if (width > 3 * handleSize && height > 3 * handleSize) {
                this.#drawSelectionBounds(context, map, selectionBounds.rotate);
                const start = {
                    x: selectionBounds.rotate.x + (selectionBounds.rotate.width / 2),
                    y: selectionBounds.rotate.y + selectionBounds.rotate.height
                };
                const end = {
                    x: start.x,
                    y: selectionBounds.move.y + (selectionBounds.move.height / 2)
                };
                this.#drawRotationLine(context, map, start, end);
            }     
        }
    }

    selectByPath(context, selectionBounds, selectionPath) {
        const bounds = this.getBounds();
        if (bounds.x < selectionBounds.x
            || bounds.x + bounds.width > selectionBounds.x + selectionBounds.width
            || bounds.y < selectionBounds.y
            || bounds.y + bounds.height > selectionBounds.y + selectionBounds.height) {
            this.isSelected = false;
            return;
        }
        for (const path of this.paths) {
            if (!context.isPointInPath(selectionPath, path.start.x, path.start.y)) {
                this.isSelected = false;
                return;
            }
        }
        this.isSelected = true;
    }

    selectByPoints(context, map, points) {
        const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, this.mapItemTemplateRef));
        const hasFill = mapItemTemplate.fills.length > 0;
        for (const path of this.paths) {
            const path2D = new Path2D(path.getPathInfo());
            for (const point of points) {
                if (hasFill) {
                    if (context.isPointInPath(path2D, point.x, point.y)) {
                        this.isSelected = true;
                        return;
                    }
                }
                else {
                    if (context.isPointInStroke(path2D, point.x, point.y)) {
                        this.isSelected = true;
                        return;
                    }
                }
            }
        }
        this.isSelected = false;
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

    getSelectionBounds(map) {
        const bounds = this.getBounds();
        const handleSize = 10 / map.zoom;
        return {
            mapItem: this,
            rotate: { x: bounds.x + (bounds.width - handleSize) / 2, y: bounds.y - (4 * handleSize), width: handleSize, height: handleSize },
            resizeNW: { x: bounds.x, y: bounds.y, width: handleSize, height: handleSize },
            resizeN: { x: bounds.x + (bounds.width - handleSize) / 2, y: bounds.y, width: handleSize, height: handleSize },
            resizeNE: { x: bounds.x + bounds.width - handleSize, y: bounds.y, width: handleSize, height: handleSize },
            resizeE: { x: bounds.x + bounds.width - handleSize, y: bounds.y + (bounds.height - handleSize) / 2, width: handleSize, height: handleSize },
            resizeSE: { x: bounds.x + bounds.width - handleSize, y: bounds.y + bounds.height - handleSize, width: handleSize, height: handleSize },
            resizeS: { x: bounds.x + (bounds.width - handleSize) / 2, y: bounds.y + bounds.height - handleSize, width: handleSize, height: handleSize },
            resizeSW: { x: bounds.x, y: bounds.y + bounds.height - handleSize, width: handleSize, height: handleSize },
            resizeW: { x: bounds.x, y: bounds.y + (bounds.height - handleSize) / 2, width: handleSize, height: handleSize },
            move: bounds
        }
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

    #drawSelectionBounds(context, map, bounds) {
        const scale = 1 / map.zoom;
        const minSize = 10 * scale;
        let width = bounds.width;
        if (width < minSize) {
            width = minSize;
        }
        let height = bounds.height;
        if (height < minSize) {
            height = minSize;
        }
        const pathDark = new Path2D(`M ${bounds.x},${bounds.y} l ${width},${0} ${0},${height} ${-width},${0} z`);
        const pathLight = new Path2D(`M ${bounds.x + 1 * scale},${bounds.y + 1 * scale} l ${width},${0} ${0},${height} ${-width},${0} z`);
        context.setLineDash([2 * scale, 2 * scale]);
        context.lineWidth = 2 * scale;
        context.strokeStyle = "white";
        context.stroke(pathLight);
        context.lineWidth = 2 * scale;
        context.strokeStyle = "dimgray";
        context.stroke(pathDark);
    }

    #drawRotationLine(context, map, start, end) {
        const scale = 1 / map.zoom;
        const pathDark = new Path2D(`M ${start.x},${start.y} L ${end.x},${end.y}}`);
        const pathLight = new Path2D(`M ${start.x + 1 * scale},${start.y + 1 * scale} L ${end.x},${end.y}`);
        const radius = 5 * scale;
        const circle = new Path2D(`M ${end.x},${end.y} m 0,${-radius} a ${radius} ${radius} 0 0 0 0 ${2 * radius} a ${radius} ${radius} 0 0 0 0 ${-2 * radius}`);
        context.setLineDash([2 * scale, 2 * scale]);
        context.lineWidth = 2 * scale;
        context.strokeStyle = "white";
        context.stroke(pathLight);
        context.lineWidth = 2 * scale;
        context.strokeStyle = "dimgray";
        context.stroke(pathDark);
        context.setLineDash([]);
        context.stroke(circle);
        context.fillStyle = "white";
        context.fill(circle);
    }
}
