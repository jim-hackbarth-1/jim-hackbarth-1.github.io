
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class FaerieFire {

    static get name() { return "faerie-fire"; }
    static get title() { return "Faerie Fire"; }
    static get level() { return 1; } 
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "druid"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(FaerieFire, FaerieFire.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "dexterity" });
        tempFeatures.push(character.getSpellCard(FaerieFire, FaerieFire.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = FaerieFire.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Each object in a 20-foot cube within range is outlined in blue, green, or violet light (your choice).
        </p>
        <p>
            Any creature in the area when the spell is cast is also outlined in light if it fails a Dexterity saving throw. For the duration, objects and affected creatures shed dim light in a 10-foot radius.
        </p>
        <p>
            Any attack roll against an affected creature or object has advantage if the attacker can see it, and the affected creature or object can’t benefit from being invisible.
        </p>
    `;

}
