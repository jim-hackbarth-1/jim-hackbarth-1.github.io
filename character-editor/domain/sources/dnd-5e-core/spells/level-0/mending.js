
export class Mending {

    static get name() {
        return "mending";
    }

    static get title() {
        return "Mending";
    }

    static get level() {
        return 0;
    }

    static get school() {
        return "transmutation"
    }

    static get isRitual() {
        return false;
    }

    static get classes() {
        return ["bard", "cleric", "druid", "sorcerer", "wizard"];
    }

    static get castingTime() {
        return "1 minute"
    }

    static get range() {
        return "Touch"
    }

    static get components() {
        return "V, S, M (two lodestones)"
    }

    static get duration() {
        return "Instantaneous"
    }

    static get html() {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${Mending.title}</h3>
                <div class="spell-properties">${Mending.school} cantrip</div>
                <div><b>Casting Time: </b>${Mending.castingTime}</div>
                <div><b>Range: </b>${Mending.range}</div>
                <div><b>Components: </b>${Mending.components}</div>
                <div><b>Duration: </b>${Mending.duration}</div>
                <div class="content">
                    <p>
                        This spell repairs a single break or tear in an object you touch, such as a broken chain link, two halves of a broken key, a torn cloak, or a leaking wineskin. As long as the break or tear is no larger than 1 foot in any dimension, you mend it, leaving no trace of the former damage.
                    </p>
                    <p>
                        This spell can physically repair a magic item or construct, but the spell can’t restore magic to such an object.
                    </p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character) {
        const tempFeatures = [];
        tempFeatures.push({
            name: Mending.name,
            title: Mending.title,
            level: Mending.level,
            html: `
                <div class="spell-properties">${Mending.school} cantrip</div>
                <div><b>Casting Time: </b>${Mending.castingTime}</div>
                <div><b>Range: </b>${Mending.range}</div>
                <div><b>Components: </b>${Mending.components}</div>
                <div><b>Duration: </b>${Mending.duration}</div>
                <div class="content">
                    <p>
                        This spell repairs a single break or tear in an object you touch, such as a broken chain link, two halves of a broken key, a torn cloak, or a leaking wineskin. As long as the break or tear is no larger than 1 foot in any dimension, you mend it, leaving no trace of the former damage.
                    </p>
                    <p>
                        This spell can physically repair a magic item or construct, but the spell can’t restore magic to such an object.
                    </p>
                </div>
            </div>
                    `,
            source: { name: "spell" },
            displayType: "spell-card"
        });
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Mending.name
            features.push(feature);
        }
    }

}
