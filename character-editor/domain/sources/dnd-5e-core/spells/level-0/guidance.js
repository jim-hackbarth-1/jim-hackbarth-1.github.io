
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Guidance {

    static get name() { return "guidance"; }
    static get title() { return "Guidance"; }
    static get level() { return 0; }
    static get school() { return "divination" }
    static get isRitual() { return false; }
    static get classes() { return ["cleric", "druid"]; }
    static get castingTime() { return "1 action" }
    static get range() { return "Touch" }
    static get components() { return "V, S" }
    static get duration() { return "Concentration, up to 1 minute" }
    static get html() { return DnD5ESource.getSpellHtml(Guidance, Guidance.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Guidance, Guidance.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Guidance.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice. It can roll the die before or after making the ability check. The spell then ends.
        </p>
    `;

}
