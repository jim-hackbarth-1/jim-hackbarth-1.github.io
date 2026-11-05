
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class LanternBullseye {

    static get name() { return "lantern-bullseye"; }
    static get title() { return "Lantern, bullseye"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(LanternBullseye, LanternBullseye.#content); }

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
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getFeatureCard(
                `equipment-${inventoryIndex}-${LanternBullseye.name}`, LanternBullseye.title, LanternBullseye.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = LanternBullseye.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            A bullseye lantern casts bright light in a 60-foot cone and dim light for an additional 60 feet. Once lit, it burns for 6 hours on a flask (1 pint) of oil.
        </p>
    `;

}
