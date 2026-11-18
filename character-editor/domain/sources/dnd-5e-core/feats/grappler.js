
import { DnD5ESource } from "../dnd-5e-core-source.js"

export class Grappler {

    static get name() { return "grappler"; } 
    static get title() { return "Grappler"; }
    static get canBeTakenMultipleTimes() { return false; }
    static get html() { return DnD5ESource.getFeatHtml(Grappler, Grappler.#content); }

    static checkPrerequisites(character, features) {
        const strength = Number(character.getAbilityScore("strength"));
        if (strength >= 13) {
            return { prerequisitesMet: true, text: null };
        }
        return { prerequisitesMet: false, text: "Strength >= 13 required" };
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
        tempFeatures.push(character.getFeatureCard(Grappler.name, Grappler.title, Grappler.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
            feature.sourcePropertyValue = Grappler.name;
            feature.cardSource = `${Grappler.title} (Feat)`;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex, level) {

    }

    static #content = `
        <p>
            You've developed the skills necessary to hold your own in close-quarters grappling. You gain the following benefits:
            <ul>
                <li>You have advantage on attack rolls against a creature you are grappling.</li>
                <li>You can use your action to try to pin a creature grappled by you. To do so, make another grapple check. If you succeed, you and the creature are both restrained until the grapple ends.</li>
            </ul>
        </p>
    `;

}
