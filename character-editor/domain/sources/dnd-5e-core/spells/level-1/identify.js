
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Identify {

    static get name() { return "identify"; }
    static get title() { return "Identify"; }
    static get level() { return 1; }
    static get school() { return "divination" }
    static get isRitual() { return true; }
    static get classes() { return ["bard", "wizard"]; }
    static get castingTime() { return "1 minute" }
    static get range() { return "Touch" }
    static get components() { return "V, S, M (a pearl worth at least 100 gp and an owl feather)" }
    static get duration() { return "Instantaneous" }
    static get html() { return DnD5ESource.getSpellHtml(Identify, Identify.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Identify, Identify.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Identify.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You choose one object that you must touch throughout the casting of the spell. If it is a magic item or some other magic-imbued object, you learn its properties and how to use them, whether it requires attunement to use, and how many charges it has, if any. You learn whether any spells are affecting the item and what they are. If the item was created by a spell, you learn which spell created it.
        </p>
        <p>
            If you instead touch a creature throughout the casting, you learn what spells, if any, are currently affecting it.
        </p>
    `;

}

