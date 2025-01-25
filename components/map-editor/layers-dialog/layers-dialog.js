
import { ChangeSet, ChangeType, InputUtilities, Layer, Map, MapWorkerClient, MapWorkerInputMessageType } from "../../../domain/references.js";
import { KitDependencyManager, KitRenderer } from "../../../ui-kit.js";

export function createModel() {
    return new LayersDialogModel();
}

class LayersDialogModel {

    async onRenderStart(componentId) {
        this.componentId = componentId;
    }

    async onRenderComplete() {
    }

    async showDialog() {
        this.#isVisible = true;
        await this.#reRenderDialog();
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const dialog = componentElement.querySelector("dialog");
        dialog.showModal();
        
        dialog.addEventListener('click', function (event) {
            var rect = dialog.getBoundingClientRect();
            var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
                rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
            if (!isInDialog) {
                dialog.close();
            }
        });
        
    }

    #isVisible;
    isVisible() {
        return this.#isVisible
    }

    async getMap() {
        return await MapWorkerClient.getMap();
    }

    async getLayers() {
        const map = await this.getMap();
        if (map) {
            const layers = [];
            for (let i = map.layers.length - 1; i >= 0; i--) {
                layers.push(map.layers[i]);
            }
            return layers;
        }
        return [];
    }

