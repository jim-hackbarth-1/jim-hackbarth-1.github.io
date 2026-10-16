
export class Barbarian {

    static get name() {
        return "barbarian";
    }

    static get title() {
        return "Barbarian";
    }

    static get htmlPath() {
        return "dnd-5e-core/classes/barbarian.html";
    }

    static get hitDieSize() {
        return 12;
    }

    static get startingEquipment() {
        return `
            <ul>
                <li>(a) a greataxe or (b) any martial melee weapon</li>
                <li>(a) two handaxes or (b) any simple weapon</li>
                <li>An explorer's pack and four javelins</li>
            </ul>
        `;
    }

    static get startingGold() {
        return "2d4 x 10 gp";
    }

    static getMulticlassEligibility(character) {
        const strength = Number(character.getAbilityScore("strength"));
        if (strength >= 13) {
            return {
                isEligible: true,
                ineligibilityReason: null
            };
        }
        return {
            isEligible: false,
            ineligibilityReason: "Strength >= 13 required"
        };
    }

    static get subClassTitle() {
        return "Primal Path";
    }

    static get subClassLevel() {
        return 3;
    }

    static getSelections(character, classIndex) {
        const selections = [];
        if (Number(classIndex) == 0) {
            const selectionName = "barbarian-skill-proficiencies";
            let currentSelections = character.selections.find(s => s.name == selectionName)?.values ?? [];
            if (currentSelections.length == 0) {
                currentSelections = [{ value: null, text: "Choose skill proficiencies ..." }];
            }
            selections.push({
                name: selectionName,
                title: "Skill Proficiencies (choose two)",
                maxSelections: 2,
                currentSelections: currentSelections
            })
        }
        return selections;
    }

