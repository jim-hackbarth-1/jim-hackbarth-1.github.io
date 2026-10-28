
export class BestowCurse {

    static get name() {
        return "bestow-curse";
    }

    static get title() {
        return "Bestow Curse";
    }

    static get level() {
        return 3;
    }

    static get school() {
        return "necromancy"
    }

    static get isRitual() {
        return false;
    }

    static get classes() {
        return ["bard", "cleric", "wizard"];
    }

    static get castingTime() {
        return "1 action"
    }

    static get range() {
        return "Touch"
    }

    static get components() {
        return "V, S"
    }

    static get duration() {
        return "Concentration, up to 1 minute"
    }

    static get html() {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${BestowCurse.title}</h3>
                <div class="spell-properties">3rd-level ${BestowCurse.school}</div>
                <div><b>Casting Time: </b>${BestowCurse.castingTime}</div>
                <div><b>Range: </b>${BestowCurse.range}</div>
                <div><b>Components: </b>${BestowCurse.components}</div>
                <div><b>Duration: </b>${BestowCurse.duration}</div>
                <div class="content">
                    <p>
                        You touch a creature, and that creature must succeed on a Wisdom saving throw or become cursed for the duration of the spell. When you cast this spell, choose the nature of the curse from the following options:
                    </p>
                    <ul>
                        <li>
                            Choose one ability score. While cursed, the target has disadvantage on ability checks and saving throws made with that ability score.
                        </li>
                        <li>
                            While cursed, the target has disadvantage on attack rolls against you.
                        </li>
                        <li>
                            While cursed, the target must make a Wisdom saving throw at the start of each of its turns. If it fails, it wastes its action that turn doing nothing.
                        </li>
                        <li>
                            While the target is cursed, your attacks and spells deal an extra 1d8 necrotic damage to the target.
                        </li>
                    </ul>
                    <p>
                        A remove curse spell ends this effect. At the DM's option, you may choose an alternative curse effect, but it should be no more powerful than those described above. The DM has final say on such a curse's effect.
                    </p>
                    <p>
                        At Higher Levels. If you cast this spell using a spell slot of 4th level or higher, the duration is concentration, up to 10 minutes. If you use a spell slot of 5th level or higher, the duration is 8 hours. If you use a spell slot of 7th level or higher, the duration is 24 hours. If you use a 9th level spell slot, the spell lasts until it is dispelled. Using a spell slot of 5th level or higher grants a duration that doesn't require concentration.
                    </p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];

        const spellModifiersInfo = character.getSpellModifiersInfo(BestowCurse, characterSpellClasses, "Wisdom", false);
        const content = `
            <p>
                You touch a creature, and that creature must succeed on a Wisdom saving throw or become cursed for the duration of the spell. When you cast this spell, choose the nature of the curse from the following options:
            </p>
            <ul>
                <li>
                    Choose one ability score. While cursed, the target has disadvantage on ability checks and saving throws made with that ability score.
                </li>
                <li>
                    While cursed, the target has disadvantage on attack rolls against you.
                </li>
                <li>
                    While cursed, the target must make a Wisdom saving throw at the start of each of its turns. If it fails, it wastes its action that turn doing nothing.
                </li>
                <li>
                    While the target is cursed, your attacks and spells deal an extra 1d8 necrotic damage to the target.
                </li>
            </ul>
            <p>
                A remove curse spell ends this effect. At the DM's option, you may choose an alternative curse effect, but it should be no more powerful than those described above. The DM has final say on such a curse's effect.
            </p>
            <p>
                At Higher Levels. If you cast this spell using a spell slot of 4th level or higher, the duration is concentration, up to 10 minutes. If you use a spell slot of 5th level or higher, the duration is 8 hours. If you use a spell slot of 7th level or higher, the duration is 24 hours. If you use a 9th level spell slot, the spell lasts until it is dispelled. Using a spell slot of 5th level or higher grants a duration that doesn't require concentration.
            </p>
        `;
        const spellCard = character.getSpellCard(BestowCurse, spellModifiersInfo.displayModifiersHtml, content);
        tempFeatures.push(spellCard);

        // tempFeatures.push({
        //     name: BestowCurse.name,
        //     title: BestowCurse.title,
        //     level: BestowCurse.level,
        //     html: `
        //         <div class="spell-properties">3rd-level ${BestowCurse.school}</div>
        //         <div><b>Casting Time: </b>${BestowCurse.castingTime}</div>
        //         <div><b>Range: </b>${BestowCurse.range}</div>
        //         <div><b>Components: </b>${BestowCurse.components}</div>
        //         <div><b>Duration: </b>${BestowCurse.duration}</div>
        //         <div class="content">
        //             <p>
        //                 You touch a creature, and that creature must succeed on a Wisdom saving throw or become cursed for the duration of the spell. When you cast this spell, choose the nature of the curse from the following options:
        //             </p>
        //             <ul>
        //                 <li>
        //                     Choose one ability score. While cursed, the target has disadvantage on ability checks and saving throws made with that ability score.
        //                 </li>
        //                 <li>
        //                     While cursed, the target has disadvantage on attack rolls against you.
        //                 </li>
        //                 <li>
        //                     While cursed, the target must make a Wisdom saving throw at the start of each of its turns. If it fails, it wastes its action that turn doing nothing.
        //                 </li>
        //                 <li>
        //                     While the target is cursed, your attacks and spells deal an extra 1d8 necrotic damage to the target.
        //                 </li>
        //             </ul>
        //             <p>
        //                 A remove curse spell ends this effect. At the DM's option, you may choose an alternative curse effect, but it should be no more powerful than those described above. The DM has final say on such a curse's effect.
        //             </p>
        //             <p>
        //                 At Higher Levels. If you cast this spell using a spell slot of 4th level or higher, the duration is concentration, up to 10 minutes. If you use a spell slot of 5th level or higher, the duration is 8 hours. If you use a spell slot of 7th level or higher, the duration is 24 hours. If you use a 9th level spell slot, the spell lasts until it is dispelled. Using a spell slot of 5th level or higher grants a duration that doesn't require concentration.
        //             </p>
        //         </div>
        //             `,
        //     source: { name: "spell" },
        //     displayType: "spell-card"
        // });

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = BestowCurse.name
            features.push(feature);
        }
    }

}
