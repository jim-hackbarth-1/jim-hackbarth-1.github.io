
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Hex {

    static get name() { return "hex"; }
    static get title() { return "Hex"; }
    static get level() { return 1; }
    static get school() { return "enchantment"; }
    static get isRitual() { return false; }
    static get classes() { return ["warlock"]; }
    static get castingTime() { return "1 bonus action"; }
    static get range() { return "90 feet"; }
    static get components() { return "V, S, M (the petrified eye of a newt)"; }
    static get duration() { return "Concentration, up to 1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(Hex, Hex.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Hex, Hex.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Hex.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You place a curse on a creature that you can see within range. Until the spell ends, you deal an extra 1d6 necrotic damage to the target whenever you hit it with an attack. Also, choose one ability when you cast the spell. The target has disadvantage on ability checks made with the chosen ability.
        </p>
        <p>
            If the target drops to 0 hit points before this spell ends, you can use a bonus action on a subsequent turn of yours to curse a new creature.
        </p>
        <p>
            A Remove Curse cast on the target ends this spell early.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 3rd or 4th level, you can maintain your concentration on the spell for up to 8 hours. When you use a spell slot of 5th level or higher, you can maintain your concentration on the spell for up to 24 hours.
        </p>
    `;

}
