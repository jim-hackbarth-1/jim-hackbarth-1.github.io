
import { Character, Sources, Utilities } from "../../../domain/references.js";
import { EditorViewModel } from "../../editor-view/editor-view.js";
import { SelectionModel } from "../../shared/selection/selection.js";

export function createModel() {
    return new DomainEquipmentModel();
}

class DomainEquipmentModel {

    #kitElement;
    static #character;
    static #equipmentCategory;
    static #equipment;

    async init(kitElement) {
        this.#kitElement = kitElement;
        DomainEquipmentModel.#character = Character.currentCharacter;
        const elementKey = this.#kitElement.getAttribute("kit-element-key");
        const characterUpdateSubscriber = {
            elementKey: elementKey,
            id: `${EditorViewModel.CharacterUpdateTopic}-${elementKey}`,
            object: this,
            callback: this.onCharacterUpdate.name
        };
        UIKit.messenger.subscribe(EditorViewModel.CharacterUpdateTopic, characterUpdateSubscriber);
    }

    async onRendered() {
        await UIKit.renderer.renderElement(this.#kitElement.querySelector("#add-equipment-list"));
    }

    async onCharacterUpdate(message) {
        const oldCharacter = DomainEquipmentModel.#character;
        const currentCharacter = Character.currentCharacter;
        const sourcesUpdated = !Utilities.areArraysEqual(oldCharacter.sources, currentCharacter.sources);
        const removedEquipmentIndex = Number(message.equipmentRemoved);
        let removedItemName = null;
        if (removedEquipmentIndex >= 0) {
            removedItemName = oldCharacter.equipment[removedEquipmentIndex].name;
        }
        const updatedEquipmentIndex = Number(message.equipmentUpdated);
        DomainEquipmentModel.#character = currentCharacter;
        if (sourcesUpdated) {
            await UIKit.renderer.renderElement(this.#kitElement);
        }
        else {
            const character = DomainEquipmentModel.#character;
            if (message.equipmentAdded || removedItemName) {
                const itemName = message.equipmentAdded ?? removedItemName;
                await UIKit.renderer.renderElement(this.#kitElement.querySelector("#inventory-list"));
                const addEquipmentElement = this.#kitElement.querySelector(`#added-count-label-${itemName}`);
                if (addEquipmentElement) {
                    const count = character.equipment.filter(e => e.name == itemName).length;
                    const addedCountLabel = this.#getEquipmentAddedLabel(count);
                    this.#kitElement.querySelector(`#added-count-label-${itemName}`).innerText = addedCountLabel;
                }
            }
            if (updatedEquipmentIndex >= 0) {
                const isEquipped = character.equipment[updatedEquipmentIndex].isEquipped;
                const equippedLabel = isEquipped ? "Equipped" : "&nbsp;";
                this.#kitElement.querySelector(`#checkbox-info-label-${updatedEquipmentIndex}`).innerHTML = equippedLabel;
            }
        }
    }

    toggleDetail(event, detailSection) {
        if (detailSection == "inventory-detail") {
            this.#kitElement.querySelector("#expand-inventory").classList.toggle("hidden");
            this.#kitElement.querySelector("#collapse-inventory").classList.toggle("hidden");
        }
        else {
            this.#kitElement.querySelector("#expand-add-equipment").classList.toggle("hidden");
            this.#kitElement.querySelector("#collapse-add-equipment").classList.toggle("hidden");
        }
        this.#kitElement.querySelector(`#${detailSection}`).classList.toggle("hidden");
    }

    getEquipmentCategories() {
        const selectionModel = {
            name: "equipment-category",
            title: "Category:",
            maxSelections: 1
        };
        let categories = Sources.getEquipmentCategories();
        let options = categories.map(ec =>
        ({
            value: ec.name,
            text: ec.title,
            hasDetail: false,
            isSelected: (DomainEquipmentModel.#equipmentCategory == ec.name)
        }));
        options = Utilities.sort(options, "text");
        options.unshift({
            value: null,
            text: "Choose an equipment category",
            hasDetail: false,
            isSelected: false
        });
        selectionModel.options = options;
        return selectionModel;
    }

    updateEquipmentCategory = async (selectionModelName, optionValues) => {
        let equipmentCategory = optionValues[0];
        if (equipmentCategory == "null") {
            equipmentCategory = null;
        }
        if (DomainEquipmentModel.#equipmentCategory == equipmentCategory) {
            return;
        }
        DomainEquipmentModel.#equipmentCategory = equipmentCategory;
        await UIKit.renderer.renderElement(this.#kitElement.querySelector("#add-equipment-list"));
    }

    getEquipment() {
        let equipment = [];
        const character = DomainEquipmentModel.#character;
        if (DomainEquipmentModel.#equipmentCategory) {
            equipment = Sources.getEquipment(DomainEquipmentModel.#character.sources, DomainEquipmentModel.#equipmentCategory);
        }
        if (equipment.length == 0) {
            equipment.push({ properties: ["[No equipment]"] });
        }
        else {
            for (const item of equipment) {
                const count = character.equipment.filter(e => e.name == item.name).length;
                item.addedCountLabel = this.#getEquipmentAddedLabel(count);
            }
        }
        return equipment;
    }

    async toggleEquipmentDetail(event, name) {
        const equipmentItem = this.#kitElement.querySelector(`#equipment-item-${name}`);
        const isCollapsed = equipmentItem.querySelector(".equipment-item-html").classList.contains("hidden");
        const allEquipmentItems = this.#kitElement.querySelectorAll(".equipment-item");
        for (const item of allEquipmentItems) {
            item.querySelector(".equipment-item-html").classList.add("hidden");
            item.querySelector(".expand-button").classList.remove("hidden");
            item.querySelector(".collapse-button").classList.add("hidden");
        }
        if (isCollapsed) {
            const html = await Sources.getEquipmentHtml(DomainEquipmentModel.#character.sources, name);
            equipmentItem.querySelector(".equipment-item-html").innerHTML = html;
            equipmentItem.querySelector(".equipment-item-html").classList.remove("hidden");
            equipmentItem.querySelector(".expand-button").classList.add("hidden");
            equipmentItem.querySelector(".collapse-button").classList.remove("hidden");
        }
    }

    async addItem(itemName) {
        if (!itemName) {
            return;
        }
        const character = Character.currentCharacter;
        Sources.addCharacterEquipment(character, { name: itemName });
        const message = {
            character: character,
            section: "details-equipment",
            equipmentAdded: itemName
        };
        Character.currentCharacter = character;
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateTopic, message);
    }

    getInventory() {
        let inventory = [];
        const character = DomainEquipmentModel.#character;
        const allEquipment = Sources.getEquipment(character.sources);
        for (let i = 0; i < character.equipment.length; i++) {
            const characterItem = character.equipment[i];
            const item = allEquipment.find(e => e.name == characterItem.name);
            const domainOptions = item.getOptions(character, i) ?? [];
            const displayOptions = SelectionModel.getDisplayOptions(character, domainOptions, `item-index-${itemIndex}:`);
            inventory.push({
                index: i,
                name: item.name,
                title: item.title,
                source: item.source,
                properties: item.properties,
                canBeEquipped: item.canBeEquipped,
                options: displayOptions,
                html: item.html,
                htmlPath: item.htmlPath,
                isEquipped: characterItem.isEquipped
            });
        }
        if (inventory.length == 0) {
            inventory.push({ properties: ["[No inventory]"] });
        }
        return inventory;
    }

    async toggleEquip(event) {
        const character = Character.currentCharacter;
        const index = Number(event.srcElement.getAttribute("data-item-index"));
        const isEquipped = event.srcElement.checked;
        character.equipment[index].isEquipped = isEquipped;
        const message = {
            character: character,
            section: "details-equipment",
            equipmentUpdated: index
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    toggleOptions(event, inventoryIndex) {
        const inventoryItem = this.#kitElement.querySelector(`#inventory-item-${inventoryIndex}`);
        const isHidden = inventoryItem.querySelector(".inventory-item-options").classList.contains("hidden");
        const allOptionElements = this.#kitElement.querySelectorAll(".inventory-item-options");
        for (const optionElement of allOptionElements) {
            optionElement.classList.add("hidden");  
        }
        if (isHidden) {
            inventoryItem.querySelector(".inventory-item-options").classList.remove("hidden");
        }
        else {
            inventoryItem.querySelector(".inventory-item-options").classList.add("hidden");
        }
    }

    async toggleInventoryDetail(event, inventoryIndex, name) {
        const inventoryItem = this.#kitElement.querySelector(`#inventory-item-${inventoryIndex}`);
        const isCollapsed = inventoryItem.querySelector(".inventory-item-html").classList.contains("hidden");
        const allInventoryItems = this.#kitElement.querySelectorAll(".inventory-item");
        for (const item of allInventoryItems) {
            item.querySelector(".inventory-item-html").classList.add("hidden");
            const eb = item.querySelector(".expand-button");
            if (eb) {
                eb.classList.remove("hidden");
            }
            const cb = item.querySelector(".collapse-button");
            if (cb) {
                cb.classList.add("hidden");
            }
        }
        if (isCollapsed) {
            const html = await Sources.getEquipmentHtml(DomainEquipmentModel.#character.sources, name);
            inventoryItem.querySelector(".inventory-item-html").innerHTML = html;
            inventoryItem.querySelector(".inventory-item-html").classList.remove("hidden");
            const expandButton = inventoryItem.querySelector(".expand-button");
            if (expandButton) {
                expandButton.classList.add("hidden");
            }
            const collapseButton = inventoryItem.querySelector(".collapse-button");
            if (collapseButton) {
                collapseButton.classList.remove("hidden");
            }
        }
    }

    async removeItem(itemIndex) {
        const character = Character.currentCharacter;
        const index = Number(itemIndex);
        const isEquipped = character.equipment[index].isEquipped;
        Sources.removeCharacterEquipment(character, index);
        const message = {
            character: character,
            section: "details-equipment",
            equipmentRemoved: index,
            removedItemEquipped: isEquipped
        };
        if (isEquipped) {
            await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
        }
        else {
            Character.currentCharacter = character;
            await UIKit.messenger.publish(EditorViewModel.CharacterUpdateTopic, message);
        }
    }

    getOptionHtml(selectionModelName, optionValue) {
        return "[no detail available]";
    }

    async updateOption(selectionModelName, optionValues) {
        const character = Character.currentCharacter;
        const currentValues = character.options.find(o => o.name == selectionModelName)?.values ?? [];
        if (Utilities.areArraysEqual(currentValues, optionValues)) {
            return;
        }
        const parts = selectionModelName.split(":");
        const itemIndex = Number(parts[0].replace("item-index-", ""));
        const option = {
            name: selectionModelName,
            sourcePropertyName: "equipment",
            sourcePropertyValue: itemIndex,
            values: optionValues
        };
        Sources.updateCharacterOption(character, option);
        const message = {
            character: character,
            option: option,
            section: "details-equipment"
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    #getEquipmentAddedLabel(count) {
        let addedCountLabel = "";
        if (count == 1) {
            addedCountLabel = "Added";
        }
        if (count > 1) {
            addedCountLabel = `Added (x${count})`;
        }
        return addedCountLabel;
    }

}
