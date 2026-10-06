
import { Character, Sources, Utilities } from "../../../domain/references.js";
import { EditorViewModel } from "../../editor-view/editor-view.js";
import { DomainClassAndLevelModel } from "../../domain-components/class-and-level/class-and-level.js";
import { SelectionModel } from "../../shared/selection/selection.js";

export function createModel() {
    return new LevelBoonSelectionModel();
}

class LevelBoonSelectionModel {

    #kitElement;
    #selectionModel;
    #levelBoon;

    async init(kitElement, kitObjects) {
        this.#kitElement = kitElement;
        this.#selectionModel = kitObjects.find(o => o.alias == "selectionModel")?.object;
        const character = Character.currentCharacter;
        if (this.#selectionModel) {
            this.#levelBoon = character.classes[this.#selectionModel.classIndex].levelBoons
                .find(lb => lb.level == this.#selectionModel.level);
        }
    }

    async onRendered() {
        this.#initializeDetails();
    }

    hasSelectionModel() {
        if (this.#selectionModel) {
            return true;
        }
        return false;
    }

    getTitle() {
        return `Level ${this.#selectionModel.level} ability score improvement or feat:`;
    }

    getRadioGroupName() {
        return `class-${this.#selectionModel.classIndex}-level-${this.#selectionModel.level}-boon`;
    }

    isAbilityScoresChecked() {
        return true;
    }

    onAbilityScoresRadioClick() {
        this.#kitElement.querySelector(".ability-scores-container").classList.remove("hidden");
        this.#kitElement.querySelector(".feats-container").classList.add("hidden");
    }

    async onFeatRadioClick() {
        this.#kitElement.querySelector(".ability-scores-container").classList.add("hidden");
        await UIKit.renderer.renderElement(this.#kitElement.querySelector(".feats-container"));
        this.#kitElement.querySelector(".feats-container").classList.remove("hidden");
    }

    getAbilityScores(controlIndex) {
        const selectionModel = {
            name: `ability-score-${controlIndex}`,
            maxSelections: 1
        };
        const options = Sources.getAbilities().map(a => ({
            value: a.name,
            text: a.title
        }));
        options.unshift({
            value: null,
            text: "Choose an ability score"
        });
        for (const option of options) {
            if (controlIndex == 2) {
                option.isSelected = (this.#levelBoon.abilityScore2 == option.value);
            }
            else {
                option.isSelected = (this.#levelBoon.abilityScore1 == option.value);
            }
        }
        selectionModel.options = options;
        return selectionModel;
    }

    getFeats() {
        const selectionModel = {
            name: "feat",
            maxSelections: 1
        };
        const character = DomainClassAndLevelModel.character;
        const characterClass = character.classes[Number(this.#selectionModel.classIndex)];
        const feats = Sources.getFeats(character.sources);
        for (const feat of feats) {
            if (feat.checkPrerequisites) {
                feat.prerequisites = feat.checkPrerequisites(character);
            }
        }
        const selectedFeats = [];
        for (const cls of character.classes) {
            for (const levelBoon of cls.levelBoons) {
                if (levelBoon.feat) {
                    selectedFeats.push(levelBoon.feat);
                }
            }
        }
        let options = feats.map(f => ({
            value: f.name ?? "",
            text: f.title ?? "",
            noteText: f.source.name ?? "",
            isSelected: (this.#levelBoon.feat == f.name),
            hasDetail: true,
            isDisabled: (f.prerequisites?.prerequisitesMet == false),
            disabledReason: f.prerequisites?.text
        }));
        for (const option of options) {
            const feat = feats.find(f => f.name == option.value);
            if (!option.isSelected && !option.isDisabled && !feat.canBeTakenMultipleTimes) {
                option.isDisabled = selectedFeats.includes(option.value);
                option.disabledReason = selectedFeats.includes(option.value) ? "Feat already selected" : null;
            }
        }    
        options = Utilities.sort(options, "text");
        options.unshift({
            value: null,
            text: "Choose a feat",
            hasDetail: false
        });
        selectionModel.options = options;
        return selectionModel;
    }

    async getFeatHtml(selectionModelName, optionValue) {
        const character = DomainClassAndLevelModel.character;
        return await Sources.getFeatHtml(character.sources, optionValue);
    }

    updateAbilityScore = async (selectionModelName, optionValues) => {
        let abilityScore = optionValues[0];
        if (abilityScore == "null") {
            abilityScore = null;
        }
        const classIndex = this.#selectionModel.classIndex;
        const levelBoon = {
            level: this.#selectionModel.level,
            hitPoints: this.#levelBoon.hitPoints,
            abilityScore1: this.#levelBoon.abilityScore1,
            abilityScore2: this.#levelBoon.abilityScore2,
        };
        if (selectionModelName == "ability-score-2") {
            levelBoon.abilityScore2 = abilityScore;
            if (this.#levelBoon.abilityScore2 == abilityScore) {
                return;
            }
        }
        else {
            levelBoon.abilityScore1 = abilityScore;
            if (this.#levelBoon.abilityScore1 == abilityScore) {
                return;
            }
        }
        const character = Character.currentCharacter;
        Sources.updateCharacterLevelBoon(character, classIndex, levelBoon);
        const message = { character: character };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    updateFeat = async (selectionModelName, optionValues) => {
        let feat = optionValues[0];
        if (feat == "null") {
            feat = null;
        }
        const classIndex = this.#selectionModel.classIndex;
        const levelBoon = {
            level: this.#selectionModel.level,
            hitPoints: this.#levelBoon.hitPoints,
            feat: feat
        };
        if (this.#levelBoon.feat == levelBoon.feat) {
            return;
        }
        const character = Character.currentCharacter;
        Sources.updateCharacterLevelBoon(character, classIndex, levelBoon);
        const message = { character: character };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    hasFeatOptions() {
        return (this.#getFeatOptions().length > 0);
    }

    getFeatOptions() {
        return this.#getFeatOptions();
    }

    async getFeatOptionHtml(selectionModelName, optionValue) {
        return "[no detail available]";
    }

    updateFeatOption = async (selectionModelName, optionValues) => {
        const character = Character.currentCharacter;
        const currentValues = character.selections.find(s => s.name == selectionModelName)?.values ?? [];
        if (Utilities.areArraysEqual(currentValues, optionValues)) {
            return;
        }
        const selection = {
            name: selectionModelName,
            sourcePropertyName: `class-${this.#selectionModel.classIndex}-level-${this.#selectionModel.level}-feat`,
            values: optionValues
        };
        Sources.updateCharacterSelection(character, selection);
        const message = { character: character, selection: selection };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    #initializeDetails() {
        if (this.#levelBoon?.feat) {
            this.#kitElement.querySelector(".data-radio-feat").click();
        }
        else {
            const element = this.#kitElement.querySelector(".data-radio-ability-scores");
            if (element) {
                element.click();
            } 
        }
    }

    #featOptions;
    #getFeatOptions() {
        if (!this.#featOptions) {
            const character = DomainClassAndLevelModel.character;
            let displayOptions = [];
            if (this.#levelBoon.feat) {
                const feat = Sources.getFeats(character.sources).find(f => f.name == this.#levelBoon.feat);
                if (feat.getOptions) {
                    const featOptions = feat.getOptions(character, this.#selectionModel.classIndex, this.#selectionModel.level);
                    displayOptions = SelectionModel.getDisplayOptions(character, featOptions);
                }
            }
            this.#featOptions = displayOptions;
        }
        return this.#featOptions;
    }

}
