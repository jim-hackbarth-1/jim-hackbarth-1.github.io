
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ElementalWeapon {

    static get name() { return "elemental-weapon"; }
    static get title() { return "Elemental Weapon"; }
    static get level() { return 3; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["paladin"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S"; }
    static get duration() { return "Concentration, up to 1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(ElementalWeapon, ElementalWeapon.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(ElementalWeapon, ElementalWeapon.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ElementalWeapon.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A nonmagical weapon you touch becomes a magic weapon. Choose one of the following damage types: acid, cold, fire, lightning, or thunder. For the duration, the weapon has a +1 bonus to attack rolls and deals an extra 1d4 damage of the chosen type when it hits.
        </p>
            At Higher Levels. When you cast this spell using a spell slot of 5th or 6th level, the bonus to attack rolls increases to +2 and the extra damage increases to 2d4. When you use a spell slot of 7th level or higher, the bonus increases to +3 and the extra damage increases to 3d4.
        </p>
    `;

}
