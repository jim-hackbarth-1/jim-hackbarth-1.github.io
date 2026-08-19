
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
            InputUtilities.validateIds(this.#mapItems);
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
        InputUtilities.validateIds(mapItems);
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

    /** @type {boolean} */
    get inView() {
        if (this.mapItems.some(mi => mi.inView)) {
            return true;
        }
        return false;
    }

    // methods
    getData(copy) {
        return {
            id: copy ? crypto.randomUUID() : this.#id,
            mapItems: this.#getListData(this.#mapItems, copy),
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
                this.#drawRotationLine(context, map, start, end, this.selectionStatus);
            }
        }
    }

    isSelectedByPath(geometryUtilities, selectionBounds, selectionPath, mustBeContained) {
        const bounds = this.bounds;
        if (bounds.x + bounds.width < selectionBounds.x
            || bounds.y + bounds.height < selectionBounds.y
            || bounds.x > selectionBounds.x + selectionBounds.width
            || bounds.y > selectionBounds.y + selectionBounds.height) {
            return false;
        }
        if (mustBeContained) {
            for (const mapItem of this.mapItems) {
                if (!mapItem.isSelectedByPath(geometryUtilities, selectionBounds, selectionPath, mustBeContained)) {
                    return false;
                }
            }
            return true;
        }
        else {
            for (const mapItem of this.mapItems) {
                if (mapItem.isSelectedByPath(geometryUtilities, selectionBounds, selectionPath, mustBeContained)) {
                    return true;
                }
            }
            return false;
        }
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
        const min = handleSize * 4;
        if (bounds.width < min) {
            bounds.x = bounds.x + (bounds.width - min) / 2;
            bounds.width = min;
        }
        if (bounds.height < min) {
            bounds.y = bounds.y + (bounds.height - min) / 2;
            bounds.height = min;
        }
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
        const path = new Path2D(`M ${bounds.x},${bounds.y} l ${width},${0} ${0},${height} ${-width},${0} z`);
        this.#strokeSelectionPath(context, path, selectionStatus, scale);
    }

    #drawRotationLine(context, map, start, end, selectionStatus) {
        const scale = 1 / map.zoom;
        const path = new Path2D(`M ${start.x},${start.y} L ${end.x},${end.y}}`);
        const radius = 5 * scale;
        const circle = new Path2D(`M ${end.x},${end.y} m 0,${-radius} a ${radius} ${radius} 0 0 0 0 ${2 * radius} a ${radius} ${radius} 0 0 0 0 ${-2 * radius}`);
        this.#strokeSelectionPath(context, path, selectionStatus, scale);
        context.strokeStyle = (selectionStatus == SelectionStatusType.Primary) ? "orange" : "silver";
        context.stroke(circle);
        context.fillStyle = "white";
        context.fill(circle);
    }

    #strokeSelectionPath(context, path, selectionStatus, scale) {
        context.strokeStyle = "dimgray";
        context.lineWidth = 3 * scale;
        context.stroke(path);
        context.strokeStyle = "white";
        context.lineWidth = 2 * scale;
        context.stroke(path);
        context.setLineDash([5 * scale, 5 * scale]);
        context.strokeStyle = (selectionStatus == SelectionStatusType.Primary) ? "orange" : "silver";
        context.stroke(path);
        context.setLineDash([]);
    }

    #getListData(list, copy) {
        return list ? list.map(x => x.getData ? x.getData(copy) : x) : null;
    }
}
