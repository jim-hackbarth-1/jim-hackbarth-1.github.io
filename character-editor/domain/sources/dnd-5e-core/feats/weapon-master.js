
export class WeaponMaster {

    static get name() {
        return "weapon-master";
    }

    static get title() {
        return "Weapon Master";
    }

    static get html() {
        return `
        <div class="dnd-5e-content">
            <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
            <h3>Weapon Master</h3>
            <hr/>
            <div class="content">
                [Weapon Master content here]
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
