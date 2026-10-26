
export class AlchemistsFireFlask {

    static get name() {
        return "alchemists-fire-flask";
    }

    static get title() {
        return "Alchemist's Fire (flask)";
    }

    static get category() {
        return "adventuring-gear";
    }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 50gp"];
    }

    static get canBeEquipped() {
        return true;
    }

    static get html() {
        return `
        <div class="dnd-5e-content">
            <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
            <h3>Alchemist's Fire (flask)</h3>
            <hr/>
            <p class="content">
                This sticky, adhesive fluid ignites when exposed to air. As an action, you can throw this flask up to 20 feet, shattering it on impact. Make a ranged attack against a creature or object, treating the alchemist's fire as an improvised weapon. On a hit, the target takes 1d4 fire damage at the start of each of its turns. A creature can end this damage by using its action to make a DC 10 Dexterity check to extinguish the flames.
            </p>
        </div>
        `;
    }

    static getSelections(character, inventoryIndex) {
        return []
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            const attackCard = character.getAttackCard({
                name: AlchemistsFireFlask.name,
                title: AlchemistsFireFlask.title,
                inventoryIndex: inventoryIndex,
                range: "range 20 ft.",
                applyProficiencyModifier: false,
                notes: [
                    "The target takes 1d4 fire damage at the start of each of its turns.",
                    "A creature can end this damage by using its action to make a DC 10 Dexterity check to extinguish the flames."
                ]
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = AlchemistsFireFlask.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
