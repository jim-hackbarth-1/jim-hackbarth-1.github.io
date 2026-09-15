
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class Athlete {

    static get name() {
        return "athlete";
    }

    static get title() {
        return "Athlete";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Athlete</h3>
            <hr/>
            <div class="content">
                <p>You have undergone extensive physical training to gain the following benefits:<p>
                <ul>
                    <li>Increase your Strength or Dexterity score by 1, to a maximum of 20.</li>
                    <li>When you are prone, standing up uses only 5 feet of your movement.</li>
                    <li>Climbing doesn't cost you extra movement.</li>
                    <li>You can make a running long jump or a running high jump after moving only 5 feet on foot, rather than 10 feet.</li>
                </ul>
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
        const optionName = "athlete-ability-score-increase";
        const optionValues = [
            { value: null, text: "Choose Strength or Dexterity ..." },
            { value: "strength", text: "Strength" },
            { value: "dexterity", text: "Dexterity" }
        ];
        let abilityScoreIncrease = null;
        const sourcePropertyName = `feat:class-${classIndex}-level-${level}`
        const values = character.options
            .find(o => o.sourcePropertyName == sourcePropertyName && o.name == optionName)?.values ?? [];
        if (values.length > 0) {
            abilityScoreIncrease = values[0];
        }
        for (const optionValue of optionValues) {
            optionValue.isSelected = (optionValue.value == abilityScoreIncrease);
        }
        return [
            {
                name: optionName,
                maxSelections: 1,
                optionValues: optionValues
            }
        ];
    }

    static updateFeatures(character) {

    }

}
