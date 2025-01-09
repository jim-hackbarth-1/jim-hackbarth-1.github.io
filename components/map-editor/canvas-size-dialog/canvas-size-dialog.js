﻿
import { MapWorkerClient } from "../../../domain/references.js";
import { KitMessenger, KitRenderer } from "../../../ui-kit.js";
import { EditorModel } from "../editor/editor.js";

export function createModel() {
    return new CanvasSizeDialogModel();
}

class CanvasSizeDialogModel {

    async onRenderStart(componentId) {
        this.componentId = componentId;
    }

    async onRenderComplete() {
    }

    async showDialog() {
        const currentCanvasSize = MapWorkerClient.getCurrentCanvasSize();
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("#inputHeight").value = currentCanvasSize.height;
        componentElement.querySelector("#inputWidth").value = currentCanvasSize.width;
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

    async onSizeChange() {
        this.#updateCanvasSize();
    }

    closeDialog() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("dialog").close();
    }

    #updateCanvasSize() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const height = Number(componentElement.querySelector("#inputHeight").value);
        const width = Number(componentElement.querySelector("#inputWidth").value);
        KitMessenger.publish(EditorModel.CanvasResizeRequestTopic, { height: height, width: width });
    }
}
