import { DnD5EUtilities } from "../dnd-5e-core-utilities.js";

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

    static getOptions(character) {

        const options = [];

        // skill proficiences
        if (character.classes[0].name == "barbarian") {
            let optionName = "barbarian-skill-proficiencies";
            let optionValues = [...Barbarian.#skillProficiencies];
            optionValues.unshift({ value: null, text: "Choose skill proficiencies ...", hideCheckbox: true });
            let selections = character.options.find(o => o.name == optionName)?.values ?? [];
            for (const optionValue of optionValues) {
                optionValue.isSelected = selections.includes(optionValue.value);
            }
            options.push({
                name: optionName,
                title: "Skill Proficiencies (choose two)",
                maxSelections: 2,
                optionValues: optionValues
            });
        }

        return options;
    }

    static updateFeatures(character) {

        const features = [];
        if (character.classes[0].name == "barbarian") {
            features.push({
                name: "barbarian-armor-proficiency-light-armor",
                title: "Light armor",
                modifier: "armor-proficiency",
                modifierValue: "light-armor",
                displayStyle: "none"
            });
            features.push({
                name: "barbarian-armor-proficiency-medium-armor",
                title: "Medium armor",
                modifier: "armor-proficiency",
                modifierValue: "medium-armor",
                displayStyle: "none"
            });
        }
        features.push({
            name: "barbarian-armor-proficiency-shield",
            title: "Shields",
            modifier: "armor-proficiency",
            modifierValue: "shield",
            displayStyle: "none"
        });
        features.push({
            name: "barbarian-weapon-type-proficiency-simple-melee",
            title: "Simple melee weapons",
            modifier: "weapon-proficiency",
            modifierValue: "simple-melee",
            displayStyle: "none"
        });
        features.push({
            name: "barbarian-weapon-type-proficiency-martial-melee",
            title: "Martial melee weapons",
            modifier: "weapon-proficiency",
            modifierValue: "martial-melee",
            displayStyle: "none"
        });
        features.push({
            name: "barbarian-weapon-type-proficiency-simple-ranged",
            title: "Simple ranged weapons",
            modifier: "weapon-proficiency",
            modifierValue: "simple-ranged",
            displayStyle: "none"
        });
        features.push({
            name: "barbarian-weapon-type-proficiency-martial-ranged",
            title: "Martial ranged weapons",
            modifier: "weapon-proficiency",
            modifierValue: "martial-ranged",
            displayStyle: "none"
        });
        if (character.classes[0].name == "barbarian") {
            const proficiencyBonus = character.getProficiencyBonus();
            features.push({
                name: "barbarian-saving-throw-proficiency-strength",
                title: "Strength",
                modifier: "saving-throw-proficiency:strength",
                modifierValue: proficiencyBonus,
                displayStyle: "none"
            });
            features.push({
                name: "barbarian-saving-throw-proficiency-constitution",
                title: "Constitution",
                modifier: "saving-throw-proficiency:constitution",
                modifierValue: proficiencyBonus,
                displayStyle: "none"
            });
            const skillProficiencies = character.options.find(o => o.name == "barbarian-skill-proficiencies")?.values ?? [];
            for (const skillProficiency of skillProficiencies) {
                features.push({
                    name: `barbarian-skill-proficiency-${skillProficiency}`,
                    title: Barbarian.#skillProficiencies.find(sp => sp.value == skillProficiency).text,
                    modifier: `skill-proficiency:${skillProficiency}`,
                    modifierValue: proficiencyBonus,
                    displayStyle: "none"
                });
            }
        }

        // rage
        const level = Number(character.classes.find(c => c.name == "barbarian").level);
        const hasHeavyArmor = character.equipment.some(e => e.isEquipped && e.armorType == "heavy-armor");
        if (!hasHeavyArmor) {
            let rageCount = 2;
            let rageDamage = 2;
            if (level >= 3) {
                rageCount = 3;
            }
            if (level >= 6) {
                rageCount = 4;
            }
            if (level >= 9) {
                rageDamage = 3;
            }
            if (level >= 12) {
                rageCount = 5;
            }
            if (level >= 16) {
                rageDamage = 4;
            }
            if (level >= 17) {
                rageCount = 6;
            }
            if (level == 20) {
                rageCount = null;
            }
            let rageHtml = `
            <p>In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action.</p>
            <p>While raging, you gain the following benefits if you aren't wearing heavy armor:</p>
            <ul>
                <li>You have advantage on Strength checks and Strength saving throws.</li>
                <li>When you make a melee weapon attack using Strength, you gain a +${rageDamage} bonus to the damage roll.</li>
                <li>You have resistance to bludgeoning, piercing, and slashing damage.</li>
            </ul>
            <p>If you are able to cast spells, you can't cast them or concentrate on them while raging.</p>
            <p>Your rage lasts for 1 minute. It ends early if you are knocked unconscious or if your turn ends and you haven't attacked a hostile creature since your last turn or taken damage since then. You can also end your rage on your turn as a bonus action.</p>`;
            if (rageCount) {
                rageHtml += `<p>Once you have raged ${rageCount} times, you must finish a long rest before you can rage again.</p>`
            }
            features.push({
                name: "barbarian-rage",
                title: "Rage",
                displayStyle: "card",
                html: rageHtml
            });
        }

        const armorTypes = ["light-armor", "medium-armor", "heavy-armor"];
        const hasArmor = character.equipment.some(e => e.isEquipped && armorTypes.includes(e.armorType));
        if (character.classes[0].name == "barbarian" && !hasArmor) {
            const acModifier = 2 + Number(character.getAbilityScoreModifier("constitution"));
            features.push({
                name: "barbarian-unarmored-defense",
                title: "Unarmored Defense",
                displayStyle: "bullet"
            });
            features.push({
                name: "barbarian-unarmored-defense-armor-class-modifier",
                title: "Unarmored Defense - Armor class modifier",
                modifier: "armor-class",
                modifierValue: acModifier,
                displayStyle: "none"
            });
        }

        if (level >= 2) {
            features.push({
                name: "barbarian-reckless-attack",
                title: "Reckless Attack",
                displayStyle: "card",
                html: "<p>When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.</p>"
            });
            features.push({
                name: "barbarian-danger-sense",
                title: "Danger Sense",
                displayStyle: "card",
                html: "<p>You have advantage on Dexterity saving throws against effects that you can see, such as traps and spells. To gain this benefit, you can't be blinded, deafened, or incapacitated.</p>"
            });
        }
        if (character.classes[0].name == "barbarian" && level >= 5) {
            features.push({
                name: "barbarian-extra-attack",
                title: "Extra Attack",
                displayStyle: "card",
                html: "<p>You can attack twice, instead of once, whenever you take the Attack action on your turn.</p>"
            });
        }
        if (level >= 5 && !hasHeavyArmor) {
            features.push({
                name: "barbarian-fast-movement",
                title: "Fast Movement",
                displayStyle: "bullet"
            });
            features.push({
                name: "barbarian-fast-movement-speed-modifier",
                title: "Fast Movement - Speed modifier",
                modifier: "speed",
                modifierValue: 10,
                displayStyle: "none"
            });
        }
        if (level >= 7) {
            const feralInstinctHtml = `
                <p>You have advantage on initiative rolls.</p>
                <p>Additionally, if you are surprised at the beginning of combat and aren't incapacitated, you can act normally on your first turn, but only if you enter your rage before doing anything else on that turn.</p>`;
            features.push({
                name: "barbarian-feral-instinct",
                title: "Feral Instinct",
                displayStyle: "card",
                html: feralInstinctHtml
            });
        }
        if (level >= 9) {
            let additionalDice = "one";
            if (level >= 13) {
                additionalDice = "two";
            }
            if (level >= 17) {
                additionalDice = "three";
            }
            features.push({
                name: "barbarian-feral-instinct",
                title: "Feral Instinct",
                displayStyle: "card",
                html: `<p>You can roll ${additionalDice} additional weapon damage die when determining the extra damage for a critical hit with a melee attack.</p>`
            });
        }
        if (level >= 11) {
            const relentlessRageHtml = ` 
                <p>Your rage can keep you fighting despite grievous wounds. If you drop to 0 hit points while you're raging and don't die outright, you can make a DC 10 Constitution saving throw. If you succeed, you drop to 1 hit point instead.</p>
                <p>Each time you use this feature after the first, the DC increases by 5. When you finish a short or long rest, the DC resets to 10.</p>`;
            features.push({
                name: "barbarian-relentless-rage",
                title: "Relentless Rage",
                displayStyle: "card",
                html: relentlessRageHtml
            });
        }
        if (level >= 15) {
            features.push({
                name: "barbarian-persistent-rage",
                title: "Persistent Rage",
                displayStyle: "card",
                html: `<p>Your rage is so fierce that it ends early only if you fall unconscious or if you choose to end it.</p>`
            });
        }
        if (level >= 18) {
            features.push({
                name: "barbarian-indomitable-might",
                title: "Indomitable Might",
                displayStyle: "card",
                html: `<p>If your total for a Strength check is less than your Strength score, you can use that score in place of the total.</p>`
            });
        }
        if (level >= 20) {
            features.push({
                name: "barbarian-primal-champion",
                title: "Primal Champion",
                displayStyle: "bullet"
            });
            features.push({
                name: "barbarian-primal-champion-ability-score-modifier-strength",
                title: "Primal Champion - Strength modifier",
                modifier: "ability-score:strength",
                modifierValue: 4,
                displayStyle: "none"
            });
            features.push({
                name: "barbarian-primal-champion-ability-score-modifier-constitution",
                title: "Primal Champion - Constitution modifier",
                modifier: "ability-score:constitution",
                modifierValue: 4,
                displayStyle: "none"
            });
            features.push({
                name: "barbarian-primal-champion-modified-max-ability-score-modifier-strength",
                title: "Primal Champion - Modified max strength modifier",
                modifier: "modified-max-ability-score:strength",
                modifierValue: 4,
                displayStyle: "none"
            });
            features.push({
                name: "barbarian-primal-champion-modified-max-ability-score-modifier-constitution",
                title: "Primal Champion - Mdified max constitution modifier",
                modifier: "modified-max-ability-score:constitution",
                modifierValue: 4,
                displayStyle: "none"
            });
        }

        for (const feature of features) {
            feature.sourcePropertyName = "class";
            feature.sourcePropertyValue = "barbarian";
            character.addFeature(feature);
        }
    }

    static #skillProficiencies = [
        { value: "animal-handling", text: "Animal Handling" },
        { value: "athletics", text: "Athletics" },
        { value: "intimidation", text: "Intimidation" },
        { value: "nature", text: "Nature" },
        { value: "perception", text: "Perception" },
        { value: "survival", text: "Survival" }
    ];

}
