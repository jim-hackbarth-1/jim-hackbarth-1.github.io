
import { Character, Sources, Utilities } from "../../../domain/references.js";
import { EditorViewModel } from "../../editor-view/editor-view.js";
import { SelectionModel } from "../../shared/selection/selection.js";

export function createModel() {
    return new DomainAlignmentAndBackgroundModel();
}

class DomainAlignmentAndBackgroundModel {

    #kitElement;
    static #character;

    async init(kitElement) {
        this.#kitElement = kitElement;
        DomainAlignmentAndBackgroundModel.#character = Character.currentCharacter;
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
        const oldCharacter = DomainAlignmentAndBackgroundModel.#character;
        const currentCharacter = Character.currentCharacter;
        const sourcesUpdated = !Utilities.areArraysEqual(oldCharacter.sources, currentCharacter.sources);
        const alignmentUpdated = oldCharacter.alignment?.value != currentCharacter.alignment?.value;
        const backgroundUpdated = oldCharacter.background?.value != currentCharacter.background?.value;
        const traitsUpdated = !Utilities.areArraysEqual(oldCharacter.traits, currentCharacter.traits, ["value"]);
        const idealUpdated = oldCharacter.ideal?.value != currentCharacter.ideal?.value;
        const bondUpdated = oldCharacter.bond?.value != currentCharacter.bond?.value;
        const flawUpdated = oldCharacter.flaw?.value != currentCharacter.flaw?.value;
        DomainAlignmentAndBackgroundModel.#character = currentCharacter;
        this.#traits = null;
        this.#ideals = null;
        this.#bonds = null;
        this.#flaws = null;
        this.#backgroundSelections = null;
        if (sourcesUpdated || alignmentUpdated) {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#alignment-row"));
        }
        if (sourcesUpdated || backgroundUpdated) {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#background-row"));
        }
        if (backgroundUpdated || traitsUpdated) {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#traits-row"));
        }
        if (backgroundUpdated || idealUpdated) {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#ideal-row"));
        }
        if (backgroundUpdated || bondUpdated) {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#bond-row"));
        }
        if (backgroundUpdated || flawUpdated) {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#flaw-row"));
        }
        if (message.selection?.sourcePropertyName != "background") {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#background-selections-row"));
        }
    }

    // ~~~ Alignment ~~~
    getAlignmentSelectionModel() {
        const character = DomainAlignmentAndBackgroundModel.#character;
        const currentSelection = character.alignment ?? { value: null, text: "Choose an alignment ..." };
        return {
            name: "alignment",
            title: "Alignment",
            maxSelections: 1,
            currentSelections: [currentSelection],
            getOptions: this.getAlignments,
            getOptionDetail: this.getAlignmentHtml,
            updateSelection: this.updateAlignment
        };
    }

    getAlignments() {
        const character = DomainAlignmentAndBackgroundModel.#character;
        const alignments = Sources.getAlignments();
        let options = alignments.map(a =>
        ({
            value: a.name,
            text: a.title,
            hasDetail: true,
            isSelected: (character.alignment == a.name)
        }));
        options = Utilities.sort(options, "text");
        options.unshift({
            value: null,
            text: "Choose an alignment ...",
            hasDetail: false,
            isSelected: false
        });
        return options;
    }

    getAlignmentHtml(selectionModelName, optionValue) {
        const alignment = Sources.getAlignments().find(a => a.name == optionValue);
        return alignment?.html ?? "[No content]";
    }

    async updateAlignment(selectionModelName, options) {
        const alignment = options[0];
        const character = Character.currentCharacter;
        if (character.alignment?.value == alignment.value) {
            return;
        }
        Sources.updateCharacterAlignment(character, alignment);
        await DomainAlignmentAndBackgroundModel.#updateCurrentCharacter(character);
    }

    // ~~~ Background ~~~
    hasBackground() {
         const character = DomainAlignmentAndBackgroundModel.#character;
         if (character.background?.value) {
             return true;
         }
         return false;
    }

    getBackgroundSelectionModel() {
        const character = DomainAlignmentAndBackgroundModel.#character;
        const currentSelection = character.background ?? { value: null, text: "Choose a background ..." };
        return {
            name: "background",
            title: "Background",
            maxSelections: 1,
            currentSelections: [currentSelection],
            getOptions: this.getBackgrounds,
            getOptionDetail: this.getBackgroundHtml,
            updateSelection: this.updateBackground
        };
    }

    getBackgrounds() {
        const character = DomainAlignmentAndBackgroundModel.#character;
        const backgrounds = Sources.getBackgrounds(character.sources);
        let options = backgrounds.map(b =>
        ({
            value: b.name,
            text: b.title,
            noteText: `(${b.source.title})`,
            hasDetail: true,
            isSelected: (character.background?.value == b.name)
        }));
        if (options.length > 0) {
            options = Utilities.sort(options, "text");
            options.unshift({
                value: null,
                text: "Choose a background ...",
                hasDetail: false,
                isSelected: false
            });
        }
        else {
            options.push({
                value: null,
                text: "No backgrounds in selected sources",
                hasDetail: false,
                isSelected: false
            });
        }
        return options;
    }

