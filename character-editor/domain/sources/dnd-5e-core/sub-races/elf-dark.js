
export class ElfDark {

    static get name() {
        return "elf-dark";
    }

    static get title() {
        return "Dark Elf";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-races/elf-dark.html";
    }

    static get race() {
        return "elf";
    }

    static getSelections(character) {
        return [];
    }

    static getSelectionOptions(character, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, targetFilters) {

        const modifiers = [];
        modifiers.push({
            name: `${ElfDark.name}-ability-score-modifier-charisma`,
            title: "Ability score",
            value: 1,
            target: "ability-score:charisma"
        });
        modifiers.push({
            name: `${ElfDark.name}-weapon-proficiency-rapier`,
            title: "Dark Elf Weapon Training",
            value: "rapier",
            target: "weapon-proficiency"
        });
        modifiers.push({
            name: `${ElfDark.name}-weapon-proficiency-shortsword`,
            title: "Dark Elf Weapon Training",
            value: "shortsword",
            target: "weapon-proficiency"
        });
        modifiers.push({
            name: `${ElfDark.name}-weapon-proficiency-crossbow-hand`,
            title: "Dark Elf Weapon Training",
            value: "crossbow-hand",
            target: "weapon-proficiency"
        });

        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = "sub-race";
                modifier.sourcePropertyValue = ElfDark.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character) {
        const elfDarkVisionIndex = features.findIndex(f => f.name == "elf-darkvision");
        if (elfDarkVisionIndex > -1 && elfDarkVisionIndex < features.length) {
            features.splice(elfDarkVisionIndex, 1);
        }
        const tempFeatures = [];

        // Superior Darkvision
        const superiorDarkvisionHtml = `
            <p><b>Superior Darkvision.</b> Your darkvision has a range of 120 feet, instead of 60.</p>
        `;
        tempFeatures.push(character.getFeatureCard(`${ElfDark.name}-superior-darkvision`, "Superior Darkvision", superiorDarkvisionHtml));

        // Sunlight Sensitivity
        const sunlightSensitivityHtml = `
            <p><b>Sunlight Sensitivity.</b> You have disadvantage on attack rolls and Wisdom (Perception) checks that rely on sight when you, the target of the attack, or whatever you are trying to perceive is in direct sunlight.</p>
        `;
        tempFeatures.push(character.getFeatureCard(`${ElfDark.name}-sunlight-sensitivity`, "Sunlight Sensitivity", sunlightSensitivityHtml));

        // Drow Magic - Dancing Lights
        const dancingLightsHtml = `
            <p><b>Drow Magic  - Dancing Lights.</b> You know the Dancing Lights cantrip.</p>
        `;
        tempFeatures.push(character.getFeatureCard(
            `${ElfDark.name}-drow-magic-dancing-lights`, "Drow Magic - Dancing Lights", dancingLightsHtml));

        // Drow Magic - Faerie Fire
        if (character.level >= 3) {
            const faerieFireHtml = `
                <p><b>Drow Magic - Faerie Fire.</b> You can cast the Faerie Fire spell and regain the ability to do so when you finish a long rest. Charisma is your spellcasting ability for this spell.</p>
            `;
            tempFeatures.push(character.getFeatureCard(
                `${ElfDark.name}-drow-magic-faerie-fire`, "Drow Magic - Faerie Fire", faerieFireHtml));
        }

        // Drow Magic - Darkness
        if (character.level >= 5) {
            const darknessHtml = `
                <b>Drow Magic - Darkness.</b> you can cast the Darkness spell once and regain the ability to do so when you finish a long rest.
            `;
            tempFeatures.push(character.getFeatureCard(`${ElfDark.name}-drow-magic-darkness`, "Drow Magic - Darkness", darknessHtml));
        }

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "subRace";
            feature.sourcePropertyValue = ElfDark.name;
            feature.cardSource = ElfDark.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character) {
        const tempSpells = [];
        tempSpells.push("dancing-lights");
        if (character.level >= 3) {
            tempSpells.push("faerie-fire");
        }
        if (character.level >= 5) {
            tempSpells.push("darkness");
        }
        for (const spell of tempSpells) {
            spells.push(spell);
        }
    }

}
