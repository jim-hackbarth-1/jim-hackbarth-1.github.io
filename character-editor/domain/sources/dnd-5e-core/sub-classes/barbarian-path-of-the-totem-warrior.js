
export class BarbarianPathOfTheTotemWarrior {

    static get name() {
        return "barbarian-path-of-the-totem-warrior";
    }

    static get title() {
        return "Path of the Totem Warrior";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-classes/barbarian-path-of-the-totem-warrior.html";
    }

    static get className() {
        return "barbarian";
    }

    static getSelections(character, classIndex) {
        const selections = [];
         let currentSelections = [];
         const characterClass = character.classes.find(c => c.value == "barbarian");
        if (characterClass.level >= 3) {
            selections.push(character.selectionUtilities.getSelection(
                character.selections,
                `${BarbarianPathOfTheTotemWarrior.name}-totem-spirit`,
                `${BarbarianPathOfTheTotemWarrior.title} - Totem spirit`,
                1));
         }
        if (characterClass.level >= 6) {
            selections.push(character.selectionUtilities.getSelection(
                character.selections,
                `${BarbarianPathOfTheTotemWarrior.name}-aspect-of-the-beast`,
                `${BarbarianPathOfTheTotemWarrior.title} - Aspect of the Beast`,
                1));
         }
        if (characterClass.level >= 14) {
            selections.push(character.selectionUtilities.getSelection(
                character.selections,
                `${BarbarianPathOfTheTotemWarrior.name}-totemic-attunement`,
                `${BarbarianPathOfTheTotemWarrior.title} - Totemic Attunement`,
                1));
         }
        return selections;
    }

