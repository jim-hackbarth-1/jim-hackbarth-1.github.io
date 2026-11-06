
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Entangle {

    static get name() { return "entangle"; }
    static get title() { return "Entangle"; }
    static get level() { return 1; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "90 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(Entangle, Entangle.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Entangle, Entangle.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Entangle.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Grasping weeds and vines sprout from the ground in a 20-foot square starting from a point within range. For the duration, these plants turn the ground in the area into difficult terrain.
        </p>
        <p>
            A creature in the area when you cast the spell must succeed on a Strength saving throw or be restrained by the entangling plants until the spell ends. A creature restrained by the plants can use its action to make a Strength check against your spell save DC. On a success, it frees itself.
        </p>
        <p>
            When the spell ends, the conjured plants wilt away.
        </p>
    `;

}
