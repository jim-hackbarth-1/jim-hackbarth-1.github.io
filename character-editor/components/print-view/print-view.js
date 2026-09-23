
import { Character, Sources } from "../../domain/references.js";
import { EditorViewModel } from "../editor-view/editor-view.js";

export function createModel() {
    return new PrintViewModel();
}

class PrintViewModel {

    #kitElement;

    async init(kitElement) {
        this.#kitElement = kitElement;
        const elementKey = this.#kitElement.getAttribute("kit-element-key");
        const characterUpdateSubscriber = {
            elementKey: elementKey,
            id: `${EditorViewModel.CharacterUpdateTopic}-${elementKey}`,
            object: this,
            callback: this.onCharacterUpdate.name
        };
        UIKit.messenger.subscribe(EditorViewModel.CharacterUpdateTopic, characterUpdateSubscriber);
    }

    async onCharacterUpdate(message) {
        this.#updateView();
    }

    async onRendered() {
        this.#updateView();
    }

    #updateView() {

        const character = Character.currentCharacter;

        // name
        this.#kitElement.querySelector("#name-heading").innerText = character.name ?? "[character name]";

        // race
        let race = "";
        let size = "";
        let speed= "";
        if (character.race) {
            const raceModel = Sources.getRaces(character.sources).find(r => r.name == character.race);
            size = raceModel.size;
            speed = raceModel.speed;
            if (character.subRace) {
                const subRaceModel = Sources
                    .getSubRaces(character.sources, character.race)
                    .find(sr => sr.name == character.subRace);
                race = subRaceModel.title;
            }
            else {
                race = raceModel.title;
            }
        }
        this.#kitElement.querySelector("#race").innerText = race;
        this.#kitElement.querySelector("#size").innerText = size;
        this.#kitElement.querySelector("#speed").innerText = speed;

        // classes
        let classesHtml = "";
        for (const cls of character.classes) {
            if (cls.name && cls.level) {
                const classModel = Sources.getClasses(character.sources).find(c => c.name == cls.name);
                classesHtml += `<div class="row no-wrap">${classModel.title}, Level ${cls.level}</div>`;
            }
        }
        this.#kitElement.querySelector("#classes").innerHTML = classesHtml;

        // abilities
        for (const abilityScore of character.abilityScores) {
            const name = abilityScore.name;
            const title = abilityScore.title;
            const score = character.getAbilityScore(name);
            this.#kitElement.querySelector(`#${name}`).innerText = `${title}: ${score}`;
            const modifier = this.#getAbilityScoreModifier(score);
            let modifierLabel = `(+${modifier} modifier)`;
            if (modifier < 0) {
                modifierLabel = `(${modifier} modifier)`;
            }
            if (modifier == 0) {
                modifierLabel = `(No modifier)`;
            }
            this.#kitElement.querySelector(`#${name}-modifier`).innerText = modifierLabel;
        }

        // hit points and hit dice
        const hitPoints = `Hit Points: ${character.getHitPoints()}`;
        const hitDice = [];
        for (const characterClass of character.classes) {
            const cls = Sources.getClasses(character.sources).find(c => c.name == characterClass.name);
            const hitDieSize = cls?.hitDieSize;
            const level = characterClass?.level;
            if (hitDieSize && level) {
                hitDice.push(`${level}D${hitDieSize}`);
            }
        }
        const hitDiceLabel = `(Hit Dice: ${hitDice.join(", ")})`;
        this.#kitElement.querySelector("#hit-points-max").innerText = hitPoints;
        this.#kitElement.querySelector("#hit-dice").innerText = hitDiceLabel;
    }

    #getAbilityScoreModifier(abilityScore) {
        return Math.floor((Number(abilityScore) - 10) / 2);
    }
}
