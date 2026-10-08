
import { Character, Sources, Utilities } from "../../../domain/references.js";
import { EditorViewModel } from "../../editor-view/editor-view.js";
import { SelectionModel } from "../../shared/selection/selection.js";

export function createModel() {
    return new DomainRaceModel();
}

class DomainRaceModel {

    #kitElement;
    static #character;

    async init(kitElement) {
        this.#kitElement = kitElement;
        DomainRaceModel.#character = Character.currentCharacter;
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
        const oldCharacter = DomainRaceModel.#character;
        const currentCharacter = Character.currentCharacter;
        const sourcesUpdated = !Utilities.areArraysEqual(oldCharacter.sources, currentCharacter.sources);
        const raceUpdated = (oldCharacter.race?.value != currentCharacter.race?.value);
        const subRaceUpdated = (oldCharacter.subRace?.value != currentCharacter.subRace?.value);
        DomainRaceModel.#character = currentCharacter;
        this.#raceSelections = null;
        this.#subRaces = null;
        this.#subRaceSelections = null;
        if (sourcesUpdated || raceUpdated) {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#race-row"));
        }
        if (message.selection?.sourcePropertyName != "race") {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#race-selections-row"));
        }
        if (sourcesUpdated || raceUpdated || subRaceUpdated) {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#sub-race-row"));
        }
        if (message.selection?.sourcePropertyName != "subRace") {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#sub-race-selections-row"));
        }
    }

    // ~~~ races
    getRaceSelectionModel() {
        const character = DomainRaceModel.#character;
        const currentSelection = character.race ?? { value: null, text: "Choose a race ..." };
        return {
            name: "race",
            title: "Race",
            maxSelections: 1,
            currentSelections: [currentSelection],
            getOptions: this.getRaces,
            getOptionDetail: this.getRaceHtml,
            updateSelection: this.updateRace
        };
    }

    getRaces() {
        const character = DomainRaceModel.#character;
        const races = Sources.getRaces(character.sources);
        let options = races.map(r =>
        ({
            value: r.name,
            text: r.title,
            noteText: `(${r.source.title})`,
            hasDetail: true,
            isSelected: (character.race?.value == r.name)
        }));
        if (options.length > 0) {
            options = Utilities.sort(options, "text");
            options.unshift({
                value: null,
                text: "Choose a race ...",
                hasDetail: false,
                isSelected: false
            });
        }
        else {
            options.push({
                value: null,
                text: "No races in selected sources",
                hasDetail: false,
                isSelected: false
            });
        }
        return options;
    }

