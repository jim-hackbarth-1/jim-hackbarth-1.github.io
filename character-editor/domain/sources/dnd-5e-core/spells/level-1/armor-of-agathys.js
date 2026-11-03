
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ArmorOfAgathys {

    static get name() { return "armor-of-agathys"; }
    static get title() { return "Armor of Agathys"; }
    static get level() { return 1; }
    static get school() { return "abjuration" }
    static get isRitual() { return false; }
    static get classes() { return ["warlock"]; }
    static get castingTime() { return "1 action" }
    static get range() { return "Self" }
    static get components() { return "V, S, M (a cup of water)" }
    static get duration() { return "1 hour" }
    static get html() { return DnD5ESource.getSpellHtml(ArmorOfAgathys, ArmorOfAgathys.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(ArmorOfAgathys, ArmorOfAgathys.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ArmorOfAgathys.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A protective magical force surrounds you, manifesting as a spectral frost that covers you and your gear. You gain 5 temporary hit points for the duration. If a creature hits you with a melee attack while you have these hit points, the creature takes 5 cold damage.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, both the temporary hit points and the cold damage increase by 5 for each slot.
        </p>
    `;

}