    static getSelectionOptions(character, classIndex, selectionName, sources) {
        let options = [];
        const selectionInfoList = [
            {
                name: `${BarbarianPathOfTheTotemWarrior.name}-totem-spirit`,
                choiceLabel: `${BarbarianPathOfTheTotemWarrior.title} - Totem spirit (choose 1)...`
            },
            {
                name: `${BarbarianPathOfTheTotemWarrior.name}-aspect-of-the-beast`,
                choiceLabel: `${BarbarianPathOfTheTotemWarrior.title} - Aspect of the beast (choose 1) ...`
            },
            {
                name: `${BarbarianPathOfTheTotemWarrior.name}-totemic-attunement`,
                choiceLabel: `${BarbarianPathOfTheTotemWarrior.title} - Totemic attunement (choose 1) ...`
            },
        ];
        const selectionInfo = selectionInfoList.find(x => x.name == selectionName);
        if (selectionInfo) {
            const totemSpirits = [...BarbarianPathOfTheTotemWarrior.#totemSpirits];
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.selectionUtilities.getSelectionOptions(totemSpirits, selectedValues, [], selectionInfo.choiceLabel);
         }
        return options;
    }

    static applyModifiers(character, classIndex, targetFilters) {

    }

    static applyFeatures(features, character, classIndex) {
        const tempFeatures = [];
        const characterClass = character.classes.find(c => c.value == "barbarian");

        let totemSpirit = null;
        const totemSpirits = character.selections.find(o => o.name == "barbarian-path-of-the-totem-warrior-totem-spirit")?.values ?? [];
        if (totemSpirits.length > 0) {
            totemSpirit = totemSpirits[0];
        }
        if (totemSpirit?.value) {
            let totemSpiritHtml = "";
            if (totemSpirit.value == "bear") {
                totemSpiritHtml = "<p>While raging, you have resistance to all damage except psychic damage. The spirit of the bear makes you tough enough to stand up to any punishment.</p>";
            }
            if (totemSpirit.value == "eagle") {
                totemSpiritHtml = "<p>While you're raging and aren't wearing heavy armor, other creatures have disadvantage on opportunity attack rolls against you, and you can use the Dash action as a bonus action on your turn. The spirit of the eagle makes you into a predator who can weave through the fray with ease.</p>";
            }
            if (totemSpirit.value == "wolf") {
                totemSpiritHtml = "<p>While you're raging, your friends have advantage on melee attack rolls against any creature within 5 feet of you that is hostile to you. The spirit of the wolf makes you a leader of hunters.</p>";
            }
            tempFeatures.push({
                name: "barbarian-path-of-the-totem-warrior-totem-spirit",
                title: `Totem Spirit: ${totemSpirit.text}`,
                html: totemSpiritHtml,
                source: {
                    name: "sub-class",
                    title: BarbarianPathOfTheTotemWarrior.title
                },
                displayType: "feature-card"
            });
         }

         let aspectOfTheBeast = null;
         const aspectOfTheBeasts = character.selections
             .find(o => o.name == "barbarian-path-of-the-totem-warrior-aspect-of-the-beast")?.values ?? [];
         if (aspectOfTheBeasts.length > 0) {
             aspectOfTheBeast = aspectOfTheBeasts[0];
         }
         if (aspectOfTheBeast?.value) {
             let aspectOfTheBeastHtml = "";
             if (aspectOfTheBeast.value == "bear") {
                 aspectOfTheBeastHtml = "<p>You gain the might of a bear. Your carrying capacity (including maximum load and maximum lift) is doubled, and you have advantage on Strength checks made to push, pull, lift, or break objects.</p>";
             }
             if (aspectOfTheBeast.value == "eagle") {
                 aspectOfTheBeastHtml = "<p>You gain the eyesight of an eagle. You can see up to 1 mile away with no difficulty, able to discern even fine details as though looking at something no more than 100 feet away from you. Additionally, dim light doesn't impose disadvantage on your Wisdom (Perception) checks.</p>";
             }
             if (aspectOfTheBeast.value == "wolf") {
                 aspectOfTheBeastHtml = "<p>You gain the hunting sensibilities of a wolf. You can track other creatures while traveling at a fast pace, and you can move stealthily while traveling at a normal pace.</p>";
             }
             tempFeatures.push({
                 name: "barbarian-path-of-the-totem-warrior-aspect-of-the-beast",
                 title: `Aspect of the Beast: ${aspectOfTheBeast.text}`,
                 html: aspectOfTheBeastHtml,
                 source: {
                     name: "sub-class",
                     title: BarbarianPathOfTheTotemWarrior.title
                 },
                 displayType: "feature-card"
             });
         }

         let totemicAttunement = null;
         const totemicAttunements = character.selections
             .find(o => o.name == "barbarian-path-of-the-totem-warrior-totemic-attunement")?.values ?? [];
         if (totemicAttunements.length > 0) {
             totemicAttunement = totemicAttunements[0];
         }
         if (totemicAttunement?.value) {
             let totemicAttunementHtml = "";
             if (totemicAttunement.value == "bear") {
                 totemicAttunementHtml = "<p>While you're raging, any creature within 5 feet of you that's hostile to you has disadvantage on attack rolls against targets other than you or another character with this feature. An enemy is immune to this effect if it can't see or hear you or if it can't be frightened.</p>";
             }
             if (totemicAttunement.value == "eagle") {
                 totemicAttunementHtml = "<p>While raging, you have a flying speed equal to your current walking speed. This benefit works only in short bursts; you fall if you end your turn in the air and nothing else is holding you aloft.</p>";
             }
             if (totemicAttunement.value == "wolf") {
                 totemicAttunementHtml = "<p>While you're raging, you can use a bonus action on your turn to knock a Large or smaller creature prone when you hit it with melee weapon attack.</p>";
             }
             tempFeatures.push({
                 name: "barbarian-path-of-the-totem-warrior-aspect-totemic-attunement",
                 title: `Totemic Attunement: ${totemicAttunement.text}`,
                 html: totemicAttunementHtml,
                 source: {
                     name: "sub-class",
                     title: BarbarianPathOfTheTotemWarrior.title
                 },
                 displayType: "feature-card"
             });
         }

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `subClass-${classIndex}`;
            feature.sourcePropertyValue = BarbarianPathOfTheTotemWarrior.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex) {
         const tempSpells = [];
         const characterClass = character.classes.find(c => c.value == "barbarian");
         if (characterClass.level >= 3) {
             tempSpells.push("beast-sense");
             tempSpells.push("speak-with-animals");
         }
         if (characterClass.level >= 10) {
             tempSpells.push("commune-with-nature");
         }
         for (const spell of tempSpells) {
             spells.push(spell);
         }
    }

    static getSpellCastingInfo(character, allSpells, classSpellCastingInfo) {
        return classSpellCastingInfo;
    }

    static #totemSpirits = [
        { name: "bear", title: "Bear" },
        { name: "eagle", title: "Eagle" },
        { name: "wolf", title: "Wolf" }
    ];

}
