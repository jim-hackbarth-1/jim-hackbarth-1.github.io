
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class FindTraps {

    static get name() { return "find-traps"; }
    static get title() { return "Find Traps"; }
    static get level() { return 2; }
    static get school() { return "divination"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric", "druid", "ranger"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "120 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(FindTraps, FindTraps.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(FindTraps, FindTraps.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = FindTraps.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You sense the presence of any trap within range that is within line of sight.
        </p>
        <p>
            A trap, for the purpose of this spell, includes anything that would inflict a sudden or unexpected effect you consider harmful or undesirable, which was specifically intended as such by its creator. Thus, the spell would sense an area affected by the alarm spell, a glyph of warding, or a mechanical pit trap, but it would not reveal a natural weakness in the floor, an unstable ceiling, or a hidden sinkhole.
        </p>
        <p>
            This spell merely reveals that a trap is present. You don’t learn the location of each trap, but you do learn the general nature of the danger posed by a trap you sense.
        </p>
    `;

}
