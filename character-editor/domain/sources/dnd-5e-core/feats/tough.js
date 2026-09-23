
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class Tough {

    static get name() {
        return "tough";
    }

    static get title() {
        return "Tough";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Tough</h3>
            <hr/>
            <div class="content">
                <p>Your hit point maximum increases by an amount equal to twice your level when you gain this feat. Whenever you gain a level thereafter, your hit point maximum increases by an additional 2 hit points.</p>
            </div>
        </div>
        `;
    }

    static get canBeTakenMultipleTimes() {
        return false;
    }

    static checkPrerequisites(character) {
        return { prerequisitesMet: true, text: null };
    }

    static getOptions(character, classIndex, level) {
        return [];
    }

    static updateFeatures(character) {
        const features = [{
            name: "tough-hit-point-modifier",
            title: Tough.title,
            modifier: "hit-points",
            modifierValue: Number(character.level) * 2
        }];
        for (const feature of features) {
            feature.sourcePropertyName = "feat";
            feature.sourcePropertyValue = "tough";
            character.addFeature(feature);
        }
    }

}
