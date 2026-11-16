
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class AlterSelf {

    static get name() { return "alter-self"; }
    static get title() { return "Alter Self"; }
    static get level() { return 2; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self"; }
    static get components() { return "V, S"; }
    static get duration() { return "Concentration, up to 1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(AlterSelf, AlterSelf.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(AlterSelf, AlterSelf.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = AlterSelf.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You assume a different form. When you cast the spell, choose one of the following options, the effects of which last for the duration of the spell. While the spell lasts, you can end one option as an action to gain the benefits of a different one.
        </p>
        <ul>
            <li><b>Aquatic Adaptation.</b> You adapt your body to an aquatic environment, sprouting gills, and growing webbing between your fingers. You can breathe underwater and gain a swimming speed equal to your walking speed.</li>
            <li><b>Change Appearance.</b> You transform your appearance. You decide what you look like, including your height, weight, facial features, sound of your voice, hair length, coloration, and distinguishing characteristics, if any. You can make yourself appear as a member of another race, though none of your statistics change. You also don’t appear as a creature of a different size than you, and your basic shape stays the same; if you're bipedal, you can’t use this spell to become quadrupedal, for instance. At any time for the duration of the spell, you can use your action to change your appearance in this way again.</li>
            <li><b>Natural Weapons.</b> You grow claws, fangs, spines, horns, or a different natural weapon of your choice. Your unarmed strikes deal 1d6 bludgeoning, piercing, or slashing damage, as appropriate to the natural weapon you chose, and you are proficient with your unarmed strikes. Finally, the natural weapon is magic and you have a +1 bonus to the attack and damage rolls you make using it.</li>
        </ul>
    `;

}
