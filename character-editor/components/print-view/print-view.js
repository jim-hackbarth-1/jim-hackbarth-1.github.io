
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

    async #updateView() {

        const character = EditorViewModel.character;

        // name
        this.#kitElement.querySelector("#name-heading").innerText = character.name ?? "[character name]";

        // portrait
        this.#kitElement.querySelector("#portrait").src = character.portrait ?? "";

        // classes
        let classesHtml = "";
        const characterClasses = character.classes.filter(c => c.value && c.text && c.level);
        for (const characterClass of characterClasses) {
            classesHtml += `<div class="row no-wrap">${characterClass.text}, Level ${characterClass.level}</div>`;
        }
        this.#kitElement.querySelector("#classes").innerHTML = classesHtml;

        // proficiency bonus
        this.#kitElement.querySelector("#proficiency-bonus").innerText = `+${character.getProficiencyBonus()}`;

        // race
        let race = "";
        if (character.race?.value || character.subRace?.value) {
            race = character.subRace?.text ?? character.race.text ?? "";
        }
        this.#kitElement.querySelector("#race").innerText = race;

        // size
        let size = "";
        let baseSpeed = 30;
        if (character.race?.value) {
            const raceModel = Sources.getRaces(character.sources).find(r => r.name == character.race.value);
            size = raceModel?.size ?? "";
            baseSpeed = raceModel?.speed ?? baseSpeed;
        }
        this.#kitElement.querySelector("#size").innerText = size;

        // alignment
        let alignment = ""
        if (character.alignment?.value) {
            alignment = character.alignment.text ?? "";
        }
        this.#kitElement.querySelector("#alignment").innerText = alignment;

        // background
        let background = ""
        if (character.background?.value) {
            background = character.background.text ?? "";
        }
        this.#kitElement.querySelector("#background").innerText = background;

        // description
        this.#kitElement.querySelector("#description").innerHTML = character.description ?? "";

        // initiative
        const dexModifier = character.getAbilityScoreModifier("dexterity");
        const initModifiers = this.#getModifiers(character, "initiative");
        const initiative = Number(dexModifier) + Number(initModifiers);
        this.#kitElement.querySelector("#initiative").innerHTML = (initiative < 0) ? `${initiative}` : `+${initiative}`;

        // speed
        const speedModifiers = this.#getModifiers(character, "speed");
        const speed = Number(baseSpeed) + Number(speedModifiers);
        this.#kitElement.querySelector("#speed").innerHTML = speed;

        // ac
        this.#kitElement.querySelector("#armor-class").innerHTML = character.getArmorClass();

        // hp
        this.#kitElement.querySelector("#hit-points").innerHTML = character.getHitPoints();

        // hit dice
        this.#kitElement.querySelector("#hit-dice").innerHTML = Sources.getHitDice(character);

        // abilities
        await UIKit.renderer.renderElement(this.#kitElement.querySelector("#abilities-row"));

        // skills
        await UIKit.renderer.renderElement(this.#kitElement.querySelector("#skills"));

        // armor proficiencies
        let armorProficiencyLabel = "[None]";
        let armorProficiencies = [
            { name: "light-armor", title: "Light Armor" },
            { name: "medium-armor", title: "Medium Armor" },
            { name: "heavy-armor", title: "Heavy Armor" },
            { name: "shield", title: "Shield" }
        ];
        armorProficiencies = armorProficiencies.filter(p => character.modifiers.some(m => m.value == p.name)).map(p => p.title);
        if (armorProficiencies.length) {
            armorProficiencyLabel = `<div>${armorProficiencies.join("</div><div>")}</div>`
        }
        this.#kitElement.querySelector("#armor-proficiencies").innerHTML = armorProficiencyLabel;

        // weapon proficiencies
        // TODO: handle individual weapon proficiencies (use equipment list?)
        let weaponProficiencyLabel = "[None]";
        let weaponProficiencies = [
            { name: "simple-melee", title: "Simple melee weapons" },
            { name: "martial-melee", title: "Martial melee weapons" },
            { name: "simple-ranged", title: "Simple ranged weapons" },
            { name: "martial-ranged", title: "Martial ranged weapons" }
        ];
        weaponProficiencies = weaponProficiencies.filter(p => character.modifiers.some(m => m.value == p.name)).map(p => p.title);
        if (weaponProficiencies.length) {
            weaponProficiencyLabel = `<div>${weaponProficiencies.join("</div><div>")}</div>`
        }
        this.#kitElement.querySelector("#weapon-proficiencies").innerHTML = weaponProficiencyLabel;

        // tool proficiencies
        // TODO: use equipment list?
        let toolProficiencyLabel = "[None]";
        let toolProficiencies = [
            { name: "herbalism-kit", title: "Herbalism Kit" }
        ];
        toolProficiencies = toolProficiencies.filter(p => character.modifiers.some(m => m.value == p.name)).map(p => p.title);
        if (toolProficiencies.length) {
            toolProficiencyLabel = `<div>${toolProficiencies.join("</div><div>")}</div>`
        }
        this.#kitElement.querySelector("#tool-proficiencies").innerHTML = toolProficiencyLabel;

        // attack cards
        const attackCards = this.#getAttackCards(character);
        const attackRows = [...this.#kitElement.querySelectorAll(".attack-row")];
        for (const attackRow of attackRows) {
            attackRow.remove();
        }
        const attackCardsHtml = this.#getAttackCardsHtml(attackCards);
        this.#kitElement.querySelector("#attacks-placeholder").outerHTML = attackCardsHtml;

        // languages
        await UIKit.renderer.renderElement(this.#kitElement.querySelector("#languages"));

        // feature cards
        this.#kitElement.querySelector("#features-col-1").innerHTML = `<div id="features-col-1-placeholder"></div>`;
        this.#kitElement.querySelector("#features-col-2").innerHTML = `<div id="features-col-2-placeholder"></div>`;
        this.#kitElement.querySelector("#features-col-3").innerHTML = `<div id="features-col-3-placeholder"></div>`;
        this.#kitElement.querySelector("#features-col-1-placeholder").outerHTML = this.#getModifiersCardHtml(character);
        this.#kitElement.querySelector("#features-col-3-placeholder").outerHTML = this.#getEquipmentCardHtml(character);
        const featureCards = Sources.getCharacterFeatures(character).filter(f => f.displayType == "feature-card");
        const featuresLength = featureCards.length;
        for (let i = 0; i < featuresLength; i++) {
            const displayColumn = this.#getNextFeatureColumn();
            const index = this.#getNextFeatureCardIndex(featureCards, displayColumn);
            if (index > -1) {
                const featureCard = featureCards[index];
                const featureCardHtml = this.#getFeatureCardHtml(featureCard, displayColumn);
                this.#kitElement.querySelector(`#features-col-${displayColumn}-placeholder`).outerHTML = featureCardHtml;
                featureCards.splice(index, 1);
            }
            else {
                break;
            }
        }

        // spell cards
        let spellCards = Sources.getCharacterFeatures(character).filter(f => f.displayType == "spell-card");
        spellCards = Utilities.sort(spellCards, ["title"]);
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
        const spellsLength = spellCards.length;
        for (let i = 0; i < spellsLength; i++) {
            const displayColumn = this.#getNextSpellColumn();
            const index = this.#getNextSpellCardIndex(spellCards, displayColumn);
            if (index > -1) {
                const spellCard = spellCards[index];
                const spellCardHtml = this.#getFeatureCardHtml(spellCard, displayColumn);
                this.#kitElement.querySelector(`#spells-col-${displayColumn}-placeholder`).outerHTML = spellCardHtml;
                spellCards.splice(index, 1);
            }
            else {
                break;
            }
        }
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
        const languages = character.modifiers.filter(m => m.target == "language").map(m => m.value.text);
        return languages;
    }

    #getModifiers(character, target) {
        return character.modifiers
            .filter(m => m.target == target)
            .map(m => m.value)
            .reduce((a, b) => a + b, 0);
    }

    #getAttackCards(character) {
        const attackCards = Sources.getCharacterFeatures(character).filter(f => f.displayType == "attack-card");
        const uniqueAttackCards = [];
        for (const card of attackCards) {
            const existingTitle = uniqueAttackCards.some(ucbt => ucbt.title == card.title);
            let existingLines = false;
            if (existingTitle) {
                existingLines = uniqueAttackCards.some(ucbt => Utilities.areArraysEqual(ucbt.lines, card.lines));
            }
            if (!existingTitle || !existingLines) {
                uniqueAttackCards.push(card);
            }
        }
        return uniqueAttackCards;
    }

    #getAttackCardsHtml(cards) {
         let cardsHtml = "";
         for (const card of cards) {
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
        return `
            <div id="attacks-placeholder"></div>
            ${cardsHtml}`;
    }

    #getNextFeatureColumn() {
        const col1Height = Number(this.#getColumnHeight(1));
        const col2Height = Number(this.#getColumnHeight(2));
        const col3Height = Number(this.#getColumnHeight(3));
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

    #getColumnHeight(index) {
        return [...this.#kitElement.querySelector(`#features-col-${index}`).children]
            .map(c => Number(c.clientHeight))
            .reduce((a, b) => a + b, 0);
    }

    #getNextSpellColumn() {
        const col1Height = Number(this.#getSpellColumnHeight(1));
        const col2Height = Number(this.#getSpellColumnHeight(2));
        const col3Height = Number(this.#getSpellColumnHeight(3));
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

    #getSpellColumnHeight(index) {
        return [...this.#kitElement.querySelector(`#spells-col-${index}`).children]
            .map(c => Number(c.clientHeight))
            .reduce((a, b) => a + b, 0);
    }

    #getNextFeatureCardIndex(cards, columnIndex) {
        let sources = [];
        if (columnIndex == 1) {
            sources = ["race", "sub-race", "background", "class", "sub-class", "feature", "equipment"];
        }
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

    #getNextSpellCardIndex(cards, columnIndex) {
        if (cards.length > 0) {
            return 0;
        }
        return -1;
    }

    #getFeatureCardHtml(card, displayColumn) {
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

    #getModifiersCardHtml(character) {

        const strengthModifiers = character.modifiers.filter(m => m.target == "ability-score:strength");
        const strengthLabel = this.#getModifiersSectionHtml("Strength", this.#getModifierLabels(strengthModifiers));

        const intelligenceModifiers = character.modifiers.filter(m => m.target == "ability-score:intelligence");
        const intelligenceLabel = this.#getModifiersSectionHtml("Intelligence", this.#getModifierLabels(intelligenceModifiers));

        const wisdomModifiers = character.modifiers.filter(m => m.target == "ability-score:wisdom");
        const wisdomLabel = this.#getModifiersSectionHtml("Wisdom", this.#getModifierLabels(wisdomModifiers));

        const dexterityModifiers = character.modifiers.filter(m => m.target == "ability-score:dexterity");
        const dexterityLabel = this.#getModifiersSectionHtml("Dexterity", this.#getModifierLabels(dexterityModifiers));

        const constitutionModifiers = character.modifiers.filter(m => m.target == "ability-score:constitution");
        const constitutionLabel = this.#getModifiersSectionHtml("Constitution", this.#getModifierLabels(constitutionModifiers));

        const charismaModifiers = character.modifiers.filter(m => m.target == "ability-score:charisma");
        const charismaLabel = this.#getModifiersSectionHtml("Charisma", this.#getModifierLabels(charismaModifiers));

        const initModifiers = this.#getInitiativeModifiers(character);
        const initLabel = this.#getModifiersSectionHtml("Initiative", initModifiers);

        const speedModifiers = character.modifiers.filter(m => m.target == "speed");
        const speedLabel = this.#getModifiersSectionHtml("Speed", this.#getModifierLabels(speedModifiers));

        const acModifiers = this.#getArmorClassModifiers(character);
        const acLabel = this.#getModifiersSectionHtml("Armor Class", acModifiers);

        const hpModifiers = character.modifiers.filter(m => m.target == "hit-points");
        const hpLabel = this.#getModifiersSectionHtml("Hit Points", this.#getModifierLabels(hpModifiers));

        // ${ strengthLabel }
        // ${ intelligenceLabel }
        // ${ wisdomLabel }
        // ${ dexterityLabel }
        // ${ constitutionLabel }
        // ${ charismaLabel }

        return `
            <div class="card feature-card modifiers-card">
                <div class="corner top-left">
                    <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100">
                        <path d=" M 0,0 l 100,0 a 100 100 0 0 0 -100 100 z"></path>
                    </svg>
                </div>
                <div class="field-label">Modifiers<span class="modifier-note"> <b>*</b></span></div>
                <div class="modifiers-content">
                    ${strengthLabel}
                    ${intelligenceLabel}
                    ${wisdomLabel}
                    ${dexterityLabel}
                    ${constitutionLabel}
                    ${charismaLabel }
                    ${initLabel}
                    ${speedLabel}
                    ${acLabel}
                    ${hpLabel}
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

    #getEquipmentCardHtml(character) {
        const allEquipment = Sources.getEquipment(character.sources);
        const items = character.equipment.map(e => allEquipment.find(ae => ae.name == e.name).title);
        let equipmentList = "[None]";
        if (items.length > 0) {
            items.sort()
            equipmentList = `<ul><li>${items.join("</li><li>")}</li></ul>`;
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
                    ${equipmentList}
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

    #getInitiativeModifiers(character) {
        const modifiers = character.modifiers.filter(m => m.target == "initiative");
        const labels = this.#getModifierLabels(modifiers);
        let dexModifier = Number(character.getAbilityScoreModifier("dexterity"));
        let dexModifierLabel = "";
        if (dexModifier < 0) {
            dexModifierLabel = `Dexterity: ${dexModifier}`;
        }
        if (dexModifier > 0) {
            dexModifierLabel = `Dexterity: +${dexModifier}`;
        }
        if (dexModifierLabel) {
            labels.unshift(dexModifierLabel);
        }
        return labels;
    }

    #getModifierLabels(modifiers) {
        const labels = [];
        for (const modifier of modifiers) {
            let label = this.#getModifierLabel(modifier);
            if (label) {
                labels.push(label);
            }
        }
        return labels;
    }

    #getModifierLabel(modifier) {
        const value = Number(modifier.value);
        let label = "";
        if (value > 0) {
            label = `${modifier.title}: +${modifier.value}`;
        }
        if (value < 0) {
            label = `${modifier.title}: ${modifier.value}`;
        }
        return label;
    }

    #getModifiersSectionHtml(title, modifierLabels) {
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
}
