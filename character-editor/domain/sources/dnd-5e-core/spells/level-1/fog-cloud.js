
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class FogCloud {

    static get name() { return "fog-cloud"; }
    static get title() { return "Fog Cloud"; }
    static get level() { return 1; }
    static get school() { return "conjuration" }
    static get isRitual() { return false; }
    static get classes() { return ["druid", "ranger", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 action" }
    static get range() { return "120 feet" }
    static get components() { return "V, S" }
    static get duration() { return "Concentration, up to 1 hour" }
    static get html() { return DnD5ESource.getSpellHtml(FogCloud, FogCloud.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(FogCloud, FogCloud.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = FogCloud.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You create a 20-foot-radius sphere of fog centered on a point within range. The sphere spreads around corners, and its area is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the radius of the fog increases by 20 feet for each slot level above 1st.
        </p>
    `;

}

