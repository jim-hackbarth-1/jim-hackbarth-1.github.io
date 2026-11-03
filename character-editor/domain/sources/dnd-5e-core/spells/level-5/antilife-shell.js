
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class AntiLifeShell {

    static get name() { return "antilife-shell"; }
    static get title() { return "Antilife Shell"; }
    static get level() { return 5; }
    static get school() { return "abjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self (10-foot radius)"; }
    static get components() { return "V, S"; }
    static get duration() { return "Concentration, up to 1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(AntiLifeShell, AntiLifeShell.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(AntiLifeShell, AntiLifeShell.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = AntiLifeShell.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A shimmering barrier extends out from you in a 10-foot radius and moves with you, remaining centered on you and hedging out creatures other than undead and constructs.
        </p>
        <p>
            The barrier lasts for the duration. The barrier prevents an affected creature from passing or reaching through. An affected creature can cast spells or make attacks with ranged or reach weapons through the barrier.
        </p>
        <p>
            If you move so that an affected creature is forced to pass through the barrier, the spell ends.
        </p>
    `;

}
