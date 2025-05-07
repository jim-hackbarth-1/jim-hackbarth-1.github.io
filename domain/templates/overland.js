
import { Map, PathStyleOption, PathStyleType } from "../references.js";

export function getOverlandTemplate() {
    const blueRegion = {
        ref: { name: "Blue Region", versionId: 1 },
        thumbnailSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsAAAA7AAWrWiQkAAABVSURBVEhL7dcxFYAwDEXRT2Vgi6VyKqcLtrABnDYW8rL8uySZ3hxVOWJKQ29sucZu7vAfvfuz1mzXPFe8xY1zGOMwxmGMwxiHMQ5jHMY4jCl7YYpIH6JYCTa6CrVbAAAAAElFTkSuQmCC",
        fills: [
            {
                options: [
                    { key: PathStyleOption.PathStyleType, value: PathStyleType.ColorFill },
                    { key: PathStyleOption.Color, value: "#add8e6" },
                    { key: PathStyleOption.Opacity, value: 1 }
                ]
            }
        ],
        strokes: [
            {
                options: [
                    { key: PathStyleOption.PathStyleType, value: PathStyleType.ColorStroke},
                    { key: PathStyleOption.Color, value: "#008000" },
                    { key: PathStyleOption.Width, value: 3 },
                    { key: PathStyleOption.Opacity, value: 1 }
                ]
            }
        ]
    };
    const greenRegion = {
        ref: { name: "Green Region", versionId: 1 },
        thumbnailSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsAAAA7AAWrWiQkAAABaSURBVEhLYxgowAilGfT9/f9DmTQFFzduBNsJJkCWJuQ6gJg0BwsmHwBbzgTl0x2MWkw3MGox3cCoxXQDoxbTDYxaTDcwajHdwKjFdAOjFtMNDFgXZoAAAwMAvYMPNumSPeYAAAAASUVORK5CYII=",
        fills: [
            {
                options: [
                    { key: PathStyleOption.PathStyleType, value: PathStyleType.ColorFill },
                    { key: PathStyleOption.Color, value: "#8fbc8f" },
                    { key: PathStyleOption.Opacity, value: 1 }
                ]
            }
        ],
        strokes: [
            {
                options: [
                    { key: PathStyleOption.PathStyleType, value: PathStyleType.ColorStroke },
                    { key: PathStyleOption.Color, value: "#2f4f4f" },
                    { key: PathStyleOption.Width, value: 3 },
                    { key: PathStyleOption.Opacity, value: 1 }
                ]
            }
        ]
    };
    const mapData = {
        ref: {
            versionId: 1,
            isBuiltIn: true,
            name: "Overland"
        },
        thumbnailSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFNSURBVEhL7dK9SgNBFMXxfSNfwMrORjsR24iFIIKN2FmLjaUPoHXewGewU+xELNIIip0wehZOuFzPnY8d0CYLf7I7O8lvZyfD28s8/Ucr+M9qhmcbazI1N1cTHCFT8Gb4/nI/vKfGo6phrgqwwnnfj6sOr17TcHu8nZCawDyaw/0YAuRbwhHuUZ7bT2Tn8hoR4jUbLk5m6fxgR+L8EYvy2o+r70UoGm4WX+loa33EPz/ew9UrzJ4jO3/37G5E8WnH2Qij56eHhNXn8JaKcPo5LM7V98BEs/D14wL2Eke9eGm1aIQVjj2b+sqbYI/bVbc+QDNcg0cBYaX9Rb9gheO1Rw+gwBKKJIwsbh/Ap8ASikIYeVzlwRoUZWHEQ6GoFWRFmPmDMF4391sBUdWwzcL+n68Q1SQY9eKTYdSDd8HI4i37vYKbs/Dp3mYlPE/fwsxix1CYIsYAAAAASUVORK5CYII=",
        layers: [{ name: "Layer 1" }],
        activeLayer: "Layer 1",
        mapItemTemplateRefs: [blueRegion.ref, greenRegion.ref],
        mapItemTemplates: [blueRegion, greenRegion],
        toolPalette: {
            editingToolPalettes: [
                [
                    { versionId: 1, isBuiltIn: true, name: "Select path" },
                    { versionId: 1, isBuiltIn: true, name: "Select rectangle" }
                ],
                [
                    { versionId: 1, isBuiltIn: true, name: "Pan" },
                    { versionId: 1, isBuiltIn: true, name: "Zoom" }
                ],
                [
                    { versionId: 1, isBuiltIn: true, name: "Edit transits" },
                    { versionId: 1, isBuiltIn: true, name: "Fit selection" }
                ]
            ],
            drawingToolPalettes: [
                [
                    { versionId: 1, isBuiltIn: true, name: "Draw point" },
                    { versionId: 1, isBuiltIn: true, name: "Draw path" },
                    { versionId: 1, isBuiltIn: true, name: "Draw rectangle" },
                    { versionId: 1, isBuiltIn: true, name: "Draw ellipse" },
                    { versionId: 1, isBuiltIn: true, name: "Draw arc" },
                    { versionId: 1, isBuiltIn: true, name: "Draw polytransit" }
                ]
            ],
            mapItemTemplatePalettes: [[blueRegion.ref, greenRegion.ref]]
        },
        overlay: {
            pattern: "Hex",
            size: 30,
            color: "#000000",
            opacity: 0.5
        }
    };
    return new Map(mapData);
}
