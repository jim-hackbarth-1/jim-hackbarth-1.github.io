
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Suggestion {

    static get name() { return "suggestion"; }
    static get title() { return "Suggestion"; }
    static get level() { return 2; }
    static get school() { return "enchantment"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, M (a snake’s tongue and either a bit of honeycomb or a drop of sweet oil)"; }
    static get duration() { return "Concentration, up to 8 hours"; }
    static get html() { return DnD5ESource.getSpellHtml(Suggestion, Suggestion.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "wisdom" });
        tempFeatures.push(character.getSpellCard(Suggestion, Suggestion.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Suggestion.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You suggest a course of activity (limited to a sentence or two) and magically influence a creature you can see within range that can hear and understand you. Creatures that can’t be charmed are immune to this effect. The suggestion must be worded in such a manner as to make the course of action sound reasonable. Asking the creature to stab itself, throw itself onto a spear, immolate itself, or do some other obviously harmful act ends the spell.
        </p>
        <p>
            The target must make a Wisdom saving throw. On a failed save, it purses the course of action you described to the best of its ability. The suggested course of action can continue for the entire duration. If the suggested activity can be completed in a shorter time, the spell ends when the subject finishes what it was asked to do.
        </p>
        <p>
            You can also specify conditions that will trigger a special activity during the duration. For example, you might suggest that a knight give her warhorse to the first beggar she meets. If the condition isn’t met before the spell expires, the activity isn’t performed.
        </p>
        <p>
            If you or any of your companions damage the target, the spell ends.
        </p>
    `;

}
