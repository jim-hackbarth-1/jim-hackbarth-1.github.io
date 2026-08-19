
import { ChangeType, Map, MapWorkerClient, MapWorkerInputMessageType } from "../../../domain/references.js";
import { DialogHelper } from "../../shared/dialog-helper.js";

export function createModel() {
    return new ZoomDialogModel();
}

class ZoomDialogModel {

    // event handlers
    async init(kitElement) {
        this.#kitElement = kitElement;
    }

    async onRendered() {
        if (ZoomDialogModel.#isVisible) {
            ZoomDialogModel.#zoomPercent = 100;
            const map = await MapWorkerClient.getMap();
            if (map) {
                ZoomDialogModel.#zoomPercent = map.zoom * 100;
            }
            this.#displayCurrentZoom();
            const dialog = this.#kitElement.querySelector("dialog");
            const header = this.#kitElement.querySelector("header");
            this.#dialogHelper = new DialogHelper();
            this.#dialogHelper.show(dialog, header, this.#onCloseDialog);
        }
    }

    // methods
    isVisible() {
        return ZoomDialogModel.#isVisible;
    }

    async showDialog() {
        ZoomDialogModel.#isVisible = true;
        await UIKit.renderer.renderElement(this.#kitElement);
    }

    closeDialog() {
        this.#dialogHelper.close();
    }

    getZoom() {
        return parseFloat(ZoomDialogModel.#zoomPercent).toFixed(0) + "%"
    }

    async zoomOut() {
        let zoom = 25;
        switch (true) {
            case (ZoomDialogModel.#zoomPercent > 400):
                zoom = 400;
                break;
            case (ZoomDialogModel.#zoomPercent > 200):
                zoom = 200;
                break;
            case (ZoomDialogModel.#zoomPercent > 150):
                zoom = 150;
                break;
            case (ZoomDialogModel.#zoomPercent > 125):
                zoom = 125;
                break;
            case (ZoomDialogModel.#zoomPercent > 100):
                zoom = 100;
                break;
            case (ZoomDialogModel.#zoomPercent > 75):
                zoom = 75;
                break;
            case (ZoomDialogModel.#zoomPercent > 50):
                zoom = 50;
                break;
        }
        await this.onZoomChange(`${zoom}`);
    }

    async zoomIn() {
        let zoom = 400;
        switch (true) {
            case (ZoomDialogModel.#zoomPercent < 25):
                zoom = 25;
                break;
            case (ZoomDialogModel.#zoomPercent < 50):
                zoom = 50;
                break;
            case (ZoomDialogModel.#zoomPercent < 75):
                zoom = 75;
                break;
            case (ZoomDialogModel.#zoomPercent < 100):
                zoom = 100;
                break;
            case (ZoomDialogModel.#zoomPercent < 125):
                zoom = 125;
                break;
            case (ZoomDialogModel.#zoomPercent < 150):
                zoom = 150;
                break;
            case (ZoomDialogModel.#zoomPercent < 200):
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
        ZoomDialogModel.#zoomPercent = numberValue;
        let zoom = ZoomDialogModel.#zoomPercent / 100;
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
        this.#kitElement.querySelector("#zoom-current").value = this.getZoom();
    }

    async zoomToFit() {
        // get bounds to fit
        const map = await MapWorkerClient.getMap();
        const boundsToFit = ZoomDialogModel.#getBoundsToFit(map);

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
        ZoomDialogModel.#zoomPercent = zoom * 100;
        this.#displayCurrentZoom();
    }

    // helpers
    static #isVisible = false;
    static #zoomPercent = 100;
    #kitElement = null;
    #dialogHelper = null;

    #onCloseDialog = async () => {
        ZoomDialogModel.#isVisible = false;
        await UIKit.renderer.renderElement(this.#kitElement);
    }

    #displayCurrentZoom() {
        const zoomInDisabled = ZoomDialogModel.#zoomPercent === 400;
        let zoomOutDisabled = ZoomDialogModel.#zoomPercent === 25;
        this.#kitElement.querySelector("#zoom-current").value = this.getZoom();
        this.#kitElement.querySelector("#zoom-in").disabled = zoomInDisabled;
        this.#kitElement.querySelector("#zoom-out").disabled = zoomOutDisabled;
    }

    static #getBoundsToFit(map) {
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
