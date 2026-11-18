
import { DnD5ESource } from "../dnd-5e-core-source.js"

export class DefensiveDuelist {

    static get name() { return "defensive-duelist"; }
    static get title() { return "Defensive Duelist"; }
    static get canBeTakenMultipleTimes() { return false; }
    static get html() { return DnD5ESource.getFeatHtml(DefensiveDuelist, DefensiveDuelist.#content); }

    static checkPrerequisites(character, features) {
        const dexterity = Number(character.getAbilityScore("dexterity"));
        if (dexterity >= 13) {
            return { prerequisitesMet: true, text: null };
        }
        return { prerequisitesMet: false, text: "Dexterity >= 13 required" };
    }

    static getSelections(character, classIndex, level) {
        return [];
    }

    static getSelectionOptions(character, classIndex, level, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, classIndex, level, targetFilters) {

    }

    static applyFeatures(features, character, classIndex, level) {
        const tempFeatures = [];
        tempFeatures.push(character.getFeatureCard(DefensiveDuelist.name, DefensiveDuelist.title, DefensiveDuelist.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
            feature.sourcePropertyValue = DefensiveDuelist.name;
            feature.cardSource = `${DefensiveDuelist.title} (Feat)`;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex, level) {

    }

    static #content = `
        <p>
            When you are wielding a finesse weapon with which you are proficient and another creature hits you with a melee attack, you can use your reaction to add your proficiency bonus to your AC for that attack, potentially causing the attack to miss you.
        </p>
    `;

}
