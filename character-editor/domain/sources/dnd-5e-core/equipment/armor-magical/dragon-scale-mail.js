
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class DragonScaleMailArmor {

    static get name() { return "dragon-scale-mail-armor"; }
    static get title() { return "Dragon scale mail"; }
    static get category() { return "armor-magical"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(DragonScaleMailArmor, DragonScaleMailArmor.#content); }
    static get armorType() { return "medium-armor"; }

    static get properties() {
        return [
            { name: "is-armor" },
            { name: "attunement" },
            { name: "stealth-disadvantage" },
            { name: "armor-name", value: DragonScaleMailArmor.name },
            { name: "armor-title", value: DragonScaleMailArmor.title },
            { name: "armor-type", value: "medium-armor" },
            { name: "ac-modifier", value: "5" }
        ];
    }

    static get displayProperties() {
        return [
            "Very rare",
            "Requires attunement"
        ];
    }

    static getSelections(character, inventoryIndex) {
        const selections = [];
        const item = character.equipment[inventoryIndex];
        selections.push(character.getSelection(item.selections, "dragon-type", "Dragon type", 1));
        return selections;
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        let options = [];
        const item = character.equipment[inventoryIndex];
        if (selectionName == "dragon-type") {
            let dragons = [...DragonScaleMailArmor.#dragonTypes];
            const selectedValues = item.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.getSelectionOptions(
                dragons, selectedValues, [], "Dragon type (choose 1) ...");
        }
        return options;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = DragonScaleMailArmor.properties;

        let title = DragonScaleMailArmor.title;
        const selectedDragons = item.selections.find(s => s.name == "dragon-type")?.values ?? [];
        if (selectedDragons.length > 0 && selectedDragons[0].value) {
            title = `${title} (${selectedDragons[0].text})`;
        }
        item.properties.push({ name: "title", value: title });

        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${DragonScaleMailArmor.name}-inventory-index-${inventoryIndex}-ac-modifier`,
                target: "armor-class",
                value: 5,
                title: DragonScaleMailArmor.title
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = DragonScaleMailArmor.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            let content = `
                <p>
                    Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued.
                </p>
                <p>
                    While wearing this armor, you gain a +1 bonus to AC, and you have advantage on saving throws against the Frightful Presence and breath weapons of dragons.
                </p>
            `;
            let resistance = null;
            const item = character.equipment[inventoryIndex];
            const selectedDragons = item.selections.find(s => s.name == "dragon-type")?.values ?? [];
            if (selectedDragons.length > 0 && selectedDragons[0].value) {
                resistance = DragonScaleMailArmor.#dragonTypes.find(dt => dt.name == selectedDragons[0].value).resistance;
            }
            if (resistance) {
                content += `
                    <p>
                        You have resistance to ${resistance} damage.
                    </p>
                `;
            }
            content += `
                <p>
                Additionally, you can focus your senses as an action to magically discern the distance and direction to the closest dragon within 30 miles of you that is of the same type as the armor. This special action can't be used again until the next dawn.
            </p>
            `;
            const feature = character.getFeatureCard(
                `equipment-${inventoryIndex}-${DragonScaleMailArmor.name}`, DragonScaleMailArmor.title, content);
            feature.useInfo = {
                reset: "next-dawn",
                uses: 1
            };
            tempFeatures.push(feature);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = DragonScaleMailArmor.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #dragonTypes = [
        { name: "black", title: "Black", resistance: "acid" },
        { name: "blue", title: "Blue", resistance: "lightening" },
        { name: "brass", title: "Brass", resistance: "fire" },
        { name: "bronze", title: "Bronze", resistance: "lightening" },
        { name: "copper", title: "Copper", resistance: "acid" },
        { name: "gold", title: "Gold", resistance: "fire" },
        { name: "green", title: "Green", resistance: "poison" },
        { name: "red", title: "Red", resistance: "fire" },
        { name: "silver", title: "Silver", resistance: "cold" },
        { name: "white", title: "White", resistance: "cold" }
    ];

    static #content = `
        <p>
            Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued.
        </p>
        <p>
            While wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to one damage type that is determined by the kind of dragon that provided the scales (see the table).
        </p>
        <p>
            Additionally, you can focus your senses as an action to magically discern the distance and direction to the closest dragon within 30 miles of you that is of the same type as the armor. This special action can't be used again until the next dawn.
        </p>
        <p>
            <table>
                <tr>
                    <th>Dragon</th>
                    <th>Resistance</th>
                </tr>
                <tr>
                    <td>Black</td>
                    <td>Acid</td>
                </tr>
                <tr>
                    <td>Blue</td>
                    <td>Lightning</td>
                </tr>
                <tr>
                    <td>Brass</td>
                    <td>Fire</td>
                </tr>
                <tr>
                    <td>Bronze</td>
                    <td>Lightning</td>
                </tr>
                <tr>
                    <td>Copper</td>
                    <td>Acid</td>
                </tr>
                <tr>
                    <td>Gold</td>
                    <td>Fire</td>
                </tr>
                <tr>
                    <td>Green</td>
                    <td>Poison</td>
                </tr>
                <tr>
                    <td>Red</td>
                    <td>Fire</td>
                </tr>
                <tr>
                    <td>Silver</td>
                    <td>Cold</td>
                </tr>
                <tr>
                    <td>White</td>
                    <td>Cold</td>
                </tr>
            </table>
        </p>
    `;
}
