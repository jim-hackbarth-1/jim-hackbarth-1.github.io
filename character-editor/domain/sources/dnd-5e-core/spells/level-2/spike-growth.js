
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class SpikeGrowth {

    static get name() { return "spike-growth"; }
    static get title() { return "Spike Growth"; }
    static get level() { return 2; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid", "ranger"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "150 feet"; }
    static get components() { return "V, S, M (seven sharp thorns or seven small twigs, each sharpened to a point)"; }
    static get duration() { return "Concentration, up to 10 minutes"; }
    static get html() { return DnD5ESource.getSpellHtml(SpikeGrowth, SpikeGrowth.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(SpikeGrowth, SpikeGrowth.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = SpikeGrowth.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            The ground in a 20-foot radius centered on a point within range twists and sprouts hard spikes and thorns. The area becomes difficult terrain for the duration. When a creature moves into or within the area, it takes 2d4 piercing damage for every 5 feet it travels.
        </p>
        <p>
            The transformation of the ground is camouflaged to look natural. Any creature that can’t see the area at the time the spell is cast must make a Wisdom (Perception) check against your spell save DC to recognize the terrain as hazardous before entering it.
        </p>
    `;

}
