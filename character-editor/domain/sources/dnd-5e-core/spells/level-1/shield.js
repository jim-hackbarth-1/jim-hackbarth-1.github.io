
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Shield_Spell {

    static get name() { return "shield"; }
    static get title() { return "Shield"; }
    static get level() { return 1; }
    static get school() { return "abjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "wizard"]; }
    static get castingTime() { return "1 reaction"; }
    static get range() { return "Self"; }
    static get components() { return "V, S"; }
    static get duration() { return "1 round"; }
    static get html() { return DnD5ESource.getSpellHtml(Shield_Spell, Shield_Spell.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Shield_Spell, Shield_Spell.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Shield_Spell.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from magic missile.
        </p>
    `;

}
