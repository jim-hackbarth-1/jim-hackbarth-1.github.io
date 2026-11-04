
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Resistance {

    static get name() { return "resistance"; }
    static get title() { return "Resistance"; }
    static get level() { return 0; }
    static get school() { return "abjuration" }
    static get isRitual() { return false; }
    static get classes() { return ["cleric", "druid"]; }
    static get castingTime() { return "1 action" }
    static get range() { return "Touch" }
    static get components() { return "V, S, M (a miniature cloak)" }
    static get duration() { return "Concentration, up to 1 minute" }
    static get html() { return DnD5ESource.getSpellHtml(Resistance, Resistance.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Resistance, Resistance.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Resistance.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one saving throw of its choice. It can roll the die before or after the saving throw. The spell then ends.
        </p>
    `;

}
