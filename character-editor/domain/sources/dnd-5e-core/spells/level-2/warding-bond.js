
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class WardingBond {

    static get name() { return "warding-bond"; }
    static get title() { return "Warding Bond"; }
    static get level() { return 2; }
    static get school() { return "abjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (a pair of platinum rings worth at least 50 gp each, which you and target must wear for the duration)"; }
    static get duration() { return "1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(WardingBond, WardingBond.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(WardingBond, WardingBond.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = WardingBond.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            This spell wards a willing creature you touch and creates a mystic connection between you and the target until the spell ends.
        </p>
        <p>
            While the target is within 60 feet of you, it gains a +1 bonus to AC and saving throws, and it has resistance to all damage. Also, each time it takes damage, you take the same amount of damage.
        </p>
        <p>
            The spell ends if you drop to 0 hit points or if you and the target become separated by more than 60 feet. It also ends if the spell is cast again on either of the connected creatures. You can also dismiss the spell as an action.
        </p>
    `;

}
