
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class SacredFlame {

    static get name() { return "sacred-flame"; }
    static get title() { return "Sacred Flame"; }
    static get level() { return 0; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(SacredFlame, SacredFlame.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const level = SacredFlame.#getCharacterLevel(character, SacredFlame.classes, characterSpellClasses);
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
        const attackInfo = character.getAttackInfo(
            { target: "dc", saveAbility: "dexterity", damageDice: `${damageDice}d8`, damageType: "radiant" });
        const spellCard = character.getSpellCard(SacredFlame, SacredFlame.#content, characterSpellClasses, attackInfo);
        tempFeatures.push(spellCard);
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = SacredFlame.name
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
            Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 radiant damage. The target gains no benefit from cover for this saving throw.
        </p>
        <p>
            At Higher Levels. The spell’s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).
        </p>
    `;

}
