
import {
    Change,
    ChangeType,
    EntityReference,
    ErrorMessage,
    getOverlandTemplate,
    Layer,
    MapItemTemplate,
    Overlay,
    Tool,
    ToolPalette
} from "../references.js";

export class BuiltInTemplates {

    static #templates = null;

    static getTemplates() {
        if (!BuiltInTemplates.#templates) {
            BuiltInTemplates.#templates = [];
            BuiltInTemplates.#templates.push(getOverlandTemplate())
        }
        return BuiltInTemplates.#templates;
    }

    static getTemplate(templateRef) {
        return BuiltInTemplates.getTemplates().find(t => EntityReference.areEqual(t.ref, templateRef));
    }
}

export class Map {

    // constructor
    constructor(data) {
        this.#ref = new EntityReference(data?.ref);
        if (data?.templateRef) {
            this.#templateRef = new EntityReference(data.templateRef);
        }
        this.#thumbnailSrc = data?.thumbnailSrc;
        this.#layers = [];
        if (data?.layers) {
            for (const layerData of data.layers) {
                const layer = new Layer(layerData);
                this.#layers.push(layer);
                this.#addChangeEventListeners(layer);
            }
        }
        this.#activeLayer = data?.activeLayer;
        this.#mapItemTemplateRefs = this.#getRefs(data?.mapItemTemplateRefs);     
        this.#mapItemTemplates = [];
        if (data?.mapItemTemplates) {
            for (const mapItemTemplateData of data.mapItemTemplates) {
                const mapItemTemplate = new MapItemTemplate(mapItemTemplateData);
                this.#mapItemTemplates.push(mapItemTemplate);
                this.#addChangeEventListeners(mapItemTemplate);
            }
        }
        this.#toolRefs = this.#getRefs(data?.toolRefs);
        this.#tools = [];
        if (data?.tools) {
            for (const toolData of data.tools) {
                const tool = new Tool(toolData);
                this.#tools.push(tool);
                this.#addChangeEventListeners(tool);
            }
        }
        this.#toolPalette = new ToolPalette(data?.toolPalette);
        this.#addChangeEventListeners(this.#toolPalette);
        this.#pan = data?.pan;
        this.#zoom = data?.zoom;
        this.#hasUnsavedChanges = data?.hasUnsavedChanges;
        this.#overlay = new Overlay(data?.overlay);
        this.#eventListeners = {}; 
    }

    // properties
    /** @type {EntityReference}  */
    #ref;
    get ref() {
        return this.#ref;
    }

    /** @type {EntityReference}  */
    #templateRef;
    get templateRef() {
        return this.#templateRef;
    }

    /** @type {string}  */
    #thumbnailSrc;
    get thumbnailSrc() {
        return this.#thumbnailSrc;
    }
    set thumbnailSrc(thumbnailSrc) {
        const change = this.#getPropertyChange("thumbnailSrc", this.#thumbnailSrc, thumbnailSrc);
        this.#thumbnailSrc = thumbnailSrc;
        this.#onChange(change);
    }

    /** @type {Layer[]}  */
    #layers;
    get layers() {
        return this.#layers;
    }
    set layers(layers) {
        this.#validateUniqueLayerNames(layers);
        if (this.#layers) {
            for (const layer of this.#layers) {
                this.#removeChangeEventListeners(layer);
            }
        }
        this.#layers = layers ?? [];
        for (const layer of this.#layers) {
            this.#addChangeEventListeners(layer);
        }
        const change = this.#getPropertyChange("layers", this.#layers, layers);
        this.#layers = layers;
        this.#onChange(change);
    }

    /** @type {string}  */
    #activeLayer;
    get activeLayer() {
        return this.#activeLayer;
    }
    set activeLayer(activeLayer) {
        const change = this.#getPropertyChange("activeLayer", this.#activeLayer, activeLayer);
        this.#activeLayer = activeLayer;
        this.#onChange(change);
    }

