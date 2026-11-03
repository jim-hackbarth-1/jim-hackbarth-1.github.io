
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class DestructiveWave {

    static get name() { return "destructive-wave"; }
    static get title() { return "Destructive Wave"; }
    static get level() { return 5; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["paladin"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self (30-foot radius)"; }
    static get components() { return "V"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(DestructiveWave, DestructiveWave.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({
            target: "dc",
            saveAbility: "constitution",
            damageDice: "5d6+5d6",
            damageType: "thunder / radiant or necrotic",
            notes: ["Half damage on save"]
        });
        tempFeatures.push(character.getSpellCard(DestructiveWave, DestructiveWave.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = DestructiveWave.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You strike the ground, creating a burst of divine energy that ripples outward from you. Each creature you choose within 30 feet of you must succeed on a Constitution saving throw or take 5d6 thunder damage, as well as 5d6 radiant or necrotic damage (your choice), and be knocked prone. A creature that succeeds on its saving throw takes half as much damage and isn’t knocked prone.
        </p>
    `;

}
