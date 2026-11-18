
export class DruidCircleOfFire {

    static get name() {
        return "druid-circle-of-fire";
    }

    static get title() {
        return "Circle of Fire";
    }

    static get htmlPath() {
        return "lands-of-aedun/sub-classes/druid-circle-of-fire.html";
    }

    static get className() {
        return "druid";
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
        const level = Number(character.classes.find(c => c.value == "druid").level);

        // Rage fire
        if (level >= 2) {
            const rageFireHtml = `
                <p>
                    When you are damaged by a creature you can see within 60 feet, you can use your reaction to cast Hellish rebuke as a 2nd level spell. Once you have used this feature, it cannot be used again until after completing a short or long rest.
                </p>
            `;
            const rageFire = character.getFeatureCard(`${DruidCircleOfFire.name}-rage-fire`, "Rage fire", rageFireHtml);
            rageFire.useInfo = { reset: "short-rest", uses: 1 };
            tempFeatures.push(rageFire);
        }

        // Quick fire
        if (level >= 6) {
            const quickFireHtml = `
                <p>
                    When you attack with a melee weapon you may attack twice instead of once and your attacks count as magical.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${DruidCircleOfFire.name}-quick-fire`, "Quick fire", quickFireHtml));
        }

        // Fire shape
        if (level >= 10) {
            const fireShapeHtml = `
                <p>
                    You can expend two uses of Wild Shape at the same time to transform into a fire elemental.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${DruidCircleOfFire.name}-fire-shape`, "Fire shape", fireShapeHtml));
        }

        // Cleansing fire
        if (level >= 14) {
            const cleansingFireHtml = `
                <p>
                    When you damage a creature as a result of your Rage fire reaction, you regain hit points equal to the creature’s damage.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${DruidCircleOfFire.name}-cleansing-fire`, "Cleansing fire", cleansingFireHtml));
        }

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `subClass-${classIndex}`;
            feature.sourcePropertyValue = DruidCircleOfFire.name;
            feature.cardSource = DruidCircleOfFire.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex) {
        const characterClass = character.classes.find(c => c.value == "druid");
        const tempSpells = [];
        if (characterClass.level >= 2) {
            tempSpells.push("produce-flame");
            tempSpells.push("hellish-rebuke");
        }
        if (characterClass.level >= 3) {
            tempSpells.push("flame-blade");
            tempSpells.push("heat-metal");
        }
        if (characterClass.level >= 5) {
            tempSpells.push("fireball");
            tempSpells.push("protection-from-energy");
        }
        if (characterClass.level >= 7) {
            tempSpells.push("fire-shield");
            tempSpells.push("wall-of-fire");
        }
        if (characterClass.level >= 9) {
            tempSpells.push("conjure-elemental");
            tempSpells.push("flame-strike");
        }
        for (const spell of tempSpells) {
            spells.push(spell);
        }
    }

    static getSpellCastingInfo(character, allSpells, classSpellCastingInfo) {
        if (!classSpellCastingInfo) {
            return classSpellCastingInfo;
        }
        const characterClass = character.classes.find(c => c.value == "druid");
        if (characterClass.level >= 2) {
            DruidCircleOfFire.#addSpell("hellish-rebuke", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 3) {
            DruidCircleOfFire.#addSpell("flame-blade", allSpells, classSpellCastingInfo);
            DruidCircleOfFire.#addSpell("heat-metal", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 5) {
            DruidCircleOfFire.#addSpell("fireball", allSpells, classSpellCastingInfo);
            DruidCircleOfFire.#addSpell("protection-from-energy", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 7) {
            DruidCircleOfFire.#addSpell("fire-shield", allSpells, classSpellCastingInfo);
            DruidCircleOfFire.#addSpell("wall-of-fire", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 9) {
            DruidCircleOfFire.#addSpell("conjure-elemental", allSpells, classSpellCastingInfo);
            DruidCircleOfFire.#addSpell("flame-strike", allSpells, classSpellCastingInfo);
        }
        return classSpellCastingInfo;
    }

    static #addSpell(spellName, allSpells, classSpellCastingInfo) {
        const spell = allSpells.find(s => s.name == spellName);
        const spellLevel = classSpellCastingInfo.spellLevels.find(sl => sl.level == spell.level);
        if (spellLevel) {
            if (!spellLevel.spells) {
                spellLevel.spells = [];
            }
            let foundSpell = spellLevel.spells.find(s => s.title == spell.title);
            if (foundSpell) {
                foundSpell.alwaysPrepared = true;
            }
            else {
                spellLevel.spells.push({ title: spell.title, alwaysPrepared: true });
            }
        }
    }
}
