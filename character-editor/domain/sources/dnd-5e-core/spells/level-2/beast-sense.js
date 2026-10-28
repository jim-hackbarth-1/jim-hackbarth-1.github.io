
export class BeastSense {

    static get name() {
        return "beast-sense";
    }

    static get title() {
        return "Beast Sense";
    }

    static get level() {
        return 2;
    }

    static get school() {
        return "divination"
    }

    static get isRitual() {
        return true;
    }

    static get classes() {
        return ["druid", "ranger"];
    }

    static get castingTime() {
        return "1 action"
    }

    static get range() {
        return "Touch"
    }

    static get components() {
        return "S"
    }

    static get duration() {
        return "Concentration, up to 1 hour"
    }

    static get html() {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${BeastSense.title}</h3>
                <div class="spell-properties">2nd-level ${BeastSense.school} (ritual)</div>
                <div><b>Casting Time: </b>${BeastSense.castingTime}</div>
                <div><b>Range: </b>${BeastSense.range}</div>
                <div><b>Components: </b>${BeastSense.components}</div>
                <div><b>Duration: </b>${BeastSense.duration}</div>
                <div class="content">
                    <p>You touch a willing beast. For the duration of the spell, you can use your action to see through the beast’s eyes and hear what it hears, and continue to do so until you use your action to return to your normal senses.</p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push({
            name: BeastSense.name,
            title: BeastSense.title,
            level: BeastSense.level,
            html: `
                <div class="spell-properties">2nd-level ${BeastSense.school} (ritual)</div>
                <div><b>Casting Time: </b>${BeastSense.castingTime}</div>
                <div><b>Range: </b>${BeastSense.range}</div>
                <div><b>Components: </b>${BeastSense.components}</div>
                <div><b>Duration: </b>${BeastSense.duration}</div>
                <div class="content">
                    <p>You touch a willing beast. For the duration of the spell, you can use your action to see through the beast’s eyes and hear what it hears, and continue to do so until you use your action to return to your normal senses.</p>
                </div>
                    `,
            source: { name: "spell" },
            displayType: "spell-card"
        });
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = BeastSense.name
            features.push(feature);
        }
    }

}
