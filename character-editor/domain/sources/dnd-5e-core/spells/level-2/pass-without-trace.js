
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class PassWithoutTrace {

    static get name() { return "pass-without-trace"; }
    static get title() { return "Pass without Trace"; }
    static get level() { return 2; }
    static get school() { return "abjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid", "ranger"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self"; }
    static get components() { return "V, S, M (ashes from a burned leaf of mistletoe and a sprig of spruce)"; }
    static get duration() { return "Concentration, up to 1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(PassWithoutTrace, PassWithoutTrace.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(PassWithoutTrace, PassWithoutTrace.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = PassWithoutTrace.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A veil of shadows and silence radiates from you, masking you and your companions from detection. For the duration, each creature you choose within 30 feet of you (including you) has a +10 bonus to Dexterity (Stealth) checks and can’t be tracked except by magical means. A creature that receives this bonus leaves behind no tracks or other traces of its passage.
        </p>
    `;

}
