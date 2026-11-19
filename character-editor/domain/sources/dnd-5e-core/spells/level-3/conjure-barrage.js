
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ConjureBarrage {

    static get name() { return "conjure-barrage"; }
    static get title() { return "Conjure Barrage"; }
    static get level() { return 3; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["ranger"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self (60-foot cone)"; }
    static get components() { return "V, S, M (one piece of ammunition or a thrown weapon)"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(ConjureBarrage, ConjureBarrage.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo(
            { target: "dc", saveAbility: "dexterity", damageDice: "3d8", damageType: "(same as ammunition)", notes: ["Half damage on save"] });
        tempFeatures.push(character.getSpellCard(CallLightning, ConjureBarrage.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ConjureBarrage.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You throw a nonmagical weapon or fire a piece of nonmagical ammunition into the air to create a cone of identical weapons that shoot forward and then disappear. Each creature in a 60-foot cone must succeed on a Dexterity saving throw. A creature takes 3d8 damage on a failed save, or half as much damage on a successful one. The damage type is the same as that of the weapon or ammunition used as a component.
        </p>
    `;

}
