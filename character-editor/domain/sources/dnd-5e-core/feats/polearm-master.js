
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

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

    static getOptions(character, classIndex, level) {
        return [];
    }

    static updateFeatures(character) {
        const features = [];
        features.push({
            name: "polearm-master",
            title: "Polearm Master",
            displayStyle: "card",
            html: `
                <p>When you take the Attack action and attack with only a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end of the weapon.</p>
                <p>While you are wielding a glaive, halberd, pike, quarterstaff, or spear, other creatures provoke an opportunity attack from you when they enter the reach you have with that weapon.</p>
            `
        });

        const polearms = ["glaive", "halberd", "quarterstaff", "spear"];
        const polearmIndex = character.equipment.findIndex(e => e.isEquipped && polearms.includes(e.weaponName));
        if (polearmIndex > -1) {
            const toHitLabel = DnD5EUtilities.getToHitLabel(character.getWeaponToHitModifier(polearmIndex));
            const damageModifier = character.getWeaponDamageModifier(polearmIndex);
            const damageLabel = DnD5EUtilities.getDamageLabel([{ number: 1, size: 4 }], damageModifier, "bludgeoning");
            const polearm = character.equipment[polearmIndex];
            let range = (polearm.weaponName == "glaive" || polearm.weaponName == "halberd") ? 5 : null;
            let html = DnD5EUtilities.getMeleeAttackCardHtml("Polearm master bonus attack", toHitLabel, damageLabel, reach);
            features.push({
                name: "polearm-master-bonus-attack",
                title: "Polearm Master Bonus Attack",
                displayStyle: "attack-card",
                html: html
            })
        }
        
        for (const feature of features) {
            feature.sourcePropertyName = "feat";
            feature.sourcePropertyValue = "polearm-master";
            character.addFeature(feature);
        }
    }

}
