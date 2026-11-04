
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Shillelagh {

    static get name() { return "shillelagh"; }
    static get title() { return "Shillelagh"; }
    static get level() { return 0; }
    static get school() { return "transmutation" }
    static get isRitual() { return false; }
    static get classes() { return ["druid"]; }
    static get castingTime() { return "1 bonus action" }
    static get range() { return "Touch" }
    static get components() { return "V, S, M (mistletoe, a shamrock leaf, and a club or quarterstaff)" }
    static get duration() { return "1 minute" }
    static get html() { return DnD5ESource.getSpellHtml(Shillelagh, Shillelagh.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Shillelagh, Shillelagh.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Shillelagh.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            The wood of a club or quarterstaff you are holding is imbued with nature’s power. For the duration, you can use your spellcasting ability instead of Strength for the attack and damage rolls of melee attacks using that weapon, and the weapon’s damage die becomes a d8. The weapon also becomes magical, if it isn’t already. The spell ends if you cast it again or if you let go of the weapon.
        </p>
    `;

}
