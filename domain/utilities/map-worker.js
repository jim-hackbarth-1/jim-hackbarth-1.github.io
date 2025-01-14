
import {
    Arc,
    Change,
    ChangeType,
    DbManager,
    EntityReference,
    GeometryUtilities,
    Map,
    MapItemGroup,
    Overlay,
    Path,
    SelectionUtilities
} from "../references.js";

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
    ClientEvent: "ClientEvent",
    CursorChanged: "CursorChanged"
};

export const MapWorkerOutputMessageType = {
    DebugInfo: "DebugInfo",
    Error: "Error",
    MapUpdated: "MapUpdated",
    ChangeCursor: "ChangeCursor"
}

onmessage = (message) => {
    MapWorker.instance.handleClientMessage(message);
};

export class MapWorker {

    // properties
    static #instance;
    static get instance() {
        if (!MapWorker.#instance) {
            MapWorker.#instance = new MapWorker();
        }
        return MapWorker.#instance;
    }

    #messagePort;
    get messagePort() {
        return this.#messagePort;
    }

    #canvas;
    get canvas() {
        return this.#canvas;
    }

    #baseUrl;
    get baseUrl() {
        return this.#baseUrl;
    }

    #map;
    get map() {
        return this.#map;
    }

    #renderingContext;
    get renderingContext() {
        return this.#renderingContext;
    }

    #activeTool;
    get activeTool() {
        return this.#activeTool;
    }

    #activeToolModel;
    get activeToolModel() {
        return this.#activeToolModel;
    }

    #activeMapItemTemplate;
    get activeMapItemTemplate() {
        return this.#activeMapItemTemplate;
    }

    #geometryUtilities;
    get geometryUtilities() {
        if (!this.#geometryUtilities) {
            this.#geometryUtilities = new GeometryUtilities();
        }
        return this.#geometryUtilities;
    }

    // methods
    async handleClientMessage(message) {
        try {
            const messageType = message?.data?.messageType;
            switch (messageType) {
                case MapWorkerInputMessageType.Initialize:
                    await this.#initialize(message.ports, message.data.canvas, message.data.baseUrl);
                    break;
                case MapWorkerInputMessageType.LoadMap:
                    await this.#loadMap();
                    break;
                case MapWorkerInputMessageType.UpdateMap:
                    await this.#updateMap(message.data.change);
                    break;
                case MapWorkerInputMessageType.SetActiveTool:
                    await this.#setActiveTool(message.data.toolRefData);
                    break;
                case MapWorkerInputMessageType.SetActiveMapItemTemplate:
                    await this.#setActiveMapItemTemplate(message.data.mapItemTemplateRefData);
                    break;
                case MapWorkerInputMessageType.ClientEvent:
                    await this.#clientEvent(message.data.eventType, message.data.eventData);
                    break;
                case MapWorkerInputMessageType.CursorChanged:
                    await this.#cursorChanged(message.data.cursor);
                    break;
                default:
                    throw new Error(`Unexpected worker request type: ${messageType ?? "(null)"}`);
            }
        }
        catch (error) {
            this.#handleError(error, { messageData: message?.data });
        }
    }

    postMessage(message) {
        if (this.messagePort) {
            this.messagePort.postMessage(message);
        }
    }

    handleMapChange = async (change) => {
        if (this.map) {
            await DbManager.setMap(this.map.getData());
            const message = { messageType: MapWorkerOutputMessageType.MapUpdated, data: { hasUnsavedChanges: this.map.hasUnsavedChanges, change: change.getData() } };
            this.postMessage(message);
        }
    }

    createMapItemGroup(data) {
        return new MapItemGroup(data);
    }

    createPath(data) {
        return new Path(data);
    }

    rotateArc(arc, angleRadians) {
        return Arc.rotateArc(arc, angleRadians);
    }

    resizeArc(arc, scaleX, scaleY, resizeDirection) {
        return Arc.resizeArc(arc, scaleX, scaleY, resizeDirection);
    }

    createChange(data) {
        return new Change(data);
    }

    createSelectionUtilities() {
        return new SelectionUtilities();
    }

    renderMap(options) {
        if (this.canvas && this.renderingContext && this.map) {
            this.map.render(this.canvas, this.renderingContext, options);
        }
    }

