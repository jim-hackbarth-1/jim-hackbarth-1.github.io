
import {
    Arc,
    BooleanToolOption,
    Change,
    ChangeSet,
    ChangeType,
    DbManager,
    EntityReference,
    GeometryUtilities,
    Layer,
    Map,
    MapItemGroup,
    Path,
    SelectionUtilities,
    SetUtilities,
    SharedToolOptions,
    StatesToolOption,
    ToolOption,
    ToolType
} from "../references.js";

/**
 * @readonly
 * @enum {string}
 */
export const MapWorkerInputMessageType = {
    Initialize: "Initialize",
    LoadMap: "LoadMap",
    UpdateMap: "UpdateMap", // save happened, set layer, set zoom, set overlay, ...
    SetActiveTool: "SetActiveTool",
    SetActiveMapItemTemplate: "SetActiveMapItemTemplate",
    ClientEvent: "ClientEvent",
    CursorChanged: "CursorChanged",
    SelectAllInView: "SelectAllInView",
    UnSelectAll: "UnSelectAll",
    Undo: "Undo",
    Redo: "Redo",
    DeleteSelected: "DeleteSelected",
    ApplyToolOption: "ApplyToolOption"
};

export const MapWorkerOutputMessageType = {
    DebugInfo: "DebugInfo",
    Error: "Error",
    MapUpdated: "MapUpdated",
    ChangeCursor: "ChangeCursor",
    ChangeToolOptions: "ChangeToolOptions"
}

