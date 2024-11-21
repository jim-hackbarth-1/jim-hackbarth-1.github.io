
import { Change, ChangeType, MapItem } from "../references.js";

export class Layer {

    // constructor
    constructor(data) {
        this.#name = data?.name;
        this.#isHidden = data?.isHidden;
        this.#mapItems = [];
        if (data?.mapItems) {
            for (const mapItemData of data.mapItems) {
                const mapItem = new MapItem(mapItemData);
                this.#mapItems.push(mapItem);
                this.#addChangeEventListeners(mapItem);
            }
        }
        this.#eventListeners = {};
    }

    // properties
    /** @type {string}  */
    #name;
    get name() {
        return this.#name;
    }
    set name(name) {
        const change = this.#getPropertyChange("name", this.#name, name);
        this.#name = name;
        this.#onChange(change);
    }

    /** @type {boolean}  */
    #isHidden;
    get isHidden() {
        return this.#name;
    }
    set isHidden(isHidden) {
        const change = this.#getPropertyChange("isHidden", this.#isHidden, isHidden);
        this.#isHidden = isHidden;
        this.#onChange(change);
    }

    /** @type {MapItem[]}  */
    #mapItems;
    get mapItems() {
        return this.#mapItems;
    }
    set mapItems(mapItems) {
        if (this.#mapItems) {
            for (const mapItem of this.#mapItems) {
                this.#removeChangeEventListeners(mapItem);
            }
        }
        const change = this.#getPropertyChange("mapItems", this.#mapItems, mapItems);
        this.#mapItems = mapItems ?? [];
        for (const mapItem of this.#mapItems) {
            this.#addChangeEventListeners(mapItem);
        }
        this.#onChange(change);
    }

    // methods
    getData() {
        const mapItems = [];
        for (const mapItem of this.#mapItems) {
            mapItems.push(mapItem.getData());
        }
        return {
            name: this.#name,
            isHidden: this.#isHidden,
            mapItems: mapItems
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

    addMapItem(mapItem) {
        if (!mapItem) {
            throw new Error(ErrorMessage.NullValue);
        }
        const change = new Change({
            changeObjectType: Layer.name,
            changeObjectRef: this.name,
            changeType: ChangeType.Insert,
            changeData: [{ mapItemId: mapItem.id, index: this.mapItems.length }]
        });
        this.#mapItems.push(mapItem);
        this.#onChange(change);
    }

    insertMapItem(mapItem, index) {
        if (!mapItem) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (index < 0 || index > this.mapItems.length) {
            throw new Error(ErrorMessage.InvalidIndex);
        }
        const change = new Change({
            changeObjectType: Layer.name,
            changeObjectRef: this.name,
            changeType: ChangeType.Insert,
            changeData: [{ mapItemId: mapItem.id, index: index }]
        });
        this.#mapItems.splice(index, 0, mapItem);
        this.#onChange(change);
    }

    removeMapItem(mapItem) {
        const index = this.#mapItems.findIndex(mi => mi.id === mapItem.id);
        if (index > -1) {
            const change = new Change({
                changeObjectType: Layer.name,
                changeObjectRef: this.name,
                changeType: ChangeType.Delete,
                changeData: [{ mapItemId: mapItem.id, index: index }]
            });
            this.#mapItems.splice(index, 1);
            this.#onChange(change);
        }
    }

    clearMapItems() {
        this.mapItems = [];
    }

    render(context, map) {
        if (this.isHidden != true) {
            for (const mapItem of this.mapItems) {
                mapItem.render(context, map); // temp
            }
        }
    }

    renderSelections(context, map) {
        if (this.isHidden != true) {
            for (const mapItem of this.mapItems) {
                mapItem.renderSelection(context, map); // temp
            }
        }
    }

    selectMapItemsByPath(context, selectionBounds, selectionPath) {         
        for (const mapItem of this.mapItems) {
            mapItem.selectByPath(context, selectionBounds, selectionPath);
        }
    }

    selectMapItemsByPoints(context, map, points) {
        for (const mapItem of this.mapItems) {
            mapItem.selectByPoints(context, map, points);
        }
    }

    getSelectionBounds(map) {
        const selectionBounds = [];
        for (const mapItem of this.mapItems) {
            if (mapItem.isSelected) {
                selectionBounds.push(mapItem.getSelectionBounds(map));
            }
        }
        return selectionBounds;
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
            changeObjectType: Layer.name,
            changeObjectRef: this.name,
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
