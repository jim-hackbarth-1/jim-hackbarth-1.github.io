
import { KitDependencyManager } from "../../ui-kit.js";
import {
    BooleanToolOption,
    DbManager,
    Map,
    MapWorkerInputMessageType,
    MapWorkerOutputMessageType,
    StatesToolOption,
    ToolOption
} from "../references.js";

export class MapWorkerClient {

    // properties
    static #mapWorker;
    static get mapWorker() {
        return MapWorkerClient.#mapWorker;
    }

    static #channel;
    static get channel() {
        return MapWorkerClient.#channel;
    }

    static #mapChangeListener;
    static get mapChangeListener() {
        return MapWorkerClient.#mapChangeListener;
    }

    // methods
    static initializeWorker(appDocument, canvas, mapChangeListener, baseUrl) {
        this.#currentCanvasSize = { height: canvas.height, width: canvas.width };
        MapWorkerClient.#addDocumentEventHandlers(appDocument);
        MapWorkerClient.#addCanvasEventHandlers(canvas);
        MapWorkerClient.#mapChangeListener = mapChangeListener;
        MapWorkerClient.#mapWorker = new Worker("../../domain/utilities/map-worker.js", { type: "module" }); 
        MapWorkerClient.#channel = new MessageChannel();
        MapWorkerClient.#channel.port1.onmessage = MapWorkerClient.handleWorkerMessage;
        const offscreenCanvas = canvas.transferControlToOffscreen();
        const message = {
            messageType: MapWorkerInputMessageType.Initialize,
            canvas: offscreenCanvas,
            baseUrl: baseUrl
        };
        MapWorkerClient.#mapWorker.postMessage(message, [offscreenCanvas, MapWorkerClient.#channel.port2]);
    }

    static #map;
    static async getMap() {
        if (!MapWorkerClient.#map) {
            const mapData = await DbManager.getMap();
            MapWorkerClient.#map = mapData ? new Map(mapData) : null;

            // DEBUG
            //console.log("get map");
            //await new Promise(r => setTimeout(r, 3000));
        }
        return MapWorkerClient.#map;
    }
    static async setMap(map) {
        MapWorkerClient.#map = map;
        const mapData = map ? map.getData() : null;
        await DbManager.setMap(mapData);
        if (MapWorkerClient.#mapWorker) {
            MapWorkerClient.#mapWorker.postMessage({ messageType: MapWorkerInputMessageType.LoadMap });
        }
    }

    static #currentCanvasSize;
    static getCurrentCanvasSize() {
        return this.#currentCanvasSize ?? { height: 0, width: 0 };
    }

    static #toolOptions;
    static getToolOptions() {
        return MapWorkerClient.#toolOptions;
    }
    static clearToolOptions() {
        MapWorkerClient.#toolOptions = null;
    }

    static postWorkerMessage(message) {
        if (MapWorkerClient.#mapWorker) {
            MapWorkerClient.#mapWorker.postMessage(message);
        }
    }

