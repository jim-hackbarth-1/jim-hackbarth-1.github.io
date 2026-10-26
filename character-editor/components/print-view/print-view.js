
import { Character, Sources, Utilities } from "../../domain/references.js";
import { EditorViewModel } from "../editor-view/editor-view.js";

export function createModel() {
    return new PrintViewModel();
}

class PrintViewModel {

    #kitElement;

    async init(kitElement) {
        this.#kitElement = kitElement;
        const elementKey = this.#kitElement.getAttribute("kit-element-key");
        const characterUpdateSubscriber = {
            elementKey: elementKey,
            id: `${EditorViewModel.CharacterUpdateTopic}-${elementKey}`,
            object: this,
            callback: this.onCharacterUpdate.name
        };
        UIKit.messenger.subscribe(EditorViewModel.CharacterUpdateTopic, characterUpdateSubscriber);
    }

    async onCharacterUpdate(message) {
        await this.#updateView();
    }

    async onRendered() {
        await this.#updateView();
    }

    getAbilities() {
        const character = EditorViewModel.character;
        const proficiencyBonus = Number(character.getProficiencyBonus());
        const abilities = [];
        for (const ability of Sources.getAbilities()) {
            const value = character.getAbilityScore(ability.name);
            const modifier = character.getAbilityScoreModifier(ability.name);
            const modifierLabel = (modifier >= 0) ? `+ ${modifier}` : `- ${Math.abs(modifier)}`;
            const isProficient = character.modifiers.some(m => m.target == "saving-throw-proficiency" && m.value == ability.name);
            let savingThrow = Number(modifier);
            if (isProficient) {
                savingThrow += proficiencyBonus;
            }
            const savingThrowLabel = (savingThrow >= 0) ? `+ ${savingThrow}` : `- ${Math.abs(savingThrow)}`;
            abilities.push({
                title: ability.title,
                value: value,
                modifier: modifierLabel,
                isProficient: isProficient,
                savingThrow: savingThrowLabel
            })
        }
        return abilities;
    }

    getSkills() {
        const character = EditorViewModel.character;
        const proficiencyBonus = Number(character.getProficiencyBonus());
        const skills = [];
        for (const skill of Sources.getSkills()) {
            let modifier = Number(character.getAbilityScoreModifier(skill.ability));
            const isProficient = character.modifiers.some(m => m.target == "skill-proficiency" && m.value == skill.name);
            if (isProficient) {
                modifier += proficiencyBonus;
            }
            // additional modifiers
            const skillModifiers = this.#getModifiers(character, `skill:${skill.name}`);
            modifier += Number(skillModifiers);
            const modifierLabel = (modifier >= 0) ? `+ ${modifier}` : `- ${Math.abs(modifier)}`;
            skills.push({
                title: skill.title,
                isProficient: isProficient,
                modifier: modifierLabel
            });
        }
        return skills;
    }

    getLanguages() {
        const character = EditorViewModel.character;
        let languages = character.modifiers.filter(m => m.target == "language").map(m => m.value.text);
        languages = Utilities.distinct(languages);
        languages = Utilities.sort(languages);
        return languages;
    }

    async #updateView() {

        const character = EditorViewModel.character;

        // name
        this.#kitElement.querySelector("#name-heading").innerText = character.name ?? "[character name]";

        // portrait
        this.#kitElement.querySelector("#portrait").src = character.portrait ?? "";

        // classes
        this.#updateClasses(character);

        // proficiency bonus
        this.#kitElement.querySelector("#proficiency-bonus").innerText = `+${character.getProficiencyBonus()}`;

        // race
        this.#updateRace(character);

        // size
        const race = this.#getRace(character);
        this.#kitElement.querySelector("#size").innerText = race?.size ?? "";

        // alignment
        this.#kitElement.querySelector("#alignment").innerText = character.alignment?.text ?? "";

        // background
        this.#kitElement.querySelector("#background").innerText = character.background?.text ?? "";

        // description
        this.#kitElement.querySelector("#description").innerHTML = character.description ?? "";

        // initiative
        this.#updateInitiative(character);

        // speed
        this.#updateSpeed(character, race);

        // ac
        this.#kitElement.querySelector("#armor-class").innerHTML = character.getArmorClass();

        // hp
        this.#kitElement.querySelector("#hit-points").innerHTML = character.getHitPoints();

        // hit dice
        this.#updateHitDice(character);

