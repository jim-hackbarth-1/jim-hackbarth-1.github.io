
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ProduceFlame {

    static get name() { return "produce-flame"; }
    static get title() { return "Produce Flame"; }
    static get level() { return 0; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "10 minutes"; }
    static get html() { return DnD5ESource.getSpellHtml(ProduceFlame, ProduceFlame.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const level = ProduceFlame.#getCharacterLevel(character, ProduceFlame.classes, characterSpellClasses);
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
        const attackInfo = character.getAttackInfo({ target: "to-hit", damageDice: `${damageDice}d8`, damageType: "fire" });
        const spellCard = character.getSpellCard(ProduceFlame, ProduceFlame.#content, characterSpellClasses, attackInfo);
        tempFeatures.push(spellCard);
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ProduceFlame.name
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
            A flickering flame appears in your hand. The flame remains there for the duration and harms neither you nor your equipment. The flame sheds bright light in a 10-foot radius and dim light for an additional 10 feet. The spell ends if you dismiss it as an action or if you cast it again.
        </p>
        <p>
            You can also attack with the flame, although doing so ends the spell. When you cast this spell, or as an action on a later turn, you can hurl the flame at a creature within 30 feet of you. Make a ranged spell attack. On a hit, the target takes 1d8 fire damage.
        </p>
        <p>
            At Higher Levels. This spell’s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).
        </p>
    `;

}
