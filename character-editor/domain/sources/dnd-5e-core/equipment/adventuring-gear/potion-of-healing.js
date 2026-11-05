
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class PotionOfHealing_Gear {

    static get name() { return "potion-of-healing-gear"; }
    static get title() { return "Potion of healing"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(PotionOfHealing_Gear, PotionOfHealing_Gear.#content); }

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
                `equipment-${inventoryIndex}-${PotionOfHealing_Gear.name}`, PotionOfHealing_Gear.title, PotionOfHealing_Gear.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = PotionOfHealing_Gear.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            A character who drinks the magical red fluid in this vial regains 2d4 + 2 hit points. Drinking or administering a potion takes an action.
        </p>
    `;

}