    /** @type {EntityReference[]}  */
    #mapItemTemplateRefs;
    get mapItemTemplateRefs() {
        return this.#mapItemTemplateRefs;
    }
    set mapItemTemplateRefs(mapItemTemplateRefs) {
        const change = this.#getPropertyChange("mapItemTemplateRefs", this.#mapItemTemplateRefs, mapItemTemplateRefs);
        this.#mapItemTemplateRefs = mapItemTemplateRefs;
        this.#onChange(change);
    }

    /** @type {MapItemTemplate[]}  */
    #mapItemTemplates;
    get mapItemTemplates() {
        return this.#mapItemTemplates;
    }
    set mapItemTemplates(mapItemTemplates) {
        if (this.#mapItemTemplates) {
            for (const mapItemTemplate of this.#mapItemTemplates) {
                this.#removeChangeEventListeners(mapItemTemplate);
            }
        }
        const change = this.#getPropertyChange("mapItemTemplates", this.#mapItemTemplates, mapItemTemplates);
        this.#mapItemTemplates = mapItemTemplates ?? [];
        for (const mapItemTemplate of this.#mapItemTemplates) {
            this.#addChangeEventListeners(mapItemTemplate);
        }
        this.#onChange(change);
    }

    /** @type {EntityReference[]}  */
    #toolRefs = [];
    get toolRefs() {
        return this.#toolRefs;
    }
    set toolRefs(toolRefs) {
        const change = this.#getPropertyChange("toolRefs", this.#toolRefs, toolRefs);
        this.#toolRefs = toolRefs;
        this.#onChange(change);
    }

    /** @type {Tool[]}  */
    #tools;
    get tools() {
        return this.#tools;
    }
    set tools(tools) {
        if (this.#tools) {
            for (const tool of this.#tools) {
                this.#removeChangeEventListeners(tool);
            }
        }
        const change = this.#getPropertyChange("tools", this.#tools, tools);
        this.#tools = tools ?? [];
        for (const tool of this.#tools) {
            this.#addChangeEventListeners(tool);
        }
        this.#onChange(change);
    }

    /** @type {ToolPalette}  */
    #toolPalette;
    get toolPalette() {
        return this.#toolPalette;
    }
    set toolPalette(toolPalette) {
        const change = this.#getPropertyChange("toolPalette", this.#toolPalette, toolPalette);
        this.#toolPalette = toolPalette;
        this.#addChangeEventListeners(this.#toolPalette);
        this.#onChange(change);
    }

    /** @type {{x: number, y: number}} */
    #pan;
    get pan() {
        return this.#pan ?? { x: 0, y: 0 };
    }
    set pan(pan) {
        const change = this.#getPropertyChange("pan", this.#pan, pan);
        this.#pan = pan;
        this.#onChange(change);
    }

    /** @type {number} */
    #zoom;
    get zoom() {
        return this.#zoom ?? 1;
    }
    set zoom(zoom) {
        const change = this.#getPropertyChange("zoom", this.#zoom, zoom);
        this.#zoom = zoom;
        this.#onChange(change);
    }

    /** @type {boolean}  */
    #hasUnsavedChanges;
    get hasUnsavedChanges() {
        return this.#hasUnsavedChanges;
    }
    set hasUnsavedChanges(hasUnsavedChanges) {
        this.#hasUnsavedChanges = hasUnsavedChanges;
    }

    /** @type {{x: number, y: number, width: number, height: number}}  */
    #currentViewPort;
    get currentViewPort() {
        return this.#currentViewPort ?? { x: 0, y: 0, width: 0, height: 0 };
    }

    /** @type {Overlay} */
    #overlay;
    get overlay() {
        return this.#overlay ?? new Overlay();
    }
    set overlay(overlay) {
        const change = this.#getPropertyChange("overlay", this.#overlay, overlay);
        this.#overlay = overlay;
        this.#onChange(change);
    }

