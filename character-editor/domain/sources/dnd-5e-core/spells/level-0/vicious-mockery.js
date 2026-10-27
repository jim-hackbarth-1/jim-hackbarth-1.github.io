
export class ViciousMockery {

    static get name() {
        return "vicious-mockery";
    }

    static get title() {
        return "Vicious Mockery";
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
        return ["bard"];
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
        return "Instantaneous"
    }

    static get html() {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${ViciousMockery.title}</h3>
                <div class="spell-properties">${ViciousMockery.school} cantrip</div>
                <div><b>Casting Time: </b>${ViciousMockery.castingTime}</div>
                <div><b>Range: </b>${ViciousMockery.range}</div>
                <div><b>Components: </b>${ViciousMockery.components}</div>
                <div><b>Duration: </b>${ViciousMockery.duration}</div>
                <div class="content">
                    <p>
                        You unleash a string of insults laced with subtle enchantments at a creature you can see within range. If the target can hear you (though it need not understand you), it must succeed on a Wisdom saving throw or take 1d4 psychic damage and have disadvantage on the next attack roll it makes before the end of its next turn.
                    </p>
                    <p>
                        At Higher Levels. This spell’s damage increases by 1d4 when you reach 5th level (2d4), 11th level (3d4), and 17th level (4d4).
                    </p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character) {
        const tempFeatures = [];

        const level = Number(character.classes.find(c => c.value == "bard").level);

        let damageDice = 1;
        if (level >= 5) {
            damageDice++;
        }
        if (level >= 11) {
            damageDice++;
        }
        if (level >= 17) {
            damageDice++;
        }

        const dcModifiers = character.getSpellModifiers("dc", "bard", { name: "charisma", title: "Charisma" }, true, true);
        const dcModifier = dcModifiers.map(m => m.value).reduce((a, b) => a + b, 0);
        const dc = 8 + Number(dcModifier);

        const damageModifiers = character.getSpellModifiers("damage", "bard", { name: "charisma", title: "Charisma" }, false, false);
        const damageModifierLabel = character.getSpellDamageModifierLabel(damageModifiers);

        const displayModifiers = character.getDisplayModifiers(dcModifiers, damageModifiers, true);
        let displayModifiersHtml = "";
        for (const displayModifier of displayModifiers) {
            displayModifiersHtml += `<div>${displayModifier}</div>`;
        }

        const content = `
            You unleash a string of insults laced with subtle enchantments at a creature you can see within range. If the target can hear you (though it need not understand you), it must succeed on a Wisdom saving throw or take ${damageDice}d4${damageModifierLabel}psychic damage and have disadvantage on the next attack roll it makes before the end of its next turn.
        `
        const spellCard = character.getSpellCard(ViciousMockery, dc, displayModifiersHtml, content);
        tempFeatures.push(spellCard);

        // const attackCard = character.getAttackCard({
        //     name: `${ViciousMockery.name}-attack`,
        //     title: ViciousMockery.title,
        //     damageDice: [{ number: damageDice, size: 4 }],
        //     damageType: "psychic",
        //     range: "60 ft.",
        //     applyAbilityModifierForDamage: false,
        //     applyProficiencyModifierForDamage: false
        // });

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ViciousMockery.name
            features.push(feature);
        }
    }

}
