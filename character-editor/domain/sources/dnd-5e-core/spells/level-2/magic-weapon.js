
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class MagicWeaponSpell {

    static get name() { return "magic-weapon"; }
    static get title() { return "Magic Weapon"; }
    static get level() { return 2; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["paladin", "wizard"]; }
    static get castingTime() { return "1 bonus action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S"; }
    static get duration() { return "Concentration, up to 1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(MagicWeaponSpell, MagicWeaponSpell.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(MagicWeaponSpell, MagicWeaponSpell.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = MagicWeaponSpell.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You touch a nonmagical weapon. Until the spell ends, that weapon becomes a magic weapon with a +1 bonus to attack rolls and damage rolls.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the bonus increases to +2. When you use a spell slot of 6th level or higher, the bonus increases to +3.
        </p>
    `;

}

