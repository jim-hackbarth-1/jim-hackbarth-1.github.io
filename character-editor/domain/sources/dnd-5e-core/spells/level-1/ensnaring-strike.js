
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class EnsnaringStrike {

    static get name() { return "ensnaring-strike"; }
    static get title() { return "Ensnaring Strike"; }
    static get level() { return 1; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["ranger"]; }
    static get castingTime() { return "1 bonus action"; }
    static get range() { return "Self"; }
    static get components() { return "V"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(EnsnaringStrike, EnsnaringStrike.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];

        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "strength" });
        tempFeatures.push(character.getSpellCard(EnsnaringStrike, EnsnaringStrike.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = EnsnaringStrike.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            The next time you hit a creature with a weapon attack before this spell ends, a writhing mass of thorny vines appears at the point of impact, and the target must succeed on a Strength saving throw or be restrained by the magical vines until the spell ends. A Large or larger creature has advantage on this saving throw. If the target succeeds on the save, the vines shrivel away.
        </p>
        <p>
            While restrained by this spell, the target takes 1d6 piercing damage at the start of each of its turns. A creature restrained by the vines or one that can touch the creature can use its action to make a Strength check against your spell save DC. On a success, the target is freed.
        </p>
        <p>
            At Higher Levels. If you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.
        </p>
    `;

}
