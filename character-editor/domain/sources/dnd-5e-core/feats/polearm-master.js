
import { DnD5ESource } from "../dnd-5e-core-source.js"

export class PolearmMaster {

    static get name() { return "polearm-master"; }
    static get title() { return "Polearm Master"; }
    static get canBeTakenMultipleTimes() { return false; }
    static get html() { return DnD5ESource.getFeatHtml(PolearmMaster, PolearmMaster.#content); }

    static checkPrerequisites(character) {
        return { prerequisitesMet: true, text: null };
    }

    static getSelections(character, classIndex, level) {
        return [];
    }

    static getSelectionOptions(character, classIndex, level, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, classIndex, level, targetFilters) {

    }

    static applyFeatures(features, character, classIndex, level) {
        const tempFeatures = [];
        const polearms = ["glaive", "halberd", "quarterstaff", "spear"];
        const polearm = character.equipment.find(e =>
            e.isEquipped
            && e.properties
            && e.properties.some(p => p.name == "weapon-name" && polearms.includes(p.value)));
        if (polearm) {
            const polearmTitle = polearm.properties.find(p => p.name == "weapon-title")?.value ?? "Polearm";
            const haft = {
                name: `${PolearmMaster.name}-bonus-attack`,
                title: `${polearmTitle} - bonus attack`,
                properties: [
                    { name: "weapon-name", value: `${PolearmMaster.name}-bonus-attack` },
                    { name: "damage-dice", value: "1d4" },
                    { name: "damage-type", value: "bludgeoning" }
                ]
            };
            const haftCard = character.getWeaponAttackCard(-1, haft);
            haftCard.attacks[0].notes.push("Bonus action")
            tempFeatures.push(haftCard);
        }
        tempFeatures.push(character.getFeatureCard(PolearmMaster.name, PolearmMaster.title, PolearmMaster.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
            feature.sourcePropertyValue = PolearmMaster.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex, level) {

    }

    static #content = `
        <p>You gain the following benefits:</p>
        <ul>
            <li>When you take the Attack action and attack with only a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end of the weapon. This attack uses the same ability modifier as the primary attack. The weapon's damage die for this attack is a d4, and it deals bludgeoning damage.</li>
            <li>While you are wielding a glaive, halberd, pike, quarterstaff, or spear, other creatures provoke an opportunity attack from you when they enter the reach you have with that weapon.</li>
        </ul>
    `;

}
