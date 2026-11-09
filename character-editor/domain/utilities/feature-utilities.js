
export class FeatureUtilities {

    getAttackInfo({
        attackAbility,
        saveAbility,
        target,
        applyAbilityModifier = true,
        applyProficiencyModifier = true,
        damageDice,
        applyAbilityModifierToDamage,
        applyProficiencyModifierToDamage = false,
        damageType,
        range,
        hasReach = false,
        notes = []
    }) {
        let applyAbilityModifierToDamageTemp = true;
        if (applyAbilityModifierToDamage === true || applyAbilityModifierToDamage === false) {
            applyAbilityModifierToDamageTemp = applyAbilityModifierToDamage;
        }
        else {
            if (target == "dc") {
                applyAbilityModifierToDamageTemp = false;
            }
        }
        return {
            attackAbility: attackAbility,
            saveAbility: saveAbility,
            target: target,
            applyAbilityModifier: applyAbilityModifier,
            applyProficiencyModifier: applyProficiencyModifier,
            damageDice: damageDice,
            applyAbilityModifierToDamage: applyAbilityModifierToDamageTemp,
            applyProficiencyModifierToDamage: applyProficiencyModifierToDamage,
            damageType: damageType,
            range: range,
            hasReach: hasReach,
            notes: notes
        };
    }

    getFeatureCard(character, name, title, html, cardSource, attackInfo) {
        let attacks = [];
        if (attackInfo) {
            attacks = this.#getFeatureAttacks(character, attackInfo);
        }
        return {
            name: name,
            title: title,
            cardType: "feature-card",
            cardSource: cardSource,
            attacks: attacks,
            html: html
        };
    }

    getWeaponAttackCard(character, inventoryIndex, weapon) {
        const attacks = this.#getWeaponAttacks(character, inventoryIndex, weapon);
        return {
            name: `equipment-${inventoryIndex}-${weapon.name}`,
            title: weapon.properties.find(p => p.name == "title")?.value ?? weapon.title,
            cardType: "attack-card",
            attacks: attacks
        };
    }

    getSpellCard(character, spell, html, characterSpellClasses, attackInfo) {
        let attacks = [];
        if (attackInfo) {
            attacks = this.#getSpellAttacks(character, characterSpellClasses, spell, attackInfo);
        }
        return {
            name: `spell-${spell.name}`,
            title: spell.title,
            level: spell.level,
            school: spell.school,
            cardType: "spell-card",
            attacks: attacks,
            html: html
        };
    }

    #getFeatureAttacks(character, attackInfo) {

        // get attack modifiers
        let attackModifiers = [];
        const descriptions = [];
        const attackAbilityModifier = Number(character.getAbilityScoreModifier(attackInfo.attackAbility));
        const attackAbilityTitle = attackInfo.attackAbility.charAt(0).toUpperCase() + attackInfo.attackAbility.slice(1);
        let saveAbilityTitle = null;
        if (attackInfo.saveAbility) {
            saveAbilityTitle = attackInfo.saveAbility.charAt(0).toUpperCase() + attackInfo.saveAbility.slice(1);
        }
        const proficiencyModifier = Number(character.getProficiencyBonus());
        if (attackInfo.target) {
            attackModifiers = this.#getFeatureCardTargetModifiers(character, attackInfo.target);
            if (attackInfo.applyAbilityModifier) {
                attackModifiers.push({ name: attackInfo.attackAbility, title: attackAbilityTitle, value: attackAbilityModifier });
            }
            if (attackInfo.applyProficiencyModifier) {
                attackModifiers.push({ name: "proficiency", title: "Proficiency", value: proficiencyModifier });
            }
            const totalAttackModifier = attackModifiers.map(m => Number(m.value)).reduce((a, b) => a + b, 0);
            descriptions.push(this.#getTargetDescription(attackInfo.target, totalAttackModifier, saveAbilityTitle));
        }

        // get damage modifiers
        let damageModifiers = [];
        if (attackInfo.damageDice) {
            damageModifiers = this.#getFeatureCardTargetModifiers(character, "damage");
            if (attackInfo.applyAbilityModifierToDamage) {
                damageModifiers.push({ name: attackInfo.attackAbility, title: attackAbilityTitle, value: attackAbilityModifier });
            }
            if (attackInfo.applyProficiencyModifierToDamage) {
                damageModifiers.push({ name: "proficiency", title: "Proficiency", value: proficiencyModifier });
            }
            const totalDamageModifier = damageModifiers.map(m => Number(m.value)).reduce((a, b) => a + b, 0);
            descriptions.push(this.#getDamageDescription(character, attackInfo.damageDice, totalDamageModifier, attackInfo.damageType));
        }

        // range, reach
        if (attackInfo.range) {
            descriptions.push(`range: ${attackInfo.range}`);
        }
        if (attackInfo.hasReach) {
            descriptions.push(`reach 5 ft.`);
        }

        // get display modifiers
        const displayModifiers = this.#getDisplayModifiers([
            { name: attackInfo.target, modifiers: attackModifiers },
            { name: "damage", modifiers: damageModifiers }
        ]);

