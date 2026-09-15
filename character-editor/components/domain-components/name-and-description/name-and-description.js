
import { Character } from "../../../domain/references.js";
import { EditorViewModel } from "../../editor-view/editor-view.js";

export function createModel() {
    return new DomainNameAndDescriptionModel();
}

class DomainNameAndDescriptionModel {

    #kitElement;

    async init(kitElement) {
        this.#kitElement = kitElement;
    }

    getName() {
        return Character.currentCharacter.name;
    }

    async updateName() {
        const character = Character.currentCharacter;
        character.name = this.#kitElement.querySelector("#input-name").value.trim();
        Character.currentCharacter = character;
        const message = { character: character };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateTopic, message);
    }

}
