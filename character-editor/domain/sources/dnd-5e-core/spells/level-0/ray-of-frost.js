
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class RayOfFrost {

    static get name() { return "ray-of-frost"; }
    static get title() { return "Ray of Frost"; }
    static get level() { return 0; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(RayOfFrost, RayOfFrost.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const level = RayOfFrost.#getCharacterLevel(character, RayOfFrost.classes, characterSpellClasses);
        let damageDice = 1;
        if (level >= 5) {
            damageDice++;
        }
        if (level >= 11) {
            damageDice++;
        }
        if (level >= 17) {
            damageDice++;
        }
        const attackInfo = character.getAttackInfo({ target: "to-hit", damageDice: `${damageDice}d8`, damageType: "cold" });
        const spellCard = character.getSpellCard(RayOfFrost, RayOfFrost.#content, characterSpellClasses, attackInfo);
        tempFeatures.push(spellCard);
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = RayOfFrost.name
            features.push(feature);
        }
    }

    static #getCharacterLevel(character, spellClasses, characterSpellClasses) {
        let maxLevel = 1;
        let found = false;
        for (const spellClass of spellClasses) {
            const characterClass = character.classes.find(c => c.value == spellClass);
            if (characterClass) {
                found = true;
                const level = Number(characterClass.level ?? 1);
                if (level > maxLevel) {
                    maxLevel = level;
                }
            }
        }
        if (!found) {
            if (characterSpellClasses) {
                for (const characterSpellClass of characterSpellClasses) {
                    const characterClass = character.classes.find(c => c.value == characterSpellClass.spellClassName);
                    if (characterClass) {
                        const level = Number(characterClass.level ?? 1);
                        if (level > maxLevel) {
                            maxLevel = level;
                        }
                    }
                }
            }
        }
        return maxLevel;
    }

    static #content = `
        <p>
            A frigid beam of blue-white light streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, it takes 1d8 cold damage, and its speed is reduced by 10 feet until the start of your next turn.
        </p>
        <p>
            At Higher Levels. The spell’s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).
        </p>
    `;

}
