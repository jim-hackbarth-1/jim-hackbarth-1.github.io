
import {
    ChangeType,
    EntityReference,
    MapItemTemplate,
    MapWorkerClient,
    MapWorkerInputMessageType,
    PathStyle,
    PathStyleType
} from "../../../../domain/references.js";
import { ToolPalettesDialogModel } from "../tool-palettes-dialog.js";

export function createModel() {
    return new MapItemTemplatesViewModel();
}

class MapItemTemplatesViewModel {

    // event handlers
    async init(kitElement, kitObjects) {
        this.#kitElement = kitElement;
        MapItemTemplatesViewModel.#dialogModel = kitObjects.find(o => o.alias == "dialogModel")?.object;
        MapItemTemplatesViewModel.#map = await MapWorkerClient.getMap();
    }

    // methods
    hasMapItemTemplates() {
        return MapItemTemplatesViewModel.#map.mapItemTemplates.length > 0;
    }

    getMapItemTemplates() {
        const map = MapItemTemplatesViewModel.#map;
        function sortByDisplayName(item1, item2) {
            if (item1.displayName.toLowerCase() < item2.displayName.toLowerCase()) {
                return -1;
            }
            if (item1.displayName.toLowerCase() > item2.displayName.toLowerCase()) {
                return 1;
            }
            return 0;
        }
        const mapItemTemplates = [];
        for (const mapItemTemplate of map.mapItemTemplates) {
            const ref = mapItemTemplate.ref;
            let refNote = "&nbsp;"
            if (ref.isBuiltIn) {
                refNote = "Built in";
            }
            if (ref.isFromTemplate) {
                refNote = "From template";
            }
            mapItemTemplates.push({
                id: ToolPalettesDialogModel.serializeRef(ref),
                displayName: ref.name.length > 25 ? ref.name.slice(0, 25) + "..." : ref.name,
                thumbnailSrc: mapItemTemplate.thumbnailSrc,
                refNote: refNote
            });
        }
        mapItemTemplates.sort(sortByDisplayName);
        return mapItemTemplates;
    }

    addMapItemTemplate() {
        const thumbnailSrc = MapItemTemplate.defaultThumbnailSrc;
        const map = MapItemTemplatesViewModel.#map;
        const name = MapItemTemplatesViewModel.#getNewRefName("New map item template", map.mapItemTemplateRefs);
        const mapItemTemplate = new MapItemTemplate({
            ref: {
                versionId: 1,
                isBuiltIn: false,
                isFromTemplate: false,
                name: name
            },
            thumbnailSrc: thumbnailSrc,
            fills: [{ options: PathStyle.getOptionDefaults(PathStyleType.ColorFill) }],
            strokes: [{ options: PathStyle.getOptionDefaults(PathStyleType.ColorStroke) }]
        });
        const changes = [
            {
                changeType: ChangeType.Insert,
                changeObjectType: Map.name,
                propertyName: "mapItemTemplates",
                itemIndex: map.mapItemTemplates.length,
                itemValue: mapItemTemplate.getData()
            },
            {
                changeType: ChangeType.Insert,
                changeObjectType: Map.name,
                propertyName: "mapItemTemplateRefs",
                itemIndex: map.mapItemTemplateRefs.length,
                itemValue: mapItemTemplate.ref.getData()
            }
        ];
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    async editMapItemTemplate(id) {
        await MapItemTemplatesViewModel.#dialogModel.selectNavItemByRefId(`map.item.template-${id}`);
    }

    copy(id) {
        const ref = ToolPalettesDialogModel.deSerializeRef(id);
        const map = MapItemTemplatesViewModel.#map;
        const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, ref));
        const data = mapItemTemplate.getData(true);
        data.ref =
        {
            name: MapItemTemplatesViewModel.#getNewRefName(ref.name, map.mapItemTemplateRefs),
            versionId: 1,
            isBuiltIn: false,
            isFromTemplate: false
        };
        const newMapItemTemplate = new MapItemTemplate(data);
        const changes = [
            {
                changeType: ChangeType.Insert,
                changeObjectType: Map.name,
                propertyName: "mapItemTemplates",
                itemIndex: map.mapItemTemplates.length,
                itemValue: newMapItemTemplate.getData()
            },
            {
                changeType: ChangeType.Insert,
                changeObjectType: Map.name,
                propertyName: "mapItemTemplateRefs",
                itemIndex: map.mapItemTemplateRefs.length,
                itemValue: newMapItemTemplate.ref.getData()
            }
        ];
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    // helpers
    static #dialogModel = null;
    static #map = null;
    #kitElement = null;

    static #getNewRefName(candidate, refs) {
        if (!refs.some(r => r.name == candidate)) {
            return candidate;
        }
        for (let i = 1; i <= 100; i++) {
            const candidateN = `${candidate} (${i})`;
            if (!refs.some(r => r.name == candidateN)) {
                return candidateN;
            }
        }
        return `${candidate} (${crypto.randomUUID()})`;
    }
}
