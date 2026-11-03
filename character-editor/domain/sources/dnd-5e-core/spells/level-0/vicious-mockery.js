
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ViciousMockery {

    static get name() { return "vicious-mockery"; }
    static get title() { return "Vicious Mockery"; }
    static get level() { return 0; }
    static get school() { return "enchantment"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(ViciousMockery, ViciousMockery.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const level = Number(character.classes.find(c => c.value == "bard")?.level ?? 1);
        let damageDice = 1;
        if (level >= 5) {
            damageDice++;
        }
        if (level >= 11) {
            damageDice++;
        }
        if (level >= 17) {
            damageDice++;
        }
        const attackInfo = character.getAttackInfo(
            { target: "dc", saveAbility: "wisdom", damageDice: `${damageDice}d4`, damageType: "psychic" });
        const spellCard = character.getSpellCard(ViciousMockery, ViciousMockery.#content, characterSpellClasses, attackInfo);
        tempFeatures.push(spellCard);
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ViciousMockery.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You unleash a string of insults laced with subtle enchantments at a creature you can see within range. If the target can hear you (though it need not understand you), it must succeed on a Wisdom saving throw or take 1d4 psychic damage and have disadvantage on the next attack roll it makes before the end of its next turn.
        </p>
        <p>
            At Higher Levels. This spell’s damage increases by 1d4 when you reach 5th level (2d4), 11th level (3d4), and 17th level (4d4).
        </p>
    `;

}
