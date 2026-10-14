
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

    getModifiers({
        target,
        inventoryIndex,
        weaponProperties,
        relevantAbility,
        applyAbilityModifier,
        applyProficiencyModifier
    }) {
        return this.#getModifiers(
            target, inventoryIndex, weaponProperties ?? [], relevantAbility, applyAbilityModifier, applyProficiencyModifier);
    }

    getAttackCard({
        name,
        title,
        inventoryIndex,
        hasSavingThrow,
        relevantAbility,
        applyAbilityModifier,
        applyAbilityModifierForDamage,
        applyProficiencyModifier,
        applyProficiencyModifierForDamage,
        damageDieSize,
        damageDice,
        damageType,
        reach,
        range,
        target,
        notes
    }) {
        const applyAbilityModifierInteral = this.#getApplyModifierValue(applyAbilityModifier, true);
        const applyAbilityModifierForDamageInternal = this.#getApplyModifierValue(applyAbilityModifierForDamage, true);
        const applyProficiencyModifierInternal = this.#getApplyModifierValue(applyProficiencyModifier, true);
        const applyProficiencyModifierForDamageInternal = this.#getApplyModifierValue(applyProficiencyModifierForDamage, false);
        const weaponProperties = this.equipment[Number(inventoryIndex)]?.properties ?? [];
        const toHitOrDcModifiers = this.#getModifiers(
            hasSavingThrow ? "dc" : "to-hit", inventoryIndex, weaponProperties, relevantAbility, applyAbilityModifierInteral, applyProficiencyModifierInternal);
        const toHitOrDcModifier = Number(toHitOrDcModifiers.map(m => m.value).reduce((a, b) => a + b, 0));
        const damageModifiers = this.#getModifiers(
            "damage", inventoryIndex, weaponProperties, relevantAbility, applyAbilityModifierForDamageInternal, applyProficiencyModifierForDamageInternal);
        const damageModifier = Number(damageModifiers.map(m => m.value).reduce((a, b) => a + b, 0));
        let toHitOrDcLabel = "";
        if (hasSavingThrow) {
            toHitOrDcLabel = this.#getSavingThrowLabel(8 + toHitOrDcModifier, relevantAbility);
        }
        else {
            toHitOrDcLabel = this.#getToHitLabel(toHitOrDcModifier);
        }
        let damageDiceInternal = damageDice;
        if (!damageDiceInternal && damageDieSize) {
            let damageDieSizeModifiers = this.#getTargetModifiers(inventoryIndex, weaponProperties, "damage-die-size");
            if (damageDieSizeModifiers.length > 0) {
                damageDieSize = Math.max(...damageDieSizeModifiers.map(dm => Number(dm.value)));
            }
            damageDiceInternal = [{ number: 1, size: damageDieSize }];
        }
        const damageLabel = this.#getDamageLabel(damageDiceInternal, damageModifier, damageType);
        const line1Parts = [toHitOrDcLabel];
        if (damageLabel) {
            line1Parts.push(damageLabel);
        }
        if (reach) {
            line1Parts.push(`reach ${reach} ft.`);
        }
        if (range) {
            line1Parts.push(range)
        }
        if (target) {
            line1Parts.push(target);
        }
        const lines = [line1Parts.join(", ")];
        if (name == "basic-unarmed-strike" || this.#canBeOffhand(inventoryIndex, weaponProperties)) {
            const abilities = ["strength", "intelligence", "wisdom", "dexterity", "constitution", "charisma"];
            const offHandDamageModifiers = damageModifiers.filter(dm => !(abilities.includes(dm.name) && Number(dm.value) > 0));
            const offHandDamageModifier = Number(offHandDamageModifiers.map(m => m.value).reduce((a, b) => a + b, 0));
            const offHandDamageLabel = this.#getDamageLabel(damageDiceInternal, offHandDamageModifier, damageType);
            lines.push(`Off hand: ${toHitOrDcLabel}, ${offHandDamageLabel}, bonus action`);
        }
        if (notes) {
            for (const note of notes) {
                lines.push(note);
            }
        }
        const modifiers = this.#getDisplayModifiers(toHitOrDcModifiers, damageModifiers, hasSavingThrow);
        return {
            name: name,
            title: this.#getSubstring(title ?? "Attack", 40),
            displayType: "attack-card",
            lines: lines,
            modifiers: modifiers
        };
    }

    #getSubstring(valueIn, length) {
        let valueOut = valueIn ?? "";
        if (valueOut.length > length) {
            valueOut = valueOut.substring(0, length) + "...";
        }
        return valueOut;
    }

    #getApplyModifierValue(modifierIn, defaultValue) {
        let modifierOut = defaultValue;
        if (modifierIn == true || modifierIn == false) {
            modifierOut = modifierIn;
        }
        return modifierOut;
    }

    #getModifiers(target, inventoryIndex, weaponProperties, relevantAbility, applyAbilityModifier, applyProficiencyModifier) {
        const modifiers = this.#getTargetModifiers(inventoryIndex, weaponProperties, target);
        if (applyProficiencyModifier) {
            modifiers.push(this.#getProficiencyModifier(weaponProperties));
        }
        if (applyAbilityModifier) {
            modifiers.push(this.#getAbilityModifier(weaponProperties, relevantAbility))
        }
        for (const modifier of modifiers) {
            modifier.target = target;
        }
        return modifiers;
    }

    #getTargetModifiers(inventoryIndex, weaponProperties, target) {
        const modifiers = [];
        let targetModifiers = this.modifiers.filter(m => m.target == target);
        for (const modifier of targetModifiers) {
            let conditionsMet = true;
            if (modifier.conditions) {
                conditionsMet = false;
                for (const condition of modifier.conditions) {
                    const conditionValues = condition.values ?? [];
                    if (condition.name == "equipment-index") {
                        const allowedIndexes = conditionValues.map(v => Number(v));
                        if (!allowedIndexes.includes(inventoryIndex)) {
                            continue;
                        }
                    }
                    if (condition.name == "weapon-type") {
                        const weaponType = weaponProperties.find(wp => wp.name == "weapon-type")?.value;
                        if (!conditionValues.includes(weaponType)) {
                            continue;
                        }
                    }
                    conditionsMet = true;
                }
            }
            if (conditionsMet) {
                modifiers.push(modifier);
            }
        }
        return modifiers;
    }

    #getProficiencyModifier(weaponProperties) {
        let proficiencyModifier = 0;
        const weaponName = weaponProperties.find(wp => wp.name == "weapon-name")?.value;
        const weaponType = weaponProperties.find(wp => wp.name == "weapon-type")?.value;
        const isProficient = this.modifiers.some(m =>
            m.target == "weapon-proficiency"
            && (m.value == weaponName || m.value == weaponType));
        if (!weaponName || isProficient) {
            proficiencyModifier = this.getProficiencyBonus();
        }
        return {
            name: "proficiency",
            title: "Proficiency",
            value: proficiencyModifier
        }
    }

    #getAbilityModifier(weaponProperties, relevantAbility) {
        let relevantAbilityModifier = 0;
        if (relevantAbility) {
            relevantAbilityModifier = this.getAbilityScoreModifier(relevantAbility.name);
        }
        else {
            const strengthModifier = this.getAbilityScoreModifier("strength");
            const dexterityModifier = this.getAbilityScoreModifier("dexterity");
            const weaponType = weaponProperties.find(wp => wp.name == "weapon-type")?.value;
            const isVersatile = weaponProperties.some(wp => wp.name == "versatile");
            if ((weaponType == "simple-ranged")
                || (weaponType == "martial-ranged")
                || (isVersatile && (dexterityModifier > strengthModifier))) {
                relevantAbility = { name: "dexterity", title: "Dexterity" };
                relevantAbilityModifier = dexterityModifier;
            }
            else {
                relevantAbility = { name: "strength", title: "Strength" };
                relevantAbilityModifier = strengthModifier
            }
        }
        return {
            name: relevantAbility.name,
            title: relevantAbility.title,
            value: relevantAbilityModifier
        }
    }

    #getSavingThrowLabel(dc, dcAbility) {
        return `DC ${dc} ${dcAbility.title} saving throw`;
    }

    #getToHitLabel(toHitModifier) {
        if (Number(toHitModifier) >= 0) {
            return `+${toHitModifier} to hit`;
        }
        return `-${Math.abs(toHitModifier)} to hit`;
    }

    #getDamageLabel(damageDice, modifier, damageType) {
        if (!damageDice || damageDice.length == 0) {
            return "";
        }
        const damageDieLabels = [];
        for (const damageDie of damageDice) {
            damageDieLabels.push(`${damageDie.number}d${damageDie.size}`)
        }
        let label = damageDieLabels.join(" + ");
        if (label == "1d1") {
            label = "1";
        }
        const numberModifier = Number(modifier);
        if (numberModifier > 0) {
            label += ` + ${numberModifier}`;
        }
        if (numberModifier < 0) {
            label += ` - ${Math.abs(numberModifier)}`;
        }
        if (damageType) {
            label += ` ${damageType}`;
        }
        label += " damage";
        return label;
    }

    #canBeOffhand(inventoryIndex, weaponProperties) {
        const isLight = weaponProperties.some(wp => wp.name == "light");
        if (isLight) {
            return true;
        }
        const modifiers = this.#getModifiers("off-hand-weapon", inventoryIndex, weaponProperties, null, false, false);
        if (modifiers.length > 0) {
            return true;
        }
        return false;
    }

    #getDisplayModifiers(toHitModifiers, damageModifiers, hasSavingThrow) {
        let displayModifiers = [];
        const toHitOrDcLabel = hasSavingThrow ? "dc" : "to hit";
        for (const toHitModifier of toHitModifiers) {
            const value = Number(toHitModifier.value);
            let label = null;
            if (value > 0) {
                label = `+${value} ${toHitOrDcLabel}`;
            }
            if (value < 0) {
                label = `${value} ${toHitOrDcLabel}`;
            }
            if (label && toHitModifier.title) {
                displayModifiers.push({
                    name: toHitModifier.name,
                    title: this.#getSubstring(toHitModifier.title, 40),
                    toHitLabel: label
                });
            }
        }
        for (const damageModifier of damageModifiers) {
            const value = Number(damageModifier.value);
            let label = null;
            if (value > 0) {
                label = `+${value} damage`;
            }
            if (value < 0) {
                label = `${value} damage`;
            }
            if (label) {
                let displayModifier = displayModifiers.find(dm => dm.name == damageModifier.name);
                if (displayModifier) {
                    displayModifier.damageLabel = label;
                }
                else {
                    displayModifiers.push({
                        name: damageModifier.name,
                        title: this.#getSubstring(damageModifier.title, 40),
                        damageLabel: label
                    });
                }
            } 
        }
        for (const displayModifier of displayModifiers) {
            let label = `${displayModifier.toHitLabel ?? ""}, ${displayModifier.damageLabel ?? ""}`.trim();
            if (label.startsWith(",") || label.endsWith(",")) {
                label = label.replace(",", "").trim();
            }
            // console.log(label);
            const title = this.#getSubstring(displayModifier.title, 40);
            displayModifier.label = `${title}: ${label}`;
        }
        return displayModifiers.map(dm => dm.label);
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