    // helpers
    async #initialize(ports, canvas, baseUrl) {
        this.#messagePort = ports[0];
        this.#canvas = canvas;
        this.#renderingContext = this.canvas.getContext("2d");
        this.renderingContext.save();
        this.#baseUrl = baseUrl;
        await this.#loadMap();
    }

    async #loadMap() {
        const mapData = await DbManager.getMap();
        this.#map = mapData ? new Map(mapData) : null;
        this.#activeTool = null;
        this.#activeToolModel = null;
        this.#activeMapItemTemplate = null;
        if (this.canvas && this.renderingContext) {
            if (this.map) {
                this.map.addEventListener(Change.ChangeEvent, this.handleMapChange);
                this.map.render(this.canvas, this.renderingContext, { updatedViewPort: true });
            }
            else {
                this.renderingContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }
    }

    async #updateMap(change) {
        const changeObjectType = change?.changeObjectType;
        let updatedViewPort = false;
        switch (changeObjectType) {
            case Map.name:
                if (change?.changeData && change?.changeType === ChangeType.Edit) {
                    this.map.startChange();
                    for (const changeItem of change.changeData) {
                        if (changeItem.propertyName == "overlay") {
                            this.map[changeItem.propertyName] = new Overlay(changeItem.newValue);
                        }
                        else {
                            this.map[changeItem.propertyName] = changeItem.newValue;
                            if (changeItem.propertyName == "zoom" || changeItem.propertyName == "pan") {
                                updatedViewPort = true;
                            }
                        } 
                    }
                    this.map.completeChange(new Change(change));
                }
                break;
            default:
                throw new Error(`Unexpected worker request type: ${messageType ?? "(null)"}`);
        }
        this.renderMap({ updatedViewPort: updatedViewPort });
    }

    async #setActiveTool(toolRefData) {
        this.#activeTool = null;
        this.#activeToolModel = null;
        if (toolRefData && this.map) {
            const toolRef = new EntityReference(toolRefData);
            const tool = this.map.tools.find(t => EntityReference.areEqual(t.ref, toolRef));
            const toolModule = await import(tool.moduleSrc);
            this.#activeTool = tool;
            this.#activeToolModel = toolModule.createToolModel();
            if (this.activeToolModel && this.activeToolModel.onActivate) {
                return await this.activeToolModel.onActivate(this);
            }
        }
    }

    async #setActiveMapItemTemplate(mapItemTemplateRefData) {
        this.#activeMapItemTemplate = null;
        if (mapItemTemplateRefData && this.map) {
            const mapItemTemplateRef = new EntityReference(mapItemTemplateRefData);
            const mapItemTemplate = this.map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, mapItemTemplateRef));
            this.#activeMapItemTemplate = mapItemTemplate;
            if (this.activeToolModel && this.activeToolModel.onMapItemTemplateActivated) {
                return await this.activeToolModel.onMapItemTemplateActivated();
            }
        }
    }

    async #clientEvent(eventType, eventData) {
        if (eventType === "wheel" && eventData.altKey) {
            if (this.map) {
                this.#incrementZoom(eventData);
            }
        }
        else {
            if (this.activeToolModel && this.activeToolModel.handleClientEvent) {
                await this.activeToolModel.handleClientEvent({
                    eventType: eventType,
                    eventData: eventData
                });
            }
        }
    }
    
    #wheelTimeout = undefined;
    #wheelStartZoom;
    #incrementZoom(eventData) {

        // calculate zoom
        let zoom = Number(this.map.zoom);
        if (eventData.deltaY < 0) {
            zoom += 0.01;
        }
        else {
            //console.log("here");
            zoom -= 0.01;
        }
        zoom = zoom.toFixed(2);
        if (zoom < 0.25) {
            zoom = 0.25;
        }
        if (zoom > 4) {
            zoom = 4;
        }
        //console.log(`this.map.zoom: ${this.map.zoom}, zoom: ${zoom}`);
        if (this.map.zoom == zoom) {
            return;
        }

        // start wheel change
        if (this.#wheelTimeout === undefined) {
            this.map.startChange();
            this.#wheelStartZoom = this.map.zoom;
        }

        // update map
        this.map.zoom = zoom;
        this.renderMap({ updatedViewPort: true });

        // record change at wheel end
        clearTimeout(this.#wheelTimeout);
        this.#wheelTimeout = setTimeout(() => {
            if (this.#wheelTimeout) {
                const change = new Change({
                    changeObjectType: Map.name,
                    changeObjectRef: this.map.ref,
                    changeType: ChangeType.Edit,
                    changeData: [
                        {
                            propertyName: "zoom",
                            oldValue: this.#wheelStartZoom,
                            newValue: this.map.zoom
                        }
                    ]
                });
                //console.log(change);
                this.map.completeChange(change);
                this.#wheelTimeout = undefined;
            }
            
        }, 500);
    }

    async #cursorChanged(cursor) {
        if (this.activeToolModel && this.activeToolModel.onCursorChange) {
            return await this.activeToolModel.onCursorChange(cursor);
        }
    }

    #handleError(error, data) {
        try {
            this.postMessage({
                messageType: MapWorkerOutputMessageType.Error,
                error: `Uncaught error: ${error.message}\n ${error.stack}\n ${JSON.stringify(data, null, 2)}`
            });
        }
        catch { }
    }
}