    // methods
    static cleanseData(data, inputUtilities, domParser, domSerializer) {
        if (!data) {
            return null;
        }
        const layers = [];
        if (data.layers) {
            for (const layer of data.layers) {
                layers.push(Layer.cleanseData(layer, inputUtilities));
            }
        }
        const mapItemTemplateRefs = [];
        if (data.mapItemTemplateRefs) {
            for (const mapItemTemplateRef of data.mapItemTemplateRefs) {
                mapItemTemplateRefs.push(EntityReference.cleanseData(mapItemTemplateRef, inputUtilities));
            }
        }
        const mapItemTemplates = [];
        if (data.mapItemTemplates) {
            for (const mapItemTemplate of data.mapItemTemplates) {
                mapItemTemplates.push(MapItemTemplate.cleanseData(mapItemTemplate, inputUtilities, domParser, domSerializer));
            }
        }
        const toolRefs = [];
        if (data.toolRefs) {
            for (const toolRef of data.toolRefs) {
                toolRefs.push(EntityReference.cleanseData(toolRef, inputUtilities));
            }
        }
        const tools = [];
        if (data.tools) {
            for (const tool of data.tools) {
                tools.push(Tool.cleanseData(tool, inputUtilities, domParser, domSerializer));
            }
        }
        return {
            ref: EntityReference.cleanseData(data.ref, inputUtilities),
            templateRef: EntityReference.cleanseData(data.templateRef, inputUtilities),
            thumbnailSrc: inputUtilities.cleanseSvg(data.thumbnailSrc, inputUtilities, domParser, domSerializer),
            layers: layers,
            activeLayer: inputUtilities.cleanseString(data.activeLayer),
            mapItemTemplateRefs: mapItemTemplateRefs,
            mapItemTemplates: mapItemTemplates,
            toolRefs: toolRefs,
            tools: tools,
            toolPalette: ToolPalette.cleanseData(data.toolPalette, inputUtilities),
            pan: inputUtilities.cleansePoint(data.pan),
            zoom: inputUtilities.cleanseNumber(data.zoom),
            hasUnsavedChanges: inputUtilities.cleanseBoolean(data.hasUnsavedChanges),
            overlay: Overlay.cleanseData(data.overlay, inputUtilities)
        }
    }

    getData() {
        const layers = [];
        for (const layer of this.#layers) {
            layers.push(layer.getData());
        }
        const mapItemTemplates = [];
        for (const mapItemTemplate of this.#mapItemTemplates) {
            mapItemTemplates.push(mapItemTemplate.getData());
        }
        const tools = [];
        for (const tool of this.#tools) {
            tools.push(tool.getData());
        }
        return {
            ref: this.#ref ? this.#ref.getData() : null,
            templateRef: this.#templateRef ? this.#templateRef.getData() : null,
            thumbnailSrc: this.#thumbnailSrc,
            layers: layers,
            activeLayer: this.#activeLayer,
            mapItemTemplateRefs: this.#getRefsData(this.#mapItemTemplateRefs),
            mapItemTemplates: mapItemTemplates,
            toolRefs: this.#getRefsData(this.#toolRefs),
            tools: tools,
            toolPalette: this.#toolPalette ? this.#toolPalette.getData() : null,
            pan: this.#pan,
            zoom: this.#zoom,
            hasUnsavedChanges: this.#hasUnsavedChanges,
            overlay: this.#overlay ? this.#overlay.getData() : null
        };
    }

    addEventListener(eventName, listener) {
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
        this.#eventListeners[eventName].push(listener);
    }

    removeEventListener(eventName, listener) {
        const index = this.#eventListeners[eventName].findIndex(l => l === listener);
        if (index > -1) {
            this.#eventListeners[eventName].splice(index, 1);
        }
    }

    getActiveLayer() {
        return this.layers.find(l => l.name === this.activeLayer);
    }

