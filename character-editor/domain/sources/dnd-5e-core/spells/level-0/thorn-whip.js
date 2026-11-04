
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ThornWhip {

    static get name() { return "thorn-whip"; }
    static get title() { return "Thorn Whip"; }
    static get level() { return 0; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S, M (the stem of a plant with thorns)"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(ThornWhip, ThornWhip.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const level = ThornWhip.#getCharacterLevel(character, ThornWhip.classes, characterSpellClasses);
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
        const attackInfo = character.getAttackInfo({ target: "to-hit", damageDice: `${damageDice}d6`, damageType: "piercing" });
        const spellCard = character.getSpellCard(ThornWhip, ThornWhip.#content, characterSpellClasses, attackInfo);
        tempFeatures.push(spellCard);
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ThornWhip.name
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
            You create a long, vine-like whip covered in thorns that lashes out at your command toward a creature in range. Make a melee spell attack against the target. If the attack hits, the creature takes 1d6 piercing damage, and if the creature is Large or smaller, you pull the creature up to 10 feet closer to you.
        </p>
        <p>
            At Higher Levels. This spell’s damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).
        </p>
    `;

}
