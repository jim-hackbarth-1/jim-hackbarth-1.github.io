
import { Character } from "../../domain/references.js";

export function createModel() {
    return new HeadingModel();
}

export class HeadingModel {

    // constants
    static FileHandle = null;

    #kitElement;
    #display = "none";

    async init(kitElement) {
        this.#kitElement = kitElement;
    }

    static #hideMenuHandlerRegistered;
    async onRendered() {
        if (!HeadingModel.#hideMenuHandlerRegistered) {
            UIKit.document.addEventListener("click", (event) => this.hideMenu(event));
            HeadingModel.#hideMenuHandlerRegistered = true;
        }
    }

    toggleMenu(event) {
        this.#display = (this.#display == "none") ? "block" : "none";
        this.#kitElement.querySelector("#action-menu").style.setProperty("display", this.#display);
        if (this.#display == "block") {
            let disabled = true;
            if (Character.currentCharacter) {
                disabled = false;
            }
            this.#kitElement.querySelector("#save-button").disabled = disabled;
            this.#kitElement.querySelector("#print-button").disabled = disabled;
            this.#kitElement.querySelector("#close-button").disabled = disabled;
        }
        event.stopPropagation();
    }

    hideMenu(event) {
        this.#display = "block";
        this.toggleMenu(event);
    }

    async newCharacter() {
        HeadingModel.FileHandle = null;
        const character = new Character();
        character.name = "[new character]";
        Character.currentCharacter = character;
        const contentElement = UIKit.document.documentElement.querySelector("#content-component");
        await UIKit.renderer.renderElement(contentElement);
    }

    showDialog(dialogId) {
        const dialogElement = this.#kitElement.querySelector(`#${dialogId}`);
        const dialogModel = UIKit.renderer.getKitElementObject(dialogElement, "model");
        dialogModel.showDialog();
    }

    async saveCharacter() {
        if (HeadingModel.FileHandle) {
            await HeadingModel.saveCharacterWithFileHandle();
        }
        else {
            await this.showDialog("dlg-file-save");
        }
    }

    static async saveCharacterWithFileHandle() {
        const startCursor = UIKit.document.body.style.cursor;
        try {
            UIKit.document.body.style.cursor = "wait";
            const json = JSON.stringify(Character.currentCharacter, null, 2);
            const writable = await HeadingModel.FileHandle.createWritable();
            try {
                await writable.write(json);
                await writable.close();
            }
            catch {
                await writable.abort();
            }
            const element = UIKit.document.documentElement.querySelector("#character-saved-notification");
            element.classList.remove("hidden");
            setTimeout(() => { element.classList.add("hidden"); }, 5000);
        }
        finally {
            UIKit.document.body.style.cursor = startCursor;
        }
    }

    printCharacter() {
        var html = UIKit.document.querySelector("#print-content").outerHTML;
        UIKit.document.body.innerHTML = html;
        let title = Character.currentCharacter?.name;
        if (!title || title.length == 0) {
            title = "DnD Character";
        }
        UIKit.document.title = title;
        UIKit.window.print();
        UIKit.window.location.reload();
    }

    async closeCharacter() {
        Character.currentCharacter = null;
        const contentElement = UIKit.document.documentElement.querySelector("#content-component");
        await UIKit.renderer.renderElement(contentElement);
    }

}