    async getRaceHtml(selectionModelName, optionValue) {
        return await Sources.getRaceHtml(DomainRaceModel.#character.sources, optionValue);
    }

    async updateRace(selectionModelName, options) {
        const race = options[0];
        const character = Character.currentCharacter;
        if (character.race?.value == race.value) {
            return;
        }
        Sources.updateCharacterRace(character, race);
        const message = {
            character: character,
            section: "details-race"
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    // ~~~ race selections
    hasRaceSelections() {
        return (this.#getRaceSelections().length > 0);
    }

    getRaceSelections() {
        return this.#getRaceSelections();
    }

    getRaceSelectionOptions(selectionModelName) {
        const character = DomainRaceModel.#character;
        let options = [];
        if (character.race?.value) {
            const race = Sources.getRaces(character.sources).find(r => r.name == character.race?.value);
            if (race?.getSelectionOptions) {
                options = race.getSelectionOptions(character, selectionModelName);
            }
        }
        return options;
    }

    async updateRaceSelection(selectionModelName, selectedOptions) {
        const character = Character.currentCharacter;
        const currentValues = character.selections.find(s => s.name == selectionModelName)?.values ?? [];
        if (Utilities.areArraysEqual(currentValues, selectedOptions, ["value"])) {
            return;
        }
        const selection = {
            name: selectionModelName,
            sourcePropertyName: "race",
            sourcePropertyValue: character.race.value,
            values: selectedOptions
        };
        Sources.updateCharacterSelection(character, selection);
        const message = {
            character: character,
            selection: selection,
            section: "details-race"
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    // ~~~ sub races
    hasSubRaces() {
        return (this.#getSubRaces().length > 0);
    }

    getSubRaceSelectionModel() {
        const character = DomainRaceModel.#character;
        const text = this.#subRaceOptional ? "Choose a sub race (optional) ..." : "Choose a sub race ...";
        const currentSelection = character.subRace ?? { value: null, text: text };
        return {
            name: "subRace",
            title: "Sub race",
            maxSelections: 1,
            currentSelections: [currentSelection],
            getOptions: this.getSubRaces,
            getOptionDetail: this.getSubRaceHtml,
            updateSelection: this.updateSubRace
        };
    }

    getSubRaces = () => {
        const character = DomainRaceModel.#character;
        const subRaces = Sources.getSubRaces(character.sources, character.race?.value);
        let options = subRaces.map(sr =>
        ({
            value: sr.name,
            text: sr.title,
            noteText: `(${sr.source.title})`,
            hasDetail: true,
            isSelected: (character.subRace?.value == sr.name)
        }));
        const text = this.#subRaceOptional ? "Choose a sub race (optional) ..." : "Choose a sub race ...";
        if (options.length > 0) {
            options = Utilities.sort(options, "text");
            options.unshift({
                value: null,
                text: text,
                hasDetail: false,
                isSelected: false
            });
        }
        else {
            options.push({
                value: null,
                text: "No sub races in selected sources",
                hasDetail: false,
                isSelected: false
            });
        }
        return options;
    }

    async getSubRaceHtml(selectionModelName, optionValue) {
        const character = DomainRaceModel.#character;
        return await Sources.getSubRaceHtml(character.sources, character.race.value, optionValue);
    }

    async updateSubRace(selectionModelName, options) {
        const subRace = options[0];
        const character = Character.currentCharacter;
        if (character.subRace?.value == subRace?.value) {
            return;
        }
        Sources.updateCharacterSubRace(character, subRace);
        const message = {
            character: character,
            section: "details-race"
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    // ~~~ sub race options
    hasSubRaceSelections() {
        return (this.#getSubRaceSelections().length > 0);
    }

    getSubRaceSelections() {
        return this.#getSubRaceSelections();
    }

    getSubRaceSelectionOptions(selectionModelName) {
        const character = DomainRaceModel.#character;
        let options = [];
        if (character.race?.value && character.subRace?.value) {
            const subRace = Sources
                .getSubRaces(character.sources, character.race.value)
                .find(sr => sr.name == character.subRace?.value);
            if (subRace?.getSelectionOptions) {
                options = subRace.getSelectionOptions(character, selectionModelName);
            }
        }
        return options;
    }

    async updateSubRaceSelection(selectionModelName, selectedOptions) {
        const character = Character.currentCharacter;
        const currentValues = character.selections.find(s => s.name == selectionModelName)?.values ?? [];
        if (Utilities.areArraysEqual(currentValues, selectedOptions, ["value"])) {
            return;
        }
        const selection = {
            name: selectionModelName,
            sourcePropertyName: "subRace",
            sourcePropertyValue: character.subRace.value,
            values: selectedOptions
        };
        Sources.updateCharacterSelection(character, selection);
        const message = {
            character: character,
            selection: selection,
            section: "details-race"
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    #raceSelections;
    #getRaceSelections() {
        if (!this.#raceSelections) {
            const character = DomainRaceModel.#character;
            let raceSelections = [];
            if (character.race?.value) {
                const race = Sources.getRaces(character.sources).find(r => r.name == character.race?.value);
                if (race?.getSelections) {
                    raceSelections = race.getSelections(character);
                    for (const raceSelection of raceSelections) {
                        raceSelection.getOptions = this.getRaceSelectionOptions;
                        raceSelection.updateSelection = this.updateRaceSelection;
                    }
                }
            }
            this.#raceSelections = raceSelections;
        }
        return this.#raceSelections;
    }

    #subRaceOptional;
    #subRaces;
    #getSubRaces() {
        if (!this.#subRaces) {
            const character = DomainRaceModel.#character;
            if (!character.race?.value) {
                return [];
            }
            this.#subRaces = Sources.getSubRaces(character.sources, character.race?.value);
            const raceSource = Sources.getRaces(character.sources).find(r => r.name == character.race.value).source;
            // sub-races available, but none from race's source
            this.#subRaceOptional = !this.#subRaces.some(sr => sr.source.name == raceSource.name);
        }
        return this.#subRaces;
    }

    #subRaceSelections;
    #getSubRaceSelections() {
        if (!this.#subRaceSelections) {
            const character = DomainRaceModel.#character;
            let subRaceSelections = [];
            if (character.race?.value && character.subRace?.value) {
                const subRace = Sources
                    .getSubRaces(character.sources, character.race?.value)
                    .find(sr => sr.name == character.subRace?.value);
                if (subRace?.getSelections) {
                    subRaceSelections = subRace.getSelections(character);
                    for (const subRaceSelection of subRaceSelections) {
                        subRaceSelection.getOptions = this.getSubRaceSelectionOptions;
                        subRaceSelection.updateSelection = this.updateSubRaceSelection;
                    }
                }
            }
            this.#subRaceSelections = subRaceSelections;
        }
        return this.#subRaceSelections;
    }

}
