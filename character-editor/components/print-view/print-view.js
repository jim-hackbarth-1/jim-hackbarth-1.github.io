
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

        const character = EditorViewModel.character;

        // name
        this.#kitElement.querySelector("#name-heading").innerText = character.name ?? "[character name]";

        // portrait
        this.#kitElement.querySelector("#portrait").src = character.portrait ?? "";

        // classes
        let classesHtml = "";
        const characterClasses = character.classes.filter(c => c.value && c.text && c.level);
        for (const characterClass of characterClasses) {
            classesHtml += `<div class="row no-wrap">${characterClass.text}, Level ${characterClass.level}</div>`;
        }
        this.#kitElement.querySelector("#classes").innerHTML = classesHtml;

        // proficiency bonus
        this.#kitElement.querySelector("#proficiency-bonus").innerText = `+${character.getProficiencyBonus()}`;

        // race
        let race = "";
        if (character.race?.value || character.subRace?.value) {
            race = character.subRace?.text ?? character.race.text ?? "";
        }
        this.#kitElement.querySelector("#race").innerText = race;

        // size
        let size = "";
        let baseSpeed = 30;
        if (character.race?.value) {
            const raceModel = Sources.getRaces(character.sources).find(r => r.name == character.race.value);
            size = raceModel?.size ?? "";
            baseSpeed = raceModel?.speed ?? baseSpeed;
        }
        this.#kitElement.querySelector("#size").innerText = size;

        // alignment
        let alignment = ""
        if (character.alignment?.value) {
            alignment = character.alignment.text ?? "";
        }
        this.#kitElement.querySelector("#alignment").innerText = alignment;

        // background
        let background = ""
        if (character.background?.value) {
            background = character.background.text ?? "";
        }
        this.#kitElement.querySelector("#background").innerText = background;

        // description
        this.#kitElement.querySelector("#description").innerHTML = character.description ?? "";

        // initiative
        const dexModifier = character.getAbilityScoreModifier("dexterity");
        const initModifiers = this.#getModifiers(character, "initiative");
        const initiative = Number(dexModifier) + Number(initModifiers);
        this.#kitElement.querySelector("#initiative").innerHTML = (initiative < 0) ? `${initiative}` : `+${initiative}`;

        // speed
        const speedModifiers = this.#getModifiers(character, "speed");
        const speed = Number(baseSpeed) + Number(speedModifiers);
        this.#kitElement.querySelector("#speed").innerHTML = speed;

        // ac
        this.#kitElement.querySelector("#armor-class").innerHTML = character.getArmorClass();

        // hp
        this.#kitElement.querySelector("#hit-points").innerHTML = character.getHitPoints();

        // hit dice
        this.#kitElement.querySelector("#hit-dice").innerHTML = Sources.getHitDice(character);

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
        // const hitPoints = `Hit Points: ${character.getHitPoints()}`;
        // const hitDice = [];
        // for (const characterClass of character.classes) {
        //     const cls = Sources.getClasses(character.sources).find(c => c.name == characterClass.name);
        //     const hitDieSize = cls?.hitDieSize;
        //     const level = characterClass?.level;
        //     if (hitDieSize && level) {
        //         hitDice.push(`${level}D${hitDieSize}`);
        //     }
        // }
        // const hitDiceLabel = `(Hit Dice: ${hitDice.join(", ")})`;
        // this.#kitElement.querySelector("#hit-points-max").innerText = hitPoints;
        // this.#kitElement.querySelector("#hit-dice").innerText = hitDiceLabel;

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

    #getModifiers(character, target) {
        return character.modifiers
            .filter(m => m.target == target)
            .map(m => m.value)
            .reduce((a, b) => a + b, 0);
    }
}
