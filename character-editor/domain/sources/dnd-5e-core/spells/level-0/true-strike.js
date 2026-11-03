
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class TrueStrike {

    static get name() { return "true-strike"; }
    static get title() { return "True Strike"; }
    static get level() { return 0; }
    static get school() { return "divination"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "30 feet"; }
    static get components() { return "S"; }
    static get duration() { return "Concentration, up to 1 round"; }
    static get html() { return DnD5ESource.getSpellHtml(TrueStrike, TrueStrike.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(TrueStrike, TrueStrike.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = TrueStrike.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You extend your hand and point a finger at a target in range. Your magic grants you a brief insight into the target’s defenses. On your next turn, you gain advantage on your first attack roll against the target, provided that this spell hasn’t ended.
        </p>
    `;

}
