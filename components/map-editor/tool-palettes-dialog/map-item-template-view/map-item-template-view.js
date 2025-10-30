
import {
    ChangeType,
    EntityReference,
    FileManager,
    Map,
    MapItemTemplate,
    MapWorkerClient,
    MapWorkerInputMessageType,
    PathStyle,
    PathStyleOption,
    PathStyleType,
    ToolPalette
} from "../../../../domain/references.js";
import { ToolPalettesDialogModel } from "../tool-palettes-dialog.js";

export function createModel() {
    return new MapItemTemplateViewModel();
}

class MapItemTemplateViewModel {

    // event handlers
    async init(kitElement, kitObjects) {
        this.#kitElement = kitElement;
        MapItemTemplateViewModel.#dialogModel = kitObjects.find(o => o.alias == "dialogModel")?.object;
        let mapItemTemplateId = MapItemTemplateViewModel.#dialogModel.getSelectedDetailComponentInfo().id;
        mapItemTemplateId = mapItemTemplateId.replace("map.item.template-", "");
        const ref = ToolPalettesDialogModel.deSerializeRef(mapItemTemplateId);
        MapItemTemplateViewModel.#map = await MapWorkerClient.getMap();
        MapItemTemplateViewModel.#mapItemTemplate
            = MapItemTemplateViewModel.#map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, ref));
    }

    // methods
    getDisplayName() {
        const ref = MapItemTemplateViewModel.#mapItemTemplate.ref;
        return ref.name.length > 25 ? ref.name.slice(0, 25) + "..." : ref.name;
    }

    isBuiltIn() {
        return MapItemTemplateViewModel.#mapItemTemplate.ref.isBuiltIn;
    }

    isFromTemplate() {
        return MapItemTemplateViewModel.#mapItemTemplate.ref.isFromTemplate;
    }

    isReadOnly() {
        const ref = MapItemTemplateViewModel.#mapItemTemplate.ref;
        return ref.isBuiltIn || ref.isFromTemplate;
    }

    async saveMapItemTemplate() {
        const validationResult = this.#validate();
        if (validationResult.isValid) {
            const currentMapItemTemplate = MapItemTemplateViewModel.#mapItemTemplate;
            const updatedMapItemTemplate = new MapItemTemplate(validationResult.mapItemTemplateData);
            let changes = [];
            if (EntityReference.areEqual(currentMapItemTemplate.ref, updatedMapItemTemplate.ref)) {
                changes = MapItemTemplateViewModel.#getUpdateChanges(currentMapItemTemplate, updatedMapItemTemplate);
            }
            else {
                changes = MapItemTemplateViewModel.#getAddChanges(currentMapItemTemplate, updatedMapItemTemplate);
            }
            if (changes.length > 0) {
                MapWorkerClient.postWorkerMessage({
                    messageType: MapWorkerInputMessageType.UpdateMap,
                    changeSet: { changes: changes }
                });
            }
        }
    }

