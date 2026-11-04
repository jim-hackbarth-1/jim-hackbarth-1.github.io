
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Manacles {

    static get name() { return "manacles"; }
    static get title() { return "Manacles"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(Manacles, Manacles.#content); }

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
        tempFeatures.push(character.getFeatureCard(Manacles.name, Manacles.title, Manacles.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Manacles.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            These metal restraints can bind a Small or Medium creature. Escaping the manacles requires a successful DC 20 Dexterity check. Breaking them requires a successful DC 20 Strength check. Each set of manacles comes with one key. Without the key, a creature proficient with thieves’ tools can pick the manacles’ lock with a successful DC 15 Dexterity check. Manacles have 15 hit points.
        </p>
    `;

}
