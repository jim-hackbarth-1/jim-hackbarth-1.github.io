
import { Character, Sources, Utilities } from "../../../domain/references.js";
import { EditorViewModel } from "../../editor-view/editor-view.js";

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
        this.#classOptions = null;
        this.#subClasses = null;
        this.#subClassOptions = null;
        this.#levelBoons = null;
        const isEquipmentAddRemove = this.#isEquipmentAddRemove(oldCharacter, message);
        if (isEquipmentAddRemove) {
            return;
        }
        await UIKit.renderer.renderElement(this.#kitElement.querySelector("#classes-array"));
    }

    async addCharacterClass() {
        const character = Character.currentCharacter;
        const cls = {
            name: "",
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
    getClasses(classIndex) {
        const selectionModel = {
            name: `class-${classIndex}`,
            title: "Class:",
            maxSelections: 1
        };
        const character = DomainClassAndLevelModel.character;
        const index = Number(classIndex);
        const characterClass = character.classes[index];
        const otherClassNames = [];
        for (let i = 0; i < character.classes.length; i++) {
            if (i != index && character.classes[i].name) {
                otherClassNames.push(character.classes[i].name);
            }
        }
        let classes = Sources.getClasses(character.sources);
        let options = classes.map(c =>
        ({
            value: c.name,
            text: c.title,
            noteText: `(${c.source.title})`,
            hasDetail: true,
            isSelected: (characterClass.name == c.name),
            isDisabled: otherClassNames.includes(c.name),
            disabledReason: otherClassNames.includes(c.name) ? "Disabled: Selected for other class" : ""
        }));

        if (index > 0) {

            // check primary class multiclass eligibility
            const primaryClass = classes.find(c => c.name == character.classes[0].name);
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
                text: "Choose a class",
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
        selectionModel.options = options;
        return selectionModel;
    }

    async getClassHtml(selectionModelName, optionValue) {
        return await Sources.getClassHtml(DomainClassAndLevelModel.character.sources, optionValue);
    }

    async updateClass(selectionModelName, optionValues) {
        let className = optionValues[0];
        if (className == "null") {
            className = null;
        }
        const character = Character.currentCharacter;
        const index = Number(selectionModelName.replace("class-", ""));
        const characterClass = character.classes[index];
        if (characterClass.name == className) {
            return;
        }
        Sources.updateCharacterClass(character, index, className);
        const message = {
            character: character,
            section: "details-class-and-level"
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    // ~~~ levels
    getLevels(classIndex) {
        const selectionModel = {
            name: `level-${classIndex}`,
            title: "Level:",
            maxSelections: 1
        };
        const character = DomainClassAndLevelModel.character;
        const index = Number(classIndex);
        const characterClass = character.classes[index];
        const options = [{
            value: null,
            text: "Select a level"
        }];
        for (let i = 1; i <= 20; i++) {
            options.push({
                value: i,
                text: `Level ${i}`,
                isSelected: (i == characterClass.level)
            });
        }
        selectionModel.options = options;
        return selectionModel;
    }

    async updateLevel(selectionModelName, optionValues) {
        let level = optionValues[0];
        if (level == "null") {
            level = null;
        }
        const character = Character.currentCharacter;
        const index = Number(selectionModelName.replace("level-", ""));
        const characterClass = character.classes[index];
        if (Number(characterClass.level) == Number(level)) {
            return;
        }
        Sources.updateCharacterLevel(character, index, level);
        const message = {
            character: character,
            section: "details-class-and-level"
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    // ~~~ class options
    hasClassOptions(classIndex) {
        return (this.#getClassOptions(classIndex).length > 0);
    }

    getClassOptions(classIndex) {
        return this.#getClassOptions(classIndex);
    }

    getClassOptionHtml(selectionModelName, optionValue) {
        return "[no detail available]";
    }

    async updateClassOption(selectionModelName, optionValues) {
        const parts = selectionModelName.split(":");
        const classIndex = Number(parts[0].replace("class-", ""));
        const character = Character.currentCharacter;
        const characterClass = character.classes[classIndex];
        const optionName = parts[1];
        const currentValues = character.options.find(o => o.name == optionName)?.values ?? [];
        if (Utilities.areArraysEqual(currentValues, optionValues)) {
            return;
        }
        const option = {
            name: optionName,
            sourcePropertyName: "class",
            sourcePropertyValue: characterClass.name,
            values: optionValues
        }
        Sources.updateCharacterOption(character, option);
        const message = {
            character: character,
            option: option,
            section: "details-class-and-level"
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    // ~~~ sub classes
    hasSubClasses(classIndex) {
        return (this.#getSubClasses(classIndex).length > 0);
    }

    getSubClasses(classIndex) {
        const selectionModel = {
            name: `subClass-${classIndex}`,
            title: "Sub Class:",
            maxSelections: 1,
            options: []
        };
        const character = DomainClassAndLevelModel.character;
        const index = Number(classIndex);
        const characterClass = character.classes[index];
        if (!characterClass.name) {
            return selectionModel;
        }
        const subClasses = this.#getSubClasses(classIndex);
        let options = subClasses.map(sc =>
        ({
            value: sc.name,
            text: sc.title,
            noteText: `(${sc.source.title})`,
            hasDetail: true,
            isSelected: (characterClass.subClass == sc.name),
        }));
        if (subClasses.length > 0) {
            const cls = Sources.getClasses(character.sources).find(c => c.name == characterClass.name);
            let title = "Choose a sub class";
            if (cls.subClassTitle) {
                selectionModel.title = `${cls.subClassTitle}:`;
                title = `Choose a ${cls.subClassTitle}`;
                const startsWithVowelPattern = '^[aieouAIEOU].*'
                const startsWithVowel = cls.subClassTitle.match(startsWithVowelPattern);
                if (startsWithVowel) {
                    title = `Choose an ${cls.subClassTitle}`;
                }
            }
            if (!subClasses.some(sc => sc.source.name == cls.source.name)) {
                // sub-classes available, but none from class's source
                title += " (Optional)"
            }
            options = Utilities.sort(options, "text");
            options.unshift({
                value: null,
                text: title,
                hasDetail: false
            });
        }
        selectionModel.options = options;
        return selectionModel;
    }

    async getSubClassHtml(selectionModelName, optionValue) {
        const character = DomainClassAndLevelModel.character;
        const classIndex = Number(selectionModelName.replace("subClass-", ""));
        const characterClass = character.classes[classIndex];
        return await Sources.getSubClassHtml(character.sources, characterClass.name, optionValue);
    }

    async updateSubClass(selectionModelName, optionValues) {
        let subClass = optionValues[0];
        if (subClass == "null") {
            subClass = null;
        }
        const character = Character.currentCharacter;
        const classIndex = Number(selectionModelName.replace("subClass-", ""));
        Sources.updateCharacterSubClass(character, classIndex, subClass);
        const message = {
            character: character,
            section: "details-class-and-level"
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    // ~~~ sub class options
    hasSubClassOptions(classIndex) {
        return (this.#getSubClassOptions(classIndex).length > 0);
    }

    getSubClassOptions(classIndex) {
        return this.#getSubClassOptions(classIndex);
    }

    getSubClassOptionHtml(selectionModelName, optionValue) {
        return "[no detail available]";
    }

    async updateSubClassOption(selectionModelName, optionValues) {
        const parts = selectionModelName.split(":");
        const classIndex = Number(parts[0].replace("class-", ""));
        const character = Character.currentCharacter;
        const characterClass = character.classes[classIndex];
        const optionName = parts[1];
        const currentValues = character.options.find(o => o.name == optionName)?.values ?? [];
        if (Utilities.areArraysEqual(currentValues, optionValues)) {
            return;
        }
        const option = {
            name: optionName,
            sourcePropertyName: "subClass",
            sourcePropertyValue: characterClass.subClass,
            values: optionValues
        }
        Sources.updateCharacterOption(character, option);
        const message = {
            character: character,
            option: option,
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

    #classOptions;
    #getClassOptions(classIndex) {
        if (!this.#classOptions) {
            const classOptions = [];
            const character = DomainClassAndLevelModel.character;
            for (let i = 0; i < character.classes.length; i++) {
                let displayOptions = [];
                const characterClass = character.classes[i];
                if (characterClass.name) {
                    const cls = Sources.getClasses(character.sources).find(c => c.name == characterClass.name);
                    if (cls.getOptions) {
                        const domainOptions = cls.getOptions(character);
                        displayOptions = this.#getDisplayOptions(i, domainOptions);
                    }
                }
                classOptions.push({
                    classIndex: i,
                    options: displayOptions
                });
            }
            this.#classOptions = classOptions;
        }
        return this.#classOptions.find(co => co.classIndex == classIndex).options;
    }

    #subClasses;
    #getSubClasses(classIndex) {
        if (!this.#subClasses) {
            const subClasses = [];
            const character = DomainClassAndLevelModel.character;
            for (let i = 0; i < character.classes.length; i++) {
                let classSubClasses = [];
                const characterClass = character.classes[i];
                if (characterClass.name) {
                    const cls = Sources.getClasses(character.sources).find(c => c.name == characterClass.name);
                    if (Number(characterClass.level) >= Number(cls.subClassLevel)) {
                        classSubClasses = Sources.getSubClasses(character.sources, characterClass.name);
                    }
                }
                subClasses.push({
                    classIndex: i,
                    subClasses: classSubClasses
                });
            } 
            this.#subClasses = subClasses;
        }
        return this.#subClasses.find(sc => sc.classIndex == classIndex).subClasses;
    }

    #subClassOptions;
    #getSubClassOptions(classIndex) {
        if (!this.#subClassOptions) {
            const subClassOptions = [];
            const character = DomainClassAndLevelModel.character;
            for (let i = 0; i < character.classes.length; i++) {
                let displayOptions = [];
                const characterClass = character.classes[i];
                if (characterClass.name && characterClass.subClass) {
                    const subClass = Sources
                        .getSubClasses(character.sources, characterClass.name)
                        .find(sc => sc.name == characterClass.subClass);
                    if (subClass.getOptions) {
                        const domainOptions = subClass.getOptions(character);
                        displayOptions = this.#getDisplayOptions(i, domainOptions);
                    }
                }
                subClassOptions.push({
                    classIndex: i,
                    options: displayOptions
                });
            }
            this.#subClassOptions = subClassOptions;
        }
        return this.#subClassOptions.find(sco => sco.classIndex == classIndex).options;
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

    #getDisplayOptions(classIndex, domainOptions) {
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
                name: `class-${classIndex}:${domainOption.name}`,
                title: `${domainOption.title ?? "Option"}:`,
                maxSelections: domainOption.maxSelections ?? 1,
                options: options
            });
        }
        return displayOptions;
    }

    #isEquipmentAddRemove(character, message) {
        if (message.equipmentAdded) {
            return true;
        }
        const index = Number(message.equipmentRemoved);
        if (index >= 0 && index < character.equipment.length) {
            const isEquipped = character.equipment[index].isEquipped;
            if (!isEquipped) {
                return true;
            }
        }
        return false;
    }

}
