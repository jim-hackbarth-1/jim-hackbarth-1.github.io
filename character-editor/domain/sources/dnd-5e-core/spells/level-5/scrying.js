
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Scrying {

    static get name() { return "scrying"; }
    static get title() { return "Scrying"; }
    static get level() { return 5; }
    static get school() { return "divination"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "cleric", "druid", "warlock", "wizard"]; }
    static get castingTime() { return "10 minutes"; }
    static get range() { return "Self"; }
    static get components() { return "V, S, M (a focus worth at least 1,000 gp, such as a crystal ball, a silver mirror, or a font filled with holy water)"; }
    static get duration() { return "Concentration, up to 10 minutes"; }
    static get html() { return DnD5ESource.getSpellHtml(Scrying, Scrying.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Scrying, Scrying.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Scrying.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You can see and hear a particular creature you choose that is on the same plane of existence as you. The target must make a Wisdom saving throw, which is modified by how well you know the target and the sort of physical connection you have to it. If a target knows you’re casting this spell, it can fail the saving throw voluntarily if it wants to be observed.
        </p>
        <p>
            <table>
            <tr>
                <td>Knowledge</td>
                <td>Save Modifier</td>
            </tr>
            <tr>
                <td>Secondhand (you have heard of the target)</td>
                <td>+5</td>
            </tr>
            <tr>
                <td>Firsthand (you have met the target)</td>
                <td>+0</td>
            </tr>
            <tr>
                <td>Familiar (you know the target well)</td>
                <td>-5</td>
            </tr>
            <tr>
                <td>Connection</td>
                <td>Save Modifier</td>
            </tr>
            <tr>
                <td>Likeness or picture</td>
                <td>-2</td>
            </tr>
            <tr>
                <td>Possession or garment</td>
                <td>-4</td>
            </tr>
            <tr>
                <td>Body part, lock of hair, bit of nail, or the like</td>
                <td>-10</td>
            </tr>
            </table>
            On a successful save, the target isn’t affected, and you can’t use this spell against it again for 24 hours.
        </p>
        <p>
            On a failed save, the spell creates an invisible sensor within 10 feet of the target. You can see and hear through the sensor as if you were there. The sensor moves with the target, remaining within 10 feet of it for the duration. A creature that can see invisible objects sees the sensor as a luminous orb about the size of your fist.
        </p>
        <p>
            Instead of targeting a creature, you can choose a location you have seen before as the target of this spell. When you do, the sensor appears at that location and doesn’t move.
        </p>
    `;

}
