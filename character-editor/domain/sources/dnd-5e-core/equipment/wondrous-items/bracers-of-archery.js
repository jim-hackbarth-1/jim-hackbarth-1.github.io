
export class BracersOfArchery {

    static get name() {
        return "bracers-of-archery";
    }

    static get title() {
        return "Bracers of Archery";
    }

    static get category() {
        return "wondrous-items";
    }

    static get properties() {
        return [];
    }

    static get canBeEquipped() {
        return true;
    }

    static get html() {
        return "<p>While wearing these bracers, you have proficiency with the longbow and shortbow, and you gain a +2 bonus to damage rolls on ranged attacks made with such weapons.</p>";
    }

    static getSelections(character, inventoryIndex) {
        return []
    }

    static getSelectionOptions(character, inventoryIndex,selectionName) {
        return [];
    }

    static applyModifiers(character, inventoryIndex) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: "bracers-of-archery-proficiency-shortbow",
                target: "weapon-proficiency",
                value: "shortbow",
                title: BracersOfArchery.title
            });
            modifiers.push({
                name: "bracers-of-archery-proficiency-longbow",
                target: "weapon-proficiency",
                value: "longbow",
                title: BracersOfArchery.title
            });
            modifiers.push({
                name: "bracers-of-archery-damage-modifier",
                target: "damage",
                value: 2,
                title: BracersOfArchery.title,
                conditions: [
                    {
                        name: "weapon-type",
                        values: ["simple-ranged", "martial-ranged"]
                    }
                ]
            });
        }
        for (const modifier of modifiers) {
            modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
            modifier.sourcePropertyValue = BracersOfArchery.name;
            character.addModifier(modifier);
        }
    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push({
                name: `equipment-${inventoryIndex}`,
                displayType: "card",
                html: `
                    <h3>${BracersOfArchery.title}</h3>
                    <hr/>
                    <p>While wearing these bracers, you have proficiency with the longbow and shortbow, and you gain a +2 bonus to damage rolls on ranged attacks made with such weapons.</p>
                    `
            });
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = BracersOfArchery.name
            features.push(feature);
        }
    }

}
