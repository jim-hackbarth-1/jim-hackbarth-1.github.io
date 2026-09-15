
import { Character, Sources } from "../../../domain/references.js";
import { EditorViewModel } from "../../editor-view/editor-view.js";

export function createModel() {
    return new DomainSourcesModel();
}

class DomainSourcesModel {

    #kitElement;

    async init(kitElement) {
        this.#kitElement = kitElement;
    }

    getSources() {
        const character = Character.currentCharacter;
        return Sources.getSources().map(s =>
        ({
            name: s.name,
            title: s.title,
            isCheckedAttr: character.sources.includes(s.name) ? "" : null
        }));
    }

    async updateSources() {
        const checkboxes = [...this.#kitElement.querySelectorAll("input[type=checkbox]")];
        const sources = [];
        for (const checkbox of checkboxes) {
            if (checkbox.checked) {
                sources.push(checkbox.getAttribute("data-source-name"));
            }
        }
        const character = Character.currentCharacter;
        Sources.updateCharacterSources(character, sources);
        const message = { character: character };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

}
