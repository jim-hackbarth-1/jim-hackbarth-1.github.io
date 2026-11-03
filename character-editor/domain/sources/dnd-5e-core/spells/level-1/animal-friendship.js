
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class AnimalFriendship {

    static get name() { return "animal-friendship"; }
    static get title() { return "Animal Friendship"; }
    static get level() { return 1; }
    static get school() { return "enchantment"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "druid", "ranger"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S, M (a morsel of food)"; }
    static get duration() { return "24 hours"; }
    static get html() { return DnD5ESource.getSpellHtml(AnimalFriendship, AnimalFriendship.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "wisdom" });
        tempFeatures.push(character.getSpellCard(AnimalFriendship, AnimalFriendship.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = AnimalFriendship.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            This spell lets you convince a beast that you mean it no harm. Choose a beast that you can see within range. It must see and hear you. If the beast’s Intelligence is 4 or higher, the spell fails. Otherwise, the beast must succeed on a Wisdom saving throw or be charmed by you for the spell’s duration. If you or one of your companions harms the target, the spell ends.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional beast for each slot level above 1st.
        </p>
    `;

}