    async deleteMapItemTemplate() {
        const map = MapItemTemplateViewModel.#map;
        const currentMapItemTemplate = MapItemTemplateViewModel.#mapItemTemplate;
        const mapItemTemplateIndex
            = map.mapItemTemplates.findIndex(mit => EntityReference.areEqual(mit.ref, currentMapItemTemplate.ref));
        const mapItemTemplateRefIndex
            = map.mapItemTemplateRefs.findIndex(mitr => EntityReference.areEqual(mitr, currentMapItemTemplate.ref));
        const changes = [
            {
                changeType: ChangeType.Delete,
                changeObjectType: Map.name,
                propertyName: "mapItemTemplates",
                itemIndex: mapItemTemplateIndex,
                itemValue: currentMapItemTemplate.getData()
            },
            {
                changeType: ChangeType.Delete,
                changeObjectType: Map.name,
                propertyName: "mapItemTemplateRefs",
                itemIndex: mapItemTemplateRefIndex,
                itemValue: currentMapItemTemplate.ref.getData()
            }
        ];
        const inPalette = MapItemTemplateViewModel.#isPaletteItemInPalettes(
            MapItemTemplateViewModel.#map.toolPalette.mapItemTemplatePalettes, currentMapItemTemplate.ref);
        if (inPalette) {
            const currentPalettes = MapItemTemplateViewModel.#getPalettesData(
                MapItemTemplateViewModel.#map.toolPalette.mapItemTemplatePalettes);
            const updatedPalettes = MapItemTemplateViewModel.#removePaletteItem(
                MapItemTemplateViewModel.#map.toolPalette.mapItemTemplatePalettes, currentMapItemTemplate.ref);
            changes.push({
                changeType: ChangeType.Edit,
                changeObjectType: ToolPalette.name,
                propertyName: "mapItemTemplatePalettes",
                oldValue: currentPalettes,
                newValue: updatedPalettes
            });
        }
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    getName() {
        return MapItemTemplateViewModel.#mapItemTemplate.ref.name;
    }

    getVersion() {
        return MapItemTemplateViewModel.#mapItemTemplate.ref.versionId;
    }

    getThumbnailSrc() {
        return MapItemTemplateViewModel.#mapItemTemplate.thumbnailSrc;
    }

    async browseThumbnail() {
        let fileHandles = null;
        try {
            fileHandles = await UIKit.window.showOpenFilePicker({
                types: [
                    {
                        description: "Image files",
                        accept: { "image/*": [".png", ".gif", ".jpeg", ".jpg"] }
                    }
                ]
            });
        }
        catch {
            return;
        }
        const fileHandle = fileHandles[0];
        const imageSource = await FileManager.getImageSource(fileHandle);
        const previewElement = this.#kitElement.querySelector("#map-item-template-thumbnail-preview");
        previewElement.src = imageSource;
    }

    async generateThumbnail(select) {
        let thumbnailSrc = MapItemTemplateViewModel.#getThumbnailSrcFromPathStyles();
        if (!thumbnailSrc) {
            const shape = this.#kitElement.querySelector("#thumbnail-generate").value;
            const thumbnailPathData = MapItemTemplateViewModel.#getThumbnailPathData(shape);
            let path2D = new Path2D(thumbnailPathData);
            const offscreenCanvas = new OffscreenCanvas(30, 30);
            const context = offscreenCanvas.getContext("2d");
            context.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
            const bounds = { x: 5, y: 5, width: 90, height: 90 };
            const map = MapItemTemplateViewModel.#map;
            map.zoom = 1;
            map.pan = { x: 0, y: 0 };
            const fillCount = MapItemTemplateViewModel.#mapItemTemplate.fills.length;
            for (let i = fillCount - 1; i > -1; i--) {
                let fill = MapItemTemplateViewModel.#mapItemTemplate.fills[i];
                await fill.setStyle(context, map, bounds, true);
                context.fill(path2D);
            }
            if (fillCount > 0) {
                const widestStroke = MapItemTemplateViewModel.#getWidestStroke();
                if (widestStroke) {
                    let strokeData = widestStroke.getData();
                    for (const option of strokeData.options) {
                        if (option.key == PathStyleOption.Width) {
                            option.value = 2;
                        }
                    }
                    let stroke = new PathStyle(strokeData);
                    await stroke.setStyle(context, map, bounds, true);
                    context.stroke(path2D);
                }
            }
            else {
                const strokes = MapItemTemplateViewModel.#mapItemTemplate.strokes ?? [];
                const strokeCount = strokes.length;
                let width = 8;
                for (let i = strokeCount - 1; i > -1; i--) {
                    width -= 3;
                    if (width <= 0) {
                        break;
                    }
                    let strokeData = strokes[i].getData();
                    for (const option of strokeData.options) {
                        if (option.key == PathStyleOption.Width) {
                            option.value = width;
                        }
                    }
                    let stroke = new PathStyle(strokeData);
                    await stroke.setStyle(context, map, bounds, false);
                    context.stroke(path2D);
                }
            }
            const blob = await offscreenCanvas.convertToBlob();
            thumbnailSrc = await MapItemTemplateViewModel.#getDataUrl(blob);
        }
        if (thumbnailSrc) {
            const previewElement = this.#kitElement.querySelector("#map-item-template-thumbnail-preview");
            previewElement.src = thumbnailSrc;
        }
    }

    getZGroup() {
        return MapItemTemplateViewModel.#mapItemTemplate.defaultZGroup;
    }

    getTags() {
        return MapItemTemplateViewModel.#mapItemTemplate.tags ?? "";
    }

    async editChild(childId) {
        const refId = ToolPalettesDialogModel.serializeRef(MapItemTemplateViewModel.#mapItemTemplate.ref);
        await MapItemTemplateViewModel.#dialogModel.selectNavItemByRefId(`${childId}-${refId}`);
    }

    validate() {
        this.#validate();
    }

    // helpers
    static #dialogModel = null;
    #kitElement = null;
    static #map = null;
    static #mapItemTemplate = null;

    #validate() {
        let isValid = true;
        const validationLabels = this.#kitElement.querySelectorAll(".validation-message");
        for (const label of validationLabels) {
            label.innerHTML = "";
        }

        // validate name
        const name = this.#kitElement.querySelector("#map-item-template-name").value;
        if (name.length == 0) {
            this.#kitElement.querySelector("#map-item-template-name-validation").innerHTML = "Name is required.";
            isValid = false;
        }
        if (!name.match(/^[a-zA-Z0-9\s()]*$/)) {
            this.#kitElement.querySelector("#map-item-template-name-validation").innerHTML
                = "Invalid character(s). Alpha-numeric only.";
            isValid = false;
        }

        // validate version
        const versionId = parseInt(this.#kitElement.querySelector("#map-item-template-version").value);
        if (isNaN(versionId)) {
            this.#kitElement.querySelector("#map-item-template-version-validation").innerHTML = "Version is required.";
            isValid = false;
        }
        if (versionId < 1 || versionId > 1000) {
            this.#kitElement.querySelector("#map-item-template-version-validation").innerHTML
                = "Version must be an integer between 1 and 1000.";
            isValid = false;
        }
        const newRef = {
            name: name,
            versionId: versionId,
            isBuiltIn: false,
            isFromTemplate: false
        };
        const isStartingRef = EntityReference.areEqual(MapItemTemplateViewModel.#mapItemTemplate.ref, newRef);
        if (!isStartingRef && MapItemTemplateViewModel.#map.mapItemTemplateRefs.some(mitr => EntityReference.areEqual(mitr, newRef))) {
            this.#kitElement.querySelector("#map-item-template-name-validation").innerHTML
                = "The combination of name and version must be unique.";
            isValid = false;
        }

        // validate thumbnail
        const thumbnailSrc = this.#kitElement.querySelector("#map-item-template-thumbnail-preview").src;
        if (!thumbnailSrc || thumbnailSrc.length == 0) {
            this.#kitElement.querySelector("#map-item-template-thumbnail-validation").innerHTML = "Thumbnail is required.";
            isValid = false;
        }

        // validate z-group
        const defaultZGroup = parseInt(this.#kitElement.querySelector("#map-item-template-z-group")?.value);
        if (isNaN(defaultZGroup)) {
            this.#kitElement.querySelector("#map-item-template-z-group-validation").innerHTML
                = "Default z-order rendering group is required.";
            isValid = false;
        }
        if (defaultZGroup < -10 || defaultZGroup > 10) {
            this.#kitElement.querySelector("#map-item-template-z-group-validation").innerHTML
                = "Default z-order rendering group must be an integer between -10 and 10.";
            isValid = false;
        }

        // validate tags
        const tags = this.#kitElement.querySelector("#map-item-template-tags").value;
        if (tags && !tags.match(/^[a-zA-Z0-9\s()]*$/)) {
            this.#kitElement.querySelector("#map-item-template-tags-validation").innerHTML
                = "Invalid character(s). Alpha-numeric only.";
            isValid = false;
        }

        // get fills and strokes
        const fills = [];
        for (const fill of MapItemTemplateViewModel.#mapItemTemplate.fills) {
            fills.push(fill.getData());
        }
        const strokes = [];
        for (const stroke of MapItemTemplateViewModel.#mapItemTemplate.strokes) {
            fills.push(stroke.getData());
        }

        // enable/disable save button
        const enabled = (isValid && !this.isReadOnly());
        this.#kitElement.querySelector("#save-button").disabled = !enabled;

        return {
            isValid: isValid,
            mapItemTemplateData: {
                ref: newRef,
                thumbnailSrc: thumbnailSrc,
                fills: fills,
                strokes: strokes,
                shadow: MapItemTemplateViewModel.#mapItemTemplate.shadow.getData(),
                defaultZGroup: defaultZGroup,
                caption: MapItemTemplateViewModel.#mapItemTemplate.caption.getData(),
                tags: tags
            }
        };
    }

    static #getUpdateChanges(currentMapItemTemplate, updatedMapItemTemplate) {
        const changes = [];
        if (currentMapItemTemplate.thumbnailSrc != updatedMapItemTemplate.thumbnailSrc) {
            changes.push({
                changeType: ChangeType.Edit,
                changeObjectType: MapItemTemplate.name,
                propertyName: "thumbnailSrc",
                oldValue: currentMapItemTemplate.thumbnailSrc,
                newValue: updatedMapItemTemplate.thumbnailSrc,
                mapItemTemplateRef: currentMapItemTemplate.ref.getData()
            });
        }
        if (currentMapItemTemplate.defaultZGroup != updatedMapItemTemplate.defaultZGroup) {
            changes.push({
                changeType: ChangeType.Edit,
                changeObjectType: MapItemTemplate.name,
                propertyName: "defaultZGroup",
                oldValue: currentMapItemTemplate.defaultZGroup,
                newValue: updatedMapItemTemplate.defaultZGroup,
                mapItemTemplateRef: currentMapItemTemplate.ref.getData()
            });
        }
        if (currentMapItemTemplate.tags != updatedMapItemTemplate.tags) {
            changes.push({
                changeType: ChangeType.Edit,
                changeObjectType: MapItemTemplate.name,
                propertyName: "tags",
                oldValue: currentMapItemTemplate.tags,
                newValue: updatedMapItemTemplate.tags,
                mapItemTemplateRef: currentMapItemTemplate.ref.getData()
            });
        }     
        return changes;
    }

    static #getAddChanges(currentMapItemTemplate, updatedMapItemTemplate) {
        const map = MapItemTemplateViewModel.#map;
        const mapItemTemplateRefIndex
            = map.mapItemTemplateRefs.findIndex(mitr => EntityReference.areEqual(mitr, currentMapItemTemplate.ref));
        const mapItemTemplateIndex
            = map.mapItemTemplates.findIndex(mit => EntityReference.areEqual(mit.ref, currentMapItemTemplate.ref));
        const changes = [];
        changes.push({
            changeType: ChangeType.Delete,
            changeObjectType: Map.name,
            propertyName: "mapItemTemplateRefs",
            itemIndex: mapItemTemplateRefIndex,
            itemValue: currentMapItemTemplate.ref.getData()
        });
        changes.push({
            changeType: ChangeType.Delete,
            changeObjectType: Map.name,
            propertyName: "mapItemTemplates",
            itemIndex: mapItemTemplateIndex,
            itemValue: currentMapItemTemplate.getData()
        });
        changes.push({
            changeType: ChangeType.Insert,
            changeObjectType: Map.name,
            propertyName: "mapItemTemplateRefs",
            itemIndex: mapItemTemplateRefIndex,
            itemValue: updatedMapItemTemplate.ref.getData()
        });
        changes.push({
            changeType: ChangeType.Insert,
            changeObjectType: Map.name,
            propertyName: "mapItemTemplates",
            itemIndex: mapItemTemplateIndex,
            itemValue: updatedMapItemTemplate.getData()
        });
        const inPalette = MapItemTemplateViewModel.#isPaletteItemInPalettes(
            MapItemTemplateViewModel.#map.toolPalette.mapItemTemplatePalettes, currentMapItemTemplate.ref);
        if (inPalette) {
            const currentPalettes = MapItemTemplateViewModel.#getPalettesData(
                MapItemTemplateViewModel.#map.toolPalette.mapItemTemplatePalettes);
            const updatedPalettes = MapItemTemplateViewModel.#replacePaletteItem(
                MapItemTemplateViewModel.#map.toolPalette.mapItemTemplatePalettes,
                currentMapItemTemplate.ref,
                updatedMapItemTemplate.ref);
            changes.push({
                changeType: ChangeType.Edit,
                changeObjectType: ToolPalette.name,
                propertyName: "mapItemTemplatePalettes",
                oldValue: currentPalettes,
                newValue: updatedPalettes
            });
        }
        return changes;
    }

    static #isPaletteItemInPalettes(palettes, paletteItem) {
        for (const palette of palettes) {
            for (const item of palette) {
                if (EntityReference.areEqual(item, paletteItem)) {
                    return true;
                }
            }
        }
        return false
    }

