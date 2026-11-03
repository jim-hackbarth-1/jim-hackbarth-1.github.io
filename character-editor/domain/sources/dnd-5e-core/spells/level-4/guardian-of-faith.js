
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class GuardianOfFaith {

    static get name() { return "guardian-of-faith"; }
    static get title() { return "Guardian of Faith"; }
    static get level() { return 4; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "30 feet"; }
    static get components() { return "V"; }
    static get duration() { return "8 hours"; }
    static get html() { return DnD5ESource.getSpellHtml(GuardianOfFaith, GuardianOfFaith.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(GuardianOfFaith, GuardianOfFaith.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = GuardianOfFaith.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A Large spectral guardian appears and hovers for the duration in an unoccupied space of your choice that you can see within range. The guardian occupies that space and is indistinct except for a gleaming sword and shield emblazoned with the symbol of your deity.
        </p>
        <p>
            Any creature hostile to you that moves to a space within 10 feet of the guardian for the first time on a turn must succeed on a Dexterity saving throw. The creature takes 20 radiant damage on a failed save, or half as much damage on a successful one. The guardian vanishes when it has dealt a total of 60 damage.
        </p>
    `;

}
