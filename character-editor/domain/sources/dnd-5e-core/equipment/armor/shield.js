
export class Shield {

    static get name() {
        return "shield";
    }

    static get title() {
        return "Shield";
    }

    static get category() {
        return "armor";
    }

    static get armorType() {
        return "shield";
    }

    static get properties() {
        return ["Cost: 10gp", "Armor Class: +2"];
    }

    static get canBeEquipped() {
        return true;
    }

    static get html() {
        return "";
    }

    static getOptions(character, inventoryIndex) {
        return [];
    }

    static equip(character, inventoryIndex) {
        // let shieldIndex = character.equipment.findIndex(e =>
        //     e.isEquipped
        //     && e.properties
        //     && e.properties.some(p => p.name == "armor-type" && p.value == "shield"));
        // if (shieldIndex > -1 && shieldIndex != inventoryIndex) {
        //     return;
        // }
        const item = character.equipment[inventoryIndex];
        item.properties = [
            { name: "armor-name", value: "shield" },
            { name: "armor-type", value: "shield" }
        ];
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: "shield-ac-modifier",
                target: "armor-class",
                value: 2,
                title: Shield.title
            });
        }
        for (const modifier of modifiers) {
            modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
            modifier.sourcePropertyValue = Shield.name;
            character.addModifier(modifier);
        }
    }

    static applyFeatures(features, character, inventoryIndex) {

    }

}
