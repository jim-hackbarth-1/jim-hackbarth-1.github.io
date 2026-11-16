
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class EnhanceAbility {

    static get name() { return "enhance-ability"; }
    static get title() { return "Enhance Ability"; }
    static get level() { return 2; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "cleric", "druid", "sorcerer"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (fur or a feather from a beast)"; }
    static get duration() { return "Concentration, up to 1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(EnhanceAbility, EnhanceAbility.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(EnhanceAbility, EnhanceAbility.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = EnhanceAbility.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You touch a creature and bestow upon it a magical enhancement. Choose one of the following effects; the target gains the effect until the spell ends.
        <ul>
            <li><b>Bear’s Endurance.</b> The target has advantage on Constitution checks. It also gains 2d6 temporary hit points, which are lost when the spell ends.</li>
            <li><b>Bull’s Strength.</b> The target has advantage on Strength checks, and their carrying capacity doubles.</li>
            <li><b>Cat’s Grace.</b> The target has advantage on Dexterity checks. It also doesn’t take damage from falling 20 feet or less if it isn’t incapacitated.</li>
            <li><b>Eagle’s Splendor.</b> The target has advantage on Charisma checks.</li>
            <li><b>Fox’s Cunning.</b> The target has advantage on Intelligence checks.</li>
            <li><b>Owl’s Wisdom.</b> The target has advantage on Wisdom checks.</li>
        </ul>
        <p>
            At Higher Levels.</b> When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd.
        </p>
    `;

}
