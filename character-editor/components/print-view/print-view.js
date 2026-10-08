
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

        // portrait
        this.#kitElement.querySelector("#portrait").src = character.portrait ?? "";

        // classes
        let classesHtml = "";
        const profiencyBonus = character.getProficiencyBonus();
        const characterClasses = character.classes.filter(c => c.value && c.level);
        if (characterClasses.length > 0) {
            if (characterClasses.length == 1) {
                const primaryClass = Sources.getClasses(character.sources).find(c => c.name == characterClasses[0].value);
                classesHtml += `<div class="row no-wrap">${primaryClass.title}, Level ${characterClasses[0].level}</div>`;
            }
            if (characterClasses.length > 1) {
                classesHtml = "<div class='no-wrap'>Classes:</div><ul>";
                for (const cls of characterClasses) {
                    const classModel = Sources.getClasses(character.sources).find(c => c.name == cls.value);
                    classesHtml += `<div class="row no-wrap">${classModel.title}, Level ${cls.level}</div>`;
                }
                classesHtml += "</ul>";
            }
            // classesHtml += `<div id="profiency-bonus" class="row no-wrap">(Profiency bonus: +${profiencyBonus})</div>`;
        }
        this.#kitElement.querySelector("#classes").innerHTML = classesHtml;

        // race
        let race = "";
        let size = "";
        let speed = "";
        if (character.race?.value) {
            const raceModel = Sources.getRaces(character.sources).find(r => r.name == character.race.value);
            size = raceModel.size;
            speed = `Speed: ${raceModel.speed}`;
            if (character.subRace?.value) {
                const subRaceModel = Sources
                    .getSubRaces(character.sources, character.race.value)
                    .find(sr => sr.name == character.subRace.value);
                race = subRaceModel.title;
            }
            else {
                race = raceModel.title;
            }
        }
        this.#kitElement.querySelector("#race").innerText = race;
        this.#kitElement.querySelector("#size").innerText = size;
        this.#kitElement.querySelector("#speed").innerText = speed;

        // alignment
        let alignment = ""
        if (character.alignment?.value) {
            alignment = Sources.getAlignments().find(a => a.name == character.alignment.value)?.title ?? "";
        }
        this.#kitElement.querySelector("#alignment").innerText = alignment;

        // background
        let background = ""
        let backgroundModel = null;
        if (character.background?.value) {
            backgroundModel = Sources.getBackgrounds(character.sources).find(b => b.name == character.background.value);
            background = backgroundModel?.title ?? "";
        }
        this.#kitElement.querySelector("#background").innerText = background;

        // description
        this.#kitElement.querySelector("#description").innerHTML = character.description ?? "";

        // abilities
        for (const abilityScore of character.abilityScores) {
            const name = abilityScore.name;
            const title = abilityScore.title;
            const score = character.getAbilityScore(name);
            this.#kitElement.querySelector(`#${name}`).innerText = `${title}: ${score}`;
            const modifier = character.getAbilityScoreModifier(abilityScore.name);
            let modifierLabel = `(+${modifier} modifier)`;
            if (modifier < 0) {
                modifierLabel = `(${modifier} modifier)`;
            }
            if (modifier == 0) {
                modifierLabel = `(No modifier)`;
            }
            this.#kitElement.querySelector(`#${name}-modifier`).innerText = modifierLabel;
            this.#kitElement.querySelector(`#${name}-saving-throw-modifier`).innerText
                = this.#getSavingThrowModifier(character, modifier, name);
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

        // traits
        // let traitsHtml = "<div class='no-wrap'>Traits:</div><ul>";
        // if (backgroundModel) {
        //     for (const trait of character.traits) {
        //         const traitTitle = backgroundModel.getTraits().find(t => t.name == trait)?.title;
        //         traitsHtml += `<li class="no-wrap">${traitTitle}</li>`;
        //     }
        // }
        // traitsHtml += "</ul>";
        // this.#kitElement.querySelector("#traits").innerHTML = traitsHtml;

        // ideal
        // let ideal = "Ideal:";
        // if (character.ideal && backgroundModel) {
        //     ideal = `Ideal: ${backgroundModel.getIdeals().find(i => i.name == character.ideal)?.title ?? ""}`;
        // }
        // this.#kitElement.querySelector("#ideal").innerText = ideal;

        // bond
        // let bond = "Bond:";
        // if (character.bond && backgroundModel) {
        //     bond = `Bond: ${backgroundModel.getBonds().find(b => b.name == character.bond)?.title ?? ""}`;
        // }
        // this.#kitElement.querySelector("#bond").innerText = bond;

        // flaw
        // let flaw = "Flaw:";
        // if (character.flaw && backgroundModel) {
        //     flaw = `Flaw: ${backgroundModel.getFlaws().find(f => f.name == character.flaw)?.title ?? ""}`;
        // }
        // this.#kitElement.querySelector("#flaw").innerText = flaw;
    }

    #getSavingThrowModifier(character, abilityModifier, ability) {
        let label = "";
        const savingThrowModifier = character.modifiers
            .filter(m => m.target == `saving-throw-proficiency:${ability}`)
            .map(m => m.value)
            .reduce((a, b) => a + b, 0);
        if (savingThrowModifier > 0) {
            const total = Number(abilityModifier) + Number(savingThrowModifier);
            label = `(+${total} saving throws)`;
            if (total < 0) {
                label = `(${total} saving throws)`;
            }
        }
        return label;
    }
}
