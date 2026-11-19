
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ConjureAnimals {

    static get name() { return "conjure-animals"; }
    static get title() { return "Conjure Animals"; }
    static get level() { return 3; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid", "ranger"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Concentration, up to 1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(ConjureAnimals, ConjureAnimals.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(ConjureAnimals, ConjureAnimals.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ConjureAnimals.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You summon fey spirits that take the form of beasts and appear in unoccupied spaces that you can see within range.
        </p>
        <p>
            Choose one of the following options for what appears:
            <ul>
                <li>One beast of challenge rating 2 or lower</li>
                <li>Two beasts of challenge rating 1 or lower</li>
                <li>Four beasts of challenge rating 1/2 or lower</li>
                <li>Eight beasts of challenge rating 1/4 or lower</li>
            </ul>
            Each beast is also considered fey, and it disappears when it drops to 0 hit points or when the spell ends.
        </p>
        <p>
            The summoned creatures are friendly to you and your companions. Roll initiative for the summoned creatures as a group, which has its own turns. They obey any verbal commands that you issue to them (no action required by you). If you don’t issue any commands to them, they defend themselves from hostile creatures, but otherwise take no actions. The DM has the creatures’ statistics.
        </p>
        <p>
            At Higher Levels. When you cast this spell using certain higher-level spell slots, you choose one of the summoning options above, and more creatures appear: twice as many with a 5th-level slot, three times as many with a 7th-level slot, and four times as many with a 9th-level slot.
        </p>
    `;

}
