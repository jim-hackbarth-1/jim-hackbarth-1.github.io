
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class BeaconOfHope {

    static get name() { return "beacon-of-hope"; }
    static get title() { return "Beacon of Hope"; }
    static get level() { return 3; }
    static get school() { return "abjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(BeaconOfHope, BeaconOfHope.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(BeaconOfHope, BeaconOfHope.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = BeaconOfHope.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            This spell bestows hope and vitality. Choose any number of creatures within range. For the duration, each target has advantage on Wisdom saving throws and death saving throws, and regains the maximum number of hit points possible from any healing.
        </p>
    `;

}