    static #removePaletteItem(palettes, paletteItem) {
        const newPalettesData = [];
        for (const palette of palettes) {
            const newPaletteData = [];
            for (const item of palette) {
                if (!EntityReference.areEqual(item, paletteItem)) {
                    newPaletteData.push(item.getData());
                }
            }
            if (newPaletteData.length > 0) {
                newPalettesData.push(newPaletteData);
            }
        }
        return newPalettesData;
    }

    static #replacePaletteItem(palettes, oldPaletteItem, newPaletteItem) {
        const newPalettesData = [];
        for (const palette of palettes) {
            const newPaletteData = [];
            for (const item of palette) {
                if (EntityReference.areEqual(item, oldPaletteItem)) {
                    newPaletteData.push(newPaletteItem.getData());
                }
                else {
                    newPaletteData.push(item.getData());
                }
            }
            newPalettesData.push(newPaletteData);
        }
        return newPalettesData;
    }

    static #getPalettesData(palettes) {
        const palettesData = [];
        for (const palette of palettes) {
            const paletteData = [];
            for (const item of palette) {
                paletteData.push(item.getData());
            }
            palettesData.push(paletteData);
        }
        return palettesData;
    }

    static #getThumbnailSrcFromPathStyles() {
        const mapItemTemplate = MapItemTemplateViewModel.#mapItemTemplate;
        for (const pathStyle of mapItemTemplate.fills) {
            const styleType = pathStyle.getStyleOptionValue(PathStyleOption.PathStyleType);
            if (styleType == PathStyleType.TileFill || styleType == PathStyleType.ImageArrayFill) {
                return MapItemTemplateViewModel.#getImageThumbnailSrc(pathStyle)
            }
        }
        return null;
    }

    static #getImageThumbnailSrc(pathStyle) {
        const styleType = pathStyle.getStyleOptionValue(PathStyleOption.PathStyleType);
        if (styleType == PathStyleType.TileFill || styleType == PathStyleType.TileStroke) {
            return pathStyle.getStyleOptionValue(PathStyleOption.TileImageSource);
        }
        let src = pathStyle.getStyleOptionValue(PathStyleOption.ImageArraySource1);
        if (!src) {
            src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADDSURBVEhL7ZXtCcMgEIZt93GLTGCH6U/xZ4apE3QLB0p5DwPXw4rY00KaByJqIM99BDW/4oLBe7/RKhNCoP2RXDGklGgB+HwkJJY4594qMIKi+HF/kpw/+ZUa1Et82FpLGyg1xJLbuuSZMTHGr/+BZjGHBwF6AukSS3qqoSLmtAahLubUWjJULNkDQQDHyXhqj1tlnC5xrYStNIt7sqrxUayRVY2iGGiLJMXbabQUFMUzOMXTOMXT+GMxjsr9uDwwxrwASAKaw390ze0AAAAASUVORK5CYII=";
        }
        return src;
    }

    static #getThumbnailPathData(shape) {
        let pathData = "M 4,4 l 20,0 0,20 -20,0 0,-20";
        if (shape == "circle") {
            pathData = "M 14,4 a 10 10 0 0 0 0 20 a 10 10 0 0 0 0 -20";
        }
        const hasFills = MapItemTemplateViewModel.#mapItemTemplate.fills.length > 0;
        if (shape == "lines") {
            if (hasFills) {
                pathData = "M 14,4 l 10,0 0,20 -20,0 0,-10 10,0 0,-10";
            }
            else {
                pathData = "M 5,25 l 10,-15 10,0";
            }
        }
        if (shape == "path") {
            if (hasFills) {
                pathData = "M 8,0 M 10.5,8.25 Q 3.75 1, 2.5 3.75 T 6 12  T 6 17  T 6 22  T 13.5 23.25 T 21 22 T 23.5 13.25 T 14.75 7";
            }
            else {
                pathData = "M 5,15 Q10,5 15,15 T25,15";
            }
        }
        if (hasFills) {
            pathData += " z";
        }
        return pathData;
    }

    static #getWidestStroke() {
        let widestStroke = null;
        let maxWidth = 0;
        const strokes = MapItemTemplateViewModel.#mapItemTemplate.strokes ?? [];
        for (const stroke of strokes) {
            let width = stroke.getStyleOptionValue(PathStyleOption.Width);
            if (width > maxWidth) {
                widestStroke = stroke;
                maxWidth = width;
            }
        }
        return widestStroke;
    }

    static async #getDataUrl(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(blob);
        });
    }

}
