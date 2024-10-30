
import { ChangeEventType, DbManager, EntityReference, Map } from "../references.js";

/**
 * @readonly
 * @enum {string}
 */
export const MapWorkerInputMessageType = {
    Initialize: "Initialize",
    LoadMap: "LoadMap",
    UpdateMap: "UpdateMap", // save happened, undo, redo, set layer, set zoom, set overlay, ...
    SetActiveTool: "SetActiveTool",
    SetActiveMapItemTemplate: "SetActiveMapItemTemplate",
    CanvasEvent: "CanvasEvent" 
};

export const MapWorkerOutputMessageType = {
    DebugInfo: "DebugInfo",
    Error: "Error",
    MapUpdated: "MapUpdated"
}

onmessage = (message) => {
    MapWorker.handleClientMessage(message);
};

export class MapWorker {

    // properties
    static #messagePort;
    static get messagePort() {
        return MapWorker.#messagePort;
    }

    static #canvas;
    static get canvas() {
        return MapWorker.#canvas;
    }

    static #baseUrl;
    static get baseUrl() {
        return MapWorker.#baseUrl;
    }

    static #map;
    static get map() {
        return MapWorker.#map;
    }

    static #renderingContext;
    static get renderingContext() {
        return MapWorker.#renderingContext;
    }

    static #activeTool;
    static get activeTool() {
        return MapWorker.#activeTool;
    }

    static #activeToolModel;
    static get activeToolModel() {
        return MapWorker.#activeToolModel;
    }

    static #activeMapItemTemplate;
    static get activeMapItemTemplate() {
        return MapWorker.#activeMapItemTemplate;
    }

    // methods
    static async handleClientMessage(message) {
        try {
            const messageType = message?.data?.messageType;
            switch (messageType) {
                case MapWorkerInputMessageType.Initialize:
                    await MapWorker.#initialize(message.ports, message.data.canvas, message.data.baseUrl);
                    break;
                case MapWorkerInputMessageType.LoadMap:
                    await MapWorker.#loadMap();
                    break;
                case MapWorkerInputMessageType.UpdateMap:
                    // TODO
                    break;
                case MapWorkerInputMessageType.SetActiveTool:
                    await MapWorker.#setActiveTool(message.data.toolRefData);
                    break;
                case MapWorkerInputMessageType.SetActiveMapItemTemplate:
                    await MapWorker.#setActiveMapItemTemplate(message.data.mapItemTemplateRefData);
                    break;
                case MapWorkerInputMessageType.CanvasEvent:
                    await MapWorker.#canvasEvent(message.data.canvasEventType, message.data.canvasEventData);
                    break;
                default:
                    throw new Error(`Unexpected worker request type: ${messageType ?? "(null)"}`);
            }
        }
        catch (error) {
            MapWorker.#handleError(error, { messageData: message?.data });
        }
    }

    static postMessage(message) {
        if (MapWorker.messagePort) {
            MapWorker.messagePort.postMessage(message);
        }
    }

    static async handleMapChange(change) {
        if (MapWorker.map) {
            await DbManager.setMap(MapWorker.map.getData());
            const message = { messageType: MapWorkerOutputMessageType.MapUpdated, data: { hasUnsavedChanges: MapWorker.map.hasUnsavedChanges, change: change } };
            MapWorker.postMessage(message);
        }
    }

    static renderMap() {
        if (MapWorker.canvas && MapWorker.renderingContext && MapWorker.map) {
            MapWorker.map.render(MapWorker.canvas, MapWorker.renderingContext);
        }
    }

    // helpers
    static async #initialize(ports, canvas, baseUrl) {
        MapWorker.#messagePort = ports[0];
        MapWorker.#canvas = canvas;
        MapWorker.#renderingContext = MapWorker.canvas.getContext("2d");
        MapWorker.renderingContext.save();
        MapWorker.#baseUrl = baseUrl;
        await MapWorker.#loadMap();
    }

    static async #loadMap() {
        const mapData = await DbManager.getMap();
        MapWorker.#map = mapData ? new Map(mapData) : null;
        MapWorker.#activeTool = null;
        MapWorker.#activeToolModel = null;
        MapWorker.#activeMapItemTemplate = null;
        if (MapWorker.canvas && MapWorker.renderingContext) {
            if (MapWorker.map) {
                MapWorker.map.addEventListener(ChangeEventType.afterChangeEvent, MapWorker.handleMapChange);
                MapWorker.map.render(MapWorker.canvas, MapWorker.renderingContext);
            }
            else {
                MapWorker.renderingContext.clearRect(0, 0, MapWorker.canvas.width, MapWorker.canvas.height);
            }
        }
    }

    static async #setActiveTool(toolRefData) {
        MapWorker.#activeTool = null;
        MapWorker.#activeToolModel = null;
        if (toolRefData && MapWorker.map) {
            const toolRef = new EntityReference(toolRefData);
            const tool = MapWorker.map.tools.find(t => EntityReference.areEqual(t.ref, toolRef));
            const toolModule = await import(tool.moduleSrc);
            MapWorker.#activeTool = tool;
            MapWorker.#activeToolModel = toolModule.createToolModel();
            if (MapWorker.activeToolModel && MapWorker.activeToolModel.onActivate) {
                return await MapWorker.activeToolModel.onActivate(MapWorker.baseUrl);
            }
        }
    }

    static async #setActiveMapItemTemplate(mapItemTemplateRefData) {
        MapWorker.#activeMapItemTemplate = null;
        if (mapItemTemplateRefData && MapWorker.map) {
            const mapItemTemplateRef = new EntityReference(mapItemTemplateRefData);
            const mapItemTemplate = MapWorker.map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, mapItemTemplateRef));
            MapWorker.#activeMapItemTemplate = mapItemTemplate;
            if (MapWorker.activeToolModel && MapWorker.activeToolModel.onMapItemTemplateActivated) {
                return await MapWorker.activeToolModel.onMapItemTemplateActivated();
            }
        }
    }

    static async #canvasEvent(canvasEventType, eventData) {
        if (MapWorker.activeToolModel && MapWorker.activeToolModel.handleCanvasEvent) {
            await MapWorker.activeToolModel.handleCanvasEvent({
                canvasEventType: canvasEventType,
                eventData: eventData
            });
        }
    }

    static #handleError(error, data) {
        try {
            MapWorker.postMessage({
                messageType: MapWorkerOutputMessageType.Error,
                error: `Uncaught error: ${error.message}\n ${error.stack}\n ${JSON.stringify(data, null, 2)}`
            });
        }
        catch { }
    }
}