        // return result
        return [{ description: descriptions.join(", "), notes: attackInfo.notes, modifiers: displayModifiers }];
    }

    #getWeaponAttacks(character, inventoryIndex, weapon) {

        // get attack modifiers
        let attackModifiers = [];
        const descriptions = [];
        const attackAbility = this.#getAttackAbilityForWeapon(character, weapon);
        const attackAbilityModifier = Number(character.getAbilityScoreModifier(attackAbility));
        const attackAbilityTitle = attackAbility.charAt(0).toUpperCase() + attackAbility.slice(1);
        const proficiencyModifier = Number(character.getProficiencyBonus());
        attackModifiers = this.#getFeatureCardTargetModifiers(character, "to-hit", inventoryIndex, weapon);
        attackModifiers.push({ name: attackAbility, title: attackAbilityTitle, value: attackAbilityModifier });
        attackModifiers.push({ name: "proficiency", title: "Proficiency", value: proficiencyModifier });
        const totalAttackModifier = Number(attackModifiers.map(m => Number(m.value)).reduce((a, b) => a + b, 0));
        const targetDescription = this.#getTargetDescription("to-hit", totalAttackModifier);
        descriptions.push(targetDescription);

        // get damage modifiers
        let damageModifiers = [];
        let totalDamageModifier = 0;
        let damageDescription = "";
        let damageDice = "";
        const damageType = weapon.properties.find(p => p.name == "damage-type")?.value;
        if (damageType) {
            damageModifiers = this.#getFeatureCardTargetModifiers(character, "damage", inventoryIndex, weapon);
            damageModifiers.push({ name: attackAbility, title: attackAbilityTitle, value: attackAbilityModifier });
            totalDamageModifier = Number(damageModifiers.map(m => Number(m.value)).reduce((a, b) => a + b, 0));
            damageDice = weapon.properties.find(p => p.name == "damage-dice")?.value;
            descriptions.push(this.#getDamageDescription(character, damageDice, totalDamageModifier, damageType));
        }

        // range, reach
        const range = weapon.properties.find(p => p.name == "range")?.value;
        if (range) {
            descriptions.push(`range ${range} ft.`);
        }
        const hasReach = weapon.properties.some(p => p.name == "reach");
        if (hasReach) {
            descriptions.push(`reach 5 ft.`);
        }

        // notes
        const notes = [];
        const isOffHandWeapon = this.#isOffHandWeapon(character, inventoryIndex, weapon);
        if (isOffHandWeapon) {
            const offHandDescriptions = [];
            offHandDescriptions.push(targetDescription);
            let offHandDamageModifier = totalDamageModifier;
            if (attackAbilityModifier > 0) {
                offHandDamageModifier -= attackAbilityModifier;
            }
            if (damageType) {
                offHandDescriptions.push(this.#getDamageDescription(character, damageDice, offHandDamageModifier, damageType, inventoryIndex, weapon));
            }
            notes.push(`Off hand (bonus action): ${offHandDescriptions.join(", ")}`);
        }
        const isVersatile = weapon.properties.some(p => p.name == "versatile");
        if (isVersatile) {
            let versatileDamageDice = weapon.properties.find(p => p.name == "versatile-damage-dice").value;
            versatileDamageDice = this.#getModifiedDamageDice(character, versatileDamageDice, inventoryIndex, weapon);
            notes.push(`Versatile: (${versatileDamageDice} damage two-handed)`);
        }

        // get display modifiers
        const displayModifiers = this.#getDisplayModifiers([
            { name: "to-hit", modifiers: attackModifiers },
            { name: "damage", modifiers: damageModifiers }
        ]);

        // return result
        return [{ description: descriptions.join(", "), notes: notes, modifiers: displayModifiers }];
    }

    #getSpellAttacks(character, characterSpellClasses, spell, attackInfo) {

        const spellClasses = characterSpellClasses.filter(csc => spell.classes.includes(csc.name));
        if (spellClasses.length == 0) {
            spellClasses = characterSpellClasses;
        }

        const attacks = [];
        for (const spellClass of spellClasses) {

            // get attack modifiers
            let attackModifiers = [];
            const descriptions = [];
            const attackAbilityModifier = Number(character.getAbilityScoreModifier(spellClass.attackAbility));
            const attackAbilityTitle = spellClass.attackAbility.charAt(0).toUpperCase() + spellClass.attackAbility.slice(1);
            let saveAbilityTitle = null;
            if (attackInfo.saveAbility) {
                saveAbilityTitle = attackInfo.saveAbility.charAt(0).toUpperCase() + attackInfo.saveAbility.slice(1);
            }
            const proficiencyModifier = Number(character.getProficiencyBonus());
            if (attackInfo.target) {
                attackModifiers = this.#getFeatureCardTargetModifiers(character, attackInfo.target, null, null, spellClass, spell);
                if (attackInfo.applyAbilityModifier) {
                    attackModifiers.push({ name: spellClass.attackAbility, title: attackAbilityTitle, value: attackAbilityModifier });
                }
                if (attackInfo.applyProficiencyModifier) {
                    attackModifiers.push({ name: "proficiency", title: "Proficiency", value: proficiencyModifier });
                }
                const totalAttackModifier = attackModifiers.map(m => Number(m.value)).reduce((a, b) => a + b, 0);
                descriptions.push(this.#getTargetDescription(attackInfo.target, totalAttackModifier, saveAbilityTitle));
            }

            // get damage modifiers
            let damageModifiers = [];
            if (attackInfo.damageDice) {
                damageModifiers = this.#getFeatureCardTargetModifiers(character, "damage", null, null, spellClass, spell);
                if (attackInfo.applyAbilityModifierToDamage) {
                    damageModifiers.push({ name: spellClass.attackAbility, title: attackAbilityTitle, value: attackAbilityModifier });
                }
                if (attackInfo.applyProficiencyModifierToDamage) {
                    damageModifiers.push({ name: "proficiency", title: "Proficiency", value: proficiencyModifier });
                }
                const totalDamageModifier = damageModifiers.map(m => Number(m.value)).reduce((a, b) => a + b, 0);
                descriptions.push(this.#getDamageDescription(character, attackInfo.damageDice, totalDamageModifier, attackInfo.damageType));
            }

            // range, reach, target
            if (spell.range) {
                descriptions.push(`range ${spell.range}`);
            }

            // spell class
            let description = descriptions.join(", ");
            if (description) {
                description = `${spellClass.title} spell: ${description}`;
            }

            // get display modifiers
            const displayModifiers = this.#getDisplayModifiers([
                { name: attackInfo.target, modifiers: attackModifiers },
                { name: "damage", modifiers: damageModifiers }
            ]);

            // add attack
            attacks.push({ description: description, notes: attackInfo.notes, modifiers: displayModifiers });
        }

        return attacks;
    }

    #getFeatureCardTargetModifiers(character, target, inventoryIndex, weapon, spellClass, spell) {
        const modifiers = [];
        const targetModifiers = character.modifiers.filter(m => m.target == target);
        for (const modifier of targetModifiers) {
            let conditionsMet = true;
            if (modifier.conditions) {
                conditionsMet = false;
                for (const condition of modifier.conditions) {
                    const conditionValues = condition.values ?? [];
                    if (condition.name == "inventory-index") {
                        const validIndices = conditionValues.map(v => Number(v));
                        if (!validIndices.includes(inventoryIndex)) {
                            continue;
                        }
                    }
                    if (condition.name == "weapon-name") {
                        const weaponProperties = weapon?.properties ?? [];
                        const weaponName = weaponProperties.find(wp => wp.name == "weapon-name")?.value;
                        if (!conditionValues.includes(weaponName)) {
                            continue;
                        }
                    }
                    if (condition.name == "weapon-type") {
                        const weaponProperties = weapon?.properties ?? [];
                        const weaponType = weaponProperties.find(wp => wp.name == "weapon-type")?.value;
                        if (!conditionValues.includes(weaponType)) {
                            continue;
                        }
                    }
                    if (condition.name == "spell-class") {
                        if (!conditionValues.includes(spellClass?.name)) {
                            continue;
                        }
                    }
                    if (condition.name == "spell-level") {
                        if (!conditionValues.includes(spell?.level)) {
                            continue;
                        }
                    }
                    conditionsMet = true;
                }
            }
            if (conditionsMet) {
                modifiers.push(modifier);
            }
        }
        return modifiers.map(m => ({ name: m.name, title: m.title, value: m.value }));
    }

    #getTargetDescription(target, attackModifier, saveAbilityTitle) {
        if (target == "dc") {
            const dc = 8 + Number(attackModifier);
            return `DC ${dc} ${saveAbilityTitle ?? ""}`.trim();
        }
        let toHit = Number(attackModifier);
        let description = `${toHit} to hit`;
        if (toHit >= 0) {
            description = "+" + description;
        }
        return description;
    }

    #getDamageDescription(character, damageDice, damageModifier, damageType, inventoryIndex, weapon, spellClass, spell) {
        const modifiedDamageDice = this.#getModifiedDamageDice(
            character, damageDice, damageModifier, damageType, inventoryIndex, weapon, spellClass, spell);
        let damageDieList = modifiedDamageDice.split("+").map(s => s.trim());
        const additionalModifiers = damageDieList
            .filter(s => s.endsWith("d1")).map(s => Number(s.replace("d1", ""))).reduce((a, b) => a + b, 0);
        damageDieList = damageDieList.filter(s => !s.endsWith("d1"));
        const damageDiceDescription = damageDieList.join(" + ");
        const totalDamageModifier = Number(damageModifier) + Number(additionalModifiers);
        let modifierDescription = "";
        if (totalDamageModifier > 0) {
            modifierDescription = ` + ${totalDamageModifier}`;
        }
        if (totalDamageModifier < 0) {
            modifierDescription = ` - ${Math.abs(totalDamageModifier)}`;
        }
        let description = "0 damage";
        if (damageDiceDescription || totalDamageModifier > 0) {
            description = `${damageDiceDescription}${modifierDescription} ${damageType} damage`.trim();
            if (description.startsWith("+")) {
                description = description.replace("+", "").trim();
            }
        }
        return description;
    }

    #getModifiedDamageDice(character, damageDice, inventoryIndex, weapon, spellClass, spell) {
        let modifiedSize = null;
        const sizeModifiers = this.#getFeatureCardTargetModifiers(character, "damage-die-size", inventoryIndex, weapon, spellClass, spell);
        if (sizeModifiers.length > 0) {
            modifiedSize = Math.max(...sizeModifiers.map(m => Number(m.value)));
        }
        if (!modifiedSize) {
            return damageDice;
        }
        const modifiedList = [];
        const damageDiceList = damageDice.split("+").map(s => s.trim());
        for (const damageDiceItem of damageDiceList) {
            const parts = damageDiceItem.split("d");
            const number = parts[0];
            modifiedList.push(`${number}d${modifiedSize}`);
        }
        return modifiedList.join("+");
    }

    #getDisplayModifiers(modifierLists) {
        const displayModifiers = [];
        for (const modifierList of modifierLists) {
            for (const modifier of modifierList.modifiers) {
                const value = Number(modifier.value);
                if (!isNaN(value) && value != 0) {
                    let label = `${modifier.value} ${modifierList.name}`;
                    if (value > 0) {
                        label = "+" + label;
                    }
                    const displayModifier = displayModifiers.find(dm => dm.title == modifier.title);
                    if (displayModifier) {
                        displayModifier.modifiers.push(label);
                    }
                    else {
                        displayModifiers.push({ title: modifier.title, modifiers: [label] });
                    }
                }
            }
        }
        for (const displayModifier of displayModifiers) {
            displayModifier.description = `${displayModifier.title}: ${displayModifier.modifiers.join(", ")}`;
        }
        return displayModifiers.map(dm => dm.description);
    }

    #getAttackAbilityForWeapon(character, weapon) {
        const strengthModifier = character.getAbilityScoreModifier("strength");
        const dexterityModifier = character.getAbilityScoreModifier("dexterity");
        const weaponType = weapon.properties.find(wp => wp.name == "weapon-type")?.value;
        const isFinesse = weapon.properties.some(wp => wp.name == "finesse");
        let ability = "strength";
        if (weaponType == "simple-ranged" || weaponType == "martial-ranged") {
            ability = "dexterity";
        }
        if (isFinesse) {
            if (dexterityModifier > strengthModifier) {
                ability = "dexterity";
            }
            else {
                ability = "strength";
            }
        }
        return ability;
    }

    #isOffHandWeapon(character, inventoryIndex, weapon) {
        const isLight = weapon.properties.some(p => p.name == "light");
        if (isLight || weapon.name == "basic-unarmed-strike") {
            return true;
        }
        const modifiers = this.#getFeatureCardTargetModifiers(character, "off-hand-weapon", inventoryIndex, weapon);
        if (modifiers.length > 0) {
            return true;
        }
        return false;
    }

}