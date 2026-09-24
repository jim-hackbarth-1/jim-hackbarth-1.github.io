
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
                        race.source = source;
                        allRaces.push(race);
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
                        subRace.source = source;
                        allSubRaces.push(subRace);
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
                        cls.source = source;
                        allClasses.push(cls);
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
                        subClass.source = source;
                        allSubClasses.push(subClass);
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
                        feat.source = source;
                        allFeats.push(feat);
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

    static #allAlignments = [
        { name: "lawful-good", title: "Lawful Good", html: "[content here]" },
        { name: "neutral-good", title: "Neutral Good", html: "[content here]" },
        { name: "chaotic-good", title: "Chaotic Good", html: "[content here]" },
        { name: "lawful-neutral", title: "Lawful Neutral", html: "[content here]" },
        { name: "neutral", title: "Neutral", html: "[content here]" },
        { name: "chaotic-neutral", title: "Chaotic Neutral", html: "[content here]" },
        { name: "lawful-evil", title: "Lawful Evil", html: "[content here]" },
        { name: "neutral-evil", title: "Neutral Evil", html: "[content here]" },
        { name: "chaotic-evil", title: "Chaotic Evil", html: "[content here]" }
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
                        background.source = source;
                        allBackgrounds.push(background);
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
            const cls = character.classes[i];
            const subClasses = Sources.getSubClasses(sources, cls.name);
            if (cls.subClass && !subClasses.some(sc => sc.name == cls.subClass)) {
                Sources.updateCharacterSubClass(character, i, null)
            }
            for (const levelBoon of cls.levelBoons) {
                if (levelBoon.feat && !feats.includes(levelBoon.feat)) {
                    levelBoon.feat = null;
                }
            }
            if (cls.name && !classes.some(c => c.name == cls.name)) {
                Sources.removeCharacterClass(character, i);
            }
        }
        if (character.background && !Sources.getBackgrounds(sources).some(b => b.name == character.background)) {
            Sources.updateCharacterBackground(character, null);
        }

        // TODO: spells, equipment
        character.sources = sources;
    }

    static updateCharacterRace(character, race) {
        if (character.race != race) {
            character.options = character.options.filter(o => o.sourcePropertyName != "race");
            character.race = race;
            Sources.updateCharacterSubRace(character, null);
        }
    }

    static updateCharacterSubRace(character, subRace) {
        if (character.subRace != subRace) {
            character.options = character.options.filter(o => o.sourcePropertyName != "subRace");
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

    static updateCharacterClass(character, classIndex, className) {
        const index = Number(classIndex);
        const cls = character.classes[index];
        character.options = character.options.filter(
            o => o.sourcePropertyName != "class" || o.sourcePropertyValue != cls.name);
        character.classes[index].name = className;
        Sources.updateCharacterSubClass(character, classIndex, null);
    }

    static updateCharacterLevel(character, classIndex, level) {
        const index = Number(classIndex);
        const characterClass = character.classes[index];
        const cls = Sources.getClasses(character.sources).find(c => c.name == characterClass.name);
        if (cls && characterClass.level < cls.subClassLevel) {
            Sources.updateCharacterSubClass(character, index, null);
        }
        const levelBoons =[];
        for (let i = 1; i <= 20; i++) {
            if (level < i) {
                character.options = character.options.filter(
                    o => o.sourcePropertyName != `feat:class-${index}-level-${i}`);
            }
            else {
                let levelBoon = characterClass.levelBoons.find(lb => lb.level == i);
                if (!levelBoon) {
                    let defaultHitPoints = Math.ceil((Number(cls.hitDieSize) + 1) / 2);
                    if (classIndex == 0 && i == 1) {
                        defaultHitPoints = Number(cls.hitDieSize);
                    }
                    const levelBoonIndex = Sources.#getNextLevelBoonIndex(character);
                    levelBoon = {
                        level: i,
                        hitPoints: defaultHitPoints,
                        index: levelBoonIndex
                    };
                }
                levelBoons.push(levelBoon);
            }
        }
        character.classes[index].levelBoons = levelBoons;
        character.classes[index].level = level;
    }

    static updateCharacterSubClass(character, classIndex, subClass) {
        const index = Number(classIndex);
        const cls = character.classes[index];
        character.options = character.options.filter(
            o => o.sourcePropertyName != "subClass" || o.sourcePropertyValue != cls.subClass);
        character.classes[index].subClass = subClass;
    }

    static updateCharacterLevelBoon(character, classIndex, levelBoon) {
        const index = Number(classIndex);
        const characterClass = character.classes[index];
        let currentLevelBoon = characterClass.levelBoons.find(lb => lb.level == levelBoon.level);
        if (currentLevelBoon?.feat && currentLevelBoon.feat != levelBoon.feat) {
            character.options = character.options.filter(
                o => o.sourcePropertyName != `feat:class-${index}-level-${levelBoon.level}`);
        }
        currentLevelBoon.hitPoints = levelBoon.hitPoints;
        currentLevelBoon.abilityScore1 = levelBoon.abilityScore1;
        currentLevelBoon.abilityScore2 = levelBoon.abilityScore2;
        currentLevelBoon.feat = levelBoon.feat;
    }

    static updateCharacterOption(character, option) {
        character.removeOption(option.name);
        character.addOption(option);
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
        if (character.alignment != alignment) {
            character.options = character.options.filter(o => o.sourcePropertyName != "alignment");
            character.alignment = alignment;
        }
    }

    static updateCharacterBackground(character, background) {
        if (character.background != background) {
            character.options = character.options.filter(o => o.sourcePropertyName != "background");
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
                if (character.traits[i] != traits[i]) {
                    hasChange = true;
                    break;
                }
            }
        }
        if (hasChange) {
            character.options = character.options.filter(o => o.sourcePropertyName != "trait");
            character.traits = traits;
        }
    }

    static updateCharacterIdeal(character, ideal) {
        if (character.ideal != ideal) {
            character.ideal = ideal;
        }
    }

    static updateCharacterBond(character, bond) {
        if (character.bond != bond) {
            character.bond = bond;
        }
    }

    static updateCharacterFlaw(character, flaw) {
        if (character.flaw != flaw) {
            character.flaw = flaw;
        }
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

    static #getNextLevelBoonIndex(character) {
        let lastIndex = -1;
        for (const characterClass of character.classes) {
            for (const levelBoon of characterClass.levelBoons) {
                const index = Number(levelBoon.index);
                if (index > lastIndex) {
                    lastIndex = index;
                }
            }
        }
        return lastIndex + 1;
    }
}
