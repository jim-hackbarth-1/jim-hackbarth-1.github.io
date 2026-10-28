
export class MinorIllusion {

    static get name() {
        return "minor-illusion";
    }

    static get title() {
        return "Minor Illusion";
    }

    static get level() {
        return 0;
    }

    static get school() {
        return "illusion"
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
        return "S, M (a bit of fleece)"
    }

    static get duration() {
        return "1 minute"
    }

    static get html() {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${MinorIllusion.title}</h3>
                <div class="spell-properties">${MinorIllusion.school} cantrip</div>
                <div><b>Casting Time: </b>${MinorIllusion.castingTime}</div>
                <div><b>Range: </b>${MinorIllusion.range}</div>
                <div><b>Components: </b>${MinorIllusion.components}</div>
                <div><b>Duration: </b>${MinorIllusion.duration}</div>
                <div class="content">
                    <p>
                        You create a sound or an image of an object within range that lasts for the duration. The illusion also ends if you dismiss it as an action or cast this spell again.
                    </p>
                    <p>
                        If you create a sound, its volume can range from a whisper to a scream. It can be your voice, someone else’s voice, a lion’s roar, a beating of drums, or any other sound you choose. The sound continues unabated throughout the duration, or you can make discrete sounds at different times before the spell ends.
                    </p>
                    <p>
                        If you create an image of an object—such as a chair, muddy footprints, or a small chest—it must be no larger than a 5-foot cube. The image can’t create sound, light, smell, or any other sensory effect. Physical interaction with the image reveals it to be an illusion, because things can pass through it.
                    </p>
                    <p>
                        If a creature uses its action to examine the sound or image, the creature can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the illusion becomes faint to the creature.
                    </p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push({
            name: MinorIllusion.name,
            title: MinorIllusion.title,
            level: MinorIllusion.level,
            html: `
                <div class="spell-properties">${MinorIllusion.school} cantrip</div>
                <div><b>Casting Time: </b>${MinorIllusion.castingTime}</div>
                <div><b>Range: </b>${MinorIllusion.range}</div>
                <div><b>Components: </b>${MinorIllusion.components}</div>
                <div><b>Duration: </b>${MinorIllusion.duration}</div>
                <div class="content">
                    <p>
                        You create a sound or an image of an object within range that lasts for the duration. The illusion also ends if you dismiss it as an action or cast this spell again.
                    </p>
                    <p>
                        If you create a sound, its volume can range from a whisper to a scream. It can be your voice, someone else’s voice, a lion’s roar, a beating of drums, or any other sound you choose. The sound continues unabated throughout the duration, or you can make discrete sounds at different times before the spell ends.
                    </p>
                    <p>
                        If you create an image of an object—such as a chair, muddy footprints, or a small chest—it must be no larger than a 5-foot cube. The image can’t create sound, light, smell, or any other sensory effect. Physical interaction with the image reveals it to be an illusion, because things can pass through it.
                    </p>
                    <p>
                        If a creature uses its action to examine the sound or image, the creature can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the illusion becomes faint to the creature.
                    </p>
                </div>
                    `,
            source: { name: "spell" },
            displayType: "spell-card"
        });
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = MinorIllusion.name
            features.push(feature);
        }
    }

}
