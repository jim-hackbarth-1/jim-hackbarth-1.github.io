
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ShieldOfMissileAttraction {

    static get name() { return "shield-of-missile-attraction"; }
    static get title() { return "Shield of Missile Attraction"; }
    static get category() { return "armor-magical"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(ShieldOfMissileAttraction, ShieldOfMissileAttraction.#content); }
    static get armorType() { return "shield"; }

    static get properties() {
        return [
            { name: "is-shield" },
            { name: "attunement" },
            { name: "armor-name", value: "shield" },
            { name: "armor-title", value: ShieldOfMissileAttraction.title },
            { name: "armor-type", value: "shield" },
            { name: "ac-modifier", value: "2" }
        ];
    }

    static get displayProperties() {
        return ["Rare", "Requires attunement"];
    }

    static getSelections(character, inventoryIndex) {
        return []
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = ShieldOfMissileAttraction.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${ShieldOfMissileAttraction.name}-inventory-index-${inventoryIndex}-ac-modifier`,
                target: "armor-class",
                value: 2,
                title: ShieldOfMissileAttraction.title
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = ShieldOfMissileAttraction.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getFeatureCard(
                `equipment-${inventoryIndex}-${ShieldOfMissileAttraction.name}`, ShieldOfMissileAttraction.title, ShieldOfMissileAttraction.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = ShieldOfMissileAttraction.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            While holding this shield, you have resistance to damage from ranged weapon attacks.
        </p>
        <p>
            <b>Curse.</b> This shield is cursed. Attuning to it curses you until you are targeted by the Remove Curse spell or similar magic. Removing the shield fails to end the curse on you. Whenever a ranged weapon attack is made against a target within 10 feet of you, the curse causes you to become the target instead.
        </p>
    `;
}
