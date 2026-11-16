
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ProtectionFromPoison {

    static get name() { return "protection-from-poison"; }
    static get title() { return "Protection from Poison"; }
    static get level() { return 2; }
    static get school() { return "abjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric", "druid", "paladin", "ranger"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S"; }
    static get duration() { return "1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(ProtectionFromPoison, ProtectionFromPoison.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(ProtectionFromPoison, ProtectionFromPoison.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ProtectionFromPoison.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You touch a creature. If it is poisoned, you neutralize the poison. If more than one poison afflicts the target, you neutralize one poison that you know is present, or you neutralize one at random.
        </p>
        <p>
            For the duration, the target has advantage on saving throws against being poisoned, and it has resistance to poison damage.
        </p>
    `;

}
