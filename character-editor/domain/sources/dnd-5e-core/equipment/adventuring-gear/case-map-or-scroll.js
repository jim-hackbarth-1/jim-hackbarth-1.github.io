
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class CaseMapOrScroll {

    static get name() { return "case-map-or-scroll"; }
    static get title() { return "Case, map or scroll"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(CaseMapOrScroll, CaseMapOrScroll.#content); }

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

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        tempFeatures.push(character.getFeatureCard(CaseMapOrScroll.name, CaseMapOrScroll.title, CaseMapOrScroll.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = CaseMapOrScroll.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            This cylindrical leather case can hold up to ten rolled-up sheets of paper or five rolled-up sheets of parchment.
        </p>
    `;

}
