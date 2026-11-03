
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class CloudOfDaggers {

    static get name() { return "cloud-of-daggers"; }
    static get title() { return "Cloud Of Daggers"; }
    static get level() { return 2; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V, S, M (a sliver of glass)"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(CloudOfDaggers, CloudOfDaggers.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(CloudOfDaggers, CloudOfDaggers.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = CloudOfDaggers.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You fill the air with spinning daggers in a cube 5 feet on each side, centered on a point you choose within range. A creature takes 4d4 slashing damage when it enters the spell’s area for the first time on a turn or starts its turn there.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 2d4 for each slot level above 2nd.
        </p>
    `;

}
