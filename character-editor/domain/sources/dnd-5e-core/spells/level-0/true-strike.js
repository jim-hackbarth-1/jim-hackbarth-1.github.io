
export class TrueStrike {

    static get name() {
        return "true-strike";
    }

    static get title() {
        return "True Strike";
    }

    static get level() {
        return 0;
    }

    static get school() {
        return "divination"
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
        return "30 feet"
    }

    static get components() {
        return "S"
    }

    static get duration() {
        return "Concentration, up to 1 round"
    }

    static get html() {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${TrueStrike.title}</h3>
                <div class="spell-properties">${TrueStrike.school} cantrip</div>
                <div><b>Casting Time: </b>${TrueStrike.castingTime}</div>
                <div><b>Range: </b>${TrueStrike.range}</div>
                <div><b>Components: </b>${TrueStrike.components}</div>
                <div><b>Duration: </b>${TrueStrike.duration}</div>
                <div class="content">
                    <p>
                        You extend your hand and point a finger at a target in range. Your magic grants you a brief insight into the target’s defenses. On your next turn, you gain advantage on your first attack roll against the target, provided that this spell hasn’t ended.
                    </p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character) {
        const tempFeatures = [];
        tempFeatures.push({
            name: TrueStrike.name,
            title: TrueStrike.title,
            level: TrueStrike.level,
            html: `
                <div class="spell-properties">${TrueStrike.school} cantrip</div>
                <div><b>Casting Time: </b>${TrueStrike.castingTime}</div>
                <div><b>Range: </b>${TrueStrike.range}</div>
                <div><b>Components: </b>${TrueStrike.components}</div>
                <div><b>Duration: </b>${TrueStrike.duration}</div>
                <div class="content">
                    <p>
                        You extend your hand and point a finger at a target in range. Your magic grants you a brief insight into the target’s defenses. On your next turn, you gain advantage on your first attack roll against the target, provided that this spell hasn’t ended.
                    </p>
                </div>
                    `,
            source: { name: "spell" },
            displayType: "spell-card"
        });
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = TrueStrike.name
            features.push(feature);
        }
    }

}
