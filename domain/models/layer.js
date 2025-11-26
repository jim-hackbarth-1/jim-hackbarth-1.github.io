
import {
    Change,
    ChangeSet,
    ChangeType,
    EntityReference,
    ErrorMessage,
    GeometryUtilities,
    InputUtilities,
    MapItemGroup,
    PathStyleOption,
    PathStyleType,
    SelectionStatusType
} from "../references.js";

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
        return this.#isHidden;
    }
    set isHidden(isHidden) {
        const changeSet = this.#getPropertyChange("isHidden", this.#isHidden, isHidden);
        this.#isHidden = isHidden;
        this.#onChange(changeSet);
    }

    /** @type {MapItemGroup[]}  */
    #mapItemGroups;
    get mapItemGroups() {
        return this.#mapItemGroups ?? [];
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
    static validateUniqueLayerNames(layers) {
        if (layers) {
            const names = [];
            for (const layer of layers) {
                if (names.includes(layer.name)) {
                    throw new Error(ErrorMessage.ItemAlreadyExistsInList);
                }
                names.push(layer.name);
            }
        }
    }

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

    async render(context, map, options, maxStrokesLength, maxFillsLength, quickRender) {
        if (this.isHidden != true) {
            if (!quickRender) {
                this.#initializeRenderedImages(map);
            }
            const zGroups = this.#getZOrderGroups();
            for (const zGroup of zGroups) {
                const mapItems = this.#getMapItemsByZGroup(zGroup);
                if (!quickRender) {
                    for (const mapItem of mapItems) {
                        mapItem.renderShadow(context, map, options, false);
                    }
                }
                for (let i = maxStrokesLength - 1; i > -1; i--) {
                    for (const mapItem of mapItems) {
                        await mapItem.renderStroke(context, map, options, i, quickRender);
                    }
                }
                if (!quickRender) {
                    for (const mapItem of mapItems) {
                        mapItem.renderShadow(context, map, options, true);
                    }
                }
                for (let i = maxFillsLength - 1; i > -1; i--) {
                    for (const mapItem of mapItems) {
                        await mapItem.renderFill(context, map, options, i, quickRender);
                    }
                }
            }
        }
    }

    async renderCaptions(context, map, options) {
        if (this.isHidden != true) {
            const zGroups = this.#getZOrderGroups();
            for (const zGroup of zGroups) {
                const mapItems = this.#getMapItemsByZGroup(zGroup);
                for (const mapItem of mapItems) {
                    await mapItem.renderCaption(context, map, options);
                }
            }
        }
    }

    renderSelections(context, map) {
        if (this.isHidden != true) {
            for (const mapItemGroup of this.mapItemGroups) {
                mapItemGroup.renderSelection(context, map);
            }
        }
    }

    #renderedImages;
    renderImageArray(context, path, imageArrayInfo, zGroup, z, offset) {
        if (!this.#renderedImages) {
            return;
        }
        let pathsToCheck = [];
        const geometryUtilities = new GeometryUtilities();
        for (const item of this.#renderedImages) {
            if (item.pathId != path.id && geometryUtilities.doBoundsIntersect(path.bounds, item.pathBounds)) {
                const zPrecedenceInfo1 = {
                    zGroup: zGroup,
                    z: z,
                    pathId: path.id
                };
                const zPrecedenceInfo2 = {
                    zGroup: item.zGroup,
                    z: item.z,
                    pathId: item.pathId
                };
                if (!this.#info1HasZPrecedence(zPrecedenceInfo1, zPrecedenceInfo2)) {
                    const pathToCheck = this.#findPath(item.pathId);
                    if (pathToCheck) {
                        pathsToCheck.push(pathToCheck);
                    }
                }
            }
        }
        const locationsToRender = [];
        if (imageArrayInfo.locationInfo.locations.length == 1) {
            locationsToRender.push(imageArrayInfo.locationInfo.locations[0]);
        }
        else {
            for (const location of imageArrayInfo.locationInfo.locations) {
                const bounds = {
                    x: location.bounds.x + path.start.x,
                    y: location.bounds.y + path.start.y,
                    width: location.bounds.width,
                    height: location.bounds.height
                };
                let hasOverlap = false;
                for (const pathToCheck of pathsToCheck) {
                    hasOverlap = this.#doesBoundsIntersectPath(geometryUtilities, bounds, pathToCheck);
                    if (hasOverlap) {
                        break;
                    }
                }
                if (!hasOverlap) {
                    locationsToRender.push(location);
                }
            }
        }

        context.translate(offset.x, offset.y);
        for (const location of locationsToRender) {
            const image = imageArrayInfo.images[location.index];
            if (image) {
                context.drawImage(image, location.bounds.x + path.start.x, location.bounds.y + path.start.y);
            }
        }
        context.translate(-offset.x, -offset.y);
        const pathItem = this.#renderedImages.find(x => x.pathId == path.id);
        if (pathItem) {
            pathItem.renderedLocations = locationsToRender.map(l => l.bounds);
        }
    }

    selectByPath(geometryUtilities, selectionBounds, selectionPath, toggleCurrentSelections, mustBeContained) { 
        const selectionResults = [];
        for (const mapItemGroup of this.mapItemGroups) {
            selectionResults.push({
                isSelected: mapItemGroup.isSelectedByPath(geometryUtilities, selectionBounds, selectionPath, mustBeContained),
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

    areAllPointsInBadge(context, points) {
        for (const mapItemGroup of this.mapItemGroups) {
            for (const mapItem of mapItemGroup.mapItems) {
                if (mapItem.areAllPointsInBadge(context, points)) {
                    return true;
                }
            }
        }
        return false;
    }

    toggleBadge(context, points) {
        for (const mapItemGroup of this.mapItemGroups) {
            for (const mapItem of mapItemGroup.mapItems) {
                if (mapItem.areAllPointsInBadge(context, points)) {
                    mapItem.isHidden = !mapItem.isHidden;
                }
            }
        }
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
        if (toggleCurrentSelections) {
            const tempResults = [];
            for (const selectionResult of selectionResults) {
                let selectionStatus = null;
                if (selectionResult.isSelected) {
                    switch (selectionResult.mapItemGroup.selectionStatus) {
                        case SelectionStatusType.Primary:
                            selectionStatus = SelectionStatusType.Secondary;
                            break;
                        case SelectionStatusType.Secondary:
                            selectionStatus = null;
                            break;
                        default:
                            selectionStatus = SelectionStatusType.Primary;
                            break;
                    }
                }
                else {
                    selectionStatus = selectionResult.mapItemGroup.selectionStatus;
                }
                tempResults.push({
                    mapItemGroupId: selectionResult.mapItemGroup.id,
                    selectionStatus: selectionStatus,
                    isSelected: selectionResult.isSelected
                });
            }
            const primarySelections = tempResults.filter(r => r.selectionStatus == SelectionStatusType.Primary);
            if (primarySelections.length == 0) {
                let firstSecondary = tempResults.find(r => r.selectionStatus == SelectionStatusType.Secondary && !r.isSelected);
                if (!firstSecondary) {
                    firstSecondary = tempResults.find(r => r.selectionStatus == SelectionStatusType.Secondary);
                }
                if (firstSecondary) {
                    firstSecondary.selectionStatus = SelectionStatusType.Primary;
                }
            }
            if (primarySelections.length > 1) {
                for (let i = 1; i < primarySelections.length; i++) {
                    primarySelections[i].selectionStatus = SelectionStatusType.Secondary;
                }
            }
            for (const tempResult of tempResults) {
                const selection = selectionResults.find(r => r.mapItemGroup.id == tempResult.mapItemGroupId);
                selection.mapItemGroup.selectionStatus = tempResult.selectionStatus;
            }
        }
        else {
            let selectionStatus = SelectionStatusType.Primary;
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

    #getZOrderGroups() {
        const zGroups = [];
        for (const mapItemGroup of this.mapItemGroups) {
            for (const mapItem of mapItemGroup.mapItems) {
                const zGroup = mapItem.zGroup;
                if (!zGroups.includes(zGroup)) {
                    zGroups.push(zGroup);
                }
            }
        }
        zGroups.sort((a, b) => a - b);
        return zGroups;
    }

    #getMapItemsByZGroup(zGroup) {
        const mapItems = [];
        for (const mapItemGroup of this.mapItemGroups) {
            for (const mapItem of mapItemGroup.mapItems) {
                if (mapItem.zGroup == zGroup) {
                    mapItems.push(mapItem);
                }
            }
        }
        let hasZChanges = false;
        if (mapItems.some(mi => mi.z == 0)) {
            let max = 0;
            for (const mapItem of mapItems) {
                if (mapItem.z > max) {
                    max = mapItem.z;
                }
            }
            for (const mapItem of mapItems) {
                if (mapItem.z == 0) {
                    if (max > Number.MAX_SAFE_INTEGER * 0.9) {
                        max = 0;
                    }
                    max += 32;
                    mapItem.adjustZ(max);
                    hasZChanges = true;
                }
            }
        }
        if (hasZChanges) {
            this.#onChange(new ChangeSet());
        }
        function sort(mapItem1, mapItem2) {
            if (mapItem1.z < mapItem2.z) {
                return -1;
            }
            if (mapItem1.z > mapItem2.z) {
                return 1;
            }
            if (mapItem1.inView && !mapItem2.inView) {
                return -1;
            }
            if (!mapItem1.inView && mapItem2.inView) {
                return 1;
            }
            return 0;
        }
        mapItems.sort(sort);
        return mapItems;
    }

    #initializeRenderedImages(map) {
        const array = [];
        for (const mapItemGroup of this.mapItemGroups) {
            for (const mapItem of mapItemGroup.mapItems) {
                const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, mapItem.mapItemTemplateRef));
                if (mapItemTemplate) {
                    if (mapItemTemplate.fills.some(f => f.getStyleOptionValue(PathStyleOption.PathStyleType) == PathStyleType.ImageArrayFill)
                        || mapItemTemplate.strokes.some(s => s.getStyleOptionValue(PathStyleOption.PathStyleType) == PathStyleType.ImageArrayStroke)) {
                        for (const path of mapItem.paths) {
                            array.push({
                                pathId: path.id,
                                pathStart: path.start,
                                pathBounds: path.bounds,
                                zGroup: mapItem.zGroup,
                                z: mapItem.z,
                                renderedLocations: []
                            });
                            if (path.clipPaths) {
                                for (const clipPath of path.clipPaths) {
                                    array.push({
                                        pathId: clipPath.id,
                                        pathStart: clipPath.start,
                                        pathBounds: clipPath.bounds,
                                        zGroup: mapItem.zGroup,
                                        z: mapItem.z,
                                        renderedLocations: []
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
        this.#renderedImages = array;
    }

    #findPath(pathId) {
        for (const mapItemGroup of this.mapItemGroups) {
            for (const mapItem of mapItemGroup.mapItems) {
                for (const path of mapItem.paths) {
                    if (path.id == pathId) {
                        return path;
                    }
                    if (path.clipPaths) {
                        for (const clipPath of path.clipPaths) {
                            if (clipPath.id == pathId) {
                                return clipPath;
                            }
                        }
                    }
                }
            }
        }
        return null;
    }

    #info1HasZPrecedence(info1, info2) {
        if (info1.zGroup > info2.zGroup) {
            return true;
        }
        if (info1.zGroup < info2.zGroup) {
            return false;
        }
        if (info1.z > info2.z) {
            return true;
        }
        if (info1.z < info2.z) {
            return false;
        }
        if (info1.pathId > info2.pathId) {
            return true;
        }
        if (info1.pathId < info2.pathId) {
            return false;
        }
        return false;
    }

    #doesBoundsIntersectPath(geometryUtilities, bounds, path) {
        let topLeft = { x: bounds.x, y: bounds.y };
        let topRight = { x: bounds.x + bounds.width, y: bounds.y };
        let bottomLeft = { x: bounds.x + bounds.width, y: bounds.y + bounds.height };
        let bottomRight = { x: bounds.x, y: bounds.y + bounds.height };
        return geometryUtilities.isPointInPath(topLeft, path.bounds, path)
            || geometryUtilities.isPointInPath(topRight, path.bounds, path)
            || geometryUtilities.isPointInPath(bottomLeft, path.bounds, path)
            || geometryUtilities.isPointInPath(bottomRight, path.bounds, path);
    }
}
