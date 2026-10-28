
export class Darkness {

    static get name() {
        return "darkness";
    }

    static get title() {
        return "Darkness";
    }

    static get level() {
        return 2;
    }

    static get school() {
        return "evocation"
    }

    static get isRitual() {
        return false;
    }

    static get classes() {
        return ["sorcerer", "warlock", "wizard"];
    }

    static get castingTime() {
        return "1 action"
    }

    static get range() {
        return "60 feet"
    }

    static get components() {
        return "V, M (bat fur and a drop of pitch or piece of coal)"
    }

    static get duration() {
        return "Concentration, up to 10 minutes"
    }

    static get html() {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${Darkness.title}</h3>
                <div class="spell-properties">2nd-level ${Darkness.school}</div>
                <div><b>Casting Time: </b>${Darkness.castingTime}</div>
                <div><b>Range: </b>${Darkness.range}</div>
                <div><b>Components: </b>${Darkness.components}</div>
                <div><b>Duration: </b>${Darkness.duration}</div>
                <div class="content">
                    <p>
                        Magical darkness spreads from a point you choose within range to fill a 15-foot radius sphere for the duration. The darkness spreads around corners. A creature with darkvision can’t see through this darkness, and nonmagical light can’t illuminate it.
                    </p>
                    <p>
                        If the point you choose is on an object you are holding or one that isn’t being worn or carried, the darkness emanates from the object and moves with it. Completely covering the source of the darkness with an opaque object, such as a bowl or a helm, blocks the darkness.
                    </p>
                    <p>
                        If any of this spell’s area overlaps with an area of light created by a spell of 2nd level or lower, the spell that created the light is dispelled.
                    </p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push({
            name: Darkness.name,
            title: Darkness.title,
            level: Darkness.level,
            html: `
                <div class="spell-properties">2nd-level ${Darkness.school} (ritual)</div>
                <div><b>Casting Time: </b>${Darkness.castingTime}</div>
                <div><b>Range: </b>${Darkness.range}</div>
                <div><b>Components: </b>${Darkness.components}</div>
                <div><b>Duration: </b>${Darkness.duration}</div>
                <div class="content">
                    <p>
                        Magical darkness spreads from a point you choose within range to fill a 15-foot radius sphere for the duration. The darkness spreads around corners. A creature with darkvision can’t see through this darkness, and nonmagical light can’t illuminate it.
                    </p>
                    <p>
                        If the point you choose is on an object you are holding or one that isn’t being worn or carried, the darkness emanates from the object and moves with it. Completely covering the source of the darkness with an opaque object, such as a bowl or a helm, blocks the darkness.
                    </p>
                    <p>
                        If any of this spell’s area overlaps with an area of light created by a spell of 2nd level or lower, the spell that created the light is dispelled.
                    </p>
                </div>
                    `,
            source: { name: "spell" },
            displayType: "spell-card"
        });
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Darkness.name
            features.push(feature);
        }
    }

}