        // abilities
        await UIKit.renderer.renderElement(this.#kitElement.querySelector("#abilities-row"));

        // skills
        await UIKit.renderer.renderElement(this.#kitElement.querySelector("#skills"));

        // armor proficiencies
        this.#updateArmorProficiencies(character);

        // weapon proficiencies
        this.#updateWeaponProficiencies(character);

        // tool proficiencies
        this.#updateToolProficiencies(character);

        // attack cards
        this.#updateAttackCards(character);

        // languages
        await UIKit.renderer.renderElement(this.#kitElement.querySelector("#languages"));

        // feature cards
        this.#updateFeatureCards(character);

        // spell cards
        this.#updateSpellCards(character);
    }

    #updateClasses(character) {
        let classesHtml = "";
        const characterClasses = character.classes.filter(c => c.value && c.text && c.level);
        for (const characterClass of characterClasses) {
            classesHtml += `<div class="row no-wrap">${characterClass.text}, Level ${characterClass.level}</div>`;
        }
        this.#kitElement.querySelector("#classes").innerHTML = classesHtml;
    }

    #updateRace(character) {
        let race = "";
        if (character.race?.value || character.subRace?.value) {
            race = character.subRace?.text ?? character.race.text ?? "";
        }
        this.#kitElement.querySelector("#race").innerText = race;
    }

