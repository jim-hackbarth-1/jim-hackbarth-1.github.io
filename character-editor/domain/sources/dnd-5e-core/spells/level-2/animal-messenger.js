
export class AnimalMessenger {

    static get name() {
        return "animal-messenger";
    }

    static get title() {
        return "Animal Messenger";
    }

    static get level() {
        return 2;
    }

    static get school() {
        return "enchantment"
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
        return "30 feet"
    }

    static get components() {
        return "V, S, M (a morsel of food)"
    }

    static get duration() {
        return "24 hours"
    }

    static get html() {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${AnimalMessenger.title}</h3>
                <div class="spell-properties">2nd-level ${AnimalMessenger.school}</div>
                <div><b>Casting Time: </b>${AnimalMessenger.castingTime}</div>
                <div><b>Range: </b>${AnimalMessenger.range}</div>
                <div><b>Components: </b>${AnimalMessenger.components}</div>
                <div><b>Duration: </b>${AnimalMessenger.duration}</div>
                <div class="content">
                    <p>
                        By means of this spell, you use an animal to deliver a message. Choose a Tiny beast you can see within range, such as a squirrel, a blue jay, or a bat. You specify a location, which you must have visited, and a recipient who matches a general description, such as “a man or woman dressed in the uniform of the town guard” or “a red-haired dwarf wearing a pointed hat.” You also speak a message of up to twenty-five words. The target beast travels for the duration of the spell toward the specified location, covering about 50 miles per 24 hours for a flying messenger, or 25 miles for other animals.
                    </p>
                    <p>
                        When the messenger arrives, it delivers your message to the creature that you described, replicating the sound of your voice. The messenger speaks only to a creature matching the description you gave. If the messenger doesn’t reach its destination before the spell ends, the message is lost, and the beast makes its way back to where you cast this spell.
                    </p>
                    <p>
                        At Higher Levels. If you cast this spell using a spell slot of 3rd level or higher, the duration of the spell increases by 48 hours for each slot level above 2nd.
                    </p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character) {
        const tempFeatures = [];
        tempFeatures.push({
            name: AnimalMessenger.name,
            title: AnimalMessenger.title,
            level: AnimalMessenger.level,
            html: `
                <div class="spell-properties">2nd-level ${AnimalMessenger.school}</div>
                <div><b>Casting Time: </b>${AnimalMessenger.castingTime}</div>
                <div><b>Range: </b>${AnimalMessenger.range}</div>
                <div><b>Components: </b>${AnimalMessenger.components}</div>
                <div><b>Duration: </b>${AnimalMessenger.duration}</div>
                <div class="content">
                    <p>
                        By means of this spell, you use an animal to deliver a message. Choose a Tiny beast you can see within range, such as a squirrel, a blue jay, or a bat. You specify a location, which you must have visited, and a recipient who matches a general description, such as “a man or woman dressed in the uniform of the town guard” or “a red-haired dwarf wearing a pointed hat.” You also speak a message of up to twenty-five words. The target beast travels for the duration of the spell toward the specified location, covering about 50 miles per 24 hours for a flying messenger, or 25 miles for other animals.
                    </p>
                    <p>
                        When the messenger arrives, it delivers your message to the creature that you described, replicating the sound of your voice. The messenger speaks only to a creature matching the description you gave. If the messenger doesn’t reach its destination before the spell ends, the message is lost, and the beast makes its way back to where you cast this spell.
                    </p>
                    <p>
                        At Higher Levels. If you cast this spell using a spell slot of 3rd level or higher, the duration of the spell increases by 48 hours for each slot level above 2nd.
                    </p>
                </div>
                    `,
            source: { name: "spell" },
            displayType: "spell-card"
        });

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = AnimalMessenger.name
            features.push(feature);
        }
    }

}
