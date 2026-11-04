
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class RopeSilken {

    static get name() { return "rope-silken"; }
    static get title() { return "Rope, silk (50 feet)"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(RopeSilken, RopeSilken.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 10gp"];
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
        tempFeatures.push(character.getFeatureCard(RopeSilken.name, RopeSilken.title, RopeSilken.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = RopeSilken.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            Rope, whether made of hemp or silk, has 2 hit points and can be burst with a DC 17 Strength check.
        </p>
    `;

}
