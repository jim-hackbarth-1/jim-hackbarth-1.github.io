
import { Character, Sources, Utilities } from "../../../domain/references.js";
import { EditorViewModel } from "../../editor-view/editor-view.js";
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
        const character = EditorViewModel.character;
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

    getAbilityScoreSelectionModel(controlIndex) {
        const index = Number(controlIndex);
        const character = EditorViewModel.character;
        let currentSelection = { value: null, text: "Choose an ability ..." };
        if (index == 1 && this.#levelBoon.abilityScore1) {
            const ability1 = Sources.getAbilities().find(a => a.name == this.#levelBoon.abilityScore1);
            currentSelection = {
                value: ability1.name,
                text: ability1.title
            };
        }
        if (index == 2 && this.#levelBoon.abilityScore2) {
            const ability2 = Sources.getAbilities().find(a => a.name == this.#levelBoon.abilityScore2);
            currentSelection = {
                value: ability2.name,
                text: ability2.title
            };
        }
        return {
            name: `ability-${index}`,
            title: "",
            maxSelections: 1,
            currentSelections: [currentSelection],
            getOptions: this.getAbilities,
            updateSelection: this.updateAbility
        };
    }

    getAbilities = (selectionModelName) => {
        const index = Number(selectionModelName.replace("ability-", ""));
        const options = Sources.getAbilities().map(a => ({
            value: a.name,
            text: a.title
        }));
        options.unshift({
            value: null,
            text: "Choose an ability ..."
        });
        for (const option of options) {
            if (index == 1) {
                option.isSelected = (this.#levelBoon.abilityScore1 == option.value);
            }
            else {
                option.isSelected = (this.#levelBoon.abilityScore2 == option.value);
            }
        }
        return options;
    }

    updateAbility = async (selectionModelName, options) => {
        const ability = options[0];
        const index = Number(selectionModelName.replace("ability-", ""));
        if (index == 1 && this.#levelBoon.abilityScore1 == ability.value) {
            return;
        }
        if (index == 2 && this.#levelBoon.abilityScore2 == ability.value) {
            return;
        }
        const classIndex = this.#selectionModel.classIndex;
        const levelBoon = {
            level: this.#selectionModel.level,
            hitPoints: this.#levelBoon.hitPoints,
            abilityScore1: this.#levelBoon.abilityScore1,
            abilityScore2: this.#levelBoon.abilityScore2,
        };
        if (index == 1) {
            levelBoon.abilityScore1 = ability.value;
        }
        else {
            levelBoon.abilityScore2 = ability.value;
        }
        const character = Character.currentCharacter;
        Sources.updateCharacterLevelBoon(character, classIndex, levelBoon);
        const message = {
            character: character,
            section: "details-class-and-level"
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    getFeatSelectionModel() {
        const character = EditorViewModel.character;
        let currentSelection = { value: null, text: "Choose a feat ..." };
        let alertMessage = "";
        if (this.#levelBoon.feat?.value) {
            const feat = Sources.getFeats(character.sources).find(f => f.name == this.#levelBoon.feat.value);
            if (feat?.checkPrerequisites) {
                const prereq = feat.checkPrerequisites(character).text;
                if (prereq) {
                    alertMessage = `<p>Character does not meet prerequisites:<br/>- ${prereq}</p>`;
                }
            }
            currentSelection = this.#levelBoon.feat;
        }
        return {
            name: "feat",
            title: "",
            maxSelections: 1,
            currentSelections: [currentSelection],
            alertMessage: alertMessage,
            getOptions: this.getFeats,
            getOptionDetail: this.getFeatHtml,
            updateSelection: this.updateFeat
        };
    }

    getFeats = () => {
        const character = EditorViewModel.character;
        const feats = Sources.getFeats(character.sources);
        for (const feat of feats) {
            if (feat.checkPrerequisites) {
                feat.prerequisites = feat.checkPrerequisites(character);
            }
        }
        const selectedFeats = [];
        for (const cls of character.classes) {
            for (const levelBoon of cls.levelBoons) {
                if (levelBoon.feat?.value) {
                    selectedFeats.push(levelBoon.feat.value);
                }
            }
        }
        let options = feats.map(f => ({
            value: f.name ?? "",
            text: f.title ?? "",
            noteText: f.source.name ?? "",
            isSelected: (this.#levelBoon.feat?.value == f.name),
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
        if (options.length > 0) {
            options = Utilities.sort(options, "text");
            options.unshift({
                value: null,
                text: "Choose a feat ...",
                hasDetail: false,
                isSelected: false
            });
        }
        else {
            options.push({
                value: null,
                text: "No feats in selected sources",
                hasDetail: false,
                isSelected: false
            });
        }
        return options;
    }

    async getFeatHtml(selectionModelName, optionValue) {
        return await Sources.getFeatHtml(EditorViewModel.character.sources, optionValue);
    }

    updateFeat = async (selectionModelName, options) => {
        const feat = options[0];
        if (this.#levelBoon.feat?.value == feat.value) {
            return;
        }
        const classIndex = this.#selectionModel.classIndex;
        const levelBoon = {
            level: this.#selectionModel.level,
            hitPoints: this.#levelBoon.hitPoints,
            feat: feat
        };
        const character = Character.currentCharacter;
        Sources.updateCharacterLevelBoon(character, classIndex, levelBoon);
        const message = {
            character: character,
            section: "details-class-and-level"
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    hasFeatSelections() {
        return (this.#getFeatSelections().length > 0);
    }

    getFeatSelections() {
        return this.#getFeatSelections();
    }

    getFeatSelectionOptions = (selectionModelName) => {
        let options = [];
        if (this.#levelBoon.feat?.value) {
            const character = EditorViewModel.character;
            const feat = Sources.getFeats(character.sources).find(f => f.name == this.#levelBoon.feat.value);
            if (feat?.getSelectionOptions) {
                options = feat.getSelectionOptions(
                    character, this.#selectionModel.classIndex, this.#selectionModel.level, selectionModelName);
            }
        }
        return options;
    }

    updateFeatSelection = async (selectionModelName, selectedOptions) => {
        const character = Character.currentCharacter;
        const currentValues = character.selections.find(s => s.name == selectionModelName)?.values ?? [];
        if (Utilities.areArraysEqual(currentValues, selectedOptions, ["value"])) {
            return;
        }
        const selection = {
            name: selectionModelName,
            sourcePropertyName: `class-${this.#selectionModel.classIndex}-level-${this.#selectionModel.level}-feat`,
            values: selectedOptions
        };
        Sources.updateCharacterSelection(character, selection);
        const message = {
            character: character,
            selection: selection,
            section: "details-class-and-level"
        };
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

    #featSelections;
    #getFeatSelections() {
        if (!this.#featSelections) {
            const character = EditorViewModel.character;
            let featSelections = [];
            if (this.#levelBoon.feat?.value) {
                const feat = Sources.getFeats(character.sources).find(f => f.name == this.#levelBoon.feat.value);
                if (feat.getSelections) {
                    featSelections = feat.getSelections(character, this.#selectionModel.classIndex, this.#selectionModel.level);
                    for (const featSelection of featSelections) {
                        featSelection.getOptions = this.getFeatSelectionOptions;
                        featSelection.updateSelection = this.updateFeatSelection;
                    }
                }
            }
            this.#featSelections = featSelections;
        }
        return this.#featSelections;
    }

}
