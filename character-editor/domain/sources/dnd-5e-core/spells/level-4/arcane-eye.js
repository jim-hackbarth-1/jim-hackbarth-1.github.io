
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ArcaneEye {

    static get name() { return "arcane-eye"; }
    static get title() { return "Arcane Eye"; }
    static get level() { return 4; }
    static get school() { return "divination"; }
    static get isRitual() { return false; }
    static get classes() { return ["wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S, M (a bit of bat fur)"; }
    static get duration() { return "Concentration, up to 1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(ArcaneEye, ArcaneEye.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(ArcaneEye, ArcaneEye.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ArcaneEye.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You create an invisible, magical eye within range that hovers in the air for the duration. You mentally receive visual information from the eye, which has normal vision and darkvision out to 30 feet. The eye can look in every direction.
        </p>
        <p>
            As an action, you can move the eye up to 30 feet in any direction. There is no limit to how far away from you the eye can move, but it can’t enter another plane of existence. A solid barrier blocks the eye’s movement, but the eye can pass through an opening as small as 1 inch in diameter.
        </p>
    `;

}
