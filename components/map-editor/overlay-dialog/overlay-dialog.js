
import { ChangeType, Map, MapWorkerClient, MapWorkerInputMessageType } from "../../../domain/references.js";
import { EditorModel } from "../editor/editor.js";
import { DialogHelper } from "../../shared/dialog-helper.js";

export function createModel() {
    return new OverlayDialogModel();
}

class OverlayDialogModel {

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
        if (OverlayDialogModel.#isVisible) {
            const map = await MapWorkerClient.getMap();
            this.#kitElement.querySelector("#inputPattern").value = map.overlay.pattern;
            this.#kitElement.querySelector("#inputSize").value = map.overlay.size;
            this.#kitElement.querySelector("#inputColor").value = map.overlay.color;
            this.#kitElement.querySelector("#inputOpacity").value = map.overlay.opacity * 100;
            const dialog = this.#kitElement.querySelector("dialog");
            const header = this.#kitElement.querySelector("header");
            this.#dialogHelper = new DialogHelper();
            this.#dialogHelper.show(dialog, header, this.#onCloseDialog);
        }
    }

    async onMapUpdated(message) {
        if (OverlayDialogModel.#isVisible) {
            //await UIKit.renderer.renderKitElement(this.#kitElement);
        }
    }

    // methods
    isVisible() {
        return OverlayDialogModel.#isVisible;
    }

    async showDialog() {
        OverlayDialogModel.#isVisible = true;
        await UIKit.renderer.renderKitElement(this.#kitElement);
    }

    closeDialog() {
        this.#dialogHelper.close();
    }

    async onOverlayChange() {
        const pattern = this.#kitElement.querySelector("#inputPattern").value;
        const size = Number(this.#kitElement.querySelector("#inputSize").value);
        const color = this.#kitElement.querySelector("#inputColor").value;
        const opacity = (Number(this.#kitElement.querySelector("#inputOpacity").value) / 100).toFixed(2);
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

    // helpers
    static #isVisible = false;
    #kitElement = null;
    #dialogHelper = null;

    #onCloseDialog = async () => {
        OverlayDialogModel.#isVisible = false;
        await UIKit.renderer.renderKitElement(this.#kitElement);
    }
}
