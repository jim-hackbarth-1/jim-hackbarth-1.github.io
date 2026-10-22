
export class HerbalismKit {

    static get name() {
        return "herbalism-kit";
    }

    static get title() {
        return "Herbalism kit";
    }

    static get category() {
        return "tools";
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
            <h3>Herbalism kit</h3>
            <hr/>
            <p class="content">
                This kit contains a variety of instruments such as clippers, mortar and pestle, and Pouches and Vials used by herbalists to create remedies and Potions. Proficiency with this kit lets you add your proficiency bonus to any ability checks you make to identify or apply herbs. Also, proficiency with this kit is required to create Antitoxin and any Potion of Healing.
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
            name: HerbalismKit.name,
            title: HerbalismKit.title,
            html: `
                <p>This kit contains a variety of instruments such as clippers, mortar and pestle, and Pouches and Vials used by herbalists to create remedies and Potions. Proficiency with this kit lets you add your proficiency bonus to any ability checks you make to identify or apply herbs. Also, proficiency with this kit is required to create Antitoxin and any Potion of Healing.</p>
                `,
            source: { name: "equipment" },
            displayType: "feature-card"
        });
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = HerbalismKit.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
