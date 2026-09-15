
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
        this.#strength = data?.abilityScores?.strength;
        this.#intelligence = data?.abilityScores?.intelligence;
        this.#wisdom = data?.abilityScores?.wisdom;
        this.#dexterity = data?.abilityScores?.dexterity;
        this.#constitution = data?.abilityScores?.constitution;
        this.#charisma = data?.abilityScores?.charisma;
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

    #strength;
    #intelligence;
    #wisdom;
    #dexterity;
    #constitution;
    #charisma;
    get abilityScores() {
        return {
            strength: this.#strength,
            intelligence: this.#intelligence,
            wisdom: this.#wisdom,
            dexterity: this.#dexterity,
            constitution: this.#constitution,
            charisma: this.#charisma
        };
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

    toJSON() {
        return {
            sources: this.sources,
            name: this.name,
            race: this.race,
            subRace: this.subRace,
            classes: this.classes,
            abilityScores: this.abilityScore,
            options: this.options,
            features: this.features
        }
    }
}
