
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Candle {

    static get name() { return "candle"; }
    static get title() { return "Candle"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(Candle, Candle.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 1cp"];
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
        tempFeatures.push(character.getFeatureCard(Candle.name, Candle.title, Candle.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Candle.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            For 1 hour, a candle sheds bright light in a 5-foot radius and dim light for another 5 feet.
        </p>
    `;

}
