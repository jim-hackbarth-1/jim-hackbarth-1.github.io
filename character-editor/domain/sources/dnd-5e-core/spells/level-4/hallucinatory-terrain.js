
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class HallucinatoryTerrain {

    static get name() { return "hallucinatory-terrain"; }
    static get title() { return "Hallucinatory Terrain"; }
    static get level() { return 4; }
    static get school() { return "illusion"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "druid", "warlock", "wizard"]; }
    static get castingTime() { return "10 minutes"; }
    static get range() { return "300 feet"; }
    static get components() { return "V, S, M (a stone, a twig, and a bit of green plant)"; }
    static get duration() { return "24 hours"; }
    static get html() { return DnD5ESource.getSpellHtml(HallucinatoryTerrain, HallucinatoryTerrain.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(HallucinatoryTerrain, HallucinatoryTerrain.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = HallucinatoryTerrain.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You make natural terrain in a 150-foot cube in range look, sound, and smell like some other sort of natural terrain. Thus, open fields or a road can be made to resemble a swamp, hill, crevasse, or some other difficult or impassable terrain. A pond can be made to seem like a grassy meadow, a precipice like a gentle slope, or a rock-strewn gully like a wide and smooth road. Manufactured structures, equipment, and creatures within the area aren’t changed in appearance.
        </p>
        <p>
            The tactile characteristics of the terrain are unchanged, so creatures entering the area are likely to see through the illusion. If the difference isn’t obvious by touch, a creature carefully examining the illusion can attempt an Intelligence (Investigation) check against your spell save DC to disbelieve it. A creature who discerns the illusion for what it is, sees it as a vague image superimposed on the terrain.
        </p>
    `;

}
