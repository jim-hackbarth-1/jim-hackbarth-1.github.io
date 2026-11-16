/*
Alert to the hidden traps and secret doors found in many dungeons, you gain the following benefits:

You have advantage on Wisdom (Perception) and Intelligence (Investigation) checks made to detect the presence of secret doors.
You have advantage on saving throws made to avoid or resist traps.
You have resistance to the damage dealt by traps.
Travelling at a fast pace doesn't impose the normal -5 penalty on your passive Wisdom (Perception) score.
*/

import { DnD5ESource } from "../dnd-5e-core-source.js"

export class DungeonDelver {

    static get name() { return "dungeon-delver"; }
    static get title() { return "Dungeon Delver"; }
    static get canBeTakenMultipleTimes() { return false; }
    static get html() { return DnD5ESource.getFeatHtml(DungeonDelver, DungeonDelver.#content); }

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

    }

    static applyFeatures(features, character, classIndex, level) {
        const tempFeatures = [];
        tempFeatures.push(character.getFeatureCard(DungeonDelver.name, DungeonDelver.title, DungeonDelver.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
            feature.sourcePropertyValue = DungeonDelver.name;
            feature.cardSource = `${DungeonDelver.title} (Feat)`;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex, level) {

    }

    static #content = `
        <p>
            Alert to the hidden traps and secret doors found in many dungeons, you gain the following benefits:
            <ul>
                <li>You have advantage on Wisdom (Perception) and Intelligence (Investigation) checks made to detect the presence of secret doors.</li>
                <li>You have advantage on saving throws made to avoid or resist traps.</li>
                <li>You have resistance to the damage dealt by traps.</li>
                <li>Travelling at a fast pace doesn't impose the normal -5 penalty on your passive Wisdom (Perception) score.</li>
            </ul>
        </p>
    `;

}
