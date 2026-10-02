
import { DnD5EUtilities } from "./../../dnd-5e-core-utilities.js"

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
        return false;
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

    static getOptions(character, inventoryIndex) {

        const options = [];

        // abacus color
        let name = "abacus-color"; 
        let title = "Color"
        let optionName = `item-index-${inventoryIndex}:${name}`;
        let values = character.options.find(o => o.name == optionName)?.values ?? [];
        let selectedValue = null;
        if (values.length > 0) {
            selectedValue = values[0];
        }
        let optionValues = [
            { value: null, text: "Choose a color ..." },
            { value: "black", text: "Black" },
            { value: "blue", text: "Blue" },
            { value: "green", text: "Green" },
            { value: "red", text: "Red" },
            { value: "white", text: "White" }
        ];
        for (const optionValue of optionValues) {
            optionValue.isSelected = (optionValue.value == selectedValue);
        }
        options.push({
            name: name,
            title: title,
            maxSelections: 1,
            optionValues: optionValues
        });

        // abacus size
        name = "abacus-size";
        title = "Size"
        optionName = `item-index-${inventoryIndex}:${name}`;
        values = character.options.find(o => o.name == optionName)?.values ?? [];
        selectedValue = null;
        if (values.length > 0) {
            selectedValue = values[0];
        }
        optionValues = [
            { value: null, text: "Choose a size ..." },
            { value: "small", text: "Small" },
            { value: "medium", text: "Medium" },
            { value: "large", text: "Large" }
        ];
        for (const optionValue of optionValues) {
            optionValue.isSelected = (optionValue.value == selectedValue);
        }
        options.push({
            name: name,
            title: title,
            maxSelections: 1,
            optionValues: optionValues
        });

        return options;
    }

    static updateFeatures(character, inventoryIndex) {

    }

}
