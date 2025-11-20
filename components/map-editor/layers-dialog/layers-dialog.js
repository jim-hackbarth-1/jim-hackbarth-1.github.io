
import { ChangeType, InputUtilities, Layer, Map, MapWorkerClient, MapWorkerInputMessageType } from "../../../domain/references.js";
import { EditorModel } from "../editor/editor.js";
import { DialogHelper } from "../../shared/dialog-helper.js";

export function createModel() {
    return new LayersDialogModel();
}

class LayersDialogModel {

    // event handlers
    async init(kitElement) {
        this.#kitElement = kitElement;
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
        if (LayersDialogModel.#isVisible) {
            const dialog = this.#kitElement.querySelector("dialog");
            const header = this.#kitElement.querySelector("header");
            this.#dialogHelper = new DialogHelper();
            this.#dialogHelper.show(dialog, header, this.#onCloseDialog);
        }
    }

    async onMapUpdated(message) {
        if (LayersDialogModel.#isVisible) {
            const layersElement = this.#kitElement.querySelector("#layer-list");
            await UIKit.renderer.renderElement(layersElement);
        }
    }

    // methods
    isVisible() {
        return LayersDialogModel.#isVisible;
    }

    async showDialog() {
        LayersDialogModel.#isVisible = true;
        await UIKit.renderer.renderElement(this.#kitElement);
    }

    closeDialog() {
        this.#dialogHelper.close();
    }

    async addLayer() {
        const map = await MapWorkerClient.getMap();
        let layerName = null;
        for (let i = 1; i <= 100; i++) {
            if (!map.layers.some(l => l.name == `Layer ${i}`)) {
                layerName = `Layer ${i}`;
                break;
            }
        }
        if (!layerName) {
            layerName = `Layer ${crypto.randomUUID()}`;
        }
        const layerData = { name: layerName };
        const changes = [
            {
                changeType: ChangeType.Insert,
                changeObjectType: Map.name,
                propertyName: "layers",
                itemIndex: map.layers.length,
                itemValue: layerData
            }
        ];
        await LayersDialogModel.#updateMap(changes);
    }

    allowLayerDrop(evt) {
        evt.preventDefault();
    }

    async layerDrop(evt) {

        // get current and new indices
        evt.preventDefault();
        const layerName = evt.dataTransfer.getData("text");
        const layerElements = this.#kitElement.querySelectorAll(".layer-item");
        const mouseY = evt.clientY;
        let currentIndex = -1;
        let newIndex = -1;
        const length = layerElements.length;
        const map = await MapWorkerClient.getMap();
        for (let i = length - 1; i >= 0; i--) {

            const elementLayerName = layerElements[i].getAttribute("data-layer-name");
            if (elementLayerName == layerName) {
                currentIndex = length - 1 - i;
            }
            const rect = layerElements[i].getBoundingClientRect();
            const elementY = rect.top + rect.height / 2;
            if (mouseY < elementY) {
                newIndex = length - 1 - i;
            }
        }
        if (newIndex < currentIndex) {
            newIndex++;
        }
        if (newIndex == currentIndex) {
            return;
        }

        // update map
        const layerData = map.layers[currentIndex].getData();
        const changes = [
            {
                changeType: ChangeType.Delete,
                changeObjectType: Map.name,
                propertyName: "layers",
                itemIndex: currentIndex,
                itemValue: layerData
            },
            {
                changeType: ChangeType.Insert,
                changeObjectType: Map.name,
                propertyName: "layers",
                itemIndex: newIndex,
                itemValue: layerData
            }
        ];
        await LayersDialogModel.#updateMap(changes);
    }

    async getLayers() {
        const map = await MapWorkerClient.getMap();
        if (map) {
            const layers = [];
            for (let i = map.layers.length - 1; i >= 0; i--) {
                layers.push(map.layers[i]);
            }
            return layers.map(l => LayersDialogModel.#mapLayer(l, map.activeLayer));
        }
        return [];
    }

    layerDrag(evt) {
        const layerName = evt.srcElement.getAttribute("data-layer-name");
        evt.dataTransfer.setData("text", layerName);
    }

    async layerActivated(newActiveLayerName) {
        const map = await MapWorkerClient.getMap();
        const currentActiveLayer = map.getActiveLayer();
        const newActiveLayer = map.layers.find(l => l.name == newActiveLayerName);
        const changes = [];
        if (newActiveLayer.isHidden) {
            changes.push({
                changeType: ChangeType.Edit,
                changeObjectType: Layer.name,
                propertyName: "isHidden",
                oldValue: true,
                newValue: false,
                layerName: newActiveLayerName
            });
        }
        changes.push({
            changeType: ChangeType.Edit,
            changeObjectType: Map.name,
            propertyName: "activeLayer",
            oldValue: currentActiveLayer.name,
            newValue: newActiveLayerName
        });
        if (currentActiveLayer.mapItemGroups.some(mig => mig.selectionStatus)) {
            MapWorkerClient.postWorkerMessage({ messageType: MapWorkerInputMessageType.UnSelectAll });
        }
        await LayersDialogModel.#updateMap(changes);
    }

    async validateLayerName(layerName, input) {
        let isValid = false;
        let newLayerName = input.value.trim();
        newLayerName = LayersDialogModel.removeHtmlCharacters(newLayerName);
        if (newLayerName) {
            isValid = true;
            if (layerName != newLayerName) {
                const map = await MapWorkerClient.getMap();
                const existingLayer = map.layers.find(l => l.name == newLayerName);
                if (existingLayer) {
                    isValid = false;
                }
            }
        }
        const layerItemElement = this.#kitElement.querySelector(`[data-layer-name="${layerName}"]`);
        const validationElement = layerItemElement.querySelector(".validation-message");
        const okButton = layerItemElement.querySelector(".edit-button-ok");
        if (isValid) {
            validationElement.classList.add("is-valid");
            okButton.disabled = false;
        }
        else {
            validationElement.classList.remove("is-valid");
            okButton.disabled = true;
        }
    }

    async editLayer(layerName) {

        // get values
        const layerItemElement = this.#kitElement.querySelector(`[data-layer-name="${layerName}"]`);
        const editContainer = layerItemElement.querySelector(".edit-container");
        let newLayerName = editContainer.querySelector("input[type='text']").value;
        newLayerName = LayersDialogModel.removeHtmlCharacters(newLayerName);
        const isHidden = editContainer.querySelector("input[type='checkbox']").checked;

        // update map
        const map = await MapWorkerClient.getMap();
        const layer = map.layers.find(l => l.name == layerName);
        let existingLayer = false;
        if (layerName != newLayerName && map.layers.find(l => l.name == newLayerName)) {
            existingLayer = true;
        }
        if (!layer || !newLayerName || existingLayer) {
            return;
        }
        const changes = [];
        if (isHidden != layer.isHidden) {
            changes.push({
                changeType: ChangeType.Edit,
                changeObjectType: Layer.name,
                propertyName: "isHidden",
                oldValue: layer.isHidden,
                newValue: isHidden,
                layerName: layerName
            })
        }
        if (newLayerName != layerName) {
            changes.push({
                changeType: ChangeType.Edit,
                changeObjectType: Layer.name,
                propertyName: "name",
                oldValue: layer.name,
                newValue: newLayerName,
                layerName: layer.name
            });
            if (map.activeLayer == layerName) {
                changes.push({
                    changeType: ChangeType.Edit,
                    changeObjectType: Map.name,
                    propertyName: "activeLayer",
                    oldValue: map.activeLayer,
                    newValue: newLayerName
                })
            }
        }
        if (changes.length > 0) {
            await LayersDialogModel.#updateMap(changes);
        }
        else {
            this.toggleEdit(layerName);
        }
    }

    toggleEdit(layerName) {
        const layerItemElement = this.#kitElement.querySelector(`[data-layer-name="${layerName}"]`);
        const editContainer = layerItemElement.querySelector(".edit-container");
        editContainer.classList.toggle("hide-edit");
    }

    async deleteLayer(layerName) {

        // find selected layer
        const layerElement = this.#kitElement.querySelector(`[data-layer-name="${layerName}"]`);
        const map = await MapWorkerClient.getMap();
        const length = map.layers.length;
        let layerIndex = -1;
        if (layerElement) {
            layerIndex = length - 1 - layerElement.getAttribute("data-layer-index");
        }
        if (!layerIndex || layerIndex < 0) {
            return;
        }

        // update map
        const layerToDelete = map.layers[layerIndex].getData();
        if (map.activeLayer == layerToDelete.name) {
            return;
        }
        const changes = [
            {
                changeType: ChangeType.Delete,
                changeObjectType: Map.name,
                propertyName: "layers",
                itemIndex: layerIndex,
                itemValue: layerToDelete
            }
        ];
        await LayersDialogModel.#updateMap(changes);
    }

    // helpers
    static #isVisible = false;
    #kitElement = null;
    #dialogHelper = null;

    #onCloseDialog = async () => {
        LayersDialogModel.#isVisible = false;
        await UIKit.renderer.renderElement(this.#kitElement);
    }

    static #mapLayer(layer, activeLayerName) {
        let displayName = layer.name;
        if (displayName.length > 25) {
            displayName = displayName.slice(0, 25) + "...";
        }
        const isActive = layer.name == activeLayerName;
        return {
            name: layer.name,
            displayName: displayName,
            isActive: isActive,
            isHidden: layer.isHidden
        }
    }

    static async #updateMap(changes) {
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    static removeHtmlCharacters(string) {
        return string
            .replaceAll("&", "")
            .replaceAll("<", "")
            .replaceAll(">", "")
            .replaceAll("'", "")
            .replaceAll('"', "");
    }
}
