
export class CaseMapOrScroll {

    static get name() {
        return "case-map-or-scroll";
    }

    static get title() {
        return "Case, map or scroll";
    }

    static get category() {
        return "adventuring-gear";
    }

    static get properties() {
        return ["Cost: 1gp"];
    }

    static get canBeEquipped() {
        return false;
    }

    static get html() {
        return `
        <div class="dnd-5e-content">
            <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
            <h3>Case, map or scroll</h3>
            <hr/>
            <div class="content">
                <p>This cylindrical leather case can hold up to ten rolled-up sheets of paper or five rolled-up sheets of parchment.</p>
            </div>
        </div>
        `;
    }

    static getSelections(character, inventoryIndex) {
        return [];
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, inventoryIndex) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        tempFeatures.push({
            name: CaseMapOrScroll.name,
            title: CaseMapOrScroll.title,
            html: `
                <p>This cylindrical leather case can hold up to ten rolled-up sheets of paper or five rolled-up sheets of parchment.</p>
                `,
            source: {
                name: "equipment",
                title: CaseMapOrScroll.title
            },
            displayType: "feature-card"
        });
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = CaseMapOrScroll.name
            features.push(feature);
        }
    }

}
