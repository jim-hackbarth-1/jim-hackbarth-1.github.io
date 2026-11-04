
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Druidcraft {

    static get name() { return "druidcraft"; }
    static get title() { return "Druidcraft"; }
    static get level() { return 0; }
    static get school() { return "transmutation" }
    static get isRitual() { return false; }
    static get classes() { return ["druid"]; }
    static get castingTime() { return "1 action" }
    static get range() { return "30 feet" }
    static get components() { return "V, S" }
    static get duration() { return "Instantaneous" }
    static get html() { return DnD5ESource.getSpellHtml(Druidcraft, Druidcraft.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Druidcraft, Druidcraft.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Druidcraft.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Whispering to the spirits of nature, you create one of the following effects within range:
            <ul>
                <li>You create a tiny, harmless sensory effect that predicts what the weather will be at your location for the next 24 hours. The effect might manifest as a golden orb for clear skies, a cloud for rain, falling snowflakes for snow, and so on. This effect persists for 1 round.</li>
                <li>You instantly make a flower blossom, a seed pod open, or a leaf bud bloom.</li>
                <li>You create an instantaneous, harmless sensory effect, such as falling leaves, a puff of wind, the sound of a small animal, or the faint odor of skunk. The effect must fit in a 5-foot cube.</li>
                <li>You instantly light or snuff out a candle, a torch, or a small campfire.</li>
            </ul>
        </p>
    `;

}
