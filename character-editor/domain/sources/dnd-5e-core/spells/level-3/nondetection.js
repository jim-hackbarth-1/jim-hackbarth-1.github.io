
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class NonDetection {

    static get name() { return "non-detection"; }
    static get title() { return "NonDetection"; }
    static get level() { return 3; }
    static get school() { return "abjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "ranger", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (a pinch of diamond dust worth 25 gp sprinkled over the target, which the spell consumes)"; }
    static get duration() { return "8 hours"; }
    static get html() { return DnD5ESource.getSpellHtml(NonDetection, NonDetection.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(NonDetection, NonDetection.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = NonDetection.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            For the duration, you hide a target that you touch from divination magic. The target can be a willing creature or a place or an object no larger than 10 feet in any dimension. The target can’t be targeted by any divination magic or perceived through magical scrying sensors.
        </p>
    `;

}
