
import { ChangeEventType, ChangeType, MapItem } from "../references.js";

export class Layer {

    // constructor
    constructor(data) {
        this.#mapItems = [];
        if (data) {
            this.#name = data.name;
            this.#isHidden = data.isHidden;
            if (data.mapItems) {
                for (const mapItemData of data.mapItems) {
                    const mapItem = new MapItem(mapItemData);
                    this.#mapItems.push(mapItem);
                    this.#addChangeEventListeners(mapItem);
                }
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
        this.#beforeChange({ changeType: ChangeType.LayerProperty, changeData: { propertyName: "name", propertyValue: this.name } });
        this.#name = name;
        this.#afterChange({ changeType: ChangeType.LayerProperty, changeData: { propertyName: "name", propertyValue: this.name } });
    }

    /** @type {boolean}  */
    #isHidden;
    get isHidden() {
        return this.#name;
    }
    set isHidden(isHidden) {
        this.#beforeChange({ changeType: ChangeType.LayerProperty, changeData: { propertyName: "isHidden", propertyValue: this.isHidden } });
        this.#isHidden = isHidden;
        this.#afterChange({ changeType: ChangeType.LayerProperty, changeData: { propertyName: "isHidden", propertyValue: this.isHidden } });
    }

    /** @type {MapItem[]}  */
    #mapItems;
    get mapItems() {
        return this.#mapItems;
    }
    set mapItems(mapItems) {
        this.#beforeChange({ changeType: ChangeType.LayerProperty, changeData: { propertyName: "mapItems", propertyValue: this.mapItems } });
        if (this.#mapItems) {
            for (const mapItem of this.#mapItems) {
                this.#removeChangeEventListeners(mapItem);
            }
        }
        this.#mapItems = mapItems ?? [];
        if (this.#mapItems) {
            for (const mapItem of this.#mapItems) {
                this.#addChangeEventListeners(mapItem);
            }
        }
        this.#afterChange({ changeType: ChangeType.LayerProperty, changeData: { propertyName: "mapItems", propertyValue: this.mapItems } });
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
        this.#beforeChange({ changeType: ChangeType.LayerAddMapItem, changeData: { mapItem: mapItem } });
        this.#mapItems.push(mapItem);
        this.#addChangeEventListeners(mapItem);
        this.#afterChange({ changeType: ChangeType.LayerAddMapItem, changeData: { mapItem: mapItem } });
    }

    insertMapItem(index, mapItem) {
        if (!mapItem) {
            throw new Error(ErrorMessage.NullValue);
        }
        this.#beforeChange({ changeType: ChangeType.LayerInsertMapItem, changeData: { index: index, mapItem: mapItem } });
        this.#mapItems.splice(index, 0, mapItem);
        this.#addChangeEventListeners(mapItem);
        this.#afterChange({ changeType: ChangeType.LayerInsertMapItem, changeData: { index: index, mapItem: mapItem } });
    }

    removeMapItem(mapItem) {
        const index = this.#mapItems.findIndex(mi => mi === mapItem);
        if (index > -1) {
            this.#beforeChange({ changeType: ChangeType.LayerRemoveMapItem, changeData: { index: index, mapItem: mapItem } });
            this.#mapItems.splice(index, 1);
            this.#removeChangeEventListeners(mapItem);
            this.#afterChange({ changeType: ChangeType.LayerRemoveMapItem, changeData: { index: index, mapItem: mapItem } });
        }
    }

    clearMapItems() {
        this.mapItems([]);
    }

    render(canvas, context, map) {
        if (this.isHidden != true) {
            for (const mapItem of this.mapItems) {
                mapItem.render(canvas, context, map); // temp
            }
        }
    }

    // helpers
    #eventListeners;

    #beforeChange = (change) => {
        if (this.#eventListeners[ChangeEventType.beforeChangeEvent]) {
            for (const listener of this.#eventListeners[ChangeEventType.beforeChangeEvent]) {
                listener(change);
            }
        }
    }

    #afterChange = (change) => {
        if (this.#eventListeners[ChangeEventType.afterChangeEvent]) {
            for (const listener of this.#eventListeners[ChangeEventType.afterChangeEvent]) {
                listener(change);
            }
        }
    }

    #addChangeEventListeners(source) {
        if (source) {
            source.addEventListener(ChangeEventType.beforeChangeEvent, this.#beforeChange);
            source.addEventListener(ChangeEventType.afterChangeEvent, this.#afterChange);
        }
    }

    #removeChangeEventListeners(source) {
        if (source) {
            source.removeEventListener(ChangeEventType.beforeChangeEvent, this.#beforeChange);
            source.removeEventListener(ChangeEventType.afterChangeEvent, this.#afterChange);
        }
    }
}
