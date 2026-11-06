
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ProtectionFromEvilAndGood {

    static get name() { return "protection-from-evil-and-good"; }
    static get title() { return "Protection from Evil and Good"; }
    static get level() { return 1; }
    static get school() { return "abjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric", "paladin", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (holy water or powdered silver and iron, which the spell consumes)"; }
    static get duration() { return "Concentration, up to 10 minutes"; }
    static get html() { return DnD5ESource.getSpellHtml(ProtectionFromEvilAndGood, ProtectionFromEvilAndGood.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(ProtectionFromEvilAndGood, ProtectionFromEvilAndGood.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ProtectionFromEvilAndGood.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Until the spell ends, one willing creature you touch is protected against certain types of creatures: aberrations, celestials, elementals, fey, fiends, and undead.
        </p>
        <p>
            The protection grants several benefits. Creatures of those types have disadvantage on attack rolls against the target. The target also can't be charmed, frightened, or possessed by them. If the target is already charmed, frightened, or possessed by such a creature, the target has advantage on any new saving throw against the relevant effect.
        </p>
    `;

}
