
import { Character } from "../../../domain/references.js";
import { EditorViewModel } from "../../editor-view/editor-view.js";

export function createModel() {
    return new DomainNameAndDescriptionModel();
}

class DomainNameAndDescriptionModel {

    #kitElement;
    static #character;

    async init(kitElement) {
        this.#kitElement = kitElement;
        DomainNameAndDescriptionModel.#character = Character.currentCharacter;
        const elementKey = this.#kitElement.getAttribute("kit-element-key");
        const characterUpdateSubscriber = {
            elementKey: elementKey,
            id: `${EditorViewModel.CharacterUpdateTopic}-${elementKey}`,
            object: this,
            callback: this.onCharacterUpdate.name
        };
        UIKit.messenger.subscribe(EditorViewModel.CharacterUpdateTopic, characterUpdateSubscriber);
    }

    async onRendered() {
        const character = DomainNameAndDescriptionModel.#character;
        this.#kitElement.querySelector("#input-description").value = character.description ?? "";
        this.#kitElement.querySelector("#input-history-notes").value = character.historyNotes ?? "";
    }

    async onCharacterUpdate(message) {
        DomainNameAndDescriptionModel.#character = Character.currentCharacter;       
    }

    getName() {
        return Character.currentCharacter.name ?? "";
    }

    getPortrait() {
        return DomainNameAndDescriptionModel.#character.portrait ?? "";
    }

    getDescription() {
        return DomainNameAndDescriptionModel.#character.description ?? "";
    }

    getHistoryNotes() {
        return DomainNameAndDescriptionModel.#character.historyNotes ?? "";
    }

    async updateName() {
        const character = Character.currentCharacter;
        character.name = this.#kitElement.querySelector("#input-name").value.trim();
        await DomainNameAndDescriptionModel.#updateCharacter(character);
    }

    async updateDescription() {
        const character = Character.currentCharacter;
        const description = this.#kitElement.querySelector("#input-description").value;
        character.description = description;
        await DomainNameAndDescriptionModel.#updateCharacter(character);
    }

    async updateHistoryNotes() {
        const character = Character.currentCharacter;
        const historyNotes = this.#kitElement.querySelector("#input-history-notes").value;
        character.historyNotes = historyNotes;
        await DomainNameAndDescriptionModel.#updateCharacter(character);
    }

    async browsePortrait(event) {
        if (DomainNameAndDescriptionModel.#hasFileSystemAccess()) {
            let fileHandles = null;
            try {
                fileHandles = await UIKit.window.showOpenFilePicker({
                    types: [
                        {
                            description: 'Image Files',
                            accept: {
                                'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
                            },
                        },
                    ],
                });
            }
            catch {
                return;
            }
            const src = await DomainNameAndDescriptionModel.#getImageSource(fileHandles[0]);
            await DomainNameAndDescriptionModel.#updatePortrait(src);
            this.#kitElement.querySelector("#portrait").src = src;
        }
        else {
            const clickEvent = new PointerEvent('click', {
                clientX: event.clientX,
                clientY: event.clientY
            });
            this.#kitElement.querySelector("#file-input").dispatchEvent(clickEvent);
        }
    }

    onFileSelected() {
        const file = this.#kitElement.querySelector("#file-input").files[0];
        if (file) {
            try {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const src = e.target.result;
                    await DomainNameAndDescriptionModel.#updatePortrait(src);
                    this.#kitElement.querySelector("#portrait").src = src;
                };
                reader.readAsDataURL(file);
            }
            finally {
            }
        }
    }

    static #hasFileSystemAccess() {
        if ('showSaveFilePicker' in UIKit.window) {
            return true;
        }
        return false;
    }

    static async #getImageSource(fileHandle) {
        const file = await fileHandle.getFile();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    }

    static async #updatePortrait(portrait) {
        const character = Character.currentCharacter;
        character.portrait = portrait;
        await DomainNameAndDescriptionModel.#updateCharacter(character);
    }

    static async #updateCharacter(character) {
        Character.currentCharacter = character;
        const message = {
            character: character,
            section: "details-name-and-description"
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateTopic, message);
    }

}
