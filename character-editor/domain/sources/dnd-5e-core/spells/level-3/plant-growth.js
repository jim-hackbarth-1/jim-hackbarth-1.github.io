
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class PlantGrowth {

    static get name() { return "plant-growth"; }
    static get title() { return "Plant Growth"; }
    static get level() { return 3; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "druid", "ranger"]; }
    static get castingTime() { return "1 action or 8 hours"; }
    static get range() { return "150 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(PlantGrowth, PlantGrowth.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(PlantGrowth, PlantGrowth.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = PlantGrowth.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            This spell channels vitality into plants within a specific area. There are two possible uses for the spell, granting either immediate or long-term benefits.
        </p>
        <p>
            If you cast this spell using 1 action, choose a point within range. All normal plants in a 100-foot radius centered on that point become thick and overgrown. A creature moving through the area must spend 4 feet of movement for every 1 foot it moves.
        </p>
        <p>
            You can exclude one or more areas of any size within the spell’s area from being affected.
        </p>
        <p>
            If you cast this spell over 8 hours, you enrich the land. All plants in a half-mile radius centered on a point within range become enriched for 1 year. The plants yield twice the normal amount of food when harvested.
        </p>
    `;

}
