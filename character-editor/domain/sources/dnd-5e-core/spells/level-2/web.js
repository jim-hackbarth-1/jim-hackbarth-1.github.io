
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Web {

    static get name() { return "web"; }
    static get title() { return "Web"; }
    static get level() { return 2; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V, S, M (a bit of spiderweb)"; }
    static get duration() { return "Concentration, up to 1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(Web, Web.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "dexterity" });
        tempFeatures.push(character.getSpellCard(Web, Web.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Web.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You conjure a mass of thick, sticky webbing at a point of your choice within range. The webs fill a 20-foot cube from that point for the duration. The webs are difficult terrain and lightly obscure their area.
        </p>
        <p>
            If the webs aren’t anchored between two solid masses (such as walls or trees) or layered across a floor, wall, or ceiling, the conjured web collapses on itself, and the spell ends at the start of your next turn. Webs layered over a flat surface have a depth of 5 feet.
        </p>
        <p>
            Each creature that starts its turn in the webs or that enters them during its turn must make a Dexterity saving throw. On a failed save, the creature is restrained as long as it remains in the webs or until it breaks free.
        </p>
        <p>
            A creature restrained by the webs can use its action to make a Strength check against your spell save DC. If it succeeds, it is no longer restrained.
        </p>
        <p>
            The webs are flammable. Any 5-foot cube of webs exposed to fire burns away in 1 round, dealing 2d4 fire damage to any creature that starts its turn in the fire.
        </p>
    `;

}
