
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class CommuneWithNature {

    static get name() { return "commune-with-nature"; }
    static get title() { return "Commune with Nature"; }
    static get level() { return 5; }
    static get school() { return "divination"; }
    static get isRitual() { return true; }
    static get classes() { return ["druid", "ranger"]; }
    static get castingTime() { return "1 minute"; }
    static get range() { return "Self"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(CommuneWithNature, CommuneWithNature.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(CommuneWithNature, CommuneWithNature.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = CommuneWithNature.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You briefly become one with nature and gain knowledge of the surrounding territory. In the outdoors, the spell gives you knowledge of the land within 3 miles of you. In caves and other natural underground settings, the radius is limited to 300 feet. The spell doesn’t function where nature has been replaced by construction, such as in dungeons and towns.
        </p>
        <p>
            You instantly gain knowledge of up to three facts of your choice about any of the following subjects as they relate to the area:
            <ul>
                <li>terrain and bodies of water</li>
                <li>prevalent plants, minerals, animals, or peoples</li>
                <li>powerful celestials, fey, fiends, elementals, or undead</li>
                <li>influence from other planes of existence</li>
                <li>buildings</li>
            </ul>
        </p>
        <p>
            For example, you could determine the location of powerful undead in the area, the location of major sources of safe drinking water, and the location of any nearby towns.
        </p>
    `;

}