    addLayer(layer) {
        if (!layer) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (this.layers.some(l => l.name === layer.name)) {
            throw new Error(ErrorMessage.ItemAlreadyExistsInList);
        }
        const change = new Change({
            changeObjectType: Map.name,
            changeObjectRef: this.ref,
            changeType: ChangeType.Insert,
            changeData: { propertyName: "layers", indices: [this.layers.length] }
        });
        this.#layers.push(layer);
        this.#addChangeEventListeners(layer);
        this.#onChange(change);
    }

    insertLayer(layer, index) {
        if (!layer) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (index < 0 || index > this.layers.length) {
            throw new Error(ErrorMessage.InvalidIndex);
        }
        const change = new Change({
            changeObjectType: Map.name,
            changeObjectRef: this.ref,
            changeType: ChangeType.Insert,
            changeData: { propertyName: "layers", indices: [index] }
        });
        this.#layers.splice(index, 0, layer);
        this.#addChangeEventListeners(layer);
        this.#onChange(change);
    }

    removeLayer(layer) {
        const index = this.#layers.findIndex(l => l.name === layer.name);
        if (index > -1) {
            const change = new Change({
                changeObjectType: Map.name,
                changeObjectRef: this.ref,
                changeType: ChangeType.Delete,
                changeData: {
                    propertyName: "layers",
                    layers: [{ layerData: layer.getData(), index: index }]
                }
            });
            this.#layers.splice(index, 1);
            this.#removeChangeEventListeners(layer);
            this.#onChange(change);
        }
    }

    clearLayers() {
        this.layers = [];
    }

    addMapItemTemplateRef(mapItemTemplateRef) {
        if (!mapItemTemplateRef) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (this.mapItemTemplateRefs.some(ref => EntityReference.areEqual(ref, mapItemTemplateRef))) {
            throw new Error(ErrorMessage.ItemAlreadyExistsInList);
        }
        const change = new Change({
            changeObjectType: Map.name,
            changeObjectRef: this.ref,
            changeType: ChangeType.Insert,
            changeData: { propertyName: "mapItemTemplateRefs", indices: [this.mapItemTemplateRefs.length] }
        });
        this.#mapItemTemplateRefs.push(mapItemTemplateRef);
        this.#onChange(change);
    }

    insertMapItemTemplateRef(mapItemTemplateRef, index) {
        if (!mapItemTemplateRef) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (this.mapItemTemplateRefs.some(ref => EntityReference.areEqual(ref, mapItemTemplateRef))) {
            throw new Error(ErrorMessage.ItemAlreadyExistsInList);
        }
        if (index < 0 || index > this.mapItemTemplateRefs.length) {
            throw new Error(ErrorMessage.InvalidIndex);
        }
        const change = new Change({
            changeObjectType: Map.name,
            changeObjectRef: this.ref,
            changeType: ChangeType.Insert,
            changeData: { propertyName: "mapItemTemplateRefs", indices: [index] }
        });
        this.#mapItemTemplateRefs.splice(index, 0, mapItemTemplateRef);
        this.#onChange(change);
    }

    removeMapItemTemplateRef(mapItemTemplateRef) {
        const index = this.#mapItemTemplateRefs.findIndex(ref => EntityReference.areEqual(ref, mapItemTemplateRef));
        if (index > -1) {
            const change = new Change({
                changeObjectType: Map.name,
                changeObjectRef: this.ref,
                changeType: ChangeType.Delete,
                changeData: {
                    propertyName: "mapItemTemplateRefs",
                    mapItemTemplateRefs: [{ ref: mapItemTemplateRef.getData(), index: index }]
                }
            });
            this.#mapItemTemplateRefs.splice(index, 1);
            this.#onChange(change);
        }
    }

    clearMapItemTemplateRefs() {
        this.mapItemTemplateRefs = [];
    }

    addMapItemTemplate(mapItemTemplate) {
        if (!mapItemTemplate) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (this.mapItemTemplates.some(mit => EntityReference.areEqual(mit.ref, mapItemTemplate.ref))) {
            throw new Error(ErrorMessage.ItemAlreadyExistsInList);
        }
        const change = new Change({
            changeObjectType: Map.name,
            changeObjectRef: this.ref,
            changeType: ChangeType.Insert,
            changeData: { propertyName: "mapItemTemplates", indices: [this.mapItemTemplates.length] }
        });
        this.#mapItemTemplates.push(mapItemTemplate);
        this.#addChangeEventListeners(mapItemTemplate);
        this.#onChange(change);
    }

