
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
        UIKit.window.sessionStorage.setItem("current-character", data);
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
        this.traits = data?.traits;
        this.ideal = data?.ideal;
        this.bond = data?.bond;
        this.flaw = data?.flaw;
        this.equipment = data?.equipment;
        this.portrait = data?.portrait;
        this.description = data?.description;
        this.historyNotes = data?.historyNotes;
        this.selections = data?.selections;
        this.modifiers = data?.modifiers;
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
            if (!cls.value || !temp.some(c => c.value == cls.value)) {
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

    #equipment;
    get equipment() {
        return this.#equipment;
    }
    set equipment(equipment) {
        this.#equipment = equipment ?? [];
    }

    addEquipment(item) {
        this.equipment.push(item);
    }

    removeEquipment(index) {
        if (index > -1 && index < this.equipment.length) {
            this.equipment.splice(index, 1);
        }
    }

    #portrait;
    get portrait() {
        return this.#portrait;
    }
    set portrait(portrait) {
        this.#portrait = portrait;
    }

    #description;
    get description() {
        return this.#description;
    }
    set description(description) {
        this.#description = description;
    }

    #historyNotes;
    get historyNotes() {
        return this.#historyNotes;
    }
    set historyNotes(historyNotes) {
        this.#historyNotes = historyNotes;
    }

    /*
    selection
    - name
    - sourcePropertyName"
      : "race"
      : "subRace"
      : "class-{index}"
      : "subClass-{index}"
      : "class-{index}-level-{level}-ability-score-1"
      : "class-{index}-level-{level}-ability-score-2"
      : "class-{index}-level-{level}-feat"
      : "background"
      : "equipment-{index}"
    - sourcePropertyValue
      : race
      : subRace
      : class
      : subClass
      : ability
      : ability
      : feat
      : background
      : equipment
    - values[]
    */
    #selections;
    get selections() {
        return this.#selections;
    }
    set selections(selections) {
        if (selections == null) {
            selections = [];
        }
        const temp = [];
        for (const selection of selections) {
            if (!temp.some(s => s.name == selection.name)) {
                temp.push(selection);
            }
        }
        this.#selections = temp;
    }

    addSelection(selection) {
        if (!this.selections.some(s => s.name == selection.name)) {
            this.selections.push(selection);
        }
    }

    removeSelection(name) {
        const index = this.selections.findIndex(s => s.name === name);
        if (index > -1) {
            this.selections.splice(index, 1);
        }
    }

    /*
    - name
    - sourcePropertyName
    - sourcePropertyValue
    - target
    - value
    - text
    - conditions []
      - name
      - values []
    */
    #modifiers;
    get modifiers() {
        return this.#modifiers;
    }
    set modifiers(modifiers) {
        if (modifiers == null) {
            modifiers = [];
        }
        const temp = [];
        for (const modifier of modifiers) {
            if (!temp.some(m => m.name == modifier.name)) {
                temp.push(modifier);
            }
        }
        this.#modifiers = temp;
    }

    addModifier(modifier) {
        if (!this.modifiers.some(m => m.name == modifier.name)) {
            this.modifiers.push(modifier);
        }
    }

    removeModifier(name) {
        const index = this.modifiers.findIndex(m => m.name === name);
        if (index > -1) {
            this.modifiers.splice(index, 1);
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
        const nonEquipmentModifier = this.modifiers
            .filter(m => m.target == `ability-score:${ability}` && !m.sourcePropertyName.startsWith("equipment"))
            .map(m => m.value)
            .reduce((a, b) => a + b, 0);
        let abilityScore = Number(baseScore) + Number(nonEquipmentModifier);
        let max = Number(abilityScoreItem.modifiedMaximum);
        const modifiedMaxModifiers = this.modifiers
            .filter(m => m.target == `modified-max-ability-score:${ability}` && !m.sourcePropertyName.startsWith("equipment"))
            .map(m => m.value)
            .reduce((a, b) => a + b, 0);
        max += modifiedMaxModifiers;
        if (abilityScore > max) {
            abilityScore = max;
        }
        const equipmentModifier = this.modifiers
            .filter(m => m.target == `ability-score:${ability}` && m.sourcePropertyName.startsWith("equipment"))
            .map(m => m.value)
            .reduce((a, b) => a + b, 0);
        abilityScore += Number(equipmentModifier);
        return abilityScore;
    }

    getAbilityScoreModifier(ability) {
        const abilityScore = Number(this.getAbilityScore(ability));
        return Math.floor((abilityScore - 10) / 2);
    }

    getConModifierForHitPoints(levelBoonIndex) {
        const sources = ["race", "subRace", "background"];
        for (let i = 0; i < this.classes.length; i++) {
            sources.push(`class-${i}`);
            sources.push(`subClass-${i}`);
            for (const levelBoon of this.classes[i].levelBoons) {
                if (Number(levelBoon.index) <= Number(levelBoonIndex)) {
                    sources.push(`class-${i}-level-${levelBoon.level}-ability-score-1`);
                    sources.push(`class-${i}-level-${levelBoon.level}-ability-score-2`);
                    sources.push(`class-${i}-level-${levelBoon.level}-feat`);
                }
            }
        }
        const modifiers = this.modifiers
            .filter(m => m.target == "ability-score:constitution" && sources.includes(m.sourcePropertyName));
        return modifiers.map(m => Number(m.value)).reduce((a, b) => a + b, 0);
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
        const featModifiers = this.modifiers.filter(m => m.target == "hit-points");
        for (const modifier of featModifiers) {
            totalHp += Number(modifier.value);
        }
        return totalHp;
    }

    getProficiencyBonus() {
        const level = this.level;
        let bonus = 2;
        if (level >= 5) {
            bonus = 3;
        }
        if (level >= 9) {
            bonus = 4;
        }
        if (level >= 13) {
            bonus = 5;
        }
        if (level >= 17) {
            bonus = 6;
        }
        return bonus;
    }

    getArmorClass() {
        let armorClass = 10;
        let dexModifier = this.getAbilityScoreModifier("dexterity");
        const armorType = this.equipment.find(e => e.name == "armor-type" && e.value != "shield" && e.isEquipped);
        if (armorType == "medium-armor" && dexModifier > 2) {
            dexModifier = 2;
        }
        if (armorType == "heavy-armor") {
            dexModifier = 0;
        }
        let acModifiers = this.modifiers
            .filter(m => m.target == "armor-class")
            .map(m => m.value)
            .reduce((a, b) => a + b, 0);
        return Number(armorClass) + Number(dexModifier) + Number(acModifiers);
    }

    getAttackCard({
        name,
        title,
        inventoryIndex,
        relevantAbility,
        toHitModifier,
        toHitLabel,
        damageModifier,
        damageDice,
        damageDieSize,
        damageType,
        damageLabel,
        attackType,
        reach,
        range,
        hasSavingThrow,
        dc,
        onFailedSave,
        onSave,
        target
    }) {
        if (!toHitLabel && !hasSavingThrow) {
            if (!toHitModifier) {
                toHitModifier = this.#getToHitModifier(inventoryIndex, relevantAbility);
            }
            toHitLabel = this.#getToHitLabel(toHitModifier);
        }
        if (!damageLabel) {
            if (!damageModifier) {
                damageModifier = this.#getDamageModifier(inventoryIndex, relevantAbility);
            }
            if (!damageDice) {
                damageDice = [{ number: 1, size: damageDieSize }];
            }
            damageLabel = this.#getDamageLabel(damageDice, damageModifier, damageType);
        }
        let html = "";
        if (!title) {
            title = "Attack";
        }
        if (hasSavingThrow) {
            if (!dc) {
                dc = 8 + Number(this.#getToHitModifier(inventoryIndex, relevantAbility));
            }
            if (!onFailedSave) {
                onFailedSave = damageLabel;
            }
            html = this.#getSavingThrowAttackCardHtml(title, dc, relevantAbility, onFailedSave, onSave, range, target);
        }
        else {
            if (range) {
                html = this.#getRangedAttackCardHtml(title, toHitLabel, damageLabel, range, target);
            }
            else {
                html = this.#getMeleeAttackCardHtml(title, toHitLabel, damageLabel, reach, target);
            }
        }
        if (!name) {
            name = "attack";
            if (Number(inventoryIndex >= 0)) {
                name = `attack-${inventoryIndex}`;
            }
        }
        return {
            name: name,
            displayType: "attack-card",
            html: html
        };
    }

    #getToHitModifier(inventoryIndex, relevantAbility) {
        const weapon = this.#getWeaponProperties(inventoryIndex);
        const abilityModifier = Number(this.#getAbilityModifierForAttack(weapon, relevantAbility));
        const proficiencyModifier = Number(this.#getProficiencyModifierForAttack(weapon));
        const toHitModifier = Number(this.#getTargetModifiersForAttack(weapon, "to-hit"));
        return abilityModifier + proficiencyModifier + toHitModifier;
    }

    #getToHitLabel(toHitModifier) {
        if (Number(toHitModifier) >= 0) {
            return `+${toHitModifier} to hit`;
        }
        return `${toHitModifier} to hit`;
    }

    #getDamageModifier(inventoryIndex, relevantAbility) {
        const weapon = this.#getWeaponProperties(inventoryIndex);
        const abilityModifier = Number(this.#getAbilityModifierForAttack(weapon, relevantAbility));
        const damageModifier = Number(this.#getTargetModifiersForAttack(weapon, "damage"));
        return abilityModifier + damageModifier;
    }

    #getDamageLabel(damageDice, modifier, damageType) {
        const damageDieLabels = [];
        for (const damageDie of damageDice) {
            damageDieLabels.push(`${damageDie.number}d${damageDie.size}`)
        }
        let html = damageDieLabels.join(" + ");
        const numberModifier = Number(modifier);
        if (numberModifier > 0) {
            html += ` + ${numberModifier}`;
        }
        if (numberModifier < 0) {
            html += ` - ${Math.abs(numberModifier)}`;
        }
        html = `(${html})`;
        if (damageType) {
            html += ` ${damageType}`;
        }
        html += " damage";
        return html;
    }

    #getSavingThrowAttackCardHtml(name, dc, dcAbility, onFailedSave, onSave, range, target) {
        let html = `<b>${name}</b>. <i>Saving throw</i>: DC ${dc} ${dcAbility}`;
        if (range) {
            html += `, ${range}`;
        }
        if (target) {
            html += `, ${target}`;
        }
        html += `<br/>${onFailedSave} <br/>On save: ${onSave}`;
        return html;
    }

    #getRangedAttackCardHtml(name, toHitLabel, damageLabel, range, target) {
        let html = `<b>${name}</b>. <i>Ranged Attack</i>: ${toHitLabel}, ${range}`;
        if (target) {
            html += `, ${target}`;
        }
        html += `, <i>Hit:</i> ${damageLabel}`;
        return html;
    }

    #getMeleeAttackCardHtml(name, toHitLabel, damageLabel, reach, target) {
        let html = `<b>${name}</b>. <i>Melee Attack</i>: ${toHitLabel}`;
        if (reach) {
            html += `, reach ${reach} ft.`;
        }
        if (target) {
            html += `, ${target}`;
        }
        html += `, <i>Hit:</i> ${damageLabel}`;
        return html;
    }

    #getWeaponProperties(inventoryIndex) {
        let weapon = null;
        let weaponName = null;
        let weaponType = null;
        let isVersatile = false;
        if (inventoryIndex) {
            weapon = this.equipment[inventoryIndex];
            if (weapon?.properties) {
                weaponName = weapon.properties.find(p => p.name == "weapon-name")?.value;
                weaponType = weapon.properties.find(p => p.name == "weapon-type")?.value;
                isVersatile = weapon.properties.some(p => p.name == "versatile");
            }
        }
        return {
            weaponName: weaponName,
            weaponType: weaponType,
            isVersatile: isVersatile
        };
    }

    #getAbilityModifierForAttack(weapon, relevantAbility) {
        let relevantAbilityModifier = 0;
        if (relevantAbility) {
            relevantAbilityModifier = this.getAbilityScoreModifier(relevantAbility);
        }
        else {
            const strengthModifier = this.getAbilityScoreModifier("strength");
            const dexterityModifier = this.getAbilityScoreModifier("dexterity");
            if ((weapon.weaponType == "simple-ranged")
                || (weapon.weaponType == "martial-ranged")
                || (weapon.isVersatile && (dexterityModifier > strengthModifier))) {
                relevantAbilityModifier = dexterityModifier;
            }
            else {
                relevantAbilityModifier = strengthModifier
            }
        }
        return relevantAbilityModifier;
    }

    #getProficiencyModifierForAttack(weapon) {
        let proficiencyModifier = 0;
        const isProficient = this.modifiers.some(m =>
            m.target == "weapon-proficiency"
            && (m.value == weapon.weaponName || m.value == weapon.weaponType));
        if (!weapon.weaponName || isProficient) {
            proficiencyModifier = this.getProficiencyBonus();
        }
        return proficiencyModifier;
    }

    #getTargetModifiersForAttack(weapon, target) {
        const modifiers = [];
        let targetModifiers = this.modifiers.filter(m => m.target == target);
        for (const modifier of targetModifiers) {
            let conditionsMet = true;
            if (modifier.conditions) {
                for (const condition of conditions) {
                    const conditionValues = condition.values ?? [];
                    if (condition.name == "equipment-index") {
                        const allowedIndexes = conditionValues.map(v => Number(v));
                        if (!allowedIndexes.includes(inventoryIndex)) {
                            conditionsMet = false;
                            break;
                        }
                    }
                    if (condition.name == "weapon-type") {
                        if (!conditionValues.includes(weapon.weaponType)) {
                            conditionsMet = false;
                            break;
                        }
                    }
                }
            }
            if (conditionsMet) {
                modifiers.push(modifier);
            }
        }
        const modifier = modifiers.map(m => Number(m.value)).reduce((a, b) => a + b, 0);
        return modifier;
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
            equipment: this.equipment,
            portrait: this.portrait,
            description: this.description,
            historyNotes: this.historyNotes,
            selections: this.selections,
            modifiers: this.modifiers
        }
    }
}
