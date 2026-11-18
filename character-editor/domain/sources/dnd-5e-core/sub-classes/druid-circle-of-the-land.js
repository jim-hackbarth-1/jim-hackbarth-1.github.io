
export class DruidCircleOfTheLand {

    static get name() {
        return "druid-circle-of-the-land";
    }

    static get title() {
        return "Circle of the Land";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-classes/druid-circle-of-the-land.html";
    }

    static get className() {
        return "druid";
    }

    static getSelections(character, classIndex) {
        const selections = [];
        selections.push(character.getSelection(
            character.selections, `${DruidCircleOfTheLand.name}-land-of-origin`, "Land of Origin", 1));
        selections.push(character.getSelection(
            character.selections, `${DruidCircleOfTheLand.name}-cantrip`, "Cantrip", 1, [{ name: "spells" }])); 
        return selections;
    }

    static getSelectionOptions(character, classIndex, selectionName, sources) {
        let options = [];
        if (selectionName == `${DruidCircleOfTheLand.name}-land-of-origin`) {
            const landsOfOrigin = [...DruidCircleOfTheLand.#landsOfOrigin];
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.getSelectionOptions(landsOfOrigin, selectedValues, [], "Land of Origin (choose 1) ...");
        }
        if (selectionName == `${DruidCircleOfTheLand.name}-cantrip`) {
            let spells = [...sources.find(s => s.name == "spells").options];
            spells = spells.filter(s => s.classes.includes("druid") && Number(s.level) == 0);
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.getSelectionOptions(spells, selectedValues, [], "Cantrip (choose 1) ...");
        }
        return options;
    }

    static applyModifiers(character, classIndex, targetFilters) {

    }

    static applyFeatures(features, character, classIndex) {
        const tempFeatures = [];
        const level = Number(character.classes.find(c => c.value == "druid").level);

        // Natural Recovery
        if (level >= 2) {
            const combinedLevel = Math.ceil(level / 2);
            const naturalRecoveryHtml = `
                <p>
                    You can regain some of your magical energy by sitting in meditation and communing with nature. During a short rest, you choose expended spell slots to recover. The spell slots can have a combined level of ${combinedLevel}, and none of the slots can be 6th level or higher. You can’t use this feature again until you finish a long rest.
                </p>
            `;
            const naturalRecovery = character.getFeatureCard(
                `${DruidCircleOfTheLand.name}-natural-recovery`, "Natural Recovery", naturalRecoveryHtml);
            naturalRecovery.useInfo = { reset: "long-rest", uses: 1 };
            tempFeatures.push(naturalRecovery);
        }

        // Land’s Stride
        if (level >= 6) {
            const landsStrideHtml = `
                <p>
                    Moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard.
                </p>
                <p>
                    In addition, you have advantage on saving throws against plants that are magically created or manipulated to impede movement, such those created by the entangle spell.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(
                `${DruidCircleOfTheLand.name}-lands-stride`, "Land’s Stride", landsStrideHtml));
        }

        // Nature’s Ward
        if (level >= 10) {
            const naturesWardHtml = `
                <p>
                    You can’t be charmed or frightened by elementals or fey, and you are immune to poison and disease.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${DruidCircleOfTheLand.name}-natures-ward`, "Nature’s Ward", naturesWardHtml));
        }

        // Nature’s Sanctuary
        if (level >= 14) {
            const naturesSanctuaryHtml = `
                <p>
                    Creatures of the natural world sense your connection to nature and become hesitant to attack you. When a beast or plant creature attacks you, that creature must make a Wisdom saving throw against your druid spell save DC. On a failed save, the creature must choose a different target, or the attack automatically misses. On a successful save, the creature is immune to this effect for 24 hours.
                </p>
                <p>
                    The creature is aware of this effect before it makes its attack against you.
                </p>
            `;
            const attackInfo = character.getAttackInfo({ attackAbility: "wisdom", saveAbility: "wisdom", target: "dc" });
            const naturesSanctuary = character.getFeatureCard(
                `${DruidCircleOfTheLand.name}-natures-sanctuary`,
                "Nature’s Sanctuary",
                naturesSanctuaryHtml,
                DruidCircleOfTheLand.title,
                attackInfo);
            tempFeatures.push(naturesSanctuary);
        }

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `subClass-${classIndex}`;
            feature.sourcePropertyValue = DruidCircleOfTheLand.name;
            feature.cardSource = DruidCircleOfTheLand.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex) {
        const characterClass = character.classes.find(c => c.value == "druid");
        let landOfOrigin = null;
        const landsOfOrigin = character.selections.find(o => o.name == `${DruidCircleOfTheLand.name}-land-of-origin`)?.values ?? [];
        if (landsOfOrigin.length > 0) {
            landOfOrigin = landsOfOrigin[0];
        }
        const tempSpells = [];
        let cantrip = null;
        const cantrips = character.selections.find(s => s.name == `${DruidCircleOfTheLand.name}-cantrip`)?.values ?? [];
        if (cantrips.length > 0) {
            cantrip = cantrips[0].value;
        }
        if (cantrip) {
            tempSpells.push(cantrip);
        }
        if (landOfOrigin?.value == "arctic") {
            if (characterClass.level >= 3) {
                tempSpells.push("hold-person");
                tempSpells.push("spike-growth");
            }
            if (characterClass.level >= 5) {
                tempSpells.push("sleet-storm");
                tempSpells.push("slow");
            }
            if (characterClass.level >= 7) {
                tempSpells.push("freedom-of-movement");
                tempSpells.push("ice-storm");
            }
            if (characterClass.level >= 9) {
                tempSpells.push("commune-with-nature");
                tempSpells.push("cone-of-cold");
            }
        }
        if (landOfOrigin?.value == "coast") {
            if (characterClass.level >= 3) {
                tempSpells.push("mirror-image");
                tempSpells.push("misty-step");
            }
            if (characterClass.level >= 5) {
                tempSpells.push("water-breathing");
                tempSpells.push("water-walk");
            }
            if (characterClass.level >= 7) {
                tempSpells.push("control-water");
                tempSpells.push("freedom-of-movement");
            }
            if (characterClass.level >= 9) {
                tempSpells.push("conjure-elemental");
                tempSpells.push("scrying");
            }
        }
        if (landOfOrigin?.value == "desert") {
            if (characterClass.level >= 3) {
                tempSpells.push("blur");
                tempSpells.push("silence");
            }
            if (characterClass.level >= 5) {
                tempSpells.push("create-food-and-water");
                tempSpells.push("protection-from-energy");
            }
            if (characterClass.level >= 7) {
                tempSpells.push("blight");
                tempSpells.push("hallucinatory-terrain");
            }
            if (characterClass.level >= 9) {
                tempSpells.push("insect-plague");
                tempSpells.push("wall-of-stone");
            }
        }
        if (landOfOrigin?.value == "forest") {
            if (characterClass.level >= 3) {
                tempSpells.push("barkskin");
                tempSpells.push("spider-climb");
            }
            if (characterClass.level >= 5) {
                tempSpells.push("call-lightning");
                tempSpells.push("plant-growth");
            }
            if (characterClass.level >= 7) {
                tempSpells.push("divination");
                tempSpells.push("freedom-of-movement");
            }
            if (characterClass.level >= 9) {
                tempSpells.push("commune-with-nature");
                tempSpells.push("tree-stride");
            }
        }
        if (landOfOrigin?.value == "grassland") {
            if (characterClass.level >= 3) {
                tempSpells.push("invisibility");
                tempSpells.push("pass-without-trace");
            }
            if (characterClass.level >= 5) {
                tempSpells.push("daylight");
                tempSpells.push("haste");
            }
            if (characterClass.level >= 7) {
                tempSpells.push("divination");
                tempSpells.push("freedom-of-movement");
            }
            if (characterClass.level >= 9) {
                tempSpells.push("dream");
                tempSpells.push("insect-plague");
            }
        }
        if (landOfOrigin?.value == "mountain") {
            if (characterClass.level >= 3) {
                tempSpells.push("spider-climb");
                tempSpells.push("spike-growth");
            }
            if (characterClass.level >= 5) {
                tempSpells.push("lightning-bolt");
                tempSpells.push("meld-into-stone");
            }
            if (characterClass.level >= 7) {
                tempSpells.push("stone-shape");
                tempSpells.push("stoneskin");
            }
            if (characterClass.level >= 9) {
                tempSpells.push("passwall");
                tempSpells.push("wall-of-stone");
            }
        }
        if (landOfOrigin?.value == "swamp") {
            if (characterClass.level >= 3) {
                tempSpells.push("darkness");
                tempSpells.push("melfs-acid-arrow");
            }
            if (characterClass.level >= 5) {
                tempSpells.push("water-walk");
                tempSpells.push("stinking-cloud");
            }
            if (characterClass.level >= 7) {
                tempSpells.push("freedom-of-movement");
                tempSpells.push("locate-creature");
            }
            if (characterClass.level >= 9) {
                tempSpells.push("insect-plague");
                tempSpells.push("scrying");
            }
        }
        if (landOfOrigin?.value == "underdark") {
            if (characterClass.level >= 3) {
                tempSpells.push("spider-climb");
                tempSpells.push("web");
            }
            if (characterClass.level >= 5) {
                tempSpells.push("gaseous-form");
                tempSpells.push("stinking-cloud");
            }
            if (characterClass.level >= 7) {
                tempSpells.push("greater-invisibility");
                tempSpells.push("stone-shape");
            }
            if (characterClass.level >= 9) {
                tempSpells.push("cloudkill");
                tempSpells.push("insect-plague");
            }
        }  
        for (const spell of tempSpells) {
            spells.push(spell);
        }
    }

    static getSpellCastingInfo(character, allSpells, classSpellCastingInfo) {
        if (!classSpellCastingInfo) {
            return classSpellCastingInfo;
        }
        const characterClass = character.classes.find(c => c.value == "druid");

        let landOfOrigin = null;
        const landsOfOrigin = character.selections.find(o => o.name == `${DruidCircleOfTheLand.name}-land-of-origin`)?.values ?? [];
        if (landsOfOrigin.length > 0) {
            landOfOrigin = landsOfOrigin[0];
        }

        if (landOfOrigin?.value == "arctic") {
            if (characterClass.level >= 3) {
                DruidCircleOfTheLand.#addSpell("hold-person", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("spike-growth", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 5) {
                DruidCircleOfTheLand.#addSpell("sleet-storm", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("slow", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 7) {
                DruidCircleOfTheLand.#addSpell("freedom-of-movement", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("ice-storm", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 9) {
                DruidCircleOfTheLand.#addSpell("commune-with-nature", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("cone-of-cold", allSpells, classSpellCastingInfo);
            }
        }

        if (landOfOrigin?.value == "coast") {
            if (characterClass.level >= 3) {
                DruidCircleOfTheLand.#addSpell("mirror-image", allSpells, classSpellCastingInfo);;
                DruidCircleOfTheLand.#addSpell("misty-step", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 5) {
                DruidCircleOfTheLand.#addSpell("water-breathing", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("water-walk", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 7) {
                DruidCircleOfTheLand.#addSpell("control-water", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("freedom-of-movement", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 9) {
                DruidCircleOfTheLand.#addSpell("conjure-elemental", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("scrying", allSpells, classSpellCastingInfo);
            }
        }
        if (landOfOrigin?.value == "desert") {
            if (characterClass.level >= 3) {
                DruidCircleOfTheLand.#addSpell("blur", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("silence", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 5) {
                DruidCircleOfTheLand.#addSpell("create-food-and-water", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("protection-from-energy", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 7) {
                DruidCircleOfTheLand.#addSpell("blight", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("hallucinatory-terrain", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 9) {
                DruidCircleOfTheLand.#addSpell("insect-plague", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("wall-of-stone", allSpells, classSpellCastingInfo);
            }
        }

        if (landOfOrigin?.value == "forest") {
            if (characterClass.level >= 3) {
                DruidCircleOfTheLand.#addSpell("barkskin", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("spider-climb", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 5) {
                DruidCircleOfTheLand.#addSpell("call-lightning", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("plant-growth", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 7) {
                DruidCircleOfTheLand.#addSpell("divination", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("freedom-of-movement", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 9) {
                DruidCircleOfTheLand.#addSpell("commune-with-nature", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("tree-stride", allSpells, classSpellCastingInfo);
            }
        }

        if (landOfOrigin?.value == "grassland") {
            if (characterClass.level >= 3) {
                DruidCircleOfTheLand.#addSpell("invisibility", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("pass-without-trace", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 5) {
                DruidCircleOfTheLand.#addSpell("daylight", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("haste", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 7) {
                DruidCircleOfTheLand.#addSpell("divination", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("freedom-of-movement", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 9) {
                DruidCircleOfTheLand.#addSpell("dream", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("insect-plague", allSpells, classSpellCastingInfo);
            }
        }

        if (landOfOrigin?.value == "mountain") {
            if (characterClass.level >= 3) {
                DruidCircleOfTheLand.#addSpell("spider-climb", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("spike-growth", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 5) {
                DruidCircleOfTheLand.#addSpell("lightning-bolt", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("meld-into-stone", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 7) {
                DruidCircleOfTheLand.#addSpell("stone-shape", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("stoneskin", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 9) {
                DruidCircleOfTheLand.#addSpell("passwall", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("wall-of-stone", allSpells, classSpellCastingInfo);
            }
        }

        if (landOfOrigin?.value == "swamp") {
            if (characterClass.level >= 3) {
                DruidCircleOfTheLand.#addSpell("darkness", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("melfs-acid-arrow", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 5) {
                DruidCircleOfTheLand.#addSpell("water-walk", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("stinking-cloud", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 7) {
                DruidCircleOfTheLand.#addSpell("freedom-of-movement", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("locate-creature", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 9) {
                DruidCircleOfTheLand.#addSpell("insect-plague", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("scrying", allSpells, classSpellCastingInfo);
            }
        }

        if (landOfOrigin?.value == "underdark") {
            if (characterClass.level >= 3) {
                DruidCircleOfTheLand.#addSpell("spider-climb", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("web", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 5) {
                DruidCircleOfTheLand.#addSpell("gaseous-form", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("stinking-cloud", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 7) {
                DruidCircleOfTheLand.#addSpell("greater-invisibility", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("stone-shape", allSpells, classSpellCastingInfo);
            }
            if (characterClass.level >= 9) {
                DruidCircleOfTheLand.#addSpell("cloudkill", allSpells, classSpellCastingInfo);
                DruidCircleOfTheLand.#addSpell("insect-plague", allSpells, classSpellCastingInfo);
            }
        } 

        return classSpellCastingInfo;
    }

    static #landsOfOrigin = [
        { name: "arctic", title: "Arctic" },
        { name: "coast", title: "Coast" },
        { name: "desert", title: "Desert" },
        { name: "forest", title: "Forest" },
        { name: "grassland", title: "Grassland" },
        { name: "mountain", title: "Mountain" },
        { name: "swamp", title: "Swamp" },
        { name: "underdark", title: "Underdark" }
    ];

    static #addSpell(spellName, allSpells, classSpellCastingInfo) {
        const spell = allSpells.find(s => s.name == spellName);
        const spellLevel = classSpellCastingInfo.spellLevels.find(sl => sl.level == spell.level);
        if (spellLevel) {
            if (!spellLevel.spells) {
                spellLevel.spells = [];
            }
            let foundSpell = spellLevel.spells.find(s => s.title == spell.title);
            if (foundSpell) {
                foundSpell.alwaysPrepared = true;
            }
            else {
                spellLevel.spells.push({ title: spell.title, alwaysPrepared: true });
            }
        }
    }
}
