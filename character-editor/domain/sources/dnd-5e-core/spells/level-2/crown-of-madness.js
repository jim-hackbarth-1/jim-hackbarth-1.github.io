
export class CrownOfMadness {

    static get name() {
        return "crown-of-madness";
    }

    static get title() {
        return "Crown of Madness";
    }

    static get level() {
        return 2;
    }

    static get school() {
        return "enchantment"
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
        return "120 feet"
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
                <h3>${CrownOfMadness.title}</h3>
                <div class="spell-properties">2nd-level ${CrownOfMadness.school}</div>
                <div><b>Casting Time: </b>${CrownOfMadness.castingTime}</div>
                <div><b>Range: </b>${CrownOfMadness.range}</div>
                <div><b>Components: </b>${CrownOfMadness.components}</div>
                <div><b>Duration: </b>${CrownOfMadness.duration}</div>
                <div class="content">
                    <p>
                        One humanoid of your choice that you can see within range must succeed on a Wisdom saving throw or become charmed by you for the duration. While the target is charmed in this way, a twisted crown of jagged iron appears on its head, and a madness glows in its eyes.
                    </p>
                    <p>
                        The charmed target must use its action before moving on each of its turns to make a melee attack against a creature other than itself that you mentally choose. The target can act normally on its turn if you choose no creature or if none are within its reach.
                    </p>
                    <p>
                        On your subsequent turns, you must use your action to maintain control over the target, or the spell ends. Also, the target can make a Wisdom saving throw at the end of each of its turns. On a success, the spell ends.
                    </p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character) {
        const tempFeatures = [];
        tempFeatures.push({
            name: CrownOfMadness.name,
            title: CrownOfMadness.title,
            level: CrownOfMadness.level,
            html: `
                <div class="spell-properties">2nd-level ${CrownOfMadness.school}</div>
                <div><b>Casting Time: </b>${CrownOfMadness.castingTime}</div>
                <div><b>Range: </b>${CrownOfMadness.range}</div>
                <div><b>Components: </b>${CrownOfMadness.components}</div>
                <div><b>Duration: </b>${CrownOfMadness.duration}</div>
                <div class="content">
                    <p>
                        One humanoid of your choice that you can see within range must succeed on a Wisdom saving throw or become charmed by you for the duration. While the target is charmed in this way, a twisted crown of jagged iron appears on its head, and a madness glows in its eyes.
                    </p>
                    <p>
                        The charmed target must use its action before moving on each of its turns to make a melee attack against a creature other than itself that you mentally choose. The target can act normally on its turn if you choose no creature or if none are within its reach.
                    </p>
                    <p>
                        On your subsequent turns, you must use your action to maintain control over the target, or the spell ends. Also, the target can make a Wisdom saving throw at the end of each of its turns. On a success, the spell ends.
                    </p>
                </div>
                    `,
            source: { name: "spell" },
            displayType: "spell-card"
        });

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = CrownOfMadness.name
            features.push(feature);
        }
    }

}
