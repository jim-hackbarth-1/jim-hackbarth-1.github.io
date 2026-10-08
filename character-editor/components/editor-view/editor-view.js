
import { Character, Sources } from "../../domain/references.js";
import { HeadingModel } from "../heading/heading.js";

export function createModel() {
    return new EditorViewModel();
}

export class EditorViewModel {

    // constants
    static CharacterUpdateTopic = "CharacterUpdateTopic";
    static CharacterUpdateStartedTopic = "CharacterUpdateStartedTopic";

    static #editorViewElement;
    static #printViewElement;
    static #startWidth;
    static #startX;
    static #resizing = false;

    static character;

    #kitElement;

    static #currentScrollTop = 0;
    static setCurrentScrollY() {
        EditorViewModel.#currentScrollTop = UIKit.document.documentElement.querySelector("#editor-content").scrollTop;
    }
    static restoreScrollY() {
        UIKit.document.documentElement.querySelector("#editor-content").scrollTo(0, Number(EditorViewModel.#currentScrollTop));
        EditorViewModel.#currentScrollTop = 0;
    }
    
    async init(kitElement) {
        this.#kitElement = kitElement;
        EditorViewModel.character = Character.currentCharacter;
        const elementKey = this.#kitElement.getAttribute("kit-element-key");
        const characterUpdateStartedSubscriber = {
            elementKey: elementKey,
            id: `${EditorViewModel.CharacterUpdateStartedTopic}-${elementKey}`,
            object: this,
            callback: this.onCharacterUpdateStarted.name
        };
        UIKit.messenger.subscribe(EditorViewModel.CharacterUpdateStartedTopic, characterUpdateStartedSubscriber);
        const characterUpdateSubscriber = {
            elementKey: elementKey,
            id: `${EditorViewModel.CharacterUpdateTopic}-${elementKey}`,
            object: this,
            callback: this.onCharacterUpdate.name
        };
        UIKit.messenger.subscribe(EditorViewModel.CharacterUpdateTopic, characterUpdateSubscriber);
    }

    static #resizeEventHandlerRegistered;
    static #resizeEndEventHandlerRegistered;
    async onRendered() {
        if (!EditorViewModel.#resizeEventHandlerRegistered) {
            UIKit.document.addEventListener("pointermove", (event) => EditorViewModel.resize(event));
            EditorViewModel.#resizeEventHandlerRegistered = true;
        }
        if (!EditorViewModel.#resizeEndEventHandlerRegistered) {
            UIKit.document.addEventListener("pointerup", (event) => EditorViewModel.resizeEnd(event));
            EditorViewModel.#resizeEndEventHandlerRegistered = true;
        }
    }

    resizeStart(event, mobileResizer) {
        if (event.button === 0) {
            if (mobileResizer && UIKit.window.screen.width <= 600) {
                this.#toggleFixedWidth();
                return;
            }
            EditorViewModel.#editorViewElement = UIKit.document.documentElement.querySelector("#editor-view-component");
            EditorViewModel.#printViewElement = UIKit.document.documentElement.querySelector("#print-view-component")
            const style = getComputedStyle(EditorViewModel.#editorViewElement);
            EditorViewModel.#startWidth = Number(style.getPropertyValue("width").replace("px", ""));
            EditorViewModel.#startX = event.clientX;
            EditorViewModel.#resizing = true;
            UIKit.document.body.style.setProperty("user-select", "none");
        }
    }

    static resize(event) {
        if (EditorViewModel.#resizing) {
            const width = EditorViewModel.#startWidth + (event.clientX - EditorViewModel.#startX);
            const windowWidth = UIKit.window.innerWidth;
            const min = 20;
            if (width > min && (windowWidth - width) > min) {
                const propValue = `${width}px`;
                EditorViewModel.#editorViewElement.style.setProperty("width", propValue);
                EditorViewModel.#printViewElement.style.setProperty("left", propValue);
            }
        }
    }

    static resizeEnd(event) {
        if (event.button === 0) {
            EditorViewModel.#resizing = false;
            UIKit.document.body.style.setProperty("user-select", "auto");
        }
    }

    nextDetailsSection(detailsId) {
        const detailElements = [...this.#kitElement.querySelectorAll("details")];
        for (const detailElement of detailElements) {
            detailElement.open = false;
        }
        this.#kitElement.querySelector(`#${detailsId}`).open = true;
    }

    async onCharacterUpdateStarted(message) {
        EditorViewModel.setCurrentScrollY();
        const character = message.character;
        Sources.applyCharacterModifiers(character);
        Character.currentCharacter = character;
        EditorViewModel.character = character;
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateTopic, message);
    }

    onCharacterUpdate(message) {
        EditorViewModel.character = Character.currentCharacter;
    }

    print() {
        var html = UIKit.document.querySelector("#print-content").outerHTML;
        UIKit.document.body.innerHTML = html;
        let title = EditorViewModel.character?.name;
        if (!title || title.length == 0) {
            title = "DnD Character";
        }
        UIKit.document.title = title;
        UIKit.window.print();
        UIKit.window.location.reload();
    }

    async save() {
        if (HeadingModel.FileHandle) {
            await HeadingModel.saveCharacterWithFileHandle();
        }
        else {
            const dialogElement = this.#kitElement.querySelector("#dlg-file-save-2");
            const dialogModel = UIKit.renderer.getKitElementObject(dialogElement, "model");
            dialogModel.showDialog();
        }
    }

    #toggleFixedWidth() {
        const editorViewElement = UIKit.document.documentElement.querySelector("#editor-view-component");
        const printViewElement = UIKit.document.documentElement.querySelector("#print-view-component")
        const style = getComputedStyle(editorViewElement);
        let width = Number(style.getPropertyValue("width").replace("px", ""));
        if (width > 38) {
            editorViewElement.style.setProperty("width", "38px");
            printViewElement.style.setProperty("left", "38px");
        }
        else {
            editorViewElement.style.setProperty("width", `${UIKit.window.screen.width}px`);
            printViewElement.style.setProperty("left", `${UIKit.window.screen.width}px`);
        }
    }

}
