/*
You've learned to put the weight of a weapon to your advantage, letting its momentum empower your strikes. You gain the following benefits:

On your turn, when you score a critical hit with a melee weapon or reduce a creature to 0 hit points with one, you can make one melee weapon attack as a bonus action.
Before you make a melee attack with a heavy weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack's damage.
*/
import { DnD5ESource } from "../dnd-5e-core-source.js"

export class GreatWeaponMaster {

    static get name() { return "great-weapon-master"; }
    static get title() { return "Great Weapon Master"; }
    static get canBeTakenMultipleTimes() { return false; }
    static get html() { return DnD5ESource.getFeatHtml(GreatWeaponMaster, GreatWeaponMaster.#content); }

    static checkPrerequisites(character, features) {
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
        tempFeatures.push(character.getFeatureCard(GreatWeaponMaster.name, GreatWeaponMaster.title, GreatWeaponMaster.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
            feature.sourcePropertyValue = GreatWeaponMaster.name;
            feature.cardSource = `${GreatWeaponMaster.title} (Feat)`;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex, level) {

    }

    static #content = `
        <p>
            You've learned to put the weight of a weapon to your advantage, letting its momentum empower your strikes. You gain the following benefits:
            <ul>
                <li>On your turn, when you score a critical hit with a melee weapon or reduce a creature to 0 hit points with one, you can make one melee weapon attack as a bonus action.</li>
                <li>Before you make a melee attack with a heavy weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack's damage.</li>
            </ul>
        </p>
    `;

}
