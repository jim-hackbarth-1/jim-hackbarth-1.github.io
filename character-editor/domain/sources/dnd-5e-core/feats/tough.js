
import { DnD5ESource } from "../dnd-5e-core-source.js"

export class Tough {

    static get name() { return "tough"; }
    static get title() { return "Tough"; }
    static get canBeTakenMultipleTimes() { return false; }
    static get html() { return DnD5ESource.getFeatHtml(Tough, Tough.#content); }

    static checkPrerequisites(character) {
        return { prerequisitesMet: true, text: null };
    }

    static getSelections(character, classIndex, level) {
        return [];
    }

    static getSelectionOptions(character, classIndex, level, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, classIndex, level, targetFilters) {
        const hitPointMod = Number(character.level) * 2;
        const modifiers = [
            {
                name: "tough-hit-point-modifier",
                target: "hit-points",
                value: hitPointMod,
                title: Tough.title,
            }];
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
                modifier.sourcePropertyValue = "tough";
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, classIndex, level) {
        const tempFeatures = [];
        tempFeatures.push(character.getFeatureCard(Tough.name, Tough.title, Tough.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
            feature.sourcePropertyValue = Tough.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex, level) {

    }

    static #content = `
        <p>
            Your hit point maximum increases by an amount equal to twice your level when you gain this feat. Whenever you gain a level thereafter, your hit point maximum increases by an additional 2 hit points.
        </p>
    `;

}
