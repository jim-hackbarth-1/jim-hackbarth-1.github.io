
export class Bane {

    static get name() {
        return "bane";
    }

    static get title() {
        return "Bane";
    }

    static get level() {
        return 1;
    }

    static get school() {
        return "enchantment"
    }

    static get isRitual() {
        return false;
    }

    static get classes() {
        return ["bard", "cleric"];
    }

    static get castingTime() {
        return "1 action"
    }

    static get range() {
        return "30 feet"
    }

    static get components() {
        return "V, S, M (a drop of blood)"
    }

    static get duration() {
        return "Concentration, up to 1 minute"
    }

    static get html() {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${Bane.title}</h3>
                <div class="spell-properties">1st-level ${Bane.school}</div>
                <div><b>Casting Time: </b>${Bane.castingTime}</div>
                <div><b>Range: </b>${Bane.range}</div>
                <div><b>Components: </b>${Bane.components}</div>
                <div><b>Duration: </b>${Bane.duration}</div>
                <div class="content">
                    <p>
                        Up to three creatures of your choice that you can see within range must make Charisma saving throws. Whenever a target that fails this saving throw makes an attack roll or a saving throw before the spell ends, the target must roll a d4 and subtract the number rolled from the attack roll or saving throw.
                    </p>
                    <p>
                        At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.
                    </p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character) {
        const tempFeatures = [];
        tempFeatures.push({
            name: Bane.name,
            title: Bane.title,
            level: Bane.level,
            html: `
                <div class="spell-properties">1st-level ${Bane.school}</div>
                <div><b>Casting Time: </b>${Bane.castingTime}</div>
                <div><b>Range: </b>${Bane.range}</div>
                <div><b>Components: </b>${Bane.components}</div>
                <div><b>Duration: </b>${Bane.duration}</div>
                <div class="content">
                    <p>
                        Up to three creatures of your choice that you can see within range must make Charisma saving throws. Whenever a target that fails this saving throw makes an attack roll or a saving throw before the spell ends, the target must roll a d4 and subtract the number rolled from the attack roll or saving throw.
                    </p>
                    <p>
                        At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.
                    </p>
                </div>
                    `,
            source: { name: "spell" },
            displayType: "spell-card"
        });

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Bane.name
            features.push(feature);
        }
    }

}