    #getRace(character) {
        if (character.race?.value) {
            return Sources.getRaces(character.sources).find(r => r.name == character.race.value);
        }
        return null;
    }

    #updateInitiative(character) {
        const dexModifier = character.getAbilityScoreModifier("dexterity");
        const initModifiers = this.#getModifiers(character, "initiative");
        const initiative = Number(dexModifier) + Number(initModifiers);
        this.#kitElement.querySelector("#initiative").innerHTML = (initiative < 0) ? `${initiative}` : `+${initiative}`;
    }

    #updateSpeed(character, race) {
        const baseSpeed = race?.speed ?? 30;
        const speedModifiers = this.#getModifiers(character, "speed");
        this.#kitElement.querySelector("#speed").innerHTML = Number(baseSpeed) + Number(speedModifiers);
    }

    #updateHitDice(character) {
        const labels = [];
        const classes = character.classes.filter(c => c.value && c.level);
        for (const characterClass of classes) {
            const hitDieSize = Sources.getClasses(character.sources).find(c => c.name == characterClass.value).hitDieSize
            labels.push(`${characterClass.level}d${hitDieSize}`);
        }
        this.#kitElement.querySelector("#hit-dice").innerHTML = labels.join(", ");
    }

    #updateArmorProficiencies(character) {
        let armorProficiencyLabel = "";
        let armorTypeProficiencies = [
            { name: "light-armor", title: "Light Armor" },
            { name: "medium-armor", title: "Medium Armor" },
            { name: "heavy-armor", title: "Heavy Armor" }
        ];
        armorTypeProficiencies = armorTypeProficiencies
            .filter(p => character.modifiers.some(m => m.target == "armor-proficiency" && m.value == p.name))
            .map(p => p.title);
        armorTypeProficiencies = Utilities.sort(armorTypeProficiencies);
        if (armorTypeProficiencies.length) {
            armorProficiencyLabel += `<div>${armorTypeProficiencies.join("</div><div>")}</div>`
        }
        let armorProficiencies = Sources.getEquipment(character.sources, "armor");
        armorProficiencies = armorProficiencies
            .filter(p => character.modifiers.some(m => m.target == "armor-proficiency" && m.value == p.name))
            .map(p => p.title);
        armorProficiencies = Utilities.sort(armorProficiencies);
        if (armorProficiencies.length) {
            armorProficiencyLabel += `<div>${armorProficiencies.join(", ")}</div>`
        }
        if (!armorProficiencyLabel) {
            armorProficiencyLabel = "[None]";
        }
        this.#kitElement.querySelector("#armor-proficiencies").innerHTML = armorProficiencyLabel;
    }

    #updateWeaponProficiencies(character) {
        let weaponProficiencyLabel = "";
        let weaponTypeProficiencies = [
            { name: "simple-melee", title: "Simple melee weapons" },
            { name: "martial-melee", title: "Martial melee weapons" },
            { name: "simple-ranged", title: "Simple ranged weapons" },
            { name: "martial-ranged", title: "Martial ranged weapons" }
        ];
        weaponTypeProficiencies = weaponTypeProficiencies
            .filter(p => character.modifiers.some(m => m.target == "weapon-proficiency" && m.value == p.name))
            .map(p => p.title);
        weaponTypeProficiencies = Utilities.sort(weaponTypeProficiencies);
        if (weaponTypeProficiencies.length) {
            weaponProficiencyLabel += `<div>${weaponTypeProficiencies.join("</div><div>")}</div>`
        }
        let weaponProficiencies = Sources.getEquipment(character.sources, "weapons");
        weaponProficiencies = weaponProficiencies
            .filter(p => character.modifiers.some(m => m.target == "weapon-proficiency" && m.value == p.name))
            .map(p => p.title);
        weaponProficiencies = Utilities.sort(weaponProficiencies);
        if (weaponProficiencies.length) {
            weaponProficiencyLabel += `<div>${weaponProficiencies.join(", ")}</div>`
        }
        if (!weaponProficiencyLabel) {
            weaponProficiencyLabel = "[None]";
        }
        this.#kitElement.querySelector("#weapon-proficiencies").innerHTML = weaponProficiencyLabel;
    }

    #updateToolProficiencies(character) {
        let toolProficiencyLabel = "";
        let toolProficiencies = Sources.getEquipment(character.sources, "tools");
        toolProficiencies = toolProficiencies
            .filter(p => character.modifiers.some(m => m.target == "tool-proficiency" && m.value == p.name))
            .map(p => p.title);
        toolProficiencies = Utilities.sort(toolProficiencies);
        if (toolProficiencies.length) {
            toolProficiencyLabel += `<div>${toolProficiencies.join("</div><div>")}</div>`
        }
        if (!toolProficiencyLabel) {
            toolProficiencyLabel = "[None]";
        }
        this.#kitElement.querySelector("#tool-proficiencies").innerHTML = toolProficiencyLabel;
    }

    #updateAttackCards(character) {
        const attackRows = [...this.#kitElement.querySelectorAll(".attack-row")];
        for (const attackRow of attackRows) {
            attackRow.remove();
        }
        const allAttackCards = Sources.getCharacterFeatures(character).filter(f => f.displayType == "attack-card");
        const attackCards = [];
        for (const card of allAttackCards) {
            const existingTitle = attackCards.some(ac => ac.title == card.title);
            let existingLines = false;
            if (existingTitle) {
                existingLines = attackCards.some(ac => Utilities.areArraysEqual(ac.lines, card.lines));
            }
            if (!existingTitle || !existingLines) {
                attackCards.push(card);
            }
        }
        let cardsHtml = "";
        for (const card of attackCards) {
            let linesHtml = "";
            const lines = card.lines ?? [];
            for (const line of lines) {
                linesHtml += `
                 <div>${line}</div>`;
            }
            let modifiersHtml = "";
            const modifiers = card.modifiers ?? [];
            for (const modifier of modifiers) {
                modifiersHtml += `
                 <div class="no-wrap">${modifier}</div>`;
            }
            cardsHtml += `
                 <div class="row attack-row">
                     <div class="card attack-card">
                         <div class="corner top-left" kit-component="no-model:./resources/icons/top-left.html"></div>
                         <div class="attack-table">
                             <div>
                                 <div class="field-label no-wrap">${card.title}:</div>
                                 <div style="width:100%">
                                     ${linesHtml}
                                 </div>
                                 <div class="attack-modifier-container">
                                     ${modifiersHtml}
                                 </div>
                             </div>
                         </div>
                         <div class="corner bottom-right" kit-component="no-model:./resources/icons/bottom-right.html"></div>
                     </div>
                 </div>
             `;
        }
        cardsHtml += `
            <div id="attacks-placeholder"></div>`;
        this.#kitElement.querySelector("#attacks-placeholder").outerHTML = cardsHtml;
    }

    #updateFeatureCards(character) {
        this.#kitElement.querySelector("#features-col-1").innerHTML = `<div id="features-col-1-placeholder"></div>`;
        this.#kitElement.querySelector("#features-col-2").innerHTML = `<div id="features-col-2-placeholder"></div>`;
        this.#kitElement.querySelector("#features-col-3").innerHTML = `<div id="features-col-3-placeholder"></div>`;
        // this.#kitElement.querySelector("#features-col-1-placeholder").outerHTML = this.#getModifiersCardHtml(character);
        this.#kitElement.querySelector("#features-col-3-placeholder").outerHTML = this.#getEquipmentCardHtml(character);
        const featureCards = Sources.getCharacterFeatures(character).filter(f => f.displayType == "feature-card");
        this.#kitElement.querySelector("#features-col-1-placeholder").outerHTML = this.#getFeaturesUseInfoCardHtml(featureCards);
        const featuresLength = featureCards.length;
        for (let i = 0; i < featuresLength; i++) {
            const displayColumn = this.#getNextColumn("features");
            const index = this.#getNextFeatureCardIndex(featureCards, displayColumn);
            if (index > -1) {
                const featureCard = featureCards[index];
                const featureCardHtml = this.#getCardHtml(featureCard, displayColumn);
                this.#kitElement.querySelector(`#features-col-${displayColumn}-placeholder`).outerHTML = featureCardHtml;
                featureCards.splice(index, 1);
            }
            else {
                break;
            }
        }
    }

    #updateSpellCards(character) {
        let spellCards = Sources.getCharacterFeatures(character).filter(f => f.displayType == "spell-card");
        for (const card of spellCards) {
            card.sortField = `${card.level}-${card.title}`;
        }
        spellCards = Utilities.sort(spellCards, ["sortField"]);
        const spellTitleRow = this.#kitElement.querySelector("#spells-title-row");
        const spellContainerRow = this.#kitElement.querySelector("#spells-container-row");
        if (spellCards.length > 0) {
            spellTitleRow.classList.remove("hidden");
            spellContainerRow.classList.remove("hidden");
        }
        else {
            spellTitleRow.classList.add("hidden");
            spellContainerRow.classList.add("hidden");
        }
        this.#kitElement.querySelector("#spells-col-1").innerHTML = `<div id="spells-col-1-placeholder"></div>`;
        this.#kitElement.querySelector("#spells-col-2").innerHTML = `<div id="spells-col-2-placeholder"></div>`;
        this.#kitElement.querySelector("#spells-col-3").innerHTML = `<div id="spells-col-3-placeholder"></div>`;
        this.#updateSpellSlotsCards(character);
        const spellsLength = spellCards.length;
        for (let i = 0; i < spellsLength; i++) {
            const displayColumn = this.#getNextColumn("spells");
            const index = (spellCards.length > 0) ? 0 : -1;
            if (index > -1) {
                const spellCard = spellCards[index];
                const spellCardHtml = this.#getCardHtml(spellCard, displayColumn);
                this.#kitElement.querySelector(`#spells-col-${displayColumn}-placeholder`).outerHTML = spellCardHtml;
                spellCards.splice(index, 1);
            }
            else {
                break;
            }
        }
    }

    #getModifiers(character, target) {
        return character.modifiers
            .filter(m => m.target == target)
            .map(m => m.value)
            .reduce((a, b) => a + b, 0);
    }

    #getModifiersCardHtml(character) {
        let abilityLabels = "";
        const abilities = Sources.getAbilities();
        for (const ability of abilities) {
            abilityLabels += this.#getModifiersHtml(character, `ability-score:${ability.name}`, ability.title);
        }
        const initModifiers = this.#getInitiativeModifiers(character);
        const initLabel = this.#getModifierLabelsHtml("Initiative", initModifiers);
        const speedLabel = this.#getModifiersHtml(character, "speed", "Speed")
        const acModifiers = this.#getArmorClassModifiers(character);
        const acLabel = this.#getModifierLabelsHtml("Armor Class", acModifiers);
        const hpLabel = this.#getModifiersHtml(character, "hit-points", "Hit Points")
        let skillLabels = "";
        const skills = Sources.getSkills();
        for (const skill of skills) {
            const skillModifiers = this.#getSkillModifiers(character, skill);
            skillLabels += this.#getModifierLabelsHtml(skill.title, skillModifiers);
        }
        return `
            <div class="card feature-card modifiers-card">
                <div class="corner top-left">
                    <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100">
                        <path d=" M 0,0 l 100,0 a 100 100 0 0 0 -100 100 z"></path>
                    </svg>
                </div>
                <div class="field-label">Modifiers<span class="modifier-note"> <b>*</b></span></div>
                <div class="modifiers-content">
                    ${abilityLabels}
                    ${initLabel}
                    ${speedLabel}
                    ${acLabel}
                    ${hpLabel}
                    ${skillLabels}
                </div>
                <div class="modifier-note"><b>*</b> The modifiers above have been applied to the calculated values.</div>
                <div class="corner bottom-right">
                    <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100">
                        <path d=" M 100,0 a 100 100 0 0 1 -100 100 l 100,0 z"></path>
                    </svg>
                </div>
            </div>
            <div id="features-col-1-placeholder"></div>
        `;
    }

    #getFeaturesUseInfoCardHtml(featureCards) {
        const featuresWithUseInfo = featureCards.filter(fc => fc.useInfo).map(fc => ({
            reset: fc.useInfo.reset,
            uses: fc.useInfo.uses,
            title: fc.title
        }));
        if (featuresWithUseInfo.length == 0) {
            return `<div id="features-col-1-placeholder"></div>`;
        }
        let resetCategories = [
            { name: "short-rest", title: "Per Short rest" },
            { name: "long-rest", title: "Per Long rest" }
        ];
        const useInfoLabels = [];
        for (const resetCategory of resetCategories) {
            let label = `<div>${resetCategory.title}:</div><ul>`
            const features = featuresWithUseInfo
                .filter(f => f.reset == resetCategory.name)
                .map(f => ({
                    title: f.title,
                    uses: f.uses
                }));
            if (features && features.length > 0) {
                for (const feature of features) {
                    const uses = Number(feature.uses);
                    let useLabel = `${uses} use`;
                    if (uses > 1) {
                        useLabel += "s";
                    }
                    let fillInBoxes = "";
                    for (let i = 0; i < uses; i++) {
                        fillInBoxes += "<div class='fill-in-box-small'></div>";
                    }
                    label += `<li>${feature.title} (${useLabel}): ${fillInBoxes}</li>`;
                }
                label += "</ul>";
                useInfoLabels.push(label);
            }
        }
        const useInfoLabelsHtml = useInfoLabels.join("");
        return `
            <div class="card feature-card">
                <div class="corner top-left">
                    <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100">
                        <path d=" M 0,0 l 100,0 a 100 100 0 0 0 -100 100 z"></path>
                    </svg>
                </div>
                <div class="field-label">Feature uses</div>
                <div>
                    ${useInfoLabelsHtml}
                </div>
                <div class="corner bottom-right">
                    <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100">
                        <path d=" M 100,0 a 100 100 0 0 1 -100 100 l 100,0 z"></path>
                    </svg>
                </div>
            </div>
            <div id="features-col-1-placeholder"></div>
        `;
    }

    #updateSpellSlotsCards(character) {
        const spellCastingInfoList = [];
        const allSpells = Sources.getSpells(character.sources);
        for (const characterClass of character.classes) {
            if (characterClass.value) {
                let spellCastingInfo = null;
                const cls = Sources.getClasses(character.sources).find(c => c.name == characterClass.value);
                if (cls?.getSpellCastingInfo) {
                    spellCastingInfo = cls.getSpellCastingInfo(character, allSpells);
                }
                if (characterClass.subClass) {
                    const subClass = Sources.getSubClasses(character.sources, characterClass.value)
                        .find(sc => sc.name == characterClass.subClass.value);
                    if (subClass?.getSpellCastingInfo) {
                        spellCastingInfo = subClass.getSpellCastingInfo(character, allSpells, spellCastingInfo);
                    }
                }
                if (spellCastingInfo) {
                    spellCastingInfoList.push(spellCastingInfo);
                }
            }
        }
        for (const spellCastingInfo of spellCastingInfoList) {
            const displayColumn = this.#getNextColumn("spells");
            const levelLabels = [];
            for (const level of spellCastingInfo.spellLevels) {
                let fillInBoxes = "";
                for (let i = 0; i < level.slots; i++) {
                    fillInBoxes += "<div class='fill-in-box-small'></div>";
                }
                let levelHtml = `
                    <div class="fill-in-box-small-container">
                        <div class="spell-slots-label">Level ${level.level} spell slots (${level.slots}):</div>
                        ${fillInBoxes}
                    </div>
                `;
                let spellsHtml = "<ul>";
                for (const spell of level.spells) {
                    let spellFillIn = "";
                    if (spellCastingInfo.prepareSpells) {
                        spellFillIn = "<div class='fill-in-box-small'></div>";
                    }
                    if (spell.alwaysPrepared) {
                        spellFillIn = `
                            <div>
                                <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100">
                                    <text class="icon-text" x="35" y="70" stroke-width="1" style="font: 50px sans-serif;">A</text>
                                </svg>
                            </div>
                        `;
                    }
                    spellsHtml += `<li>${spell.title}</li>`;
                }
                levelHtml += spellsHtml;
                levelLabels.push(levelHtml);
            }
            const levelLabelsHtml = "<div>" + levelLabels.join("</div><div>") + "</div>";
            let html = `
                <div class="card feature-card">
                    <div class="corner top-left">
                        <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100">
                            <path d=" M 0,0 l 100,0 a 100 100 0 0 0 -100 100 z"></path>
                        </svg>
                    </div>
                    <div class="field-label">${spellCastingInfo.title}</div>
                    <div>
                        ${levelLabelsHtml}
                    </div>
                    <div class="corner bottom-right">
                        <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100">
                            <path d=" M 100,0 a 100 100 0 0 1 -100 100 l 100,0 z"></path>
                        </svg>
                    </div>
                </div>
                <div id="spells-col-${displayColumn}-placeholder"></div>
            `;
            this.#kitElement.querySelector(`#spells-col-${displayColumn}`).innerHTML = html;
        }
    }

    #getEquipmentCardHtml(character) {
        const allEquipment = Sources.getEquipment(character.sources);
        const items = character.equipment.map(e => allEquipment.find(ae => ae.name == e.name).title);
        let itemsWithCounts = [];
        for (const item of items) {
            const itemWithCount = itemsWithCounts.find(i => i.name == item);
            if (itemWithCount) {
                itemWithCount.count++;
            }
            else {
                itemsWithCounts.push({ name: item, count: 1 });
            }
        }
        for (const item of itemsWithCounts) {
            if (item.count > 1) {
                item.name += ` (x${item.count})`;
            }
        }
        itemsWithCounts = Utilities.sort(itemsWithCounts, "name");
        let equipmentListHtml = "[None]";
        if (itemsWithCounts.length > 0) {
            equipmentListHtml = `<ul><li>${itemsWithCounts.map(i => i.name).join("</li><li>")}</li></ul>`;
        }
        return `
            <div class="card feature-card">
                <div class="corner top-left">
                    <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100">
                        <path d=" M 0,0 l 100,0 a 100 100 0 0 0 -100 100 z"></path>
                    </svg>
                </div>
                <div class="field-label">Equipment</div>
                <div>
                    ${equipmentListHtml}
                </div>
                <div class="corner bottom-right">
                    <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100">
                        <path d=" M 100,0 a 100 100 0 0 1 -100 100 l 100,0 z"></path>
                    </svg>
                </div>
            </div>
            <div id="features-col-3-placeholder"></div>
        `;
    }

    #getModifiersHtml(character, value, title) {
        const modifiers = character.modifiers.filter(m => m.target == value);
        const modifierLabels = this.#getModifierLabels(modifiers);
        return this.#getModifierLabelsHtml(title, modifierLabels);
    }

    #getModifierLabels(modifiers) {
        const labels = [];
        for (const modifier of modifiers) {
            const value = Number(modifier.value);
            if (value > 0) {
                labels.push(`${modifier.title}: +${modifier.value}`);
            }
            if (value < 0) {
                labels.push(`${modifier.title}: ${modifier.value}`);
            }
        }
        return labels;
    }

    #getModifierLabelsHtml(title, modifierLabels) {
        if (modifierLabels.length > 0) {
            return `
                <div>${title}</div>
                <ul>
                    <li>${modifierLabels.join("</li><li>")}</li>
                </ul>
            `;
        }
        return "";
    }

    #getInitiativeModifiers(character) {
        const modifiers = character.modifiers.filter(m => m.target == "initiative");
        const labels = this.#getModifierLabels(modifiers);
        let dexModifier = Number(character.getAbilityScoreModifier("dexterity"));
        if (dexModifier < 0) {
            labels.unshift(`Dexterity: ${dexModifier}`);
        }
        if (dexModifier > 0) {
            labels.unshift(`Dexterity: +${dexModifier}`);
        }
        return labels;
    }

    #getSkillModifiers(character, skill) {
        const modifiers = character.modifiers.filter(m => m.target == `skill:${skill.name}`);
        const labels = this.#getModifierLabels(modifiers);
        const abilityTitle = Sources.getAbilities().find(a => a.name == skill.ability).title;
        let abilityModifier = Number(character.getAbilityScoreModifier(skill.ability));
        if (abilityModifier < 0) {
            labels.unshift(`${abilityTitle}: ${abilityModifier}`);
        }
        if (abilityModifier > 0) {
            labels.unshift(`${abilityTitle}: +${abilityModifier}`);
        }
        return labels;
    }

    #getArmorClassModifiers(character) {
        const modifiers = character.modifiers.filter(m => m.target == "armor-class");
        const labels = this.#getModifierLabels(modifiers);
        let dexModifier = Number(character.getAbilityScoreModifier("dexterity"));
        let dexModifierLabel = "";
        if (dexModifier < 0) {
            dexModifierLabel = `Dexterity: ${dexModifier}`;
        }
        if (dexModifier > 0) {
            dexModifierLabel = `Dexterity: +${dexModifier}`;
        }
        const armorType = character.equipment.find(e => e.name == "armor-type" && e.value != "shield" && e.isEquipped);
        if (armorType == "medium-armor" && dexModifier > 2) {
            dexModifierLabel = "Dexterity: +2 (Medium Armor)";
        }
        if (armorType == "heavy-armor" && dexModifier > 0) {
            dexModifierLabel = "Dexterity: 0 (Heavy Armor)";
        }
        if (dexModifierLabel) {
            labels.unshift(dexModifierLabel);
        }
        return labels;
    }

    #getNextColumn(prefix) {
        const col1Height = Number(this.#getColumnHeight(prefix, 1));
        const col2Height = Number(this.#getColumnHeight(prefix, 2));
        const col3Height = Number(this.#getColumnHeight(prefix, 3));
        let minHeight = col1Height;
        let minColumn = 1;
        if (col2Height < minHeight) {
            minHeight = col2Height;
            minColumn = 2;
        }
        if (col3Height < minHeight) {
            minHeight = col3Height;
            minColumn = 3;
        }
        return minColumn;
    }

    #getColumnHeight(prefix, index) {
        return [...this.#kitElement.querySelector(`#${prefix}-col-${index}`).children]
            .map(c => Number(c.clientHeight))
            .reduce((a, b) => a + b, 0);
    }

    #getNextFeatureCardIndex(cards, columnIndex) {
        let sources = ["race", "sub-race", "background", "class", "sub-class", "feature", "equipment"];[];
        if (columnIndex == 2) {
            sources = ["class", "sub-class", "feature", "race", "sub-race", "background", "equipment"];
        }
        if (columnIndex == 3) {
            sources = ["equipment", "class", "sub-class", "feature", "race", "sub-race", "background"];
        }
        let cardIndex = -1;
        for (const source of sources) {
            cardIndex = cards.findIndex(c => c.source?.name == source);
            if (cardIndex > -1) {
                break;
            }
        }
        if (cardIndex < 0 && cards.length > 0) {
            cardIndex = 0;
        }
        return cardIndex;
    }

    #getCardHtml(card, displayColumn) {
        let cardSourceClass = "";
        let hr = "<hr />";
        if (["race", "sub-race"].includes(card.source.name)) {
            cardSourceClass = "race-card";
        }
        if (card.source.name == "feat") {
            cardSourceClass = "feat-card";
        }
        if (card.source.name == "background") {
            cardSourceClass = "background-card";
        }
        if (card.source.name == "equipment") {
            cardSourceClass = "equipment-card";
            hr = "";
        }
        if (card.source.name == "spell") {
            cardSourceClass = "spell-card"
            hr = "";
        }
        let sourceHtml = "";
        if (card.source?.title) {
            sourceHtml = `<div class="feature-card-source">Source: ${card.source.title}</div>`
        }
        let placeholderPrefix = "features";
        if (card.source.name == "spell") {
            placeholderPrefix = "spells";
        }
        return `
            <div class="card feature-card ${cardSourceClass}">
                <div class="corner top-left">
                    <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100">
                        <path d=" M 0,0 l 100,0 a 100 100 0 0 0 -100 100 z"></path>
                    </svg>
                </div>
                <div>
                    <h3>${card.title}</h3>
                    ${hr}
                    ${sourceHtml}
                    <div class="content">
                        ${card.html}
                    </div>
                </div>
                <div class="corner bottom-right">
                    <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100">
                        <path d=" M 100,0 a 100 100 0 0 1 -100 100 l 100,0 z"></path>
                    </svg>
                </div>
            </div>
            <div id="${placeholderPrefix}-col-${displayColumn}-placeholder"></div>
        `;
    }

}
