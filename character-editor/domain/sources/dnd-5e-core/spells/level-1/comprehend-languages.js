
export class ComprehendLanguages {

    static get name() {
        return "comprehend-languages";
    }

    static get title() {
        return "Comprehend Languages";
    }

    static get level() {
        return 1;
    }

    static get school() {
        return "divination"
    }

    static get isRitual() {
        return true;
    }

    static get classes() {
        return ["bard", "sorcerer", "warlock", "wizard"];
    }

    static get castingTime() {
        return "1 action"
    }

    static get range() {
        return "Self"
    }

    static get components() {
        return "V, S, M (a pinch of soot and salt)"
    }

    static get duration() {
        return "1 hour"
    }

    static get html() {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${ComprehendLanguages.title}</h3>
                <div class="spell-properties">1st-level ${ComprehendLanguages.school}</div>
                <div><b>Casting Time: </b>${ComprehendLanguages.castingTime}</div>
                <div><b>Range: </b>${ComprehendLanguages.range}</div>
                <div><b>Components: </b>${ComprehendLanguages.components}</div>
                <div><b>Duration: </b>${ComprehendLanguages.duration}</div>
                <div class="content">
                    <p>
                        For the duration, you understand the literal meaning of any spoken language that you hear. You also understand any written language that you see, but you must be touching the surface on which the words are written. It takes about 1 minute to read one page of text.
                    </p>
                    <p>
                        This spell doesn’t decode secret messages in a text or glyph, such as an arcane sigil, that isn’t part of a written language.
                    </p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character) {
        const tempFeatures = [];
        tempFeatures.push({
            name: ComprehendLanguages.name,
            title: ComprehendLanguages.title,
            level: ComprehendLanguages.level,
            html: `
                <div class="spell-properties">1st-level ${ComprehendLanguages.school}</div>
                <div><b>Casting Time: </b>${ComprehendLanguages.castingTime}</div>
                <div><b>Range: </b>${ComprehendLanguages.range}</div>
                <div><b>Components: </b>${ComprehendLanguages.components}</div>
                <div><b>Duration: </b>${ComprehendLanguages.duration}</div>
                <div class="content">
                    <p>
                        For the duration, you understand the literal meaning of any spoken language that you hear. You also understand any written language that you see, but you must be touching the surface on which the words are written. It takes about 1 minute to read one page of text.
                    </p>
                    <p>
                        This spell doesn’t decode secret messages in a text or glyph, such as an arcane sigil, that isn’t part of a written language.
                    </p>
                </div>
                    `,
            source: { name: "spell" },
            displayType: "spell-card"
        });

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ComprehendLanguages.name
            features.push(feature);
        }
    }

}
