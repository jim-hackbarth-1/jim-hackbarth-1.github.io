
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Augury {

    static get name() { return "augury"; }
    static get title() { return "Augury"; }
    static get level() { return 2; }
    static get school() { return "divination"; }
    static get isRitual() { return true; }
    static get classes() { return ["cleric"]; }
    static get castingTime() { return "1 minute"; }
    static get range() { return "Self"; }
    static get components() { return "V, S, M (specially marked sticks, bones, or similar tokens worth at least 25 gp)"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(Augury, Augury.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Augury, Augury.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Augury.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            By casting gem-inlaid sticks, rolling dragon bones, laying out ornate cards, or employing some other divining tool, you receive an omen from an otherworldly entity about the results of a specific course of action that you plan to take within the next 30 minutes. The DM chooses from the following possible omens:
        </p>
        <ul>
            <li>Weal, for good results</li>
            <li>Woe, for bad results</li>
            <li>Weal and woe, for both good and bad results</li>
            <li>Nothing, for results that aren’t especially good or bad</li>
        </ul>
        <p>
            The spell doesn’t take into account any possible circumstances that might change the outcome, such as the casting of additional spells or the loss or gain of a companion. If you cast the spell two or more times before completing your next long rest, there is a cumulative 25 percent chance for each casting after the first that you get a random reading. The DM makes this roll in secret.
        </p>
    `;

}

