
import { EntityReference } from "../../../domain/references.js";
import { KitMessenger, KitRenderer } from "../../../ui-kit.js";
import { EditorModel } from "../editor/editor.js";

export function createModel() {
    return new FileNewDialogModel();
}

export class BuiltInTemplates {

    static #overlandTemplateInfo = {
        ref: {
            name: "Overland",
            versionId: 1,
            isBuiltIn: true,
            isFromTemplate: false
        },
        thumbnailSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFNSURBVEhL7dK9SgNBFMXxfSNfwMrORjsR24iFIIKN2FmLjaUPoHXewGewU+xELNIIip0wehZOuFzPnY8d0CYLf7I7O8lvZyfD28s8/Ucr+M9qhmcbazI1N1cTHCFT8Gb4/nI/vKfGo6phrgqwwnnfj6sOr17TcHu8nZCawDyaw/0YAuRbwhHuUZ7bT2Tn8hoR4jUbLk5m6fxgR+L8EYvy2o+r70UoGm4WX+loa33EPz/ew9UrzJ4jO3/37G5E8WnH2Qij56eHhNXn8JaKcPo5LM7V98BEs/D14wL2Eke9eGm1aIQVjj2b+sqbYI/bVbc+QDNcg0cBYaX9Rb9gheO1Rw+gwBKKJIwsbh/Ap8ASikIYeVzlwRoUZWHEQ6GoFWRFmPmDMF4391sBUdWwzcL+n68Q1SQY9eKTYdSDd8HI4i37vYKbs/Dp3mYlPE/fwsxix1CYIsYAAAAASUVORK5CYII="
    };

    static getTemplateInfoList() {
        return [BuiltInTemplates.#overlandTemplateInfo];
    }

    static async getTemplate(templateRef) {
        if (EntityReference.areEqual(BuiltInTemplates.#overlandTemplateInfo.ref, templateRef)) {
            const overlandModule = await import("../../../domain/templates/overland.js");
            const template = overlandModule.getTemplate();
            return template;
        }
        return null;
    }
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
        const templateInfoList = BuiltInTemplates.getTemplateInfoList();
        for (const templateInfo of templateInfoList) {
            templates.push(templateInfo);
        }
        // TODO: get favorite templates from api
        return templates;
    }

    templateSelected(templateRef) {
        this.#templateRef = templateRef;
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("#button-ok").disabled = false;
    }

    async buttonOkClicked() {
        this.closeDialog();
        await KitMessenger.publish(EditorModel.NewFileRequestTopic, { templateRef: this.#templateRef });
        
    }
}
