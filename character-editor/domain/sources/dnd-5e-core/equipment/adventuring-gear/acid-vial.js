
export class AcidVial {

    static get name() {
        return "acid-vial";
    }

    static get title() {
        return "Acid (vial)";
    }

    static get category() {
        return "adventuring-gear";
    }

    static get properties() {
        return ["Cost: 25gp"];
    }

    static get canBeEquipped() {
        return true;
    }

    static get html() {
        return `
        <div class="dnd-5e-content">
            <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
            <h3>Acid (vial)</h3>
            <hr/>
            <p class="content">
                As an action, you can splash the contents of this vial onto a creature within 5 feet of you or throw the vial up to 20 feet, shattering it on impact. In either case, make a ranged attack against a creature or object, treating the acid as an improvised weapon. On a hit, the target takes 2d6 acid damage.
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

    static applyModifiers(character, inventoryIndex) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            const attackCard = character.getAttackCard({
                name: AcidVial.name,
                title: AcidVial.title,
                inventoryIndex: inventoryIndex,
                damageDice: [{ number: 2, size: 6 }],
                damageType: "acid",
                range: "range 20 ft.",
                applyProficiencyModifier: false,
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = AcidVial.name
            features.push(feature);
        }
    }

}
