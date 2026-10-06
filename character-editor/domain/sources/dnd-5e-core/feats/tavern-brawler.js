
export class TavernBrawler {

    static get name() {
        return "tavern-brawler";
    }

    static get title() {
        return "Tavern Brawler";
    }

    static get html() {
        return `
        <div class="dnd-5e-content">
            <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
            <h3>Tavern Brawler</h3>
            <hr/>
            <div class="content">
                [Tavern Brawler content here]
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

    static applyModifiers(character, classIndex, level) {

    }

    static applyFeatures(features, character, classIndex, level) {

    }

}
