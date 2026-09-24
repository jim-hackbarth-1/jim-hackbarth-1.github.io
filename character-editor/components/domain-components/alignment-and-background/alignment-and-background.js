
import { Character, Sources, Utilities } from "../../../domain/references.js";
import { EditorViewModel } from "../../editor-view/editor-view.js";

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
        const alignmentUpdated = oldCharacter.alignment != currentCharacter.alignment;
        const backgroundUpdated = oldCharacter.background != currentCharacter.background;
        const traitsUpdated = !Utilities.areArraysEqual(oldCharacter.traits, currentCharacter.traits);
        const idealUpdated = oldCharacter.ideal != currentCharacter.ideal;
        const bondUpdated = oldCharacter.bond != currentCharacter.bond;
        const flawUpdated = oldCharacter.flaw != currentCharacter.flaw;
        DomainAlignmentAndBackgroundModel.#character = currentCharacter;
        this.#traits = null;
        this.#ideals = null;
        this.#bonds = null;
        this.#flaws = null;
        this.#backgroundOptions = null;
        if (sourcesUpdated || alignmentUpdated) {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#alignment-row"));
        }
        if (sourcesUpdated || backgroundUpdated) {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#background-row"));
        }
        if (sourcesUpdated || backgroundUpdated || traitsUpdated) {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#traits-row"));
        }
        if (sourcesUpdated || backgroundUpdated || idealUpdated) {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#ideal-row"));
        }
        if (sourcesUpdated || backgroundUpdated || bondUpdated) {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#bond-row"));
        }
        if (sourcesUpdated || backgroundUpdated || flawUpdated) {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#flaw-row"));
        }
        await UIKit.renderer.renderElement(this.#kitElement.querySelector("#background-options-row"));
    }

    getAlignments() {
        const selectionModel = {
            name: "alignment",
            title: "Alignment:",
            maxSelections: 1
        };
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
            text: "Choose an alignment",
            hasDetail: false,
            isSelected: false
        });
        selectionModel.options = options;
        return selectionModel;
    }

    getAlignmentHtml(selectionModelName, optionValue) {
        const alignment = Sources.getAlignments().find(a => a.name == optionValue);
        return alignment?.html ?? "[No content]";
    }

    async updateAlignment(selectionModelName, optionValues) {
        let alignment = optionValues[0];
        if (alignment == "null") {
            alignment = null;
        }
        const character = Character.currentCharacter;
        if (character.alignment == alignment) {
            return;
        }
        Sources.updateCharacterAlignment(character, alignment);
        const message = { character: character };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    getBackgrounds() {
        const selectionModel = {
            name: "background",
            title: "Background:",
            maxSelections: 1
        };
        const character = DomainAlignmentAndBackgroundModel.#character;
        const backgrounds = Sources.getBackgrounds(character.sources);
        let options = backgrounds.map(b =>
        ({
            value: b.name,
            text: b.title,
            noteText: `(${b.source.title})`,
            hasDetail: true,
            isSelected: (character.background == b.name)
        }));
        if (options.length > 0) {
            options = Utilities.sort(options, "text");
            options.unshift({
                value: null,
                text: "Choose a background",
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
        selectionModel.options = options;
        return selectionModel;
    }

    async getBackgroundHtml(selectionModelName, optionValue) {
        return await Sources.getBackgroundHtml(DomainAlignmentAndBackgroundModel.#character.sources, optionValue);
    }

    async updateBackground(selectionModelName, optionValues) {
        let background = optionValues[0];
        if (background == "null") {
            background = null;
        }
        const character = Character.currentCharacter;
        if (character.background == background) {
            return;
        }
        Sources.updateCharacterBackground(character, background);
        const message = { character: character };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    hasBackground() {
        const character = DomainAlignmentAndBackgroundModel.#character;
        if (character.background) {
            return true;
        }
        return false;
    }

    getTraits() {
        const selectionModel = {
            name: "traits",
            title: "Traits:",
            maxSelections: 2,
            options: []
        };
        const character = DomainAlignmentAndBackgroundModel.#character;
        if (!character.background) {
            return selectionModel;
        }
        const traits = this.#getTraits();
        let options = traits.map(t =>
        ({
            value: t.name,
            text: t.title,
            hasDetail: true,
            isSelected: (character.traits.includes(t.name)),
        }));
        if (options.length > 0) {
            options = Utilities.sort(options, "text");
            options.unshift({
                value: null,
                text: "Traits (choose 2)",
                hasDetail: false,
                isSelected: false
            });
        }
        else {
            options.push({
                value: null,
                text: "No traits available for selected background",
                hasDetail: false,
                isSelected: false
            });
        }
        selectionModel.options = options;
        return selectionModel;
    }

    getTraitHtml(selectionModelName, optionValue) {
        let html = null;
        const character = DomainAlignmentAndBackgroundModel.#character;
        const background = Sources.getBackgrounds(character.sources).find(b => b.name == character.background);
        if (background?.getTraits) {
            html = background.getTraits().find(t => t.name == optionValue)?.html;
        }
        return html ?? "[no html content available]";
    }

    async updateTraits(selectionModelName, optionValues) {
        const character = Character.currentCharacter;
        if (Utilities.areArraysEqual(character.traits, optionValues)) {
            return;
        }
        Sources.updateCharacterTraits(character, optionValues);
        const message = { character: character };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    getIdeals() {
        const selectionModel = {
            name: "ideal",
            title: "Ideal:",
            maxSelections: 1,
            options: []
        };
        const character = DomainAlignmentAndBackgroundModel.#character;
        if (!character.background) {
            return selectionModel;
        }
        const ideals = this.#getIdeals();
        let options = ideals.map(i =>
        ({
            value: i.name,
            text: i.title,
            hasDetail: true,
            isSelected: (character.ideal == i.name),
        }));
        if (options.length > 0) {
            options = Utilities.sort(options, "text");
            options.unshift({
                value: null,
                text: "Choose an ideal",
                hasDetail: false,
                isSelected: false
            });
        }
        else {
            options.push({
                value: null,
                text: "No ideals available for selected background",
                hasDetail: false,
                isSelected: false
            });
        }
        selectionModel.options = options;
        return selectionModel;
    }

    getIdealHtml(selectionModelName, optionValue) {
        let html = null;
        const character = DomainAlignmentAndBackgroundModel.#character;
        const background = Sources.getBackgrounds(character.sources).find(b => b.name == character.background);
        if (background?.getIdeals) {
            html = background.getIdeals().find(i => i.name == optionValue)?.html;
        }
        return html ?? "[no html content available]";
    }

    async updateIdeal(selectionModelName, optionValues) {
        let ideal = optionValues[0];
        if (ideal == "null") {
            ideal = null;
        }
        const character = Character.currentCharacter;
        if (character.ideal == ideal) {
            return;
        }
        Sources.updateCharacterIdeal(character, ideal);
        const message = { character: character };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    getBonds() {
        const selectionModel = {
            name: "bond",
            title: "Bond:",
            maxSelections: 1,
            options: []
        };
        const character = DomainAlignmentAndBackgroundModel.#character;
        if (!character.background) {
            return selectionModel;
        }
        const bonds = this.#getBonds();
        let options = bonds.map(b =>
        ({
            value: b.name,
            text: b.title,
            hasDetail: true,
            isSelected: (character.bond == b.name),
        }));
        if (options.length > 0) {
            options = Utilities.sort(options, "text");
            options.unshift({
                value: null,
                text: "Choose a bond",
                hasDetail: false,
                isSelected: false
            });
        }
        else {
            options.push({
                value: null,
                text: "No bonds available for selected background",
                hasDetail: false,
                isSelected: false
            });
        }
        selectionModel.options = options;
        return selectionModel;
    }

    getBondHtml(selectionModelName, optionValue) {
        let html = null;
        const character = DomainAlignmentAndBackgroundModel.#character;
        const background = Sources.getBackgrounds(character.sources).find(b => b.name == character.background);
        if (background?.getBonds) {
            html = background.getBonds().find(b => b.name == optionValue)?.html;
        }
        return html ?? "[no html content available]";
    }

    async updateBond(selectionModelName, optionValues) {
        let bond = optionValues[0];
        if (bond == "null") {
            bond = null;
        }
        const character = Character.currentCharacter;
        if (character.bond == bond) {
            return;
        }
        Sources.updateCharacterBond(character, bond);
        const message = { character: character };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    getFlaws() {
        const selectionModel = {
            name: "flaw",
            title: "Flaw:",
            maxSelections: 1,
            options: []
        };
        const character = DomainAlignmentAndBackgroundModel.#character;
        if (!character.background) {
            return selectionModel;
        }
        const flaws = this.#getFlaws();
        let options = flaws.map(f =>
        ({
            value: f.name,
            text: f.title,
            hasDetail: true,
            isSelected: (character.flaw == f.name),
        }));
        if (options.length > 0) {
            options = Utilities.sort(options, "text");
            options.unshift({
                value: null,
                text: "Choose a flaw",
                hasDetail: false,
                isSelected: false
            });
        }
        else {
            options.push({
                value: null,
                text: "No flaws available for selected background",
                hasDetail: false,
                isSelected: false
            });
        }
        selectionModel.options = options;
        return selectionModel;
    }

    getFlawHtml(selectionModelName, optionValue) {
        let html = null;
        const character = DomainAlignmentAndBackgroundModel.#character;
        const background = Sources.getBackgrounds(character.sources).find(b => b.name == character.background);
        if (background?.getFlaws) {
            html = background.getFlaws().find(f => f.name == optionValue)?.html;
        }
        return html ?? "[no html content available]";
    }

    async updateFlaw(selectionModelName, optionValues) {
        let flaw = optionValues[0];
        if (flaw == "null") {
            flaw = null;
        }
        const character = Character.currentCharacter;
        if (character.flaw == flaw) {
            return;
        }
        Sources.updateCharacterFlaw(character, flaw);
        const message = { character: character };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    hasBackgroundOptions() {
        return (this.#getBackgroundOptions().length > 0);
    }

    getBackgroundOptions() {
        return this.#getBackgroundOptions();
    }

    async getBackgroundOptionHtml(selectionModelName, optionValue) {
        //TODO: get html (if any) from domain source
        console.log(selectionModelName);
        console.log(optionValue);
        return "TODO";
    }

    async updateBackgroundOption(selectionModelName, optionValues) {
        const character = Character.currentCharacter;
        const currentValues = character.options.find(o => o.name == selectionModelName)?.values ?? [];
        if (Utilities.areArraysEqual(currentValues, optionValues)) {
            return;
        }
        const option = {
            name: selectionModelName,
            sourcePropertyName: "background",
            sourcePropertyValue: character.background,
            values: optionValues
        }
        Sources.updateCharacterOption(character, option);
        const message = { character: character, option: option };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    #traits;
    #getTraits() {
        if (!this.#traits) {
            const character = DomainAlignmentAndBackgroundModel.#character;
            const background = Sources.getBackgrounds(character.sources).find(b => b.name == character.background);
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
            const character = DomainAlignmentAndBackgroundModel.#character;
            const background = Sources.getBackgrounds(character.sources).find(b => b.name == character.background);
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
            const character = DomainAlignmentAndBackgroundModel.#character;
            const background = Sources.getBackgrounds(character.sources).find(b => b.name == character.background);
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
            const character = DomainAlignmentAndBackgroundModel.#character;
            const background = Sources.getBackgrounds(character.sources).find(b => b.name == character.background);
            if (!background?.getFlaws) {
                return [];
            }
            this.#flaws = background.getFlaws();
        }
        return this.#flaws;
    }

    #backgroundOptions;
    #getBackgroundOptions() {
        if (!this.#backgroundOptions) {
            const character = DomainAlignmentAndBackgroundModel.#character;
            let displayOptions = [];
            if (character.background) {
                const background = Sources.getBackgrounds(character.sources).find(b => b.name == character.background);
                if (background.getOptions) {
                    const backgroundOptions = background.getOptions(character);
                    displayOptions = this.#getDisplayOptions(backgroundOptions);
                }
            }
            this.#backgroundOptions = displayOptions;
        }
        return this.#backgroundOptions;
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
