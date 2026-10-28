
export class FaerieFire {

    static get name() {
        return "faerie-fire";
    }

    static get title() {
        return "Faerie Fire";
    }

    static get level() {
        return 1;
    }

    static get school() {
        return "evocation"
    }

    static get isRitual() {
        return false;
    }

    static get classes() {
        return ["bard", "druid"];
    }

    static get castingTime() {
        return "1 action"
    }

    static get range() {
        return "60 feet"
    }

    static get components() {
        return "V"
    }

    static get duration() {
        return "Concentration, up to 1 minute"
    }

    static get html() {
        /*
        1st-level evocation

Casting Time: 1 action
Range: 60 feet
Components: V
Duration: Concentration, up to 1 minute
<p>
Each object in a 20-foot cube within range is outlined in blue, green, or violet light (your choice).
</p>
<p>
Any creature in the area when the spell is cast is also outlined in light if it fails a Dexterity saving throw. For the duration, objects and affected creatures shed dim light in a 10-foot radius.
</p>
<p>
Any attack roll against an affected creature or object has advantage if the attacker can see it, and the affected creature or object can’t benefit from being invisible.
</p>
Spell Lists. Artificer, Bard, Druid
        */


        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${FaerieFire.title}</h3>
                <div class="spell-properties">1st-level ${FaerieFire.school} (ritual)</div>
                <div><b>Casting Time: </b>${FaerieFire.castingTime}</div>
                <div><b>Range: </b>${FaerieFire.range}</div>
                <div><b>Components: </b>${FaerieFire.components}</div>
                <div><b>Duration: </b>${FaerieFire.duration}</div>
                <div class="content">
                    <p>
                        Each object in a 20-foot cube within range is outlined in blue, green, or violet light (your choice).
                    </p>
                    <p>
                        Any creature in the area when the spell is cast is also outlined in light if it fails a Dexterity saving throw. For the duration, objects and affected creatures shed dim light in a 10-foot radius.
                    </p>
                    <p>
                        Any attack roll against an affected creature or object has advantage if the attacker can see it, and the affected creature or object can’t benefit from being invisible.
                    </p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];

        const spellModifiersInfo = character.getSpellModifiersInfo(FaerieFire, characterSpellClasses, "Dexterity", false);
        const content = `
            <p>
                Each object in a 20-foot cube within range is outlined in blue, green, or violet light (your choice).
            </p>
            <p>
                Any creature in the area when the spell is cast is also outlined in light if it fails a Dexterity saving throw. For the duration, objects and affected creatures shed dim light in a 10-foot radius.
            </p>
            <p>
                Any attack roll against an affected creature or object has advantage if the attacker can see it, and the affected creature or object can’t benefit from being invisible.
            </p>
        `;
        const spellCard = character.getSpellCard(FaerieFire, spellModifiersInfo.displayModifiersHtml, content);
        tempFeatures.push(spellCard);

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = FaerieFire.name
            features.push(feature);
        }
    }

}