onmessage = async (message) => {
    await MapWorker.instance.handleClientMessage(message);
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

    #setUtilities;
    get setUtilities() {
        if (!this.#setUtilities) {
            this.#setUtilities = new SetUtilities();
        }
        return this.#setUtilities;
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
                    await this.#updateMap(message.data.changeSet);
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
                case MapWorkerInputMessageType.SelectAllInView:
                    await this.#selectAllInView();
                    break;
                case MapWorkerInputMessageType.UnSelectAll:
                    await this.#unSelectAll();
                    break;
                case MapWorkerInputMessageType.Undo:
                    await this.#undo();
                    break;
                case MapWorkerInputMessageType.Redo:
                    await this.#redo();
                    break;
                case MapWorkerInputMessageType.DeleteSelected:
                    await this.#deleteSelected();
                    break;
                case MapWorkerInputMessageType.ApplyToolOption:
                    await this.#applyToolOption(message.data.toolOptionInfo);
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

    handleMapChange = async (changeSet) => {
        if (this.map) {
            await DbManager.setMap(this.map.getData());
            const message = { messageType: MapWorkerOutputMessageType.MapUpdated, data: { hasUnsavedChanges: this.map.hasUnsavedChanges, changeSet: changeSet.getData() } };
            this.postMessage(message);
        }
    }

    createMapItemGroup(data) {
        return new MapItemGroup(data);
    }

    createPath(data) {
        return new Path(data);
    }

    createArc(data) {
        return new Arc(data);
    }

    rotateArc(arc, angleRadians) {
        return Arc.rotateArc(arc, angleRadians);
    }

    resizeArc(arc, scaleX, scaleY) {
        return Arc.resizeArc(arc, scaleX, scaleY);
    }

    createChangeSet(changes) {
        return new ChangeSet({ changes: changes });
    }

    createSelectionUtilities() {
        return new SelectionUtilities();
    }

    async renderMap(options) {
        if (this.canvas && this.renderingContext && this.map) {
            await this.map.render(this.canvas, this.renderingContext, options);
        }
    }
    
    initializeToolOptions(toolOptionNames) {
        const toolOptions = this.#getToolOptions();
        for (const toolOption of toolOptions) {
            toolOption.isVisible = toolOptionNames.includes(toolOption.name);
        }
        this.#toolOptions = toolOptions;
        this.postChangeToolOptionsMessage();
    }

    getToolOption(toolOptionName) {
        const toolOptions = this.#getToolOptions();
        return toolOptions.find(toolOption => toolOption.name == toolOptionName);
    }

    setToolOptionValue(name, value) {
        const toolOptions = this.#getToolOptions();
        const toolOption = toolOptions.find(option => option.name == name);
        if (toolOption?.typeName == "StatesToolOption") {
            toolOption.currentStateName = value;
        }
        if (toolOption?.typeName == "BooleanToolOption") {
            toolOption.isToggledOn = value;
        }
        this.postChangeToolOptionsMessage();
    }

    addToolOption(toolOptionData) {
        let toolOption = null;
        switch (toolOptionData.typeName) {
            case "StatesToolOption":
                toolOption = new StatesToolOption(toolOptionData);
                break;
            case "BooleanToolOption":
                toolOption = new BooleanToolOption(toolOptionData);
                break;
            default:
                toolOption = new ToolOption(toolOptionData);
                break;
        }
        const toolOptions = this.#getToolOptions();
        toolOptions.push(toolOption);
        this.#toolOptions = toolOptions;
    }

    postChangeToolOptionsMessage() {
        const toolOptionsData = [];
        const currentToolOptions = this.#getToolOptions();
        for (const option of currentToolOptions) {
            toolOptionsData.push(option.getData());
        }
        this.postMessage({ messageType: MapWorkerOutputMessageType.ChangeToolOptions, data: { toolOptions: toolOptionsData } });
    }

    getMapItemTemplate(mapItem) {
        if (this.map) {
            return this.map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, mapItem.mapItemTemplateRef));
        }
        return null;
    }

    printMessage(message, start) {
        const scale = 1 / this.map.zoom;
        const translation = { x: -this.map.pan.x, y: -this.map.pan.y };
        const fontSize = 12 * scale;
        this.renderingContext.font = `${fontSize}px sans-serif`;
        const bounds = this.renderingContext.measureText(message);
        const padding = 10 * scale;
        let width = bounds.width + padding;
        const minWidth = 100 * scale;
        if (width < minWidth) {
            width = minWidth;
        }
        const height = bounds.actualBoundingBoxAscent + bounds.actualBoundingBoxDescent + padding;
        const rectStart = this.geometryUtilities.transformPoint(start, scale, translation);
        const rect = new Path2D(`M ${rectStart.x},${rectStart.y} l ${width},0 0,${height} ${-(width)},0 z`);
        this.renderingContext.lineWidth = 2 * scale;
        this.renderingContext.fillStyle = "white";
        this.renderingContext.globalAlpha = 1;
        this.renderingContext.fill(rect);
        this.renderingContext.strokeStyle = "dimgray";
        this.renderingContext.setLineDash([]);
        this.renderingContext.stroke(rect);
        let textStart = { x: start.x + 5*scale, y: start.y + 15*scale };
        textStart = this.geometryUtilities.transformPoint(textStart, scale, translation);
        this.renderingContext.fillStyle = "dimgray";
        this.renderingContext.fillText(message, textStart.x, textStart.y);
    }

    strokeDrawingPath(path, scale) {
        if (!scale) {
            scale = 1;
        }
        this.renderingContext.strokeStyle = "dimgray";
        this.renderingContext.lineWidth = 3 * scale;
        this.renderingContext.stroke(path);
        this.renderingContext.strokeStyle = "white";
        this.renderingContext.lineWidth = 2 * scale;
        this.renderingContext.stroke(path);
        this.renderingContext.setLineDash([5 * scale, 5 * scale]);
        this.renderingContext.strokeStyle = "royalblue";
        this.renderingContext.stroke(path);
        this.renderingContext.setLineDash([]);
    }

    strokeSelectionPath(path, scale) {
        if (!scale) {
            scale = 1;
        }
        this.renderingContext.strokeStyle = "dimgray";
        this.renderingContext.lineWidth = 3 * scale;
        this.renderingContext.stroke(path);
        this.renderingContext.strokeStyle = "white";
        this.renderingContext.lineWidth = 2 * scale;
        this.renderingContext.stroke(path);
        this.renderingContext.setLineDash([5 * scale, 5 * scale]);
        this.renderingContext.strokeStyle = "orange";
        this.renderingContext.stroke(path);
        this.renderingContext.setLineDash([]);
    }

    strokeClipPath(path, scale) {
        if (!scale) {
            scale = 1;
        }
        this.renderingContext.strokeStyle = "dimgray";
        this.renderingContext.lineWidth = 3 * scale;
        this.renderingContext.stroke(path);
        this.renderingContext.strokeStyle = "white";
        this.renderingContext.lineWidth = 2 * scale;
        this.renderingContext.stroke(path);
        this.renderingContext.setLineDash([5 * scale, 5 * scale]);
        this.renderingContext.strokeStyle = "darkred";
        this.renderingContext.stroke(path);
        this.renderingContext.setLineDash([]);
    }

    strokeGuidePath(path, scale) {
        if (!scale) {
            scale = 1;
        }
        this.renderingContext.strokeStyle = "black";
        this.renderingContext.lineWidth = 2 * scale;
        this.renderingContext.stroke(path);
        this.renderingContext.strokeStyle = "white";
        this.renderingContext.setLineDash([3 * scale, 3 * scale]);
        this.renderingContext.stroke(path);
        this.renderingContext.setLineDash([]);
    }

    // helpers
    async #initialize(ports, canvas, baseUrl) {
        this.#messagePort = ports[0];
        this.#canvas = canvas;
        this.#renderingContext = this.canvas.getContext("2d");
        this.#baseUrl = baseUrl;
        await this.#loadMap();
        this.initializeToolOptions([]);
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
                await this.map.render(this.canvas, this.renderingContext, { updatedViewPort: true });
            }
            else {
                this.renderingContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }      
    }

    async #updateMap(changeSet) {
        this.map.applyChangeSet(new ChangeSet(changeSet));
        await this.renderMap({ updatedViewPort: true });
    }

    async #selectAllInView() {
        const bounds = {
            x: -this.map.pan.x,
            y: -this.map.pan.y,
            width: this.canvas.width / this.map.zoom,
            height: this.canvas.height / this.map.zoom
        }
        const path = {
            start: {x: bounds.x, y:bounds.y},
            transits: [
                { x: bounds.width, y: 0 },
                { x: 0, y: bounds.height },
                { x: -bounds.width, y: 0 }
            ]
        };
        const layer = this.map.getActiveLayer();
        const oldSelections = layer.mapItemGroups
            .filter(mig => mig.selectionStatus)
            .map(mig => ({ mapItemGroupId: mig.id, selectionStatus: mig.selectionStatus }));
        this.map.startChangeSet();
        layer.selectByPath(this.geometryUtilities, bounds, path, false, false);
        const newSelections = layer.mapItemGroups
            .filter(mig => mig.selectionStatus)
            .map(mig => ({ mapItemGroupId: mig.id, selectionStatus: mig.selectionStatus }));
        const selectionUtilities = this.createSelectionUtilities();
        const changeSet = selectionUtilities.getSelectionChangeSet(this, layer.name, oldSelections, newSelections);
        this.map.completeChangeSet(changeSet);
        await this.renderMap();
    }

    async #unSelectAll() {
        const layer = this.map.getActiveLayer();
        const oldSelections = layer.mapItemGroups
            .filter(mig => mig.selectionStatus)
            .map(mig => ({ mapItemGroupId: mig.id, selectionStatus: mig.selectionStatus }));
        this.map.startChangeSet();
        layer.selectByPoints(this.renderingContext, this.map, [], false);
        const newSelections = layer.mapItemGroups
            .filter(mig => mig.selectionStatus)
            .map(mig => ({ mapItemGroupId: mig.id, selectionStatus: mig.selectionStatus }));
        const selectionUtilities = this.createSelectionUtilities();
        const changeSet = selectionUtilities.getSelectionChangeSet(this, layer.name, oldSelections, newSelections);
        this.map.completeChangeSet(changeSet);
        await this.renderMap();
    }

    async #undo() {
        this.map.undo();
        await this.renderMap({ updatedViewPort: true });
    }

    async #redo() {
        this.map.redo();
        await this.renderMap({ updatedViewPort: true });
    }

    async #deleteSelected() {
        const layer = this.map.getActiveLayer();
        this.map.startChangeSet();
        const changes = [];
        const mapItemGroupsToRemove = []
        for (let i = 0; i < layer.mapItemGroups.length; i++) {
            const mapItemGroup = layer.mapItemGroups[i];
            if (mapItemGroup.selectionStatus) {
                changes.push({
                    changeType: ChangeType.Delete,
                    changeObjectType: Layer.name,
                    propertyName: "mapItemGroups",
                    itemIndex: i,
                    itemValue: mapItemGroup.getData(),
                    layerName: layer.name
                })
                mapItemGroupsToRemove.push(mapItemGroup);
            }
        }
        for (const mapItemGroup of mapItemGroupsToRemove) {
            layer.removeMapItemGroup(mapItemGroup);
        }
        const changeSet = this.createChangeSet(changes);
        this.map.completeChangeSet(changeSet);
        await this.renderMap();
    }

    async #setActiveTool(toolRefData) {
        this.#activeTool = null;
        this.initializeToolOptions([]);
        if (this.#activeToolModel && this.map) {
            if (this.#activeToolModel.handleMapChange) {
                this.map.removeEventListener("ChangeEvent", this.#activeToolModel.handleMapChange);
            }
            if (this.#activeToolModel.handleAfterRenderEvent) {
                this.map.removeEventListener("AfterRenderEvent", this.#activeToolModel.handleAfterRenderEvent);
            }
        }
        this.#activeToolModel = null;
        if (toolRefData && this.map) {
            const toolRef = new EntityReference(toolRefData);
            const tool = this.map.tools.find(t => EntityReference.areEqual(t.ref, toolRef));
            let moduleSrc = tool.moduleSrc;
            if (moduleSrc.startsWith("data-")) {
                moduleSrc = `data:text/javascript;base64,${moduleSrc.substring(5) }`;
            }
            const toolModule = await import(moduleSrc);
            this.#activeTool = tool;
            this.#activeToolModel = toolModule.createToolModel();
            if (this.activeToolModel && this.activeToolModel.onActivate) {
                await this.activeToolModel.onActivate(this);
                await this.renderMap();
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
                await this.activeToolModel.onMapItemTemplateActivated();
            }
            await this.renderMap();
        }
    }

    async #clientEvent(eventType, eventData) {
        if (eventType === "wheel" && eventData.altKey) {
            if (this.map) {
                await this.#incrementZoom(eventData);
            }
        }
        else {
            if (this.activeToolModel && this.activeToolModel.handleClientEvent) {
                const scale = 1 / this.map.zoom;
                if (eventType == "pointermove" && eventData) {
                    const point = this.#transformCanvasPoint(eventData.offsetX, eventData.offsetY);
                    this.printMessage(`x: ${point.x}, y: ${point.y}`, { x: 5 * scale, y: 5 * scale });
                }
                if (eventType == "pointerdown" && this.activeTool?.toolType == ToolType.DrawingTool && !this.activeMapItemTemplate) {
                    this.printMessage("Map item template selection required.", { x: 5 * scale, y: 36 * scale });
                }
                await this.activeToolModel.handleClientEvent({
                    eventType: eventType,
                    eventData: eventData
                });
            }
        }
    }

    #wheelTimeout = undefined;
    #wheelStartZoom;
    async #incrementZoom(eventData) {

        // calculate zoom
        let zoom = Number(this.map.zoom);
        if (eventData.deltaY < 0) {
            zoom += 0.01;
        }
        else {
            zoom -= 0.01;
        }
        zoom = zoom.toFixed(2);
        if (zoom < 0.25) {
            zoom = 0.25;
        }
        if (zoom > 4) {
            zoom = 4;
        }
        if (this.map.zoom == zoom) {
            return;
        }

        // start wheel change
        if (this.#wheelTimeout === undefined) {
            this.map.startChangeSet();
            this.#wheelStartZoom = this.map.zoom;
        }

        // update map
        this.map.zoom = zoom;
        await this.renderMap({ updatedViewPort: true });

        // record change at wheel end
        clearTimeout(this.#wheelTimeout);
        this.#wheelTimeout = setTimeout(async () => {
            if (this.#wheelTimeout) {
                const changeData = {
                    changeType: ChangeType.Edit,
                    changeObjectType: Map.name,
                    propertyName: "zoom",
                    oldValue: this.#wheelStartZoom,
                    newValue: this.map.zoom
                };
                const changeSet = new ChangeSet({ changes: [changeData] });
                this.map.completeChangeSet(changeSet);
                this.#wheelTimeout = undefined;
                await this.renderMap();
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

    #toolOptions;
    #getToolOptions() {
        if (!this.#toolOptions) {
            this.#toolOptions = SharedToolOptions.getAll();
        }
        return this.#toolOptions;
    }

    async #applyToolOption(toolOptionInfo) {
        this.setToolOptionValue(toolOptionInfo.name, toolOptionInfo.value);
        if (this.activeToolModel && this.activeToolModel.onApplyToolOption) {
            await this.activeToolModel.onApplyToolOption(toolOptionInfo);
        }
    }

    #transformCanvasPoint(x, y) {
        let point = { x: x, y: y };
        if (this.map) {
            const scale = { x: 1 / this.map.zoom, y: 1 / this.map.zoom };
            const translation = { x: -this.map.pan.x, y: -this.map.pan.y };
            point = this.geometryUtilities.transformPoint({ x: x, y: y }, scale, translation);
            point = { x: Math.round(point.x), y: Math.round(point.y) };
        }
        return point;
    }
}
