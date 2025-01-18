
import { Change, ChangeSet, ChangeType, InputUtilities, MapItem, SelectionStatusType } from "../references.js";

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
        const changeSet = this.#getPropertyChange("mapItems", this.#getListData(this.#mapItems), this.#getListData(mapItems));
        this.#validateUniqueIds(mapItems);
        this.#mapItems = mapItems ?? [];
        for (const mapItem of this.#mapItems) {
            this.#addChangeEventListeners(mapItem);
        }
        this.#onChange(changeSet, true);
    }

    /** @type {SelectionStatusType}  */
    #selectionStatus;
    get selectionStatus() {
        return this.#selectionStatus;
    }
    set selectionStatus(selectionStatus) {
        const changeSet = this.#getPropertyChange("selectionStatus", this.#selectionStatus, selectionStatus);
        this.#selectionStatus = selectionStatus;
        this.#onChange(changeSet, false);
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
            mapItems: this.#getListData(this.#mapItems),
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
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
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
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: MapItemGroup.name,
            propertyName: "mapItems",
            itemIndex: this.mapItems.length,
            itemValue: mapItem.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#mapItems.push(mapItem);
        this.#addChangeEventListeners(mapItem);
        this.#onChange(changeSet, true);
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
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: MapItemGroup.name,
            propertyName: "mapItems",
            itemIndex: index,
            itemValue: mapItem.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#mapItems.splice(index, 0, mapItem);
        this.#addChangeEventListeners(mapItem);
        this.#onChange(changeSet, true);
    }

    removeMapItem(mapItem) {
        const index = this.#mapItems.findIndex(mi => mi.id === mapItem.id);
        if (index > -1) {
            const changeData = {
                changeType: ChangeType.Delete,
                changeObjectType: MapItemGroup.name,
                propertyName: "mapItems",
                itemIndex: index,
                itemValue: mapItem.getData()
            };
            const changeSet = new ChangeSet({ changes: [changeData] });
            const deleted = this.#mapItems.splice(index, 1);
            this.#removeChangeEventListeners(deleted[0]);
            this.#onChange(changeSet, true);
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
            case "selectionStatus":
                this.selectionStatus = InputUtilities.cleanseString(propertyValue);
                break;
            case "mapItems":
                let mapItems = [];
                if (propertyValue) {
                    for (const mapItem of propertyValue) {
                        mapItems.push(new MapItem(mapItem));
                    }
                }
                this.mapItems = mapItems;
                break;
        }
    }

    #applyPropertyInsert(propertyName, index, value) {
        if (propertyName == "mapItems") {
            this.insertMapItem(new MapItem(value), index);
        }
    }

    #applyPropertyDelete(propertyName, value) {
        if (propertyName == "mapItems") {
            this.removeMapItem(new MapItem(value));
        }
    }

    // helpers
    #eventListeners;

    #onChange = (changeSet, invalidateBounds) => {
        if (this.#eventListeners[Change.ChangeEvent]) {
            if (changeSet?.changes) {
                for (const change of changeSet.changes) {
                    change.mapItemGroupId = this.id;
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
        return ChangeSet.getPropertyChange(MapItemGroup.name, propertyName, v1, v2);
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

    #getListData(list) {
        return list ? list.map(x => x.getData ? x.getData() : x) : null;
    }
}