    async getBackgroundHtml(selectionModelName, optionValue) {
        return await Sources.getBackgroundHtml(DomainAlignmentAndBackgroundModel.#character.sources, optionValue);
    }

    async updateBackground(selectionModelName, options) {
        const background = options[0];
        const character = Character.currentCharacter;
        if (character.background?.value == background.value) {
            return;
        }
        Sources.updateCharacterBackground(character, background);
        await DomainAlignmentAndBackgroundModel.#updateCurrentCharacter(character);
    }

    // ~~~ Traits ~~~
    getTraitsSelectionModel() {
        const character = DomainAlignmentAndBackgroundModel.#character;
        let currentSelections = [{ value: null, text: "Choose 2 traits ..." }];
        if (character.traits && character.traits.some(t => t.value)) {
            currentSelections = character.traits
        }
        return {
            name: "traits",
            title: "Traits",
            maxSelections: 2,
            currentSelections: currentSelections,
            getOptions: this.getTraits,
            updateSelection: this.updateTraits
        };
    }

    getTraits = () => {
        const character = DomainAlignmentAndBackgroundModel.#character;
        const traits = this.#getTraits();
        let selectedTraits = [];
        if (character.traits) {
            selectedTraits = character.traits.map(t => t.value);
        }
        let options = traits.map(t =>
        ({
            value: t.name,
            text: t.title,
            hasDetail: true,
            isSelected: selectedTraits.includes(t.name)
        }));
        if (options.length > 0) {
            options = Utilities.sort(options, "text");
            options.unshift({
                value: null,
                text: "Choose 2 traits ...",
                hasDetail: false,
                isSelected: false,
                hideCheckbox: true 
            });
        }
        else {
            options.push({
                value: null,
                text: "No traits for selected background",
                hasDetail: false,
                isSelected: false,
                hideCheckbox: true 
            });
        }
        return options;
    }

    async updateTraits(selectionModelName, options) {
        const character = Character.currentCharacter;
        if (Utilities.areArraysEqual(character.traits, options, ["value"])) {
            return;
        }
        Sources.updateCharacterTraits(character, options);
        await DomainAlignmentAndBackgroundModel.#updateCurrentCharacter(character);
    }

    // ~~~ Ideal ~~~
    getIdealSelectionModel() {
        const character = DomainAlignmentAndBackgroundModel.#character;
        let currentSelection = { value: null, text: "Choose an ideal ..." };
        if (character.ideal?.value) {
            currentSelection = character.ideal
        }
        return {
            name: "ideal",
            title: "Ideal",
            maxSelections: 1,
            currentSelections: [currentSelection],
            getOptions: this.getIdeals,
            updateSelection: this.updateIdeal
        };
    }

    getIdeals = () => {
        const character = DomainAlignmentAndBackgroundModel.#character;
        const ideals = this.#getIdeals();
        let options = ideals.map(i =>
        ({
            value: i.name,
            text: i.title,
            hasDetail: false,
            isSelected: (i.name == character.ideal?.value)
        }));
        if (options.length > 0) {
            options = Utilities.sort(options, "text");
            options.unshift({
                value: null,
                text: "Choose an ideal ...",
                hasDetail: false,
                isSelected: false
            });
        }
        else {
            options.push({
                value: null,
                text: "No ideals for selected background",
                hasDetail: false,
                isSelected: false,
                hideCheckbox: true
            });
        }
        return options;
    }

    async updateIdeal(selectionModelName, options) {
        const ideal = options[0];
        const character = Character.currentCharacter;
        if (character.ideal?.value == ideal.value) {
            return;
        }
        Sources.updateCharacterIdeal(character, ideal);
        await DomainAlignmentAndBackgroundModel.#updateCurrentCharacter(character);
    }

    // ~~~ Bond ~~~
    getBondSelectionModel() {
        const character = DomainAlignmentAndBackgroundModel.#character;
        let currentSelection = { value: null, text: "Choose a bond ..." };
        if (character.bond?.value) {
            currentSelection = character.bond
        }
        return {
            name: "bond",
            title: "Bond",
            maxSelections: 1,
            currentSelections: [currentSelection],
            getOptions: this.getBonds,
            updateSelection: this.updateBond
        };
    }

    getBonds = () => {
        const character = DomainAlignmentAndBackgroundModel.#character;
        const bonds = this.#getBonds();
        let options = bonds.map(b =>
        ({
            value: b.name,
            text: b.title,
            hasDetail: false,
            isSelected: (b.name == character.bond?.value)
        }));
        if (options.length > 0) {
            options = Utilities.sort(options, "text");
            options.unshift({
                value: null,
                text: "Choose a bond ...",
                hasDetail: false,
                isSelected: false
            });
        }
        else {
            options.push({
                value: null,
                text: "No bonds for selected background",
                hasDetail: false,
                isSelected: false,
                hideCheckbox: true
            });
        }
        return options;
    }

    async updateBond(selectionModelName, options) {
        const bond = options[0];
        const character = Character.currentCharacter;
        if (character.bond?.value == bond.value) {
            return;
        }
        Sources.updateCharacterBond(character, bond);
        await DomainAlignmentAndBackgroundModel.#updateCurrentCharacter(character);
    }

    // ~~~ Flaw ~~~
    getFlawSelectionModel() {
        const character = DomainAlignmentAndBackgroundModel.#character;
        let currentSelection = { value: null, text: "Choose a flaw ..." };
        if (character.flaw?.value) {
            currentSelection = character.flaw
        }
        return {
            name: "flaw",
            title: "Flaw",
            maxSelections: 1,
            currentSelections: [currentSelection],
            getOptions: this.getFlaws,
            updateSelection: this.updateFlaw
        };
    }

    getFlaws = () => {
        const character = DomainAlignmentAndBackgroundModel.#character;
        const flaws = this.#getFlaws();
        let options = flaws.map(f =>
        ({
            value: f.name,
            text: f.title,
            hasDetail: false,
            isSelected: (f.name == character.flaw?.value)
        }));
        if (options.length > 0) {
            options = Utilities.sort(options, "text");
            options.unshift({
                value: null,
                text: "Choose a flaw ...",
                hasDetail: false,
                isSelected: false
            });
        }
        else {
            options.push({
                value: null,
                text: "No flaws for selected background",
                hasDetail: false,
                isSelected: false,
                hideCheckbox: true
            });
        }
        return options;
    }

    async updateFlaw(selectionModelName, options) {
        const flaw = options[0];
        const character = Character.currentCharacter;
        if (character.flaw?.value == flaw.value) {
            return;
        }
        Sources.updateCharacterFlaw(character, flaw);
        await DomainAlignmentAndBackgroundModel.#updateCurrentCharacter(character);
    }

    // ~~~ background selections ~~~
    hasBackgroundSelections() {
        return (this.#getBackgroundSelections().length > 0);
    }

    getBackgroundSelections() {
        return this.#getBackgroundSelections();
    }

    getBackgroundSelectionOptions(selectionModelName) {
        const character = DomainAlignmentAndBackgroundModel.#character;
        let options = [];
        if (character.background?.value) {
            const background = Sources.getBackgrounds(character.sources).find(b => b.name == character.background?.value);
            if (background?.getSelectionOptions) {
                options = background.getSelectionOptions(character, selectionModelName);
            }
        }
        return options;
    }

    async updateBackgroundSelection(selectionModelName, selectedOptions) {
        const character = Character.currentCharacter;
        const currentValues = character.selections.find(s => s.name == selectionModelName)?.values ?? [];
        if (Utilities.areArraysEqual(currentValues, selectedOptions, ["value"])) {
            return;
        }
        const selection = {
            name: selectionModelName,
            sourcePropertyName: "background",
            sourcePropertyValue: character.background.value,
            values: selectedOptions
        };
        Sources.updateCharacterSelection(character, selection);
        const message = {
            character: character,
            selection: selection,
            section: "details-alignment-and-background"
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    #traits;
    #getTraits() {
        if (!this.#traits) {
            const background = DomainAlignmentAndBackgroundModel.#getBackground();
            if (!background?.getTraits) {
                return [];
            }
            this.#traits = background.getTraits();
        }
        return this.#traits;
    }

    #ideals;
    #getIdeals() {
        if (!this.#ideals) {
            const background = DomainAlignmentAndBackgroundModel.#getBackground();
            if (!background?.getIdeals) {
                return [];
            }
            this.#ideals = background.getIdeals();
        }
        return this.#ideals;
    }

    #bonds;
    #getBonds() {
        if (!this.#bonds) {
            const background = DomainAlignmentAndBackgroundModel.#getBackground();
            if (!background?.getBonds) {
                return [];
            }
            this.#bonds = background.getBonds();
        }
        return this.#bonds;
    }

    #flaws;
    #getFlaws() {
        if (!this.#flaws) {
            const background = DomainAlignmentAndBackgroundModel.#getBackground();
            if (!background?.getFlaws) {
                return [];
            }
            this.#flaws = background.getFlaws();
        }
        return this.#flaws;
    }

    #backgroundSelections;
    #getBackgroundSelections() {
        if (!this.#backgroundSelections) {
            const character = DomainAlignmentAndBackgroundModel.#character;
            let backgroundSelections = [];
            if (character.background?.value) {
                const background = DomainAlignmentAndBackgroundModel.#getBackground();
                if (background?.getSelections) {
                    backgroundSelections = background.getSelections(character);
                    for (const backgroundSelection of backgroundSelections) {
                        backgroundSelection.getOptions = this.getBackgroundSelectionOptions;
                        backgroundSelection.updateSelection = this.updateBackgroundSelection;
                    }
                }
            }
            this.#backgroundSelections = backgroundSelections;
        }
        return this.#backgroundSelections;
    }

    static #getBackground() {
        const character = DomainAlignmentAndBackgroundModel.#character;
        return Sources.getBackgrounds(character.sources).find(b => b.name == character.background?.value);
    }

    static async #updateCurrentCharacter(character) {
        Character.currentCharacter = character;
        const message = {
            character: character,
            section: "details-alignment-and-background"
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateTopic, message);
    }

}
