
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
        thumbnailSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFNSURBVEhL7dK9SgNBFMXxfSNfwMrORjsR24iFIIKN2FmLjaUPoHXewGewU+xELNIIip0wehZOuFzPnY8d0CYLf7I7O8lvZyfD28s8/Ucr+M9qhmcbazI1N1cTHCFT8Gb4/nI/vKfGo6phrgqwwnnfj6sOr17TcHu8nZCawDyaw/0YAuRbwhHuUZ7bT2Tn8hoR4jUbLk5m6fxgR+L8EYvy2o+r70UoGm4WX+loa33EPz/ew9UrzJ4jO3/37G5E8WnH2Qij56eHhNXn8JaKcPo5LM7V98BEs/D14wL2Eke9eGm1aIQVjj2b+sqbYI/bVbc+QDNcg0cBYaX9Rb9gheO1Rw+gwBKKJIwsbh/Ap8ASikIYeVzlwRoUZWHEQ6GoFWRFmPmDMF4391sBUdWwzcL+n68Q1SQY9eKTYdSDd8HI4i37vYKbs/Dp3mYlPE/fwsxix1CYIsYAAAAASUVORK5CYII="
    };
    static #siteTemplateInfo = {
        ref: {
            name: "Site",
            versionId: 1,
            isBuiltIn: true,
            isFromTemplate: false
        },
        description: "Buildings, caverns, areas of interest",
        thumbnailSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFNSURBVEhL7dK9SgNBFMXxfSNfwMrORjsR24iFIIKN2FmLjaUPoHXewGewU+xELNIIip0wehZOuFzPnY8d0CYLf7I7O8lvZyfD28s8/Ucr+M9qhmcbazI1N1cTHCFT8Gb4/nI/vKfGo6phrgqwwnnfj6sOr17TcHu8nZCawDyaw/0YAuRbwhHuUZ7bT2Tn8hoR4jUbLk5m6fxgR+L8EYvy2o+r70UoGm4WX+loa33EPz/ew9UrzJ4jO3/37G5E8WnH2Qij56eHhNXn8JaKcPo5LM7V98BEs/D14wL2Eke9eGm1aIQVjj2b+sqbYI/bVbc+QDNcg0cBYaX9Rb9gheO1Rw+gwBKKJIwsbh/Ap8ASikIYeVzlwRoUZWHEQ6GoFWRFmPmDMF4391sBUdWwzcL+n68Q1SQY9eKTYdSDd8HI4i37vYKbs/Dp3mYlPE/fwsxix1CYIsYAAAAASUVORK5CYII="
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
