
export class Prestidigitation {

    static get name() {
        return "prestidigitation";
    }

    static get title() {
        return "Prestidigitation";
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
        return ["bard", "sorcerer", "warlock", "wizard"];
    }

    static get castingTime() {
        return "1 action"
    }

    static get range() {
        return "10 feet"
    }

    static get components() {
        return "V, S"
    }

    static get duration() {
        return "Up to 1 hour"
    }

    static get html() {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${Prestidigitation.title}</h3>
                <div class="spell-properties">${Prestidigitation.school} cantrip</div>
                <div><b>Casting Time: </b>${Prestidigitation.castingTime}</div>
                <div><b>Range: </b>${Prestidigitation.range}</div>
                <div><b>Components: </b>${Prestidigitation.components}</div>
                <div><b>Duration: </b>${Prestidigitation.duration}</div>
                <div class="content">
                    <p>
                        This spell is a minor magical trick that novice spellcasters use for practice. You create one of the following magical effects within range:
                    </p>
                    <ul>
                        <li>
                            You create an instantaneous, harmless sensory effect, such as a shower of sparks, a puff of wind, faint musical notes, or an odd odor.
                        </li>
                        <li>
                            You instantaneously light or snuff out a candle, a torch, or a small campfire.
                        </li>
                        <li>
                            You instantaneously clean or soil an object no larger than 1 cubic foot.
                        </li>
                        <li>
                            You chill, warm, or flavor up to 1 cubic foot of nonliving material for 1 hour.
                        </li>
                        <li>
                            You make a color, a small mark, or a symbol appear on an object or a surface for 1 hour.
                        </li>
                        <li>
                            You create a nonmagical trinket or an illusory image that can fit in your hand and that lasts until the end of your next turn.
                        </li>
                    </ul>
                    <p>
                        If you cast this spell multiple times, you can have up to three of its non-instantaneous effects active at a time, and you can dismiss such an effect as an action.
                    </p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push({
            name: Prestidigitation.name,
            title: Prestidigitation.title,
            level: Prestidigitation.level,
            html: `
                <div class="spell-properties">${Prestidigitation.school} cantrip</div>
                <div><b>Casting Time: </b>${Prestidigitation.castingTime}</div>
                <div><b>Range: </b>${Prestidigitation.range}</div>
                <div><b>Components: </b>${Prestidigitation.components}</div>
                <div><b>Duration: </b>${Prestidigitation.duration}</div>
                <div class="content">
                    <p>
                        This spell is a minor magical trick that novice spellcasters use for practice. You create one of the following magical effects within range:
                    </p>
                    <ul>
                        <li>
                            You create an instantaneous, harmless sensory effect, such as a shower of sparks, a puff of wind, faint musical notes, or an odd odor.
                        </li>
                        <li>
                            You instantaneously light or snuff out a candle, a torch, or a small campfire.
                        </li>
                        <li>
                            You instantaneously clean or soil an object no larger than 1 cubic foot.
                        </li>
                        <li>
                            You chill, warm, or flavor up to 1 cubic foot of nonliving material for 1 hour.
                        </li>
                        <li>
                            You make a color, a small mark, or a symbol appear on an object or a surface for 1 hour.
                        </li>
                        <li>
                            You create a nonmagical trinket or an illusory image that can fit in your hand and that lasts until the end of your next turn.
                        </li>
                    </ul>
                    <p>
                        If you cast this spell multiple times, you can have up to three of its non-instantaneous effects active at a time, and you can dismiss such an effect as an action.
                    </p>
                </div>
            </div>
                    `,
            source: { name: "spell" },
            displayType: "spell-card"
        });
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Prestidigitation.name
            features.push(feature);
        }
    }

}
