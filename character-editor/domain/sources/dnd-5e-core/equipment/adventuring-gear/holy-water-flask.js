
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class HolyWaterFlask {

    static get name() { return "holy-water-flask"; }
    static get title() { return "Holy water (flask)"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(HolyWaterFlask, HolyWaterFlask.#content); }

    static get properties() {
        return [
            { name: "weapon-name", value: HolyWaterFlask.name },
            { name: "weapon-title", value: HolyWaterFlask.title },
            { name: "weapon-type", value: "improvised" },
            { name: "damage-dice", value: "2d6" },
            { name: "damage-type", value: "radiant" },
            { name: "range", value: "20" }
        ];
    }

    static get displayProperties() {
        return ["Cost: 25gp"];
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
            const holyWater = character.getWeaponAttackCard(inventoryIndex, HolyWaterFlask);
            holyWater.cardType = "feature-card";
            holyWater.html = HolyWaterFlask.#content;
            holyWater.cardSource = "equipment";
            tempFeatures.push(holyWater);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = HolyWaterFlask.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            As an action, you can splash the contents of this flask onto a creature within 5 feet of you or throw it up to 20 feet, shattering it on impact. In either case, make a ranged attack against a target creature, treating the holy water as an improvised weapon. If the target is a fiend or undead, it takes 2d6 radiant damage.
        </p>
    `;

}
