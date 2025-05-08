
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
        this.#completeRender();
    }

    async onMapUpdated(message) {
        const map = await MapWorkerClient.getMap();
        if (this.mapItemTemplate) {
            this.mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(this.mapItemTemplate.ref, mit.ref));
            let reRender = false;
            if (message?.data?.changeSet?.changes) {    
                const mapItemTemplateChange = message.data.changeSet.changes.some(c =>
                    c.changeObjectType == MapItemTemplate.name
                    && EntityReference.areEqual(this.mapItemTemplate.ref, c.mapItemTemplateRef));
                reRender = mapItemTemplateChange;
            }
            setTimeout(async () => {
                if (reRender) {
                    await this.#reRenderElement("if-map-item-template-visible");
                }
            }, 20);
            setTimeout(() => {
                this.#completeRender();
            }, 60);
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
            stateItem = {
                id: event.target.id,
                isOpen: event.target.open
            };
            detailsState.push(stateItem);
        }
        this.#detailsState = detailsState;
        const section = event.target.querySelector("section");
        section.scrollIntoView();
    }

    // methods
    get isVisibleDebug() {
        return true;
    }

    isVisible() {
        if (this.mapItemTemplate) {
            return true;
        }
        return false;
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
                        description: 'Image files',
                        accept: {
                            "image/*": [".png", ".gif", ".jpeg", ".jpg"],
                        },
                    },
                ],
            });
        }
        catch {
            return;
        }
        const fileHandle = fileHandles[0];
        const imageSource = await FileManager.getImageSource(fileHandle);
        const dataElement = this.#getElement("#thumbnail-data");
        dataElement.value = imageSource;
        await this.update("thumbnailSrc");
    }

    hasFills() {
        return this.getFills().length > 0;
    }

    getFills() {
        return this.mapItemTemplate?.fills ?? [];
    }

    async selectFill(elementId) {
        const fillElements = this.#getElements(".fill-item");
        for (const fillElement of fillElements) {
            const fillElementId = fillElement.id;
            if (elementId == fillElementId) {
                fillElement.setAttribute("data-selected", "true");
            }
            else {
                fillElement.setAttribute("data-selected", "false");
            }
        }
        const fill = this.mapItemTemplate.fills.find(f => f.id == elementId);
        await this.#setCurrentFill(fill);
    }

    hasCurrentFill() {
        return this.#currentFill ? true : false;
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
            this.#setCurrentFill(null);
            await this.#updateMap(changes);
        }
    }

    async dropFill(evt) {
        const fillElementId = evt.dataTransfer.getData("text");
        const fillId = fillElementId.replace("path-style-id-", "");
        const fillListElement = this.#getElement("#fill-list");
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

    async selectStroke(elementId) {
        const strokeElements = this.#getElements(".stroke-item");
        for (const strokeElement of strokeElements) {
            const strokeElementId = strokeElement.id;
            if (elementId == strokeElementId) {
                strokeElement.setAttribute("data-selected", "true");
            }
            else {
                strokeElement.setAttribute("data-selected", "false");
            }
        }
        const stroke = this.mapItemTemplate.strokes.find(s => s.id == elementId);
        await this.#setCurrentStroke(stroke);
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
            this.#setCurrentStroke(null);
            await this.#updateMap(changes);
        }
    }

    async dropStroke(evt) {
        const strokeElementId = evt.dataTransfer.getData("text");
        const strokeId = strokeElementId.replace("path-style-id-", "");
        const strokeListElement = this.#getElement("#stroke-list")
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

    allowDrop(evt) {
        evt.preventDefault();
    }

    isDraggable() {
        return !this.isDisabled();
    }

    dragItem(evt) {
        evt.dataTransfer.setData("text", evt.srcElement.id);
    }

    async dragStartItem(evt, elementId) {
        if (!evt?.dataTransfer) {
            return;
        }
        evt.dataTransfer.setData("text", elementId);
        const dragStartEvent = new DragEvent("dragstart", {
            bubbles: true,
            cancelable: true,
            clientX: evt.clientX,
            clientY: evt.clientY,
        });
        const element = this.#getElement(`#${elementId}`)
        element.dispatchEvent(dragStartEvent);
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
        const name = this.#getElement("#name")?.value;
        if (name.length == 0) {
            this.#getElement("#validation-name").innerHTML = "Name is required.";
            isValid = false;
        }
        if (!name.match(/^[a-zA-Z0-9\s()]*$/)) {
            this.#getElement("#validation-name").innerHTML = "Invalid character(s). Alpha-numeric only.";
            isValid = false;
        }

        // validate version
        const versionId = parseInt(this.#getElement("#version")?.value);
        if (isNaN(versionId)) {
            this.#getElement("#validation-version").innerHTML = "Version is required.";
            isValid = false;
        }
        if (versionId < 1 || versionId > 1000) {
            this.#getElement("#validation-version").innerHTML = "Version must be an integer between 1 and 1000.";
        }
        const newRef = {
            versionId: versionId,
            isBuiltIn: false,
            isFromTemplate: false,
            name: name
        }
        const isStartingRef = EntityReference.areEqual(this.mapItemTemplate.ref, newRef);
        if (!isStartingRef && map.mapItemTemplateRefs.some(mitr => EntityReference.areEqual(mitr, newRef))) {
            this.#getElement("#validation-name").innerHTML = "The combination of name and version must be unique.";
            this.#getElement("#validation-version").innerHTML = "The combination of name and version must be unique.";
            isValid = false;
        }

        // validate thumbnail
        const thumbnailSrc = this.#getElement("#thumbnail-data")?.value;
        if (!thumbnailSrc || thumbnailSrc.length == 0) {
            this.#getElement("#validation-thumbnail").innerHTML = "Thumbnail is required.";
            isValid = false;
        }

        // validate tags
        const tags = this.#getElement("#tags")?.value;
        if (tags && !tags.match(/^[a-zA-Z0-9\s()]*$/)) {
            this.#getElement("#validation-tags").innerHTML = "Invalid character(s). Alpha-numeric only.";
            isValid = false;
        }

        // validate default z group
        const defaultZGroup = parseInt(this.#getElement("#default-z-group")?.value);
        if (isNaN(defaultZGroup)) {
            this.#getElement("#validation-default-z-group").innerHTML = "Default z-order rendering group is required.";
            isValid = false;
        }
        if (defaultZGroup < -10 || defaultZGroup > 10) {
            this.#getElement("#validation-default-z-group").innerHTML = "Default z-order rendering group must be an integer between -10 and 10.";
            isValid = false;
        }

        // validate shadow
        const shadowModel = this.#getModelFromComponentElement("shadow");
        const shadowValidationResult = shadowModel.validate();
        isValid = isValid && shadowValidationResult.isValid;
        const shadow = {
            color: shadowValidationResult.color,
            blur: shadowValidationResult.blur,
            offsetX: shadowValidationResult.offsetX,
            offsetY: shadowValidationResult.offsetY,
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
    #componentElement;
    #getElement(selector) {
        if (!this.#componentElement) {
            this.#componentElement = KitRenderer.getComponentElement(this.componentId);
        }
        return this.#componentElement.querySelector(selector);
    }

    #getElements(selector) {
        if (!this.#componentElement) {
            this.#componentElement = KitRenderer.getComponentElement(this.componentId);
        }
        return this.#componentElement.querySelectorAll(selector);
    }

    async #reRenderElement(elementId) {
        const element = this.#getElement(`#${elementId}`);
        if (element) {
            const componentId = element.getAttribute("data-kit-component-id");
            if (KitComponent.find(componentId)) {
                await KitRenderer.renderComponent(componentId);
            }
        }
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
        const pathStyleLabelContainerElement = this.#getElement(`#path-style-id-${pathStyle.id}`);
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
        return "Style";
    }

    #loadThumbnail() {
        if (this.mapItemTemplate) {
            let src = this.mapItemTemplate.thumbnailSrc ?? MapItemTemplate.defaultThumbnailSrc;
            const imageElement = this.#getElement("#thumbnail-preview");
            if (imageElement) {
                imageElement.setAttribute("src", src);
            }
        }
    }

    #detailsState;
    #getDetailsState() {
        if (!this.#detailsState) {
            const detailsState = [];
            const detailsElements = this.#getElements("details");
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
        const detailsElements = this.#getElements("details");
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
        await this.#reRenderElement("currentFillForm");
    }

    #currentStroke;
    async #setCurrentStroke(stroke) {
        this.#currentStroke = stroke;
        await this.#reRenderElement("currentStrokeForm");
    }

    async #updateMap(changes) {

        // update local copy
        //const map = await MapWorkerClient.getMap();
        //map.applyChangeSet(new ChangeSet({ changes: changes }));

        ToolPaletteDialogModel.restoreScrollPosition();

        // update map worker
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

    #getModelFromComponentElement(elementId) {
        const element = this.#getElement(`#${elementId}`);
        const componentId = element.getAttribute("data-kit-component-id");
        const component = KitComponent.find(componentId);
        return component?.model;
    }
}
