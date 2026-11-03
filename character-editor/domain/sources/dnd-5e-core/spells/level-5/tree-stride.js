
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class TreeStride {

    static get name() { return "tree-stride"; }
    static get title() { return "Tree Stride"; }
    static get level() { return 5; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid", "ranger"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self"; }
    static get components() { return "V, S"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(TreeStride, TreeStride.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(TreeStride, TreeStride.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = TreeStride.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You gain the ability to enter a tree and move from inside it to inside another tree of the same kind within 500 feet.
        </p>
        <p>
            Both trees must be living and at least the same size as you. You must use 5 feet of movement to enter a tree. You instantly know the location of all other trees of the same kind within 500 feet and, as part of the move used to enter the tree, can either pass into one of those trees or step out of the tree you’re in. You appear in a spot of your choice within 5 feet of the destination tree, using another 5 feet of movement. If you have no movement left, you appear within 5 feet of the tree you entered.
        </p>
        <p>
            You can use this transportation ability once per round for the duration. You must end each turn outside a tree.
        </p>
    `;

}
