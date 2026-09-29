
import { Character, Sources, Utilities } from "../../../domain/references.js";
import { EditorViewModel } from "../../editor-view/editor-view.js";

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
        await this.#presentEquipmentList();
    }

    async onCharacterUpdate(message) {
        DomainEquipmentModel.#character = Character.currentCharacter;
        // const oldCharacter = DomainRaceModel.#character;
        // const currentCharacter = Character.currentCharacter;
        // const sourcesUpdated = !Utilities.areArraysEqual(oldCharacter.sources, currentCharacter.sources);  
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
        await this.#presentEquipmentList();
    }

    // static cache variable?
    getEquipment() {
        let equipment = [];
        if (DomainEquipmentModel.#equipmentCategory) {
            equipment = Sources.getEquipment(DomainEquipmentModel.#character.sources, DomainEquipmentModel.#equipmentCategory);
        }
        console.log(equipment);
        if (equipment.length == 0) {
            equipment.push({ properties: ["[No equipment]"] });
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

    async addItem(event) {
        console.log("add equipment");
    }

    getInventory() {
        let inventory = [];

        inventory = [
            {
                index: 0,
                name: "item-1",
                title: "Item 1",
                // properties: ["prop1", "prop2", "prop3"],
                options: ["a", "b", "c"],
                source: { title: "Blah" }
            },
            {
                index: 1,
                name: "item-2",
                title: "Item 2",
                html: "abc"
            },
            {
                index: 2,
                name: "item-3",
                title: "Item 3",
                html: "def",
                options: ["a", "b", "c"]
            }
        ];

        if (inventory.length == 0) {
            inventory.push({ properties: ["[No inventory]"] });
        }
        return inventory;
    }

    async toggleEquip(event, inventoryIndex) {
        console.log("toggle equip");
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
            // const html = await Sources.getEquipmentHtml(DomainEquipmentModel.#character.sources, name);
            const html = "blah";
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

    async removeItem(event) {
        console.log("remove equipment");
    }

    async #presentEquipmentList() {
        await UIKit.renderer.renderElement(this.#kitElement.querySelector("#add-equipment-list"));
    }

}
