
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class FlameStrike {

    static get name() { return "flame-strike"; }
    static get title() { return "Flame Strike"; }
    static get level() { return 5; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V, S, M (pinch of sulfur)"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(FlameStrike, FlameStrike.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({
            target: "dc", saveAbility: "dexterity", damageDice: "4d6+4d6", damageType: "fire / radiant", notes: ["Half damage on save"] });
        tempFeatures.push(character.getSpellCard(FlameStrike, FlameStrike.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = FlameStrike.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A vertical column of divine fire roars down from the heavens in a location you specify. Each creature in a 10-foot radius, 40-foot-high cylinder centered on a point within range must make a Dexterity saving throw. A creature takes 4d6 fire damage and 4d6 radiant damage on a failed save, or half as much damage on a successful one.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 6th level or higher, the fire damage or the radiant damage (your choice) increases by 1d6 for each slot level above 5th.
        </p>
    `;

}