    static getSelectionOptions(character, classIndex, selectionName, sources) {
        let options = [];
        if (selectionName == "barbarian-skill-proficiencies") {
            options = [...Barbarian.#skillProficiencies];
            options.unshift({ value: null, text: "Choose skill proficiencies ...", hideCheckbox: true });
            let currentSelections = character.selections.find(s => s.name == selectionName)?.values ?? [];
            currentSelections = currentSelections.map(cs => cs.value);
            for (const option of options) {
                option.isSelected = currentSelections.includes(option.value);
            }
        }
        return options;
    }

    static applyAbilityScoreModifiers(character, classIndex) {
        const modifiers = [];

        const level = Number(character.classes.find(c => c.value == "barbarian").level);
        if (level == 20) {
            modifiers.push({
                name: "barbarian-primal-champion-ability-score-modifier-strength",
                target: "ability-score:strength",
                value: 4,
                title: Barbarian.title
            });
            modifiers.push({
                name: "barbarian-primal-champion-ability-score-modifier-constitution",
                target: "ability-score:constitution",
                value: 4,
                title: Barbarian.title
            });
            modifiers.push({
                name: "barbarian-primal-champion-modified-max-ability-score-modifier-strength",
                target: "modified-max-ability-score:strength",
                value: 4,
                title: Barbarian.title
            });
            modifiers.push({
                name: "barbarian-primal-champion-modified-max-ability-score-modifier-constitution",
                target: "modified-max-ability-score:constitution",
                value: 4,
                title: Barbarian.title
            });
        }

        for (const modifier of modifiers) {
            modifier.sourcePropertyName = `class-${classIndex}`;
            modifier.sourcePropertyValue = Barbarian.name;
            character.addModifier(modifier);
        }
    }

    static applyModifiers(character, classIndex) {
        const modifiers = [];
        if (character.classes[0].value == "barbarian") {
            modifiers.push({
                name: "barbarian-armor-proficiency-light-armor",
                target: "armor-proficiency",
                value: "light-armor",
                title: Barbarian.title
            });
            modifiers.push({
                name: "barbarian-armor-proficiency-medium-armor",
                target: "armor-proficiency",
                value: "medium-armor",
                title: Barbarian.title
            });
        }
        modifiers.push({
            name: "barbarian-armor-proficiency-shield",
            target: "armor-proficiency",
            value: "shield",
            title: Barbarian.title
        });
        modifiers.push({
            name: "barbarian-weapon-type-proficiency-simple-melee",
            target: "weapon-proficiency",
            value: "simple-melee",
            title: Barbarian.title
        });
        modifiers.push({
            name: "barbarian-weapon-type-proficiency-martial-melee",
            target: "weapon-proficiency",
            value: "martial-melee",
            title: Barbarian.title
        });
        modifiers.push({
            name: "barbarian-weapon-type-proficiency-simple-ranged",
            target: "weapon-proficiency",
            value: "simple-ranged",
            title: Barbarian.title
        });
        modifiers.push({
            name: "barbarian-weapon-type-proficiency-martial-ranged",
            target: "weapon-proficiency",
            value: "martial-ranged",
            title: Barbarian.title
        });
        if (character.classes[0].value == "barbarian") {
            const proficiencyBonus = character.getProficiencyBonus();
            modifiers.push({
                name: "barbarian-saving-throw-proficiency-strength",
                target: "saving-throw-proficiency",
                value: "strength",
                title: Barbarian.title
            });
            modifiers.push({
                name: "barbarian-saving-throw-proficiency-constitution",
                target: "saving-throw-proficiency",
                value: "constitution",
                title: Barbarian.title
            });
            const skillProficiencies = character.selections.find(s => s.name == "barbarian-skill-proficiencies")?.values ?? [];
            for (const skillProficiency of skillProficiencies) {
                modifiers.push({
                    name: `barbarian-skill-proficiency-${skillProficiency.value}`,
                    target: "skill-proficiency",
                    value: skillProficiency.value,
                    title: Barbarian.title
                });
            }
        }

        const armorTypes = ["light-armor", "medium-armor", "heavy-armor"];
        const hasArmor = character.equipment.some(e =>
            e.isEquipped
            && e.properties
            && e.properties.some(p => p.name == "armor-type" && armorTypes.includes(p.value)));
        if (character.classes[0].value == "barbarian" && !hasArmor) {
            const acModifier = Number(character.getAbilityScoreModifier("constitution"));
            modifiers.push({
                name: "barbarian-unarmored-defense-armor-class-modifier",
                target: "armor-class",
                value: acModifier,
                title: Barbarian.title
            });
        }

        const level = Number(character.classes.find(c => c.value == "barbarian").level);
        const hasHeavyArmor = character.equipment.some(e =>
            e.isEquipped
            && e.properties
            && e.properties.some(p => p.name == "armor-type" && p.value == "heavy-armor"));
        if (level >= 5 && !hasHeavyArmor) {
            modifiers.push({
                name: "barbarian-fast-movement-speed-modifier",
                target: "speed",
                value: 10,
                title: Barbarian.title
            });
        }

        for (const modifier of modifiers) {
            modifier.sourcePropertyName = `class-${classIndex}`;
            modifier.sourcePropertyValue = Barbarian.name;
            character.addModifier(modifier);
        }
    }

    static applyFeatures(features, character, classIndex) {
        const tempFeatures = [];

        // rage
        const level = Number(character.classes.find(c => c.value == "barbarian").level);
        const hasHeavyArmor = character.equipment.some(e =>
            e.isEquipped
            && e.properties
            && e.properties.some(p => p.name == "armor-type" && p.value == "heavy-armor"));
        if (!hasHeavyArmor) {
            const numberOfRages = Barbarian.#getNumberOfRages(level);
            let rageLimitLabel = "";
            if (numberOfRages != "unlimited") {
                rageLimitLabel = `<p>Once you have raged ${numberOfRages} times, you must finish a long rest before you can rage again.</p>`
            }
            const rageDamage = Barbarian.#getRageDamage(level);
            tempFeatures.push({
                name: "barbarian-rage",
                title: "Rage",
                html: `
                    <p>In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action.</p>
                    <p>While raging, you gain the following benefits if you aren't wearing heavy armor:</p>
                    <ul>
                        <li>You have advantage on Strength checks and Strength saving throws.</li>
                        <li>When you make a melee weapon attack using Strength, you gain a +${rageDamage} bonus to the damage roll.</li>
                        <li>You have resistance to bludgeoning, piercing, and slashing damage.</li>
                    </ul>
                    <p>If you are able to cast spells, you can't cast them or concentrate on them while raging.</p>
                    <p>Your rage lasts for 1 minute. It ends early if you are knocked unconscious or if your turn ends and you haven't attacked a hostile creature since your last turn or taken damage since then. You can also end your rage on your turn as a bonus action.</p>
                    ${rageLimitLabel}
                `,
                source: {
                    name: "class",
                    title: Barbarian.title
                },
                displayType: "feature-card"
            });
        }

        const armorTypes = ["light-armor", "medium-armor", "heavy-armor"];
        const hasArmor = character.equipment.some(e =>
            e.isEquipped
            && e.properties
            && e.properties.some(p => p.name == "armor-type" && armorTypes.includes(p.value)));
        if (character.classes[0].value == "barbarian" && !hasArmor) {
            tempFeatures.push({
                name: "barbarian-unarmored-defense",
                title: "Unarmored Defense",
                html: `
                    <p>While you are not wearing any armor, your armor class equals 10 + your Dexterity modifier + your Constitution modifier. You can use a shield and still gain this benefit.</p>
                    `,
                source: {
                    name: "class",
                    title: Barbarian.title
                },
                displayType: "feature-card"
            });
        }

        if (level >= 2) {
            tempFeatures.push({
                name: "barbarian-reckless-attack",
                title: "Reckless Attack",
                html: `
                    <p>You can throw aside all concern for defense to attack with fierce desperation. When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.</p>
                    `,
                source: {
                    name: "class",
                    title: Barbarian.title
                },
                displayType: "feature-card"
            });
            tempFeatures.push({
                name: "barbarian-danger-sense",
                title: "Danger Sense",
                html: `
                    <p>You gain an uncanny sense of when things nearby aren't as they should be, giving you an edge when you dodge away from danger. You have advantage on Dexterity saving throws against effects that you can see, such as traps and spells. To gain this benefit, you can't be blinded, deafened, or incapacitated.</p>
                    `,
                source: {
                    name: "class",
                    title: Barbarian.title
                },
                displayType: "feature-card"
            });
        }
        if (character.classes[0].value == "barbarian" && level >= 5) {
            tempFeatures.push({
                name: "barbarian-extra-attack",
                title: "Extra Attack",
                html: `
                    <p>You can attack twice, instead of once, whenever you take the Attack action on your turn.</p>
                    `,
                source: {
                    name: "class",
                    title: Barbarian.title
                },
                displayType: "feature-card"
            });
        }
        if (level >= 5 && !hasHeavyArmor) {
            tempFeatures.push({
                name: "barbarian-fast-movement",
                title: "Fast Movement",
                html: `
                    <p>Your speed increases by 10 feet while you aren't wearing heavy armor.</p>
                    `,
                source: {
                    name: "class",
                    title: Barbarian.title
                },
                displayType: "feature-card"
            });
        }
        if (level >= 7) {
            tempFeatures.push({
                name: "barbarian-feral-instinct",
                title: "Feral Instinct",
                html: `
                    <p>Your instincts are so honed that you have advantage on initiative rolls.</p>
                    <p>Additionally, if you are surprised at the beginning of combat and aren't incapacitated, you can act normally on your first turn, but only if you enter your rage before doing anything else on that turn.</p>
                    `,
                source: {
                    name: "class",
                    title: Barbarian.title
                },
                displayType: "feature-card"
            });
        }
        if (level >= 9) {
            let brutalCriticalDamageDice = "one";
            let die = "die";
            if (level >= 13) {
                brutalCriticalDamageDice = "two";
                die = "dice"
            }
            if (level >= 17) {
                brutalCriticalDamageDice = "three";
                die = "dice"
            }
            tempFeatures.push({
                name: "barbarian-brutal-critical",
                title: "Brutal Critical",
                html: `
                    <p>You can roll ${brutalCriticalDamageDice} additional weapon damage ${die} when determining the extra damage for a critical hit with a melee attack.</p>
                    `,
                source: {
                    name: "class",
                    title: Barbarian.title
                },
                displayType: "feature-card"
            });
        }
        if (level >= 11) {
            tempFeatures.push({
                name: "barbarian-relentless-rage",
                title: "Relentless Rage",
                html: `
                    <p>Your rage can keep you fighting despite grievous wounds. If you drop to 0 hit points while you're raging and don't die outright, you can make a DC 10 Constitution saving throw. If you succeed, you drop to 1 hit point instead.</p>
                    <p>Each time you use this feature after the first, the DC increases by 5. When you finish a short or long rest, the DC resets to 10.</p>
                    `,
                source: {
                    name: "class",
                    title: Barbarian.title
                },
                displayType: "feature-card"
            });
        }
        if (level >= 15) {
            tempFeatures.push({
                name: "barbarian-persistent-rage",
                title: "Persistent Rage",
                html: `
                    <p>Your rage is so fierce that it ends early only if you fall unconscious or if you choose to end it.</p>
                    `,
                source: {
                    name: "class",
                    title: Barbarian.title
                },
                displayType: "feature-card"
            });
        }
        if (level >= 18) {
            tempFeatures.push({
                name: "barbarian-indomitable-might",
                title: "Indomitable Might",
                html: `
                    <p>If your total for a Strength check is less than your Strength score, you can use that score in place of the total.</p>
                    `,
                source: {
                    name: "class",
                    title: Barbarian.title
                },
                displayType: "feature-card"
            });
        }

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `class-${classIndex}`;
            feature.sourcePropertyValue = Barbarian.name
            features.push(feature);
        }
           
    }

    static applySpells(spells, character, classIndex) {

    }

    static #skillProficiencies = [
        { value: "animal-handling", text: "Animal Handling" },
        { value: "athletics", text: "Athletics" },
        { value: "intimidation", text: "Intimidation" },
        { value: "nature", text: "Nature" },
        { value: "perception", text: "Perception" },
        { value: "survival", text: "Survival" }
    ];

    static #getNumberOfRages(level) {
        let count = 2;
        if (level >= 3) {
            count++;
        }
        if (level >= 6) {
            count++;
        }
        if (level >= 12) {
            count++;
        }
        if (level >= 17) {
            count++;
        }
        if (level >= 20) {
            count = "unlimited"
        }
        return count;
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
