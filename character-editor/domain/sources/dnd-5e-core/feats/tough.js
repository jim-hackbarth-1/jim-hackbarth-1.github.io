
export class Tough {

    static get name() {
        return "tough";
    }

    static get title() {
        return "Tough";
    }

    static get html() {
        return `
        <div class="dnd-5e-content">
            <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
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

    static getSelections(character, classIndex, level) {
        return [];
    }

    static getSelectionOptions(character, classIndex, level, selectionName) {
        return [];
    }

    static applyModifiers(character, classIndex, level) {
        const hitPointMod = Number(character.level) * 2;
        const modifiers = [
            {
                name: "tough-hit-point-modifier",
                target: "hit-points",
                value: hitPointMod,
                title: Tough.title,
            }];
        for (const modifier of modifiers) {
            modifier.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
            modifier.sourcePropertyValue = "tough";
            character.addModifier(modifier);
        }
    }

    static applyFeatures(features, character, classIndex, level) {
        const tempFeatures = [];
        tempFeatures.push({
            name: `class-${classIndex}-level-${level}-feat`,
            displayType: "card",
            html: `
                <h3>Tough</h3>
                <hr/>
                <div class="content">
                    <p>Your hit point maximum increases by an amount equal to twice your level when you gain this feat. Whenever you gain a level thereafter, your hit point maximum increases by an additional 2 hit points.</p>
                </div>
                `
        });
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
            feature.sourcePropertyValue = Tough.name
            features.push(feature);
        }
    }

}
