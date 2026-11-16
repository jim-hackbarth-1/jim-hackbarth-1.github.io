
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class LocateAnimalsOrPlants {

    static get name() { return "locate-animals-or-plants"; }
    static get title() { return "Locate Animals or Plants"; }
    static get level() { return 2; }
    static get school() { return "divination"; }
    static get isRitual() { return true; }
    static get classes() { return ["bard", "druid", "ranger"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self"; }
    static get components() { return "V, S, M (a bit of fur from a bloodhound)"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(LocateAnimalsOrPlants, LocateAnimalsOrPlants.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(LocateAnimalsOrPlants, LocateAnimalsOrPlants.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = LocateAnimalsOrPlants.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Describe or name a specific kind of beast or plant. Concentrating on the voice of nature in your surroundings, you learn the direction and distance to the closest creature or plant of that kind within 5 miles, if any are present.
        </p>
    `;

}
