
import { ChangeType, Map, MapWorkerClient, MapWorkerInputMessageType } from "../../../domain/references.js";
import { KitMessenger, KitRenderer } from "../../../ui-kit.js";
import { EditorModel } from "../editor/editor.js";

export function createModel() {
    return new OverlayDialogModel();
}

class OverlayDialogModel {

    async onRenderStart(componentId) {
        this.componentId = componentId;
    }

    async onRenderComplete() {
        KitMessenger.subscribe(EditorModel.MapUpdatedNotificationTopic, this.componentId, this.onMapUpdated.name);
    }

    async showDialog() {
        this.#isVisible = true;
        await this.#reRenderElement("kitIfVisible");
        const map = await MapWorkerClient.getMap();
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("#inputPattern").value = map.overlay.pattern;
        componentElement.querySelector("#inputSize").value = map.overlay.size;
        componentElement.querySelector("#inputColor").value = map.overlay.color;
        componentElement.querySelector("#inputOpacity").value = map.overlay.opacity * 100;
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

    #clickHandlerRegistered;

    #isVisible;
    isVisible() {
        return this.#isVisible
    }

    async onOverlayChange() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const pattern = componentElement.querySelector("#inputPattern").value;
        const size = Number(componentElement.querySelector("#inputSize").value);
        const color = componentElement.querySelector("#inputColor").value;
        const opacity = (Number(componentElement.querySelector("#inputOpacity").value) / 100).toFixed(2);
        const overlayData = { pattern: pattern, size: size, color: color, opacity: opacity };
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

    async onMapUpdated(message) {
        const map = await MapWorkerClient.getMap();
        if (map && this.#isVisible) {
            const componentElement = KitRenderer.getComponentElement(this.componentId);
            componentElement.querySelector("#inputPattern").value = map.overlay.pattern;
            componentElement.querySelector("#inputSize").value = map.overlay.size;
            componentElement.querySelector("#inputColor").value = map.overlay.color;
            componentElement.querySelector("#inputOpacity").value = map.overlay.opacity * 100;
        }
    }

    closeDialog() {
        this.#isVisible = false;
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("dialog").close();
    }

    async #reRenderElement(elementId) {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const element = componentElement.querySelector(`#${elementId}`);
        const componentId = element.getAttribute("data-kit-component-id");
        await KitRenderer.renderComponent(componentId);
    }
}
