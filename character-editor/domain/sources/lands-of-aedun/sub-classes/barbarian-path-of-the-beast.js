
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

    static getSelectionOptions(character, classIndex, selectionName) {
        return [];
    }

    static applyModifiers(character, classIndex) {
        
    }

    static applyFeatures(features, character, classIndex) {
        const tempFeatures = [];
        const characterClass = character.classes.find(c => c.value == "barbarian");
        if (characterClass.level >= 3) {
            // beast form
            tempFeatures.push({
                name: "barbarian-path-of-the-beast-beast-form",
                displayType: "card",
                html: `
                    <h3>Beast form</h3>
                    <p>
                        You physically transform to an animal-hybrid form when entering a rage.  When entering this form you gain the following benefits:
                        <ul>
                            <li>1d12 + Constitution modifier of temporary hit points which lasts while raging.</li>
                            <li>+1 bonus to your armor class.</li>
                            <li>As a bonus action, make an unarmed bite attack for 1d6 + Strength and Rage modifiers piercing damage.</li>
                        </ul>
                    </p>
                    `
            });
            const attackCard = character.getAttackCard({
                name: "barbarian-path-of-the-beast-beast-form-attack",
                title: "Beast Form Bite",
                damageDieSize: 6,
                damageType: "piercing"
            });
            tempFeatures.push(attackCard);
        }
        if (characterClass.level >= 6) {
            // beast sense
            tempFeatures.push({
                name: "barbarian-path-of-the-beast-beast-sense",
                displayType: "card",
                html: `
                    <h3>Beast sense</h3>
                    <p>
                        You gain the following additional benefits when in beast form:
                        <ul>
                            <li>You have advantage on all Wisdom checks.</li>
                            <li>You gain darkvision.  You can see in dim light within 60 feet as if it were bright daylight and in darkness as if it were dim light.</li>
                        </ul>
                    </p>`
            });
        }
        if (characterClass.level >= 10) {
            // beast agility
            tempFeatures.push({
                name: "barbarian-path-of-the-beast-beast-agility",
                displayType: "card",
                html: `
                    <h3>Beast agility</h3>
                    <p>
                        You gain the following additional benefits when in beast form:
                        <ul>
                            <li>Movement through non-magical difficult terrain costs you no extra movement.</li>
                            <li>You can move stealthily at a normal pace.</li>
                            <li>Opponents have disadvantage on opportunity attacks.</li>
                            <li>You can take the Dash action as a bonus action.</li>
                        </ul>
                    </p>`
            });
        }
        if (characterClass.level >= 14) {
            // blood sense
            tempFeatures.push({
                name: "barbarian-path-of-the-beast-blood-sense",
                displayType: "card",
                html: `
                    <h3>Blood sense</h3>
                    <p>
                        You gain the following additional benefits when in beast form:
                        <ul>
                            <li>You are aware of the location of creatures within 30 feet of you that you cannot see and attacking such a creature does not impose disadvantage.</li>
                            <li>After taking damage from a creature within 5 feet of you, you may use your reaction to make a bite attack.</li>
                        </ul>
                    </p>`
            });
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `subClass-${classIndex}`;
            feature.sourcePropertyValue = BarbarianPathOfTheBeast.name
            features.push(feature);
        }
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
