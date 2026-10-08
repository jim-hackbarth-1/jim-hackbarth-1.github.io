
import { Character, Sources, Utilities } from "../../../domain/references.js";
import { EditorViewModel } from "../../editor-view/editor-view.js";
import { SelectionModel } from "../../shared/selection/selection.js";

export function createModel() {
    return new DomainClassAndLevelModel();
}

export class DomainClassAndLevelModel {

    #kitElement;
    static character;

    async init(kitElement) {
        this.#kitElement = kitElement;
        DomainClassAndLevelModel.character = Character.currentCharacter;
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
        const oldCharacter = DomainClassAndLevelModel.character;
        DomainClassAndLevelModel.character = Character.currentCharacter;
        this.#classSelections = null;
        this.#subClasses = null;
        this.#subClassSelections = null;
        this.#levelBoons = null;
        await UIKit.renderer.renderElement(this.#kitElement.querySelector("#classes-array"));
        EditorViewModel.restoreScrollY();
    }

    async addCharacterClass() {
        const character = Character.currentCharacter;
        const cls = {
            value: "",
            text: "",
            level: "",
            subClass: "",
            levelBoons: []
        };
        Sources.addCharacterClass(character, cls);
        const message = {
            character: character,
            section: "details-class-and-level"
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    async removeCharacterClass(classIndex) {
        const character = Character.currentCharacter;
        Sources.removeCharacterClass(character, classIndex);
        const message = {
            character: character,
            section: "details-class-and-level"
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    getCharacterClasses() {
        const classes = DomainClassAndLevelModel.character.classes;
        for (let i = 0; i < classes.length; i++) {
            classes[i].index = i;
        }
        return classes;
    }

    // ~~~ classes
    getClassSelectionModel(classIndex) {
        const character = DomainClassAndLevelModel.character;
        const characterClass = character.classes[classIndex];
        let currentSelection = { value: null, text: "Choose a class ..." };
        if (characterClass.value) {
            currentSelection = { value: characterClass.value, text: characterClass.text };
        }
        return {
            name: `class-${classIndex}`,
            title: "Class",
            maxSelections: 1,
            currentSelections: [currentSelection],
            getOptions: this.getClasses,
            getOptionDetail: this.getClassHtml,
            updateSelection: this.updateClass
        };
    }

    getClasses(selectionModelName) {
        const character = DomainClassAndLevelModel.character;
        const classIndex = Number(selectionModelName.replace("class-", ""));
        const characterClass = character.classes[classIndex];
        const classes = Sources.getClasses(character.sources);

        const otherClassNames = [];
        for (let i = 0; i < character.classes.length; i++) {
            if (i != classIndex && character.classes[i].value) {
                otherClassNames.push(character.classes[i].value);
            }
        }

        let options = classes.map(c =>
        ({
            value: c.name,
            text: c.title,
            noteText: `(${c.source.title})`,
            hasDetail: true,
            isSelected: (characterClass?.value == c.name),
            isDisabled: otherClassNames.includes(c.name),
            disabledReason: otherClassNames.includes(c.name) ? "Disabled: Selected for other class" : ""
        }));

        if (classIndex > 0) {

            // check primary class multiclass eligibility
            const primaryClass = classes.find(c => c.name == character.classes[0].value);
            if (primaryClass?.getMulticlassEligibility) {
                const primaryMultiClassEligibility = primaryClass.getMulticlassEligibility(character);
                if (!primaryMultiClassEligibility?.isEligible) {
                    for (const option of options) {
                        if (!option.isDisabled) {
                            option.isDisabled = true;
                            option.disabledReason = `Disabled: ${primaryMultiClassEligibility?.ineligibilityReason ?? "Ineligible for multiclassing"}`;
                        }
                    }
                }
            }

            // check secondary class multiclass eligibility
            for (const option of options) {
                if (!option.isDisabled) {
                    const cls = classes.find(c => c.name == option.value);
                    if (cls.getMulticlassEligibility) {
                        const multiClassEligibility = cls.getMulticlassEligibility(character);
                        if (!multiClassEligibility?.isEligible) {
                            option.isDisabled = true;
                            option.disabledReason = `Disabled: ${multiClassEligibility?.ineligibilityReason ?? "Ineligible for multiclassing"}`;
                        }
                    }
                }
            }
        }

        if (options.length > 0) {
            options = Utilities.sort(options, "text");
            options.unshift({
                value: null,
                text: "Choose a class ...",
                hasDetail: false,
                isSelected: false
            });
        }
        else {
            options.push({
                value: null,
                text: "No classes in selected sources",
                hasDetail: false,
                isSelected: false
            });
        }
        return options;
    }

    async getClassHtml(selectionModelName, optionValue) {
        return await Sources.getClassHtml(DomainClassAndLevelModel.character.sources, optionValue);
    }

    async updateClass(selectionModelName, options) {
        const cls = options[0];
        const character = Character.currentCharacter;
        const classIndex = Number(selectionModelName.replace("class-", ""));
        const characterClass = character.classes[classIndex];
        if (characterClass?.value == cls.value) {
            return;
        }
        Sources.updateCharacterClass(character, classIndex, cls);
        const message = {
            character: character,
            section: "details-class-and-level"
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    // ~~~ levels
    getLevelSelectionModel(classIndex) {
        const character = DomainClassAndLevelModel.character;
        const characterClass = character.classes[classIndex];
        let currentSelection = { value: null, text: "Choose a level ..." };
        if (characterClass.level) {
            currentSelection = { value: characterClass.level, text: `Level ${characterClass.level}` };
        }
        return {
            name: `level-${classIndex}`,
            title: "Level",
            maxSelections: 1,
            currentSelections: [currentSelection],
            getOptions: this.getLevels,
            updateSelection: this.updateLevel
        };
    }

    getLevels(selectionModelName) {
        const character = DomainClassAndLevelModel.character;
        const classIndex = Number(selectionModelName.replace("level-", ""));
        const characterClass = character.classes[classIndex];
        const level = Number(characterClass.level);
        const classes = Sources.getClasses(character.sources);

        let options = [{
            value: null,
            text: "Choose a level ..."
        }];
        for (let i = 1; i <= 20; i++) {
            options.push({
                value: i,
                text: `Level ${i}`,
                isSelected: (i == level)
            });
        }
        return options;
    }

    async updateLevel(selectionModelName, options) {
        let level = options[0].value;
        if (level == "null") {
            level = null;
        }
        const character = Character.currentCharacter;
        const index = Number(selectionModelName.replace("level-", ""));
        const characterClass = character.classes[index];
        if (!characterClass.value || Number(characterClass.level) == Number(level)) {
            level = null;
        }
        Sources.updateCharacterLevel(character, index, level);
        const message = {
            character: character,
            section: "details-class-and-level"
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    // ~~~ class selections
    hasClassSelections(classIndex) {
        return (this.#getClassSelections(classIndex).length > 0);
    }

    getClassSelections(classIndex) {
        return this.#getClassSelections(classIndex);
    }

    getClassSelectionOptions(selectionModelName) {
        const parts = selectionModelName.split(":");
        const classIndex = Number(parts[0].replace("class-", ""));
        const modelName = parts[1];
        const character = DomainClassAndLevelModel.character;
        const characterClass = character.classes[classIndex];
        let options = [];
        if (characterClass.value) {
            const cls = Sources.getClasses(character.sources).find(c => c.name == characterClass.value);
            if (cls?.getSelectionOptions) {
                options = cls.getSelectionOptions(character, classIndex, modelName);
            }
        }
        return options;
    }

    async updateClassSelection(selectionModelName, selectedOptions) {
        const parts = selectionModelName.split(":");
        const classIndex = Number(parts[0].replace("class-", ""));
        const modelName = parts[1];
        const character = DomainClassAndLevelModel.character;
        const characterClass = character.classes[classIndex];
        const currentValues = character.selections.find(s => s.name == modelName)?.values ?? [];
        if (Utilities.areArraysEqual(currentValues, selectedOptions, ["value"])) {
            return;
        }
        const selection = {
            name: modelName,
            sourcePropertyName: `class-${classIndex}`,
            sourcePropertyValue: characterClass.value,
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

    // ~~~ sub classes
    hasSubClasses(classIndex) {
        const subClasses = this.#getSubClasses(classIndex)?.subClasses ?? [];
        return (subClasses.length > 0);
    }

    getSubClassSelectionModel(classIndex) {
        const character = DomainClassAndLevelModel.character;
        const characterClass = character.classes[classIndex];
        const title = this.#getSubClasses(classIndex).title;
        let currentSelection = { value: null, text: `${title} ...` };
        if (characterClass.subClass?.value) {
            currentSelection = { value: characterClass.subClass.value, text: characterClass.subClass.text };
        } 
        return {
            name: `sub-class-${classIndex}`,
            title: title,
            maxSelections: 1,
            currentSelections: [currentSelection],
            getOptions: this.getSubClasses,
            getOptionDetail: this.getSubClassHtml,
            updateSelection: this.updateSubClass
        };
    }

    getSubClasses = (selectionModelName) => {
        const character = DomainClassAndLevelModel.character;
        const classIndex = Number(selectionModelName.replace("sub-class-", ""));
        const characterClass = character.classes[classIndex];
        const subClassInfo = this.#getSubClasses(classIndex);
        let options = subClassInfo.subClasses.map(sc =>
        ({
            value: sc.name,
            text: sc.title,
            noteText: `(${sc.source.title})`,
            hasDetail: true,
            isSelected: (characterClass.subClass?.value == sc.name),
        }));

        if (options.length > 0) {
            options = Utilities.sort(options, "text");
            options.unshift({
                value: null,
                text: `${subClassInfo.title} ...`,
                hasDetail: false,
                isSelected: false
            });
        }
        else {
            options.push({
                value: null,
                text: "No sub classes in selected sources",
                hasDetail: false,
                isSelected: false
            });
        }
        return options;
    }

    async getSubClassHtml(selectionModelName, optionValue) {
        const character = DomainClassAndLevelModel.character;
        const classIndex = Number(selectionModelName.replace("sub-class-", ""));
        const characterClass = character.classes[classIndex];
        return await Sources.getSubClassHtml(character.sources, characterClass.value, optionValue);
    }

    async updateSubClass(selectionModelName, options) {
        const subClass = options[0];
        const character = Character.currentCharacter;
        const classIndex = Number(selectionModelName.replace("sub-class-", ""));
        const characterClass = character.classes[classIndex];
        if (characterClass.subClass?.value == subClass.value) {
            return;
        }
        Sources.updateCharacterSubClass(character, classIndex, subClass);
        const message = {
            character: character,
            section: "details-class-and-level"
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    // ~~~ sub class selections
    hasSubClassSelections(classIndex) {
        return (this.#getSubClassSelections(classIndex).length > 0);
    }

    getSubClassSelections(classIndex) {
        return this.#getSubClassSelections(classIndex);
    }

    getSubClassSelectionOptions(selectionModelName) {
        const parts = selectionModelName.split(":");
        const classIndex = Number(parts[0].replace("sub-class-", ""));
        const modelName = parts[1];
        const character = DomainClassAndLevelModel.character;
        const characterClass = character.classes[classIndex];
        let options = [];
        if (characterClass.subClass?.value) {
            const subClass = Sources
                .getSubClasses(character.sources, characterClass.value)
                .find(sc => sc.name == characterClass.subClass.value);
            if (subClass?.getSelectionOptions) {
                options = subClass.getSelectionOptions(character, classIndex, modelName);
            }
        }
        return options;
    }

    async updateSubClassSelection(selectionModelName, selectedOptions) {
        const parts = selectionModelName.split(":");
        const classIndex = Number(parts[0].replace("sub-class-", ""));
        const modelName = parts[1];
        const character = DomainClassAndLevelModel.character;
        const characterClass = character.classes[classIndex];
        const currentValues = character.selections.find(s => s.name == modelName)?.values ?? [];
        if (Utilities.areArraysEqual(currentValues, selectedOptions, ["value"])) {
            return;
        }
        const selection = {
            name: modelName,
            sourcePropertyName: `subClass-${classIndex}`,
            sourcePropertyValue: characterClass.subClass.value,
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

    // ~~~ level boons
    hasLevelBoons(classIndex) {
        return (this.#getLevelBoons(classIndex).length > 0);
    }

    getLevelBoons(classIndex) {
        return this.#getLevelBoons(classIndex);
    }

    #classSelections;
    #getClassSelections(classIndex) {
        if (!this.#classSelections) {
            const classSelections = [];
            const character = DomainClassAndLevelModel.character;
            for (let i = 0; i < character.classes.length; i++) {
                const characterClass = character.classes[i];
                if (characterClass.value) {
                    const cls = Sources.getClasses(character.sources).find(c => c.name == characterClass.value);
                    if (cls?.getSelections) {
                        const characterClassSelections = cls.getSelections(character, i);
                        for (const classSelection of characterClassSelections) {
                            classSelection.name = `class-${classIndex}:${classSelection.name}`;
                            classSelection.getOptions = this.getClassSelectionOptions;
                            classSelection.updateSelection = this.updateClassSelection;
                            classSelections.push(classSelection);
                        }
                    }
                }
            }
            this.#classSelections = classSelections;
        }
        return this.#classSelections.filter(cs => cs.name.startsWith(`class-${classIndex}`));
    }

    #subClasses;
    #getSubClasses(classIndex) {
        if (!this.#subClasses) {
            const subClasses = [];
            const character = DomainClassAndLevelModel.character;
            for (let i = 0; i < character.classes.length; i++) {
                let classSubClasses = [];
                let title = "Choose a sub class ...";
                let subClassOptional = false;
                const characterClass = character.classes[i];
                if (characterClass.value) {
                    const cls = Sources.getClasses(character.sources).find(c => c.name == characterClass.value);
                    if (Number(characterClass.level) >= Number(cls.subClassLevel)) {
                        classSubClasses = Sources.getSubClasses(character.sources, characterClass.value);
                    }
                    if (cls.subClassTitle) {
                        title = `Choose a ${cls.subClassTitle}`;
                        const startsWithVowelPattern = '^[aieouAIEOU].*'
                        const startsWithVowel = cls.subClassTitle.match(startsWithVowelPattern);
                        if (startsWithVowel) {
                            title = `Choose an ${cls.subClassTitle}`;
                        }
                    }
                    if (!classSubClasses.some(sc => sc.source.name == cls.source.name)) {
                        title+= " (Optional)"
                    }
                }
                subClasses.push({
                    classIndex: i,
                    subClasses: classSubClasses,
                    title: title
                });
            } 
            this.#subClasses = subClasses;
        }
        return this.#subClasses.find(sc => sc.classIndex == classIndex);
    }

    #subClassSelections;
    #getSubClassSelections(classIndex) {
        if (!this.#subClassSelections) {
            const subClassSelections = [];
            const character = DomainClassAndLevelModel.character;
            for (let i = 0; i < character.classes.length; i++) {
                const characterClass = character.classes[i];
                if (characterClass.subClass?.value) {
                    const subClass = Sources
                        .getSubClasses(character.sources, characterClass.value)
                        .find(sc => sc.name == characterClass.subClass.value);
                    if (subClass?.getSelections) {
                        const characterClassSubClassSelections = subClass.getSelections(character, i);
                        for (const subClassSelection of characterClassSubClassSelections) {
                            subClassSelection.name = `sub-class-${classIndex}:${subClassSelection.name}`;
                            subClassSelection.getOptions = this.getSubClassSelectionOptions;
                            subClassSelection.updateSelection = this.updateSubClassSelection;
                            subClassSelections.push(subClassSelection);
                        }
                    }
                }
            }
            this.#subClassSelections = subClassSelections;
        }
        return this.#subClassSelections.filter(scs => scs.name.startsWith(`sub-class-${classIndex}`));
    }

    #levelBoons;
    #getLevelBoons(classIndex) {
        if (!this.#levelBoons) {
            const levelBoons = [];
            const character = DomainClassAndLevelModel.character;
            const levelFilter = [4, 8, 12, 16, 19];
            for (let i = 0; i < character.classes.length; i++) {
                const classLevelBoons = character.classes[i].levelBoons.filter(lb => levelFilter.includes(lb.level));
                for (const classLevelBoon of classLevelBoons) {
                    levelBoons.push({
                        classIndex: i,
                        level: classLevelBoon.level
                    });
                }
            }
            this.#levelBoons = levelBoons;
        }
        return this.#levelBoons.filter(lb => lb.classIndex == classIndex);
    }

}
