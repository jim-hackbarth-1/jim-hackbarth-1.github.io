
export class Abacus {

    static get name() {
        return "abacus";
    }

    static get title() {
        return "Abacus";
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
            <h3>Abacus</h3>
            <hr/>
            <div class="content">
                [Abacus content here]
            </div>
        </div>
        `;
    }

    static getSelections(character, inventoryIndex) {
        const selections = [];
        let color = "abacus-color";
        const colorSelections = character.selections.find(s => s.name == color)?.values ?? [];
        if (colorSelections.length == 0) {
            colorSelections.push({ value: null, text: "Choose a color ..." });
        }
        selections.push({
            name: color,
            title: "Color",
            maxSelections: 1,
            currentSelections: colorSelections
        });

        let size = "abacus-size";
        const sizeSelections = character.selections.find(s => s.name == size)?.values ?? [];
        if (sizeSelections.length == 0) {
            sizeSelections.push({ value: null, text: "Choose a size ..." });
        }
        selections.push({
            name: size,
            title: "Size",
            maxSelections: 1,
            currentSelections: sizeSelections
        });
        return selections;
    }

    static getSelectionOptions(character, inventoryIndex, selectionName) {
        let options = [];
        let currentSelections = [];
        if (selectionName == "abacus-color") {
            options = [
                { value: null, text: "Choose a color ..." },
                { value: "black", text: "Black" },
                { value: "blue", text: "Blue" },
                { value: "green", text: "Green" },
                { value: "red", text: "Red" },
                { value: "white", text: "White" }
            ];
            let color = null;
            currentSelections = character.selections.find(s => s.name == "abacus-color")?.values ?? [];
            if (currentSelections.length > 0) {
                color = currentSelections[0].value;
            }
            for (const option of options) {
                option.isSelected = (option.value == color);
            }
        }
        if (selectionName == "abacus-size") {
            options = [
                { value: null, text: "Choose a size ..." },
                { value: "small", text: "Small" },
                { value: "medium", text: "Medium" },
                { value: "large", text: "Large" },
                { value: "red", text: "Red" }
            ];
            let size = null;
            currentSelections = character.selections.find(s => s.name == "abacus-size")?.values ?? [];
            if (currentSelections.length > 0) {
                size = currentSelections[0].value;
            }
            for (const option of options) {
                option.isSelected = (option.value == size);
            }
        }
        return options;
    }

    static applyModifiers(character, inventoryIndex) {

    }

    static applyFeatures(features, character, inventoryIndex) {

    }

}
