
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class PoisonSpray {

    static get name() { return "poison-spray"; }
    static get title() { return "Poison Spray"; }
    static get level() { return 0; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid", "sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "10 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(PoisonSpray, PoisonSpray.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const level = PoisonSpray.#getCharacterLevel(character, PoisonSpray.classes, characterSpellClasses);
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
            { target: "dc", saveAbility: "wisdom", damageDice: `${damageDice}d12`, damageType: "poison" });
        const spellCard = character.getSpellCard(PoisonSpray, PoisonSpray.#content, characterSpellClasses, attackInfo);
        tempFeatures.push(spellCard);
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = PoisonSpray.name
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
            You extend your hand toward a creature you can see within range and project a puff of noxious gas from your palm. The creature must succeed on a Constitution saving throw or take 1d12 poison damage.
        </p>
        <p>
            At Higher Levels. This spell’s damage increases by 1d12 when you reach 5th level (2d12), 11th level (3d12), and 17th level (4d12).
        </p>
    `;

}
