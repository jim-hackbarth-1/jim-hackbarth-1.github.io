
export class DispelMagic {

    static get name() {
        return "dispel-magic";
    }

    static get title() {
        return "Dispel Magic";
    }

    static get level() {
        return 3;
    }

    static get school() {
        return "abjuration"
    }

    static get isRitual() {
        return false;
    }

    static get classes() {
        return ["bard", "cleric", "druid", "paladin", "sorcerer", "warlock", "wizard"];
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
        return "Instantaneous"
    }

    static get html() {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${DispelMagic.title}</h3>
                <div class="spell-properties">3rd-level ${DispelMagic.school}</div>
                <div><b>Casting Time: </b>${DispelMagic.castingTime}</div>
                <div><b>Range: </b>${DispelMagic.range}</div>
                <div><b>Components: </b>${DispelMagic.components}</div>
                <div><b>Duration: </b>${DispelMagic.duration}</div>
                <div class="content">
                    <p>
                        Choose any creature, object, or magical effect within range. Any spell of 3rd level or lower on the target ends. For each spell of 4th level or higher on the target, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a successful check, the spell ends.
                    </p>
                    <p>
                        At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, you automatically end the effects of a spell on the target if the spell's level is equal to or less than the level of the spell slot you used.
                    </p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push({
            name: DispelMagic.name,
            title: DispelMagic.title,
            level: DispelMagic.level,
            html: `
                <div class="spell-properties">3rd-level ${DispelMagic.school}</div>
                <div><b>Casting Time: </b>${DispelMagic.castingTime}</div>
                <div><b>Range: </b>${DispelMagic.range}</div>
                <div><b>Components: </b>${DispelMagic.components}</div>
                <div><b>Duration: </b>${DispelMagic.duration}</div>
                <div class="content">
                    <p>
                        Choose any creature, object, or magical effect within range. Any spell of 3rd level or lower on the target ends. For each spell of 4th level or higher on the target, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a successful check, the spell ends.
                    </p>
                    <p>
                        At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, you automatically end the effects of a spell on the target if the spell's level is equal to or less than the level of the spell slot you used.
                    </p>
                </div>
                    `,
            source: { name: "spell" },
            displayType: "spell-card"
        });

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = DispelMagic.name
            features.push(feature);
        }
    }

}
