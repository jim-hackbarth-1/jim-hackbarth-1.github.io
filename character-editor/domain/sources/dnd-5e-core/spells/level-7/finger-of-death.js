
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class FingerOfDeath {

    static get name() { return "finger-of-death"; }
    static get title() { return "Finger of Death"; }
    static get level() { return 7; }
    static get school() { return "necromancy"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(FingerOfDeath, FingerOfDeath.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({
            target: "dc", saveAbility: "constitution", damageDice: "7d8", damageType: "necrotic", notes: ["Half damage on save"]
        });
        tempFeatures.push(character.getSpellCard(FingerOfDeath, FingerOfDeath.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = FingerOfDeath.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You send negative energy coursing through a creature that you can see within range, causing it searing pain. The target must make a Constitution saving throw. It takes 7d8 + 30 necrotic damage on a failed save, or half as much damage on a successful one.
        </p>
        <p>
            A humanoid killed by this spell rises at the start of your next turn as a zombie that is permanently under your command, following your verbal orders to the best of its ability.
        </p>
    `;

}
