
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
        const proficiencyBonus = character.getProficiencyBonus();

        // saving throw proficiencies
        if (character.classes[0].name == "barbarian") {
            features.push({
                name: "barbarian-saving-throw-proficiency-strength",
                title: "Strength",
                modifier: "saving-throw-proficiency:strength",
                modifierValue: proficiencyBonus
            });
            features.push({
                name: "barbarian-saving-throw-proficiency-constitution",
                title: "Constitution",
                modifier: "saving-throw-proficiency:constitution",
                modifierValue: proficiencyBonus
            });
        }

        for (const feature of features) {
            feature.sourcePropertyName = "class";
            feature.sourcePropertyValue = "barbarian";
            character.addFeature(feature);
        }
    }

    //static updateOptionFeatures(character, option) {
    //    character.removeFeature("barbarian-skill-proficiencies");
    //    let skillProficiences = [];
    //    let skillProficiencesText = "";
    //    if (option?.name == "barbarian-skill-proficiencies") {
    //        skillProficiences = option?.value ?? [];
    //        skillProficiencesText = Barbarian.#skillProficiencies
    //            .filter(sp => skillProficiences.includes(sp.value))
    //            .map(sp => sp.text)
    //            .join(", ");
    //    }
    //    const features = [];
    //    features.push({
    //        name: "barbarian-skill-proficiencies",
    //        title: "Barbarian Skill Proficiencies",
    //        sourceOptionName: "barbarian-skill-proficiencies",
    //        featureType: "class",
    //        value: skillProficiences,
    //        text: skillProficiencesText
    //    });
    //    for (const feature of features) {
    //        feature.sourcePropertyName = "class";
    //        feature.sourcePropertyValue = "barbarian";
    //        character.addFeature(feature);
    //    }
    //}

    static #skillProficiencies = [
        { value: "animal-handling", text: "Animal Handling" },
        { value: "athletics", text: "Athletics" },
        { value: "intimidation", text: "Intimidation" },
        { value: "nature", text: "Nature" },
        { value: "perception", text: "Perception" },
        { value: "survival", text: "Survival" }
    ];

}
