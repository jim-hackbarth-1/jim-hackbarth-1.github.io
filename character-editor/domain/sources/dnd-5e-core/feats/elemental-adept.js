
import { DnD5ESource } from "../dnd-5e-core-source.js"

export class ElementalAdept {

    static get name() { return "elemental-adept"; }
    static get title() { return "Elemental Adept"; }
    static get canBeTakenMultipleTimes() { return true; }
    static get html() { return DnD5ESource.getFeatHtml(ElementalAdept, ElementalAdept.#content); }

    static checkPrerequisites(character, features) {
        const hasSpell = features.some(f => f.cardType == "spell-card");
        if (hasSpell) {
            return { prerequisitesMet: true, text: null };
        }
        return { prerequisitesMet: false, text: "Ability to cast a spell required" };
    }

    static getSelections(character, classIndex, level) {
        const selections = [];
        selections.push(character.getSelection(
            character.selections, `${ElementalAdept.name}-class-index-${classIndex}-level-${level}-damage-type`, "Damage type", 1));
        return selections;
    }

    static getSelectionOptions(character, classIndex, level, selectionName, sources) {
        let options = [];
        if (selectionName == `${ElementalAdept.name}-class-index-${classIndex}-level-${level}-damage-type`) {
            const damageTypes = [
                { name: "acid", title: "Acid" },
                { name: "cold", title: "Cold" },
                { name: "fire", title: "Fire" },
                { name: "lightning", title: "Lightning" },
                { name: "thunder", title: "Thunder" }
            ];
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            const otherSelections = character.selections.filter(
                s => s.name != selectionName && s.name.startsWith(ElementalAdept.name)) ?? [];
            let selectedElsewhere = [];
            for (const otherSelection of otherSelections) {
                const values = otherSelection.values ?? [];
                for (const value of values) {
                    selectedElsewhere.push(value);
                }
            }
            options = character.getSelectionOptions(
                damageTypes, selectedValues, selectedElsewhere, "Damage type (choose 1) ...");
        }
        return options;
    }

    static applyModifiers(character, classIndex, level, targetFilters) {

    }

    static applyFeatures(features, character, classIndex, level) {
        const tempFeatures = [];
        let damageType = null;
        const values = character.selections.find(
            s => s.name == `${ElementalAdept.name}-class-index-${classIndex}-level-${level}-damage-type`)?.values ?? [];
        if (values.length > 0) {
            damageType = values[0];
        }
        let name = ElementalAdept.name;
        if (damageType?.text) {
            name = `${ElementalAdept.name}-${damageType.text}`;
        }
        let title = ElementalAdept.title;
        if (damageType?.text) {
            title = `${ElementalAdept.title}-${damageType.text}`;
        }
        let content = ElementalAdept.#content;
        if (damageType?.value) {
            content = `
                <p>
                    Spells you cast ignore resistance to ${damageType.value} damage. In addition, when you roll damage for a spell you cast that deals ${damageType.value} damage, you can treat any 1 on a damage die as a 2.
                </p>
            `;
        }
        tempFeatures.push(character.getFeatureCard(name, title, content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
            feature.sourcePropertyValue = name;
            feature.cardSource = `${title} (Feat)`;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex, level) {

    }

    static #content = `
        <p>
            When you gain this feat, choose one of the following damage types: acid, cold, fire, lightning, or thunder. Spells you cast ignore resistance to damage of the chosen type. In addition, when you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2. You can select this feat multiple times. Each time you do so, you must choose a different damage type.
        </p>
    `;

}
