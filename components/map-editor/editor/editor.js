
import {
    BuiltInTemplates,
    BuiltInTools,
    ChangeType,
    EntityReference,
    FileManager,
    InputUtilities,
    Map,
    MapWorkerClient,
    MapWorkerInputMessageType,
    MapWorkerOutputMessageType
} from "../../../domain/references.js";
import { KitComponent, KitDependencyManager, KitMessenger, KitRenderer } from "../../../ui-kit.js";

export function createModel() {
    return new EditorModel();
}

export class EditorModel {

    // constants
    static NewFileRequestTopic = "NewFileRequestTopic";
    static SaveFileRequestTopic = "SaveFileRequestTopic";
    static OpenFileRequestTopic = "OpenFileRequestTopic";
    static CanvasResizeRequestTopic = "CanvasResizeRequestTopic";

    // instance fields
    #componentId;
    #componentElement;
    #toolsPinned;
    #toolCursor;

    // methods
    async onRenderStart(componentId) {
        this.#componentId = componentId;
    }

    async onRenderComplete() {
        this.#componentElement = KitRenderer.getComponentElement(this.#componentId);
        this.#initializeMenu();
        this.#subscribeToTopics();
        await this.#initializeToolsAndCanvas();
        this.#initializeMapWorker();
    }

    onMapChanged = async (message) => {
        // TODO: move this central change management?
        if (message?.messageType === MapWorkerOutputMessageType.ChangeCursor) {
            this.#setMapCursor(message.data?.cursor);
            await MapWorkerClient.postWorkerMessage({ messageType: MapWorkerInputMessageType.CursorChanged, cursor: message.data?.cursor });
        }
        if (message?.messageType === MapWorkerOutputMessageType.MapUpdated && message?.data?.changeSet) {
            const map = await MapWorkerClient.getMap();
            this.#componentElement.querySelector("#menuEditUndo").disabled = !map.canUndo();
            this.#componentElement.querySelector("#buttonUndo").disabled = !map.canUndo();
            this.#componentElement.querySelector("#menuEditRedo").disabled = !map.canRedo();
            this.#componentElement.querySelector("#buttonRedo").disabled = !map.canRedo();
            if (message?.data?.changeSet?.changes) {
                for (const change of message.data.changeSet.changes) {
                    if (change.changeObjectType == Map.name) {
                        if (change.propertyName === "zoom") {
                            const zoomLabel = this.#componentElement.querySelector("#zoom-label");
                            zoomLabel.innerHTML = parseFloat(map.zoom * 100).toFixed(0) + "%"
                        }
                    }
                }
            }
        }
    }

    toggleDropdown(dropdownId) {
        const appDocument = KitDependencyManager.getDocument();
        appDocument.getElementById(dropdownId).classList.toggle("show");
    }

    showDialog(dialogId) {
        const dialogComponentId = this.#componentElement.querySelector(`#${dialogId}`).getAttribute("data-kit-component-id");
        const model = KitComponent.find(dialogComponentId).model;
        model.showDialog();
    }

    async isSaveDisabled() {
        const map = await MapWorkerClient.getMap();
        if (map && 'showSaveFilePicker' in KitDependencyManager.getWindow()) {
            return null;
        }
        else {
            return "disabled";
        }
    }

    isOpenDisabled() {
        if ('showOpenFilePicker' in KitDependencyManager.getWindow()) {
            return null;
        }
        else {
            return "disabled";
        }
    }

    async saveMap() {
        if (FileManager.fileHandle) {
            const map = await MapWorkerClient.getMap();
            const json = EditorModel.#mapToJson(map);
            await FileManager.saveMap(json);
        }
        else {
            this.showDialog("file-save-dialog-component");
        }
    }

    async isCloseDisabled() {
        const map = await MapWorkerClient.getMap();
        if (map) {
            return null;
        }
        else {
            return "disabled";
        }
    }

