
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class SpiritualWeapon {

    static get name() { return "spiritual-weapon"; }
    static get title() { return "Spiritual Weapon"; }
    static get level() { return 2; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric"]; }
    static get castingTime() { return "1 bonus action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(SpiritualWeapon, SpiritualWeapon.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "to-hit", damageDice: "1d8", damageType: "force" });
        tempFeatures.push(character.getSpellCard(SpiritualWeapon, SpiritualWeapon.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = SpiritualWeapon.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You create a floating, spectral weapon within range that lasts for the duration or until you cast this spell again.
        </p>
        <p>
            When you cast the spell, you can make a melee spell attack against a creature within 5 feet of the weapon. On a hit, the target takes force damage equal to 1d8 + your spellcasting ability modifier.
        </p>
        <p>
            As a bonus action on your turn, you can move the weapon up to 20 feet and repeat the attack against a creature within 5 feet of it.
        </p>
        <p>
            The weapon can take whatever form you choose. Clerics of deities who are associated with a particular weapon (as St. Cuthbert is known for his mace and Thor for his hammer) make this spell’s effect resemble that weapon.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for every two slot levels above the 2nd.
        </p>
    `;

}
