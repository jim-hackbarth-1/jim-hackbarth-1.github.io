
import { KitComponent, KitDependencyManager, KitMessenger, KitRenderer } from "../../../ui-kit.js";
import {
    EntityReference,
    Layer,
    MapItem,
    MapItemGroup,
    MapItemTemplate,
    MapWorkerClient,
    MapWorkerInputMessageType,
    SelectionStatusType
} from "../../../domain/references.js";
import { EditorModel } from "../editor/editor.js";
import { DomHelper } from "../../shared/dom-helper.js";

export function createModel() {
    return new EditSelectionsDialogModel();
}

class EditSelectionsDialogModel {

    // event handlers
    async onRenderStart(componentId) {
        this.componentId = componentId;
    }

    async onRenderComplete() {
        KitMessenger.subscribe(EditorModel.MapUpdatedNotificationTopic, this.componentId, this.onMapUpdated.name);
        const kitIfComponent = DomHelper.findComponentByElementId(this.#componentElement, "kitIfVisible");
        kitIfComponent.addEventListener(KitComponent.OnRenderCompleteEvent, this.onKitIfRenderComplete);
    }

    onKitIfRenderComplete = async () => {
        await this.#onRenderComplete();
        this.#restoreScrollPosition();
        this.#restoreMapItemListScrollPosition();
    }

    async onMapUpdated(message) {
        const currentlySelectedMapItems = await this.#getSelections();
        for (const selection of currentlySelectedMapItems) {
            if (!this.#initialSelections.some(s => s.mapItem.id == selection.mapItem.id)) {
                this.#initialSelections.push(selection);
            }
        }
        await this.#updateInitialSelections();
        this.#disabledAttribute = null;
        await DomHelper.reRenderElement(this.#componentElement, "kitIfVisible");
    }

    onKeyDown(event) {
        event.stopPropagation();
    }

    // methods
    #clickHandlerRegistered;
    async showDialog() {
        this.#initialSelections = await this.#getSelections();
        this.#isVisible = true;
        await DomHelper.reRenderElement(this.#componentElement, "kitIfVisible");
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const dialog = componentElement.querySelector("dialog");
        dialog.showModal();
        if (!this.#clickHandlerRegistered) {
            const me = this;
            dialog.addEventListener('click', function (event) {
                var rect = dialog.getBoundingClientRect();
                var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
                    rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
                if (!isInDialog) {
                    me.#isVisible = false;
                    dialog.close();
                }
            });
        }
    }

    #isVisible;
    isVisible() {
        return this.#isVisible
    }

    closeDialog() {
        this.#isVisible = false;
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("dialog").close();
    }

    async getMapItems() {
        const map = await MapWorkerClient.getMap();
        const mapItems = [];
        for (const selection of this.#initialSelections) {
            let caption = selection.mapItem.captionText;
            if (!selection.mapItem.isCaptionVisible) {
                caption += " (caption not shown)";
            }
            mapItems.push({
                id: selection.mapItem.id,
                isSelectedAttribute: selection.isSelected ? "checked" : "",
                templateName: selection.mapItem.mapItemTemplateRef.name,
                hasCaption: (selection.mapItem.captionText.length > 0),
                caption: caption,
                isHidden: selection.mapItem.isHidden,
                location: selection.mapItem.bounds,
                zGroup: selection.mapItem.zGroup,
                zOrder: selection.mapItem.z
            });
        }
        return mapItems;
    }

    async toggleSelections() {
        const isChecked = DomHelper.getElement(this.#componentElement, "#toggle-selection-checkbox").checked;
        const checkboxes = DomHelper.getElements(this.#componentElement, ".data-list-item-checkbox");
        for (const checkbox of checkboxes) {
            checkbox.checked = isChecked;
        }
        await this.#updateSelections();
    }

    async toggleSelection(mapItemId) {
        const clickedSelection = this.#initialSelections.find(s => s.mapItem.id == mapItemId);
        const clickedCheckboxId = `#map-item-checkbox-${clickedSelection.mapItem.id}`;
        const clickedCheckbox = DomHelper.getElement(this.#componentElement, clickedCheckboxId);
        const checked = clickedCheckbox.checked;
        let primarySelectionMapItemGroupId = null;
        if (clickedSelection) {
            const selections = this.#initialSelections.filter(s => s.mapItemGroupId == clickedSelection.mapItemGroupId);
            for (const selection of selections) {
                let checkboxId = `#map-item-checkbox-${selection.mapItem.id}`;
                let checkbox = DomHelper.getElement(this.#componentElement, checkboxId);
                if (checkbox) {
                    checkbox.checked = checked;
                }
            }
            if (checked) {
                primarySelectionMapItemGroupId = clickedSelection.mapItemGroupId;
            }
        }
        await this.#updateSelections(primarySelectionMapItemGroupId);
    }

    toggleDetails(mapItemId) {
        const detailsRowElement = DomHelper.getElement(this.#componentElement, `#map-item-details-row-${mapItemId}`);
        detailsRowElement.classList.toggle("hidden-details");
    }

    async getCurrentSelectionCount() {
        const mapItems = await this.#getCurrentlySelectedMapItems();
        return mapItems.length;
    }

    #disabledAttribute = null;
    async isDisabledAttribute() {
        if (this.#disabledAttribute == null) {
            this.#disabledAttribute = "disabled";
            const count = await this.getCurrentSelectionCount();
            if (count > 0) {
                this.#disabledAttribute = "";
            }
        }
        return this.#disabledAttribute;
    }

    async applyFilter() {
        const filterTextElement = DomHelper.getElement(this.#componentElement, "#filter-text");
        const filter = (filterTextElement.value ?? "").trim().toLowerCase();
        if (filter.length == 0) {
            return;
        }
        const mapItemGroups = [];
        let hasPrimary = false;
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        for (const selection of this.#initialSelections) {
            
            let name = (selection.mapItem.mapItemTemplateRef?.name ?? "").toLowerCase();
            let caption = (selection.mapItem.captionText ?? "").toLowerCase();
            let newSelectionStatus = null;
            if (name.includes(filter) || caption.includes(filter)) {
                if (hasPrimary) {
                    newSelectionStatus = SelectionStatusType.Secondary;
                }
                else {
                    newSelectionStatus = SelectionStatusType.Primary;
                    hasPrimary = true;
                }
            }
            let mapItemGroup = layer.mapItemGroups.find(mig => mig.id == selection.mapItemGroupId);
            let currentSelectionStatus = mapItemGroup.selectionStatus;
            if (newSelectionStatus != currentSelectionStatus) {
                mapItemGroups.push({
                    id: selection.mapItemGroupId,
                    oldValue: currentSelectionStatus,
                    newValue: newSelectionStatus
                });
            }
        }
        const changes = mapItemGroups.map(mig => ({
            changeType: "Edit",
            changeObjectType: MapItemGroup.name,
            propertyName: "selectionStatus",
            oldValue: mig.oldValue,
            newValue: mig.newValue,
            layerName: layer.name,
            mapItemGroupId: mig.id
        }));
        this.#updateMap(changes);
    }

    async updateCaptionText() {
        const captionTextElement = DomHelper.getElement(this.#componentElement, "#caption-text");
        const captionText = (captionTextElement.value ?? "").trim();
        await this.#setCaptionText(captionText);
    }

    async clearCaptionText() {
        await this.#setCaptionText("");
    }

    async setCaptionVisibility(isCaptionVisible) {
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        const mapItems = await this.#getCurrentlySelectedMapItems();
        const changes = [];
        for (const mapItemInfo of mapItems) {
            changes.push({
                changeType: "Edit",
                changeObjectType: MapItem.name,
                propertyName: "isCaptionVisible",
                oldValue: mapItemInfo.mapItem.isCaptionVisible,
                newValue: isCaptionVisible,
                layerName: layer.name,
                mapItemGroupId: mapItemInfo.mapItemGroupId,
                mapItemId: mapItemInfo.mapItem.id
            });
        }
        this.#updateMap(changes);
    }

    async updateZGroup() {
        const zGroupElement = DomHelper.getElement(this.#componentElement, "#z-group");
        const zGroup = zGroupElement.value ?? 0;
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        const mapItems = await this.#getCurrentlySelectedMapItems();
        const changes = [];
        for (const mapItemInfo of mapItems) {
            changes.push({
                changeType: "Edit",
                changeObjectType: MapItem.name,
                propertyName: "zGroup",
                oldValue: mapItemInfo.mapItem.zGroup,
                newValue: zGroup,
                layerName: layer.name,
                mapItemGroupId: mapItemInfo.mapItemGroupId,
                mapItemId: mapItemInfo.mapItem.id
            });
        }
        this.#updateMap(changes);
    }

    async bringForward() {
        await this.#updateZOrder("BringForward");
    }

    async bringToFront() {
        await this.#updateZOrder("BringToFront");
    }

    async sendBack() {
        await this.#updateZOrder("SendBack");
    }

    async sendToBack() {
        await this.#updateZOrder("SendToBack");
    }

    async group() {
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        const selections = await this.#getCurrentlySelectedMapItems();
        const selectedMapItemsData = [];
        for (const selection of selections) {
            selectedMapItemsData.push(selection.mapItem.getData());
        }
        const newSelectedGroupData = {
            mapItems: selectedMapItemsData,
            selectionStatus: SelectionStatusType.Primary
        };
        const mapItemGroupsToDelete = [];
        for (const selection of selections) {
            if (!mapItemGroupsToDelete.find(migInfo => migInfo.mapItemGroupData.id == selection.mapItemGroupId)) {
                let index = layer.mapItemGroups.findIndex(mig => mig.id == selection.mapItemGroupId);
                mapItemGroupsToDelete.push({
                    index: index,
                    mapItemGroupData: layer.mapItemGroups[index].getData()
                });
            }
        }
        function sortByIndex(item1, item2) {
            if (item1.index < item2.index) {
                return -1;
            }
            if (item1.index > item2.index) {
                return 1;
            }
            return 0;
        }
        mapItemGroupsToDelete.sort(sortByIndex);
        mapItemGroupsToDelete.reverse();
        const unGroupedMapItems = [];
        for (const mapItemGroupInfo of mapItemGroupsToDelete) {
            for (const mapItem of mapItemGroupInfo.mapItemGroupData.mapItems) {
                if (!newSelectedGroupData.mapItems.find(mi => mi.id == mapItem.id)) {
                    unGroupedMapItems.push(mapItem);
                }
            }
        }
        const newUngroupedMapItemsGroups = [];
        for (const mapItem of unGroupedMapItems) {
            newUngroupedMapItemsGroups.push({
                mapItems: [mapItem],
            });
        }
        const changes = [];
        let deletionCount = 0;
        for (const mapItemGroupInfo of mapItemGroupsToDelete) {
            changes.push({
                changeType: "Delete",
                changeObjectType: Layer.name,
                propertyName: "mapItemGroups",
                itemIndex: mapItemGroupInfo.index,
                itemValue: mapItemGroupInfo.mapItemGroupData,
                layerName: layer.name,
            });
            deletionCount++;
        }
        let insertionCount = 0;
        for (const mapItemGroupData of newUngroupedMapItemsGroups) {
            let newGroup = new MapItemGroup(mapItemGroupData);
            changes.push({
                changeType: "Insert",
                changeObjectType: Layer.name,
                propertyName: "mapItemGroups",
                itemIndex: layer.mapItemGroups.length - deletionCount + insertionCount,
                itemValue: newGroup.getData(),
                layerName: layer.name,
            });
            insertionCount++;
        }
        const newSelectedGroup = new MapItemGroup(newSelectedGroupData);
        changes.push({
            changeType: "Insert",
            changeObjectType: Layer.name,
            propertyName: "mapItemGroups",
            itemIndex: layer.mapItemGroups.length - deletionCount + insertionCount,
            itemValue: newSelectedGroup.getData(),
            layerName: layer.name,
        });
        this.#updateMap(changes);
    }

    async ungroup() {
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        const selections = await this.#getCurrentlySelectedMapItems();

        const mapItemGroupsToDelete = [];
        for (const selection of selections) {
            if (!mapItemGroupsToDelete.find(migInfo => migInfo.mapItemGroupData.id == selection.mapItemGroupId)) {
                let index = layer.mapItemGroups.findIndex(mig => mig.id == selection.mapItemGroupId);
                mapItemGroupsToDelete.push({
                    index: index,
                    mapItemGroupData: layer.mapItemGroups[index].getData()
                });
            }
        }
        function sortByIndex(item1, item2) {
            if (item1.index < item2.index) {
                return -1;
            }
            if (item1.index > item2.index) {
                return 1;
            }
            return 0;
        }
        mapItemGroupsToDelete.sort(sortByIndex);
        mapItemGroupsToDelete.reverse();

        const newUngroupedMapItemsGroups = [];
        let selectionStatus = SelectionStatusType.Primary;
        for (const selection of selections) {
            newUngroupedMapItemsGroups.push({
                mapItems: [selection.mapItem.getData()],
                selectionStatus: selectionStatus
            });
            selectionStatus = SelectionStatusType.Secondary;
        }

        const changes = [];
        let deletionCount = 0;
        for (const mapItemGroupInfo of mapItemGroupsToDelete) {
            changes.push({
                changeType: "Delete",
                changeObjectType: Layer.name,
                propertyName: "mapItemGroups",
                itemIndex: mapItemGroupInfo.index,
                itemValue: mapItemGroupInfo.mapItemGroupData,
                layerName: layer.name,
            });
            deletionCount++;
        }
        let insertionCount = 0;
        for (const mapItemGroupData of newUngroupedMapItemsGroups) {
            let newGroup = new MapItemGroup(mapItemGroupData);
            changes.push({
                changeType: "Insert",
                changeObjectType: Layer.name,
                propertyName: "mapItemGroups",
                itemIndex: layer.mapItemGroups.length - deletionCount + insertionCount,
                itemValue: newGroup.getData(),
                layerName: layer.name,
            });
            insertionCount++;
        }
        this.#updateMap(changes);
    }

    async setPresentationViewVisibility(isHidden) {
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        const mapItems = await this.#getCurrentlySelectedMapItems();
        const changes = [];
        for (const mapItemInfo of mapItems) {
            if (mapItemInfo.isHidden != isHidden) {
                changes.push({
                    changeType: "Edit",
                    changeObjectType: MapItem.name,
                    propertyName: "isHidden",
                    oldValue: mapItemInfo.mapItem.isHidden,
                    newValue: isHidden,
                    layerName: layer.name,
                    mapItemGroupId: mapItemInfo.mapItemGroupId,
                    mapItemId: mapItemInfo.mapItem.id
                });
            }
        }
        if (changes.length > 0) {
            this.#updateMap(changes);
        }
    }

    async updateMapItemTemplate() {
        const select = DomHelper.getElement(this.#componentElement, "#select-map-item-template");
        let parts = select.value.replace("ref-", "").split("-");
        var ref = {
            name: parts[0],
            versionId: parseInt(parts[1]),
            isBuiltIn: (parts[2] === "true"),
            isFromTemplate: (parts[3] === "true")
        };
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        const mapItems = await this.#getCurrentlySelectedMapItems();
        const changes = [];
        for (const mapItemInfo of mapItems) {
            if (!EntityReference.areEqual(mapItemInfo.mapItem.mapItemTemplateRef, ref)) {
                changes.push({
                    changeType: "Edit",
                    changeObjectType: MapItem.name,
                    propertyName: "mapItemTemplateRef",
                    oldValue: mapItemInfo.mapItem.mapItemTemplateRef.getData(),
                    newValue: ref,
                    layerName: layer.name,
                    mapItemGroupId: mapItemInfo.mapItemGroupId,
                    mapItemId: mapItemInfo.mapItem.id
                });
            }
        }
        if (changes.length > 0) {
            this.#updateMap(changes);
        }
    }

    // helpers
    #initialSelections = [];

    #componentElementInternal;
    get #componentElement() {
        if (!this.#componentElementInternal) {
            this.#componentElementInternal = KitRenderer.getComponentElement(this.componentId);
        }
        return this.#componentElementInternal
    }

    async #getSelections() {
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        let mapItemGroups = [];
        let mapItems = [];
        if (layer && layer.mapItemGroups.some(mig => mig.selectionStatus)) {
            mapItemGroups = layer.mapItemGroups.filter(mig => mig.selectionStatus);
            for (const mapItemGroup of mapItemGroups) {
                for (const mapItem of mapItemGroup.mapItems) {
                    mapItems.push({
                        mapItemGroupId: mapItemGroup.id,
                        isSelected: mapItemGroup.selectionStatus ? true : false,
                        mapItem: mapItem
                    });
                }
            }
        }
        return mapItems;
    }

    async #updateSelections(primarySelectionMapItemGroupId) {
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        const mapItemGroups = [];
        const checkboxes = DomHelper.getElements(this.#componentElement, ".data-list-item-checkbox");
        let hasPrimary = false;
        for (const checkbox of checkboxes) {
            let checkboxId = checkbox.id;
            let mapItemId = checkboxId.replace("map-item-checkbox-", "");
            let selection = this.#initialSelections.find(s => s.mapItem.id == mapItemId);
            if (selection) {
                let mapItemGroup = layer.mapItemGroups.find(mig => mig.id == selection.mapItemGroupId);
                if (mapItemGroup && !mapItemGroups.some(mig => mig.id == mapItemGroup.id)) {
                    let currentSelectionStatus = mapItemGroup.selectionStatus;
                    let newSelectionStatus = null;
                    if (checkbox.checked) {
                        if (hasPrimary) {
                            newSelectionStatus = SelectionStatusType.Secondary;
                        }
                        else {
                            if (primarySelectionMapItemGroupId) {
                                if (mapItemGroup.id == primarySelectionMapItemGroupId) {
                                    newSelectionStatus = SelectionStatusType.Primary;
                                    hasPrimary = true;
                                }
                                else {
                                    newSelectionStatus = SelectionStatusType.Secondary;
                                }
                            }
                            else {
                                newSelectionStatus = SelectionStatusType.Primary;
                                hasPrimary = true;
                            }
                        }
                    }
                    if (currentSelectionStatus != newSelectionStatus) {
                        mapItemGroups.push({
                            id: mapItemGroup.id,
                            oldValue: currentSelectionStatus,
                            newValue: newSelectionStatus
                        });
                    }
                }
            }
        }
        const changes = mapItemGroups.map(mig => ({
            changeType: "Edit",
            changeObjectType: MapItemGroup.name,
            propertyName: "selectionStatus",
            oldValue: mig.oldValue,
            newValue: mig.newValue,
            layerName: layer.name,
            mapItemGroupId: mig.id
        }));
        this.#updateMap(changes);
    }

    async #onRenderComplete() {
        await this.#loadThumbnails();
        const count = await this.getCurrentSelectionCount();
        const hasSelection = (count > 0);
        DomHelper.getElement(this.#componentElement, "#toggle-selection-checkbox").checked = hasSelection;
        await this.#loadMapItemTemplates();
    }

    async #loadThumbnails() {
        const map = await MapWorkerClient.getMap();
        const thumbnails = DomHelper.getElements(this.#componentElement, ".thumbnail");
        for (const thumbnail of thumbnails) {
            let thumbnailSrc = MapItemTemplate.defaultThumbnailSrc;
            let elementId = thumbnail.id;
            let mapItemId = elementId.replace("map-item-thumbnail-", "");
            let mapItemInfo = this.#initialSelections.find(s => s.mapItem.id == mapItemId);
            if (mapItemInfo) {
                let mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, mapItemInfo.mapItem.mapItemTemplateRef));
                if (mapItemTemplate?.thumbnailSrc) {
                    thumbnailSrc = mapItemTemplate.thumbnailSrc;
                }
            }
            thumbnail.setAttribute("src", thumbnailSrc);
        }
    }

    #updateMap(changes) {
        this.#saveScrollPosition();
        this.#saveMapItemListScrollPosition();
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    async #updateInitialSelections() {
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        for (const selection of this.#initialSelections) {
            let mapItemGroup = layer.mapItemGroups.find(mig => mig.id == selection.mapItemGroupId);
            if (mapItemGroup) {
                selection.isSelected = mapItemGroup.selectionStatus ? true : false;
                selection.mapItem = mapItemGroup.mapItems.find(mi => mi.id == selection.mapItem.id);
            }
        }
    }

    async #getCurrentlySelectedMapItems() {
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        let mapItems = [];
        for (const mapItemGroup of layer.mapItemGroups) {
            if (mapItemGroup.selectionStatus) {
                for (const mapItem of mapItemGroup.mapItems) {
                    mapItems.push({
                        mapItemGroupId: mapItemGroup.id,
                        mapItem: mapItem
                    });
                }
            }
        }
        return mapItems;
    }

    async #setCaptionText(captionText) {
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        const isCaptionVisible = (captionText.length > 0);
        const mapItems = await this.#getCurrentlySelectedMapItems();
        const changes = [];
        for (const mapItemInfo of mapItems) {
            changes.push({
                changeType: "Edit",
                changeObjectType: MapItem.name,
                propertyName: "captionText",
                oldValue: mapItemInfo.mapItem.captionText,
                newValue: captionText,
                layerName: layer.name,
                mapItemGroupId: mapItemInfo.mapItemGroupId,
                mapItemId: mapItemInfo.mapItem.id
            });
            changes.push({
                changeType: "Edit",
                changeObjectType: MapItem.name,
                propertyName: "isCaptionVisible",
                oldValue: mapItemInfo.mapItem.isCaptionVisible,
                newValue: isCaptionVisible,
                layerName: layer.name,
                mapItemGroupId: mapItemInfo.mapItemGroupId,
                mapItemId: mapItemInfo.mapItem.id
            });
        }
        this.#updateMap(changes);
    }

    async #updateZOrder(mode) {
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        const mapItems = await this.#getCurrentlySelectedMapItems();
        const changes = [];
        for (const mapItemInfo of mapItems) {
            let oldValue = mapItemInfo.mapItem.z;
            let newValue = oldValue;
            switch (mode) {
                case "SendToBack":
                    newValue = this.#getBackZ(layer, mapItemInfo.mapItem);
                    break;
                case "SendBack":
                    newValue = this.#getNextZBack(layer, mapItemInfo.mapItem);
                    break;
                case "BringForward":
                    newValue = this.#getNextZForward(layer, mapItemInfo.mapItem);
                    break;
                case "BringToFront":
                    newValue = this.#getFrontZ(layer, mapItemInfo.mapItem);
                    break;
            }
            if (oldValue != newValue) {
                changes.push({
                    changeType: "Edit",
                    changeObjectType: MapItem.name,
                    propertyName: "z",
                    oldValue: oldValue,
                    newValue: newValue,
                    layerName: layer.name,
                    mapItemGroupId: mapItemInfo.mapItemGroupId,
                    mapItemId: mapItemInfo.mapItem.id
                });
            }
        }
        if (changes.length > 0) {
            this.#updateMap(changes);
        }
    }

    #getNextZForward(layer, currentMapItem) {
        let minZ = null;
        for (const mapItemGroup of layer.mapItemGroups) {
            for (const mapItem of mapItemGroup.mapItems) {
                if (mapItem.zGroup == currentMapItem.zGroup
                    && mapItem.id != currentMapItem.id
                    && mapItem.z >= currentMapItem.z) {
                    if (mapItem.z == currentMapItem.z) {
                        return currentMapItem.z + 1;
                    }
                    if (!minZ || mapItem.z < minZ) {
                        minZ = mapItem.z;
                    }
                }
            }
        }
        if (minZ != null) {
            return minZ + 1;
        }
        return currentMapItem.z;
    }

    #getNextZBack(layer, currentMapItem) {
        let maxZ = null;
        for (const mapItemGroup of layer.mapItemGroups) {
            for (const mapItem of mapItemGroup.mapItems) {
                if (mapItem.zGroup == currentMapItem.zGroup
                    && mapItem.id != currentMapItem.id
                    && mapItem.z <= currentMapItem.z) {
                    if (mapItem.z == currentMapItem.z) {
                        return currentMapItem.z - 1;
                    }
                    if (!maxZ || mapItem.z > maxZ) {
                        maxZ = mapItem.z;
                    }
                }
            }
        }
        if (maxZ != null) {
            return maxZ - 1;
        }
        return currentMapItem.z;
    }

    #getFrontZ(layer, currentMapItem) {
        let maxZ = null;
        for (const mapItemGroup of layer.mapItemGroups) {
            for (const mapItem of mapItemGroup.mapItems) {
                if (mapItem.zGroup == currentMapItem.zGroup && mapItem.id != currentMapItem.id) {
                    if (!maxZ || mapItem.z > maxZ) {
                        maxZ = mapItem.z;
                    }
                }
            }
        }
        if (maxZ != null) {
            return maxZ + 1;
        }
        return currentMapItem.z;
    }

    #getBackZ(layer, currentMapItem) {
        let minZ = null;
        for (const mapItemGroup of layer.mapItemGroups) {
            for (const mapItem of mapItemGroup.mapItems) {
                if (mapItem.zGroup == currentMapItem.zGroup && mapItem.id != currentMapItem.id) {
                    if (!minZ || mapItem.z < minZ) {
                        minZ = mapItem.z;
                    }
                }
            }
        }
        if (minZ != null) {
            return minZ - 1;
        }
        return currentMapItem.z;
    }

