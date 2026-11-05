
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class AlchemistsFireFlask {

    static get name() { return "alchemists-fire-flask"; }
    static get title() { return "Alchemist's Fire (flask)"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(AlchemistsFireFlask, AlchemistsFireFlask.#content); }

    static get properties() {
        return [
            { name: "weapon-name", value: AlchemistsFireFlask.name },
            { name: "weapon-title", value: AlchemistsFireFlask.title },
            { name: "weapon-type", value: "improvised" },
            { name: "damage-dice", value: "1d4" },
            { name: "damage-type", value: "fire" },
            { name: "range", value: "20" }
        ];
    }

    static get displayProperties() {
        return ["Cost: 50gp"];
    }

    static getSelections(character, inventoryIndex) {
        return []
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = AlchemistsFireFlask.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            const alchemistsFire = character.getWeaponAttackCard(inventoryIndex, AlchemistsFireFlask);
            alchemistsFire.cardType = "feature-card";
            alchemistsFire.html = AlchemistsFireFlask.#content;
            alchemistsFire.cardSource = "equipment";
            tempFeatures.push(alchemistsFire);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = AlchemistsFireFlask.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            This sticky, adhesive fluid ignites when exposed to air. As an action, you can throw this flask up to 20 feet, shattering it on impact. Make a ranged attack against a creature or object, treating the alchemist's fire as an improvised weapon. On a hit, the target takes 1d4 fire damage at the start of each of its turns. A creature can end this damage by using its action to make a DC 10 Dexterity check to extinguish the flames.
        </p>
    `;

}
