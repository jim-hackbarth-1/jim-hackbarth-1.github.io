
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class PotionOfHealing {

    static get name() { return "potion-of-healing"; }
    static get title() { return "Potion of Healing"; }
    static get category() { return "potions"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(PotionOfHealing, PotionOfHealing.#content); }
    static get properties() { return []; }
    static get displayProperties() { return ["Rarity varies"]; }

    static getSelections(character, inventoryIndex) {
        const selections = [];
        const item = character.equipment[inventoryIndex];
        selections.push(character.getSelection(item.selections, "rarity", "Rarity", 1));
        return selections;
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        let options = [];
        const item = character.equipment[inventoryIndex];
        if (selectionName == "rarity") {
            let rarities = [...PotionOfHealing.#rarities];
            const selectedValues = item.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.getSelectionOptions(rarities, selectedValues, [], "Rarity (choose 1) ...");
        }
        return options;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = [...PotionOfHealing.properties];
        let title = PotionOfHealing.title;
        const selectedRarities = item.selections.find(s => s.name == "rarity")?.values ?? [];
        if (selectedRarities.length > 0 && selectedRarities[0].value) {
            title = `Potion of ${selectedRarities[0].text}`;
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
            let rarity = null;
            const values = item.selections.find(s => s.name == "rarity")?.values ?? [];
            if (values.length > 0) {
                rarity = values[0];
            }
            let name = PotionOfHealing.name;
            if (rarity?.value) {
                name = `${PotionOfHealing.name}-${rarity.value}`;
            }
            let title = PotionOfHealing.title;
            if (rarity?.value) {
                title = `Potion of ${rarity.text}`;
            }
            let content = PotionOfHealing.#content;
            if (rarity?.value) {
                const healing = PotionOfHealing.#rarities.find(f => f.name == rarity.value).healing;
                content = `
                <p>
                    You regain ${healing} hit points when you drink this potion. The potion's red liquid glimmers when agitated.
                </p>
            `;
            }
            tempFeatures.push(character.getFeatureCard(name, title, content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = PotionOfHealing.name;
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            You regain hit points when you drink this potion. The number of hit points depends on the potion's rarity, as shown in the Potions of Healing table. Whatever its potency, the potion's red liquid glimmers when agitated.
        </p>
        <p>
            <table>
                <tr>
                    <td>Rarity</td>
                    <td>HP Regained</td>
                </tr>
                <tr>
                    <td>Healing	(common)</td>
                    <td>2d4 + 2</td>
                </tr>
                <tr>
                    <td>Greater Healing	(uncommon)</td>
                    <td>4d4 + 4</td>
                </tr>
                <tr>
                    <td>Superior Healing (rare)</td>
                    <td>8d4 + 8</td>
                </tr>
                <tr>
                    <td>Supreme Healing	(very rare)</td>
                    <td>10d4 + 20</td>
                </tr>
            </table>
        </p>
    `;

    static #rarities = [
        { name: "healing", title: "Healing (common)", healing: "2d4 + 2" },
        { name: "greater-healing", title: "Greater Healing (uncommon)", healing: "4d4 + 4" },
        { name: "superior-healing", title: "Superior Healing (rare)", healing: "8d4 + 8" },
        { name: "supreme-healing", title: "Supreme Healing (very rare)", healing: "10d4 + 20" }
    ];

}
