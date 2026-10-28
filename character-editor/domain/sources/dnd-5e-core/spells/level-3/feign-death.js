
export class FeignDeath {

    static get name() {
        return "feign-death";
    }

    static get title() {
        return "Feign Death";
    }

    static get level() {
        return 3;
    }

    static get school() {
        return "necromancy"
    }

    static get isRitual() {
        return true;
    }

    static get classes() {
        return ["bard", "cleric", "druid", "wizard"];
    }

    static get castingTime() {
        return "1 action"
    }

    static get range() {
        return "Touch"
    }

    static get components() {
        return "V, S, M (a pinch of graveyard dirt)"
    }

    static get duration() {
        return "1 hour"
    }

    static get html() {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${FeignDeath.title}</h3>
                <div class="spell-properties">3rd-level ${FeignDeath.school}</div>
                <div><b>Casting Time: </b>${FeignDeath.castingTime}</div>
                <div><b>Range: </b>${FeignDeath.range}</div>
                <div><b>Components: </b>${FeignDeath.components}</div>
                <div><b>Duration: </b>${FeignDeath.duration}</div>
                <div class="content">
                    <p>
                        You touch a willing creature and put it into a cataleptic state that is indistinguishable from death.
                    </p>
                    <p>
                        For the spell’s duration, or until you use an action to touch the target and dismiss the spell, the target appears dead to all outward inspection and to spells used to determine the target’s status. The target is blinded and incapacitated, and its speed drops to 0. The target has resistance to all damage except psychic damage. If the target is diseased or poisoned when you cast the spell, or becomes diseased or poisoned while under the spell’s effect, the disease and poison have no effect until the spell ends.
                    </p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push({
            name: FeignDeath.name,
            title: FeignDeath.title,
            level: FeignDeath.level,
            html: `
                <div class="spell-properties">3rd-level ${FeignDeath.school}</div>
                <div><b>Casting Time: </b>${FeignDeath.castingTime}</div>
                <div><b>Range: </b>${FeignDeath.range}</div>
                <div><b>Components: </b>${FeignDeath.components}</div>
                <div><b>Duration: </b>${FeignDeath.duration}</div>
                <div class="content">
                    <p>
                        You touch a willing creature and put it into a cataleptic state that is indistinguishable from death.
                    </p>
                    <p>
                        For the spell’s duration, or until you use an action to touch the target and dismiss the spell, the target appears dead to all outward inspection and to spells used to determine the target’s status. The target is blinded and incapacitated, and its speed drops to 0. The target has resistance to all damage except psychic damage. If the target is diseased or poisoned when you cast the spell, or becomes diseased or poisoned while under the spell’s effect, the disease and poison have no effect until the spell ends.
                    </p>
                </div>
                    `,
            source: { name: "spell" },
            displayType: "spell-card"
        });

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = FeignDeath.name
            features.push(feature);
        }
    }

}
