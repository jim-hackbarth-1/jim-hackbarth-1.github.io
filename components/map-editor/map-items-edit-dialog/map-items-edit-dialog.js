
import {
    ChangeType,
    EntityReference,
    Layer,
    MapItem,
    MapItemGroup,
    MapItemTemplate,
    MapWorkerClient,
    MapWorkerInputMessageType,
    SelectionStatusType
} from "../../../domain/references.js";
import { DialogHelper } from "../../shared/dialog-helper.js";
import { EditorModel } from "../editor/editor.js";

export function createModel() {
    return new MapItemsEditDialogModel();
}

class MapItemsEditDialogModel {

    // event handlers
    async init(kitElement) {
        this.#kitElement = kitElement;
        MapItemsEditDialogModel.#mapItemCount = null;
        MapItemsEditDialogModel.#selectedAction = "map-items-edit-detail-find";
        MapItemsEditDialogModel.#selections = [];
        MapItemsEditDialogModel.#templates = await MapItemsEditDialogModel.#getTemplates();
        const kitKey = UIKit.renderer.getKitElementKey(this.#kitElement);
        UIKit.messenger.subscribe(
            EditorModel.MapUpdatedNotificationTopic,
            {
                elementKey: kitKey,
                id: `${EditorModel.MapUpdatedNotificationTopic}-${kitKey}`,
                object: this,
                callback: this.onMapUpdated.name
            }
        );

    }

    async onRendered() {
        if (MapItemsEditDialogModel.#isVisible) {
            this.#slideActions();
            const dialog = this.#kitElement.querySelector("dialog");
            const header = this.#kitElement.querySelector("header");
            this.#dialogHelper = new DialogHelper();
            this.#dialogHelper.show(dialog, header, this.#onCloseDialog);
        }
    }

    async onMapUpdated(message) {
        if (MapItemsEditDialogModel.#isVisible) {
            MapItemsEditDialogModel.#mapItemCount = null;
            const section = this.#kitElement.querySelector("#map-items-section");
            await UIKit.renderer.renderKitElement(section);
            this.#loadTemplates();
        }
    }

    // methods
    isVisible() {
        return MapItemsEditDialogModel.#isVisible;
    }

    async showDialog() {
        MapItemsEditDialogModel.#isVisible = true;
        await UIKit.renderer.renderKitElement(this.#kitElement);
        this.#loadTemplates();
    }

    closeDialog = () => {
        this.#dialogHelper.close();
    }

    toggleActionsPanel() {
        MapItemsEditDialogModel.#actionsPanelMinimized = !MapItemsEditDialogModel.#actionsPanelMinimized;
        this.#slideActions();
    }

    async noMapItems() {
        if (MapItemsEditDialogModel.#mapItemCount == null) {
            MapItemsEditDialogModel.#mapItemCount = (await this.getMapItems()).length;
        }
        return MapItemsEditDialogModel.#mapItemCount == 0;
    }

    async getNoMapItemsDisabledAttr() {
        if (MapItemsEditDialogModel.#mapItemCount == null) {
            MapItemsEditDialogModel.#mapItemCount = (await this.getMapItems()).length;
        }
        const hasMapItems = MapItemsEditDialogModel.#mapItemCount > 0;
        return hasMapItems ? null : "";
    }

    async selectAction(detailId, li) {
        if (li.hasAttribute("disabled")) {
            return;
        }
        const listItems = this.#kitElement.querySelectorAll("li");
        for (const listItem of listItems) {
            listItem.classList.remove("selected");
        }
        li.classList.add("selected");

        MapItemsEditDialogModel.#selectedAction = detailId;
        const details = this.#kitElement.querySelector("#map-items-detail-container");
        await UIKit.renderer.renderKitElement(details);
        this.#loadTemplates();
    }

    async getMapItems() {
        const map = await MapWorkerClient.getMap();
        const mapItems = [];
        const activeLayer = map.getActiveLayer();
        for (const mapItemGroup of activeLayer.mapItemGroups) {
            for (const mapItem of mapItemGroup.mapItems) {
                let caption = mapItem.captionText;
                if (!mapItem.isCaptionVisible) {
                    caption += " (caption not shown)";
                }
                let thumbnailSrc = MapItemTemplate.defaultThumbnailSrc;
                let mapItemTemplate = map.mapItemTemplates.find(
                    mit => EntityReference.areEqual(mit.ref, mapItem.mapItemTemplateRef));
                if (mapItemTemplate?.thumbnailSrc) {
                    thumbnailSrc = mapItemTemplate.thumbnailSrc;
                }
                let include = true;
                if (MapItemsEditDialogModel.#filter.mapItemTemplateName
                    && !mapItem.mapItemTemplateRef.name.startsWith(MapItemsEditDialogModel.#filter.mapItemTemplateName)) {
                    include = false;
                }
                if (MapItemsEditDialogModel.#filter.caption
                    && !caption.startsWith(MapItemsEditDialogModel.#filter.caption)) {
                    include = false;
                }
                if (MapItemsEditDialogModel.#filter.isSelected && !mapItemGroup.selectionStatus) {
                    include = false;
                }
                if (include) {
                    let templateDisplayName = mapItem.mapItemTemplateRef.name;
                    if (templateDisplayName.length > 25) {
                        templateDisplayName = templateDisplayName.slice(0, 25) + "...";
                    }
                    let displayCaption = caption;
                    if (displayCaption.length > 25) {
                        displayCaption = displayCaption.slice(0, 25) + "...";
                    }
                    mapItems.push({
                        id: mapItem.id,
                        mapItemGroupId: mapItemGroup.id,
                        templateName: templateDisplayName,
                        thumbnailSrc: thumbnailSrc,
                        hasCaption: (mapItem.captionText.length > 0),
                        caption: displayCaption,
                        isHidden: mapItem.isHidden,
                        isShown: mapItem.isHidden == false,
                        location: mapItem.bounds,
                        zGroup: mapItem.zGroup,
                        zOrder: mapItem.z,
                        isCheckedAttr: MapItemsEditDialogModel.#selections.includes(mapItem.id) ? "" : null
                    });
                }
            }
        }
        return mapItems;
    }

    async toggleSelections(input) {
        const checkboxes = this.#kitElement.querySelectorAll(".data-list-item-checkbox");
        for (const checkbox of checkboxes) {
            checkbox.checked = input.checked;
        }
        MapItemsEditDialogModel.#saveCurrentSelections(this.#kitElement.querySelectorAll(".data-list-item-checkbox:checked"));
        const details = this.#kitElement.querySelector("#map-items-detail-container");
        await UIKit.renderer.renderKitElement(details);
        this.#loadTemplates();
    }

    async toggleSelection() {
        const checkAll = this.#kitElement.querySelector("#toggle-selection-checkbox");
        const checkboxes = this.#kitElement.querySelectorAll(".data-list-item-checkbox:not(:checked)");
        checkAll.checked = (checkboxes.length == 0);
        MapItemsEditDialogModel.#saveCurrentSelections(this.#kitElement.querySelectorAll(".data-list-item-checkbox:checked"));
        const details = this.#kitElement.querySelector("#map-items-detail-container");
        await UIKit.renderer.renderKitElement(details);
        this.#loadTemplates();
    }

    toggleDetails(mapItemId) {
        const mapItemRow = this.#kitElement.querySelector(`#map-item-details-row-${mapItemId}`);
        mapItemRow.classList.toggle("hidden-details");
    }

    getSelectedAction() {
        return MapItemsEditDialogModel.#selectedAction;
    }

    isSelectedActionClass(action) {
        const isSelectedAction = MapItemsEditDialogModel.#selectedAction == action;
        return isSelectedAction ? "selected" : "";
    }

    getFilter() {
        return MapItemsEditDialogModel.#filter;
    }

    getFilterDescription() {
        const filters = [];
        if (MapItemsEditDialogModel.#filter.mapItemTemplateName) {
            filters.push("Map item template name");
        }
        if (MapItemsEditDialogModel.#filter.caption) {
            filters.push("Caption");
        }
        if (MapItemsEditDialogModel.#filter.isSelected) {
            filters.push("Selected");
        }
        if (filters.length > 0) {
            return filters.join(", ");
        }
        return "All map items";
    }

    async applyFilter() {
        const mapItemTemplateName = this.#kitElement.querySelector("#find-map-item-template-name").value;
        const caption = this.#kitElement.querySelector("#find-caption").value;
        const selected = this.#kitElement.querySelector("#find-selected").checked;
        MapItemsEditDialogModel.#filter = {
            mapItemTemplateName: mapItemTemplateName,
            caption: caption,
            isSelected: selected,
            isSelectedAttr: selected ? "" : null
        };
        MapItemsEditDialogModel.#mapItemCount = null;
        const section = this.#kitElement.querySelector("#map-items-section");
        await UIKit.renderer.renderKitElement(section);
        this.#loadTemplates();
    }

    onInputKeyDown(event) {
        event.stopPropagation();
    }

    getHasCheckedItemsDisabledAttr() {
        return MapItemsEditDialogModel.#selections.length == 0 ? "" : null;
    }

    async toggleMapItemSelection(selected) {

        // get checked items
        function distinct(value, index, array) {
            return array.indexOf(value) === index;
        }
        const checkedMapItemGroupIds = [...this.#kitElement.querySelectorAll(".data-list-item-checkbox:checked")]
            .map(c => c.getAttribute("data-map-item-group-id"))
            .filter(distinct);

        // get current selections
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        let currentlySelectedMapItemGroups = layer.mapItemGroups.filter(mig => mig.selectionStatus);

        // get potential changes
        const selectionStatus = selected ? SelectionStatusType.Secondary : null;
        const potentialChanges = [];
        for (const mapItemGroup of currentlySelectedMapItemGroups) {
            if (checkedMapItemGroupIds.includes(mapItemGroup.id)) {
                potentialChanges.push({
                    mapItemGroupId: mapItemGroup.id,
                    old: mapItemGroup.selectionStatus,
                    new: selectionStatus
                });
            }
            else {
                potentialChanges.push({
                    mapItemGroupId: mapItemGroup.id,
                    old: mapItemGroup.selectionStatus,
                    new: mapItemGroup.selectionStatus
                });
            }
        }
        for (const mapItemGroupId of checkedMapItemGroupIds) {
            const exists = potentialChanges.some(pc => pc.mapItemGroupId == mapItemGroupId);
            if (!exists) {
                potentialChanges.push({
                    mapItemGroupId: mapItemGroupId,
                    old: null,
                    new: selectionStatus
                });
            }
        }
        const hasSelection = potentialChanges.some(pc => pc.new);
        const hasPrimarySelection = potentialChanges.some(pc => pc.new == SelectionStatusType.Primary);
        if (hasSelection && !hasPrimarySelection) {
            const firstSelection = potentialChanges.find(pc => pc.new);
            firstSelection.new = SelectionStatusType.Primary;
        }
        const changes = potentialChanges.filter(pc => pc.old != pc.new).map(pc => ({
            changeType: "Edit",
            changeObjectType: MapItemGroup.name,
            propertyName: "selectionStatus",
            oldValue: pc.old,
            newValue: pc.new,
            layerName: layer.name,
            mapItemGroupId: pc.mapItemGroupId
        }));
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    async updateCaptionText() {
        let captionText = this.#kitElement.querySelector("#edit-caption-text").value;
        captionText = captionText
            .replaceAll("&", "")
            .replaceAll("<", "")
            .replaceAll(">", "")
            .replaceAll("'", "")
            .replaceAll('"', "");
        const isVisible = (captionText.length > 0);
        const checkedItems = this.#kitElement.querySelectorAll(".data-list-item-checkbox:checked");
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        const changes = [];
        for (const item of checkedItems) {
            const mapItemId = item.getAttribute("data-map-item-id");
            const mapItemGroupId = item.getAttribute("data-map-item-group-id");
            const mapItem = layer.mapItemGroups
                .find(mig => mig.id == mapItemGroupId).mapItems
                .find(mi => mi.id == mapItemId);
            if (mapItem.captionText != captionText) {
                changes.push({
                    changeType: "Edit",
                    changeObjectType: MapItem.name,
                    propertyName: "captionText",
                    oldValue: mapItem.captionText,
                    newValue: captionText,
                    layerName: layer.name,
                    mapItemGroupId: mapItemGroupId,
                    mapItemId: mapItemId
                })
            }
            if (mapItem.isCaptionVisible != isVisible) {
                changes.push({
                    changeType: "Edit",
                    changeObjectType: MapItem.name,
                    propertyName: "isCaptionVisible",
                    oldValue: mapItem.isCaptionVisible,
                    newValue: isVisible,
                    layerName: layer.name,
                    mapItemGroupId: mapItemGroupId,
                    mapItemId: mapItemId
                })
            }
        }
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    async toggleCaptionVisibility(isVisible) {
        const checkedItems = this.#kitElement.querySelectorAll(".data-list-item-checkbox:checked");
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        const changes = [];
        for (const item of checkedItems) {
            const mapItemId = item.getAttribute("data-map-item-id");
            const mapItemGroupId = item.getAttribute("data-map-item-group-id");
            const mapItem = layer.mapItemGroups
                .find(mig => mig.id == mapItemGroupId).mapItems
                .find(mi => mi.id == mapItemId);
            if (mapItem.isCaptionVisible != isVisible) {
                changes.push({
                    changeType: "Edit",
                    changeObjectType: MapItem.name,
                    propertyName: "isCaptionVisible",
                    oldValue: mapItem.isCaptionVisible,
                    newValue: isVisible,
                    layerName: layer.name,
                    mapItemGroupId: mapItemGroupId,
                    mapItemId: mapItemId
                })
            }
        }
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    async updateZGroup() {
        const zGroup = this.#kitElement.querySelector("#rendering-group-edit").value ?? 0;
        const checkedItems = this.#kitElement.querySelectorAll(".data-list-item-checkbox:checked");
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        const changes = [];
        for (const item of checkedItems) {
            const mapItemId = item.getAttribute("data-map-item-id");
            const mapItemGroupId = item.getAttribute("data-map-item-group-id");
            const mapItem = layer.mapItemGroups
                .find(mig => mig.id == mapItemGroupId).mapItems
                .find(mi => mi.id == mapItemId);
            if (mapItem.zGroup != zGroup) {
                changes.push({
                    changeType: "Edit",
                    changeObjectType: MapItem.name,
                    propertyName: "zGroup",
                    oldValue: mapItem.zGroup,
                    newValue: zGroup,
                    layerName: layer.name,
                    mapItemGroupId: mapItemGroupId,
                    mapItemId: mapItemId
                })
            }
        }
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    async updateZOrder(operation) {
        const checkedItems = this.#kitElement.querySelectorAll(".data-list-item-checkbox:checked");
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        const changes = [];
        for (const item of checkedItems) {
            const mapItemId = item.getAttribute("data-map-item-id");
            const mapItemGroupId = item.getAttribute("data-map-item-group-id");
            const mapItem = layer.mapItemGroups
                .find(mig => mig.id == mapItemGroupId).mapItems
                .find(mi => mi.id == mapItemId);
            const z = MapItemsEditDialogModel.#getNewZOrder(operation, layer, mapItem);
            if (mapItem.z != z) {
                changes.push({
                    changeType: "Edit",
                    changeObjectType: MapItem.name,
                    propertyName: "z",
                    oldValue: mapItem.z,
                    newValue: z,
                    layerName: layer.name,
                    mapItemGroupId: mapItemGroupId,
                    mapItemId: mapItemId
                })
            }
        }
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    async group() {

        // get new group info
        const checkedItems = this.#kitElement.querySelectorAll(".data-list-item-checkbox:checked");
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        const newGroupItems = [];
        for (const item of checkedItems) {
            const mapItemId = item.getAttribute("data-map-item-id");
            const mapItemGroupId = item.getAttribute("data-map-item-group-id");
            const mapItemData = layer.mapItemGroups
                .find(mig => mig.id == mapItemGroupId).mapItems
                .find(mi => mi.id == mapItemId)
                .getData();
            newGroupItems.push({
                mapItemGroupId: mapItemGroupId,
                mapItemData: mapItemData
            });
        }

        // get groups to edit or delete
        const editGroups = [];
        const deleteGroups = [];
        for (let index = layer.mapItemGroups.length - 1; index > -1; index--) {
            const mapItemGroupData = layer.mapItemGroups[index].getData();
            const isChangedGroup = newGroupItems.some(ngi => ngi.mapItemGroupId == mapItemGroupData.id);
            const mapItemsNotInGroup = mapItemGroupData.mapItems.filter(mi => !newGroupItems.some(ngi => ngi.mapItemData.id == mi.id));
            if (isChangedGroup) {
                if (mapItemsNotInGroup.length > 0) {
                    editGroups.push({
                        mapItemGroupId: mapItemGroupData.id,
                        originalMapItems: mapItemGroupData.mapItems,
                        remainingMapItems: mapItemsNotInGroup
                    });
                }
                else {
                    deleteGroups.push({
                        mapItemGroupData: mapItemGroupData,
                        index: index
                    })
                }
            }
        }

        // get selection status
        let hasPrimarySelection = layer.mapItemGroups.some(mig => mig.selectionStatus == SelectionStatusType.Primary);
        if (hasPrimarySelection) {
            hasPrimarySelection = !deleteGroups.some(g => g.mapItemGroupData.selectionStatus == SelectionStatusType.Primary);
        }
        const selectionStatus = hasPrimarySelection ? SelectionStatusType.Secondary : SelectionStatusType.Primary;

        // apply changes
        const changes = [];
        for (const deleteGroup of deleteGroups) {
            changes.push({
                changeType: "Delete",
                changeObjectType: Layer.name,
                propertyName: "mapItemGroups",
                itemIndex: deleteGroup.index,
                itemValue: deleteGroup.mapItemGroupData,
                layerName: layer.name,
            });
        }
        for (const editGroup of editGroups) {
            changes.push({
                changeType: "Edit",
                changeObjectType: MapItemGroup.name,
                propertyName: "mapItems",
                oldValue: editGroup.originalMapItems,
                newValue: editGroup.remainingMapItems,
                layerName: layer.name,
                mapItemGroupId: editGroup.mapItemGroupId
            })
        }
        let newGroupData = {
            mapItems: newGroupItems.map(ngi => ngi.mapItemData),
            selectionStatus: selectionStatus
        };
        newGroupData = new MapItemGroup(newGroupData).getData();
        changes.push({
            changeType: "Insert",
            changeObjectType: Layer.name,
            propertyName: "mapItemGroups",
            itemIndex: layer.mapItemGroups.length - deleteGroups.length,
            itemValue: newGroupData,
            layerName: layer.name,
        });
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    async unGroup() {

        // get new group info
        const checkedItems = this.#kitElement.querySelectorAll(".data-list-item-checkbox:checked");
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        const newGroupItems = [];
        for (const item of checkedItems) {
            const mapItemId = item.getAttribute("data-map-item-id");
            const mapItemGroupId = item.getAttribute("data-map-item-group-id");
            const mapItemData = layer.mapItemGroups
                .find(mig => mig.id == mapItemGroupId).mapItems
                .find(mi => mi.id == mapItemId)
                .getData();
            newGroupItems.push({
                mapItemGroupId: mapItemGroupId,
                mapItemData: mapItemData
            });
        }

        // get groups to edit or delete
        const editGroups = [];
        const deleteGroups = [];
        for (let index = layer.mapItemGroups.length - 1; index > -1; index--) {
            const mapItemGroupData = layer.mapItemGroups[index].getData();
            const isChangedGroup
                = mapItemGroupData.mapItems.length > 1
                && newGroupItems.some(ngi => ngi.mapItemGroupId == mapItemGroupData.id);
            const mapItemsNotInGroup = mapItemGroupData.mapItems.filter(mi => !newGroupItems.some(ngi => ngi.mapItemData.id == mi.id));
            if (isChangedGroup) {
                if (mapItemsNotInGroup.length > 0) {
                    editGroups.push({
                        mapItemGroupId: mapItemGroupData.id,
                        originalMapItems: mapItemGroupData.mapItems,
                        remainingMapItems: mapItemsNotInGroup
                    });
                }
                else {
                    deleteGroups.push({
                        mapItemGroupData: mapItemGroupData,
                        index: index
                    })
                }
            }
        }

        // get selection status
        let hasPrimarySelection = layer.mapItemGroups.some(mig => mig.selectionStatus == SelectionStatusType.Primary);
        if (hasPrimarySelection) {
            hasPrimarySelection = !deleteGroups.some(g => g.mapItemGroupData.selectionStatus == SelectionStatusType.Primary);
        }
        const selectionStatus = hasPrimarySelection ? SelectionStatusType.Secondary : SelectionStatusType.Primary;

        // apply changes
        const changes = [];
        for (const deleteGroup of deleteGroups) {
            changes.push({
                changeType: "Delete",
                changeObjectType: Layer.name,
                propertyName: "mapItemGroups",
                itemIndex: deleteGroup.index,
                itemValue: deleteGroup.mapItemGroupData,
                layerName: layer.name,
            });
        }
        for (const editGroup of editGroups) {
            changes.push({
                changeType: "Edit",
                changeObjectType: MapItemGroup.name,
                propertyName: "mapItems",
                oldValue: editGroup.originalMapItems,
                newValue: editGroup.remainingMapItems,
                layerName: layer.name,
                mapItemGroupId: editGroup.mapItemGroupId
            })
        }
        for (let index = 0; index < newGroupItems.length; index++) {
            let newGroupData = {
                mapItems: [newGroupItems[index].mapItemData],
                selectionStatus: SelectionStatusType.Secondary
            };
            if (index == 0) {
                newGroupData.selectionStatus = selectionStatus;
            }
            newGroupData = new MapItemGroup(newGroupData).getData();
            changes.push({
                changeType: "Insert",
                changeObjectType: Layer.name,
                propertyName: "mapItemGroups",
                itemIndex: layer.mapItemGroups.length - deleteGroups.length + index,
                itemValue: newGroupData,
                layerName: layer.name,
            });
        }
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    async togglePresentationView(isHidden) {
        const checkedItems = this.#kitElement.querySelectorAll(".data-list-item-checkbox:checked");
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        const changes = [];
        for (const item of checkedItems) {
            const mapItemId = item.getAttribute("data-map-item-id");
            const mapItemGroupId = item.getAttribute("data-map-item-group-id");
            const mapItem = layer.mapItemGroups
                .find(mig => mig.id == mapItemGroupId).mapItems
                .find(mi => mi.id == mapItemId);
            if (mapItem.isHidden != isHidden) {
                changes.push({
                    changeType: "Edit",
                    changeObjectType: MapItem.name,
                    propertyName: "isHidden",
                    oldValue: mapItem.isHidden,
                    newValue: isHidden,
                    layerName: layer.name,
                    mapItemGroupId: mapItemGroupId,
                    mapItemId: mapItemId
                })
            }
        }
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    async updateTemplate() {
        const templateId = this.#kitElement.querySelector("#edit-template-select").value;
        const parts = templateId.replace("ref-", "").split("-");
        const ref = {
            name: parts[0],
            versionId: parseInt(parts[1]),
            isBuiltIn: (parts[2] === "true"),
            isFromTemplate: (parts[3] === "true")
        };
        const checkedItems = this.#kitElement.querySelectorAll(".data-list-item-checkbox:checked");
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        const changes = [];
        for (const item of checkedItems) {
            const mapItemId = item.getAttribute("data-map-item-id");
            const mapItemGroupId = item.getAttribute("data-map-item-group-id");
            const mapItem = layer.mapItemGroups
                .find(mig => mig.id == mapItemGroupId).mapItems
                .find(mi => mi.id == mapItemId);
            if (!EntityReference.areEqual(mapItem.mapItemTemplateRef, ref)) {
                changes.push({
                    changeType: "Edit",
                    changeObjectType: MapItem.name,
                    propertyName: "mapItemTemplateRef",
                    oldValue: mapItem.mapItemTemplateRef.getData(),
                    newValue: ref,
                    layerName: layer.name,
                    mapItemGroupId: mapItemGroupId,
                    mapItemId: mapItemId
                });
            }
        }
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    async delete() {
        const checkedItems = this.#kitElement.querySelectorAll(".data-list-item-checkbox:checked");
        const map = await MapWorkerClient.getMap();
        const layer = map.getActiveLayer();
        const changes = [];
        for (const item of checkedItems) {
            const mapItemGroupId = item.getAttribute("data-map-item-group-id");
            const mapItemGroup = layer.mapItemGroups.find(mig => mig.id == mapItemGroupId);
            const index = layer.mapItemGroups.findIndex(mig => mig.id == mapItemGroupId);
            changes.push({
                changeType: ChangeType.Delete,
                changeObjectType: Layer.name,
                propertyName: "mapItemGroups",
                itemIndex: index,
                itemValue: mapItemGroup.getData(),
                layerName: layer.name
            });
        }
        function sortByItemIndex(item1, item2) {
            if (item1.itemIndex < item2.itemIndex) {
                return -1;
            }
            if (item1.itemIndex > item2.itemIndex) {
                return 1;
            }
            return 0;
        }
        changes.sort(sortByItemIndex);
        changes.reverse();
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    // helpers
    static #isVisible = false;
    static #actionsPanelMinimized = false;
    static #selectedAction = "map-items-edit-detail-find";
    static #filter = {
        mapItemTemplateName: "",
        caption: "",
        isSelected: false,
        isSelectedAttr: null
    };
    static #mapItemCount = null;
    static #selections = [];
    #kitElement = null;
    #dialogHelper = null;
    static #templates = [];

    #onCloseDialog = async () => {
        MapItemsEditDialogModel.#isVisible = false;
        await UIKit.renderer.renderKitElement(this.#kitElement);
    }

    #slideActions = (slideOpen) => {
        let actionsWidth = "45px";
        let showLabel = false;
        if (!MapItemsEditDialogModel.#actionsPanelMinimized && !slideOpen) {
            actionsWidth = "230px";
            showLabel = true;
        }
        const actionsLabel = this.#kitElement.querySelector("#map-items-edit-actions-label");
        if (showLabel) {
            actionsLabel.style.display = "block";
        }
        else {
            actionsLabel.style.display = "none";
        }
        UIKit.document.documentElement.style.setProperty("--map-items-edit-actions-width", actionsWidth);
    }

    static #getNewZOrder(operation, layer, mapItem) {
        switch (operation) {
            case "SendToBack":
                return MapItemsEditDialogModel.#getBackZ(layer, mapItem);
                break;
            case "SendBack":
                return MapItemsEditDialogModel.#getNextZBack(layer, mapItem);
                break;
            case "BringForward":
                return MapItemsEditDialogModel.#getNextZForward(layer, mapItem);
                break;
            case "BringToFront":
                return MapItemsEditDialogModel.#getFrontZ(layer, mapItem);
                break;
            default:
                return mapItem.z;
                break;
        }
    }

    static #getNextZForward(layer, currentMapItem) {
        let minZ = null;
        for (const mapItemGroup of layer.mapItemGroups) {
            for (const mapItem of mapItemGroup.mapItems) {
                if (mapItem.zGroup == currentMapItem.zGroup
                    && mapItem.id != currentMapItem.id
                    && mapItem.z >= currentMapItem.z) {
                    if (mapItem.z == currentMapItem.z) {
                        return currentMapItem.z + MapItemsEditDialogModel.#getZInc(currentMapItem.z);
                    }
                    if (!minZ || mapItem.z < minZ) {
                        minZ = mapItem.z;
                    }
                }
            }
        }
        if (minZ != null) {
            return minZ + MapItemsEditDialogModel.#getZInc(minZ);
        }
        return currentMapItem.z;
    }

    static #getNextZBack(layer, currentMapItem) {
        let maxZ = null;
        for (const mapItemGroup of layer.mapItemGroups) {
            for (const mapItem of mapItemGroup.mapItems) {
                if (mapItem.zGroup == currentMapItem.zGroup
                    && mapItem.id != currentMapItem.id
                    && mapItem.z <= currentMapItem.z) {
                    if (mapItem.z == currentMapItem.z) {
                        return currentMapItem.z - MapItemsEditDialogModel.#getZInc(currentMapItem.z);
                    }
                    if (!maxZ || mapItem.z > maxZ) {
                        maxZ = mapItem.z;
                    }
                }
            }
        }
        if (maxZ != null) {
            return maxZ - MapItemsEditDialogModel.#getZInc(maxZ);
        }
        return currentMapItem.z;
    }

    static #getFrontZ(layer, currentMapItem) {
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
            return maxZ + 32;
        }
        return currentMapItem.z;
    }

    static #getBackZ(layer, currentMapItem) {
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
            return minZ - 32;
        }
        return currentMapItem.z;
    }

    static #getZInc(value) {
        if (value % 32 == 0) {
            return 16;
        }
        if (value % 16 == 0) {
            return 8;
        }
        if (value % 8 == 0) {
            return 4;
        }
        if (value % 4 == 0) {
            return 2;
        }
        return 1
    }

    static #saveCurrentSelections(checkedItems) {
        const selections = [];
        for (const item of checkedItems) {
            selections.push(item.getAttribute("data-map-item-id"));
        }
        MapItemsEditDialogModel.#selections = selections;
    }

    static async #getTemplates() {
        const map = await MapWorkerClient.getMap();
        if (!map) {
            return [];
        }
        function sortRefsByName(ref1, ref2) {
            if (ref1.name < ref2.name) {
                return -1;
            }
            if (ref1.name > ref2.name) {
                return 1;
            }
            return 0;
        }
        const templates = map.mapItemTemplateRefs.map(ref => ({
            id: `ref-${ref.name}-${ref.versionId}-${ref.isBuiltIn}-${ref.isFromTemplate}`,
            name: ref.name,
            displayName: ref.name.length > 25 ? ref.name.slice(0, 25) + "..." : ref.name
        }));
        templates.sort(sortRefsByName);
        templates.unshift({
            id: "ref-none-1-true-false",
            name: "[None]",
            displayName: "[None]"
        })
        return templates;
    }

    #loadTemplates() {
        const select = this.#kitElement.querySelector("#edit-template-select");
        if (select) {
            for (const template of MapItemsEditDialogModel.#templates) {
                const option = UIKit.document.createElement("option");
                option.value = template.id;
                option.title = template.name;
                option.innerHTML = template.displayName;
                select.appendChild(option);
            }
        }
    }
}
