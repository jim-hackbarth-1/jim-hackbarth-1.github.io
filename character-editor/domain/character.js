
export class Character {

    static get currentCharacter() {
        let data = UIKit.window.sessionStorage.getItem("current-character");
        if (data == "null") {
            data = null;
        }
        if (data) {
            return new Character(JSON.parse(data));
        }
        return null;
    }
    static set currentCharacter(character) {
        let data = null;
        if (character) {
            data = JSON.stringify(character);
        }
        UIKit.window.sessionStorage.setItem("current-character", data)
    }

    // constructor
    constructor(data) {
        this.name = data?.name;
        this.sources = data?.sources;
        this.race = data?.race;
        this.subRace = data?.subRace;
        this.classes = data?.classes;
        this.abilityScores = data?.abilityScores;
        this.useAbilityScorePointsSystem = data?.useAbilityScorePointsSystem;
        this.alignment = data?.alignment;
        this.background = data?.background;
        this.traits = data?.traits,
        this.ideal = data?.ideal,
        this.bond = data?.bond,
        this.flaw = data?.flaw,
        this.options = data?.options;
        this.features = data?.features;
    }

    #sources;
    get sources() {
        return this.#sources;
    }
    set sources(sources) {
        this.#sources = sources ?? [];
    }

    #name;
    get name() {
        return this.#name;
    }
    set name(name) {
        this.#name = name;
    }

    #race;
    get race() {
        return this.#race;
    }
    set race(race) {
        this.#race = race;
    }

    #subRace;
    get subRace() {
        return this.#subRace;
    }
    set subRace(subRace) {
        this.#subRace = subRace;
    }

    #classes;
    get classes() {
        return this.#classes;
    }
    set classes(classes) {
        if (classes == null) {
            classes = [];
        }
        const temp = [];
        for (const cls of classes) {
            if (!cls.name || !temp.some(c => c.name == cls.name)) {
                temp.push(cls);
            }
        }
        this.#classes = temp;
    }

    #abilityScores;
    get abilityScores() {
        return this.#abilityScores;
    }
    set abilityScores(abilityScores) {
        if (abilityScores == null) {
            abilityScores = [];
        }
        const temp = [
            { name: "strength", title: "Strength" },
            { name: "intelligence", title: "Intelligence" },
            { name: "wisdom", title: "Wisdom" },
            { name: "dexterity", title: "Dexterity" },
            { name: "constitution", title: "Constitution" },
            { name: "charisma", title: "Charisma" }
        ];
        for (const abilityScore of temp) {
            abilityScore.baseScore = 8;
            abilityScore.modifiedMaximum = 20;
        }
        for (const abilityScoreIn of abilityScores) {
            const abilityScore = temp.find(a => a.name == abilityScoreIn.name);
            if (abilityScore) {
                abilityScore.baseScore = abilityScoreIn.baseScore;
                abilityScore.modifiedMaximum = abilityScoreIn.modifiedMaximum;
            }
        }
        this.#abilityScores = temp;
    }

    #useAbilityScorePointsSystem;
    get useAbilityScorePointsSystem() {
        return this.#useAbilityScorePointsSystem;
    }
    set useAbilityScorePointsSystem(useAbilityScorePointsSystem) {
        this.#useAbilityScorePointsSystem = useAbilityScorePointsSystem;
    }

    #alignment;
    get alignment() {
        return this.#alignment;
    }
    set alignment(alignment) {
        this.#alignment = alignment;
    }

    #background;
    get background() {
        return this.#background;
    }
    set background(background) {
        this.#background = background;
    }

    #traits;
    get traits() {
        return this.#traits;
    }
    set traits(traits) {
        this.#traits = traits ?? [];
    }

    #ideal;
    get ideal() {
        return this.#ideal;
    }
    set ideal(ideal) {
        this.#ideal = ideal;
    }

    #bond;
    get bond() {
        return this.#bond;
    }
    set bond(bond) {
        this.#bond = bond;
    }

    #flaw;
    get flaw() {
        return this.#flaw;
    }
    set flaw(flaw) {
        this.#flaw = flaw;
    }

    #options;
    get options() {
        return this.#options;
    }
    set options(options) {
        if (options == null) {
            options = [];
        }
        const temp = [];
        for (const option of options) {
            if (!temp.some(o => o.name == option.name)) {
                temp.push(option);
            }
        }
        this.#options = temp;
    }

    addOption(option) {
        if (!this.options.some(o => o.name == option.name)) {
            this.options.push(option);
        }
    }

