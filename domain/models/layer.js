
import { Change, ChangeSet, ChangeType, ErrorMessage, InputUtilities, MapItemGroup, SelectionStatusType } from "../references.js";

export class Layer {

    // constructor
    constructor(data) {
        this.#name = InputUtilities.cleanseString(data?.name);
        this.#isHidden = InputUtilities.cleanseBoolean(data?.isHidden);
        this.#mapItemGroups = [];
        if (data?.mapItemGroups) {
            for (const mapItemGroupData of data.mapItemGroups) {
                const mapItemGroup = new MapItemGroup(mapItemGroupData);
                this.#mapItemGroups.push(mapItemGroup);
                this.#addChangeEventListeners(mapItemGroup);
            }
            InputUtilities.validateIds(this.#mapItemGroups);
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
        const changeSet = this.#getPropertyChange("name", this.#name, name);
        this.#name = name;
        this.#onChange(changeSet);
    }

    /** @type {boolean}  */
    #isHidden;
    get isHidden() {
        return this.#name;
    }
    set isHidden(isHidden) {
        const changeSet = this.#getPropertyChange("isHidden", this.#isHidden, isHidden);
        this.#isHidden = isHidden;
        this.#onChange(changeSet);
    }

    /** @type {MapItemGroup[]}  */
    #mapItemGroups;
    get mapItemGroups() {
        return this.#mapItemGroups;
    }
    set mapItemGroups(mapItemGroups) {
        InputUtilities.validateIds(mapItemGroups);
        if (this.#mapItemGroups) {
            for (const mapItemGroup of this.#mapItemGroups) {
                this.#removeChangeEventListeners(mapItemGroup);
            }
        }
        const changeSet = this.#getPropertyChange("mapItemGroups", this.#getListData(this.#mapItemGroups), this.#getListData(mapItemGroups));
        this.#mapItemGroups = mapItemGroups ?? [];
        for (const mapItemGroup of this.#mapItemGroups) {
            this.#addChangeEventListeners(mapItemGroup);
        }
        this.#onChange(changeSet);
    }

    // methods
    getData() {
        return {
            name: this.#name,
            isHidden: this.#isHidden,
            mapItemGroups: this.#getListData(this.#mapItemGroups)
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

    addMapItemGroup(mapItemGroup) {
        if (!mapItemGroup) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (this.mapItemGroups.some(mig => mig.id == mapItemGroup.id)) {
            throw new Error(ErrorMessage.ItemAlreadyExistsInList);
        }
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: Layer.name,
            propertyName: "mapItemGroups",
            itemIndex: this.mapItemGroups.length,
            itemValue: mapItemGroup.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#mapItemGroups.push(mapItemGroup);
        this.#addChangeEventListeners(mapItemGroup);
        this.#onChange(changeSet);
    }

    insertMapItemGroup(mapItemGroup, index) {
        if (!mapItemGroup) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (this.mapItemGroups.some(mig => mig.id == mapItemGroup.id)) {
            throw new Error(ErrorMessage.ItemAlreadyExistsInList);
        }
        if (index < 0 || index > this.mapItemGroups.length) {
            throw new Error(ErrorMessage.InvalidIndex);
        }
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: Layer.name,
            propertyName: "mapItemGroups",
            itemIndex: index,
            itemValue: mapItemGroup.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#mapItemGroups.splice(index, 0, mapItemGroup);
        this.#addChangeEventListeners(mapItemGroup);
        this.#onChange(changeSet);
    }

    removeMapItemGroup(mapItemGroup) {
        const index = this.#mapItemGroups.findIndex(mig => mig.id === mapItemGroup.id);
        if (index > -1) {
            const changeData = {
                changeType: ChangeType.Delete,
                changeObjectType: Layer.name,
                propertyName: "mapItemGroups",
                itemIndex: index,
                itemValue: mapItemGroup.getData()
            };
            const changeSet = new ChangeSet({ changes: [changeData] });
            const deleted = this.#mapItemGroups.splice(index, 1);
            this.#removeChangeEventListeners(deleted[0]);
            this.#onChange(changeSet);
        }
    }

    clearMapItems() {
        this.mapItemGroups = [];
    }

    render(context, map, options) {
        if (this.isHidden != true) {
            let mapItemGroups1 = this.mapItemGroups;
            let mapItemGroups2 = [];
            if (options?.updatedViewPort) {
                mapItemGroups1 = [];
                for (const mapItemGroup of this.mapItemGroups) {
                    let mapItemInView = false;
                    for (const mapItem of mapItemGroup.mapItems) {
                        let pathInView = false;
                        for (const path of mapItem.paths) {
                            if (path.inView) {
                                pathInView = true;
                                break;
                            }
                        }
                        if (pathInView) {
                            mapItemInView = true;
                            break;
                        }
                    }
                    if (mapItemInView) {
                        mapItemGroups1.push(mapItemGroup);
                    }
                    else {
                        mapItemGroups2.push(mapItemGroup);
                    }
                }
            }
            // render map item groups that were in view first
            for (const mapItemGroup of mapItemGroups1) {
                mapItemGroup.render(context, map, options); // temp
            }
            for (const mapItemGroup of mapItemGroups2) {
                mapItemGroup.render(context, map, options); // temp
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
            case "name":
                this.name = InputUtilities.cleanseString(propertyValue);
                break;
            case "isHidden":
                this.isHidden = InputUtilities.cleanseBoolean(propertyValue);
                break;
            case "mapItemGroups":
                let mapItemGroups = [];
                if (propertyValue) {
                    for (const mapItemGroup of propertyValue) {
                        mapItemGroups.push(new MapItemGroup(mapItemGroup));
                    }
                }
                this.mapItemGroups = mapItemGroups;
                break;
        }
    }

    #applyPropertyInsert(propertyName, index, value) {
        if (propertyName == "mapItemGroups") {
            this.insertMapItemGroup(new MapItemGroup(value), index);
        }
    }

    #applyPropertyDelete(propertyName, value) {
        if (propertyName == "mapItemGroups") {
            this.removeMapItemGroup(new MapItemGroup(value));
        }
    }

    // helpers
    #eventListeners;

    #onChange = (changeSet) => {
        if (this.#eventListeners[Change.ChangeEvent]) {
            if (changeSet?.changes) {
                for (const change of changeSet.changes) {
                    change.layerName = this.name;
                }
            }
            for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                listener(changeSet);
            }
        }
    }

    #getPropertyChange(propertyName, v1, v2) {
        return ChangeSet.getPropertyChange(Layer.name, propertyName, v1, v2);
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

    #getListData(list) {
        return list ? list.map(x => x.getData ? x.getData() : x) : null;
    }
}