    insertMapItemTemplate(mapItemTemplate, index) {
        if (!mapItemTemplate) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (this.mapItemTemplates.some(mit => EntityReference.areEqual(mit.ref, mapItemTemplate.ref))) {
            throw new Error(ErrorMessage.ItemAlreadyExistsInList);
        }
        if (index < 0 || index > this.mapItemTemplates.length) {
            throw new Error(ErrorMessage.InvalidIndex);
        }
        const change = new Change({
            changeObjectType: Map.name,
            changeObjectRef: this.ref,
            changeType: ChangeType.Insert,
            changeData: { propertyName: "mapItemTemplates", indices: [index] }
        });
        this.#mapItemTemplates.splice(index, 0, mapItemTemplate);
        this.#addChangeEventListeners(mapItemTemplate);
        this.#onChange(change);
    }

    removeMapItemTemplate(mapItemTemplate) {
        const index = this.#mapItemTemplates.findIndex(mit => EntityReference.areEqual(mit.ref, mapItemTemplate.ref));
        if (index > -1) {
            const change = new Change({
                changeObjectType: Map.name,
                changeObjectRef: this.ref,
                changeType: ChangeType.Delete,
                changeData: {
                    propertyName: "mapItemTemplates",
                    mapItemTemplates: [{ mapItemTemplateData: mapItemTemplate.getData(), index: index }]
                }
            });
            this.#mapItemTemplates.splice(index, 1);
            this.#removeChangeEventListeners(mapItemTemplate);
            this.#onChange(change);
        }
    }

    clearMapItemTemplates() {
        this.mapItemTemplates = [];
    }

    addToolRef(toolRef) {
        if (!toolRef) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (this.toolRefs.some(ref => EntityReference.areEqual(ref, toolRef))) {
            throw new Error(ErrorMessage.ItemAlreadyExistsInList);
        }
        const change = new Change({
            changeObjectType: Map.name,
            changeObjectRef: this.ref,
            changeType: ChangeType.Insert,
            changeData: { propertyName: "toolRefs", indices: [this.toolRefs.length] }
        });
        this.#toolRefs.push(toolRef);
        this.#onChange(change);
    }

    insertToolRef(toolRef, index,) {
        if (!toolRef) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (this.toolRefs.some(ref => EntityReference.areEqual(ref, toolRef))) {
            throw new Error(ErrorMessage.ItemAlreadyExistsInList);
        }
        if (index < 0 || index > this.toolRefs.length) {
            throw new Error(ErrorMessage.InvalidIndex);
        }
        const change = new Change({
            changeObjectType: Map.name,
            changeObjectRef: this.ref,
            changeType: ChangeType.Insert,
            changeData: { propertyName: "toolRefs", indices: [index] }
        });
        this.#toolRefs.splice(index, 0, toolRef);
        this.#onChange(change);
    }

    removeToolRef(toolRef) {
        const index = this.#toolRefs.findIndex(ref => EntityReference.areEqual(ref, toolRef));
        if (index > -1) {
            const change = new Change({
                changeObjectType: Map.name,
                changeObjectRef: this.ref,
                changeType: ChangeType.Delete,
                changeData: {
                    propertyName: "toolRefs",
                    toolRefs: [{ ref: toolRef.getData(), index: index }]
                }
            });
            this.#toolRefs.splice(index, 1);
            this.#onChange(change);
        }
    }

    clearToolRefs() {
        this.toolRefs = [];
    }

