
import { Change, ChangeType, InputUtilities, MapItem, SelectionStatusType } from "../references.js";

export class MapItemGroup {

    // constructor
    constructor(data) {
        this.#id = InputUtilities.cleanseString(data?.id) ?? crypto.randomUUID();
        this.#mapItems = [];
        if (data?.mapItems) {
            for (const mapItemData of data.mapItems) {
                const mapItem = new MapItem(mapItemData);
                this.#mapItems.push(mapItem);
                this.#addChangeEventListeners(mapItem);
            }
        }
        this.#selectionStatus = InputUtilities.cleanseString(data?.selectionStatus);
        this.#bounds = InputUtilities.cleanseBounds(data?.bounds);
        this.#eventListeners = {};
    }

    // properties
    #id;
    get id() {
        return this.#id;
    }

    /** @type {MapItem[]}  */
    #mapItems;
    get mapItems() {
        return this.#mapItems ?? [];
    }
    set mapItems(mapItems) {
        if (this.#mapItems) {
            for (const mapItem of this.#mapItems) {
                this.#removeChangeEventListeners(mapItem);
            }
        }
        const change = this.#getPropertyChange("mapItems", this.#mapItems, mapItems);
        this.#validateUniqueIds(mapItems);
        this.#mapItems = mapItems ?? [];
        for (const mapItem of this.#mapItems) {
            this.#addChangeEventListeners(mapItem);
        }
        this.#onChange(change, true);
    }

    /** @type {SelectionStatusType}  */
    #selectionStatus;
    get selectionStatus() {
        return this.#selectionStatus;
    }
    set selectionStatus(selectionStatus) {
        const change = this.#getPropertyChange("selectionStatus", this.#selectionStatus, selectionStatus);
        this.#selectionStatus = selectionStatus;
        this.#onChange(change, false);
    }

