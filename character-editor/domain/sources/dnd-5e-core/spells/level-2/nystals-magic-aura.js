
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class NystalsMagicAura {

    static get name() { return "nystals-magic-aura"; }
    static get title() { return "Nystal's Magic Aura"; }
    static get level() { return 2; }
    static get school() { return "illusion"; }
    static get isRitual() { return false; }
    static get classes() { return ["wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (a small square of silk)"; }
    static get duration() { return "24 hours"; }
    static get html() { return DnD5ESource.getSpellHtml(NystalsMagicAura, NystalsMagicAura.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(NystalsMagicAura, NystalsMagicAura.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = NystalsMagicAura.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You place an illusion on a creature or an object you touch so that divination spells reveal false information about it. The target can be a willing creature or an object that isn’t being carried or worn by another creature.
        </p>
        <p>
            When you cast the spell, choose one or both of the following effects. The effect lasts for the duration. If you cast this spell on the same creature or object every day for 30 days, placing the same effect on it each time, the illusion lasts until it is dispelled.
        </p>
        <p>
            <b>False Aura.</b> You change the way the target appears to spells and magical effects, such as Detect Magic, that detect magical auras. You can make a nonmagical object appear magical, a magical object appear nonmagical, or change the object’s magical aura so that it appears to belong to a specific school of magic that you choose. When you use this effect on an object, you can make the false magic apparent to any creature that handles the item.
        </p>
        <p>
            <b>Mask.</b> You change the way the target appears to spells and magical effects that detect creature types, such as a paladin’s Divine Sense or the trigger of a symbol spell. You choose a creature type and other spells and magical effects treat the target as if it were a creature of that type or of that alignment.
        </p>
    `;

}
