
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class BallBearings {

    static get name() { return "ball-bearings"; }
    static get title() { return "Ball bearings (bag of 1,000)"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(BallBearings, BallBearings.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 1gp"];
    }

    static getSelections(character, inventoryIndex) {
        return [];
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getFeatureCard(
                `equipment-${inventoryIndex}-${BallBearings.name}`, BallBearings.title, BallBearings.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = BallBearings.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applyFeatures(features, character, inventoryIndex) {

    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            As an action, you can spill these tiny balls from their pouch to cover a level area 10 feet square. A creature moving across the covered area must succeed on a DC 10 Dexterity saving throw or fall prone. A creature moving through the area at half speed doesn't need to make the saving throw.
        </p>
    `;

}
