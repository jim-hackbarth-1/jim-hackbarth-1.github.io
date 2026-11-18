
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class WaterWalk {

    static get name() { return "water-walk"; }
    static get title() { return "Water Walk"; }
    static get level() { return 3; }
    static get school() { return "transmutation"; }
    static get isRitual() { return true; }
    static get classes() { return ["cleric", "druid", "ranger", "sorcerer"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S, M (a piece of cork)"; }
    static get duration() { return "1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(WaterWalk, WaterWalk.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(WaterWalk, WaterWalk.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = WaterWalk.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            This spell grants the ability to move across any liquid surface – such as water, acid, mud, snow, quicksand, or lava – as if it were harmless solid ground (creatures crossing molten lava can still take damage from the heat). Up to ten willing creatures you can see within range gain this ability for the duration.
        </p>
        <p>
            If you target a creature submerged in a liquid, the spell carries the target to the surface of the liquid at a rate of 60 feet per round.
        </p>
    `;

}
