
export class MageHand {

    static get name() {
        return "mage-hand";
    }

    static get title() {
        return "Mage Hand";
    }

    static get level() {
        return 0;
    }

    static get school() {
        return "conjuration"
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
        return "30 feet"
    }

    static get components() {
        return "V, S"
    }

    static get duration() {
        return "1 minute"
    }

    static get html() {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${MageHand.title}</h3>
                <div class="spell-properties">${MageHand.school} cantrip</div>
                <div><b>Casting Time: </b>${MageHand.castingTime}</div>
                <div><b>Range: </b>${MageHand.range}</div>
                <div><b>Components: </b>${MageHand.components}</div>
                <div><b>Duration: </b>${MageHand.duration}</div>
                <div class="content">
                    <p>
                        A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again.
                    </p>
                    <p>
                        You can use your action to control the hand. You can use the hand to manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial. You can move the hand up to 30 feet each time you use it.
                    </p>
                    <p>
                        The hand can’t attack, activate magical items, or carry more than 10 pounds.
                    </p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character) {
        const tempFeatures = [];
        tempFeatures.push({
            name: MageHand.name,
            title: MageHand.title,
            level: MageHand.level,
            html: `
                <div class="spell-properties">${MageHand.school} cantrip</div>
                <div><b>Casting Time: </b>${MageHand.castingTime}</div>
                <div><b>Range: </b>${MageHand.range}</div>
                <div><b>Components: </b>${MageHand.components}</div>
                <div><b>Duration: </b>${MageHand.duration}</div>
                <div class="content">
                    <p>
                        A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again.
                    </p>
                    <p>
                        You can use your action to control the hand. You can use the hand to manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial. You can move the hand up to 30 feet each time you use it.
                    </p>
                    <p>
                        The hand can’t attack, activate magical items, or carry more than 10 pounds.
                    </p>
                </div>
                    `,
            source: { name: "spell" },
            displayType: "spell-card"
        });
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = MageHand.name
            features.push(feature);
        }
    }

}
