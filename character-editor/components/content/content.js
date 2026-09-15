
import { Character } from "../../domain/references.js";
import { EditorViewModel } from "../editor-view/editor-view.js";

export function createModel() {
    return new ContentModel();
}

class ContentModel {

    #kitElement;

    async init(kitElement) {
        this.#kitElement = kitElement;
    }

    hasCharacter() {
        if (Character.currentCharacter) {
            return true;
        }
        return false;
    }

}
