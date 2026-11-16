
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class MistyStep {

    static get name() { return "misty-step"; }
    static get title() { return "Misty Step"; }
    static get level() { return 2; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 bonus action"; }
    static get range() { return "Self"; }
    static get components() { return "V"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(MistyStep, MistyStep.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(MistyStep, MistyStep.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = MistyStep.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see.
        </p>
    `;

}
