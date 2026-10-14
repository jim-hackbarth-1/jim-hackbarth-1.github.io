
export class CommuneWithNature {

    static get name() {
        return "commune-with-nature";
    }

    static get title() {
        return "Commune with Nature";
    }

    static get level() {
        return 5;
    }

    static get school() {
        return "divination"
    }

    static get isRitual() {
        return true;
    }

    static get classes() {
        return ["druid", "ranger"];
    }

    static get castingTime() {
        return "1 minute"
    }

    static get range() {
        return "Self"
    }

    static get components() {
        return "V, S"
    }

    static get duration() {
        return "Instantaneous"
    }
    
    static get html() {
        return `
            <div class="dnd-5e-content">
                <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
                <h3>${CommuneWithNature.title}</h3>
                <div class="spell-properties">5th-level ${CommuneWithNature.school} (ritual)</div>
                <div><b>Casting Time: </b>${CommuneWithNature.castingTime}</div>
                <div><b>Range: </b>${CommuneWithNature.range}</div>
                <div><b>Components: </b>${CommuneWithNature.components}</div>
                <div><b>Duration: </b>${CommuneWithNature.duration}</div>
                <div class="content">
                    <p>You briefly become one with nature and gain knowledge of the surrounding territory. In the outdoors, the spell gives you knowledge of the land within 3 miles of you. In caves and other natural underground settings, the radius is limited to 300 feet. The spell doesn’t function where nature has been replaced by construction, such as in dungeons and towns.</p>
                    <p>You instantly gain knowledge of up to three facts of your choice about any of the following subjects as they relate to the area:</p>
                    <ul>
                        <li>terrain and bodies of water</li>
                        <li>prevalent plants, minerals, animals, or peoples</li>
                        <li>powerful celestials, fey, fiends, elementals, or undead</li>
                        <li>influence from other planes of existence</li>
                        <li>buildings</li>
                    </ul>
                    <p>For example, you could determine the location of powerful undead in the area, the location of major sources of safe drinking water, and the location of any nearby towns.</p>
                </div>
            </div>
        `;
    }

    static applyFeatures(features, character) {
        const tempFeatures = [];
        tempFeatures.push({
            name: CommuneWithNature.name,
            title: CommuneWithNature.title,
            html: `
                <div class="spell-properties">5th-level ${CommuneWithNature.school} (ritual)</div>
                <div><b>Casting Time: </b>${CommuneWithNature.castingTime}</div>
                <div><b>Range: </b>${CommuneWithNature.range}</div>
                <div><b>Components: </b>${CommuneWithNature.components}</div>
                <div><b>Duration: </b>${CommuneWithNature.duration}</div>
                <div class="content">
                    <p>You briefly become one with nature and gain knowledge of the surrounding territory. In the outdoors, the spell gives you knowledge of the land within 3 miles of you. In caves and other natural underground settings, the radius is limited to 300 feet. The spell doesn’t function where nature has been replaced by construction, such as in dungeons and towns.</p>
                    <p>You instantly gain knowledge of up to three facts of your choice about any of the following subjects as they relate to the area:</p>
                    <ul>
                        <li>terrain and bodies of water</li>
                        <li>prevalent plants, minerals, animals, or peoples</li>
                        <li>powerful celestials, fey, fiends, elementals, or undead</li>
                        <li>influence from other planes of existence</li>
                        <li>buildings</li>
                    </ul>
                    <p>For example, you could determine the location of powerful undead in the area, the location of major sources of safe drinking water, and the location of any nearby towns.</p>
                </div>
                    `,
            source: { name: "spell" },
            displayType: "spell-card"
        });
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = CommuneWithNature.name
            features.push(feature);
        }
    }

}
