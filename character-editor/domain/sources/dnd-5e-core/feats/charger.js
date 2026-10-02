
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class Charger {

    static get name() {
        return "charger";
    }

    static get title() {
        return "Charger";
    }

    static get html() {
        return `
        <div class="dnd-5e-content">
            <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
            <h3>Charger</h3>
            <hr/>
            <div class="content">
                <p>When you use your action to Dash, you can use a bonus action to make one melee weapon attack or to shove a creature. If you move at least 10 feet in a straight line immediately before taking this bonus action, you either gain a +5 bonus to the attack’s damage roll (if you chose to make a melee attack and hit) or push the target up to 10 feet away from you (if you chose to shove and you succeed).</p>
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
        const features = [];
        features.push({
            name: "charger",
            title: "Charger",
            displayStyle: "card",
            html: "<p>When you use your action to Dash, you can use a bonus action to make one melee weapon attack or to shove a creature. If you move at least 10 feet in a straight line immediately before taking this bonus action, you either gain a +5 bonus to the attack’s damage roll (if you chose to make a melee attack and hit) or push the target up to 10 feet away from you (if you chose to shove and you succeed).</p>"
        });
        for (const feature of features) {
            feature.sourcePropertyName = "feat";
            feature.sourcePropertyValue = "charger";
            character.addFeature(feature);
        }
    }

}
