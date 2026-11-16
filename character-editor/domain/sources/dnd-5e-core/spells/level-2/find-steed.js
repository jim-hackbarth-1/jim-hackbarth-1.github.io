
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class FindSteed {

    static get name() { return "find-steed"; }
    static get title() { return "Find Steed"; }
    static get level() { return 2; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["paladin"]; }
    static get castingTime() { return "10 minutes"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(FindSteed, FindSteed.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(FindSteed, FindSteed.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = FindSteed.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You summon a spirit that assumes the form of an unusually intelligent, strong, and loyal steed, creating a long-lasting bond with it. Appearing in an unoccupied space within range, the steed takes on a form that you choose: a warhorse, a pony, a camel, an elk, or a mastiff. (Your DM might allow other animals to be summoned as steeds.) The steed has the statistics of the chosen form, though it is a celestial, fey, or fiend (your choice) instead of its normal type. Additionally, if your steed has an Intelligence of 5 or less, its Intelligence becomes 6, and it gains the ability to understand one language of your choice that you speak.
        </p>
        <p>
            Your steed serves you as a mount, both in combat and out, and you have an instinctive bond with it that allows you to fight as a seamless unit. While mounted on your steed, you can make any spell you cast that targets only you also target your steed.
        </p>
        <p>
            When the steed drops to 0 hit points, it disappears, leaving behind no physical form. You can also dismiss your steed at any time as an action, causing it to disappear. In either case, casting this spell again summons the same steed, restored to its hit point maximum.
        </p>
        <p>
            While your steed is within 1 mile of you, you can communicate with each other telepathically. You can’t have more than one steed bonded by this spell at a time. As an action, you can release the steed from its bond at any time, causing it to disappear.
        </p>
    `;

}
