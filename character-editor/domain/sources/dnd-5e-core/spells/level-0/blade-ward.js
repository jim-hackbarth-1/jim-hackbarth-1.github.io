
export class BladeWard {

    static get name() {
        return "blade-ward";
    }

    static get title() {
        return "Blade Ward";
    }

    static get level() {
        return 0;
    }

    static get school() {
        return "abjuration"
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
        return "Self"
    }

    static get components() {
        return "V, S"
    }

    static get duration() {
        return "1 round"
    }

    static get html() {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${BladeWard.title}</h3>
                <div class="spell-properties">${BladeWard.school} cantrip</div>
                <div><b>Casting Time: </b>${BladeWard.castingTime}</div>
                <div><b>Range: </b>${BladeWard.range}</div>
                <div><b>Components: </b>${BladeWard.components}</div>
                <div><b>Duration: </b>${BladeWard.duration}</div>
                <div class="content">
                    <p>You extend your hand and trace a sigil of warding in the air.  Until the end of your next turn, you have resistance against bludgeoning, piercing, and slashing damage dealt by weapon attacks.</p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push({
            name: BladeWard.name,
            title: BladeWard.title,
            level: BladeWard.level,
            html: `
                <div class="spell-properties">${BladeWard.school} cantrip</div>
                <div><b>Casting Time: </b>${BladeWard.castingTime}</div>
                <div><b>Range: </b>${BladeWard.range}</div>
                <div><b>Components: </b>${BladeWard.components}</div>
                <div><b>Duration: </b>${BladeWard.duration}</div>
                <div class="content">
                    <p>You extend your hand and trace a sigil of warding in the air.  Until the end of your next turn, you have resistance against bludgeoning, piercing, and slashing damage dealt by weapon attacks.</p>
                </div>
                    `,
            source: { name: "spell" },
            displayType: "spell-card"
        });
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = BladeWard.name
            features.push(feature);
        }
    }

}
