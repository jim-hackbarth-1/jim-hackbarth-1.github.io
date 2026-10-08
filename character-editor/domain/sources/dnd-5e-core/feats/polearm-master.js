
export class PolearmMaster {

    static get name() {
        return "polearm-master";
    }

    static get title() {
        return "Polearm Master";
    }

    static get html() {
        return `
        <div class="dnd-5e-content">
            <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
            <h3>Polearm Master</h3>
            <hr/>
            <div class="content">
                <p>You gain the following benefits:</p>
                <ul>
                    <li>When you take the Attack action and attack with only a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end of the weapon. This attack uses the same ability modifier as the primary attack. The weapon's damage die for this attack is a d4, and it deals bludgeoning damage.</li>
                    <li>While you are wielding a glaive, halberd, pike, quarterstaff, or spear, other creatures provoke an opportunity attack from you when they enter the reach you have with that weapon.</li>
                </ul>
            </div>
        </div>
        `;
    }

    static get canBeTakenMultipleTimes() {
        return false;
    }

    static checkPrerequisites(character) {
        return { prerequisitesMet: true, text: null };
    }

    static getSelections(character, classIndex, level) {
        return [];
    }

    static getSelectionOptions(character, classIndex, level, selectionName) {
        return [];
    }

    static applyModifiers(character, classIndex, level) {

    }

    static applyFeatures(features, character, classIndex, level) {
        const tempFeatures = [];
        tempFeatures.push({
            name: `class-${classIndex}-level-${level}-feat`,
            displayType: "card",
            html: `
                <h3>Polearm Master</h3>
                <hr/>
                <div class="content">
                    <p>You gain the following benefits:</p>
                    <ul>
                        <li>When you take the Attack action and attack with only a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end of the weapon. This attack uses the same ability modifier as the primary attack. The weapon's damage die for this attack is a d4, and it deals bludgeoning damage.</li>
                        <li>While you are wielding a glaive, halberd, pike, quarterstaff, or spear, other creatures provoke an opportunity attack from you when they enter the reach you have with that weapon.</li>
                    </ul>
                </div>
                `
        });
        const polearms = ["glaive", "halberd", "quarterstaff", "spear"];
        const polearmIndex = character.equipment.findIndex(e =>
            e.isEquipped
            && e.properties
            && e.properties.includes(p.name == "weapon-name" && polearms.includes(p.value)));
        if (polearmIndex > -1) {
            const properties = character.equipment[polearmIndex].properties ?? [];
            const weaponName = properties.find(p => p.name == "weapon-name")?.value;
            let reach = (weaponName == "glaive" || weaponName == "halberd") ? 5 : null;
            const attackCard = character.getAttackCard({
                name: "polearm-master-bonus-attack",
                title: "Polearm master bonus attack",
                inventoryIndex: polearmIndex,
                damageDieSize: 4,
                damageType: "bludgeoning",
                reach: reach,
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
            feature.sourcePropertyValue = PolearmMaster.name
            features.push(feature);
        }
    }

}
