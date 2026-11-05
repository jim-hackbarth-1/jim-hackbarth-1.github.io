
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Spellbook {

    static get name() { return "spellbook"; }
    static get title() { return "Spellbook"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(Spellbook, Spellbook.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 50gp"];
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
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getFeatureCard(
                `equipment-${inventoryIndex}-${Spellbook.name}`, Spellbook.title, Spellbook.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Spellbook.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            Essential for wizards, a spellbook is a leather-bound tome with 100 blank vellum pages suitable for recording spells.
        </p>
    `;

}
