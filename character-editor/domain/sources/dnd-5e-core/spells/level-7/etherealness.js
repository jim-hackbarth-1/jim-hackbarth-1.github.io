
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Etherealness {

    static get name() { return "etherealness"; }
    static get title() { return "Etherealness"; }
    static get level() { return 7; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "cleric", "sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self"; }
    static get components() { return "V, S"; }
    static get duration() { return "Up to 8 hours"; }
    static get html() { return DnD5ESource.getSpellHtml(Etherealness, Etherealness.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Etherealness, Etherealness.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Etherealness.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You step into the border regions of the Ethereal Plane, in the area where it overlaps with your current plane. You remain in the Border Ethereal for the duration or until you use your action to dismiss the spell. During this time, you can move in any direction. If you move up or down, every foot of movement costs an extra foot. You can see and hear the plane you originated from, but everything there looks gray, and you can’t see anything more than 60 feet away.
        </p>
        <p>
            While on the Ethereal Plane, you can only affect and be affected by other creatures on that plane. Creatures that aren’t on the Ethereal Plane can’t perceive you and can’t interact with you, unless a special ability or magic has given them the ability to do so.
        </p>
        <p>
            You ignore all objects and effects that aren’t on the Ethereal Plane, allowing you to move through objects you perceive on the plane you originated from. When the spell ends, you immediately return to the plane you originated from in the spot you currently occupy. If you occupy the same spot as a solid object or creature when this happens, you are immediately shunted to the nearest unoccupied space that you can occupy and take force damage equal to twice the number of feet you are moved.
        </p>
        <p>
            This spell has no effect if you cast it while you are on the Ethereal Plane or a plane that doesn’t border it, such as one of the Outer Planes.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 8th level or higher, you can target up to three willing creatures (including you) for each slot level above 7th. The creatures must be within 10 feet of you when you cast the spell.
        </p>
    `;

}
