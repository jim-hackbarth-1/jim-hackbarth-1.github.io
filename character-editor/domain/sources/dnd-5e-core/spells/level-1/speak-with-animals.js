
export class SpeakWithAnimals {

    static get name() {
        return "speak-with-animals";
    }

    static get title() {
        return "Speak with Animals";
    }

    static get level() {
        return 1;
    }

    static get school() {
        return "divination"
    }

    static get isRitual() {
        return true;
    }

    static get classes() {
        return ["bard", "druid", "ranger"];
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
        return "10 minutes"
    }

    static get html() {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${SpeakWithAnimals.title}</h3>
                <div class="spell-properties">1st-level ${SpeakWithAnimals.school} (ritual)</div>
                <div><b>Casting Time: </b>${SpeakWithAnimals.castingTime}</div>
                <div><b>Range: </b>${SpeakWithAnimals.range}</div>
                <div><b>Components: </b>${SpeakWithAnimals.components}</div>
                <div><b>Duration: </b>${SpeakWithAnimals.duration}</div>
                <div class="content">
                    <p>You gain the ability to comprehend and verbally communicate with beasts for the duration. The knowledge and awareness of many beasts is limited by their intelligence, but at minimum, beasts can give you information about nearby locations and monsters, including whatever they can perceive or have perceived within the past day. You might be able to persuade a beast to perform a small favor for you, at the DM’s discretion.</p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push({
            name: SpeakWithAnimals.name,
            title: SpeakWithAnimals.title,
            level: SpeakWithAnimals.level,
            html: `
                <div class="spell-properties">1st-level ${SpeakWithAnimals.school} (ritual)</div>
                <div><b>Casting Time: </b>${SpeakWithAnimals.castingTime}</div>
                <div><b>Range: </b>${SpeakWithAnimals.range}</div>
                <div><b>Components: </b>${SpeakWithAnimals.components}</div>
                <div><b>Duration: </b>${SpeakWithAnimals.duration}</div>
                <div class="content">
                    <p>You gain the ability to comprehend and verbally communicate with beasts for the duration. The knowledge and awareness of many beasts is limited by their intelligence, but at minimum, beasts can give you information about nearby locations and monsters, including whatever they can perceive or have perceived within the past day. You might be able to persuade a beast to perform a small favor for you, at the DM’s discretion.</p>
                </div>
                    `,
            source: { name: "spell" },
            displayType: "spell-card"
        });
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = SpeakWithAnimals.name
            features.push(feature);
        }
    }

}
