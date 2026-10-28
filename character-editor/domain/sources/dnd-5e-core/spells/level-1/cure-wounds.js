
export class CureWounds {

    static get name() {
        return "cure-wounds";
    }

    static get title() {
        return "Cure Wounds";
    }

    static get level() {
        return 1;
    }

    static get school() {
        return "evocation"
    }

    static get isRitual() {
        return false;
    }

    static get classes() {
        return ["bard", "cleric", "druid", "paladin", "ranger"];
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
        return "Instantaneous"
    }

    static get html() {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${CureWounds.title}</h3>
                <div class="spell-properties">1st-level ${CureWounds.school}</div>
                <div><b>Casting Time: </b>${CureWounds.castingTime}</div>
                <div><b>Range: </b>${CureWounds.range}</div>
                <div><b>Components: </b>${CureWounds.components}</div>
                <div><b>Duration: </b>${CureWounds.duration}</div>
                <div class="content">
                    <p>
                        A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.
                    </p>
                    <p>
                        At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st.
                    </p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push({
            name: CureWounds.name,
            title: CureWounds.title,
            level: CureWounds.level,
            html: `
                <div class="spell-properties">1st-level ${CureWounds.school}</div>
                <div><b>Casting Time: </b>${CureWounds.castingTime}</div>
                <div><b>Range: </b>${CureWounds.range}</div>
                <div><b>Components: </b>${CureWounds.components}</div>
                <div><b>Duration: </b>${CureWounds.duration}</div>
                <div class="content">
                    <p>
                        A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.
                    </p>
                    <p>
                        At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st.
                    </p>
                </div>
                    `,
            source: { name: "spell" },
            displayType: "spell-card"
        });

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = CureWounds.name
            features.push(feature);
        }
    }

}
