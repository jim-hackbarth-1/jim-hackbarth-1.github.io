
export class EquipmentPackExplorer {

    static get name() {
        return "equipment-pack-explorer";
    }

    static get title() {
        return "Equipment pack - Explorer";
    }

    static get category() {
        return "adventuring-gear";
    }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 10gp"];
    }

    static get canBeEquipped() {
        return false;
    }

    static get html() {
        return `
        <div class="dnd-5e-content">
            <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
            <h3>Explorer's Pack</h3>
            <hr/>
            <p class="content">
                Backpack, a bedroll, a mess kit, a tinderbox, 10 torches, 10 days of rations, and a waterskin. The pack also has 50 feet of hempen rope strapped to the side of it.
            </p>
        </div>
        `;
    }

    static getSelections(character, inventoryIndex) {
        return [];
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        tempFeatures.push({
            name: EquipmentPackExplorer.name,
            title: EquipmentPackExplorer.title,
            html: `
                <p>Backpack, a bedroll, a mess kit, a tinderbox, 10 torches, 10 days of rations, and a waterskin. The pack also has 50 feet of hempen rope strapped to the side of it.</p>
                `,
            source: { name: "equipment" },
            displayType: "feature-card"
        });
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = EquipmentPackExplorer.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
