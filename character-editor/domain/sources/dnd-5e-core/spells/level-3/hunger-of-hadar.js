
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class HungerOfHadar {

    static get name() { return "hunger-of-hadar"; }
    static get title() { return "Hunger of Hadar"; }
    static get level() { return 3; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["warlock"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "150 feet"; }
    static get components() { return "V, S, M (a pickled octopus tentacle)"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(HungerOfHadar, HungerOfHadar.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo(
            { target: "dc", saveAbility: "dexterity", damageDice: "2d6", damageType: "acid" });
        tempFeatures.push(character.getSpellCard(HungerOfHadar, HungerOfHadar.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = HungerOfHadar.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You open a gateway to the dark between the stars, a region infested with unknown horrors. A 20-foot-radius sphere of blackness and bitter cold appears, centered on a point within range and lasting for the duration. This void is filled with a cacophony of soft whispers and slurping noises that can be heard up to 30 feet away. No light, magical or otherwise, can illuminate the area, and creatures fully within the area are blinded.
        </p>
        <p>
            The void creates a warp in the fabric of space, and the area is difficult terrain. Any creature that starts its turn in the area takes 2d6 cold damage. Any creature that ends its turn in the area must succeed on a Dexterity saving throw or take 2d6 acid damage as milky, otherworldly tentacles rub against it.
        </p>
    `;

}