    async #loadMapItemTemplates() {
        const appDocument = KitDependencyManager.getDocument();
        const map = await MapWorkerClient.getMap();
        const select = DomHelper.getElement(this.#componentElement, "#select-map-item-template");
        let option = appDocument.createElement("option");
        option.value = `ref-none-1-true-false`;
        option.innerHTML = "[None]";
        select.appendChild(option);
        function sortRefsByName(ref1, ref2) {
            if (ref1.name < ref2.name) {
                return -1;
            }
            if (ref1.name > ref2.name) {
                return 1;
            }
            return 0;
        }
        const mapItemTemplateRefs = map.mapItemTemplateRefs;
        mapItemTemplateRefs.sort(sortRefsByName);
        for (const ref of mapItemTemplateRefs) {
            option = appDocument.createElement("option");
            let displayName = ref.name;
            if (displayName.length > 25) {
                displayName = displayName.slice(0, 25) + "...";
            }
            option.value = `ref-${ref.name}-${ref.versionId}-${ref.isBuiltIn}-${ref.isFromTemplate}`;
            option.title = ref.name;
            option.innerHTML = displayName;
            select.appendChild(option);
        }
    }

    #scrollPosition = 0;
    #saveScrollPosition() {
        const appDocument = KitDependencyManager.getDocument();
        let container = appDocument.querySelector("#edit-selection-properties-container");
        this.#scrollPosition = container.scrollTop;
    }

    #restoreScrollPosition() {
        const appDocument = KitDependencyManager.getDocument();
        const container = appDocument.querySelector("#edit-selection-properties-container");
        container.scrollTo({
            top: this.#scrollPosition,
            left: 0,
            behavior: "smooth",
        });
    }

    #mapItemListscrollPosition = 0;
    #saveMapItemListScrollPosition() {
        const appDocument = KitDependencyManager.getDocument();
        let container = appDocument.querySelector("#map-item-list-container");
        this.#mapItemListscrollPosition = container.scrollTop;
    }

    #restoreMapItemListScrollPosition() {
        const appDocument = KitDependencyManager.getDocument();
        const container = appDocument.querySelector("#map-item-list-container");
        container.scrollTo({
            top: this.#mapItemListscrollPosition,
            left: 0,
            behavior: "smooth",
        });
    }
}
