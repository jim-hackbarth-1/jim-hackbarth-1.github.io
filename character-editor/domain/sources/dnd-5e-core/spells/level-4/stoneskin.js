
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Stoneskin {

    static get name() { return "stoneskin"; }
    static get title() { return "Stoneskin"; }
    static get level() { return 4; }
    static get school() { return "abjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid", "ranger", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (diamond dust worth 100 gp, which the spell consumes)"; }
    static get duration() { return "Concentration, up to 1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(Stoneskin, Stoneskin.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Stoneskin, Stoneskin.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Stoneskin.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            This spell turns the flesh of a willing creature you touch as hard as stone. Until the spell ends, the target has resistance to nonmagical bludgeoning, piercing, and slashing damage.
        </p>
    `;

}
