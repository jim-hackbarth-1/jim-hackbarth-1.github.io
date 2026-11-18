
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class LocateCreature {

    static get name() { return "locate-creature"; }
    static get title() { return "Locate Creature"; }
    static get level() { return 4; }
    static get school() { return "divination"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "cleric", "druid", "paladin", "ranger", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self"; }
    static get components() { return "V, S, M (a bit of fur from a bloodhound)"; }
    static get duration() { return "Concentration, up to 1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(LocateCreature, LocateCreature.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(LocateCreature, LocateCreature.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = LocateCreature.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Describe or name a creature that is familiar to you. You sense the direction to the creature’s location, as long as that creature is within 1,000 feet of you. If the creature is moving, you know the direction of its movement.
        </p>
        <p>
            The spell can locate a specific creature known to you, or the nearest creature of a specific kind (such as a human or a unicorn), so long as you have seen such a creature up close – within 30 feet – at least once. If the creature you described or named is in a different form, such as being under the effects of a polymorph spell, this spell doesn’t locate the creature.
        </p>
        <p>
            This spell can’t locate a creature if running water at least 10 feet wide blocks a direct path between you and the creature.
        </p>
    `;

}
