
import { KitDependencyManager } from "../../ui-kit.js";
import { DbManager, Map, MapWorkerInputMessageType, MapWorkerOutputMessageType } from "../references.js";

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

    static postWorkerMessage(message) {
        if (MapWorkerClient.#mapWorker) {
            MapWorkerClient.#mapWorker.postMessage(message);
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
        if (message?.data?.messageType === MapWorkerOutputMessageType.MapUpdated && MapWorkerClient.mapChangeListener) {
            const mapData = await DbManager.getMap();
            MapWorkerClient.#map = mapData ? new Map(mapData) : null;
            await MapWorkerClient.mapChangeListener(message.data);
        }
    }

    // helpers
    static #documentEventHandlersAdded = false;
    static #addDocumentEventHandlers(appDocument) {
        if (!MapWorkerClient.#documentEventHandlersAdded) {
            MapWorkerClient.#addDocumentEventHandler(appDocument, "keyup");
            MapWorkerClient.#documentEventHandlersAdded = true;
        }
    }

    static #addCanvasEventHandlers(canvas) {
        MapWorkerClient.#addCanvasEventHandler(canvas, "pointerdown");
        MapWorkerClient.#addCanvasEventHandler(canvas, "pointermove");
        MapWorkerClient.#addCanvasEventHandler(canvas, "pointerup");
    }

    static #addDocumentEventHandler(appDocument, eventType) {
        appDocument.addEventListener(eventType, async (event) => await MapWorkerClient.#clientEventHandler(eventType, event));
    }

    static #addCanvasEventHandler(canvas, eventType) {
        canvas.addEventListener(eventType, async (event) => await MapWorkerClient.#clientEventHandler(eventType, event));
    }

    static async #clientEventHandler(eventType, event) {
        try {
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
}