    addTool(tool) {
        if (!tool) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (this.tools.some(t => EntityReference.areEqual(t.ref, tool.ref))) {
            throw new Error(ErrorMessage.ItemAlreadyExistsInList);
        }
        const change = new Change({
            changeObjectType: Map.name,
            changeObjectRef: this.ref,
            changeType: ChangeType.Insert,
            changeData: { propertyName: "tools", indices: [this.tools.length] }
        });
        this.#tools.push(tool);
        this.#addChangeEventListeners(tool);
        this.#onChange(change);
    }

    insertTool(tool, index) {
        if (!tool) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (this.tools.some(t => EntityReference.areEqual(t.ref, tool.ref))) {
            throw new Error(ErrorMessage.ItemAlreadyExistsInList);
        }
        if (index < 0 || index > this.tools.length) {
            throw new Error(ErrorMessage.InvalidIndex);
        }
        const change = new Change({
            changeObjectType: Map.name,
            changeObjectRef: this.ref,
            changeType: ChangeType.Insert,
            changeData: { propertyName: "tools", indices: [index] }
        });
        this.#tools.splice(index, 0, tool);
        this.#addChangeEventListeners(tool);
        this.#onChange(change);
    }

    removeTool(tool) {
        const index = this.#tools.findIndex(t => EntityReference.areEqual(t.ref, tool.ref));
        if (index > -1) {
            const change = new Change({
                changeObjectType: Map.name,
                changeObjectRef: this.ref,
                changeType: ChangeType.Delete,
                changeData: {
                    propertyName: "tools",
                    tools: [{ toolData: tool.getData(), index: index }]
                }
            });
            this.#tools.splice(index, 1);
            this.#removeChangeEventListeners(tool);
            this.#onChange(change);
        }
    }

    clearTools() {
        this.tools = [];
    }

    render(canvas, context, options) {
        context.resetTransform();
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.scale(this.zoom, this.zoom);
        context.translate(this.pan.x, this.pan.y);
        this.#currentViewPort = {
            x: -this.pan.x,
            y: -this.pan.y,
            width: canvas.width / this.zoom,
            height: canvas.height / this.zoom
        };
        for (const layer of this.layers) {
            layer.render(context, this, options);
        }
        for (const layer of this.layers) {
            layer.renderSelections(context, this);
        }
        this.overlay.render(context, this, options);
    }

    #startedChange
    startChange() {
        this.#startedChange = true;
    }
    completeChange(change) {
        this.#startedChange = false;
        this.#onChange(change);
    }

    // helpers
    #eventListeners;

    #onChange = (change) => {
        if (!this.#startedChange) {
            this.#hasUnsavedChanges = true;
            if (this.#eventListeners[Change.ChangeEvent]) {
                for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                    listener(change);
                }
            }
        }  
    }

    #getPropertyChange(propertyName, oldValue, newValue) {
        return new Change({
            changeObjectType: Map.name,
            changeObjectRef: this.ref,
            changeType: ChangeType.Edit,
            changeData: [
                {
                    propertyName: propertyName,
                    oldValue: oldValue,
                    newValue: newValue
                }
            ]
        });
    }

    #addChangeEventListeners(source) {
        if (source) {
            source.addEventListener(Change.ChangeEvent, this.#onChange);
        }
    }

    #removeChangeEventListeners(source) {
        if (source) {
            source.removeEventListener(Change.ChangeEvent, this.#onChange);
        }
    }

    #getRefs(refsData) {
        const refs = [];
        if (refsData) {
            for (const ref of refsData) {
                refs.push(new EntityReference(ref));
            }
        }
        return refs;
    }

    #getRefsData(refs) {
        let refsData = null;
        if (refs && refs.length > 0) {
            refsData = [];
            for (const ref of refs) {
                refsData.push(ref.getData());
            }
        }
        return refsData;
    }

    #validateUniqueLayerNames(layers) {
        if (layers) {
            const names = [];
            for (const layer of layers) {
                if (names.includes(layer.name)) {
                    throw new Error(ErrorMessage.ItemAlreadyExistsInList);
                }
                names.push(layer.name);
            }
        }
    }
}
