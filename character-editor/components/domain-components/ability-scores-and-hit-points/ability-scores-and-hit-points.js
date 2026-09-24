
import { Character, Sources, Utilities } from "../../../domain/references.js";
import { EditorViewModel } from "../../editor-view/editor-view.js";

export function createModel() {
    return new DomainAbilityScoresAndHitPointsModel();
}

class DomainAbilityScoresAndHitPointsModel {

    #kitElement;
    static #character

    async init(kitElement) {
        this.#kitElement = kitElement;
        DomainAbilityScoresAndHitPointsModel.#character = Character.currentCharacter;
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
        const oldCharacter = DomainAbilityScoresAndHitPointsModel.#character;
        const currentCharacter = Character.currentCharacter;
        const useAbilityScorePointsSystemUpdated
            = (oldCharacter.useAbilityScorePointsSystem != currentCharacter.useAbilityScorePointsSystem);
        const strengthUpdated = this.#hasAbilityScoreUpdate(oldCharacter, currentCharacter, "strength");
        const intelligenceUpdated = this.#hasAbilityScoreUpdate(oldCharacter, currentCharacter, "intelligence");
        const wisdomUpdated = this.#hasAbilityScoreUpdate(oldCharacter, currentCharacter, "wisdom");
        const dexterityUpdated = this.#hasAbilityScoreUpdate(oldCharacter, currentCharacter, "dexterity");
        const constitutionUpdated = this.#hasAbilityScoreUpdate(oldCharacter, currentCharacter, "constitution");
        const charismaUpdated = this.#hasAbilityScoreUpdate(oldCharacter, currentCharacter, "charisma");

        DomainAbilityScoresAndHitPointsModel.#character = currentCharacter;

        if (useAbilityScorePointsSystemUpdated) {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#points-remaining-row"));
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#min-base-score-row"));
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#max-base-score-row"));
        }
        if (strengthUpdated) {
            await this.#renderAbilityScoreRow("strength");
        }
        if (intelligenceUpdated) {
            await this.#renderAbilityScoreRow("intelligence");
        }
        if (wisdomUpdated) {
            await this.#renderAbilityScoreRow("wisdom");
        }
        if (dexterityUpdated) {
            await this.#renderAbilityScoreRow("dexterity");
        }
        if (constitutionUpdated) {
            await this.#renderAbilityScoreRow("constitution");
        }
        if (charismaUpdated) {
            await this.#renderAbilityScoreRow("charisma");
        }
        //hit-points-table
        await UIKit.renderer.renderElement(this.#kitElement.querySelector("#hit-points-table"));
    }

    toggleDetail(event, detailSection) {
        if (detailSection == "ability-scores-detail") {
            this.#kitElement.querySelector("#expand-ability-scores").classList.toggle("hidden");
            this.#kitElement.querySelector("#collapse-ability-scores").classList.toggle("hidden");
        }
        else {
            this.#kitElement.querySelector("#expand-hit-points").classList.toggle("hidden");
            this.#kitElement.querySelector("#collapse-hit-points").classList.toggle("hidden");
        }
        this.#kitElement.querySelector(`#${detailSection}`).classList.toggle("hidden");
    }

    useAbilityScorePointsSystem() {
        return DomainAbilityScoresAndHitPointsModel.#character.useAbilityScorePointsSystem;
    }

    async togglePointsSystem() {
        const character = Character.currentCharacter;
        Sources.updateCharacterUseAbilityScorePointsSystem(character);
        const message = { character: character };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    getPointsRemaining() {
        const character = DomainAbilityScoresAndHitPointsModel.#character;
        const values = character.abilityScores.map(a => Number(a.baseScore));
        let pointsRemaining = 27;
        for (const value of values) {
            if (value > 8) {
                for (let i = 9; i <= 13; i++) {
                    if (value >= i) {
                        pointsRemaining--;
                    }
                }
            }
            if (value >= 14) {
                pointsRemaining--;
                pointsRemaining--;
            }
            if (value == 15) {
                pointsRemaining--;
                pointsRemaining--;
            }
        }
        return pointsRemaining;
    }

    getMinBaseScore() {
        const character = DomainAbilityScoresAndHitPointsModel.#character;
        if (character.useAbilityScorePointsSystem) {
            return 8;
        }
        return 3;
    }

    getMaxBaseScore() {
        const character = DomainAbilityScoresAndHitPointsModel.#character;
        if (character.useAbilityScorePointsSystem) {
            return 15;
        }
        return 18;
    }

    getBaseAbilityScore(ability) {
        const character = DomainAbilityScoresAndHitPointsModel.#character;
        return this.#getBaseAbilityScore(character, ability);
    }

    async updateBaseAbilityScore(event, ability) {
        let value = event.srcElement.value;
        const character = Character.currentCharacter;
        const min = character.useAbilityScorePointsSystem ? 8 : 3;
        const max = character.useAbilityScorePointsSystem ? 15 : 18;
        if (value < min) {
            value = min;
        }
        if (value > max) {
            value = max;
        }
        const abilityScore = character.abilityScores.find(a => a.name == ability);
        if (value != abilityScore.baseScore) {
            abilityScore.baseScore = value;
            const message = { character: character };
            await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
        }
        else {
            event.srcElement.value = value;
        }
    }

    getModifiedAbilityScore(ability) {
        const character = DomainAbilityScoresAndHitPointsModel.#character;
        return character.getAbilityScore(ability);
    }

    getModifiedAbilityScoreMax(ability) {
        const character = DomainAbilityScoresAndHitPointsModel.#character;
        return this.#getModifiedMaxAbilityScore(character, ability);
    }

    getAbilityScoreModifiers(ability) {
        const character = DomainAbilityScoresAndHitPointsModel.#character;
        return this.#getAbilityScoreModifiers(character, ability);
    }

    getHitPointRows() {
        let rows = [];
        const character = DomainAbilityScoresAndHitPointsModel.#character;
        const conBase = character.abilityScores.find(a => a.name == "constitution").baseScore;
        for (let i = 0; i < character.classes.length; i++) {
            const characterClass = character.classes[i];
            const cls = Sources.getClasses(character.sources).find(c => c.name == characterClass.name);
            for (const levelBoon of characterClass.levelBoons) {
                const conModifierAtLevel = character.getConModifierForHitPoints(levelBoon.index);

                const conAtLevel = Number(conBase) + Number(conModifierAtLevel);
                const hpModAtLevel = Math.floor((Number(conAtLevel) - 10) / 2);

                let conModifierAtLevelLabel = `+ ${hpModAtLevel}`;
                if (hpModAtLevel < 0) {
                    conModifierAtLevelLabel = `- ${Math.abs(hpModAtLevel)}`;
                }
                const modifiedHitPoints = Number(levelBoon.hitPoints) + Number(hpModAtLevel);
                rows.push({
                    classIndex: i,
                    class: cls.title,
                    level: levelBoon.level,
                    levelBoonIndex: levelBoon.index,
                    hitDieSize: cls.hitDieSize,
                    hitPoints: levelBoon.hitPoints,
                    conModifierAtLevel: conModifierAtLevelLabel,
                    modifiedHitPoints: `= ${modifiedHitPoints}`
                });
            }
        }
        rows = Utilities.sort(rows, "levelBoonIndex");
        const featFeatures = character.features.filter(f =>
            f.modifier == "hit-points"
            && f.sourcePropertyName == "feat");
        for (const feature of featFeatures) {
            rows.push({
                feature: `Feat: ${feature.title}`,
                modifiedHitPoints: `= ${feature.modifierValue}`
            });
        }
        rows.push({
            feature: "<span class='hit-points-total-label'>Total:</span>",
            modifiedHitPoints: `<span class="hit-points-total">= ${character.getHitPoints()}</span>`
        })
        return rows;
    }

    async updateHitPoints(event) {
        const classIndex = Number(event.srcElement.getAttribute("data-class-index"));
        const level = Number(event.srcElement.getAttribute("data-level"));
        let value = Number(event.srcElement.value);
        const min = Number(event.srcElement.getAttribute("min"));
        const max = Number(event.srcElement.getAttribute("max"));
        if (value < min) {
            value = min;
        }
        if (value > max) {
            value = max;
        }
        const character = Character.currentCharacter;
        const levelBoon = character.classes[classIndex].levelBoons.find(lb => lb.level == level);
        if (levelBoon.hitPoints == value) {
            event.srcElement.value = value;
            return;
        }
        levelBoon.hitPoints = value;
        Sources.updateCharacterLevelBoon(character, classIndex, levelBoon);
        const message = { character: character };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    #hasAbilityScoreUpdate(oldCharacter, currentCharacter, ability) {

        const oldBaseScore = this.#getBaseAbilityScore(oldCharacter, ability);
        const currentBaseScore = this.#getBaseAbilityScore(currentCharacter, ability);
        const baseScoreUpdated = (oldBaseScore != currentBaseScore);

        const oldModifiedMax = this.#getModifiedMaxAbilityScore(oldCharacter, ability);
        const currentModifiedMax = this.#getModifiedMaxAbilityScore(currentCharacter, ability);
        const modifiedMaxUpdated = (oldModifiedMax != currentModifiedMax);

        const oldAbilityScoreModifiers = this.#getAbilityScoreModifiers(oldCharacter, ability);
        const currentAbilityScoreModifiers = this.#getAbilityScoreModifiers(currentCharacter, ability);
        const abilityScoreModifiersUpdated
            = !Utilities.areArraysEqual(oldAbilityScoreModifiers, currentAbilityScoreModifiers, ["title", "modifierValue"]);

        return baseScoreUpdated || modifiedMaxUpdated || abilityScoreModifiersUpdated;
    }

    async #renderAbilityScoreRow(ability) {
        const rowElement = this.#kitElement.querySelector(`#${ability}-row`);
        await UIKit.renderer.renderElement(rowElement.querySelector(".base-score-container"));
        await UIKit.renderer.renderElement(rowElement.querySelector(".modified-ability-score"));
        await UIKit.renderer.renderElement(rowElement.querySelector(".modified-max-note"));
        await UIKit.renderer.renderElement(rowElement.querySelector("ul"));
        await UIKit.renderer.renderElement(this.#kitElement.querySelector("#points-remaining-row"));
    }

    #getBaseAbilityScore(character, ability) {
        return Number(character.abilityScores.find(a => a.name == ability)?.baseScore);
    }

    #getModifiedMaxAbilityScore(character, ability) {
        return character.abilityScores.find(a => a.name == ability)?.modifiedMaximum;
    }

    #getAbilityScoreModifiers(character, ability) {
        return character.features.filter(f => f.modifier == `ability-score:${ability}`);
    }
}
