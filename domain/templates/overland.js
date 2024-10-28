﻿
import { Map } from "../references.js";

export function getOverlandTemplate() {
    const blueRegion = {
        ref: { name: "Blue Region" },
        thumbnailSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFgSURBVEhL7ZWxSsRAFEXzK0mx1YKN+BOTTrS3EgTt9xMEC1tLEdFCJLG08zP8BQvZxRWLXY33sTfwdniZzJKVWOTArTLv3JlkIMnAwL8gfXR7WemWWZHP09J9ZGU+zQr3WVXVAZdsFxRdID8oqhqD5+CWI92A7Ky10M9qAzdUbM7qta5Lr17fzPjrJCgfURUPvt+9L7IKdfz1EpRfUxkHXte8HrZKQtHFApXt4JY+62FLHoqeleDUE6rD6MtkiWOii6NOnT7l+11L6+hynPqYFTZpkS/+orj11Cie9VKM7/veS3GfJ/7qpRi371APWMKYaIcA7wMrmpHfnB60xKHoWYlAdRjs7lQPWvJQ9KwA3wvV7fAnvyaxSnT89RKByjiwy3NLZBVKrLUCPHdUxoMhZwljwtIxVZuD4V1kacmtsPAbuaSiGxDthDbAwgVywpHtAvEYEeRUdYQjLhloIEl+AUr0tlh60OIdAAAAAElFTkSuQmCC",
        fills: [{ color: "lightblue" }],
        strokes: [{ color: "green", width: 3 }],
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
        mapItemTemplateRefs: [blueRegion.ref],
        mapItemTemplates: [blueRegion],
        toolPalette: {
            drawingToolPalettes: [[{ versionId: 1, isBuiltIn: true, name: "Draw Path" }]],
            mapItemTemplatePalettes: [[blueRegion.ref]]
        }
    };
    return new Map(mapData);
}