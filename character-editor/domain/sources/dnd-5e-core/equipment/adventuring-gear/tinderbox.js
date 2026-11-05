
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Tinderbox {

    static get name() { return "tinderbox"; }
    static get title() { return "Tinderbox"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(Tinderbox, Tinderbox.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 5sp"];
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
                `equipment-${inventoryIndex}-${Tinderbox.name}`, Tinderbox.title, Tinderbox.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Tinderbox.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            This small container holds flint, fire steel, an tinder (usually dry cloth soaked in light oil) used to kindle a fire. Using it to light a torch — or anything else with abundant, exposed fuel — takes an action. Lighting any other fire takes 1 minutes.
        </p>
    `;

}
