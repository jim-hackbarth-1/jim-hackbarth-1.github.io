
import { EntityReference } from "../../../domain/references.js";
import { DialogHelper } from "../../shared/dialog-helper.js";
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
        description: "Continents, countries, large regions",
        thumbnailSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFNSURBVEhL7dK9SgNBFMXxfSNfwMrORjsR24iFIIKN2FmLjaUPoHXewGewU+xELNIIip0wehZOuFzPnY8d0CYLf7I7O8lvZyfD28s8/Ucr+M9qhmcbazI1N1cTHCFT8Gb4/nI/vKfGo6phrgqwwnnfj6sOr17TcHu8nZCawDyaw/0YAuRbwhHuUZ7bT2Tn8hoR4jUbLk5m6fxgR+L8EYvy2o+r70UoGm4WX+loa33EPz/ew9UrzJ4jO3/37G5E8WnH2Qij56eHhNXn8JaKcPo5LM7V98BEs/D14wL2Eke9eGm1aIQVjj2b+sqbYI/bVbc+QDNcg0cBYaX9Rb9gheO1Rw+gwBKKJIwsbh/Ap8ASikIYeVzlwRoUZWHEQ6GoFWRFmPmDMF4391sBUdWwzcL+n68Q1SQY9eKTYdSDd8HI4i37vYKbs/Dp3mYlPE/fwsxix1CYIsYAAAAASUVORK5CYII="
    };
    static #localeTemplateInfo = {
        ref: {
            name: "Locale",
            versionId: 1,
            isBuiltIn: true,
            isFromTemplate: false
        },
        description: "Cities, villages, small regions",
        thumbnailSrc: "data:image/png;base64,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"
    };
    static #siteTemplateInfo = {
        ref: {
            name: "Site",
            versionId: 1,
            isBuiltIn: true,
            isFromTemplate: false
        },
        description: "Buildings, caverns, areas of interest",
        thumbnailSrc: "data:image/png;base64,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"
    };

    static getTemplateInfoList() {
        return [
            BuiltInTemplates.#overlandTemplateInfo,
            BuiltInTemplates.#localeTemplateInfo,
            BuiltInTemplates.#siteTemplateInfo
        ];
    }

    static async getTemplate(templateRef) {
        let template = null;
        if (EntityReference.areEqual(BuiltInTemplates.#overlandTemplateInfo.ref, templateRef)) {
            const overlandModule = await import("../../../domain/templates/overland.js");
            template = overlandModule.getTemplate();
        }
        if (EntityReference.areEqual(BuiltInTemplates.#localeTemplateInfo.ref, templateRef)) {
            const localeModule = await import("../../../domain/templates/locale.js");
            template = localeModule.getTemplate();
        }
        if (EntityReference.areEqual(BuiltInTemplates.#siteTemplateInfo.ref, templateRef)) {
            const siteModule = await import("../../../domain/templates/site.js");
            template = siteModule.getTemplate();
        }
        return template;
    }
}

class FileNewDialogModel {

    // event handlers
    async init(kitElement) {
        this.#kitElement = kitElement;
    }

    async onRendered() {
        if (FileNewDialogModel.#isVisible) {
            const dialog = this.#kitElement.querySelector("dialog");
            const header = this.#kitElement.querySelector("header");
            this.#dialogHelper = new DialogHelper();
            this.#dialogHelper.show(dialog, header, this.#onCloseDialog);
        }
    }

    // methods
    isVisible() {
        return FileNewDialogModel.#isVisible;
    }

    async showDialog() {
        FileNewDialogModel.#isVisible = true;
        await UIKit.renderer.renderElement(this.#kitElement);
    }

    closeDialog() {
        this.#dialogHelper.close();
    }

    getTemplates() {
        var templates = [
            {
                ref: { name: "[None]" },
                description: "Blank map",
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
        this.#kitElement.querySelector("#button-ok").disabled = false;
    }

    async buttonOkClicked() {
        this.closeDialog();
        await UIKit.messenger.publish(EditorModel.NewFileRequestTopic, { templateRef: this.#templateRef });        
    }

    // helpers
    static #isVisible = false;
    #kitElement = null;
    #templateRef = null;
    #dialogHelper = null;

    #onCloseDialog = async () => {
        FileNewDialogModel.#isVisible = false;
        await UIKit.renderer.renderElement(this.#kitElement);
    }
}