    async closeMap() {
        FileManager.fileHandle = null;
        await MapWorkerClient.setMap(null);
        KitRenderer.renderComponent(this.#componentId);
    }

    async isUndoDisabled() {
        const map = await MapWorkerClient.getMap();
        if (map?.canUndo()) {
            return null;
        }
        return "disabled";
    }

    async undo() {
        MapWorkerClient.postWorkerMessage({ messageType: MapWorkerInputMessageType.Undo });
    }

    async isRedoDisabled() {
        const map = await MapWorkerClient.getMap();
        if (map?.canRedo()) {
            return null;
        }
        return "disabled";
    }

    async redo() {
        MapWorkerClient.postWorkerMessage({ messageType: MapWorkerInputMessageType.Redo });
    }

    async isEditSelectionDisabled() {
        return "disabled";
    }

    async isPasteDisabled() {
        return "disabled";
    }

    async isZoomDisabled() {
        const map = await MapWorkerClient.getMap();
        return map ? null : "disabled";
    }

    async isResizeCanvasDisabled() {
        const map = await MapWorkerClient.getMap();
        return map ? null : "disabled";
    }

    async isOverlayDisabled() {
        const map = await MapWorkerClient.getMap();
        return map ? null : "disabled";
    }

    async isReadOnlyViewerDisabled() {
        return "disabled";
    }

    async toggleToolsPinned() {
        this.#toolsPinned = !this.#toolsPinned;
        const pinnedIcon = this.#componentElement.querySelector("#pinned-icon");
        if (this.#toolsPinned) {
            pinnedIcon.classList.add("pinned");
        }
        else {
            pinnedIcon.classList.remove("pinned");
        }
        this.#slideTools();
    }

    async getToolPalettes(paletteType) {
        let palettes = [];
        const map = await MapWorkerClient.getMap();
        if (paletteType === "EditingTools" && map?.toolPalette?.editingToolPalettes) {
            palettes = map.toolPalette.editingToolPalettes;
        }
        if (paletteType === "DrawingTools" && map?.toolPalette?.drawingToolPalettes) {
            palettes = map.toolPalette.drawingToolPalettes;
        }
        if (paletteType === "MapItemTemplates" && map?.toolPalette?.mapItemTemplatePalettes) {
            palettes = map.toolPalette.mapItemTemplatePalettes;
        }
        return palettes;
    }

    async getToolPaletteItems(paletteType, paletteIndex) {
        const items = [];
        const map = await MapWorkerClient.getMap();
        const palettes = await this.getToolPalettes(paletteType);
        let palette = null;
        if (palettes && palettes.length > paletteIndex) {
            palette = palettes[paletteIndex];
        }
        if (palette && map) {
            if (paletteType === "MapItemTemplates") {
                let itemIndex = 0;
                for (const mapItemTemplateRef of palette) {
                    const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, mapItemTemplateRef));
                    if (mapItemTemplate) {
                        items.push({ id: `${paletteType}-${paletteIndex}-${itemIndex}`, data: mapItemTemplate });
                    }
                    itemIndex++;
                }
            }
            else {
                let itemIndex = 0;
                for (const toolRef of palette) {
                    const tool = map.tools.find(t => EntityReference.areEqual(t.ref, toolRef));
                    if (tool) {
                        items.push({ id: `${paletteType}-${paletteIndex}-${itemIndex}`, data: tool });
                    }
                    itemIndex++;
                }
            }
        }
        return items;
    }

    async onToolReset() {
        let buttons = this.#componentElement.querySelectorAll(".editing-tool-button, .drawing-tool-button");
        for (const button of buttons) {
            button.classList.remove("active");
        }
        this.#toolCursor = "default";
        this.#setMapCursor();
        await MapWorkerClient.postWorkerMessage({ messageType: MapWorkerInputMessageType.SetActiveTool, toolRefData: null });
    }

    async onToolSelected(id, ref) {
        let buttons = this.#componentElement.querySelectorAll(".editing-tool-button, .drawing-tool-button");
        for (const button of buttons) {
            button.classList.remove("active");
        }
        this.#componentElement.querySelector(`#${id}`).classList.add("active");
        const map = await MapWorkerClient.getMap();
        const tool = map.tools.find(t => EntityReference.areEqual(t.ref, ref));
        const cursorSrc = `data:image/svg+xml;base64,${btoa(tool.cursorSrc)}`;
        this.#toolCursor = `url(${cursorSrc}) ${tool.cursorHotspot.x} ${tool.cursorHotspot.y}, crosshair`;
        this.#setMapCursor();
        const refData = tool?.ref ? tool.ref.getData() : null;
        await MapWorkerClient.postWorkerMessage({ messageType: MapWorkerInputMessageType.SetActiveTool, toolRefData: refData });
    }

    async onMapItemTemplateReset() {
        let buttons = this.#componentElement.querySelectorAll(".map-item-template-button");
        for (const button of buttons) {
            button.classList.remove("active");
        }
        await MapWorkerClient.postWorkerMessage({ messageType: MapWorkerInputMessageType.SetActiveMapItemTemplate, mapItemTemplateRefData: null });
    }

    async onMapItemTemplateSelected(id, ref) {
        let buttons = this.#componentElement.querySelectorAll(".map-item-template-button");
        for (const button of buttons) {
            button.classList.remove("active");
        }
        this.#componentElement.querySelector(`#${id}`).classList.add("active");
        const map = await MapWorkerClient.getMap();
        const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, ref));
        const mapItemTemplateRefData = mapItemTemplate?.ref ? mapItemTemplate.ref.getData() : null;
        await MapWorkerClient.postWorkerMessage({ messageType: MapWorkerInputMessageType.SetActiveMapItemTemplate, mapItemTemplateRefData: mapItemTemplateRefData });
    }

    async onNewFileRequested(message) {
        FileManager.fileHandle = null;
        await MapWorkerClient.setMap(null);
        const templateRef = message.templateRef;
        let template = null;
        if (templateRef) {
            if (templateRef.isBuiltIn) {
                template = BuiltInTemplates.getTemplate(templateRef);
            }
            else {
                // TODO: get template from api
            }
        }
        const mapData = {};
        if (template) {
            mapData.templateRef = template.ref.getData();
            mapData.layers = [];
            for (const layer of template.layers) {
                mapData.layers.push(layer.getData());
            }
            mapData.activeLayer = template.activeLayer;
            mapData.toolPalette = template.toolPalette.getData();
            mapData.overlay = template.overlay.getData();
        }
        await this.#openMap(mapData, template);
    }

    async onOpenFileRequested(message) {
        FileManager.fileHandle = message.fileHandle;
        const json = await FileManager.openMap(message.fileHandle);
        const mapData = JSON.parse(json);
        let template = null;
        if (mapData.templateRef) {
            if (mapData.templateRef.isBuiltIn) {
                template = BuiltInTemplates.getTemplate(mapData.templateRef);
            }
        }
        await this.#openMap(mapData, template);
    }

    async onSaveFileRequested(message) {
        const map = await MapWorkerClient.getMap();
        const json = EditorModel.#mapToJson(map);
        FileManager.fileHandle = message.fileHandle;
        await FileManager.saveMap(json);
    }

    async onCanvasResizeRequested(message) {
        const currentCanvas = this.#componentElement.querySelector("#map-canvas");
        const appDocument = KitDependencyManager.getDocument();
        const newCanvas = appDocument.createElement("canvas");
        newCanvas.id = "map-canvas";
        newCanvas.height = message.height;
        newCanvas.width = message.width;
        currentCanvas.parentNode.replaceChild(newCanvas, currentCanvas); 
        this.#initializeMapWorker();
    }

    async getZoom() {      
        let zoom = "";
        const map = await MapWorkerClient.getMap();
        if (map) {
            zoom = parseFloat(map.zoom * 100).toFixed(0) + "%"
        }
        return zoom;
    }

    // helpers
    #initializeMenu() {
        const appDocument = KitDependencyManager.getDocument();
        appDocument.addEventListener('click', (event) => {
            const dropDownId = event.target.getAttribute("data-dropdown-id");
            const dropdowns = appDocument.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                if (dropdowns[i].id != dropDownId) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        });
    }

    #subscribeToTopics() {
        KitMessenger.subscribe(EditorModel.NewFileRequestTopic, this.#componentId, this.onNewFileRequested.name);
        KitMessenger.subscribe(EditorModel.SaveFileRequestTopic, this.#componentId, this.onSaveFileRequested.name);
        KitMessenger.subscribe(EditorModel.OpenFileRequestTopic, this.#componentId, this.onOpenFileRequested.name);
        KitMessenger.subscribe(EditorModel.CanvasResizeRequestTopic, this.#componentId, this.onCanvasResizeRequested.name);
    }

    async #initializeToolsAndCanvas() {
        const map = await MapWorkerClient.getMap();
        const toolsElement = this.#componentElement.querySelector("#tools");
        const mapContainerElement = this.#componentElement.querySelector("#map-container");
        if (map) {
            toolsElement.classList.add("has-map");
            mapContainerElement.classList.add("has-map");
        }
        else {
            toolsElement.classList.remove("has-map");
            mapContainerElement.classList.remove("has-map");
        }
        toolsElement.addEventListener("mouseleave", (event) => this.#slideTools());
        toolsElement.addEventListener("mouseenter", (event) => this.#slideTools(true));
        if (map) {
            this.#toolsPinned = false;
            this.toggleToolsPinned();
        }
    }

    #initializeMapWorker() {
        const appDocument = KitDependencyManager.getDocument();
        const canvas = this.#componentElement.querySelector("#map-canvas");
        MapWorkerClient.initializeWorker(appDocument, canvas, this.onMapChanged, EditorModel.#getBaseUrl());
    }

    #slideTools = (slideOpen) => {
        let toolsLeft = "0px";
        if (!this.#toolsPinned && !slideOpen) {
            toolsLeft = "-170px";
        }
        const appDocument = KitDependencyManager.getDocument();
        const documentElement = appDocument.documentElement;
        documentElement.style.setProperty("--editor-tool-left", toolsLeft);
    }

    async #openMap(mapData, template) {

        // get map item templates
        if (!mapData.mapItemTemplateRefs) {
            mapData.mapItemTemplateRefs = [];
        }
        if (!mapData.mapItemTemplates) {
            mapData.mapItemTemplates = [];
        }
        if (template?.mapItemTemplates) {
            for (const mapItemTemplate of template.mapItemTemplates) {
                const data = mapItemTemplate.getData();
                let toolPaletteItems = [];
                if (mapData.toolPalette?.mapItemTemplatePalettes) {
                    for (const mapItemTemplatePalette of mapData.toolPalette.mapItemTemplatePalettes) {
                        toolPaletteItems = mapItemTemplatePalette.filter(ref => EntityReference.areEqual(ref, data.ref));
                        for (const ref of toolPaletteItems) {
                            ref.isFromTemplate = true;
                        }
                    }  
                }
                data.ref.isFromTemplate = true; 
                mapData.mapItemTemplateRefs.push(data.ref);
                mapData.mapItemTemplates.push(data);
            }
        }

        // get tools
        if (!mapData.toolRefs) {
            mapData.toolRefs = [];
        }
        if (!mapData.tools) {
            mapData.tools = [];
        }
        const builtInTools = await BuiltInTools.getTools(EditorModel.#getBaseUrl());
        for (const builtInTool of builtInTools) {
            const data = builtInTool.getData();
            mapData.toolRefs.push(data.ref);
            mapData.tools.push(data);
        }
        if (template?.tools) {
            const templateTools = template.tools.filter(t => !t.ref.isBuiltIn);
            for (const templateTool of templateTools) {
                const data = templateTool.getData();
                let toolPaletteItems = [];
                if (mapData.toolPalette?.editingToolPalettes) {
                    for (const editingToolPalette of mapData.toolPalette.editingToolPalettes) {
                        toolPaletteItems = editingToolPalette.filter(ref => EntityReference.areEqual(ref, data.ref));
                        for (const ref of toolPaletteItems) {
                            ref.isFromTemplate = true;
                        }
                    }
                }
                if (mapData.toolPalette?.drawingToolPalettes) {
                    for (const drawingToolPalette of mapData.toolPalette.drawingToolPalettes) {
                        toolPaletteItems = drawingToolPalette.filter(ref => EntityReference.areEqual(ref, data.ref));
                        for (const ref of toolPaletteItems) {
                            ref.isFromTemplate = true;
                        }
                    }
                }
                data.ref.isFromTemplate = true;
                mapData.toolRefs.push(data.ref);
                mapData.tools.push(data);
            }
        }
        // TODO: get external tools

        // display
        await MapWorkerClient.setMap(new Map(mapData));
        KitRenderer.renderComponent(this.#componentId);
    }

    #setMapCursor(cursorName) {
        const canvas = this.#componentElement.querySelector("#map-canvas");
        switch (cursorName) {
            case "Rotate":
                const cursorSrc = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 100 100"><g stroke="black" stroke-width="2" fill="white" stroke-linecap="round"><path d="M 0,0 m 50,90 a 40 40 0 1 1 40 -40 l 10,0 -15,15 -15,-15 10,0 a 30 30 0 1 0 -30 30 z"></path><path d="M 0,0 m 50,45 a 5 5 0 0 0 0 10 a 5 5 0 0 0 0 -10 z"></path></g></svg>')}`;
                const rotateCursor = `url(${cursorSrc}) 15 15, crosshair`;
                canvas.style.cursor = rotateCursor;
                break;
            case "ResizeNW":
                canvas.style.cursor = "nw-resize";
                break;
            case "ResizeN":
                canvas.style.cursor = "n-resize";
                break;
            case "ResizeNE":
                canvas.style.cursor = "ne-resize";
                break;
            case "ResizeE":
                canvas.style.cursor = "e-resize";
                break;
            case "ResizeSE":
                canvas.style.cursor = "se-resize";
                break;
            case "ResizeS":
                canvas.style.cursor = "s-resize";
                break;
            case "ResizeSW":
                canvas.style.cursor = "sw-resize";
                break;
            case "ResizeW":
                canvas.style.cursor = "w-resize";
                break;
            case "Move":
                canvas.style.cursor = "grab";
                break;
            default:
                canvas.style.cursor = this.#toolCursor;
        }
    }

    static #getBaseUrl() {
        const appWindow = KitDependencyManager.getWindow();
        return `${appWindow.location.protocol}//${appWindow.location.host}`;
    }

    static #mapToJson(map) {
        let json = null;
        if (map) {
            const data = map.getData();
            data.mapItemTemplateRefs = data.mapItemTemplateRefs.filter(ref => !ref.isFromTemplate);
            data.mapItemTemplates = data.mapItemTemplates.filter(mit => !mit.ref.isFromTemplate);
            data.toolRefs = data.toolRefs.filter(ref => !ref.isBuiltIn && !ref.isFromTemplate);
            data.tools = data.tools.filter(t => !t.ref.isBuiltIn && !t.ref.isFromTemplate);
            data.changeLog = null;
            data.undoLog = null;
            json = JSON.stringify(data);
        }
        return json;
    }
}
