
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class PotionOfGiantStrength {

    static get name() { return "potion-of-giant-strength"; }
    static get title() { return "Potion of Giant Strength"; }
    static get category() { return "potions"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(PotionOfGiantStrength, PotionOfGiantStrength.#content); }
    static get properties() { return []; }
    static get displayProperties() { return ["Rarity varies"]; }

    static getSelections(character, inventoryIndex) {
        const selections = [];
        const item = character.equipment[inventoryIndex];
        selections.push(character.getSelection(item.selections, "giant-type", "Giant type", 1));
        return selections;
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        let options = [];
        const item = character.equipment[inventoryIndex];
        if (selectionName == "giant-type") {
            let giantTypes = [...PotionOfGiantStrength.#giantTypes];
            const selectedValues = item.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.getSelectionOptions(giantTypes, selectedValues, [], "Giant type (choose 1) ...");
        }
        return options;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = [...PotionOfGiantStrength.properties];
        let title = PotionOfGiantStrength.title;
        const selectedGiantTypes = item.selections.find(s => s.name == "giant-type")?.values ?? [];
        if (selectedGiantTypes.length > 0 && selectedGiantTypes[0].value) {
            title = `${title} (${selectedGiantTypes[0].text})`;
        }
        item.properties.push({ name: "title", value: title });
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            const item = character.equipment[inventoryIndex];
            let giantType = null;
            const values = item.selections.find(s => s.name == "giant-type")?.values ?? [];
            if (values.length > 0) {
                giantType = values[0];
            }
            let name = PotionOfGiantStrength.name;
            if (giantType?.value) {
                name = `${PotionOfGiantStrength.name}-${giantType.value}`;
            }
            let title = PotionOfGiantStrength.title;
            if (giantType?.value) {
                title = `${PotionOfGiantStrength.title} - ${giantType.text}`;
            }
            let content = PotionOfGiantStrength.#content;
            if (giantType?.value) {
                const strength = PotionOfGiantStrength.#giantTypes.find(gt => gt.name == giantType.value).strength;
                content = `
                <p>
                    When you drink this potion, your Strength score changes to ${strength} for 1 hour. This potion has no effect on you if your Strength is equal to or greater than that score.
                </p>
            `;
            }
            tempFeatures.push(character.getFeatureCard(name, title, content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = PotionOfGiantStrength.name;
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            When you drink this potion, your Strength score changes for 1 hour. The type of giant determines the score (see the table below). This potion has no effect on you if your Strength is equal to or greater than that score.
        </p>
        <p>
            This potion's transparent liquid has floating in it a sliver of fingernail from a giant of the appropriate type. The potion of frost giant strength and the potion of stone giant strength have the same effect.
            <table>
                <tr>
                    <td>Type of Giant</td>
                    <td>Strength</td>
                    <td>Rarity</td>
                </tr>
                <tr>
                    <td>Hill Giant</td>
                    <td>21</td>
                    <td>Uncommon</td>
                </tr>
                <tr>
                    <td>Frost/Stone Giant</td>
                    <td>23</td>
                    <td>Rare</td>
                </tr>
                <tr>
                    <td>Fire Giant</td>
                    <td>25</td>
                    <td>Rare</td>
                </tr>
                <tr>
                    <td>Cloud Giant</td>
                    <td>27</td>
                    <td>Very Rare</td>
                </tr>
                <tr>
                    <td>Storm Giant</td>
                    <td>29</td>
                    <td>Legendary</td>
                </tr>
            </table>
        </p>
    `;

    static #giantTypes = [
        { name: "hill-giant", title: "Hill Giant", strength: 21 },
        { name: "frost-giant", title: "Frost Giant", strength: 23 },
        { name: "stone-giant", title: "Stone Giant", strength: 23 },
        { name: "fire-giant", title: "Fire Giant", strength: 25 },
        { name: "cloud-giant", title: "Cloud Giant", strength: 27 },
        { name: "storm-giant", title: "Storm Giant", strength: 29 }
    ];

}
