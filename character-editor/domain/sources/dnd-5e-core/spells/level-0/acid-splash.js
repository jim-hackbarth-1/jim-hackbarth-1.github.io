
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class AcidSplash {

    static get name() { return "acid-splash"; }
    static get title() { return "Acid Splash"; }
    static get level() { return 0; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(AcidSplash, AcidSplash.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const level = AcidSplash.#getCharacterLevel(character, AcidSplash.classes, characterSpellClasses);
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
            { target: "dc", saveAbility: "dexterity", damageDice: `${damageDice}d6`, damageType: "acid" });
        const spellCard = character.getSpellCard(AcidSplash, AcidSplash.#content, characterSpellClasses, attackInfo);
        tempFeatures.push(spellCard);
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = AcidSplash.name
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
            You hurl a bubble of acid. Choose one creature you can see within range, or choose two creatures you can see within range that are within 5 feet of each other. A target must succeed on a Dexterity saving throw or take 1d6 acid damage.
        </p>
        <p>
            At Higher Levels. This spell’s damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).
        </p>
    `;

}
