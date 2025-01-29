
import { BuiltInTemplates } from "../../../domain/references.js";
import { KitMessenger, KitRenderer } from "../../../ui-kit.js";
import { EditorModel } from "../editor/editor.js";

export function createModel() {
    return new FileNewDialogModel();
}

class FileNewDialogModel {

    #templateRef = null;

    async onRenderStart(componentId) {
        this.componentId = componentId;
    }

    async onRenderComplete() {
        const element = KitRenderer.getComponentElement(this.componentId);
        const imgs = element.querySelectorAll(".template-item img");
        for (const img of imgs) {
            img.setAttribute("src", img.getAttribute("data-src"));
            img.removeAttribute("data-src");
        }
    }

    showDialog() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
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

    closeDialog() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("dialog").close();
    }

    getTemplates() {
        var templates = [
            {
                ref: { name: "[None]" },
                thumbnailSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABDSURBVEhL7dUxCgAwCENR73/pdhUHJbYgpf+BW4yjhkkrTJfUE8PlQkLqKgNNHAYA4AFjb/Hfw3665C4pnLjVgxNmG4ftO8U4eN5WAAAAAElFTkSuQmCC"
            }
        ];
        const applicationTemplates = BuiltInTemplates.getTemplates();
        for (const template of applicationTemplates) {
            templates.push(template);
        }
        // TODO: get favorite templates from api
        return templates;
    }

    templateSelected(templateRef) {
        this.#templateRef = templateRef;
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("#button-ok").disabled = false;
    }

    buttonOkClicked() {
        KitMessenger.publish(EditorModel.NewFileRequestTopic, { templateRef: this.#templateRef });
        this.closeDialog();
    }
}
