
export class Friends {

    static get name() {
        return "friends";
    }

    static get title() {
        return "Friends";
    }

    static get level() {
        return 0;
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
        return "10 feet"
    }

    static get components() {
        return "S, M (some makeup)"
    }

    static get duration() {
        return "Concentration, up to 1 minute"
    }

    static get html() {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${Friends.title}</h3>
                <div class="spell-properties">${Friends.school} cantrip</div>
                <div><b>Casting Time: </b>${Friends.castingTime}</div>
                <div><b>Range: </b>${Friends.range}</div>
                <div><b>Components: </b>${Friends.components}</div>
                <div><b>Duration: </b>${Friends.duration}</div>
                <div class="content">
                    <p>
                        You magically emanate a sense of friendship toward one creature you can see within range. The target must succeed on a Wisdom saving throw or have the Charmed condition for the duration. The target succeeds automatically if it isn’t a Humanoid, if you’re fighting it, or if you have cast this spell on it within the past 24 hours.
                    </p>
                    <p>
                        The spell ends early if the target takes damage or if you make an attack roll, deal damage, or force anyone to make a saving throw. When the spell ends, the target knows it was Charmed by you.
                    </p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const spellModifiersInfo = character.getSpellModifiersInfo(Friends, characterSpellClasses, "Wisdom", false);
        const content = `
            <p>
                You magically emanate a sense of friendship toward one creature you can see within range. The target must succeed on a Wisdom saving throw or have the Charmed condition for the duration. The target succeeds automatically if it isn’t a Humanoid, if you’re fighting it, or if you have cast this spell on it within the past 24 hours.
            </p>
            <p>
                The spell ends early if the target takes damage or if you make an attack roll, deal damage, or force anyone to make a saving throw. When the spell ends, the target knows it was Charmed by you.
            </p>
        `;
        const spellCard = character.getSpellCard(Friends, spellModifiersInfo.displayModifiersHtml, content);
        tempFeatures.push(spellCard);
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Friends.name
            features.push(feature);
        }
    }

}
