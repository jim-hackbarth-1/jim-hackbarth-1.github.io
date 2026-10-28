
export class ElfWood {

    static get name() {
        return "elf-wood";
    }

    static get title() {
        return "Wood Elf";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-races/elf-wood.html";
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
            name: `${ElfWood.name}-ability-score-modifier-wisdom`,
            title: "Ability score",
            value: 1,
            target: "ability-score:wisdom"
        });
        modifiers.push({
            name: `${ElfWood.name}-weapon-proficiency-longsword`,
            title: "Wood Elf Weapon Training",
            value: "longsword",
            target: "weapon-proficiency"
        });
        modifiers.push({
            name: `${ElfWood.name}-weapon-proficiency-shortsword`,
            title: "Wood Elf Weapon Training",
            value: "shortsword",
            target: "weapon-proficiency"
        });
        modifiers.push({
            name: `${ElfWood.name}-weapon-proficiency-shortbow`,
            title: "Wood Elf Weapon Training",
            value: "shortbow",
            target: "weapon-proficiency"
        });
        modifiers.push({
            name: `${ElfWood.name}-weapon-proficiency-longbow`,
            title: "Wood Elf Weapon Training",
            value: "longbow",
            target: "weapon-proficiency"
        });
        modifiers.push({
            name: `${ElfWood.name}-fleet-of-foot`,
            title: "Fleet of Foot",
            value: 5,
            target: "speed"
        });
        
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = "sub-race";
                modifier.sourcePropertyValue = ElfWood.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character) {

        const tempFeatures = [];

        // Mask of the Wild
        tempFeatures.push({
            name: `${ElfWood.name}-mask-of-the-wild`,
            title: "Mask of the Wild",
            html: `
                <p><b>Mask of the Wild.</b> You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena.</p>
                `,
            source: {
                name: "sub-race",
                title: ElfWood.title
            },
            displayType: "feature-card"
        });

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "subRace";
            feature.sourcePropertyValue = ElfWood.name
            features.push(feature);
        }
    }

    static applySpells(spells, character) {

    }

}
