
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class BlindnessDeafness {

    static get name() { return "blindness-deafness"; }
    static get title() { return "Blindness/Deafness"; }
    static get level() { return 2; }
    static get school() { return "necromancy"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "cleric", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "30 feet"; }
    static get components() { return "V"; }
    static get duration() { return "1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(BlindnessDeafness, BlindnessDeafness.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "constitution" });
        tempFeatures.push(character.getSpellCard(BlindnessDeafness, BlindnessDeafness.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = BlindnessDeafness.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You can blind or deafen a foe. Choose one creature that you can see within range to make a Constitution saving throw. If it fails, the target is either blinded or deafened (your choice) for the duration. At the end of each of its turns, the target can make a Constitution saving throw. On a success, the spell ends.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd.
        </p>
    `;

}
