
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Bless {

    static get name() { return "bless"; }
    static get title() { return "Bless"; }
    static get level() { return 1; }
    static get school() { return "enchantment" }
    static get isRitual() { return false; }
    static get classes() { return ["cleric", "paladin"]; }
    static get castingTime() { return "1 action" }
    static get range() { return "30 feet" }
    static get components() { return "V, S, M (a sprinkling of holy water)" }
    static get duration() { return "Concentration, up to 1 minute" }
    static get html() { return DnD5ESource.getSpellHtml(Bless, Bless.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Bless, Bless.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Bless.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You bless up to three creatures of your choice within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target can roll a d4 and add the number rolled to the attack roll or saving throw.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.
        </p>
    `;

}

