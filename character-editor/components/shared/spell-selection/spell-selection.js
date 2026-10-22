
import { Character, Sources, Utilities } from "../../../domain/references.js";
import { EditorViewModel } from "../../editor-view/editor-view.js";
import { SelectionModel } from "../../shared/selection/selection.js";

export function createModel() {
    return new SpellSelectionModel();
}

export class SpellSelectionModel {

    #kitElement;
    #selectionModel;
    #options;

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

    toggleDetail(event) {
        this.#kitElement.querySelector(".toggle-button-expand").classList.toggle("hidden");
        this.#kitElement.querySelector(".toggle-button-collapse").classList.toggle("hidden");
        this.#kitElement.querySelector(".selection-content").classList.toggle("hidden");
        this.#updateCompletedDisplay();
    }

    async toggleReplacementDetail(event) {
        const replacementContainer = this.#kitElement.querySelector(".spell-replacement-container");
        const replaceExpand = this.#kitElement.querySelector(".toggle-button-replace-expand");
        const replaceCollapse = this.#kitElement.querySelector(".toggle-button-replace-collapse");
        replacementContainer.classList.toggle("hidden");
        replaceExpand.classList.toggle("hidden");
        replaceCollapse.classList.toggle("hidden");
        const selectionModelName = `${this.#selectionModel.name}-replacement-expanded`;
        let sourcePropertyName = "class";
        let sourcePropertyValue = this.#selectionModel.className;
        if (this.#selectionModel.subClassName) {
            sourcePropertyName = "subClass";
            sourcePropertyValue = this.#selectionModel.subClassName;
        }
        let expanded = true;
        if (replacementContainer.classList.contains("hidden")) {
            expanded = false;
        }
        const selection = {
            name: selectionModelName,
            sourcePropertyName: sourcePropertyName,
            sourcePropertyValue: sourcePropertyValue,
            values: [expanded]
        };
        const character = Character.currentCharacter;
        Sources.updateCharacterSelection(character, selection);
        const message = {
            character: character,
            selection: selection,
            section: "details-class-and-level"
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    hasSpellSource(source) {
        if (this.#selectionModel[source]) {
            return true;
        }
        return false;
    }

    getCantripsSelectionModel() {
        const selectionModel = this.#selectionModel.cantrips;
        selectionModel.getOptions = this.getSpells;
        selectionModel.getOptionDetail = this.getSpellDetail;
        selectionModel.updateSelection = this.updateSpells;
        return selectionModel;
    }

    getSpellsSelectionModel() {
        const selectionModel = this.#selectionModel.spells;
        selectionModel.getOptions = this.getSpells;
        selectionModel.getOptionDetail = this.getSpellDetail;
        selectionModel.updateSelection = this.updateSpells;
        return selectionModel;
    }

    getReplacedSpellSelectionModel() {
        const selectionModel = this.#selectionModel.replacedSpell;
        selectionModel.getOptions = this.getSpells;
        selectionModel.getOptionDetail = this.getSpellDetail;
        selectionModel.updateSelection = this.updateSpells;
        return selectionModel;
    }

    getReplacementSpellSelectionModel() {
        const selectionModel = this.#selectionModel.replacementSpell;
        selectionModel.getOptions = this.getSpells;
        selectionModel.getOptionDetail = this.getSpellDetail;
        selectionModel.updateSelection = this.updateSpells;
        return selectionModel;
    }

    getSpells = (selectionModelName, sources) => {
        let options = [];
        const character = EditorViewModel.character;
        const classIndex = Number(this.#selectionModel.classIndex);
        if (this.#selectionModel.className) {
            if (this.#selectionModel.subClassName) {
                const subClass = Sources.getSubClasses(character.sources, this.#selectionModel.className)
                    .find(c => c.name == this.#selectionModel.subClassName);
                if (subClass?.getSelectionOptions) {
                    options = subClass.getSelectionOptions(character, classIndex, selectionModelName, sources);
                }
            }
            else {
                const cls = Sources.getClasses(character.sources).find(c => c.name == this.#selectionModel.className);
                if (cls?.getSelectionOptions) {
                    options = cls.getSelectionOptions(character, classIndex, selectionModelName, sources);
                }
            }
        }
        return options;
    }

    async getSpellDetail(selectionModelName, optionValue) {
        const character = EditorViewModel.character;
        return await Sources.getSpellHtml(character.sources, optionValue);
    }

    updateSpells = async (selectionModelName, selectedOptions) => {
        const character = Character.currentCharacter;
        const currentValues = character.selections.find(s => s.name == selectionModelName)?.values ?? [];
        if (Utilities.areArraysEqual(currentValues, selectedOptions, ["value"])) {
            return;
        }
        let sourcePropertyName = `class-${this.#selectionModel.classIndex}`;
        if (this.#selectionModel.subClassName) {
            sourcePropertyName = `subClass-${this.#selectionModel.classIndex}`;
        }
        const selection = {
            name: selectionModelName,
            sourcePropertyName: sourcePropertyName,
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

        const hasCantrips = this.#selectionModel.cantrips?.currentSelections;
        const hasSpells = this.#selectionModel.spells?.currentSelections;
        if (!hasCantrips && !hasSpells) {
            this.#kitElement.querySelector(".spell-replacement-only-container ").classList.remove("hidden");
        }

        let showReplacement = false;
        if (this.#selectionModel.replacementSpell?.currentSelections) {
            showReplacement = true;
        }
        const replacementExpansionContainer = this.#kitElement.querySelector(".spell-replacement-expansion-container");
        const replacementContainer = this.#kitElement.querySelector(".spell-replacement-container");
        if (showReplacement) {
            replacementExpansionContainer.classList.remove("hidden");
            const selectionModelName = `${this.#selectionModel.name}-replacement-expanded`;
            const character = EditorViewModel.character;
            const isExpanded = character.selections.find(s => s.name == selectionModelName && s.values && s.values.includes(true));
            const replaceExpand = this.#kitElement.querySelector(".toggle-button-replace-expand");
            const replaceCollapse = this.#kitElement.querySelector(".toggle-button-replace-collapse");
            if (isExpanded) {
                replaceExpand.classList.add("hidden");
                replaceCollapse.classList.remove("hidden");
                replacementContainer.classList.remove("hidden");
            }
            else {
                replaceExpand.classList.remove("hidden");
                replaceCollapse.classList.add("hidden");
                replacementContainer.classList.add("hidden");
            }
        }
        else {
            replacementExpansionContainer.classList.add("hidden");
            replacementContainer.classList.add("hidden");
        }


        this.#kitElement.querySelector(".selection-title").innerHTML = `${this.#selectionModel.title}:`;
        const isComplete = this.#updateCompletedDisplay();
        if (!isComplete) {
            this.#kitElement.querySelector(".toggle-button-expand").classList.add("hidden");
            this.#kitElement.querySelector(".toggle-button-collapse").classList.remove("hidden");
            this.#kitElement.querySelector(".selection-content").classList.remove("hidden");
        }
    }

    #getCompletedSelection() {
        const hasCantrips = this.#selectionModel.cantrips?.currentSelections;
        let cantripCount = 0;
        const hasSpells = this.#selectionModel.spells?.currentSelections;
        let spellCount = 0;
        const hasReplacementOption = this.#selectionModel.replacementSpell?.currentSelections;
        let hasReplacement = false;
        if (hasCantrips) {
            cantripCount = this.#selectionModel.cantrips?.currentSelections.filter(cs => cs.value).length;
        }
        if (hasSpells) {
            spellCount = this.#selectionModel.spells?.currentSelections.filter(cs => cs.value).length;
        }
        if (hasReplacementOption) {
            hasReplacement = this.#selectionModel.replacementSpell?.currentSelections.some(cs => cs.value);
        }
        const character = EditorViewModel.character;
        const selectionModelName = `${this.#selectionModel.name}-replacement-expanded`;
        const isExpanded = character.selections.find(s => s.name == selectionModelName && s.values && s.values.includes(true));
        let label = null;
        const showLabel = (
            (!hasCantrips || cantripCount > 0)
            && (!hasSpells || spellCount > 0)
            && (!hasReplacementOption || hasReplacement || !isExpanded));
        if (showLabel) {
            const labels = [];
            if (cantripCount > 0) {
                labels.push(`${cantripCount} cantrips selected`);
            }
            if (spellCount > 0) {
                labels.push(`${spellCount} spells selected`);
            }
            if (hasReplacement) {
                labels.push(`1 spell replaced`);
            }
            label = labels.join(", ");
            if (!label) {
                label = "(No selection)";
            }
        }
        return label;
    }

    #updateCompletedDisplay() {
        let isComplete = false;
        const completedSelection = this.#kitElement.querySelector(".completed-selection-display");
        const completedSelectionHtml = this.#getCompletedSelection();
        if (completedSelectionHtml) {
            completedSelection.classList.remove("incomplete");
            isComplete = true;
        }
        else {
            completedSelection.classList.add("incomplete");
        }
        let display = completedSelectionHtml ?? this.#selectionModel.defaultSummaryDisplay ?? "Choose spells ...";
        this.#kitElement.querySelector(".completed-selection-display").innerHTML = display;
        return isComplete;
    }

}
