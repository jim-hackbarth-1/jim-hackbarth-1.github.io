
import { KitComponent, KitMessenger, KitRenderer } from "../../../../ui-kit.js";
import {
    ChangeType,
    EntityReference,
    FileManager,
    MapItem,
    MapItemTemplate,
    MapWorkerClient,
    MapWorkerInputMessageType,
    PathStyle,
    PathStyleOption,
    PathStyleType,
    ToolPalette
} from "../../../../domain/references.js";
import { EditorModel } from "../../editor/editor.js";
import { ToolPaletteDialogModel } from "../tool-palette-dialog.js";
import { DomHelper } from "../../../shared/dom-helper.js";

export function createModel() {
    return new MapItemTemplateViewModel();
}

class MapItemTemplateViewModel {

    // event handlers
    async onRenderStart(componentId, modelInput) {
        this.componentId = componentId;
        this.mapItemTemplate = modelInput.mapItemTemplate;
    }

    async onRenderComplete() {
        KitMessenger.subscribe(EditorModel.MapUpdatedNotificationTopic, this.componentId, this.onMapUpdated.name);
        const ifMapItemTemplateVisibleComponent = DomHelper.findComponentByElementId(this.#componentElement, "if-map-item-template-visible");
        ifMapItemTemplateVisibleComponent.addEventListener(
            KitComponent.OnRenderCompleteEvent, this.onIfMapItemTemplateVisibleRenderComplete);
        this.#completeRender();
    }

    onIfMapItemTemplateVisibleRenderComplete = async () => {
        this.#completeRender();
    }

    async onMapUpdated(message) {
        const map = await MapWorkerClient.getMap();
        if (this.mapItemTemplate) {
            this.mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(this.mapItemTemplate.ref, mit.ref));
            let reRender = false;
            if (message?.data?.changeSet?.changes) {   
                const mapItemTemplateChange = message.data.changeSet.changes.some(c =>
                    EntityReference.areEqual(this.mapItemTemplate.ref, c.mapItemTemplateRef));
                reRender = mapItemTemplateChange;
            }
            if (reRender) {
                await DomHelper.reRenderElement(this.#componentElement, "if-map-item-template-visible");
            }
        }
    }

    onKeyDown(event) {
        event.stopPropagation();
    }

    onDetailsToggleEvent(event) {
        const detailsState = this.#getDetailsState();
        let stateItem = detailsState.find(x => x.id == event.target.id);
        if (stateItem) {
            stateItem.isOpen = event.target.open;
        }
        else {
            stateItem = { id: event.target.id, isOpen: event.target.open };
            detailsState.push(stateItem);
        }
        this.#detailsState = detailsState;
        const section = event.target.querySelector("section");
        section.scrollIntoView();
    }

    // methods
    isVisible() {
        return this.mapItemTemplate ? true : false;
    }

    isDisabled() {
        return (!this.mapItemTemplate || this.mapItemTemplate.ref.isBuiltIn || this.mapItemTemplate.ref.isFromTemplate) ? true : false;
    }

    isDisabledAttribute() {
        return this.isDisabled() ? "disabled" : null;
    }

    isBuiltIn() {
        return this.mapItemTemplate.ref.isBuiltIn;
    }

    isFromTemplate() {
        return this.mapItemTemplate.ref.isFromTemplate;
    }

    getName() {
        return this.mapItemTemplate.ref.name;
    }

    getVersion() {
        return this.mapItemTemplate.ref.versionId;
    }

    getThumbnailSource() {
        return this.mapItemTemplate.thumbnailSrc;
    }

    getTags() {
        return this.mapItemTemplate.tags ?? "";
    }

    getDefaultZGroup() {
        return this.mapItemTemplate.defaultZGroup ?? 0;
    }

    getPathStyleInfo(isFill, isStroke) {
        return {
            mapItemTemplateRef: this.mapItemTemplate?.ref,
            isFill: isFill,
            isStroke: isStroke,
            id: isFill ? this.#currentFill?.id : this.#currentStroke?.id
        };
    }

    getMapItemTemplate() {
        return this.mapItemTemplate;
    }

    async browseThumbnail() {
        let fileHandles = null;
        try {
            fileHandles = await window.showOpenFilePicker({
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
        const dataElement = DomHelper.getElement(this.#componentElement, "#thumbnail-data");
        dataElement.value = imageSource;
        await this.update("thumbnailSrc");
    }

    async generateThumbnail() {
        let thumbnailSrc = this.#getThumbnailSrcFromPathStyles();
        if (!thumbnailSrc) {
            const defaultShape = DomHelper.getElement(this.#componentElement, "#thumbnail-shape-select").value;
            const thumbnailPathData = this.#getThumbnailPathData(defaultShape);
            let path2D = new Path2D(thumbnailPathData);
            const offscreenCanvas = new OffscreenCanvas(30, 30);
            const context = offscreenCanvas.getContext("2d");
            context.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
            const bounds = { x: 5, y: 5, width: 90, height: 90 };
            const map = await MapWorkerClient.getMap();
            map.zoom = 1;
            map.pan = { x: 0, y: 0 };
            const fillCount = this.getFills().length;
            for (let i = fillCount - 1; i > -1; i--) {
                let fill = this.mapItemTemplate.fills[i];
                await fill.setStyle(context, map, bounds, true);
                context.fill(path2D);
            }
            if (fillCount > 0) {
                const widestStroke = this.#getWidestStroke();
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
                const strokes = this.getStrokes();
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
            const dataElement = DomHelper.getElement(this.#componentElement, "#thumbnail-data");
            dataElement.value = thumbnailSrc;
            await this.update("thumbnailSrc");
        }
    }

    hasFills() {
        return this.getFills().length > 0;
    }

    getFills() {
        return this.mapItemTemplate?.fills ?? [];
    }

    async selectFill(elementId) {
        const fillElements = DomHelper.getElements(this.#componentElement, ".fill-item");
        for (const fillElement of fillElements) {
            const fillElementId = fillElement.id;
            if (`path-style-id-${elementId}` == fillElementId) {
                fillElement.setAttribute("data-selected", "true");
            }
            else {
                fillElement.setAttribute("data-selected", "false");
            }
        }
        const fill = this.mapItemTemplate.fills.find(f => f.id == elementId);
        await this.#setCurrentFill(fill);
        DomHelper.getElement(this.#componentElement, "#delete-fill-button").disabled = false;
    }

    hasCurrentFill() {
        return this.#currentFill ? true : false;
    }

    isCurrentFill(fillId) {
        return fillId == this.#currentFill?.id;
    }

    async addFill() {
        const pathStyle = new PathStyle({
            options: PathStyle.getOptionDefaults(PathStyleType.ColorFill)
        });
        const changes = [
            {
                changeType: ChangeType.Insert,
                changeObjectType: MapItemTemplate.name,
                propertyName: "fills",
                itemIndex: this.mapItemTemplate.fills.length,
                itemValue: pathStyle.getData(),
                mapItemTemplateRef: this.mapItemTemplate.ref.getData()
            }
        ];
        await this.#setCurrentFill(pathStyle);
        await this.#updateMap(changes);
    }

    async deleteFill() {
        const canDelete = this.#currentFill && !this.isDisabled();
        if (canDelete) {
            const fillIndex = this.mapItemTemplate.fills.findIndex(f => f.id == this.#currentFill.id);
            const changes = [
                {
                    changeType: ChangeType.Delete,
                    changeObjectType: MapItemTemplate.name,
                    propertyName: "fills",
                    itemIndex: fillIndex,
                    itemValue: this.#currentFill.getData(),
                    mapItemTemplateRef: this.mapItemTemplate.ref.getData()
                }
            ];
            await this.#setCurrentFill(null);
            await this.#updateMap(changes);
        }
    }

    canDeleteFillAttribute() {
        if (this.isDisabled()) {
            return "disabled";
        }
        return this.hasCurrentFill() ? "" : "disabled";
    }

    async dropFill(evt) {
        const fillElementId = evt.dataTransfer.getData("text");
        const fillId = fillElementId.replace("path-style-id-", "");
        const fillListElement = DomHelper.getElement(this.#componentElement, "#fill-list");
        const fillItems = fillListElement.querySelectorAll(".fill-item");
        const mouseY = evt.clientY;
        let newIndex = 0;
        let currentIndex = 0;
        const length = fillItems.length;
        for (let i = 0; i < length; i++) {
            const rect = fillItems[i].getBoundingClientRect();
            if (mouseY > rect.top + rect.height / 2) {
                newIndex = i + 1;
            }
            if (fillItems[i].id == fillElementId) {
                currentIndex = i;
            }
        }
        if (newIndex > currentIndex) {
            newIndex--;
        }
        if (newIndex == currentIndex) {
            return;
        }
        const fill = this.mapItemTemplate.fills.find(f => f.id == fillId);
        const changes = [
            {
                changeType: ChangeType.Delete,
                changeObjectType: MapItemTemplate.name,
                propertyName: "fills",
                itemIndex: currentIndex,
                itemValue: fill.getData(),
                mapItemTemplateRef: this.mapItemTemplate.ref.getData()
            },
            {
                changeType: ChangeType.Insert,
                changeObjectType: MapItemTemplate.name,
                propertyName: "fills",
                itemIndex: newIndex,
                itemValue: fill.getData(),
                mapItemTemplateRef: this.mapItemTemplate.ref.getData()
            }
        ];
        await this.#updateMap(changes);
    }

    hasStrokes() {
        return this.getStrokes().length > 0;
    }

    getStrokes() {
        return this.mapItemTemplate?.strokes ?? [];
    }

    hasCurrentStroke() {
        return this.#currentStroke ? true : false;
    }

    isCurrentStroke(strokeId) {
        return strokeId == this.#currentStroke?.id;
    }

    async selectStroke(elementId) {
        const strokeElements = DomHelper.getElements(this.#componentElement, ".stroke-item");
        for (const strokeElement of strokeElements) {
            const strokeElementId = strokeElement.id;
            if (`path-style-id-${elementId}` == strokeElementId) {
                strokeElement.setAttribute("data-selected", "true");
            }
            else {
                strokeElement.setAttribute("data-selected", "false");
            }
        }
        const stroke = this.mapItemTemplate.strokes.find(s => s.id == elementId);
        await this.#setCurrentStroke(stroke);
        DomHelper.getElement(this.#componentElement, "#delete-stroke-button").disabled = false;
    }

    async addStroke() {
        const pathStyle = new PathStyle({
            options: PathStyle.getOptionDefaults(PathStyleType.ColorStroke)
        });
        const changes = [
            {
                changeType: ChangeType.Insert,
                changeObjectType: MapItemTemplate.name,
                propertyName: "strokes",
                itemIndex: this.mapItemTemplate.strokes.length,
                itemValue: pathStyle.getData(),
                mapItemTemplateRef: this.mapItemTemplate.ref.getData()
            }
        ];
        await this.#setCurrentStroke(pathStyle);
        await this.#updateMap(changes);
    }

    canDeleteStrokeAttribute() {
        if (this.isDisabled()) {
            return "disabled";
        }
        return this.hasCurrentStroke() ? "" : "disabled";
    }

    async deleteStroke() {
        const canDelete = this.#currentStroke && !this.isDisabled();
        if (canDelete) {
            const strokeIndex = this.mapItemTemplate.strokes.findIndex(s => s.id == this.#currentStroke.id);
            const changes = [
                {
                    changeType: ChangeType.Delete,
                    changeObjectType: MapItemTemplate.name,
                    propertyName: "strokes",
                    itemIndex: strokeIndex,
                    itemValue: this.#currentStroke.getData(),
                    mapItemTemplateRef: this.mapItemTemplate.ref.getData()
                }
            ];
            await this.#setCurrentStroke(null);
            await this.#updateMap(changes);
        }
    }

    async dropStroke(evt) {
        const strokeElementId = evt.dataTransfer.getData("text");
        const strokeId = strokeElementId.replace("path-style-id-", "");
        const strokeListElement = DomHelper.getElement(this.#componentElement, "#stroke-list")
        const strokeItems = strokeListElement.querySelectorAll(".stroke-item");
        const mouseY = evt.clientY;
        let newIndex = 0;
        let currentIndex = 0;
        const length = strokeItems.length;
        for (let i = 0; i < length; i++) {
            const rect = strokeItems[i].getBoundingClientRect();
            if (mouseY > rect.top + rect.height / 2) {
                newIndex = i + 1;
            }
            if (strokeItems[i].id == strokeElementId) {
                currentIndex = i;
            }
        }
        if (newIndex > currentIndex) {
            newIndex--;
        }
        if (newIndex == currentIndex) {
            return;
        }
        const stroke = this.mapItemTemplate.strokes.find(s => s.id == strokeId);
        const changes = [
            {
                changeType: ChangeType.Delete,
                changeObjectType: MapItemTemplate.name,
                propertyName: "strokes",
                itemIndex: currentIndex,
                itemValue: stroke.getData(),
                mapItemTemplateRef: this.mapItemTemplate.ref.getData()
            },
            {
                changeType: ChangeType.Insert,
                changeObjectType: MapItemTemplate.name,
                propertyName: "strokes",
                itemIndex: newIndex,
                itemValue: stroke.getData(),
                mapItemTemplateRef: this.mapItemTemplate.ref.getData()
            }
        ];
        await this.#updateMap(changes);
    }

    isDraggable() {
        return !this.isDisabled();
    }

    async dragStartItem(evt, elementId) {
        DomHelper.dragStartItem(this.#componentElement, evt, elementId);
    }

    dragItem(evt) {
        DomHelper.dragItem(evt);
    }

    allowDrop(evt) {
        DomHelper.allowDrop(evt);
    }

    async updateRef() {
        const validationResult = await this.validate();
        if (validationResult.isValid) {
            const oldValue = this.mapItemTemplate.getData();
            const newValue = validationResult.mapItemTemplateData;
            const map = await MapWorkerClient.getMap();
            const mapItemTemplateRefIndex = map.mapItemTemplateRefs.findIndex(mitr => EntityReference.areEqual(mitr, oldValue.ref));
            const mapItemTemplateIndex = map.mapItemTemplates.findIndex(mit => EntityReference.areEqual(mit.ref, oldValue.ref));
            const changes = [
                {
                    changeType: ChangeType.Delete,
                    changeObjectType: Map.name,
                    propertyName: "mapItemTemplateRefs",
                    itemIndex: mapItemTemplateRefIndex,
                    itemValue: oldValue.ref
                },
                {
                    changeType: ChangeType.Delete,
                    changeObjectType: Map.name,
                    propertyName: "mapItemTemplates",
                    itemIndex: mapItemTemplateIndex,
                    itemValue: oldValue
                },
                {
                    changeType: ChangeType.Insert,
                    changeObjectType: Map.name,
                    propertyName: "mapItemTemplateRefs",
                    itemIndex: mapItemTemplateRefIndex,
                    itemValue: newValue.ref
                },
                {
                    changeType: ChangeType.Insert,
                    changeObjectType: Map.name,
                    propertyName: "mapItemTemplates",
                    itemIndex: mapItemTemplateIndex,
                    itemValue: newValue
                }
            ];
            const isInMapItemTemplatePalettes = this.#isToolInPalettes(map.toolPalette.mapItemTemplatePalettes, oldValue.ref);
            if (isInMapItemTemplatePalettes) {
                const oldPalettesData = map.toolPalette.getPalettesData(map.toolPalette.mapItemTemplatePalettes);
                let newPalettesData = this.#updateToolFromPalettesData(oldPalettesData, oldValue.ref, newValue.ref);
                changes.push({
                    changeType: ChangeType.Edit,
                    changeObjectType: ToolPalette.name,
                    propertyName: "mapItemTemplatePalettes",
                    oldValue: oldPalettesData,
                    newValue: newPalettesData
                });
            }
            const mapItemsToUpdate = this.#getMapItemsToUpdate(map, oldValue.ref, newValue.ref);
            for (const mapItemInfo of mapItemsToUpdate) {
                changes.push({
                    changeType: ChangeType.Edit,
                    changeObjectType: MapItem.name,
                    propertyName: "mapItemTemplateRef",
                    layerName: mapItemInfo.layerName,
                    mapItemGroupId: mapItemInfo.mapItemGroupId,
                    mapItemId: mapItemInfo.mapItemId,
                    oldValue: mapItemInfo.oldValue,
                    newValue: mapItemInfo.newValue
                });
            }
            await this.#updateMap(changes);
        }
    }

    async update(propertyName) {
        const validationResult = await this.validate();
        if (validationResult.isValid) {
            let oldValue = null;
            let newValue = null;
            switch (propertyName) {
                case "thumbnailSrc":
                    oldValue = this.mapItemTemplate.thumbnailSrc;
                    newValue = validationResult.mapItemTemplateData.thumbnailSrc;
                    break;
                case "shadow":
                    oldValue = this.mapItemTemplate.shadow.getData();
                    newValue = validationResult.mapItemTemplateData.shadow;
                    break;
                case "defaultZGroup":
                    oldValue = this.mapItemTemplate.defaultZGroup;
                    newValue = validationResult.mapItemTemplateData.defaultZGroup;
                    break;
                case "tags":
                    oldValue = this.mapItemTemplate.tags;
                    newValue = validationResult.mapItemTemplateData.tags;
                    break;
            }
            const changes = [
                {
                    changeType: ChangeType.Edit,
                    changeObjectType: MapItemTemplate.name,
                    propertyName: propertyName,
                    oldValue: oldValue,
                    newValue: newValue,
                    mapItemTemplateRef: this.mapItemTemplate.ref.getData()
                }
            ];
            await this.#updateMap(changes);
        }
    }

    async validate() {
        let isValid = true;
        const map = await MapWorkerClient.getMap();       

        // validate name
        const name = DomHelper.getElement(this.#componentElement, "#name")?.value;
        if (!name || name.length == 0) {
            DomHelper.getElement(this.#componentElement, "#validation-name").innerHTML = "Name is required.";
            isValid = false;
        }
        if (!name.match(/^[a-zA-Z0-9\s()]*$/)) {
            DomHelper.getElement(this.#componentElement, "#validation-name").innerHTML = "Invalid character(s). Alpha-numeric only.";
            isValid = false;
        }

        // validate version
        const versionId = parseInt(DomHelper.getElement(this.#componentElement, "#version")?.value);
        if (isNaN(versionId)) {
            DomHelper.getElement(this.#componentElement, "#validation-version").innerHTML = "Version is required.";
            isValid = false;
        }
        if (versionId < 1 || versionId > 1000) {
            DomHelper.getElement(this.#componentElement, "#validation-version").innerHTML = "Version must be an integer between 1 and 1000.";
        }
        const newRef = {
            versionId: versionId,
            isBuiltIn: false,
            isFromTemplate: false,
            name: name
        }
        const isStartingRef = EntityReference.areEqual(this.mapItemTemplate.ref, newRef);
        if (!isStartingRef && map.mapItemTemplateRefs.some(mitr => EntityReference.areEqual(mitr, newRef))) {
            DomHelper.getElement(this.#componentElement, "#validation-name").innerHTML = "The combination of name and version must be unique.";
            DomHelper.getElement(this.#componentElement, "#validation-version").innerHTML = "The combination of name and version must be unique.";
            isValid = false;
        }

        // validate thumbnail
        const thumbnailSrc = DomHelper.getElement(this.#componentElement, "#thumbnail-data")?.value;
        if (!thumbnailSrc || thumbnailSrc.length == 0) {
            DomHelper.getElement(this.#componentElement, "#validation-thumbnail").innerHTML = "Thumbnail is required.";
            isValid = false;
        }

        // validate tags
        const tags = DomHelper.getElement(this.#componentElement, "#tags")?.value;
        if (tags && !tags.match(/^[a-zA-Z0-9\s()]*$/)) {
            DomHelper.getElement(this.#componentElement, "#validation-tags").innerHTML = "Invalid character(s). Alpha-numeric only.";
            isValid = false;
        }

        // validate default z group
        const defaultZGroup = parseInt(DomHelper.getElement(this.#componentElement, "#default-z-group")?.value);
        if (isNaN(defaultZGroup)) {
            DomHelper.getElement(this.#componentElement, "#validation-default-z-group").innerHTML = "Default z-order rendering group is required.";
            isValid = false;
        }
        if (defaultZGroup < -10 || defaultZGroup > 10) {
            DomHelper.getElement(this.#componentElement, "#validation-default-z-group").innerHTML = "Default z-order rendering group must be an integer between -10 and 10.";
            isValid = false;
        }

        // validate shadow
        const shadowComponent = DomHelper.findComponentByElementId(this.#componentElement, "shadow");
        const shadowModel = shadowComponent?.model;
        const shadowValidationResult = shadowModel.validate();
        isValid = isValid && shadowValidationResult.isValid;
        const shadow = {
            color: shadowValidationResult.color,
            blur: shadowValidationResult.blur,
            offsetX: shadowValidationResult.offsetX,
            offsetY: shadowValidationResult.offsetY,
            renderingOrder: shadowValidationResult.renderingOrder
        }

        const mapItemTemplateData = this.mapItemTemplate.getData();
        return {
            isValid: isValid,
            mapItemTemplateData: {
                ref: newRef,
                thumbnailSrc: thumbnailSrc,
                fills: mapItemTemplateData.fills,
                strokes: mapItemTemplateData.strokes,
                shadow: shadow,
                defaultZGroup: defaultZGroup,
                caption: mapItemTemplateData.caption,
                tags: tags
            }
        };
    }

    // helpers
    #componentElementInternal;
    get #componentElement() {
        if (!this.#componentElementInternal) {
            this.#componentElementInternal = KitRenderer.getComponentElement(this.componentId);
        }
        return this.#componentElementInternal
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

    #getWidestStroke() {
        let widestStroke = null;
        let maxWidth = 0;
        const strokes = this.getStrokes();
        for (const stroke of strokes) {
            let width = stroke.getStyleOptionValue("Width");
            if (width > maxWidth) {
                widestStroke = stroke;
                maxWidth = width;
            }
        }
        return widestStroke;
    }

    #getThumbnailSrcFromPathStyles() {
        if (!this.mapItemTemplate) {
            return null;
        }
        for (const pathStyle of this.mapItemTemplate.fills) {
            const styleType = pathStyle.getStyleOptionValue(PathStyleOption.PathStyleType);
            if (styleType == PathStyleType.TileFill || styleType == PathStyleType.ImageArrayFill) {
                return this.#getImageThumbnailSrc(pathStyle)
            }
        }
        return null;
    }

    #getThumbnailPathData(defaultShape) {
        let pathData = "M 5,5 l 20,0 0,20 -20,0 0,-20";
        if (defaultShape == "circle") {
            pathData = "M 15,5 a 10 10 0 0 0 0 20 a 10 10 0 0 0 0 -20";
        }
        const hasFills = this.hasFills();
        if (defaultShape == "lines") {
            if (hasFills) {
                pathData = "M 15,5 l 10,0 0,20 -20,0 0,-10 10,0 0,-15";
            }
            else {
                pathData = "M 5,25 l 10,-15 10,0";
            }
        }
        if (defaultShape == "path") {
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

    #completeRender() {
        this.#updatePathStyleLabels();
        this.#loadThumbnail();
        this.#applyDetailsState();
    }

    #updatePathStyleLabels() {
        if (this.mapItemTemplate) {
            for (const fill of this.mapItemTemplate.fills) {
                this.#updatePathStyleLabel(fill);
            }
            for (const stroke of this.mapItemTemplate.strokes) {
                this.#updatePathStyleLabel(stroke);
            }
        }
    }

    #updatePathStyleLabel(pathStyle) {
        const styleType = pathStyle.getStyleOptionValue(PathStyleOption.PathStyleType);
        const isColorSwatchVisible = this.#isColorSwatchVisible(styleType);
        const isImageThumbnailVisible = this.#isImageThumbnailVisible(styleType);
        const pathStyleLabelContainerElement = DomHelper.getElement(this.#componentElement, `#path-style-id-${pathStyle.id}`);
        if (pathStyleLabelContainerElement) {
            if (isColorSwatchVisible) {
                const colorSwatch = pathStyleLabelContainerElement.querySelector(".color-swatch");
                colorSwatch.innerHTML = this.#getColorSwatchHtml(pathStyle);
            }
            const colorSwatchContainerElement = pathStyleLabelContainerElement.querySelector(".color-swatch-container");
            colorSwatchContainerElement.style.display = isColorSwatchVisible ? "block" : "none";
            if (isImageThumbnailVisible) {
                const imageThumbnail = pathStyleLabelContainerElement.querySelector(".image-thumbnail");
                const style = `background-image: url('${this.#getImageThumbnailSrc(pathStyle)}');`;
                imageThumbnail.setAttribute("style", style);
            }
            const imageThumbnailContainerElement = pathStyleLabelContainerElement.querySelector(".image-thumbnail-container");
            imageThumbnailContainerElement.style.display = isImageThumbnailVisible ? "block" : "none";
            const label = pathStyleLabelContainerElement.querySelector(".path-style-label");
            label.innerHTML = this.#getPathStyleLabel(styleType);
            const widthLabel = pathStyleLabelContainerElement.querySelector(".path-style-width-label");
            if (widthLabel) {
                let width = pathStyle.getStyleOptionValue(PathStyleOption.Width);
                width = `Width: ${width}`;
                widthLabel.innerHTML = width;
            }
        }
    }

    #isColorSwatchVisible(styleType) {
        return styleType == PathStyleType.ColorFill
            || styleType == PathStyleType.ColorStroke
            || styleType == PathStyleType.LinearGradientFill
            || styleType == PathStyleType.LinearGradientStroke
            || styleType == PathStyleType.RadialGradientFill
            || styleType == PathStyleType.RadialGradientStroke
            || styleType == PathStyleType.ConicalGradientFill
            || styleType == PathStyleType.ConicalGradientStroke;
    }

    #isImageThumbnailVisible(styleType) {
        return styleType == PathStyleType.TileFill
            || styleType == PathStyleType.TileStroke
            || styleType == PathStyleType.ImageArrayFill
            || styleType == PathStyleType.ImageArrayStroke;
    }

    #getColorSwatchHtml(pathStyle) {
        const styleType = pathStyle.getStyleOptionValue(PathStyleOption.PathStyleType);
        if (styleType == PathStyleType.ColorFill || styleType == PathStyleType.ColorStroke) {
            const color = pathStyle.getStyleOptionValue(PathStyleOption.Color);
            return `<rect x="10" y="10" width="80" height="80" stroke="dimgray" stroke-width="2" fill="${color}" rx="10" />`;
        }
        if (styleType == PathStyleType.LinearGradientFill
            || styleType == PathStyleType.LinearGradientStroke) {
            const linearGradientId = `linearGradient-${pathStyle.id}`;
            let html = `<defs><linearGradient id="${linearGradientId}" >`;
            const colorStopsLinear = pathStyle.getColorStops().filter(cs => cs.offset > 0);
            for (const colorStop of colorStopsLinear) {
                html += `<stop offset="${colorStop.offset}%" stop-color="${colorStop.color}" />`;
            }
            html += "</linearGradient></defs>";
            html += `<rect x="10" y="10" width="80" height="80" stroke="dimgray" stroke-width="2" fill="url(#${linearGradientId})" rx="10" />`;
            return html;
        }
        if (styleType == PathStyleType.RadialGradientFill
            || styleType == PathStyleType.RadialGradientStroke
            || styleType == PathStyleType.ConicalGradientFill
            || styleType == PathStyleType.ConicalGradientStroke) {
            const radialGradientId = `radialGradient-${pathStyle.id}`;
            let html = `<defs><radialGradient id="${radialGradientId}" cx="0.5" cy="0.5" r="0.5" >`;
            const colorStopsLinear = pathStyle.getColorStops().filter(cs => cs.offset > 0);
            for (const colorStop of colorStopsLinear) {
                html += `<stop offset="${colorStop.offset}%" stop-color="${colorStop.color}" />`;
            }
            html += "</radialGradient></defs>";
            html += `<rect x="10" y="10" width="80" height="80" stroke="dimgray" stroke-width="2" fill="url(#${radialGradientId})" rx="10" />`;
            return html;
        }
        return "<rect x='10' y='10' width='80' height='80' stroke='dimgray' stroke-width='2' fill='#c0c0c0' rx='10' />";
    }

    #getImageThumbnailSrc(pathStyle) {
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

    #getPathStyleLabel(styleType) {
        switch (styleType) {
            case PathStyleType.ColorFill:
            case PathStyleType.ColorStroke:
                return "Color";
            case PathStyleType.LinearGradientFill:
            case PathStyleType.LinearGradientStroke:
                return "Linear gradient";
            case PathStyleType.RadialGradientFill:
            case PathStyleType.RadialGradientStroke:
                return "Radial gradient";
            case PathStyleType.ConicalGradientFill:
            case PathStyleType.ConicalGradientStroke:
                return "Conical gradient";
            case PathStyleType.TileFill:
            case PathStyleType.TileStroke:
                return "Tile";
            case PathStyleType.ImageArrayFill:
            case PathStyleType.ImageArrayStroke:
                return "Image array";
        }
        return `Style${width}`;
    }

    #loadThumbnail() {
        if (this.mapItemTemplate) {
            let src = this.mapItemTemplate.thumbnailSrc ?? MapItemTemplate.defaultThumbnailSrc;
            const imageElement = DomHelper.getElement(this.#componentElement, "#thumbnail-preview");
            if (imageElement) {
                const style = `background-image: url('${src}');`;
                imageElement.setAttribute("style", style);
            }
        }
    }

    #detailsState;
    #getDetailsState() {
        if (!this.#detailsState) {
            const detailsState = [];
            const detailsElements = DomHelper.getElements(this.#componentElement, "details");
            if (detailsElements) {
                for (const detailsElement of detailsElements) {
                    detailsState.push({
                        id: detailsElement.id,
                        isOpen: detailsElement.open
                    });
                }
            }
            this.#detailsState = detailsState;
        }
        return this.#detailsState;
    }

    #applyDetailsState() {
        const detailsElements = DomHelper.getElements(this.#componentElement, "details");
        if (detailsElements) {
            const detailsState = this.#getDetailsState();
            for (const detailsElement of detailsElements) {
                const isOpen = detailsState.find(x => x.id == detailsElement.id)?.isOpen;
                detailsElement.open = isOpen;
            }
        }
    } 

    #currentFill;
    async #setCurrentFill(fill) {
        this.#currentFill = fill;
        await DomHelper.reRenderElement(this.#componentElement, "currentFillForm");
    }

    #currentStroke;
    async #setCurrentStroke(stroke) {
        this.#currentStroke = stroke;
        await DomHelper.reRenderElement(this.#componentElement, "currentStrokeForm");
    }

    async #updateMap(changes) {
        ToolPaletteDialogModel.saveScrollPosition();
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    #isToolInPalettes(palettes, toolRef) {
        for (const palette of palettes) {
            if (palette.some(x => EntityReference.areEqual(x, toolRef))) {
                return true;
            }
        }
        return false;
    }

    #updateToolFromPalettesData(palettes, oldToolRef, newToolRef) {
        const newPalettesData = [];
        for (const palette of palettes) {
            const newPalette = [];
            for (const item of palette) {
                if (EntityReference.areEqual(item, oldToolRef)) {
                    newPalette.push(newToolRef);
                }
                else {
                    newPalette.push(item);
                }
            }
            newPalettesData.push(newPalette);
        }
        return newPalettesData;
    }

    #getMapItemsToUpdate(map, oldTemplateRef, newTemplateRef) {
        const mapItems = [];
        for (const layer of map.layers) {
            for (const mapItemGroup of layer.mapItemGroups) {
                for (const mapItem of mapItemGroup.mapItems) {
                    if (EntityReference.areEqual(oldTemplateRef, mapItem.mapItemTemplateRef)) {
                        mapItems.push({
                            layerName: layer.name,
                            mapItemGroupId: mapItemGroup.id,
                            mapItemId: mapItem.id,
                            oldValue: oldTemplateRef,
                            newValue: newTemplateRef
                        })
                    }
                }
            }
        }
        return mapItems;
    }
}
