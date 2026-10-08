
export class Athlete {

    static get name() {
        return "athlete";
    }

    static get title() {
        return "Athlete";
    }

    static get html() {
        return `
        <div class="dnd-5e-content">
            <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
            <h3>Athlete</h3>
            <hr/>
            <div class="content">
                <p>You have undergone extensive physical training to gain the following benefits:<p>
                <p>
                    <ul>
                        <li>Increase your Strength or Dexterity score by 1, to a maximum of 20.</li>
                        <li>When you are prone, standing up uses only 5 feet of your movement.</li>
                        <li>Climbing doesn't cost you extra movement.</li>
                        <li>You can make a running long jump or a running high jump after moving only 5 feet on foot, rather than 10 feet.</li>
                    </ul>
                </p>
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

    static getSelections(character, classIndex, level) {
        const selections = [];
        const selectionName = "athlete-ability-score-increase";
        let currentSelections = character.selections.find(s => s.name == selectionName)?.values ?? [];
        if (currentSelections.length == 0) {
            currentSelections = [{ value: null, text: "Choose ability ..." }];
        }
        selections.push({
            name: selectionName,
            title: "Ability",
            maxSelections: 1,
            currentSelections: currentSelections
        })
        return selections;
    }

    static getSelectionOptions(character, classIndex, level, selectionName) {
        let options = [];
        if (selectionName == "athlete-ability-score-increase") {
            options = [
                { value: null, text: "Choose ability ..." },
                { value: "strength", text: "Strength" },
                { value: "dexterity", text: "Dexterity" }
            ];
            let currentSelections = character.selections.find(s => s.name == selectionName)?.values ?? [];
            currentSelections = currentSelections.map(cs => cs.value);
            for (const option of options) {
                option.isSelected = currentSelections.includes(option.value);
            }
        }
        return options;
    }

    static applyModifiers(character, classIndex, level) {
        const modifiers = [];
        let abilityScore = null;
        const values = character.selections.find(s => s.name == "athlete-ability-score-increase")?.values ?? [];
        if (values.length > 0) {
            abilityScore = values[0];
        }
        if (abilityScore) {
            modifiers.push(
                {
                    name: "athlete-ability-score-modifier",
                    target: `ability-score:${abilityScore}`,
                    value: 1,
                    title: Athlete.title,
                });
        }
        for (const modifier of modifiers) {
            modifier.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
            modifier.sourcePropertyValue = "athlete";
            character.addModifier(modifier);
        }
    }

    static applyFeatures(features, character, classIndex, level) {
        const tempFeatures = [];
        tempFeatures.push({
            name: `class-${classIndex}-level-${level}-feat`,
            displayType: "card",
            html: `
                <h3>Athlete</h3>
                <hr/>
                <div class="content">
                    <p>You have undergone extensive physical training to gain the following benefits:<p>
                    <p>
                        <ul>
                            <li>Increase your Strength or Dexterity score by 1, to a maximum of 20.</li>
                            <li>When you are prone, standing up uses only 5 feet of your movement.</li>
                            <li>Climbing doesn't cost you extra movement.</li>
                            <li>You can make a running long jump or a running high jump after moving only 5 feet on foot, rather than 10 feet.</li>
                        </ul>
                    </p>
                </div>
                `
        });
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
            feature.sourcePropertyValue = Athlete.name
            features.push(feature);
        }
    }

}
