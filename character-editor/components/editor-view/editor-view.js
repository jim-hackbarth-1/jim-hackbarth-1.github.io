
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

    resizeStart(event) {
        if (event.button === 0) {
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
        character.features = [];
        if (character.race) {
            const race = Sources.getRaces(character.sources).find(r => r.name == character.race);
            if (race.updateFeatures) {
                race.updateFeatures(character);
            }
            if (character.subRace) {
                const subRace = Sources
                    .getSubRaces(character.sources, character.race)
                    .find(sr => sr.name == character.subRace);
                if (subRace.updateFeatures) {
                    subRace.updateFeatures(character);
                }
            }
        }

        for (const characterClass of character.classes) {
            if (characterClass.name) {
                const cls = Sources.getClasses(character.sources).find(c => c.name == characterClass.name);
                if (cls.updateFeatures) {
                    cls.updateFeatures(character);
                }
                if (characterClass.subClass) {
                    const subClass = Sources
                        .getSubClasses(character.sources, characterClass.name)
                        .find(sc => sc.name == characterClass.subClass);
                    if (subClass.updateFeatures) {
                        subClass.updateFeatures(character);
                    }
                }
                for (const levelBoon of characterClass.levelBoons) {
                    if (levelBoon.feat) {
                        const feat = Sources.getFeats(character.sources).find(f => f.name == levelBoon.feat);
                        if (feat.updateFeatures) {
                            feat.updateFeatures(character);
                        }
                    }
                    if (levelBoon.abilityScore1) {
                        character.addFeature({
                            name: `${characterClass.name}-${levelBoon.level}-ability-score-modifier-1`,
                            title: `${cls.title} Level ${levelBoon.level} ability score improvement`,
                            modifier: `ability-score:${levelBoon.abilityScore1}`,
                            modifierValue: 1,
                            sourcePropertyName: "levelBoon",
                            sourcePropertyValue: `${characterClass.name}-${levelBoon.level}-ability-score-modifier-1`
                        });
                    }
                    if (levelBoon.abilityScore2) {
                        character.addFeature({
                            name: `${characterClass.name}-${levelBoon.level}-ability-score-modifier-2`,
                            title: `${cls.title} Level ${levelBoon.level} ability score improvement`,
                            modifier: `ability-score:${levelBoon.abilityScore2}`,
                            modifierValue: 1,
                            sourcePropertyName: "levelBoon",
                            sourcePropertyValue: `${characterClass.name}-${levelBoon.level}-ability-score-modifier-2`
                        });
                    }
                }
            }
        }

        if (character.background) {
            const background = Sources.getBackgrounds(character.sources).find(b => b.name == character.background);
            if (background.updateFeatures) {
                background.updateFeatures(character);
            }
        }
        
        // TODO: same for equipment

        Character.currentCharacter = character;
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateTopic, message);
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

}
