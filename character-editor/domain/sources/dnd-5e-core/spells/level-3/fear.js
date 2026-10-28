
export class Fear {

    static get name() {
        return "fear";
    }

    static get title() {
        return "Fear";
    }

    static get level() {
        return 3;
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
        return "Self (30-foot cone)"
    }

    static get components() {
        return "V, S, M (a white feather or the heart of a hen)"
    }

    static get duration() {
        return "Concentration, up to 1 minute"
    }

    static get html() {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${Fear.title}</h3>
                <div class="spell-properties">3rd-level ${Fear.school}</div>
                <div><b>Casting Time: </b>${Fear.castingTime}</div>
                <div><b>Range: </b>${Fear.range}</div>
                <div><b>Components: </b>${Fear.components}</div>
                <div><b>Duration: </b>${Fear.duration}</div>
                <div class="content">
                    <p>
                        You project a phantasmal image of a creature’s worst fears. Each creature in a 30-foot cone must succeed on a Wisdom saving throw or drop whatever it is holding and become frightened for the duration.
                    </p>
                    <p>
                        While frightened by this spell, a creature must take the Dash action and move away from you by the safest available route on each of its turns, unless there is nowhere to move. If the creature ends its turn in a location where it doesn’t have line of sight to you, the creature can make a Wisdom saving throw. On a successful save, the spell ends for that creature.
                    </p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];

        const spellModifiersInfo = character.getSpellModifiersInfo(Fear, characterSpellClasses, "Wisdom", false);
        const content = `
            <p>
                You project a phantasmal image of a creature’s worst fears. Each creature in a 30-foot cone must succeed on a Wisdom saving throw or drop whatever it is holding and become frightened for the duration.
            </p>
            <p>
                While frightened by this spell, a creature must take the Dash action and move away from you by the safest available route on each of its turns, unless there is nowhere to move. If the creature ends its turn in a location where it doesn’t have line of sight to you, the creature can make a Wisdom saving throw. On a successful save, the spell ends for that creature.
            </p>
        `;
        const spellCard = character.getSpellCard(Fear, spellModifiersInfo.displayModifiersHtml, content);
        tempFeatures.push(spellCard);

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Fear.name
            features.push(feature);
        }
    }

}
