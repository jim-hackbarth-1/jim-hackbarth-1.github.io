
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class FireShield {

    static get name() { return "fire-shield"; }
    static get title() { return "Fire Shield"; }
    static get level() { return 4; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self"; }
    static get components() { return "V, S, M (a bit of phosphorus or a firefly)"; }
    static get duration() { return "10 minutes"; }
    static get html() { return DnD5ESource.getSpellHtml(FireShield, FireShield.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(FireShield, FireShield.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = FireShield.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Thin and wispy flames wreathe your body for the duration, shedding bright light in a 10-foot radius and dim light for an additional 10 feet. You can end the spell early by using an action to dismiss it.
        </p>
        <p>
            The flames provide you with a warm shield or a chill shield, as you choose. The warm shield grants you resistance to cold damage, and the chill shield grants you resistance to fire damage.
        </p>
        <p>
            In addition, whenever a creature within 5 feet of you hits you with a melee attack, the shield erupts with flame. The attacker takes 2d8 fire damage from a warm shield, or 2d8 cold damage from a cold shield.
        </p>
    `;

}
