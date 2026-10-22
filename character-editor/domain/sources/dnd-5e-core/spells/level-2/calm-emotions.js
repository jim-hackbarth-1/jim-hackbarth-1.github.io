
export class CalmEmotions {

    static get name() {
        return "calm-emotions";
    }

    static get title() {
        return "Calm Emotions";
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
        return ["bard", "cleric"];
    }

    static get castingTime() {
        return "1 action"
    }

    static get range() {
        return "60 feet"
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
                <h3>${CalmEmotions.title}</h3>
                <div class="spell-properties">2nd-level ${CalmEmotions.school}</div>
                <div><b>Casting Time: </b>${CalmEmotions.castingTime}</div>
                <div><b>Range: </b>${CalmEmotions.range}</div>
                <div><b>Components: </b>${CalmEmotions.components}</div>
                <div><b>Duration: </b>${CalmEmotions.duration}</div>
                <div class="content">
                    <p>
                        You attempt to suppress strong emotions in a group of people. Each humanoid in a 20-foot-radius sphere centered on a point you choose within range must make a Charisma saving throw; a creature can choose to fail this saving throw if it wishes. If a creature fails its saving throw, choose one of the following two effects. You can suppress any effect causing a target to be charmed or frightened. When this spell ends, any suppressed effect resumes, provided that its duration has not expired in the meantime.
                    </p>
                    <p>
                        Alternatively, you can make a target indifferent about creatures of your choice that it is hostile toward. This indifference ends if the target is attacked or harmed by a spell or if it witnesses any of its friends being harmed. When the spell ends, the creature becomes hostile again, unless the DM rules otherwise.
                    </p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character) {
        const tempFeatures = [];
        tempFeatures.push({
            name: CalmEmotions.name,
            title: CalmEmotions.title,
            level: CalmEmotions.level,
            html: `
                <div class="spell-properties">2nd-level ${CalmEmotions.school}</div>
                <div><b>Casting Time: </b>${CalmEmotions.castingTime}</div>
                <div><b>Range: </b>${CalmEmotions.range}</div>
                <div><b>Components: </b>${CalmEmotions.components}</div>
                <div><b>Duration: </b>${CalmEmotions.duration}</div>
                <div class="content">
                    <p>
                        You attempt to suppress strong emotions in a group of people. Each humanoid in a 20-foot-radius sphere centered on a point you choose within range must make a Charisma saving throw; a creature can choose to fail this saving throw if it wishes. If a creature fails its saving throw, choose one of the following two effects. You can suppress any effect causing a target to be charmed or frightened. When this spell ends, any suppressed effect resumes, provided that its duration has not expired in the meantime.
                    </p>
                    <p>
                        Alternatively, you can make a target indifferent about creatures of your choice that it is hostile toward. This indifference ends if the target is attacked or harmed by a spell or if it witnesses any of its friends being harmed. When the spell ends, the creature becomes hostile again, unless the DM rules otherwise.
                    </p>
                </div>
                    `,
            source: { name: "spell" },
            displayType: "spell-card"
        });

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = CalmEmotions.name
            features.push(feature);
        }
    }

}
