
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class SpeakWithAnimals {

    static get name() { return "speak-with-animals"; }
    static get title() { return "Speak with Animals"; }
    static get level() { return 1; }
    static get school() { return "divination"; }
    static get isRitual() { return true; }
    static get classes() { return ["bard", "druid", "ranger"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self"; }
    static get components() { return "V, S"; }
    static get duration() { return "10 minutes"; }
    static get html() { return DnD5ESource.getSpellHtml(SpeakWithAnimals.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(SpeakWithAnimals, SpeakWithAnimals.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = SpeakWithAnimals.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You gain the ability to comprehend and verbally communicate with beasts for the duration. The knowledge and awareness of many beasts is limited by their intelligence, but at minimum, beasts can give you information about nearby locations and monsters, including whatever they can perceive or have perceived within the past day. You might be able to persuade a beast to perform a small favor for you, at the DM’s discretion.
        </p>
    `;

}
