
import { BuiltInTemplates, BuiltInTools, EntityReference, FileManager, Map, MapWorkerClient, MapWorkerInputMessageType, ToolType } from "../../../domain/references.js";
import { KitComponent, KitDependencyManager, KitMessenger, KitRenderer } from "../../../ui-kit.js";

export function createModel() {
    return new EditorModel();
}

export class EditorModel {

    // constants
    static NewFileRequestTopic = "NewFileRequestTopic";
    static SaveFileRequestTopic = "SaveFileRequestTopic";
    static OpenFileRequestTopic = "OpenFileRequestTopic";

    // instance fields
    #initialized = false;

    // methods
    async onRenderStart(componentId) {
        this.componentId = componentId;
        this.#initialize();
    }

    async onRenderComplete() {

        // toggle tools and canvas
        const map = await MapWorkerClient.getMap();
        const element = KitRenderer.getComponentElement(this.componentId);
        if (map) {
            element.querySelector("#map-container").classList.add("has-map");
        }
        else {
            element.querySelector("#map-container").classList.remove("has-map");
        }

        // get tool images
        const imgs = element.querySelectorAll(".tool-button img");
        for (const img of imgs) {
            img.setAttribute("src", img.getAttribute("data-src"));
            img.removeAttribute("data-src");
        }

        // initialize map worker
        const canvas = element.querySelector("#map-canvas");
        MapWorkerClient.initializeWorker(canvas, this.onMapChanged);
    }

    async onMapChanged(message) {
        //console.log("editor main onMapChanged");
    }

    toggleDropdown(dropdownId) {
        const appDocument = KitDependencyManager.getDocument();
        appDocument.getElementById(dropdownId).classList.toggle("show");
    }

    showDialog(dialogId) {
        const element = KitRenderer.getComponentElement(this.componentId);
        const dialogComponentId = element.querySelector(`#${dialogId}`).getAttribute("data-kit-component-id");
        const model = KitComponent.find(dialogComponentId).model;
        model.showDialog();
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

    async closeMap() {
        FileManager.fileHandle = null;
        await MapWorkerClient.setMap(null);
        KitRenderer.renderComponent(this.componentId);
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

    async onToolSelected(id, ref) {
        const element = KitRenderer.getComponentElement(this.componentId);
        let buttons = element.querySelectorAll(".editing-tool-button, .drawing-tool-button");
        for (const button of buttons) {
            button.classList.remove("active");
        }
        element.querySelector(`#${id}`).classList.add("active");
        const map = await MapWorkerClient.getMap();
        const tool = map.tools.find(t => EntityReference.areEqual(t.ref, ref));
        if (tool.toolType === ToolType.DrawingTool) {
            buttons = element.querySelectorAll(".map-item-template-button");
            for (const button of buttons) {
                button.classList.remove("active");
            }
        }
        const refData = tool?.ref ? tool.ref.getData() : null;
        await MapWorkerClient.postWorkerMessage({ messageType: MapWorkerInputMessageType.SetActiveTool, toolRefData: refData });
    }

    async onMapItemTemplateSelected(id, ref) {
        const element = KitRenderer.getComponentElement(this.componentId);
        let buttons = element.querySelectorAll(".map-item-template-button");
        for (const button of buttons) {
            button.classList.remove("active");
        }
        element.querySelector(`#${id}`).classList.add("active");
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

    // helpers
    #initialize() {
        if (!this.#initialized) {

            // initialize menu
            const appWindow = KitDependencyManager.getWindow();
            const appDocument = KitDependencyManager.getDocument();
            appWindow.onclick = function (event) {
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
            }

            // subscribe to topics
            KitMessenger.subscribe(EditorModel.NewFileRequestTopic, this.componentId, this.onNewFileRequested.name);
            KitMessenger.subscribe(EditorModel.SaveFileRequestTopic, this.componentId, this.onSaveFileRequested.name);
            KitMessenger.subscribe(EditorModel.OpenFileRequestTopic, this.componentId, this.onOpenFileRequested.name);

            // mark as initialized
            this.#initialized = true;
        }
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
        const builtInTools = await BuiltInTools.getTools();
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
        const map = new Map(mapData);
        await MapWorkerClient.setMap(map);
        KitRenderer.renderComponent(this.componentId);
    }

    static #mapToJson(map) {
        let json = null;
        if (map) {
            const data = map.getData();
            data.mapItemTemplateRefs = data.mapItemTemplateRefs.filter(ref => !ref.isFromTemplate);
            data.mapItemTemplates = data.mapItemTemplates.filter(mit => !mit.ref.isFromTemplate);
            data.toolRefs = data.toolRefs.filter(ref => !ref.isBuiltIn && !ref.isFromTemplate);
            data.tools = data.tools.filter(t => !t.ref.isBuiltIn && !t.ref.isFromTemplate);
            json = JSON.stringify(data);
        }
        return json;
    }
}
