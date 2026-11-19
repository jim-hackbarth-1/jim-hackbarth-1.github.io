
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class MagicCircle {

    static get name() { return "magic-circle"; }
    static get title() { return "Magic Circle"; }
    static get level() { return 3; }
    static get school() { return "abjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric", "paladin", "warlock", "wizard"]; }
    static get castingTime() { return "1 minute"; }
    static get range() { return "10 feet"; }
    static get components() { return "V, S, M (holy water or powdered silver and iron worth at least 100 gp, which the spell consumes)"; }
    static get duration() { return "1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(MagicCircle, MagicCircle.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "charisma" });
        tempFeatures.push(character.getSpellCard(MagicCircle, MagicCircle.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = MagicCircle.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You create a 10-foot-radius, 20-foot-tall cylinder of magical energy centered on a point on the ground that you can see within range. Glowing runes appear wherever the cylinder intersects with the floor or other surface.
        </p>
        <p>
            Choose one or more of the following types of creatures: celestials, elementals, fey, fiends, or undead. The circle affects a creature of the chosen type in the following ways:
            <ul>
                <li>The creature can’t willingly enter the cylinder by nonmagical means. If the creature tries to use teleportation or interplanar travel to do so, it must first succeed on a Charisma saving throw.</li>
                <li>The creature has disadvantage on attack rolls against targets within the cylinder.</li>
                <li>Targets within the cylinder can’t be charmed, frightened, or possessed by the creature.</li>
                <li>When you cast this spell, you can elect to cause its magic to operate in the reverse direction, preventing a creature of the specified type from leaving the cylinder and protecting targets outside it.</li>
            </ul>
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the duration increases by 1 hour for each slot level above 3rd.
        </p>
    `;

}