    async onActiveLayerChange() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const inputActiveLayer = componentElement.querySelector("#inputActiveLayer");
        const newActiveLayerName = inputActiveLayer.value;
        const map = await this.getMap();
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
        await this.#updateMap(changes);
        await this.#reRenderDialog();
    }

    async showLayer(evt, layerName) {

        // select layer element
        evt.stopPropagation();
        await this.selectLayer(layerName);

        // update map
        const map = await this.getMap();
        const changes = [
            {
                changeType: ChangeType.Edit,
                changeObjectType: Layer.name,
                propertyName: "isHidden",
                oldValue: true,
                newValue: false,
                layerName: layerName
            }
        ];
        await this.#updateMap(changes);

        // re-render dialog
        await this.#reRenderDialog();
    }

    async canHideLayer(layerName) {
        const map = await this.getMap();
        if (map.activeLayer == layerName) {
            return "disabled";
        }
        return null;
    }

    async hideLayer(evt, layerName) {

        // select layer element
        evt.stopPropagation();
        await this.selectLayer(layerName);

        // update map
        const map = await this.getMap();
        const changes = [
            {
                changeType: ChangeType.Edit,
                changeObjectType: Layer.name,
                propertyName: "isHidden",
                oldValue: false,
                newValue: true,
                layerName: layerName
            }
        ];
        await this.#updateMap(changes);

        // re-render dialog
        await this.#reRenderDialog();

    }

    async addLayer() {
        // update map
        const map = await this.getMap();
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
        await this.#updateMap(changes);

        // re-render dialog
        await this.#reRenderDialog();
    }

    async showEdit(evt, layerName) {

        // select layer element
        evt.stopPropagation();
        await this.selectLayer(layerName);

        // find layer element
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const layerElements = componentElement.querySelectorAll(".layer-item");
        let selectedLayerElement = null;
        for (const layerElement of layerElements) {
            const layerElementName = layerElement.getAttribute("data-layer-name");
            if (layerElementName == layerName) {
                selectedLayerElement = layerElement;
                break;
            }
        }
        if (!selectedLayerElement) {
            return;
        }

        const label = selectedLayerElement.querySelector("label");
        label.style.display = "none";
        const input = selectedLayerElement.querySelector("input");
        input.value = layerName;
        input.style.display = "block";
        input.focus();
    }

    async editLayer(layerName) {

        // find layer element
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const layerElements = componentElement.querySelectorAll(".layer-item");
        let selectedLayerElement = null;
        for (const layerElement of layerElements) {
            const layerElementName = layerElement.getAttribute("data-layer-name");
            if (layerElementName == layerName) {
                selectedLayerElement = layerElement;
                break;
            }
        }
        if (!selectedLayerElement) {
            return;
        }

        const input = selectedLayerElement.querySelector("input");
        input.style.display = "none";
        const newLayerName = InputUtilities.cleanseString(input.value);

        const map = await this.getMap();
        const layer = map.layers.find(l => l.name == layerName);
        const existingLayer = map.layers.find(l => l.name == newLayerName);
        const label = selectedLayerElement.querySelector("label");
        label.style.display = "block";
        if (!layer || !newLayerName || existingLayer) {
            return;
        }
        label.innerHTML = newLayerName;    
        if (newLayerName != layerName) {
            
            if (layer && !existingLayer) {
                const changes = [
                    {
                        changeType: ChangeType.Edit,
                        changeObjectType: Layer.name,
                        propertyName: "name",
                        oldValue: layer.name,
                        newValue: newLayerName,
                        layerName: layer.name
                    }
                ];
                if (map.activeLayer == layerName) {
                    changes.push({
                        changeType: ChangeType.Edit,
                        changeObjectType: Map.name,
                        propertyName: "activeLayer",
                        oldValue: map.activeLayer,
                        newValue: newLayerName
                    })
                }
                await this.#updateMap(changes);
                await this.#reRenderDialog();
                return;
            }
        }
    }

    async selectLayer(layerName) {
        const map = await this.getMap();   
        const activeLayerName = map.activeLayer;
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const layerElements = componentElement.querySelectorAll(".layer-item");
        let selectedLayerName = null;
        for (const layerElement of layerElements) {
            const layerElementName = layerElement.getAttribute("data-layer-name");
            if (layerElementName == layerName) {
                layerElement.setAttribute("data-selected", "true");
                selectedLayerName = layerElement.getAttribute("data-layer-name");
            }
            else {
                layerElement.setAttribute("data-selected", "false");
            }
        }
        const canDelete = selectedLayerName && (selectedLayerName != activeLayerName);
        const deleteButton = componentElement.querySelector("#delete-button");
        deleteButton.disabled = !canDelete;
    }

    async deleteLayer() {

        // find selected layer
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const layerElement = componentElement.querySelector(".layer-item[data-selected='true']");
        const map = await this.getMap();  
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
        await this.#updateMap(changes);

        // re-render dialog
        await this.#reRenderDialog();
    }

    async moveLayer(evt, layerName) {
        if (!evt?.dataTransfer) {
            return;
        }
        evt.dataTransfer.setData("text", layerName);
        const dragStartEvent = new DragEvent("dragstart", {
            bubbles: true,
            cancelable: true,
            clientX: evt.clientX,
            clientY: evt.clientY,
        });
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const layerItemComponent = componentElement.querySelector(`[data-layer-name="${layerName}"]`);
        layerItemComponent.dispatchEvent(dragStartEvent);
    }

    layerDrag(evt) {
        const layerName = evt.srcElement.getAttribute("data-layer-name");
        evt.dataTransfer.setData("text", layerName);
    }

    allowLayerDrop(evt) {
        evt.preventDefault();
    }

    async layerDrop(evt) {
        
        // get current and new indices
        evt.preventDefault();
        const layerName = evt.dataTransfer.getData("text");
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const layerElements = componentElement.querySelectorAll(".layer-item");
        const mouseY = evt.clientY;
        let currentIndex = -1;
        let newIndex = -1;
        const length = layerElements.length;
        const map = await this.getMap();
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
        await this.#updateMap(changes);

        // re-render dialog
        await this.#reRenderDialog();
    }

    closeDialog() {
        this.#isVisible = false;
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("dialog").close();
    }

    // helpers
    async #reRenderDialog() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const kitIfVisibleElement = componentElement.querySelector("#kitIfVisible");
        const componentId = kitIfVisibleElement.getAttribute("data-kit-component-id");
        await KitRenderer.renderComponent(componentId);
        await this.#loadActiveLayerList();
    }

    async #loadActiveLayerList() {
        const map = await this.getMap();
        const appDocument = KitDependencyManager.getDocument();
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const inputActiveLayer = componentElement.querySelector("#inputActiveLayer");
        for (const layer of map.layers) {
            const option = appDocument.createElement('option');
            let displayName = layer.name;
            if (displayName.length > 25) {
                displayName = displayName.slice(0, 25) + "...";
            }
            option.value = layer.name;
            option.title = layer.name;
            option.innerHTML = displayName;
            option.selected = (map.activeLayer == layer.name);
            inputActiveLayer.appendChild(option);
        }
    }

    async #updateMap(changes) {

        // update local copy
        const map = await this.getMap();
        map.applyChangeSet(new ChangeSet({ changes: changes }));

        // update map worker
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }
}
