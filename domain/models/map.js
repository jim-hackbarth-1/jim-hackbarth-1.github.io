
import {
    Caption,
    Change,
    ChangeSet,
    ChangeType,
    ClipPath,
    EntityReference,
    ErrorMessage,
    getOverlandTemplate,
    InputUtilities,
    Layer,
    MapItem,
    MapItemGroup,
    MapItemTemplate,
    Overlay,
    Path,
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
        this.#thumbnailSrc = data?.thumbnailSrc; // TODO: cleanse src
        this.#layers = [];
        if (data?.layers) {
            for (const layerData of data.layers) {
                const layer = new Layer(layerData);
                this.#layers.push(layer);
                this.#addChangeEventListeners(layer);
            }
        }
        this.#activeLayer = InputUtilities.cleanseString(data?.activeLayer);
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
        this.#pan = InputUtilities.cleansePoint(data?.pan);
        this.#zoom = InputUtilities.cleanseNumber(data?.zoom);
        this.#hasUnsavedChanges = InputUtilities.cleanseBoolean(data?.hasUnsavedChanges);
        this.#overlay = new Overlay(data?.overlay);
        this.#changeLog = data?.changeLog ?? [];
        this.#undoLog = data?.undoLog ?? [];
        this.#eventListeners = {}; 
    }

    // properties
    static get AfterRenderEvent() {
        return "AfterRenderEvent";
    }

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
        const changeSet = this.#getPropertyChange("thumbnailSrc", this.#thumbnailSrc, thumbnailSrc);
        this.#thumbnailSrc = thumbnailSrc;
        this.#onChange(changeSet);
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
        const changeSet = this.#getPropertyChange("layers", this.#getListData(this.#layers), this.#getListData(layers));
        this.#layers = layers;
        this.#onChange(changeSet);
    }

    /** @type {string}  */
    #activeLayer;
    get activeLayer() {
        return this.#activeLayer;
    }
    set activeLayer(activeLayer) {
        const changeSet = this.#getPropertyChange("activeLayer", this.#activeLayer, activeLayer);
        this.#activeLayer = activeLayer;
        this.#onChange(changeSet);
    }

    /** @type {EntityReference[]}  */
    #mapItemTemplateRefs;
    get mapItemTemplateRefs() {
        return this.#mapItemTemplateRefs;
    }
    set mapItemTemplateRefs(mapItemTemplateRefs) {
        EntityReference.validateUniqueEntityReferences(mapItemTemplateRefs);
        const changeSet = this.#getPropertyChange(
            "mapItemTemplateRefs", this.#getListData(this.#mapItemTemplateRefs), this.#getListData(mapItemTemplateRefs));
        this.#mapItemTemplateRefs = mapItemTemplateRefs;
        this.#onChange(changeSet);
    }

    /** @type {MapItemTemplate[]}  */
    #mapItemTemplates;
    get mapItemTemplates() {
        return this.#mapItemTemplates;
    }
    set mapItemTemplates(mapItemTemplates) {
        const refs = [];
        if (mapItemTemplates) {
            refs = mapItemTemplates.map(mit => mit.ref);
            EntityReference.validateUniqueEntityReferences(refs);
        }
        if (this.#mapItemTemplates) {
            for (const mapItemTemplate of this.#mapItemTemplates) {
                this.#removeChangeEventListeners(mapItemTemplate);
            }
        }
        const changeSet = this.#getPropertyChange("mapItemTemplates", this.#getListData(this.#mapItemTemplates), this.#getListData(mapItemTemplates));
        this.#mapItemTemplates = mapItemTemplates ?? [];
        for (const mapItemTemplate of this.#mapItemTemplates) {
            this.#addChangeEventListeners(mapItemTemplate);
        }
        this.#onChange(changeSet);
    }

    /** @type {EntityReference[]}  */
    #toolRefs = [];
    get toolRefs() {
        return this.#toolRefs;
    }
    set toolRefs(toolRefs) {
        EntityReference.validateUniqueEntityReferences(toolRefs);
        const changeSet = this.#getPropertyChange("toolRefs", this.#getListData(this.#toolRefs), this.#getListData(toolRefs));
        this.#toolRefs = toolRefs;
        this.#onChange(changeSet);
    }

    /** @type {Tool[]}  */
    #tools;
    get tools() {
        return this.#tools;
    }
    set tools(tools) {
        const refs = [];
        if (tools) {
            refs = tools.map(t => t.ref);
            EntityReference.validateUniqueEntityReferences(refs);
        }
        if (this.#tools) {
            for (const tool of this.#tools) {
                this.#removeChangeEventListeners(tool);
            }
        }
        const changeSet = this.#getPropertyChange("tools", this.#getListData(this.#tools), this.#getListData(tools));
        this.#tools = tools ?? [];
        for (const tool of this.#tools) {
            this.#addChangeEventListeners(tool);
        }
        this.#onChange(changeSet);
    }

    /** @type {ToolPalette}  */
    #toolPalette;
    get toolPalette() {
        return this.#toolPalette;
    }
    set toolPalette(toolPalette) {
        const changeSet = this.#getPropertyChange("toolPalette", this.#toolPalette, toolPalette);
        this.#toolPalette = toolPalette;
        this.#addChangeEventListeners(this.#toolPalette);
        this.#onChange(changeSet);
    }

    /** @type {{x: number, y: number}} */
    #pan;
    get pan() {
        return this.#pan ?? { x: 0, y: 0 };
    }
    set pan(pan) {
        const changeSet = this.#getPropertyChange("pan", this.#pan, pan);
        this.#pan = pan;
        this.#onChange(changeSet);
    }

    /** @type {number} */
    #zoom;
    get zoom() {
        return this.#zoom ?? 1;
    }
    set zoom(zoom) {
        const changeSet = this.#getPropertyChange("zoom", this.#zoom, zoom);
        this.#zoom = zoom;
        this.#onChange(changeSet);
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
        const changeSet = this.#getPropertyChange("overlay", this.#overlay, overlay);
        this.#overlay = overlay;
        this.#onChange(changeSet);
    }

    // methods
    getData() {
        return {
            ref: this.#ref ? this.#ref.getData() : null,
            templateRef: this.#templateRef ? this.#templateRef.getData() : null,
            thumbnailSrc: this.#thumbnailSrc,
            layers: this.#getListData(this.#layers),
            activeLayer: this.#activeLayer,
            mapItemTemplateRefs: this.#getListData(this.#mapItemTemplateRefs),
            mapItemTemplates: this.#getListData(this.#mapItemTemplates),
            toolRefs: this.#getListData(this.#toolRefs),
            tools: this.#getListData(this.#tools),
            toolPalette: this.#toolPalette ? this.#toolPalette.getData() : null,
            pan: this.#pan,
            zoom: this.#zoom,
            hasUnsavedChanges: this.#hasUnsavedChanges,
            overlay: this.#overlay ? this.#overlay.getData() : null,
            changeLog: this.#changeLog,
            undoLog: this.#undoLog
        };
    }

    addEventListener(eventName, listener) {
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
        this.#eventListeners[eventName].push(listener);
    }

    removeEventListener(eventName, listener) {
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
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
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: Map.name,
            propertyName: "layers",
            itemIndex: this.layers.length,
            itemValue: layer.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#layers.push(layer);
        this.#addChangeEventListeners(layer);
        this.#onChange(changeSet);
    }

    insertLayer(layer, index) {
        if (!layer) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (index < 0 || index > this.layers.length) {
            throw new Error(ErrorMessage.InvalidIndex);
        }
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: Map.name,
            propertyName: "layers",
            itemIndex: index,
            itemValue: layer.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#layers.splice(index, 0, layer);
        this.#addChangeEventListeners(layer);
        this.#onChange(changeSet);
    }

    removeLayer(layer) {
        const index = this.#layers.findIndex(l => l.name === layer.name);
        if (index > -1) {
            const changeData = {
                changeType: ChangeType.Delete,
                changeObjectType: Map.name,
                propertyName: "layers",
                itemIndex: index,
                itemValue: layer.getData()
            };
            const changeSet = new ChangeSet({ changes: [changeData] });
            const deleted = this.#layers.splice(index, 1);
            this.#removeChangeEventListeners(deleted[0]);
            this.#onChange(changeSet);
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
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: Map.name,
            propertyName: "mapItemTemplateRefs",
            itemIndex: this.mapItemTemplateRefs.length,
            itemValue: mapItemTemplateRef.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#mapItemTemplateRefs.push(mapItemTemplateRef);
        this.#onChange(changeSet);
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
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: Map.name,
            propertyName: "mapItemTemplateRefs",
            itemIndex: index,
            itemValue: mapItemTemplateRef.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#mapItemTemplateRefs.splice(index, 0, mapItemTemplateRef);
        this.#onChange(changeSet);
    }

    removeMapItemTemplateRef(mapItemTemplateRef) {
        const index = this.#mapItemTemplateRefs.findIndex(ref => EntityReference.areEqual(ref, mapItemTemplateRef));
        if (index > -1) {
            const changeData = {
                changeType: ChangeType.Delete,
                changeObjectType: Map.name,
                propertyName: "mapItemTemplateRefs",
                itemIndex: index,
                itemValue: mapItemTemplateRef.getData()
            };
            const changeSet = new ChangeSet({ changes: [changeData] });
            this.#mapItemTemplateRefs.splice(index, 1);
            this.#onChange(changeSet);
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
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: Map.name,
            propertyName: "mapItemTemplates",
            itemIndex: this.mapItemTemplates.length,
            itemValue: mapItemTemplate.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#mapItemTemplates.push(mapItemTemplate);
        this.#addChangeEventListeners(mapItemTemplate);
        this.#onChange(changeSet);
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
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: Map.name,
            propertyName: "mapItemTemplates",
            itemIndex: index,
            itemValue: mapItemTemplate.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#mapItemTemplates.splice(index, 0, mapItemTemplate);
        this.#addChangeEventListeners(mapItemTemplate);
        this.#onChange(changeSet);
    }

    removeMapItemTemplate(mapItemTemplate) {
        const index = this.#mapItemTemplates.findIndex(mit => EntityReference.areEqual(mit.ref, mapItemTemplate.ref));
        if (index > -1) {
            const changeData = {
                changeType: ChangeType.Delete,
                changeObjectType: Map.name,
                propertyName: "mapItemTemplates",
                itemIndex: index,
                itemValue: mapItemTemplate.getData()
            };
            const changeSet = new ChangeSet({ changes: [changeData] });
            const deleted = this.#mapItemTemplates.splice(index, 1);
            this.#removeChangeEventListeners(deleted[0]);
            this.#onChange(changeSet);
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
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: Map.name,
            propertyName: "toolRefs",
            itemIndex: this.toolRefs.length,
            itemValue: toolRef.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#toolRefs.push(toolRef);
        this.#onChange(changeSet);
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
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: Map.name,
            propertyName: "toolRefs",
            itemIndex: index,
            itemValue: toolRef.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#toolRefs.splice(index, 0, toolRef);
        this.#onChange(changeSet);
    }

    removeToolRef(toolRef) {
        const index = this.#toolRefs.findIndex(ref => EntityReference.areEqual(ref, toolRef));
        if (index > -1) {
            const changeData = {
                changeType: ChangeType.Delete,
                changeObjectType: Map.name,
                propertyName: "toolRefs",
                itemIndex: index,
                itemValue: toolRef.getData()
            };
            const changeSet = new ChangeSet({ changes: [changeData] });
            this.#toolRefs.splice(index, 1);
            this.#onChange(changeSet);
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
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: Map.name,
            propertyName: "tools",
            itemIndex: this.tools.length,
            itemValue: tool.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#tools.push(tool);
        this.#addChangeEventListeners(tool);
        this.#onChange(changeSet);
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
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: Map.name,
            propertyName: "tools",
            itemIndex: index,
            itemValue: tool.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#tools.splice(index, 0, tool);
        this.#addChangeEventListeners(tool);
        this.#onChange(changeSet);
    }

    removeTool(tool) {
        const index = this.#tools.findIndex(t => EntityReference.areEqual(t.ref, tool.ref));
        if (index > -1) {
            const changeData = {
                changeType: ChangeType.Delete,
                changeObjectType: Map.name,
                propertyName: "tools",
                itemIndex: index,
                itemValue: tool.getData()
            };
            const changeSet = new ChangeSet({ changes: [changeData] });
            const deleted = this.#tools.splice(index, 1);
            this.#removeChangeEventListeners(deleted[0]);
            this.#onChange(changeSet);
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
        if (this.#eventListeners[Map.AfterRenderEvent]) {
            for (const listener of this.#eventListeners[Map.AfterRenderEvent]) {
                listener();
            }
        }
    }

    #changeSetStarted
    startChangeSet() {
        this.#changeSetStarted = true;
    }
    completeChangeSet(changeSet) {
        this.#changeSetStarted = false;
        this.#onChange(changeSet);
    }

    // ~~~
    #changeLog = [];
    #undoLog = [];
    #undoing = false;

    canUndo() {
        return (this.#changeLog.length > 0);
    }

    undo() {
        let changeSet = new ChangeSet(this.#changeLog.pop());
        return this.applyChangeSet(changeSet, true);
    }

    canRedo() {
        return (this.#undoLog.length > 0);
    }

    redo() {
        let changeSet = new ChangeSet(this.#undoLog.pop());
        return this.applyChangeSet(changeSet);
    }

    #logChangeSet(changeSet) {
        const maxLogLength = 100;
        if (this.#undoing) {
            this.#undoLog.push(changeSet.getData());
            if (this.#undoLog.length > maxLogLength) {
                this.#undoLog = this.#undoLog.slice(-maxLogLength);
            }
        }
        else {
            this.#changeLog.push(changeSet.getData());
            if (this.#changeLog.length > maxLogLength) {
                this.#changeLog = this.#changeLog.slice(-maxLogLength);
            }
        }
    }

    applyChangeSet(changeSet, undoing) {
        let updateViewPort = false;
        if (changeSet?.changes) {
            try {
                this.#undoing = undoing;
                this.startChangeSet();
                let changeRef;
                let tool;
                let mapItemTemplate;
                let layer;
                let mapItemGroup;
                let mapItem;
                let path;
                let clipPath;
                for (const change of changeSet.changes) {
                    switch (change.changeObjectType) {
                        case Map.name:
                            if (change.changeType == ChangeType.Edit) {
                                if (change.propertyName == "pan" || change.propertyName == "zoom") {
                                    updateViewPort = true;
                                }
                                this.#applyPropertyChange(change.propertyName, undoing ? change.oldValue : change.newValue);
                            }
                            if (change.changeType == ChangeType.Insert) {
                                if (undoing) {
                                    this.#applyPropertyDelete(change.propertyName, change.itemValue);
                                }
                                else {
                                    this.#applyPropertyInsert(change.propertyName, change.itemIndex, change.itemValue);
                                }
                            }
                            if (change.changeType == ChangeType.Delete) {
                                if (undoing) {
                                    this.#applyPropertyInsert(change.propertyName, change.itemIndex, change.itemValue);
                                }
                                else {
                                    this.#applyPropertyDelete(change.propertyName, change.itemValue);
                                }
                            }
                            break;
                        case Tool.name:
                            changeRef = new EntityReference(change.toolRef);
                            tool = this.tools.find(t => EntityReference.areEqual(t.ref, changeRef));
                            tool.applyChange(change, undoing);
                            break;
                        case MapItemTemplate.name:
                            changeRef = new EntityReference(change.mapItemTemplateRef);
                            mapItemTemplate = this.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, changeRef));
                            mapItemTemplate.applyChange(change, undoing);
                            break;
                        case Caption.name:
                            changeRef = new EntityReference(change.mapItemTemplateRef);
                            mapItemTemplate = this.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, changeRef));
                            mapItemTemplate.caption.applyChange(change, undoing);
                            break;
                        case Layer.name:
                            layer = this.layers.find(l => l.name == change.layerName);
                            layer.applyChange(change, undoing);
                            break;
                        case MapItemGroup.name:
                            layer = this.layers.find(l => l.name == change.layerName);
                            mapItemGroup = layer.mapItemGroups.find(mig => mig.id == change.mapItemGroupId);
                            mapItemGroup.applyChange(change, undoing);
                            break;
                        case MapItem.name:
                            layer = this.layers.find(l => l.name == change.layerName);
                            mapItemGroup = layer.mapItemGroups.find(mig => mig.id == change.mapItemGroupId);
                            mapItem = mapItemGroup.mapItems.find(mi => mi.id == change.mapItemId);
                            mapItem.applyChange(change, undoing);
                            break;
                        case Path.name:
                            layer = this.layers.find(l => l.name == change.layerName);
                            mapItemGroup = layer.mapItemGroups.find(mig => mig.id == change.mapItemGroupId);
                            mapItem = mapItemGroup.mapItems.find(mi => mi.id == change.mapItemId);
                            path = mapItem.paths.find(p => p.id == change.pathId);
                            path.applyChange(change, undoing);
                            break;
                        case ClipPath.name:
                            layer = this.layers.find(l => l.name == change.layerName);
                            mapItemGroup = layer.mapItemGroups.find(mig => mig.id == change.mapItemGroupId);
                            mapItem = mapItemGroup.mapItems.find(mi => mi.id == change.mapItemId);
                            path = mapItem.paths.find(p => p.id == change.pathId);
                            clipPath = path.clipPaths.find(cp => cp.id == change.clipPathId);
                            clipPath.applyChange(change, undoing);
                            break;
                    }
                }
            }
            catch (exception) {
                throw exception;
            }
            finally {
                this.completeChangeSet(changeSet);
                this.#undoing = false;
            }
        }
        return updateViewPort;
    }

    #applyPropertyChange(propertyName, propertyValue) {
        switch (propertyName) {
            case "thumbnailSrc":
                this.thumbnailSrc = InputUtilities.cleanseSvg(propertyValue);
                break;
            case "layers":
                let layers = [];
                if (propertyValue) {
                    for (const layer of propertyValue) {
                        layers.push(new Layer(layer));
                    }
                }
                this.layers = layers;
                break;
            case "activeLayer":
                this.activeLayer = InputUtilities.cleanseString(propertyValue);
                break;
            case "mapItemTemplates":
                let mapItemTemplates = [];
                for (const mapItemTemplate of propertyValue) {
                    mapItemTemplates.push(new MapItemTemplate(mapItemTemplate));
                }
                this.mapItemTemplates = mapItemTemplates;
                break;
            case "mapItemTemplateRefs":
                let mapItemTemplateRefs = [];
                for (const mapItemTemplateRef of propertyValue) {
                    mapItemTemplateRefs.push(new EntityReference(mapItemTemplateRef));
                }
                this.mapItemTemplateRefs = mapItemTemplateRefs;
                break;
            case "toolRefs":
                let toolRefs = [];
                if (propertyValue) {
                    for (const toolRef of propertyValue) {
                        toolRefs.push(new EntityReference(toolRef));
                    }
                }
                this.toolRefs = toolRefs;
                break;
            case "tools":
                let tools = [];
                if (propertyValue) {
                    for (const tool of propertyValue) {
                        tools.push(new EntityReference(tool));
                    }
                }
                this.tools = tools;
                break;
            case "toolPalette":
                this.toolPalette = new ToolPalette(propertyValue);
                break;
            case "pan":
                this.pan = InputUtilities.cleansePoint(propertyValue);
                break;
            case "zoom":
                this.zoom = InputUtilities.cleanseNumber(propertyValue);
                break;
            case "overlay":
                this.overlay = new Overlay(propertyValue);
                break;
        }
    }

    #applyPropertyInsert(propertyName, index, value) {
        switch (propertyName) {
            case "layers":
                this.insertLayer(new Layer(value), index);
                break;
            case "mapItemTemplates":
                this.insertMapItemTemplate(new MapItemTemplate(value), index);
                break;
            case "mapItemTemplateRefs":
                this.insertMapItemTemplateRef(new EntityReference(value), index);
                break;
            case "toolRefs":
                this.insertToolRef(new EntityReference(value), index);
                break;
            case "tools":
                this.insertTool(new Tool(value), index);
                break;
        }
    }

    #applyPropertyDelete(propertyName, value) {
        switch (propertyName) {
            case "layers":
                this.removeLayer(new Layer(value));
                break;
            case "mapItemTemplates":
                this.removeMapItemTemplate(new MapItemTemplate(value));
                break;
            case "mapItemTemplateRefs":
                this.removeMapItemTemplateRef(new EntityReference(value));
                break;
            case "toolRefs":
                this.removeToolRef(new EntityReference(value));
                break;
            case "tools":
                this.removeTool(new Tool(value));
                break;
        }
    }

    // ~~~

    // helpers
    #eventListeners;

    #onChange = (changeSet) => {
        if (!this.#changeSetStarted) {
            this.#hasUnsavedChanges = true;
            this.#logChangeSet(changeSet);
            if (this.#eventListeners[Change.ChangeEvent]) {
                for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                    listener(changeSet);
                }
            }
        }  
    }

    #getPropertyChange(propertyName, v1, v2) {
        return ChangeSet.getPropertyChange(Map.name, propertyName, v1, v2);
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

    #getListData(list) {
        return list ? list.map(x => x.getData ? x.getData() : x) : null;
    }
}
