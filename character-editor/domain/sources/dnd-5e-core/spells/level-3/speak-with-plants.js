
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class SpeakWithPlants {

    static get name() { return "speak-with-plants"; }
    static get title() { return "Speak with Plants"; }
    static get level() { return 3; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "druid", "ranger"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self (30-foot radius)"; }
    static get components() { return "V, S"; }
    static get duration() { return "10 minutes"; }
    static get html() { return DnD5ESource.getSpellHtml(SpeakWithPlants, SpeakWithPlants.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(SpeakWithPlants, SpeakWithPlants.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = SpeakWithPlants.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You imbue plants within 30 feet of you with limited sentience and animation, giving them the ability to communicate with you and follow your simple commands. You can question plants about events in the spell’s area within the past day, gaining information about creatures that have passed, weather, and other circumstances.
        </p>
        <p>
            You can also turn difficult terrain caused by plant growth (such as thickets and undergrowth) into ordinary terrain that lasts for the duration. Or you can turn ordinary terrain where plants are present into difficult terrain that lasts for the duration, causing vines and branches to hinder pursuers, for example.
        </p>
        <p>
            Plants might be able to perform other tasks on your behalf, at the DM’s discretion. The spell doesn’t enable plants to uproot themselves and move about, but they can freely move branches, tendrils, and stalks.
        </p>
        <p>
            If a plant creature is in the area, you can communicate with it as if you share a common language, but you gain no magical ability to influence it.
        </p>
        <p>
            This spell can cause the plants created by the entangle spell to release a restrained creature.
        </p>
    `;

}
