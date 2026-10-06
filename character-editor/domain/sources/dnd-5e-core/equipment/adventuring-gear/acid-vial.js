
export class AcidVial {

    static get name() {
        return "acid-vial";
    }

    static get title() {
        return "Acid (vial)";
    }

    static get category() {
        return "adventuring-gear";
    }

    static get properties() {
        return [];
    }

    static get canBeEquipped() {
        return true;
    }

    static get html() {
        return `
        <div class="dnd-5e-content">
            <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
            <h3>Acid (vial)</h3>
            <hr/>
            <div class="content">
                [Acid (vial) content here]
            </div>
        </div>
        `;
    }

    static getOptions(character, inventoryIndex) {
        return [];
    }

    static applyModifiers(character, inventoryIndex) {

    }

    static applyFeatures(features, character, inventoryIndex) {

    }

}
