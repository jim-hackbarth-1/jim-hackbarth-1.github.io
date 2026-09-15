
import { Character, Sources, Utilities } from "../../../domain/references.js";
import { EditorViewModel } from "../../editor-view/editor-view.js";

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
        const raceUpdated = (oldCharacter.race != currentCharacter.race);
        const subRaceUpdated = (oldCharacter.subRace != currentCharacter.subRace);
        DomainRaceModel.#character = currentCharacter;
        this.#raceOptions = null;
        this.#subRaces = null;
        this.#subRaceOptions = null;
        if (sourcesUpdated || raceUpdated) {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#race-row"));
        }
        if (!message.option || message.option?.sourcePropertyName == "race") {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#race-options-row"));
        }
        if (sourcesUpdated || raceUpdated || subRaceUpdated) {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#sub-race-row"));
        }
        if (!message.option || message.option?.sourcePropertyName == "subRace") {
            await UIKit.renderer.renderElement(this.#kitElement.querySelector("#sub-race-options-row"));
        }
    }

    getRaces() {
        const selectionModel = {
            name: "race",
            title: "Race:",
            maxSelections: 1
        };
        const character = DomainRaceModel.#character;
        let races = Sources.getRaces(character.sources);
        let options = races.map(r =>
        ({
            value: r.name,
            text: r.title,
            noteText: `(${r.source.title})`,
            hasDetail: true,
            isSelected: (character.race == r.name)
        }));
        if (options.length > 0) {
            options = Utilities.sort(options, "text");
            options.unshift({
                value: null,
                text: "Choose a race",
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
        selectionModel.options = options;
        return selectionModel;
    }

    async getRaceHtml(selectionModelName, optionValue) {
        return await Sources.getRaceHtml(DomainRaceModel.#character.sources, optionValue);
    }

    async updateRace(selectionModelName, optionValues) {
        let race = optionValues[0];
        if (race == "null") {
            race = null;
        }
        const character = Character.currentCharacter;
        if (character.race == race) {
            return;
        }
        Sources.updateCharacterRace(character, race);
        const message = { character: character };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    hasRaceOptions() {
        return (this.#getRaceOptions().length > 0);
    }

    getRaceOptions() {
        return this.#getRaceOptions();
    }

    async getRaceOptionHtml(selectionModelName, optionValue) {
        //TODO: get html (if any) from domain source
        console.log(selectionModelName);
        console.log(optionValue);
        return "TODO";
    }

    async updateRaceOption(selectionModelName, optionValues) {
        const character = Character.currentCharacter;
        const currentValues = character.options.find(o => o.name == selectionModelName)?.values ?? [];
        if (Utilities.areArraysEqual(currentValues, optionValues)) {
            return;
        }
        const option = {
            name: selectionModelName,
            sourcePropertyName: "race",
            sourcePropertyValue: character.race,
            values: optionValues
        }
        Sources.updateCharacterOption(character, option);
        const message = { character: character, option: option };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    hasSubRaces() {
        return (this.#getSubRaces().length > 0);
    }

    getSubRaces() {
        const selectionModel = {
            name: "sub-race",
            title: "Sub Race:",
            maxSelections: 1,
            options: []
        };
        const character = DomainRaceModel.#character;
        if (!character.race) {
            return selectionModel;
        }
        const subRaces = this.#getSubRaces();
        let options = subRaces.map(sr =>
        ({
            value: sr.name,
            text: sr.title,
            noteText: `(${sr.source.title})`,
            hasDetail: true,
            isSelected: (character.subRace == sr.name),
        }));
        if (subRaces.length > 0) {
            const race = Sources.getRaces(character.sources).find(r => r.name == character.race);
            let title = "Choose a sub race";
            if (!subRaces.some(sr => sr.source.name == race.source.name)) {
                // sub-races available, but none from race's source
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

    async getSubRaceHtml(selectionModelName, optionValue) {
        const character = DomainRaceModel.#character;
        return await Sources.getSubRaceHtml(character.sources, character.race, optionValue);
    }

    async updateSubRace(selectionModelName, optionValues) {
        const subRace = optionValues[0];
        if (subRace == "null") {
            subRace = null;
        }
        const character = Character.currentCharacter;
        if (character.subRace == subRace) {
            return;
        }
        Sources.updateCharacterSubRace(character, subRace);
        const message = { character: character };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    hasSubRaceOptions() {
        return (this.#getSubRaceOptions().length > 0);
    }

    getSubRaceOptions() {
        return this.#getSubRaceOptions();
    }

    async getSubRaceOptionHtml(selectionModelName, optionValue) {
        //TODO: get html (if any) from domain source
        console.log(selectionModelName);
        console.log(optionValue);
        return "TODO";
    }

    async updateSubRaceOption(selectionModelName, optionValues) {
        const character = Character.currentCharacter;
        const currentValues = character.options.find(o => o.name == selectionModelName)?.values ?? [];
        if (Utilities.areArraysEqual(currentValues, optionValues)) {
            return;
        }
        const option = {
            name: selectionModelName,
            sourcePropertyName: "subRace",
            sourcePropertyValue: character.subRace,
            values: optionValues
        }
        Sources.updateCharacterOption(character, option);
        const message = { character: character, option: option };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    #raceOptions;
    #getRaceOptions() {
        if (!this.#raceOptions) {
            const character = DomainRaceModel.#character;
            let displayOptions = [];
            if (character.race) {
                const race = Sources.getRaces(character.sources).find(r => r.name == character.race);
                if (race.getOptions) {
                    const raceOptions = race.getOptions(character);
                    displayOptions = this.#getDisplayOptions(raceOptions);
                }
            }
            this.#raceOptions = displayOptions;
        }
        return this.#raceOptions;
    }

    #subRaces;
    #getSubRaces() {
        if (!this.#subRaces) {
            const character = DomainRaceModel.#character;
            if (!character.race) {
                return [];
            }
            this.#subRaces = Sources.getSubRaces(character.sources, character.race);
        }
        return this.#subRaces;
    }

    #subRaceOptions;
    #getSubRaceOptions() {
        if (!this.#subRaceOptions) {
            const character = DomainRaceModel.#character;
            let displayOptions = [];
            if (character.race && character.subRace) {
                const subRace = Sources
                    .getSubRaces(character.sources, character.race)
                    .find(sr => sr.name == character.subRace);
                if(subRace.getOptions) {
                    const subRaceOptions = subRace.getOptions(character);
                    displayOptions = this.#getDisplayOptions(subRaceOptions);
                }
            }
            this.#subRaceOptions = displayOptions;
        }
        return this.#subRaceOptions;
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
