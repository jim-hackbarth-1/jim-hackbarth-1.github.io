
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
        this.toggleStartingEquipment();
    }

    async onCharacterUpdate(message) {
        const oldCharacter = DomainEquipmentModel.#character;
        const currentCharacter = Character.currentCharacter;
        const sourcesUpdated = !Utilities.areArraysEqual(oldCharacter.sources, currentCharacter.sources);
        const oldCharacterClass = (oldCharacter.classes.length > 0) ? oldCharacter.classes[0].name : "";
        const currentCharacterClass = (currentCharacter.classes.length > 0) ? currentCharacter.classes[0].name : "";
        const classUpdated = (oldCharacterClass != currentCharacterClass);
        const backgroundUpdated = (oldCharacter.background != currentCharacter.background);
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
            if (classUpdated || backgroundUpdated) {
                this.toggleStartingEquipment();
            }
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

    getEquipmentCategoriesSelectionModel() {
        let currentSelection = { value: null, text: "Choose an equipment category ..." };
        const category = DomainEquipmentModel.#equipmentCategory;
        if (category?.value) {
            currentSelection = { value: category.value, text: category.text };
        }
        return {
            name: "equipment-category",
            title: "Category",
            maxSelections: 1,
            currentSelections: [currentSelection],
            getOptions: this.getEquipmentCategories,
            updateSelection: this.updateEquipmentCategory
        };
    }

    getEquipmentCategories() {
        const character = DomainEquipmentModel.#character;
        const categories = Sources.getEquipmentCategories();
        const category = DomainEquipmentModel.#equipmentCategory;
        let options = categories.map(ec =>
        ({
            value: ec.name,
            text: ec.title,
            hasDetail: false,
            isSelected: (category?.value == ec.name)
        }));
        options = Utilities.sort(options, "text");
        options.unshift({
            value: null,
            text: "Choose an equipment category ...",
            hasDetail: false,
            isSelected: false
        });
        return options;
    }

    updateEquipmentCategory = async (selectionModelName, options) => {
        const category = options[0];
        const currentCategory = DomainEquipmentModel.#equipmentCategory;
        if (category?.value == currentCategory?.value) {
            return;
        }
        DomainEquipmentModel.#equipmentCategory = category;
        await UIKit.renderer.renderElement(this.#kitElement.querySelector("#add-equipment-list"));
    }

    getEquipment() {
        let equipment = [];
        const character = DomainEquipmentModel.#character;
        if (DomainEquipmentModel.#equipmentCategory?.value) {
            equipment = Sources.getEquipment(DomainEquipmentModel.#character.sources, DomainEquipmentModel.#equipmentCategory.value);
        }
        if (equipment.length == 0) {
            equipment.push({ properties: ["[No equipment]"] });
        }
        else {
            for (const item of equipment) {
                const count = character.equipment.filter(e => e.name == item.name).length;
                item.addedCountLabel = this.#getEquipmentAddedLabel(count);
            }
            equipment = Utilities.sort(equipment, "title");
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

    toggleStartingEquipment() {
        let startingEquipment = "";
        const character = DomainEquipmentModel.#character;
        if (character.background) {
            const backgroundEquipment = Sources.getBackgrounds(character.sources)
                .find(b => b.name == character.background)?.startingEquipment;
            if (backgroundEquipment) {
                startingEquipment += backgroundEquipment;
            }
        }
        if (character.classes.length > 0 && character.classes[0].name) {
            const cls = Sources.getClasses(character.sources).find(c => c.name == character.classes[0].name);
            if (cls?.startingEquipment) {
                startingEquipment += cls?.startingEquipment;
            }
            if (cls?.startingGold) {
                startingEquipment += "OR<br/>"
                startingEquipment += cls?.startingGold;
            }
        }
        
        if (!startingEquipment) {
            startingEquipment = "[None]";
        }
        this.#kitElement.querySelector("#starting-equipment-content").innerHTML = startingEquipment;
        this.#kitElement.querySelector("#starting-equipment").classList.toggle("hidden");
        this.#kitElement.querySelector("#expand-starting-equipment").classList.toggle("hidden");
        this.#kitElement.querySelector("#collapse-starting-equipment").classList.toggle("hidden");
    }

    getInventory() {
        let inventory = [];
        const character = DomainEquipmentModel.#character;
        const allEquipment = Sources.getEquipment(character.sources);
        const armorTypes = ["light-armor", "medium-armor", "heavy-armor"];
        for (let i = 0; i < character.equipment.length; i++) {
            const characterItem = character.equipment[i];
            const item = allEquipment.find(e => e.name == characterItem.name);
            let selections = null;
            if (item?.getSelections) {
                selections = item.getSelections(character, i);
                for (const selection of selections) {
                    selection.name = `inventory-${i}:${selection.name}`;
                    selection.getOptions = this.getEquipmentSelectionOptions;
                    selection.updateSelection = this.updateEquipmentSelection;
                }
            }
            let properties = item.properties ?? [];
            if (item.armorType == "shield") {
                properties.push("<span class='property-note'>(Only 1 shield may be equipped.)</span>");
            }
            if (armorTypes.includes(item.armorType)) {
                properties.push("<span class='property-note'>(Only 1 armor may be equipped.)</span>");
            }
            inventory.push({
                index: i,
                name: item.name,
                title: item.title,
                source: item.source,
                properties: properties,
                canBeEquipped: item.canBeEquipped,
                selections: selections,
                html: item.html,
                htmlPath: item.htmlPath,
                isEquipped: characterItem.isEquipped
            });
        }
        if (inventory.length == 0) {
            inventory.push({ properties: ["[No inventory]"] });
        }
        else {
            inventory = Utilities.sort(inventory, "title");
        }
        return inventory;
    }

    async toggleEquip(event) {
        const character = Character.currentCharacter;
        const index = Number(event.srcElement.getAttribute("data-item-index"));
        const inventoryItem = character.equipment[index];
        if (!inventoryItem) {
            return;
        }
        const isEquipped = event.srcElement.checked;
        if (isEquipped) {
            const equipment = Sources.getEquipment(character.sources).find(e => e.name == character.equipment[index].name);
            let canEquip = true;
            if (equipment.armorType == "shield") {
                canEquip = !this.#hasEquippedShield(character, index);
            }
            const armorTypes = ["light-armor", "medium-armor", "heavy-armor"];
            if (armorTypes.includes(equipment.armorType)) {
                canEquip = !this.#hasEquippedArmor(character, index, armorTypes);
            }
            if (canEquip) {
                if (equipment.equip) {
                    equipment.equip(character, index);
                } else {
                    inventoryItem.isEquipped = true;
                }
            }
        }
        else {
            inventoryItem.properties = [];
            inventoryItem.isEquipped = false;
        }
        event.srcElement.checked = inventoryItem.isEquipped;
        const message = {
            character: character,
            section: "details-equipment",
            equipmentUpdated: index
        };
        await UIKit.messenger.publish(EditorViewModel.CharacterUpdateStartedTopic, message);
    }

    toggleOptions(event, inventoryIndex) {
        const inventoryItem = this.#kitElement.querySelector(`#inventory-item-${inventoryIndex}`);
        const isHidden = inventoryItem.querySelector(".inventory-item-selections").classList.contains("hidden");
        const allOptionElements = this.#kitElement.querySelectorAll(".inventory-item-selections");
        for (const optionElement of allOptionElements) {
            optionElement.classList.add("hidden");  
        }
        if (isHidden) {
            inventoryItem.querySelector(".inventory-item-selections").classList.remove("hidden");
        }
        else {
            inventoryItem.querySelector(".inventory-item-selections").classList.add("hidden");
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

    getEquipmentSelectionOptions(selectionModelName) {
        const parts = selectionModelName.split(":");
        const index = Number(parts[0].replace("inventory-", ""));
        const modelName = parts[1];
        const character = DomainEquipmentModel.#character;
        let options = [];
        const itemName = character.equipment[index].name;
        const item = Sources.getEquipment(character.sources).find(e => e.name == itemName);
        if (item?.getSelectionOptions) {
            options = item.getSelectionOptions(character, index, modelName);
        }
        return options;
    }

    async updateEquipmentSelection(selectionModelName, selectedOptions) {
        const parts = selectionModelName.split(":");
        const index = Number(parts[0].replace("inventory-", ""));
        const modelName = parts[1];
        const character = Character.currentCharacter;
        const currentValues = character.selections.find(s => s.name == selectionModelName)?.values ?? [];
        if (Utilities.areArraysEqual(currentValues, selectedOptions, ["value"])) {
            return;
        }
        const selection = {
            name: modelName,
            sourcePropertyName: `equipment-${index}`,
            sourcePropertyValue: character.equipment[index].name,
            values: selectedOptions
        };
        Sources.updateCharacterSelection(character, selection);
        const inventoryItem = character.equipment[index];
        if (inventoryItem.isEquipped) {
            const equipment = Sources.getEquipment(character.sources).find(e => e.name == e.inventoryItem.name);
            if (equipment?.equip) {
                equipment.equip(character, index);
            }
        }
        const message = {
            character: character,
            selection: selection,
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

    #hasEquippedShield(character, inventoryIndex) {
        let shieldIndex = character.equipment.findIndex(e =>
            e.isEquipped
            && e.properties
            && e.properties.some(p => p.name == "armor-type" && p.value == "shield"));
        return (shieldIndex > -1 && shieldIndex != inventoryIndex);
    }

    #hasEquippedArmor(character, inventoryIndex, armorTypes) {
        let armorIndex = character.equipment.findIndex(e =>
            e.isEquipped
            && e.properties
            && e.properties.some(p => p.name == "armor-type" && armorTypes.includes(p.value)));
        return (armorIndex > -1 && armorIndex != inventoryIndex);
    }

}
