
import { ChangeType, MapWorkerClient, MapWorkerInputMessageType, Tool, ToolSource, ToolType } from "../../../../domain/references.js";
import { ToolPalettesDialogModel } from "../tool-palettes-dialog.js";

export function createModel() {
    return new ToolsViewModel();
}

class ToolsViewModel {

    // event handlers
    async init(kitElement, kitObjects) {
        this.#kitElement = kitElement;
        ToolsViewModel.#dialogModel = kitObjects.find(o => o.alias == "dialogModel")?.object;
        ToolsViewModel.#map = await MapWorkerClient.getMap(); 
    }

    // methods
    hasTools() {
        return ToolsViewModel.#map.tools.length > 0;
    }

    getTools() {
        const map = ToolsViewModel.#map;
        function sortByDisplayName(item1, item2) {
            if (item1.displayName.toLowerCase() < item2.displayName.toLowerCase()) {
                return -1;
            }
            if (item1.displayName.toLowerCase() > item2.displayName.toLowerCase()) {
                return 1;
            }
            return 0;
        }
        const tools = [];
        for (const tool of map.tools) {
            const ref = tool.ref;
            let refNote = "&nbsp;"
            if (ref.isBuiltIn) {
                refNote = "Built in";
            }
            if (ref.isFromTemplate) {
                refNote = "From template";
            }
            tools.push({
                id: ToolPalettesDialogModel.serializeRef(ref),
                displayName: ref.name.length > 25 ? ref.name.slice(0, 25) + "..." : ref.name,
                thumbnailSvgSrc: tool.thumbnailSrc,
                refNote: refNote 
            });
        }
        tools.sort(sortByDisplayName);
        return tools;
    }

    addTool() {
        let moduleSrc = `data-${btoa(ToolSource.Default)}`
        const thumbnailSrc = `<g class="icon"><path d="M 30,10 l -20,0 0,20 M 10,70 l 0,20 20,0 M 70,90 l 20,0 0,-20 M 90,30 l 0,-20 -20,0" /></g>`;
        const cursorSrc = `<g stroke="black" stroke-width="4" fill="white"><path d="M 5,5 L 80,80 A 5 5 -45 0 0 90 70 L 35,15 z" /></g>`;
        const map = ToolsViewModel.#map;
        const name = ToolsViewModel.#getNewRefName("New tool", map.toolRefs);
        const tool = new Tool({
            ref: {
                name: name,
                versionId: 1,
                isBuiltIn: false,
                isFromTemplate: false
            },
            moduleSrc: moduleSrc,
            thumbnailSrc: thumbnailSrc,
            cursorSrc: cursorSrc,
            cursorHotspot: { x: 0, y: 0 },
            toolType: ToolType.DrawingTool
        });
        const changes = [
            {
                changeType: ChangeType.Insert,
                changeObjectType: Map.name,
                propertyName: "tools",
                itemIndex: map.tools.length,
                itemValue: tool.getData()
            },
            {
                changeType: ChangeType.Insert,
                changeObjectType: Map.name,
                propertyName: "toolRefs",
                itemIndex: map.toolRefs.length,
                itemValue: tool.ref.getData()
            }
        ];
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    async editTool(id) {
        await ToolsViewModel.#dialogModel.selectNavItemByRefId(`tool-${id}`);
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
