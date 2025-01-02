
import { Change, ChangeType, MapItemGroup, SelectionStatusType } from "../references.js";

export class Layer {

    // constructor
    constructor(data) {
        this.#name = data?.name;
        this.#isHidden = data?.isHidden;
        this.#mapItemGroups = [];
        if (data?.mapItemGroups) {
            for (const mapItemGroupData of data.mapItemGroups) {
                const mapItemGroup = new MapItemGroup(mapItemGroupData);
                this.#mapItemGroups.push(mapItemGroup);
                this.#addChangeEventListeners(mapItemGroup);
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

    /** @type {MapItemGroup[]}  */
    #mapItemGroups;
    get mapItemGroups() {
        return this.#mapItemGroups;
    }
    set mapItemGroups(mapItemGroups) {
        if (this.#mapItemGroups) {
            for (const mapItemGroup of this.#mapItemGroups) {
                this.#removeChangeEventListeners(mapItemGroup);
            }
        }
        const change = this.#getPropertyChange("mapItemGroups", this.#mapItemGroups, mapItemGroups);
        this.#mapItemGroups = mapItemGroups ?? [];
        for (const mapItemGroup of this.#mapItemGroups) {
            this.#addChangeEventListeners(mapItemGroup);
        }
        this.#onChange(change);
    }

    // methods
    getData() {
        const mapItemGroups = [];
        for (const mapItemGroup of this.#mapItemGroups) {
            mapItemGroups.push(mapItemGroup.getData());
        }
        return {
            name: this.#name,
            isHidden: this.#isHidden,
            mapItemGroups: mapItemGroups
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

    addMapItemGroup(mapItemGroup) {
        if (!mapItemGroup) {
            throw new Error(ErrorMessage.NullValue);
        }
        const change = new Change({
            changeObjectType: Layer.name,
            changeObjectRef: this.name,
            changeType: ChangeType.Insert,
            changeData: [{ mapItemGroupId: mapItemGroup.id, index: this.mapItemGroups.length }]
        });
        this.#mapItemGroups.push(mapItemGroup);
        this.#onChange(change);
    }

    insertMapItemGroup(mapItemGroup, index) {
        if (!mapItemGroup) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (index < 0 || index > this.mapItemGroups.length) {
            throw new Error(ErrorMessage.InvalidIndex);
        }
        const change = new Change({
            changeObjectType: Layer.name,
            changeObjectRef: this.name,
            changeType: ChangeType.Insert,
            changeData: [{ mapItemGroupId: mapItemGroup.id, index: index }]
        });
        this.#mapItemGroups.splice(index, 0, mapItemGroup);
        this.#onChange(change);
    }

    removeMapItemGroup(mapItemGroup) {
        const index = this.#mapItemGroups.findIndex(mig => mig.id === mapItemGroup.id);
        if (index > -1) {
            const change = new Change({
                changeObjectType: Layer.name,
                changeObjectRef: this.name,
                changeType: ChangeType.Delete,
                changeData: [{ mapItemGroupId: mapItemGroup.id, index: index }]
            });
            this.#mapItemGroups.splice(index, 1);
            this.#onChange(change);
        }
    }

    clearMapItems() {
        this.mapItemGroups = [];
    }

    render(context, map) {
        if (this.isHidden != true) {
            for (const mapItemGroup of this.mapItemGroups) {
                mapItemGroup.render(context, map); // temp
            }
        }
    }

    renderSelections(context, map) {
        if (this.isHidden != true) {
            for (const mapItemGroup of this.mapItemGroups) {
                mapItemGroup.renderSelection(context, map); // temp
            }
        }
    }

    selectByPath(context, selectionBounds, selectionPath, toggleCurrentSelections) { 
        const selectionResults = [];
        for (const mapItemGroup of this.mapItemGroups) {
            selectionResults.push({
                isSelected: mapItemGroup.isSelectedByPath(context, selectionBounds, selectionPath),
                mapItemGroup: mapItemGroup
            });
        }
        this.#processSelectionResults(selectionResults, toggleCurrentSelections);
    }

    selectByPoints(context, map, points, toggleCurrentSelections) {
        const selectionResults = [];
        for (const mapItemGroup of this.mapItemGroups) {
            selectionResults.push({
                isSelected: mapItemGroup.isSelectedByPoints(context, map, points),
                mapItemGroup: mapItemGroup
            });
        }
        this.#processSelectionResults(selectionResults, toggleCurrentSelections);
    }

    getSelectionBounds(map) {
        const selectionBounds = [];
        for (const mapItemGroup of this.mapItemGroups) {
            if (mapItemGroup.selectionStatus) {
                selectionBounds.push(mapItemGroup.getSelectionBounds(map));
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

    #processSelectionResults(selectionResults, toggleCurrentSelections) {
        let selectionStatus = SelectionStatusType.Primary;
        let currentPrimaryId = selectionResults.find(r => r.mapItemGroup.selectionStatus == SelectionStatusType.Primary)?.mapItemGroup.id;
        if (toggleCurrentSelections) {
            for (const selectionResult of selectionResults) {
                if (selectionResult.isSelected) {
                    switch (selectionResult.mapItemGroup.selectionStatus) {
                        case SelectionStatusType.Primary:
                            selectionResult.mapItemGroup.selectionStatus = SelectionStatusType.Secondary;
                            break;
                        case SelectionStatusType.Secondary:
                            selectionResult.mapItemGroup.selectionStatus = null;
                            break;
                        default:
                            selectionResult.mapItemGroup.selectionStatus = selectionStatus;
                            selectionStatus = SelectionStatusType.Secondary;
                    }
                }
                else {
                    if (selectionResult.mapItemGroup.selectionStatus == SelectionStatusType.Primary) {
                        selectionResult.mapItemGroup.selectionStatus = SelectionStatusType.Secondary;
                    }
                }
            }
            let currentPrimary = selectionResults.find(r => r.mapItemGroup.selectionStatus == SelectionStatusType.Primary);
            if (!currentPrimary) {
                currentPrimary = selectionResults.find(
                    r => r.mapItemGroup.selectionStatus == SelectionStatusType.Secondary && r.mapItemGroup.id != currentPrimaryId);
                if (!currentPrimary) {
                    currentPrimary = selectionResults.find(r => r.mapItemGroup.selectionStatus == SelectionStatusType.Secondary);
                }
                if (currentPrimary) {
                    currentPrimary.mapItemGroup.selectionStatus = SelectionStatusType.Primary;
                }
            }
        }
        else {
            for (const selectionResult of selectionResults) {
                if (selectionResult.isSelected) {
                    selectionResult.mapItemGroup.selectionStatus = selectionStatus;
                    selectionStatus = SelectionStatusType.Secondary;
                }
                else {
                    selectionResult.mapItemGroup.selectionStatus = null;
                }
            }
        }
    }
}
