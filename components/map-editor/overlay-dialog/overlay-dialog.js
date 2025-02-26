
import { ChangeType, Map, MapWorkerClient, MapWorkerInputMessageType } from "../../../domain/references.js";
import { KitRenderer } from "../../../ui-kit.js";

export function createModel() {
    return new OverlayDialogModel();
}

class OverlayDialogModel {

    async onRenderStart(componentId) {
        this.componentId = componentId;
    }

    async onRenderComplete() {
    }

    async showDialog() {
        const map = await MapWorkerClient.getMap();
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("#inputPattern").value = map.overlay.pattern;
        componentElement.querySelector("#inputSize").value = map.overlay.size;
        componentElement.querySelector("#inputColor").value = map.overlay.color;
        componentElement.querySelector("#inputOpacity").value = map.overlay.opacity * 100;
        componentElement.querySelector("#inputSnap").checked = map.overlay.isSnapToOverlayEnabled;
        const dialog = componentElement.querySelector("dialog");
        dialog.showModal();
        if (!this.#clickHandlerRegistered) {
            dialog.addEventListener('click', function (event) {
                var rect = dialog.getBoundingClientRect();
                var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
                    rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
                if (!isInDialog) {
                    dialog.close();
                }
            });
        }
    }

    #clickHandlerRegistered;

    async onOverlayChange() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const pattern = componentElement.querySelector("#inputPattern").value;
        const size = Number(componentElement.querySelector("#inputSize").value);
        const color = componentElement.querySelector("#inputColor").value;
        const opacity = (Number(componentElement.querySelector("#inputOpacity").value) / 100).toFixed(2);
        const isSnapEnabled = componentElement.querySelector("#inputSnap").checked;
        const overlayData = { pattern: pattern, size: size, color: color, opacity: opacity, isSnapToOverlayEnabled: isSnapEnabled };
        const map = await MapWorkerClient.getMap();

        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: {
                changes: [{
                    changeType: ChangeType.Edit,
                    changeObjectType: Map.name,
                    propertyName: "overlay",
                    oldValue: map.overlay.getData(),
                    newValue: overlayData
                }]
            }
        });
    }

    closeDialog() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("dialog").close();
    }
}
