
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class AnimalMessenger {

    static get name() { return "animal-messenger"; }
    static get title() { return "Animal Messenger"; }
    static get level() { return 2; }
    static get school() { return "enchantment"; }
    static get isRitual() { return true; }
    static get classes() { return ["bard", "druid", "ranger"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S, M (a morsel of food)"; }
    static get duration() { return "24 hours"; }
    static get html() { return DnD5ESource.getSpellHtml(AnimalMessenger, AnimalMessenger.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(AnimalMessenger, AnimalMessenger.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = AnimalMessenger.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            By means of this spell, you use an animal to deliver a message. Choose a Tiny beast you can see within range, such as a squirrel, a blue jay, or a bat. You specify a location, which you must have visited, and a recipient who matches a general description, such as “a man or woman dressed in the uniform of the town guard” or “a red-haired dwarf wearing a pointed hat.” You also speak a message of up to twenty-five words. The target beast travels for the duration of the spell toward the specified location, covering about 50 miles per 24 hours for a flying messenger, or 25 miles for other animals.
        </p>
        <p>
            When the messenger arrives, it delivers your message to the creature that you described, replicating the sound of your voice. The messenger speaks only to a creature matching the description you gave. If the messenger doesn’t reach its destination before the spell ends, the message is lost, and the beast makes its way back to where you cast this spell.
        </p>
        <p>
            At Higher Levels. If you cast this spell using a spell slot of 3rd level or higher, the duration of the spell increases by 48 hours for each slot level above 2nd.
        </p>
    `;

}
