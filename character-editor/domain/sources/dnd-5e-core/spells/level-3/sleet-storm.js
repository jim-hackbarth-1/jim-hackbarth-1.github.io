
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class SleetStorm {

    static get name() { return "sleet-storm"; }
    static get title() { return "Sleet Storm"; }
    static get level() { return 3; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "150 feet"; }
    static get components() { return "V, S, M (a pinch of dust and a few drops of water)"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(SleetStorm, SleetStorm.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "dexterity" });
        tempFeatures.push(character.getSpellCard(SleetStorm, SleetStorm.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = SleetStorm.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Until the spell ends, freezing rain and sleet fall in a 20-foot-tall cylinder with a 40-foot radius centered on a point you choose within range. The area is heavily obscured, and exposed flames in the area are doused.
        </p>
        <p>
            The ground in the area is covered with slick ice, making it difficult terrain. When a creature enters the spell’s area for the first time on a turn or starts its turn there, it must make a Dexterity saving throw. On a failed save, it falls prone.
        </p>
        <p>
            If a creature starts its turn in the spell's area and is concentrating on a spell, the creature must make a successful Constitution saving throw against your spell save DC or lose concentration.
        </p>
    `;

}
