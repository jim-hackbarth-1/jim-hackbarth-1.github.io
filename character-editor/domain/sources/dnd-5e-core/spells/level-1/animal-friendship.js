
export class AnimalFriendship {

    static get name() {
        return "animal-friendship";
    }

    static get title() {
        return "Animal Friendship";
    }

    static get level() {
        return 1;
    }
  
    static get school() {
        return "enchantment"
    }

    static get isRitual() {
        return false;
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
                <h3>${AnimalFriendship.title}</h3>
                <div class="spell-properties">1st-level ${AnimalFriendship.school}</div>
                <div><b>Casting Time: </b>${AnimalFriendship.castingTime}</div>
                <div><b>Range: </b>${AnimalFriendship.range}</div>
                <div><b>Components: </b>${AnimalFriendship.components}</div>
                <div><b>Duration: </b>${AnimalFriendship.duration}</div>
                <div class="content">
                    <p>
                        This spell lets you convince a beast that you mean it no harm. Choose a beast that you can see within range. It must see and hear you. If the beast’s Intelligence is 4 or higher, the spell fails. Otherwise, the beast must succeed on a Wisdom saving throw or be charmed by you for the spell’s duration. If you or one of your companions harms the target, the spell ends.
                    </p>
                    <p>
                        At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional beast for each slot level above 1st.
                    </p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];

        const spellModifiersInfo = character.getSpellModifiersInfo(AnimalFriendship, characterSpellClasses, "Wisdom", false);
        const content = `
            <p>
                This spell lets you convince a beast that you mean it no harm. Choose a beast that you can see within range. It must see and hear you. If the beast’s Intelligence is 4 or higher, the spell fails. Otherwise, the beast must succeed on a Wisdom saving throw or be charmed by you for the spell’s duration. If you or one of your companions harms the target, the spell ends.
            </p>
            <p>
                At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional beast for each slot level above 1st.
            </p>
        `;
        const spellCard = character.getSpellCard(AnimalFriendship, spellModifiersInfo.displayModifiersHtml, content);
        tempFeatures.push(spellCard);

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = AnimalFriendship.name
            features.push(feature);
        }
    }

}
