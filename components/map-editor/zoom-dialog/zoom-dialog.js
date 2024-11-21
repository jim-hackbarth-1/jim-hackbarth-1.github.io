
import { ChangeType, Map, MapWorkerClient, MapWorkerInputMessageType } from "../../../domain/references.js";
import { KitMessenger, KitRenderer } from "../../../ui-kit.js";
import { EditorModel } from "../editor/editor.js";

export function createModel() {
    return new ZoomDialogModel();
}

class ZoomDialogModel {

    #zoomPercent = 100;

    async onRenderStart(componentId) {
        this.componentId = componentId;
    }

    async onRenderComplete() {      
    }

    async showDialog() {

        this.#zoomPercent = 100;
        const map = await MapWorkerClient.getMap();
        if (map) {
            this.#zoomPercent = map.zoom * 100;
        }
        this.#displayCurrentZoom();
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

    getZoom() {
        return parseFloat(this.#zoomPercent).toFixed(0) + "%"
    }

    async zoomOut() {
        let zoom = 25;
        switch (true) {
            case (this.#zoomPercent > 400):
                zoom = 400;
                break;
            case (this.#zoomPercent > 200):
                zoom = 200;
                break;
            case (this.#zoomPercent > 150):
                zoom = 150;
                break;
            case (this.#zoomPercent > 125):
                zoom = 125;
                break;
            case (this.#zoomPercent > 100):
                zoom = 100;
                break;
            case (this.#zoomPercent > 75):
                zoom = 75;
                break;
            case (this.#zoomPercent > 50):
                zoom = 50;
                break;
        }
        await this.onZoomChange(`${zoom}`);
    }

    async zoomIn() {
        let zoom = 400;
        switch (true) {
            case (this.#zoomPercent < 25):
                zoom = 25;
                break;
            case (this.#zoomPercent < 50):
                zoom = 50;
                break;
            case (this.#zoomPercent < 75):
                zoom = 75;
                break;
            case (this.#zoomPercent < 100):
                zoom = 100;
                break;
            case (this.#zoomPercent < 125):
                zoom = 125;
                break;
            case (this.#zoomPercent < 150):
                zoom = 150;
                break;
            case (this.#zoomPercent < 200):
                zoom = 200;
                break;
        }
        await this.onZoomChange(`${zoom}`);
    }

    async onZoomChange(value) {
        if (value) {
            value = value.replace("%", "");
        }
        let numberValue = parseFloat(value);
        if (isNaN(numberValue)) {
            numberValue = 100;
        }
        if (numberValue < 25) {
            numberValue = 25;
        }
        if (numberValue > 400) {
            numberValue = 400;
        }
        this.#zoomPercent = numberValue;
        const map = await MapWorkerClient.getMap();
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            change: {
                changeObjectType: Map.name,
                changeObjectRef: map.ref,
                changeType: ChangeType.Edit,
                changeData: [
                    {
                        propertyName: "zoom",
                        oldValue: map.zoom,
                        newValue: this.#zoomPercent / 100
                    }
                ]
            }

        });
        this.#displayCurrentZoom();
    }

    onZoomBlur() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("#zoom-current").value = this.getZoom();
    }

    zoomToFit() {
        console.log("not yet implemented");
    }

    closeDialog() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("dialog").close();
    }

    #displayCurrentZoom() {
        const zoomInDisabled = this.#zoomPercent === 400;
        let zoomOutDisabled = this.#zoomPercent === 25;
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("#zoom-current").value = this.getZoom();
        componentElement.querySelector("#zoom-in").disabled = zoomInDisabled;
        componentElement.querySelector("#zoom-out").disabled = zoomOutDisabled;
    }
}
