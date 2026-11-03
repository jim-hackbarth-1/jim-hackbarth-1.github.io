
export class BarbarianPathOfTheBeast {

    static get name() {
        return "barbarian-path-of-the-beast";
    }

    static get title() {
        return "Path of the Beast";
    }

    static get htmlPath() {
        return "lands-of-aedun/sub-classes/barbarian-path-of-the-beast.html";
    }

    static get className() {
        return "barbarian";
    }

    static getSelections(character, classIndex) {
        return [];
    }

    static getSelectionOptions(character, classIndex, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, classIndex, targetFilters) {
        
    }

    static applyFeatures(features, character, classIndex) {
        const tempFeatures = [];
        const characterClass = character.classes.find(c => c.value == "barbarian");

        // beast form
        if (characterClass.level >= 3) {
            const conModifier = Number(character.getAbilityScoreModifier("constitution"));
            let conModifierLabel = "";
            if (conModifier > 0) {
                conModifierLabel = ` + ${conModifier}`;
            }
            if (conModifier < 0) {
                conModifierLabel = ` - ${Math.abs(conModifier)}`;
            }
            const beastFormHtml = `
                <p>
                    You physically transform to an animal-hybrid form when entering a rage.  When entering this form you gain the following benefits:
                    <ul>
                        <li>1d12${conModifierLabel} of temporary hit points which lasts while raging.</li>
                        <li>+1 bonus to your armor class.</li>
                        <li>As a bonus action, make an unarmed bite attack for 1d6 + Strength and Rage modifiers piercing damage.</li>
                    </ul>
                </p>
            `;
            const attackInfo = character.getAttackInfo({
                attackAbility: "strength",
                target: "to-hit",
                damageDice: "1d6",
                damageType: "piercing",
                notes: ["Bonus action"]
            });
            tempFeatures.push(character.getFeatureCard(
                `${BarbarianPathOfTheBeast.name}-beast-form`, "Beast form", beastFormHtml, BarbarianPathOfTheBeast.title, attackInfo));
        }

        // beast sense
        if (characterClass.level >= 6) {
            const beastSenseHtml = `
                <p>
                    You gain the following additional benefits when in beast form:
                    <ul>
                        <li>You have advantage on all Wisdom checks.</li>
                        <li>You gain darkvision.  You can see in dim light within 60 feet as if it were bright daylight and in darkness as if it were dim light.</li>
                    </ul>
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${BarbarianPathOfTheBeast.name}-beast-sense`, "Beast sense", beastSenseHtml));
        }

        // beast agility
        if (characterClass.level >= 10) {   
            const beastAgilityHtml = `
                <p>
                    You gain the following additional benefits when in beast form:
                    <ul>
                        <li>Movement through non-magical difficult terrain costs you no extra movement.</li>
                        <li>You can move stealthily at a normal pace.</li>
                        <li>Opponents have disadvantage on opportunity attacks.</li>
                        <li>You can take the Dash action as a bonus action.</li>
                    </ul>
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${BarbarianPathOfTheBeast.name}-beast-agility`, "Beast agility", beastAgilityHtml));
        }

        // blood sense
        if (characterClass.level >= 14) {
            const bloodSenseHtml = `
                <p>
                    You gain the following additional benefits when in beast form:
                    <ul>
                        <li>You are aware of the location of creatures within 30 feet of you that you cannot see and attacking such a creature does not impose disadvantage.</li>
                        <li>After taking damage from a creature within 5 feet of you, you may use your reaction to make a bite attack.</li>
                    </ul>
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${BarbarianPathOfTheBeast.name}-blood-sense`, "Blood sense", bloodSenseHtml));
        }

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `subClass-${classIndex}`;
            feature.sourcePropertyValue = BarbarianPathOfTheBeast.name;
            feature.cardSource = BarbarianPathOfTheBeast.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex) {

    }

    static getSpellCastingInfo(character, allSpells, classSpellCastingInfo) {
        return classSpellCastingInfo;
    }

    static #getRageDamage(level) {
        let rageDamage = 2;
        if (level >= 9) {
            rageDamage = 3;
        }
        if (level >= 16) {
            rageDamage = 4;
        }
        return rageDamage;
    }

}
