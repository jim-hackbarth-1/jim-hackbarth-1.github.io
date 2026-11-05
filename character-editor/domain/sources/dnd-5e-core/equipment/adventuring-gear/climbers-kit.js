
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ClimbersKit {

    static get name() { return "climbers-kit"; }
    static get title() { return "Climber's kit"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(ClimbersKit, ClimbersKit.#content); }

    static get properties() {
        return [];
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
            tempFeatures.push(character.getFeatureCard(
                `equipment-${inventoryIndex}-${ClimbersKit.name}`, ClimbersKit.title, ClimbersKit.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = ClimbersKit.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            A climber's kit includes special pitons, boot tips, gloves, and a harness. You can use the climber's kit as an action to anchor yourself; when you do, you can't fall more than 25 feet from the point where you anchored yourself, and you can't climb more than 25 feet away from that point without undoing the anchor.
        </p>
    `;

}
