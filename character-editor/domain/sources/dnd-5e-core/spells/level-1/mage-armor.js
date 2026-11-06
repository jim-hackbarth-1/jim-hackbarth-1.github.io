
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class MageArmor {

    static get name() { return "mage-armor"; }
    static get title() { return "Mage Armor"; }
    static get level() { return 1; }
    static get school() { return "abjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (a piece of cured leather)"; }
    static get duration() { return "8 hours"; }
    static get html() { return DnD5ESource.getSpellHtml(MageArmor, MageArmor.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(MageArmor, MageArmor.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = MageArmor.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You touch a willing creature who isn’t wearing armor, and a protective magical force surrounds it until the spell ends. The target’s base AC becomes 13 + its Dexterity modifier. The spell ends if the target dons armor or if you dismiss the spell as an action.
        </p>
    `;

}
