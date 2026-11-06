
import { DnD5ESource } from "../dnd-5e-core-source.js"

export class Alert {

    static get name() { return "alert"; }
    static get title() { return "Alert"; }
    static get canBeTakenMultipleTimes() { return false; }
    static get html() { return DnD5ESource.getFeatHtml(Alert, Alert.#content); }

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
        const modifiers = [];
        modifiers.push(
        {
            name: `${Alert.name}-initiative-modifier`,
            target: "initiative",
            value: 5,
            title: Alert.title,
        });
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
                modifier.sourcePropertyValue = Alert.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, classIndex, level) {
        const tempFeatures = [];
        tempFeatures.push(character.getFeatureCard(Alert.name, Alert.title, Alert.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
            feature.sourcePropertyValue = Alert.name;
            feature.cardSource = `${Alert.title} (Feat)`;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex, level) {

    }

    static #content = `
        <p>
            Always on the lookout for danger, you gain the following benefits:
            <ul>
                <li>You can't be surprised while you are conscious.</li>
                <li>You gain a +5 bonus to initiative.</li>
                <li>Other creatures don't gain advantage on attack rolls against you as a result of being unseen by you.</li>
            </ul>
        </p>
    `;

}
