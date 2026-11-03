
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class AcidVial {

    static get name() { return "acid-vial"; }
    static get title() { return "Acid (vial)"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(AcidVial, AcidVial.#content); }

    static get properties() {
        return [
            { name: "weapon-name", value: AcidVial.name },
            { name: "weapon-title", value: AcidVial.title },
            { name: "weapon-type", value: "improvised" },
            { name: "damage-dice", value: "2d6" },
            { name: "damage-type", value: "acid" },
            { name: "range", value: "20" }
        ];
    }

    static get displayProperties() {
        return ["Cost: 25gp"];
    }

    static getSelections(character, inventoryIndex) {
        return []
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = AcidVial.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getWeaponAttackCard(inventoryIndex, AcidVial));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = AcidVial.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            As an action, you can splash the contents of this vial onto a creature within 5 feet of you or throw the vial up to 20 feet, shattering it on impact. In either case, make a ranged attack against a creature or object, treating the acid as an improvised weapon. On a hit, the target takes 2d6 acid damage.
        </p>
    `;

}
