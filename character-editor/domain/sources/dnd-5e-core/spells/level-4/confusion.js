
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Confusion {

    static get name() { return "confusion"; }
    static get title() { return "Confusion"; }
    static get level() { return 4; }
    static get school() { return "enchantment"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "druid", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "90 feet"; }
    static get components() { return "V, S, M (three nut shells)"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(Confusion, Confusion.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "wisdom" });
        tempFeatures.push(character.getSpellCard(Confusion, Confusion.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Confusion.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            This spell assaults and twists creatures’ minds, spawning delusions and provoking uncontrolled actions. Each creature in a 10-foot-radius sphere centered on a point you choose within range must succeed on a Wisdom saving throw when you cast this spell or be affected by it.
        </p>
        <p>
            An affected target can’t take reactions and must roll a d10 at the start of each of its turns to determine its behavior for that turn.
        </p>
        <p>
            <table>
                <tr>
                    <td>d10</td>
                    <td>Behavior</td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>The creature uses all its movement to move in a random direction. To determine the direction, roll a d8 and assign a direction to each die face. The creature doesn’t take an action this turn.</td>
                </tr>
                <tr>
                    <td>2-6</td>
                    <td>The creature doesn’t move or take actions this turn.</td>
                </tr>
                <tr>
                    <td>7-8</td>
                    <td>The creature uses its action to make a melee attack against a randomly determined creature within its reach. If there is no creature within its reach, the creature does nothing this turn.</td>
                </tr>
                <tr>
                    <td>9-10</td>
                    <td>The creature can act and move normally.</td>
                </tr>
            </table>
            At the end of its turns, an affected target can make a Wisdom saving throw. If it succeeds, this effect ends for that target.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 5th level or higher, the radius of the sphere increases by 5 feet for each slot level above 4th.
        </p>
    `;

}
