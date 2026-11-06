
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Alarm {

    static get name() { return "alarm"; }
    static get title() { return "Alarm"; }
    static get level() { return 1; }
    static get school() { return "abjuration"; }
    static get isRitual() { return true; }
    static get classes() { return ["ranger", "wizard"]; }
    static get castingTime() { return "1 minute"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S, M (a tiny bell and a piece of fine silver wire)"; }
    static get duration() { return "8 hours"; }
    static get html() { return DnD5ESource.getSpellHtml(Alarm, Alarm.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Alarm, Alarm.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Alarm.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You set an alarm against unwanted intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot cube. Until the spell ends, an alarm alerts you whenever a tiny or larger creature touches or enters the warded area. When you cast the spell, you can designate creatures that won’t set off the alarm. You also choose whether the alarm is mental or audible.
        </p>
        <p>
            A mental alarm alerts you with a ping in your mind if you are within 1 mile of the warded area. This ping awakens you if you are sleeping. An audible alarm produces the sound of a hand bell for 10 seconds within 60 feet.
        </p>
    `;

}
