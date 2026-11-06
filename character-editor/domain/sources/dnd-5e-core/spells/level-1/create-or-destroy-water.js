
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class CreateOrDestroyWater {

    static get name() { return "create-or-destroy-water"; }
    static get title() { return "Create or Destroy Water"; }
    static get level() { return 1; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric", "druid"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S, M (a drop of water if creating water or a few grains of sand if destroying it)"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(CreateOrDestroyWater, CreateOrDestroyWater.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(CreateOrDestroyWater, CreateOrDestroyWater.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = CreateOrDestroyWater.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You either create or destroy water.
        </p>
        <p>
            Create Water. You create up to 10 gallons of clean water within range in an open container. Alternatively, the water falls as rain in a 30-foot cube within range, extinguishing exposed flames in the area.
        </p>
        <p>
            Destroy Water. You destroy up to 10 gallons of water in an open container within range. Alternatively, you destroy fog in a 30-foot cube within range.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you create or destroy 10 additional gallons of water, or the size of the cube increases by 5 feet, for each slot level above 1st.
        </p>
    `;

}
