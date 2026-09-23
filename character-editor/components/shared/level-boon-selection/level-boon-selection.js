
import { Character, Sources, Utilities } from "../../../domain/references.js";
import { EditorViewModel } from "../../editor-view/editor-view.js";
import { DomainClassAndLevelModel } from "../../domain-components/class-and-level/class-and-level.js";

export function createModel() {
    return new LevelBoonSelectionModel();
}

class LevelBoonSelectionModel {

    #kitElement;
    #selectionModel;

    async init(kitElement, kitObjects) {
        this.#kitElement = kitElement;
        this.#selectionModel = kitObjects.find(o => o.alias == "selectionModel")?.object;
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
        this.#kitElement.querySelector("#ability-scores-container").classList.remove("hidden");
        this.#kitElement.querySelector("#feats-container").classList.add("hidden");
    }

    onFeatRadioClick() {
        this.#kitElement.querySelector("#ability-scores-container").classList.add("hidden");
        this.#kitElement.querySelector("#feats-container").classList.remove("hidden");
    }

    getAbilityScores(controlIndex) {
        const selectionModel = {
            name: `ability-score-${controlIndex}`,
            maxSelections: 1
        };
        const options = [
            {
                value: null,
                text: "Choose an ability score"
            },
            {
                value: "strength",
                text: "Strength"
            },
            {
                value: "intelligence",
                text: "Intelligence"
            },
            {
                value: "wisdom",
                text: "Wisdom"
            },
            {
                value: "dexterity",
                text: "Dexterity"
            },
            {
                value: "constitution",
                text: "Constitution"
            },
            {
                value: "charisma",
                text: "Charisma"
            }
        ];
        for (const option of options) {
            if (controlIndex == 2) {
                option.isSelected = (this.#selectionModel.abilityScore2 == option.value);
            }
            else {
                option.isSelected = (this.#selectionModel.abilityScore1 == option.value);
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
            isSelected: (this.#selectionModel.feat == f.name),
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
            hitPoints: this.#selectionModel.hitPoints,
            abilityScore1: this.#selectionModel.abilityScore1,
            abilityScore2: this.#selectionModel.abilityScore2,
        };
        if (selectionModelName == "ability-score-2") {
            levelBoon.abilityScore2 = abilityScore;
            if (this.#selectionModel.abilityScore2 == abilityScore) {
                return;
            }
        }
        else {
            levelBoon.abilityScore1 = abilityScore;
            if (this.#selectionModel.abilityScore1 == abilityScore) {
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
            hitPoints: this.#selectionModel.hitPoints,
            feat: feat
        };
        if (this.#selectionModel.feat == levelBoon.feat) {
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
        //TODO: get html (if any) from domain source
        console.log(selectionModelName);
        console.log(optionValue);
        return "TODO";
    }

    updateFeatOption = async (selectionModelName, optionValues) => {
        const character = Character.currentCharacter;
        const currentValues = character.options.find(o => o.name == selectionModelName)?.values ?? [];
        if (Utilities.areArraysEqual(currentValues, optionValues)) {
            return;
        }
        const option = {
            name: selectionModelName,
            sourcePropertyName: `feat:class-${this.#selectionModel.classIndex}-level-${this.#selectionModel.level}`,
            values: optionValues
        };
        Sources.updateCharacterOption(character, option);
        const message = { character: character, option: option };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    #initializeDetails() {
        if (this.#selectionModel?.feat) {
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
            if (this.#selectionModel.feat) {
                const feat = Sources.getFeats(character.sources).find(f => f.name == this.#selectionModel.feat);
                if (feat.getOptions) {
                    const featOptions = feat.getOptions(character, this.#selectionModel.classIndex, this.#selectionModel.level);
                    displayOptions = this.#getDisplayOptions(featOptions);
                }
            }
            this.#featOptions = displayOptions;
        }
        return this.#featOptions;
    }

    #getDisplayOptions(domainOptions) {
        let displayOptions = [];
        for (const domainOption of domainOptions) {
            const options = domainOption.optionValues.map(ov => ({
                value: ov.value,
                text: ov.text ?? "",
                noteText: ov.noteText ?? "",
                hasDetail: ov.hasDetail ?? false,
                isSelected: ov.isSelected ?? false,
                isDisabled: ov.isDisabled ?? false,
                disabledReason: ov.disabledReason ?? "",
                hideCheckbox: ov.hideCheckbox
            }));
            displayOptions.push({
                name: domainOption.name ?? "",
                title: `${domainOption.title ?? "Option"}:`,
                maxSelections: domainOption.maxSelections ?? 1,
                options: options
            });
        }
        return displayOptions;
    }

}
