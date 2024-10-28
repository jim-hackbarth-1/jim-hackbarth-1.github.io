
import { ChangeEventType, ChangeType, EntityReference, getOverlandTemplate, Layer, MapItemTemplate, Tool, ToolPalette } from "../references.js";

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
        this.#layers = [];
        this.#mapItemTemplateRefs = [];
        this.#mapItemTemplates = [];
        this.#toolRefs = [];
        this.#tools = [];
        this.#toolPalette = new ToolPalette(data?.toolPalette);
        if (data) {
            if (data.templateRef) {
                this.#templateRef = new EntityReference(data.templateRef);
            }
            this.#thumbnailSrc = data.thumbnailSrc;
            if (data.layers) {
                for (const layerData of data.layers) {
                    const layer = new Layer(layerData);
                    this.#layers.push(layer);
                    this.#addChangeEventListeners(layer);
                }
            }
            this.#activeLayer = data.activeLayer;
            this.#mapItemTemplateRefs = this.#getRefs(data.mapItemTemplateRefs);
            if (data.mapItemTemplates) {
                for (const mapItemTemplateData of data.mapItemTemplates) {
                    const mapItemTemplate = new MapItemTemplate(mapItemTemplateData);
                    this.#mapItemTemplates.push(mapItemTemplate);
                    this.#addChangeEventListeners(mapItemTemplate);
                }
            }
            this.#toolRefs = this.#getRefs(data.toolRefs);
            if (data.tools) {
                for (const toolData of data.tools) {
                    const tool = new Tool(toolData);
                    this.#tools.push(tool);
                    this.#addChangeEventListeners(tool);
                }
            }
        }
        this.#eventListeners = {};
        this.#addChangeEventListeners(this.#toolPalette);
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
        this.#beforeChange({ changeType: ChangeType.MapProperty, changeData: { propertyName: "thumbnailSrc", propertyValue: this.thumbnailSrc } });
        this.#thumbnailSrc = thumbnailSrc;
        this.#afterChange({ changeType: ChangeType.MapProperty, changeData: { propertyName: "thumbnailSrc", propertyValue: this.thumbnailSrc } });
    }

    /** @type {Layer[]}  */
    #layers;
    get layers() {
        return this.#layers;
    }
    set layers(layers) {
        this.#beforeChange({ changeType: ChangeType.MapProperty, changeData: { propertyName: "layers", propertyValue: this.layers } });
        if (this.#layers) {
            for (const layer of this.#layers) {
                this.#removeChangeEventListeners(layer);
            }
        }
        this.#layers = layers ?? [];
        if (this.#layers) {
            for (const layer of this.#layers) {
                this.#addChangeEventListeners(layer);
            }
        }
        this.#afterChange({ changeType: ChangeType.MapProperty, changeData: { propertyName: "layers", propertyValue: this.layers } });
    }

    /** @type {string}  */
    #activeLayer;
    get activeLayer() {
        return this.#activeLayer;
    }
    set activeLayer(activeLayer) {
        this.#beforeChange({ changeType: ChangeType.MapProperty, changeData: { propertyName: "activeLayer", propertyValue: this.activeLayer } });
        this.#activeLayer = activeLayer;
        this.#afterChange({ changeType: ChangeType.MapProperty, changeData: { propertyName: "activeLayer", propertyValue: this.activeLayer } });
    }

    /** @type {EntityReference[]}  */
    #mapItemTemplateRefs;
    get mapItemTemplateRefs() {
        return this.#mapItemTemplateRefs;
    }
    set mapItemTemplateRefs(mapItemTemplateRefs) {
        this.#beforeChange({ changeType: ChangeType.MapProperty, changeData: { propertyName: "mapItemTemplateRefs", propertyValue: this.mapItemTemplateRefs } });
        this.#mapItemTemplateRefs = mapItemTemplateRefs ?? [];
        this.#afterChange({ changeType: ChangeType.MapProperty, changeData: { propertyName: "mapItemTemplateRefs", propertyValue: this.mapItemTemplateRefs } });
    }

    /** @type {MapItemTemplate[]}  */
    #mapItemTemplates;
    get mapItemTemplates() {
        return this.#mapItemTemplates;
    }
    set mapItemTemplates(mapItemTemplates) {
        this.#beforeChange({ changeType: ChangeType.MapProperty, changeData: { propertyName: "mapItemTemplates", propertyValue: this.mapItemTemplates } });
        if (this.#mapItemTemplates) {
            for (const mapItemTemplate of this.#mapItemTemplates) {
                this.#removeChangeEventListeners(mapItemTemplate);
            }
        }
        this.#mapItemTemplates = mapItemTemplates ?? [];
        if (this.#mapItemTemplates) {
            for (const mapItemTemplate of this.#mapItemTemplates) {
                this.#addChangeEventListeners(mapItemTemplate);
            }
        }
        this.#afterChange({ changeType: ChangeType.MapProperty, changeData: { propertyName: "mapItemTemplates", propertyValue: this.mapItemTemplates } });
    }

    /** @type {EntityReference[]}  */
    #toolRefs = [];
    get toolRefs() {
        return this.#toolRefs;
    }
    set toolRefs(toolRefs) {
        this.#beforeChange({ changeType: ChangeType.MapProperty, changeData: { propertyName: "toolRefs", propertyValue: this.toolRefs } });
        this.#toolRefs = toolRefs ?? [];
        this.#afterChange({ changeType: ChangeType.MapProperty, changeData: { propertyName: "toolRefs", propertyValue: this.toolRefs } });
    }

    /** @type {Tool[]}  */
    #tools;
    get tools() {
        return this.#tools;
    }
    set tools(tools) {
        this.#beforeChange({ changeType: ChangeType.MapProperty, changeData: { propertyName: "tools", propertyValue: this.tools } });
        if (this.#tools) {
            for (const tool of this.#tools) {
                this.#removeChangeEventListeners(tool);
            }
        }
        this.#tools = tools ?? [];
        if (this.#tools) {
            for (const tool of this.#tools) {
                this.#addChangeEventListeners(tool);
            }
        }
        this.#afterChange({ changeType: ChangeType.MapProperty, changeData: { propertyName: "tools", propertyValue: this.tools } });
    }

    /** @type {ToolPalette}  */
    #toolPalette;
    get toolPalette() {
        return this.#toolPalette;
    }
    set toolPalette(toolPalette) {
        this.#beforeChange({ changeType: ChangeType.MapProperty, changeData: { propertyName: "toolPalette", propertyValue: this.toolPalette } });
        this.#toolPalette = toolPalette;
        this.#addChangeEventListeners(this.#toolPalette);
        this.#afterChange({ changeType: ChangeType.MapProperty, changeData: { propertyName: "toolPalette", propertyValue: this.toolPalette } });
    }

    /** @type {boolean}  */
    #hasUnsavedChanges;
    get hasUnsavedChanges() {
        return this.#hasUnsavedChanges;
    }
    set hasUnsavedChanges(hasUnsavedChanges) {
        this.#hasUnsavedChanges = hasUnsavedChanges;
    }

    // methods
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
            toolPalette: this.#toolPalette ? this.#toolPalette.getData() : null
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
            this.#eventListeners.splice(index, 1);
        }
    }

    getActiveLayer() {
        return this.layers.find(l => l.name === this.activeLayer);
    }

    addLayer(layer) {
        if (!layer) {
            throw new Error(ErrorMessage.NullValue);
        }
        // TODO: validate layer name is unique
        this.#beforeChange({ changeType: ChangeType.MapAddLayer, changeData: { layer: layer } });
        this.#layers.push(layer);
        this.#addChangeEventListeners(layer);
        this.#afterChange({ changeType: ChangeType.MapAddLayer, changeData: { layer: layer } });
    }

    insertLayer(index, layer) {
        if (!layer) {
            throw new Error(ErrorMessage.NullValue);
        }
        this.#beforeChange({ changeType: ChangeType.MapInsertLayer, changeData: { index: index, layer: layer } });
        this.#layers.splice(index, 0, layer);
        this.#addChangeEventListeners(layer);
        this.#afterChange({ changeType: ChangeType.MapInsertLayer, changeData: { index: index, layer: layer } });
    }

    removeLayer(layer) {
        const index = this.#layers.findIndex(l => l === layer);
        if (index > -1) {
            this.#beforeChange({ changeType: ChangeType.MapRemoveLayer, changeData: { index: index, layer: layer } });
            this.#layers.splice(index, 1);
            this.#removeChangeEventListeners(layer);
            this.#afterChange({ changeType: ChangeType.MapRemoveLayer, changeData: { index: index, layer: layer } });
        }
    }

    clearLayers() {
        this.layers([]);
    }

    addMapItemTemplateRef(mapItemTemplateRef) {
        if (!mapItemTemplateRef) {
            throw new Error(ErrorMessage.NullValue);
        }
        this.#beforeChange({ changeType: ChangeType.MapAddMapItemTemplateRef, changeData: { mapItemTemplateRef: mapItemTemplateRef } });
        this.#mapItemTemplateRefs.push(mapItemTemplateRef);
        this.#afterChange({ changeType: ChangeType.MapAddMapItemTemplateRef, changeData: { mapItemTemplateRef: mapItemTemplateRef } });
    }

    insertMapItemTemplateRef(index, mapItemTemplateRef) {
        if (!mapItemTemplateRef) {
            throw new Error(ErrorMessage.NullValue);
        }
        this.#beforeChange({ changeType: ChangeType.MapInsertMapItemTemplateRef, changeData: { index: index, mapItemTemplateRef: mapItemTemplateRef } });
        this.#mapItemTemplateRefs.splice(index, 0, mapItemTemplateRef);
        this.#afterChange({ changeType: ChangeType.MapInsertMapItemTemplateRef, changeData: { index: index, mapItemTemplateRef: mapItemTemplateRef } });
    }

    removeMapItemTemplateRef(mapItemTemplateRef) {
        const index = this.#mapItemTemplateRefs.findIndex(ref => ref === mapItemTemplateRef);
        if (index > -1) {
            this.#beforeChange({ changeType: ChangeType.MapRemoveMapItemTemplateRef, changeData: { index: index, mapItemTemplateRef: mapItemTemplateRef } });
            this.#mapItemTemplateRefs.splice(index, 1);
            this.#afterChange({ changeType: ChangeType.MapRemoveMapItemTemplateRef, changeData: { index: index, mapItemTemplateRef: mapItemTemplateRef } });
        }
    }

    clearMapItemTemplateRefs() {
        this.mapItemTemplateRefs([]);
    }

    addMapItemTemplate(mapItemTemplate) {
        if (!mapItemTemplate) {
            throw new Error(ErrorMessage.NullValue);
        }
        this.#beforeChange({ changeType: ChangeType.MapAddMapItemTemplate, changeData: { mapItemTemplate: mapItemTemplate } });
        this.#mapItemTemplates.push(mapItemTemplate);
        this.#addChangeEventListeners(mapItemTemplate);
        this.#afterChange({ changeType: ChangeType.MapAddMapItemTemplate, changeData: { mapItemTemplate: mapItemTemplate } });
    }

    insertMapItemTemplate(index, mapItemTemplate) {
        if (!mapItemTemplate) {
            throw new Error(ErrorMessage.NullValue);
        }
        this.#beforeChange({ changeType: ChangeType.MapInsertMapItemTemplate, changeData: { index: index, mapItemTemplate: mapItemTemplate } });
        this.#mapItemTemplates.splice(index, 0, mapItemTemplate);
        this.#addChangeEventListeners(mapItemTemplate);
        this.#afterChange({ changeType: ChangeType.MapInsertMapItemTemplate, changeData: { index: index, mapItemTemplate: mapItemTemplate } });
    }

    removeMapItemTemplate(mapItemTemplate) {
        const index = this.#mapItemTemplates.findIndex(mit => mit === mapItemTemplate);
        if (index > -1) {
            this.#beforeChange({ changeType: ChangeType.MapRemoveMapItemTemplate, changeData: { index: index, mapItemTemplate: mapItemTemplate } });
            this.#mapItemTemplates.splice(index, 1);
            this.#removeChangeEventListeners(mapItemTemplate);
            this.#afterChange({ changeType: ChangeType.MapRemoveMapItemTemplate, changeData: { index: index, mapItemTemplate: mapItemTemplate } });
        }
    }

    clearMapItemTemplates() {
        this.mapItemTemplates([]);
    }

    addToolRef(toolRef) {
        if (!toolRef) {
            throw new Error(ErrorMessage.NullValue);
        }
        this.#beforeChange({ changeType: ChangeType.MapAddToolRef, changeData: { toolRef: toolRef } });
        this.#toolRefs.push(toolRef);
        this.#afterChange({ changeType: ChangeType.MapAddToolRef, changeData: { toolRef: toolRef } });
    }

    insertToolRef(index, toolRef) {
        if (!toolRef) {
            throw new Error(ErrorMessage.NullValue);
        }
        this.#beforeChange({ changeType: ChangeType.MapInsertToolRef, changeData: { index: index, toolRef: toolRef } });
        this.#toolRefs.splice(index, 0, toolRef);
        this.#afterChange({ changeType: ChangeType.MapInsertToolRef, changeData: { index: index, toolRef: toolRef } });
    }

    removeToolRef(toolRef) {
        const index = this.#toolRefs.findIndex(ref => ref === toolRef);
        if (index > -1) {
            this.#beforeChange({ changeType: ChangeType.MapRemoveToolRef, changeData: { index: index, toolRef: toolRef } });
            this.#toolRefs.splice(index, 1);
            this.#afterChange({ changeType: ChangeType.MapRemoveToolRef, changeData: { index: index, toolRef: toolRef } });
        }
    }

    clearToolRefs() {
        this.toolRefs([]);
    }

    addTool(tool) {
        if (!tool) {
            throw new Error(ErrorMessage.NullValue);
        }
        this.#beforeChange({ changeType: ChangeType.MapAddTool, changeData: { tool: tool } });
        this.#tools.push(tool);
        this.#addChangeEventListeners(tool);
        this.#afterChange({ changeType: ChangeType.MapAddTool, changeData: { tool: tool } });
    }

    insertTool(index, tool) {
        if (!tool) {
            throw new Error(ErrorMessage.NullValue);
        }
        this.#beforeChange({ changeType: ChangeType.MapInsertTool, changeData: { index: index, tool: tool } });
        this.#tools.splice(index, 0, tool);
        this.#addChangeEventListeners(tool);
        this.#afterChange({ changeType: ChangeType.MapInsertTool, changeData: { index: index, tool: tool } });
    }

    removeTool(tool) {
        const index = this.#tools.findIndex(t => t === tool);
        if (index > -1) {
            this.#beforeChange({ changeType: ChangeType.MapRemoveTool, changeData: { index: index, tool: tool } });
            this.#tools.splice(index, 1);
            this.#removeChangeEventListeners(tool);
            this.#afterChange({ changeType: ChangeType.MapRemoveTool, changeData: { index: index, tool: tool } });
        }
    }

    clearTools() {
        this.tools([]);
    }

    render(canvas, context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (const layer of this.layers) {
            layer.render(canvas, context, this);
        }
    }

    // helpers
    #eventListeners;

    #beforeChange = (change) => {
        if (this.#eventListeners[ChangeEventType.beforeChangeEvent]) {
            for (const listener of this.#eventListeners[ChangeEventType.beforeChangeEvent]) {
                listener(change);
            }
        }
    }

    #afterChange = (change) => {
        this.#hasUnsavedChanges = true;
        if (this.#eventListeners[ChangeEventType.afterChangeEvent]) {
            for (const listener of this.#eventListeners[ChangeEventType.afterChangeEvent]) {
                listener(change);
            }
        }
    }

    #addChangeEventListeners(source) {
        if (source) {
            source.addEventListener(ChangeEventType.beforeChangeEvent, this.#beforeChange);
            source.addEventListener(ChangeEventType.afterChangeEvent, this.#afterChange);
        }
    }

    #removeChangeEventListeners(source) {
        if (source) {
            source.removeEventListener(ChangeEventType.beforeChangeEvent, this.#beforeChange);
            source.removeEventListener(ChangeEventType.afterChangeEvent, this.#afterChange);
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
}