    /** @type {x: number, y: number, width: number, height: number} */
    #bounds;
    get bounds() {
        if (!this.#bounds) {
            let xMin = NaN, xMax = NaN, yMin = NaN, yMax = NaN;
            for (const mapItem of this.mapItems) {
                const mapItemBounds = mapItem.bounds;
                if (isNaN(xMin) || mapItemBounds.x < xMin) {
                    xMin = mapItemBounds.x;
                }
                if (isNaN(xMax) || mapItemBounds.x + mapItemBounds.width > xMax) {
                    xMax = mapItemBounds.x + mapItemBounds.width;
                }
                if (isNaN(yMin) || mapItemBounds.y < yMin) {
                    yMin = mapItemBounds.y;
                }
                if (isNaN(yMax) || mapItemBounds.y + mapItemBounds.height > yMax) {
                    yMax = mapItemBounds.y + mapItemBounds.height;
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
            mapItems: this.#mapItems ? this.#mapItems.map(mi => mi.getData()) : null,
            selectionStatus: this.#selectionStatus,
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

    addMapItem(mapItem) {
        if (!mapItem) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (this.mapItems.some(mi => mi.id == mapItem.id)) {
            throw new Error(ErrorMessage.ItemAlreadyExistsInList);
        }
        const change = new Change({
            changeObjectType: MapItemGroup.name,
            changeObjectRef: this.id,
            changeType: ChangeType.Insert,
            changeData: [{ mapItemId: mapItem.id, index: this.mapItems.length }]
        });
        this.#mapItems.push(mapItem);
        this.#addChangeEventListeners(mapItem);
        this.#onChange(change, true);
    }

    insertMapItem(mapItem, index) {
        if (!mapItem) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (this.mapItems.some(mi => mi.id == mapItem.id)) {
            throw new Error(ErrorMessage.ItemAlreadyExistsInList);
        }
        if (index < 0 || index > this.mapItems.length) {
            throw new Error(ErrorMessage.InvalidIndex);
        }
        const change = new Change({
            changeObjectType: MapItemGroup.name,
            changeObjectRef: this.id,
            changeType: ChangeType.Insert,
            changeData: [{ mapItemId: mapItem.id, index: index }]
        });
        this.#mapItems.splice(index, 0, mapItem);
        this.#addChangeEventListeners(mapItem);
        this.#onChange(change, true);
    }

    removeMapItem(mapItem) {
        const index = this.#mapItems.findIndex(mi => mi.id === mapItem.id);
        if (index > -1) {
            const change = new Change({
                changeObjectType: MapItemGroup.name,
                changeObjectRef: this.id,
                changeType: ChangeType.Delete,
                changeData: [{ mapItemId: mapItem.id, index: index }]
            });
            this.#mapItems.splice(index, 1);
            this.#removeChangeEventListeners(mapItem);
            this.#onChange(change, true);
        }
    }

    render(context, map, options) {
        for (const mapItem of this.mapItems) {
            mapItem.render(context, map, options);
        }
    }

    renderSelection(context, map) {
        if (this.selectionStatus) {
            const selectionBounds = this.getSelectionBounds(map);
            const width = selectionBounds.move.width;
            const height = selectionBounds.move.height;
            const scale = 1 / map.zoom;
            const handleSize = 10 * scale;

            this.#drawSelectionBounds(context, map, selectionBounds.move, this.selectionStatus);
            if (width > handleSize && height > handleSize) {
                this.#drawSelectionBounds(context, map, selectionBounds.resizeSE, this.selectionStatus);
            }
            if (width > 2 * handleSize && height > handleSize) {
                this.#drawSelectionBounds(context, map, selectionBounds.resizeSW, this.selectionStatus);
            }
            if (width > 3 * handleSize && height > handleSize) {
                this.#drawSelectionBounds(context, map, selectionBounds.resizeS, this.selectionStatus);
            }
            if (height > 2 * handleSize && width > handleSize) {
                this.#drawSelectionBounds(context, map, selectionBounds.resizeNE, this.selectionStatus);
            }
            if (height > 3 * handleSize && width > handleSize) {
                this.#drawSelectionBounds(context, map, selectionBounds.resizeE, this.selectionStatus);
            }
            if (width > 2 * handleSize && height > 2 * handleSize) {
                this.#drawSelectionBounds(context, map, selectionBounds.resizeNW, this.selectionStatus);
            }
            if (width > 3 * handleSize && height > 2 * handleSize) {
                this.#drawSelectionBounds(context, map, selectionBounds.resizeN, this.selectionStatus);
            }
            if (width > 2 * handleSize && height > 3 * handleSize) {
                this.#drawSelectionBounds(context, map, selectionBounds.resizeW, this.selectionStatus);
            }
            if (width > 3 * handleSize && height > 3 * handleSize) {
                this.#drawSelectionBounds(context, map, selectionBounds.rotate, this.selectionStatus);
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

    isSelectedByPath(context, selectionBounds, selectionPath) {
        const bounds = this.bounds;
        if (bounds.x < selectionBounds.x
            || bounds.x + bounds.width > selectionBounds.x + selectionBounds.width
            || bounds.y < selectionBounds.y
            || bounds.y + bounds.height > selectionBounds.y + selectionBounds.height) {
            return false;
        }
        for (const mapItem of this.mapItems) {
            if (!mapItem.isSelectedByPath(context, selectionBounds, selectionPath)) {
                return false;
            }
        }
        return true;
    }

    isSelectedByPoints(context, map, points) {
        for (const mapItem of this.mapItems) {
            if (mapItem.isSelectedByPoints(context, map, points)) {
                return true;
            }
        }
        return false;
    }

    getSelectionBounds(map) {
        const bounds = this.bounds;
        const handleSize = 10 / map.zoom;
        return {
            mapItemGroup: this,
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
            changeObjectType: MapItemGroup.name,
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

    #drawSelectionBounds(context, map, bounds, selectionStatus) {
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
        context.strokeStyle = (selectionStatus == SelectionStatusType.Primary) ? "yellow" : "white";
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

    #validateUniqueIds(mapItems) {
        if (mapItems) {
            const ids = [];
            for (const mapItem of mapItems) {
                if (ids.includes(mapItem.id)) {
                    throw new Error(ErrorMessage.ItemAlreadyExistsInList);
                }
                ids.push(mapItem.id);
            }
        }
    }
}
