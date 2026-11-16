
import { DnD5ESource } from "../dnd-5e-core-source.js"

export class DualWielder {

    static get name() { return "dual-wielder"; }
    static get title() { return "Dual Wielder"; }
    static get canBeTakenMultipleTimes() { return false; }
    static get html() { return DnD5ESource.getFeatHtml(DualWielder, DualWielder.#content); }

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

        //You gain a +1 bonus to AC while you are wielding a separate melee weapon in each hand.
        const meleeWeaponTypes = ["simple-melee", "martial-melee"];
        const meleeWeapons = [];
        for (let i = 0; i < character.equipment.length; i++) {
            const item = character.equipment[i];
            if (item.isEquipped) {
                const properties = item.properties ?? [];
                const isMelee = properties.some(p => p.name == "weapon-type" && meleeWeaponTypes.includes(p.value));
                const isTwoHanded = properties.some(p => p.name == "two-handed");
                if (isMelee && !isTwoHanded) {
                    meleeWeapons.push(i);
                }
            }
        }
        if (meleeWeapons.length >= 2) {
            modifiers.push({
                name: `${DualWielder.name}-ac-modifier`,
                target: "armor-class",
                value: 1,
                title: DualWielder.title
            });
        }

        //You can use two-weapon fighting even when the one-handed melee weapons you are wielding aren't light.
        if (meleeWeapons.length > 0) {
            modifiers.push({
                name: `${DualWielder.name}-off-hand`,
                target: "off-hand-weapon",
                value: true,
                title: DualWielder.title,
                conditions: [
                    {
                        name: "inventory-index",
                        values: meleeWeapons
                    }
                ]
            });
        }

        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
                modifier.sourcePropertyValue = DualWielder.name;
                character.addModifier(modifier);
            }
        }
 
    }

    static applyFeatures(features, character, classIndex, level) {
        const tempFeatures = [];
        tempFeatures.push(character.getFeatureCard(DualWielder.name, DualWielder.title, DualWielder.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
            feature.sourcePropertyValue = DualWielder.name;
            feature.cardSource = `${DualWielder.title} (Feat)`;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex, level) {

    }

    static #content = `
        <p>
            You master fighting with two weapons, gaining the following benefits:
            <ul>
                <li>You gain a +1 bonus to AC while you are wielding a separate melee weapon in each hand.</li>
                <li>You can use two-weapon fighting even when the one-handed melee weapons you are wielding aren't light.</li>
                <li>You can draw or stow two one-handed weapons when you would normally be able to draw or stow only one.</li>
            </ul>
        </p>
    `;

}