    removeOption(name) {
        const index = this.options.findIndex(o => o.name === name);
        if (index > -1) {
            this.options.splice(index, 1);
        }
    }

    #features;
    get features() {
        return this.#features;
    }
    set features(features) {
        if (features == null) {
            features = [];
        }
        const temp = [];
        for (const feature of features) {
            if (!temp.some(f => f.name == feature.name)) {
                temp.push(feature);
            }
        }
        this.#features = temp;
    }

    addFeature(feature) {
        if (!this.features.some(f => f.name == feature.name)) {
            this.features.push(feature);
        }
    }

    removeFeature(name) {
        const index = this.features.findIndex(f => f.name === name);
        if (index > -1) {
            this.features.splice(index, 1);
        }
    }

    get level() {
        let level = 0;
        const levels = this.classes.map(cls => Number(cls.level));
        for (const lvl of levels) {
            level += lvl;
        }
        return level;
    }

    getAbilityScore(ability) {
        const abilityScoreItem = this.abilityScores.find(a => a.name == ability);
        const baseScore = abilityScoreItem.baseScore;
        const nonEquipmentModifier = this.features
            .filter(f => f.modifier == `ability-score:${ability}` && f.sourcePropertyName != "equipment")
            .map(f => f.modifierValue)
            .reduce((a, b) => a + b, 0);
        let abilityScore = Number(baseScore) + Number(nonEquipmentModifier);
        const max = Number(abilityScoreItem.modifiedMaximum);
        if (abilityScore > max) {
            abilityScore = max;
        }
        const equipmentModifier = this.features
            .filter(f => f.modifier == `ability-score:${ability}` && f.sourcePropertyName == "equipment")
            .map(f => f.modifierValue)
            .reduce((a, b) => a + b, 0);
        abilityScore += Number(equipmentModifier);
        return abilityScore;
    }

    getConModifierForHitPoints(levelBoonIndex) {
        const sourceProperties = ["race", "subRace", "class", "subClass", "background"];
        const features = this.features.filter(f =>
            f.modifier == "ability-score:constitution"
            && sourceProperties.includes(f.sourcePropertyName));
        const feats = [];
        for (const characterClass of this.classes) {
            for (const levelBoon of characterClass.levelBoons) {
                if (levelBoon.index <= levelBoonIndex) {
                    const sourcePropertyValues = [
                        `${characterClass.name}-${levelBoon.level}-ability-score-modifier-1`,
                        `${characterClass.name}-${levelBoon.level}-ability-score-modifier-2`
                    ];
                    const abilityScoreImprovementFeatures = this.features.filter(f =>
                        f.modifier == "ability-score:constitution"
                        && sourcePropertyValues.includes(f.sourcePropertyValue));
                    for (const feature of abilityScoreImprovementFeatures) {
                        features.push(feature);
                    }
                    if (levelBoon.feat) {
                        feats.push(levelBoon.feat);
                    }
                }
            }
        }
        const featFeatures = this.features.filter(f =>
            f.modifier == "ability-score:constitution"
            && f.sourcePropertyName == "feat"
            && feats.includes(f.sourcePropertyValue));
        for (const feature of featFeatures) {
            features.push(feature);
        }
        return features.map(f => Number(f.modifierValue)).reduce((a, b) => a + b, 0);
    }

    getHitPoints() {
        let totalHp = 0;
        const conBase = this.abilityScores.find(a => a.name == "constitution").baseScore;
        for (const characterClass of this.classes) {
            for (const levelBoon of characterClass.levelBoons) {
                const conModifierAtLevel = this.getConModifierForHitPoints(levelBoon.index);
                const conAtLevel = Number(conBase) + Number(conModifierAtLevel);
                const hpModAtLevel = Math.floor((Number(conAtLevel) - 10) / 2);
                totalHp += (Number(levelBoon.hitPoints) + Number(hpModAtLevel));
            }
        }
        const featFeatures = this.features.filter(f =>
            f.modifier == "hit-points"
            && f.sourcePropertyName == "feat");
        for (const feature of featFeatures) {
            totalHp += Number(feature.modifierValue);
        }
        return totalHp;
    }

    toJSON() {
        return {
            sources: this.sources,
            name: this.name,
            race: this.race,
            subRace: this.subRace,
            classes: this.classes,
            abilityScores: this.abilityScores,
            useAbilityScorePointsSystem: this.useAbilityScorePointsSystem,
            alignment: this.alignment,
            background: this.background,
            traits: this.traits,
            ideal: this.ideal,
            bond: this.bond,
            flaw: this.flaw,
            options: this.options,
            features: this.features
        }
    }
}
