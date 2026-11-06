
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class TensersFloatingDisk {

    static get name() { return "tensers-floating-disk"; }
    static get title() { return "Tenser's Floating Disk"; }
    static get level() { return 1; }
    static get school() { return "conjuration"; }
    static get isRitual() { return true; }
    static get classes() { return ["wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S, M (a drop of mercury)"; }
    static get duration() { return "1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(TensersFloatingDisk, TensersFloatingDisk.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(TensersFloatingDisk, TensersFloatingDisk.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = TensersFloatingDisk.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            This spell creates a circular, horizontal plane of force, 3 feet in diameter and 1 inch thick, that floats 3 feet above the ground in an unoccupied space of your choice that you can see within range. The disk remains for the duration, and can hold up to 500 pounds. If more weight is placed on it, the spell ends, and everything on the disk falls to the ground.
        </p>
        <p>
            The disk is immobile while you are within 20 feet of it. If you move more than 20 feet away from it, the disk follows you so that it remains within 20 feet of you. It can move across uneven terrain, up or down stairs, slopes, and the like, but it can’t cross an elevation change of 10 feet or more. For example, the disk can’t move across a 10-foot-deep pit, nor could it leave such a pit if it were created at the bottom.
        </p>
        <p>
            If you move more than 100 feet from the disk (typically because it can’t move around an obstacle to follow you), the spell ends.
        </p>
    `;

}
