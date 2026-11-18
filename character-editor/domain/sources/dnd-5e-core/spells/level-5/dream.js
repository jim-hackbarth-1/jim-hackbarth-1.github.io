
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Dream {

    static get name() { return "dream"; }
    static get title() { return "Dream"; }
    static get level() { return 5; }
    static get school() { return "illusion"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "warlock", "wizard"]; }
    static get castingTime() { return "1 minute"; }
    static get range() { return "Special"; }
    static get components() { return "V, S, M (a handful of sand, a dab of ink, and a writing quill plucked from a sleeping bird)"; }
    static get duration() { return "8 hours"; }
    static get html() { return DnD5ESource.getSpellHtml(Dream, Dream.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "wisdom" });
        tempFeatures.push(character.getSpellCard(Dream, Dream.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Dream.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            This spell shapes a creature’s dreams. Choose a creature known to you as the target of this spell. The target must be on the same plane of existence as you. Creatures that don’t sleep, such as elves, can’t be contacted by this spell. You, or a willing creature you touch, enters a trance state, acting as a messenger. While in the trance, the messenger is aware of their surroundings, but can’t take actions or move.
        </p>
        <p>
            If the target is asleep, the messenger appears in the target’s dreams and can converse with the target as long as it remains asleep, through the duration of the spell. The messenger can also shape the environment of the dream, creating landscapes, objects, and other images. The messenger can emerge from the trance at any time, ending the effect of the spell early. The target recalls the dream perfectly upon waking. If the target is awake when you cast the spell, the messenger knows it, and can either end the trance (and the spell) or wait for the target to fall asleep, at which point the messenger appears in the target’s dreams.
        </p>
        <p>
            You can make the messenger appear monstrous and terrifying to the target. If you do, the messenger can deliver a message of no more than ten words and then the target must make a Wisdom saving throw. On a failed save, echoes of the phantasmal monstrosity spawn a nightmare that lasts the duration of the target’s sleep and prevents the target from gaining any benefit from that rest. In addition, when the target wakes up, it takes 3d6 psychic damage.
        </p>
        <p>
            If you have a body part, lock of hair, clipping from a nail, or similar portion of the target’s body, the target makes its saving throw with disadvantage.
        </p>
    `;

}
