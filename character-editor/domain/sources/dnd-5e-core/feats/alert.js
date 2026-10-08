
export class Alert {

    static get name() {
        return "alert";
    }

    static get title() {
        return "Alert";
    }

    static get html() {
        return `
        <div class="dnd-5e-content">
            <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
            <h3>Alert</h3>
            <hr/>
            <div class="content">
                [Alert content here]
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

    }

    static applyFeatures(features, character, classIndex, level) {

    }

}
