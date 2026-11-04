
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Crowbar {

    static get name() { return "crowbar"; }
    static get title() { return "Crowbar"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(Crowbar, Crowbar.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 2gp"];
    }

    static getSelections(character, inventoryIndex) {
        return [];
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        tempFeatures.push(character.getFeatureCard(Crowbar.name, Crowbar.title, Crowbar.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Crowbar.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            Using a crowbar grants advantage to Strength checks where the crowbar's leverage can be applied.
        </p>
    `;

}
