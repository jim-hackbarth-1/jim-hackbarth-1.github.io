
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Scale {

    static get name() { return "scale"; }
    static get title() { return "Scale, merchant's"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(Scale, Scale.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 5gp"];
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
            tempFeatures.push(character.getFeatureCard(`equipment-${inventoryIndex}-${Scale.name}`, Scale.title, Scale.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Scale.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            A scale includes a small balance, pans, and a suitable assortment of weights up to 2 pounds.  With it, you can measure the exact weight of small objects, such as raw precious metals or trade goods, to help determine their worth.
        </p>
    `;

}
