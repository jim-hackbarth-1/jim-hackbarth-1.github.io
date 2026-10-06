
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
        const abilities = Sources.getAbilities().map(a => a.name);
        let hasAbilityScoreUpdate = false;
        for (const ability of abilities) {
            if (this.#hasAbilityScoreUpdate(oldCharacter, currentCharacter, ability)) {
                hasAbilityScoreUpdate = true;
                break;
            }
        }
        DomainAbilityScoresAndHitPointsModel.#character = currentCharacter;
        if (useAbilityScorePointsSystemUpdated) {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#points-remaining-row"));
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#min-base-score-row"));
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#max-base-score-row"));
        }
        if (hasAbilityScoreUpdate) {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#points-remaining-row"));
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#ability-score-table"));
        }
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
        const message = {
            character: character,
            section: "details-ability-scores"
        };
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

    getAbilityScoresInfo() {
        const character = DomainAbilityScoresAndHitPointsModel.#character;
        const minBaseScore = this.getMinBaseScore();
        const maxBaseScore = this.getMaxBaseScore();
        const abilities = [...Sources.getAbilities()];
        for (const ability of abilities) {
            ability.baseScore = Number(character.abilityScores.find(a => a.name == ability.name)?.baseScore);
            ability.minBaseScore = minBaseScore;
            ability.maxBaseScore = maxBaseScore;
            ability.modifiedScore = character.getAbilityScore(ability.name);
            const maxBase = Number(character.abilityScores.find(a => a.name == ability.name).modifiedMaximum);
            const maxModifiers = Number(this.#getModifiedMaxAbilityScoreModifiers(character, ability));
            ability.modifiedMaxScore = maxBase + maxModifiers;
            ability.modifiers = character.modifiers.filter(m => m.target == `ability-score:${ability.name}`);
        }
        return abilities;
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
            const message = {
                character: character,
                section: "details-ability-scores"
            };
            await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
        }
        else {
            event.srcElement.value = value;
        }
    }

    toggleModifiers(event, ability) {
        const modifiersRow = this.#kitElement.querySelector(`#ability-modifiers-row-${ability}`);
        modifiersRow.classList.toggle("hidden");
    }

    getHitPointRows() {
        let rows = [];
        const character = DomainAbilityScoresAndHitPointsModel.#character;
        const conBase = character.abilityScores.find(a => a.name == "constitution").baseScore;
        for (let i = 0; i < character.classes.length; i++) {
            const characterClass = character.classes[i];
            const cls = Sources.getClasses(character.sources).find(c => c.name == characterClass.name);
            if (cls) {
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
        }
        rows = Utilities.sort(rows, "levelBoonIndex");
        const hpModifiers = character.modifiers.filter(m => m.target == "hit-points");
        for (const modifier of hpModifiers) {
            rows.push({
                feature: `Feat: ${modifier.title}`,
                modifiedHitPoints: `= ${modifier.value}`
            });
        }
        rows.push({
            isTotal: true,
            totalHitPoints: character.getHitPoints()
        });
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
        const message = {
            character: character,
            section: "details-ability-scores"
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    #hasAbilityScoreUpdate(oldCharacter, currentCharacter, ability) {

        const oldBaseScore = Number(oldCharacter.abilityScores.find(a => a.name == ability)?.baseScore);
        const currentBaseScore = Number(currentCharacter.abilityScores.find(a => a.name == ability)?.baseScore);
        const baseScoreUpdated = (oldBaseScore != currentBaseScore);

        const oldModifiedMax = oldCharacter.abilityScores.find(a => a.name == ability)?.modifiedMaximum;
        const currentModifiedMax = currentCharacter.abilityScores.find(a => a.name == ability)?.modifiedMaximum;
        const modifiedMaxUpdated = (oldModifiedMax != currentModifiedMax);

        const oldAbilityScoreModifiers = oldCharacter.modifiers.filter(m => m.target == `ability-score:${ability}`);
        const currentAbilityScoreModifiers = currentCharacter.modifiers.filter(m => m.target == `ability-score:${ability}`);
        const abilityScoreModifiersUpdated
            = !Utilities.areArraysEqual(oldAbilityScoreModifiers, currentAbilityScoreModifiers, ["title", "value"]);

        return baseScoreUpdated || modifiedMaxUpdated || abilityScoreModifiersUpdated;
    }

    #getModifiedMaxAbilityScoreModifiers(character, ability) {
        return character.modifiers
            .filter(m => m.target == `modified-max-ability-score:${ability.name}`)
            .map(m => m.value)
            .reduce((a, b) => a + b, 0);
    }
}
