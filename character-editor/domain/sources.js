
import { DnD5ESource } from "./sources/dnd-5e-core/dnd-5e-core-source.js";
import { LandsOfAedunSource } from "./sources/lands-of-aedun/lands-of-aedun-source.js";

export class Sources {

    static #sources = [
        DnD5ESource,
        LandsOfAedunSource
    ];
    static getSources() {
        return Sources.#sources;
    }

    static #allRaces;
    static getRaces(sources) {
        if (!Sources.#allRaces) {
            const allRaces = [];
            for (const source of Sources.getSources()) {
                if (source.getRaces) {
                    const races = source.getRaces();
                    for (const race of races) {
                        const nameCollision = allRaces.find(r => r.name == race.name);
                        if (nameCollision) {
                            console.warn(`Duplicate race: ${race.name}. Sources: ${nameCollision.source.name}, ${source.name}`);
                        }
                        else {
                            race.source = source;
                            allRaces.push(race);
                        }
                    }
                }
            }
            Sources.#allRaces = allRaces;
        }
        return Sources.#allRaces.filter(r => sources.includes(r.source.name));
    }

    static async getRaceHtml(sources, race) {
        const basePath = "./domain/sources";
        const raceModel = Sources.getRaces(sources).find(r => r.name == race);
        if (raceModel.html) {
            return raceModel.html;
        }
        const html = await Sources.#getHtml(basePath, raceModel.htmlPath)
        return html ?? "";
    }

    static #allSubRaces;
    static getSubRaces(sources, race) {
        if (!Sources.#allSubRaces) {
            const allSubRaces = [];
            for (const source of Sources.getSources()) {
                if (source.getSubRaces) {
                    const subRaces = source.getSubRaces();
                    for (const subRace of subRaces) {
                        const nameCollision = allSubRaces.find(sr => sr.name == subRace.name);
                        if (nameCollision) {
                            console.warn(`Duplicate sub-race: ${subRace.name}. Sources: ${nameCollision.source.name}, ${source.name}`);
                        }
                        else {
                            subRace.source = source;
                            allSubRaces.push(subRace);
                        }
                    }
                }
            }
            Sources.#allSubRaces = allSubRaces;
        }
        return Sources.#allSubRaces.filter(sr => sources.includes(sr.source.name) && sr.race == race);
    }

    static async getSubRaceHtml(sources, race, subRace) {
        const basePath = "./domain/sources";
        const subRaceModel = Sources.getSubRaces(sources, race).find(sr => sr.name == subRace);
        if (subRaceModel.html) {
            return subRaceModel.html;
        }
        const html = await Sources.#getHtml(basePath, subRaceModel.htmlPath)
        return html ?? "";
    }

    static #allClasses;
    static getClasses(sources) {
        if (!Sources.#allClasses) {
            const allClasses = [];
            for (const source of Sources.getSources()) {
                if (source.getClasses) {
                    const classes = source.getClasses();
                    for (const cls of classes) {
                        const nameCollision = allClasses.find(c => c.name == cls.name);
                        if (nameCollision) {
                            console.warn(`Duplicate class: ${cls.name}. Sources: ${nameCollision.source.name}, ${source.name}`);
                        }
                        else {
                            cls.source = source;
                            allClasses.push(cls);
                        }
                    }
                }
            }
            Sources.#allClasses = allClasses;
        }
        return Sources.#allClasses.filter(c => sources.includes(c.source.name));
    }

    static async getClassHtml(sources, className) {
        const basePath = "./domain/sources";
        const classModel = Sources.getClasses(sources).find(c => c.name == className);
        if (classModel.html) {
            return classModel.html;
        }
        const html = await Sources.#getHtml(basePath, classModel.htmlPath)
        return html ?? "";
    }

    static #allSubClasses;
    static getSubClasses(sources, className) {
        if (!Sources.#allSubClasses) {
            const allSubClasses = [];
            for (const source of Sources.getSources()) {
                if (source.getSubClasses) {
                    const subClasses = source.getSubClasses();
                    for (const subClass of subClasses) {
                        const nameCollision = allSubClasses.find(sc => sc.name == subClass.name);
                        if (nameCollision) {
                            console.warn(`Duplicate sub-class: ${subClass.name}. Sources: ${nameCollision.source.name}, ${source.name}`);
                        }
                        else {
                            subClass.source = source;
                            allSubClasses.push(subClass);
                        }
                    }
                }
            }
            Sources.#allSubClasses = allSubClasses;
        }
        return Sources.#allSubClasses.filter(sc => sources.includes(sc.source.name) && sc.className == className);
    }

    static async getSubClassHtml(sources, className, subClass) {
        const basePath = "./domain/sources";
        const subClassModel = Sources.getSubClasses(sources, className).find(sc => sc.name == subClass);
        if (subClassModel.html) {
            return subClassModel.html;
        }
        const html = await Sources.#getHtml(basePath, subClassModel.htmlPath)
        return html ?? "";
    }

    static #allFeats;
    static getFeats(sources) {
        if (!Sources.#allFeats) {
            const allFeats = [];
            for (const source of Sources.getSources()) {
                if (source.getFeats) {
                    const feats = source.getFeats();
                    for (const feat of feats) {
                        const nameCollision = allFeats.find(f => f.name == feat.name);
                        if (nameCollision) {
                            console.warn(`Duplicate feat: ${feat.name}. Sources: ${nameCollision.source.name}, ${source.name}`);
                        }
                        else {
                            feat.source = source;
                            allFeats.push(feat);
                        }
                    }
                }
            }
            Sources.#allFeats = allFeats;
        }
        return Sources.#allFeats.filter(f => sources.includes(f.source.name));
    }

    static async getFeatHtml(sources, feat) {
        const basePath = "./domain/sources";
        const featModel = Sources.getFeats(sources).find(f => f.name == feat);
        if (featModel.html) {
            return featModel.html;
        }
        const html = await Sources.#getHtml(basePath, featModel.htmlPath)
        return html ?? "";
    }

    static #allAbilities = [
        { name: "strength", title: "Strength" },
        { name: "intelligence", title: "Intelligence" },
        { name: "wisdom", title: "Wisdom" },
        { name: "dexterity", title: "Dexterity" },
        { name: "constitution", title: "Constitution" },
        { name: "charisma", title: "Charisma" }
    ];
    static getAbilities() {
        return Sources.#allAbilities;
    }

    static #allAlignments = [
        { name: "lawful-good", title: "Lawful Good", html: "<p style='font-family: Calibri, sans-serif;'>Lawful Good creatures can be counted on to do the right thing as expected by society. Gold dragons, paladins, and most dwarves are lawful good.</p>" },
        { name: "neutral-good", title: "Neutral Good", html: "<p style='font-family: Calibri, sans-serif;'>Neutral Good folk do the best they can to help others according to their needs. Many celestials, some cloud giants, and most gnomes are neutral good.</p>" },
        { name: "chaotic-good", title: "Chaotic Good", html: "<p style='font-family: Calibri, sans-serif;'>Chaotic good creatures act as their conscience directs, with little regard for what others expect. Copper dragons, many elves, and unicorns are chaotic good.</p>" },
        { name: "lawful-neutral", title: "Lawful Neutral", html: "<p style='font-family: Calibri, sans-serif;'>Lawful neutral individuals act in accordance with law, tradition, or peronsal codes. Many monks and some wizards are lawful neutral.</p>" },
        { name: "neutral", title: "Neutral", html: "<p style='font-family: Calibri, sans-serif;'>Neutral is the alignment of those who prefer to steer clear of moral questions and don't take sides, doing what seems best at the time. Lizardfolk, most druids, and many humans are neutral.</p>" },
        { name: "chaotic-neutral", title: "Chaotic Neutral", html: "<p style='font-family: Calibri, sans-serif;'>Chaotic neutral creatures follow their whims, holding their personal freedom above all else. Many barbarians and rogues, and some bards, are chaotic neutral.</p>" },
        { name: "lawful-evil", title: "Lawful Evil", html: "<p style='font-family: Calibri, sans-serif;'>Lawful evil creatures methodically take what they want, within the limits of a code of tradition, loyalty, or order. Devils, blue dragons, and hobgoblins are lawful evil.</p>" },
        { name: "neutral-evil", title: "Neutral Evil", html: "<p style='font-family: Calibri, sans-serif;'>Neutral evil is the alignment of those who do whatever they can get away with, without compassion or qualms. Many drow, some cloud giants, and yugoloths are neutral evil.</p>" },
        { name: "chaotic-evil", title: "Chaotic Evil", html: "<p style='font-family: Calibri, sans-serif;'>Chaotic evil creatures act with arbitrary violence, spurred by their greed, hatred, or bloodlust. Demons, red dragons, and orcs are chaotic evil.</p>" }
    ];
    static getAlignments() {
        return Sources.#allAlignments;
    }

    static #allBackgrounds;
    static getBackgrounds(sources) {
        if (!Sources.#allBackgrounds) {
            const allBackgrounds = [];
            for (const source of Sources.getSources()) {
                if (source.getBackgrounds) {
                    const backgrounds = source.getBackgrounds();
                    for (const background of backgrounds) {
                        const nameCollision = allBackgrounds.find(b => b.name == background.name);
                        if (nameCollision) {
                            console.warn(`Duplicate background: ${background.name}. Sources: ${nameCollision.source.name}, ${source.name}`);
                        }
                        else {
                            background.source = source;
                            allBackgrounds.push(background);
                        }
                    }
                }
            }
            Sources.#allBackgrounds = allBackgrounds;
        }
        return Sources.#allBackgrounds.filter(b => sources.includes(b.source.name));
    }

    static async getBackgroundHtml(sources, background) {
        const basePath = "./domain/sources";
        const backgroundModel = Sources.getBackgrounds(sources).find(b => b.name == background);
        if (backgroundModel.html) {
            return backgroundModel.html;
        }
        const html = await Sources.#getHtml(basePath, backgroundModel.htmlPath)
        return html ?? "";
    }

    static #equipmentCategories = [
        { name: "armor", title: "Armor" },
        { name: "armor-magical", title: "Armor, Magical" },
        { name: "potions", title: "Potions" },
        { name: "rings", title: "Rings" },
        { name: "rods", title: "Rods" },
        { name: "scrolls", title: "Scrolls" },
        { name: "staffs", title: "Staffs" },
        { name: "wands", title: "Wands" },
        { name: "weapons", title: "Weapons" },
        { name: "weapons-magical", title: "Weapons, Magical" },
        { name: "wondrous-items", title: "Wondrous Items" },
        { name: "adventuring-gear", title: "Adventuring Gear" },
        { name: "tools", title: "Tools" },
        { name: "mounts-and-vehicls", title: "Mounts and Vehicles" }
    ];
    static getEquipmentCategories() {
        return Sources.#equipmentCategories;
    }

    static #allEquipment;
    static getEquipment(sources, category) {
        if (!Sources.#allEquipment) {
            const allEquipment = [];
            for (const source of Sources.getSources()) {
                if (source.getEquipment) {
                    const equipment = source.getEquipment();
                    for (const item of equipment) {
                        const nameCollision = allEquipment.find(e => e.name == item.name);
                        if (nameCollision) {
                            console.warn(`Duplicate equipment: ${item.name}. Sources: ${nameCollision.source.name}, ${source.name}`);
                        }
                        else {
                            item.source = source;
                            allEquipment.push(item);
                        }
                    }
                }
            }
            Sources.#allEquipment = allEquipment;
        }
        let results = Sources.#allEquipment.filter(ei => sources.includes(ei.source.name));
        if (category) {
            results = results.filter(e => e.category == category);
        }
        return results;
    }

    static async getEquipmentHtml(sources, name) {
        const basePath = "./domain/sources";
        const equipmentModel = Sources.getEquipment(sources).find(e => e.name == name);
        if (equipmentModel.html) {
            return equipmentModel.html;
        }
        const html = await Sources.#getHtml(basePath, equipmentModel.htmlPath)
        return html ?? "";
    }

    static #allLanguages;
    static getLanguages(sources) {
        if (!Sources.#allLanguages) {
            const allLanguages = [];
            for (const source of Sources.getSources()) {
                if (source.getLanguages) {
                    const languages = source.getLanguages();
                    for (const language of languages) {
                        const nameCollision = allLanguages.find(l => l.value == language.value);
                        if (nameCollision) {
                            console.warn(`Duplicate language: ${language.name}. Sources: ${nameCollision.source.name}, ${source.name}`);
                        }
                        else {
                            language.source = source;
                            allLanguages.push(language);
                        }
                    }
                }
            }
            Sources.#allLanguages = allLanguages;
        }
        return Sources.#allLanguages.filter(l => sources.includes(l.source.name));
    }

    static updateCharacterSources(character, sources) {
        if (character.race && !Sources.getRaces(sources).some(r => r.name == character.race)) {
            Sources.updateCharacterRace(character, null);
        }
        if (character.subRace && !Sources.getSubRaces(sources, character.race).some(sr => sr.name == character.subRace)) {
            Sources.updateCharacterSubRace(character, null);
        }
        const classes = Sources.getClasses(sources);
        const feats = Sources.getFeats(sources).map(f => f.name);
        for (let i = character.classes.length - 1; i >= 0; i--) {
            const characterClass = character.classes[i];
            const subClasses = Sources.getSubClasses(sources, characterClass.value);
            if (characterClass.subClass?.value && !subClasses.some(sc => sc.name == characterClass.subClass?.value)) {
                Sources.updateCharacterSubClass(character, i, null)
            }
            for (const levelBoon of cls.levelBoons) {
                if (levelBoon.feat?.value && !feats.includes(levelBoon.feat.value)) {
                    levelBoon.feat = null;
                }
            }
            if (characterClass.value && !classes.some(c => c.name == characterClass.value)) {
                Sources.removeCharacterClass(character, i);
            }
        }
        if (character.background?.value && !Sources.getBackgrounds(sources).some(b => b.name == character.background.value)) {
            Sources.updateCharacterBackground(character, null);
        }

        const allEquipment = Sources.getEquipment(sources);
        for (let i = 0; i < character.equipment.length; i++) {
            if (!allEquipment.some(e => e.name == character.equipment[i].name)) {
                Sources.removeCharacterEquipment(character, i);
            }
        }

        // TODO: spells

        character.sources = sources;
    }

    static updateCharacterRace(character, race) {
        if (character.race?.value != race?.value) {
            character.selections = character.selections.filter(s => s.sourcePropertyName != "race");
            character.race = race;
            Sources.updateCharacterSubRace(character, null);
        }
    }

    static updateCharacterSubRace(character, subRace) {
        if (character.subRace?.value != subRace?.value) {
            character.selections = character.selections.filter(s => s.sourcePropertyName != "subRace");
            character.subRace = subRace;
        }
    }

    static addCharacterClass(character, cls) {
        character.classes.push(cls);
    }

    static removeCharacterClass(character, classIndex) {
        const index = Number(classIndex);
        if (character.classes.length > index) {
            Sources.updateCharacterClass(character, index, null);
            character.classes.splice(index, 1);
        }
    }

    static updateCharacterClass(character, classIndex, cls) {
        const index = Number(classIndex);
        const characterClass = character.classes[index];
        character.selections = character.selections.filter(s => !s.sourcePropertyName.startsWith(`class-${classIndex}`));
        characterClass.value = cls?.value;
        characterClass.text = cls?.text;
        Sources.updateCharacterSubClass(character, classIndex, null);
    }

    static updateCharacterLevel(character, classIndex, level) {
        const index = Number(classIndex);
        const levelNumber = Number(level);
        const characterClass = character.classes[index];
        const cls = Sources.getClasses(character.sources).find(c => c.name == characterClass.value);
        if (cls && Number(characterClass.level) < Number(cls.subClassLevel)) {
            Sources.updateCharacterSubClass(character, index, null);
        }
        const otherClassesBoons = [];
        for (let i = 0; i < character.classes.length; i++) {
            if (i != index) {
                for (const levelBoon of character.classes[i].levelBoons) {
                    otherClassesBoons.push(levelBoon);
                }
            }
        }
        const levelBoons = characterClass.levelBoons.filter(lb => Number(lb.level) <= levelNumber);
        for (let i = 1; i <= levelNumber; i++) {
            let levelBoon = characterClass.levelBoons.find(lb => Number(lb.level) == i);
            if (!levelBoon) {
                let defaultHitPoints = Math.ceil((Number(cls.hitDieSize) + 1) / 2);
                if (index == 0 && i == 1) {
                    defaultHitPoints = Number(cls.hitDieSize);
                }
                const levelBoonIndex = Sources.#getNextLevelBoonIndex(otherClassesBoons, levelBoons);
                levelBoon = {
                    level: i,
                    hitPoints: defaultHitPoints,
                    index: levelBoonIndex
                };
                levelBoons.push(levelBoon);
            }
        }
        character.classes[index].levelBoons = levelBoons;
        character.classes[index].level = level;
    }

    static updateCharacterSubClass(character, classIndex, subClass) {
        const index = Number(classIndex);
        character.selections = character.selections.filter(s => s.sourcePropertyName != `subClass-${classIndex}`);
        character.classes[index].subClass = subClass;
    }

    static updateCharacterLevelBoon(character, classIndex, levelBoon) {
        const index = Number(classIndex);
        const characterClass = character.classes[index];
        let currentLevelBoon = characterClass.levelBoons.find(lb => lb.level == levelBoon.level);
        if (currentLevelBoon?.feat && currentLevelBoon.feat?.value != levelBoon.feat?.value) {
            character.selections = character.selections.filter(
                s => s.sourcePropertyName != `class-${index}-level-${levelBoon.level}-feat`);
        }
        currentLevelBoon.hitPoints = levelBoon.hitPoints;
        currentLevelBoon.abilityScore1 = levelBoon.abilityScore1;
        currentLevelBoon.abilityScore2 = levelBoon.abilityScore2;
        currentLevelBoon.feat = levelBoon.feat;
    }

    static updateCharacterSelection(character, selection) {
        character.removeSelection(selection.name);
        character.addSelection(selection);
    }

    static updateCharacterUseAbilityScorePointsSystem(character) {
        character.useAbilityScorePointsSystem = !character.useAbilityScorePointsSystem;
        const min = character.useAbilityScorePointsSystem ? 8 : 3;
        const max = character.useAbilityScorePointsSystem ? 15 : 18;
        for (const abilityScore of character.abilityScores) {
            if (abilityScore.baseScore < min) {
                abilityScore.baseScore = min;
            }
            if (abilityScore.baseScore > max) {
                abilityScore.baseScore = max;
            }
        }
    }

    static updateCharacterAlignment(character, alignment) {
        if (character.alignment?.value != alignment?.value) {
            character.alignment = alignment;
        }
    }

    static updateCharacterBackground(character, background) {
        if (character.background?.value != background?.value) {
            character.selections = character.selections.filter(s => s.sourcePropertyName != "background");
            character.background = background;
            Sources.updateCharacterTraits(character, []);
            Sources.updateCharacterIdeal(character, null);
            Sources.updateCharacterBond(character, null);
            Sources.updateCharacterFlaw(character, null);
        }
    }

    static updateCharacterTraits(character, traits) {
        let hasChange =
            (character.traits.length != traits.length)
        if (!hasChange) {
            for (let i = 0; i < traits.length; i++) {
                if (character.traits[i].value != traits[i].value) {
                    hasChange = true;
                    break;
                }
            }
        }
        if (hasChange) {
            character.traits = traits;
        }
    }

    static updateCharacterIdeal(character, ideal) {
        if (character.ideal?.value != ideal?.value) {
            character.ideal = ideal;
        }
    }

    static updateCharacterBond(character, bond) {
        if (character.bond?.value != bond?.value) {
            character.bond = bond;
        }
    }

    static updateCharacterFlaw(character, flaw) {
        if (character.flaw?.value != flaw?.value) {
            character.flaw = flaw;
        }
    }

    static addCharacterEquipment(character, item) {
        character.addEquipment(item);
    }

    static removeCharacterEquipment(character, index) {
        const itemName = character.equipment[index].name;
        character.selections = character.selections.filter(s => s.sourcePropertyName != `equipment-${index}`);
        character.removeEquipment(index);
    }

    /*
    Feature:
    - name
    - sourcePropertyName
    - sourcePropertyValue
    - displayType
    - html
    */
    static getCharacterFeatures(character) {

        const features = [];

        // race
        if (character.race?.value) {
            const race = Sources.getRaces(character.sources).find(r => r.name == character.race.value);
            if (race?.applyFeatures) {
                race.applyFeatures(features, character);
            }
        }

        // subRace
        if (character.race?.value && character.subRace?.value) {
            const subRace = Sources
                .getSubRaces(character.sources, character.race.value)
                .find(sr => sr.name == character.subRace.value);
            if (subRace?.applyFeatures) {
                subRace.applyFeatures(features, character);
            }
        }

        // classes, subclasses, and feats
        for (let i = 0; i < character.classes.length; i++) {
            const characterClass = character.classes[i];
            if (characterClass.value && characterClass.level) {
                const cls = Sources.getClasses(character.sources).find(c => c.name == characterClass.value);
                if (cls?.applyFeatures) {
                    cls.applyFeatures(features, character, i);
                }
            }
            if (characterClass.value && characterClass.level && characterClass.subClass?.value) {
                const subClass = Sources.getSubClasses(character.sources, characterClass.value)
                    .find(sc => sc.name == characterClass.subClass.value);
                if (subClass?.applyFeatures) {
                    subClass.applyFeatures(features, character, i);
                }
            }
            for (const levelBoon of characterClass.levelBoons) {
                if (levelBoon.feat?.value) {
                    const feat = Sources.getFeats(character.sources).find(f => f.name == levelBoon.feat?.value);
                    if (feat?.applyFeatures) {
                        feat.applyFeatures(features, character, i, levelBoon.level);
                    }
                }
            }
        }

        // background
        if (character.background?.value) {
            const background = Sources.getBackgrounds(character.sources).find(b => b.name == character.background.value);
            if (background?.applyFeatures) {
                background.applyFeatures(features, character);
            }
        }

        // equipment
        for (let i = 0; i < character.equipment.length; i++) {
            const equipment = Sources.getEquipment(character.sources).find(e => e.name == character.equipment[i].name);
            if (equipment?.applyFeatures) {
                equipment.applyFeatures(features, character, i);
            }
        }

        return features;

    }

    static async #getHtml(basePath, path) {
        if (!path) {
            return "";
        }
        let fullPath = (path.startsWith("/")) ? basePath + path : basePath + "/" + path;
        const response = await UIKit.resourceManager.fetch(fullPath);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        return await response.text();
    }

    static #getNextLevelBoonIndex(otherClassesBoons, levelBoons) {
        let lastIndex = -1;
        for (const levelBoon of otherClassesBoons) {
            const index = Number(levelBoon.index);
            if (index > lastIndex) {
                lastIndex = index;
            }
        }
        for (const levelBoon of levelBoons) {
            const index = Number(levelBoon.index);
            if (index > lastIndex) {
                lastIndex = index;
            }
        }
        return lastIndex + 1;
    }
}
