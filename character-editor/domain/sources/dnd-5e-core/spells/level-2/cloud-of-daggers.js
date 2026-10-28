
export class CloudOfDaggers {

    static get name() {
        return "cloud-of-daggers";
    }

    static get title() {
        return "Cloud Of Daggers";
    }

    static get level() {
        return 2;
    }

    static get school() {
        return "conjuration"
    }

    static get isRitual() {
        return false;
    }

    static get classes() {
        return ["bard", "sorcerer", "warlock", "wizard"];
    }

    static get castingTime() {
        return "1 action"
    }

    static get range() {
        return "60 feet"
    }

    static get components() {
        return "V, S, M (a sliver of glass)"
    }

    static get duration() {
        return "Concentration, up to 1 minute"
    }

    static get html() {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${CloudOfDaggers.title}</h3>
                <div class="spell-properties">2nd-level ${CloudOfDaggers.school}</div>
                <div><b>Casting Time: </b>${CloudOfDaggers.castingTime}</div>
                <div><b>Range: </b>${CloudOfDaggers.range}</div>
                <div><b>Components: </b>${CloudOfDaggers.components}</div>
                <div><b>Duration: </b>${CloudOfDaggers.duration}</div>
                <div class="content">
                    <p>
                        You fill the air with spinning daggers in a cube 5 feet on each side, centered on a point you choose within range. A creature takes 4d4 slashing damage when it enters the spell’s area for the first time on a turn or starts its turn there.
                    </p>
                    <p>
                        At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 2d4 for each slot level above 2nd.
                    </p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push({
            name: CloudOfDaggers.name,
            title: CloudOfDaggers.title,
            level: CloudOfDaggers.level,
            html: `
                <div class="spell-properties">2nd-level ${CloudOfDaggers.school}</div>
                <div><b>Casting Time: </b>${CloudOfDaggers.castingTime}</div>
                <div><b>Range: </b>${CloudOfDaggers.range}</div>
                <div><b>Components: </b>${CloudOfDaggers.components}</div>
                <div><b>Duration: </b>${CloudOfDaggers.duration}</div>
                <div class="content">
                    <p>
                        You fill the air with spinning daggers in a cube 5 feet on each side, centered on a point you choose within range. A creature takes 4d4 slashing damage when it enters the spell’s area for the first time on a turn or starts its turn there.
                    </p>
                    <p>
                        At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 2d4 for each slot level above 2nd.
                    </p>
                </div>
                    `,
            source: { name: "spell" },
            displayType: "spell-card"
        });

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = CloudOfDaggers.name
            features.push(feature);
        }
    }

}
