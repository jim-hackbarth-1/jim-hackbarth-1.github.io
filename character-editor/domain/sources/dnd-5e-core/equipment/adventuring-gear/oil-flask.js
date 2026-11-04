
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class OilFlask {

    static get name() { return "oil-flask"; }
    static get title() { return "Oil (flask)"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(OilFlask, OilFlask.#content); }

    static get properties() {
        return [
            { name: "weapon-name", value: OilFlask.name },
            { name: "weapon-title", value: OilFlask.title },
            { name: "weapon-type", value: "improvised" },
            { name: "damage-dice", value: "5d1" },
            { name: "damage-type", value: "fire" },
            { name: "range", value: "20" }
        ];
    }

    static get displayProperties() {
        return ["Cost: 1sp"];
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
            const oil = character.getWeaponAttackCard(inventoryIndex, OilFlask);
            oil.cardType = "feature-card";
            oil.html = OilFlask.#content;
            oil.cardSource = "equipment";
            tempFeatures.push(oil);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = OilFlask.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            Oil usually comes in a clay flask that holds 1 pint. As an action, you can splash the oil in this flask onto a creature within 5 feet of you or throw it up to 20 feet, shattering it on impact. Make a ranged attack against a target creature or object, treating the oil as an improvised weapon. On a hit, the target is covered in oil. If the target takes any fire damage before the oil dries (after 1 minute), the target takes an additional 5 fire damage from the burning oil. You can also pour a flask of oil on the ground to cover a 5-foot-square area, provided that the surface is level. If lit, the oil burns for 2 rounds and deals 5 fire damage to any creature that enters the area or ends its turn in the area. A creature can take this damage only once per turn.
        </p>
    `;

}