    static applyToolOption(toolOptionInfo) {
        if (MapWorkerClient.#mapWorker) {
            MapWorkerClient.#mapWorker.postMessage({
                messageType: MapWorkerInputMessageType.ApplyToolOption,
                toolOptionInfo: toolOptionInfo 
            });
        }
    }

    static async handleWorkerMessage(message) {
        if (message?.data?.messageType === MapWorkerOutputMessageType.DebugInfo) {
            KitDependencyManager.getConsole().log(message.data.data);
        }
        if (message?.data?.messageType === MapWorkerOutputMessageType.Error) {
            KitDependencyManager.getConsole().error(message.data.error);
        }
        if (message?.data?.messageType === MapWorkerOutputMessageType.ChangeCursor) {
            await MapWorkerClient.mapChangeListener(message.data);
        }
        if (message?.data?.messageType === MapWorkerOutputMessageType.ChangeToolOptions) {
            MapWorkerClient.#toolOptions = MapWorkerClient.#getToolOptions(message.data.data.toolOptions);
            await MapWorkerClient.mapChangeListener(message.data);
        }
        if (message?.data?.messageType === MapWorkerOutputMessageType.MapUpdated && MapWorkerClient.mapChangeListener) {
            const mapData = await DbManager.getMap();
            MapWorkerClient.#map = mapData ? new Map(mapData) : null;
            await MapWorkerClient.mapChangeListener(message.data);
        }
    }

    static async getMapAsImage() {
        const map = await MapWorkerClient.getMap();
        const bounds = MapWorkerClient.#getMapBounds(map);
        map.zoom = 1;
        map.pan = { x: -bounds.x, y: -bounds.y };
        const offscreenCanvas = new OffscreenCanvas(bounds.width, bounds.height);
        const renderingContext = offscreenCanvas.getContext("2d");
        await map.render(offscreenCanvas, renderingContext, { updatedViewPort: true });
        const blob = await offscreenCanvas.convertToBlob();
        return blob;
    }

    // helpers
    static #documentEventHandlersAdded = false;
    static #addDocumentEventHandlers(appDocument) {
        if (!MapWorkerClient.#documentEventHandlersAdded) {
            MapWorkerClient.#addDocumentEventHandler(appDocument, "keydown");
            MapWorkerClient.#addDocumentEventHandler(appDocument, "keyup");
            MapWorkerClient.#documentEventHandlersAdded = true;
        }
    }

    static #addCanvasEventHandlers(canvas) {
        MapWorkerClient.#addCanvasEventHandler(canvas, "pointerdown");
        MapWorkerClient.#addCanvasEventHandler(canvas, "pointermove");
        MapWorkerClient.#addCanvasEventHandler(canvas, "pointerup");
        MapWorkerClient.#addCanvasEventHandler(canvas, "wheel");
    }

    static #addDocumentEventHandler(appDocument, eventType) {
        appDocument.addEventListener(eventType, async (event) => await MapWorkerClient.#clientEventHandler(eventType, event));
    }

    static #addCanvasEventHandler(canvas, eventType) {
        canvas.addEventListener(eventType, async (event) => await MapWorkerClient.#clientEventHandler(eventType, event));
    }

    static async #clientEventHandler(eventType, event) {
        try {
            if (eventType == "wheel" && event.altKey) {
                event.preventDefault();
            }
            await MapWorkerClient.postWorkerMessage({
                messageType: MapWorkerInputMessageType.ClientEvent,
                eventType: eventType,
                eventData: MapWorkerClient.#cloneEvent(event)
            });
        }
        catch { }
    }

    static #cloneEvent(event) {
        if (!event) {
            return null;
        }
        return {
            altKey: event.altKey,
            button: event.button,
            buttons: event.buttons,
            clientX: event.clientX,
            clientY: event.clientY,
            code: event.code,
            ctrlKey: event.ctrlKey,
            deltaX: event.deltaX,
            deltaY: event.deltaY,
            deltaZ: event.deltaZ,
            deltaMode: event.deltaMode,
            detail: event.detail,
            key: event.key,
            layerX: event.layerX,
            layerY: event.layerY,
            location: event.location,
            metaKey: event.metaKey,
            movementX: event.movementX,
            movementY: event.movementY,
            offsetX: event.offsetX,
            offsetY: event.offsetY,
            pageX: event.pageX,
            pageY: event.pageY,
            repeat: event.repeat,
            screenX: event.screenX,
            screenY: event.screenY,
            shiftKey: event.shiftKey,
            x: event.x,
            y: event.y
        }
    }

    static #getToolOptions(toolOptionsData) {
        const toolOptions = [];
        if (toolOptionsData) {
            for (const toolOptionData of toolOptionsData) {
                if (toolOptionData.typeName == "ToolOption") {
                    toolOptions.push(new ToolOption(toolOptionData));
                }
                if (toolOptionData.typeName == "BooleanToolOption") {
                    toolOptions.push(new BooleanToolOption(toolOptionData));
                }
                if (toolOptionData.typeName == "StatesToolOption") {
                    toolOptions.push(new StatesToolOption(toolOptionData));
                }
            }
        }
        return toolOptions;
    }

    static #getMapBounds(map) {
        let xMin = NaN, xMax = NaN, yMin = NaN, yMax = NaN;
        for (const layer of map.layers) {
            for (const mapItemGroup of layer.mapItemGroups) {
                if (isNaN(xMin) || mapItemGroup.bounds.x < xMin) {
                    xMin = mapItemGroup.bounds.x;
                }
                if (isNaN(xMax) || mapItemGroup.bounds.x + mapItemGroup.bounds.width > xMax) {
                    xMax = mapItemGroup.bounds.x + mapItemGroup.bounds.width;
                }
                if (isNaN(yMin) || mapItemGroup.bounds.y < yMin) {
                    yMin = mapItemGroup.bounds.y;
                }
                if (isNaN(yMax) || mapItemGroup.bounds.y + mapItemGroup.bounds.height > yMax) {
                    yMax = mapItemGroup.bounds.y + mapItemGroup.bounds.height;
                }
            }
        }
        return { x: xMin - 5, y: yMin - 5, width: xMax - xMin + 10, height: yMax - yMin + 10 };
    }
}
