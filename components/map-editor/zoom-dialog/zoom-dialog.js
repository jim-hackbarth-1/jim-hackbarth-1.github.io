
import { ChangeType, Map, MapWorkerClient, MapWorkerInputMessageType } from "../../../domain/references.js";
import { KitMessenger, KitRenderer } from "../../../ui-kit.js";
import { DomHelper } from "../../shared/dom-helper.js";
import { EditorModel } from "../editor/editor.js";

export function createModel() {
    return new ZoomDialogModel();
}

class ZoomDialogModel {

    // event handlers
    async onRenderStart(componentId) {
        this.componentId = componentId;
    }

    async onRenderComplete() {    
        KitMessenger.subscribe(EditorModel.MapUpdatedNotificationTopic, this.componentId, this.onMapUpdated.name);
    }

    async onMapUpdated(message) {
        const map = await MapWorkerClient.getMap();
        if (map && this.#isVisible) {
            this.#zoomPercent = map.zoom * 100;
            this.#displayCurrentZoom();
        }
    }

    // methods
    #clickHandlerRegistered;
    async showDialog() {
        this.#isVisible = true;
        await DomHelper.reRenderElement(this.#componentElement, "kitIfVisible");
        this.#zoomPercent = 100;
        const map = await MapWorkerClient.getMap();
        if (map) {
            this.#zoomPercent = map.zoom * 100;
        }
        this.#displayCurrentZoom();
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
        numberValue = numberValue.toFixed(0);
        this.#zoomPercent = numberValue;
        let zoom = this.#zoomPercent / 100;
        zoom = zoom.toFixed(2);
        const map = await MapWorkerClient.getMap();
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: {
                changes: [{
                    changeType: ChangeType.Edit,
                    changeObjectType: Map.name,
                    propertyName: "zoom",
                    oldValue: map.zoom,
                    newValue: zoom
                }]
            }
        });
        this.#displayCurrentZoom();
    }

    onZoomBlur() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("#zoom-current").value = this.getZoom();
    }

    async zoomToFit() {
        // get bounds to fit
        const map = await MapWorkerClient.getMap();
        const boundsToFit = this.#getBoundsToFit(map);

        // get canvas size
        const canvasSize = MapWorkerClient.getCurrentCanvasSize();

        // get pan
        const pan = { x: -boundsToFit.x, y: -boundsToFit.y };

        // get zoom
        let zoom = Math.min(canvasSize.width / boundsToFit.width, canvasSize.height / boundsToFit.height);
        zoom = zoom.toFixed(2);
        if (zoom < 0.25) {
            zoom = 0.25;
        }
        if (zoom > 4) {
            zoom = 4;
        }

        // set pan and zoom
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: {
                changes: [
                    {
                        changeType: ChangeType.Edit,
                        changeObjectType: Map.name,
                        propertyName: "zoom",
                        oldValue: map.zoom,
                        newValue: zoom
                    },
                    {
                        changeType: ChangeType.Edit,
                        changeObjectType: Map.name,
                        propertyName: "pan",
                        oldValue: map.pan,
                        newValue: pan
                    }
                ]
            }
        });
        
        // display current zoom
        this.#zoomPercent = zoom * 100;
        this.#displayCurrentZoom();
    }

    closeDialog() {
        this.#isVisible = false;
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("dialog").close();
    }

    // helpers
    #zoomPercent = 100;

    #componentElementInternal;
    get #componentElement() {
        if (!this.#componentElementInternal) {
            this.#componentElementInternal = KitRenderer.getComponentElement(this.componentId);
        }
        return this.#componentElementInternal
    }

    #displayCurrentZoom() {
        const zoomInDisabled = this.#zoomPercent === 400;
        let zoomOutDisabled = this.#zoomPercent === 25;
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("#zoom-current").value = this.getZoom();
        componentElement.querySelector("#zoom-in").disabled = zoomInDisabled;
        componentElement.querySelector("#zoom-out").disabled = zoomOutDisabled;
    }

    #getBoundsToFit(map) {
        let xMin = NaN, xMax = NaN, yMin = NaN, yMax = NaN;
        for (const layer of map.layers) {
            for (const mapItemGroup of layer.mapItemGroups) {
                if (isNaN(xMin) || mapItemGroup.bounds.x < xMin) {
                    xMin = mapItemGroup.bounds.x;
                }
                if (isNaN(xMax) || mapItemGroup.bounds.x + mapItemGroup.bounds.width > xMax) {
                    xMax = mapItemGroup.bounds.x + mapItemGroup.bounds.width;
                }
                if (isNaN(yMin) || mapItemGroup.bounds.y < yMin) {
                    yMin = mapItemGroup.bounds.y;
                }
                if (isNaN(yMax) || mapItemGroup.bounds.y + mapItemGroup.bounds.height > yMax) {
                    yMax = mapItemGroup.bounds.y + mapItemGroup.bounds.height;
                }
            }
        }
        return { x: xMin - 5, y: yMin - 5, width: xMax - xMin + 10, height: yMax - yMin + 10 };
    }
}
