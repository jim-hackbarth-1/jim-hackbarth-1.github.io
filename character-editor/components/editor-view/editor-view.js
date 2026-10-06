
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

    #kitElement;
    
    async init(kitElement) {
        this.#kitElement = kitElement;
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
        const character = message.character;
        character.modifiers = [];
        if (character.race) {
            const race = Sources.getRaces(character.sources).find(r => r.name == character.race);
            if (race.applyModifiers) {
                race.applyModifiers(character);
            }
            if (character.subRace) {
                const subRace = Sources
                    .getSubRaces(character.sources, character.race)
                    .find(sr => sr.name == character.subRace);
                if (subRace.applyModifiers) {
                    subRace.applyModifiers(character);
                }
            }
        }

        for (let i = 0; i < character.classes.length; i++) {
            const characterClass = character.classes[i];
            if (characterClass.name && characterClass.level) {
                const cls = Sources.getClasses(character.sources).find(c => c.name == characterClass.name);
                if (cls.applyModifiers) {
                    cls.applyModifiers(character, i);
                }
                if (characterClass.subClass) {
                    const subClass = Sources
                        .getSubClasses(character.sources, characterClass.name)
                        .find(sc => sc.name == characterClass.subClass);
                    if (subClass.applyModifiers) {
                        subClass.applyModifiers(character, i);
                    }
                }
                for (const levelBoon of characterClass.levelBoons) {
                    if (levelBoon.feat) {
                        const feat = Sources.getFeats(character.sources).find(f => f.name == levelBoon.feat);
                        if (feat.applyModifiers) {
                            feat.applyModifiers(character, i, levelBoon.level);
                        }
                    }
                    if (levelBoon.abilityScore1) {
                        character.addModifier({
                            name: `${characterClass.name}-${levelBoon.level}-ability-score-modifier-1`,
                            target: `ability-score:${levelBoon.abilityScore1}`,
                            value: 1,
                            sourcePropertyName: `class-${i}-level-${levelBoon.level}-ability-score-1`,
                            sourcePropertyValue: levelBoon.abilityScore1,
                            title: `${cls.title} Level ${levelBoon.level} ability score improvement`
                        });
                    }
                    if (levelBoon.abilityScore2) {
                        character.addModifier({
                            name: `${characterClass.name}-${levelBoon.level}-ability-score-modifier-2`,
                            target: `ability-score:${levelBoon.abilityScore2}`,
                            value: 1,
                            sourcePropertyName: `class-${i}-level-${levelBoon.level}-ability-score-2`,
                            sourcePropertyValue: levelBoon.abilityScore2,
                            title: `${cls.title} Level ${levelBoon.level} ability score improvement`,
                        });
                    }
                }
            }
        }

        if (character.background) {
            const background = Sources.getBackgrounds(character.sources).find(b => b.name == character.background);
            if (background.applyModifiers) {
                background.applyModifiers(character);
            }
        }

        const allEquipment = Sources.getEquipment(character.sources);
        for (let i = 0; i < character.equipment.length; i++) {
            const characterItem = character.equipment[i];
            if (characterItem.isEquipped) {
                const item = allEquipment.find(e => e.name == character.equipment[i].name);
                if (item.applyModifiers) {
                    item.applyModifiers(character, i);
                }
            }
        }

        Character.currentCharacter = character;
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateTopic, message);
    }

    onCharacterUpdate(message) {
        if (message.section) {
            this.nextDetailsSection(message.section);
        }
    }

    print() {
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
