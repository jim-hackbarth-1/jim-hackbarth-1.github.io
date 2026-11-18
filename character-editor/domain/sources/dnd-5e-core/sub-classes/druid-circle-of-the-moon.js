
export class DruidCircleOfTheMoon {

    static get name() {
        return "druid-circle-of-the-moon";
    }

    static get title() {
        return "Circle of the Moon";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-classes/druid-circle-of-the-moon.html";
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

        if (level >= 2) {

            // Combat Wild Shape
            const combatWildShapeHtml = `
                <p>
                    You gain the ability to use Wild Shape on your turn as a bonus action, rather than as an action.
                </p>
                <p>
                    Additionally, while you are transformed by Wild Shape, you can use a bonus action to expend one spell slot to regain 1d8 hit points per level of the spell slot expended.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${DruidCircleOfTheMoon.name}-combat-wild-shape`, "Combat Wild Shape", combatWildShapeHtml));

            // Circle Forms
            let cr = Math.floor(level / 3);
            if (cr < 1) {
                cr = 1;
            }
            const circleFormsHtml = `
                <p>
                    You can use your Wild Shape to transform into a beast with a challenge rating as high as ${cr}. You ignore the Max. CR column of the Beast Shapes table, but must abide by the other limitations there.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${DruidCircleOfTheMoon.name}-circle-forms`, "Circle Forms", circleFormsHtml));
        }

        // Primal Strike
        if (level >= 6) {
            const primalStrikeHtml = `
                <p>
                    Your attacks in beast form count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${DruidCircleOfTheMoon.name}-primal-strike`, "Primal Strike", primalStrikeHtml));
        }

        // Elemental Wild Shape
        if (level >= 10) {
            const elementalWildShapeHtml = `
                <p>
                    You can expend two uses of Wild Shape at the same time to transform into an air elemental, an earth elemental, a fire elemental, or a water elemental.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(
                `${DruidCircleOfTheMoon.name}-elemental-wild-shape`, "Elemental Wild Shape", elementalWildShapeHtml));
        }

        // Thousand Forms
        if (level >= 14) {
            const thousandFormsHtml = `
                <p>
                    You have learned to use magic to alter your physical form in more subtle ways. You can cast the Alter Self spell at will.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${DruidCircleOfTheMoon.name}-thousand-forms`, "Thousand Forms", thousandFormsHtml));
        }

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `subClass-${classIndex}`;
            feature.sourcePropertyValue = DruidCircleOfTheMoon.name;
            feature.cardSource = DruidCircleOfTheMoon.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex) {
        const characterClass = character.classes.find(c => c.value == "druid");
        const tempSpells = [];
        if (characterClass.level >= 14) {
            tempSpells.push("alter-self");
        }
        for (const spell of tempSpells) {
            spells.push(spell);
        }
    }

    static getSpellCastingInfo(character, allSpells, classSpellCastingInfo) {
        return classSpellCastingInfo;
    }
}
