
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class BracersOfArchery {

    static get name() { return "bracers-of-archery"; }
    static get title() { return "Bracers of Archery"; }
    static get category() { return "wondrous-items"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(BracersOfArchery, BracersOfArchery.#content); }

    static get properties() {
        return [];

    }
    static get displayProperties() {
        return [];
    }

    static getSelections(character, inventoryIndex) {
        return []
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = BracersOfArchery.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: "bracers-of-archery-proficiency-shortbow",
                target: "weapon-proficiency",
                value: "shortbow",
                title: BracersOfArchery.title
            });
            modifiers.push({
                name: "bracers-of-archery-proficiency-longbow",
                target: "weapon-proficiency",
                value: "longbow",
                title: BracersOfArchery.title
            });
            modifiers.push({
                name: "bracers-of-archery-damage-modifier",
                target: "damage",
                value: 2,
                title: BracersOfArchery.title,
                conditions: [
                    {
                        name: "weapon-name",
                        values: ["longbow", "shortbow"]
                    }
                ]
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = BracersOfArchery.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getFeatureCard(BracersOfArchery.name, BracersOfArchery.title, BracersOfArchery.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = BracersOfArchery.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            While wearing these bracers, you have proficiency with the longbow and shortbow, and you gain a +2 bonus to damage rolls on ranged attacks made with such weapons.
        </p>
    `;

}
