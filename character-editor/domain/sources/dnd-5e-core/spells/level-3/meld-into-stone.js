
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class MeldIntoStone {

    static get name() { return "meld-into-stone"; }
    static get title() { return "Meld into Stone"; }
    static get level() { return 3; }
    static get school() { return "transmutation"; }
    static get isRitual() { return true; }
    static get classes() { return ["cleric", "druid"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S"; }
    static get duration() { return "8 hours"; }
    static get html() { return DnD5ESource.getSpellHtml(MeldIntoStone, MeldIntoStone.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(MeldIntoStone, MeldIntoStone.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = MeldIntoStone.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You step into a stone object or surface large enough to fully contain your body, melding yourself and all the equipment you carry with the stone for the duration. Using your movement, you step into the stone at a point you can touch. Nothing of your presence remains visible or otherwise detectable by nonmagical senses.
        </p>
        <p>
            While merged with the stone, you can’t see what occurs outside it, and any Wisdom (Perception) checks you make to hear sounds outside it are made with disadvantage. You remain aware of the passage of time and can cast spells on yourself while merged in the stone. You can use your movement to leave the stone where you entered it, which ends the spell. You otherwise can’t move.
        </p>
        <p>
            Minor physical damage to the stone doesn’t harm you, but its partial destruction or a change in its shape (to the extent that you no longer fit within it) expels you and deals 6d6 bludgeoning damage to you. The stone’s complete destruction (or transmutation into a different substance) expels you and deals 50 bludgeoning damage to you. If expelled, you fall prone in an unoccupied space closest to where you first entered.
        </p>
    `;

}
