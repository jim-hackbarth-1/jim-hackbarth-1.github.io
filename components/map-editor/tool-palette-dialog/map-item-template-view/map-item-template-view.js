
import { KitMessenger, KitRenderer } from "../../../../ui-kit.js";
import {
    ChangeSet,
    ChangeType,
    EntityReference,
    InputUtilities,
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

export function createModel() {
    return new MapItemTemplateViewModel();
}

class MapItemTemplateViewModel {

    // event handlers
    async onRenderStart(componentId, modelInput) {
        this.componentId = componentId;
        if (modelInput.mapItemTemplate) {
            this.startingMapItemTemplate = new MapItemTemplate(modelInput.mapItemTemplate.getData());
            this.mapItemTemplate = new MapItemTemplate(modelInput.mapItemTemplate.getData());
        }
        else {
            this.startingMapItemTemplate = null;
            this.mapItemTemplate = null;
        }
        this.dialogModel = modelInput?.dialogModel;
        this.validationResult = {
            isValid: false
        };
    }

    async onRenderComplete() {
        KitMessenger.subscribe(EditorModel.MapUpdatedNotificationTopic, this.componentId, this.onMapUpdated.name);
    }

    async onMapUpdated(message) {

        if (this.mapItemTemplate) {
            const map = await MapWorkerClient.getMap();
            const componentElement = KitRenderer.getComponentElement(this.componentId);
            this.mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(this.mapItemTemplate.ref, mit.ref));
            if (this.#currentFill && this.mapItemTemplate) {
                this.#currentFill = this.mapItemTemplate.fills.find(f => f.id == this.#currentFill.id);
            }
            if (this.#currentStroke && this.mapItemTemplate) {
                this.#currentStroke = this.mapItemTemplate.strokes.find(s => s.id == this.#currentStroke.id);
            }
            let reRender = false;
            if (message?.data?.changeSet?.changes) {
                const mapItemTemplateChange = message.data.changeSet.changes.some(c => c.changeObjectType == MapItemTemplate.name);

                // TODO: set thumbnail and label on fill/stroke list item on change

                //const colorFillColorChange = message.data.changeSet.changes.some(c =>
                //    c.changeType == ChangeType.Edit && c.changeObjectType == ColorFill.name && c.propertyName == "color");
                //if (colorFillColorChange) {
                //    for (const fill of this.mapItemTemplate.fills) {
                //        const fillElement = componentElement.querySelector(`[data-fill-thumbnail="${fill.id}"]`);
                //        const rect = fillElement.querySelector("rect");
                //        rect.setAttribute("fill", fill.color);
                //    }
                //}
                //const colorStrokeColorChange = message.data.changeSet.changes.some(c =>
                //    c.changeType == ChangeType.Edit && c.changeObjectType == ColorStroke.name && c.propertyName == "color");
                //const strokeWidthChange = message.data.changeSet.changes.some(c =>
                //    c.changeType == ChangeType.Edit && c.changeObjectType == BaseStroke.name && c.propertyName == "width");
                //if (colorStrokeColorChange) {
                //    for (const stroke of this.mapItemTemplate.strokes) {
                //        const strokeElement = componentElement.querySelector(`[data-stroke-thumbnail="${stroke.id}"]`);
                //        const rect = strokeElement.querySelector("rect");
                //        rect.setAttribute("fill", stroke.color);
                //    }
                //}
                //if (colorStrokeColorChange || strokeWidthChange) {
                //    for (const stroke of this.mapItemTemplate.strokes) {
                //        const strokeLabelElement = componentElement.querySelector(`[data-stroke-label="${stroke.id}"]`);
                //        strokeLabelElement.innerHTML = this.#getStrokeLabel(stroke);
                //    }
                //}

                reRender = mapItemTemplateChange;
            }
            if (reRender) {
                const scrollTop = this.dialogModel.scrollTop;
                await this.#reRenderElement("if-visible-map-item-template");
                this.#applyDetailsState();
                setTimeout(() => {
                    this.dialogModel.scrollTop = scrollTop;
                }, 20);
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
    isVisible() {
        if (this.mapItemTemplate) {
            return true;
        }
        return false;
    }

    getMapItemTemplateRef() {
        return this.mapItemTemplate?.ref;
    }

    isDisabled() {
        return (!this.mapItemTemplate || this.mapItemTemplate.ref.isBuiltIn || this.mapItemTemplate.ref.isFromTemplate) ? "disabled" : null;
    }

    isAddFillDisabled() {
        return (this.mapItemTemplate.ref.isBuiltIn || this.mapItemTemplate.ref.isFromTemplate) ? "disabled" : null;
    }

    isAddStrokeDisabled() {
        return (this.mapItemTemplate.ref.isBuiltIn || this.mapItemTemplate.ref.isFromTemplate) ? "disabled" : null;
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

    async deleteFill() {
        const canDelete = this.#currentFill && !(this.mapItemTemplate.ref.isBuiltIn || this.mapItemTemplate.ref.isFromTemplate);
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

    async deleteStroke() {
        const canDelete = this.#currentStroke && !(this.mapItemTemplate.ref.isBuiltIn || this.mapItemTemplate.ref.isFromTemplate);
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

    getFills() {
        const fills = [];
        if (this.mapItemTemplate?.fills) {
            for (const fill of this.mapItemTemplate.fills) {
                const fillType = fill.getStyleOptionValue(PathStyleOption.PathStyleType);
                let label = "Fill";
                switch (fillType) {
                    case PathStyleType.ColorFill:
                        label = "Color fill";
                        break;
                    case PathStyleType.LinearGradientFill:
                        label = "Linear gradient fill";
                        break;
                    case PathStyleType.RadialGradientFill:
                        label = "Radial gradient fill";
                        break;
                    case PathStyleType.ConicalGradientFill:
                        label = "Conical gradient fill";
                        break;
                    case PathStyleType.TileFill:
                        label = "Tile fill";
                        break;
                    case PathStyleType.ImageArrayFill:
                        label = "Image array fill";
                        break;
                }
                fills.push({
                    fillType: fillType,
                    label: label,
                    id: fill.id,
                    color: "#c0c0c0" //TODO: fill.color
                });
            }
        }
        return fills;
    }

    getStrokes() {
        const strokes = [];
        if (this.mapItemTemplate?.strokes) {
            for (const stroke of this.mapItemTemplate.strokes) {
                const strokeType = stroke.getStyleOptionValue(PathStyleOption.PathStyleType);
                let label = "Stroke";
                switch (strokeType) {
                    case PathStyleType.ColorStroke:
                        label = "Color stroke";
                        break;
                    case PathStyleType.LinearGradientStroke:
                        label = "Linear gradient stroke";
                        break;
                    case PathStyleType.RadialGradientStroke:
                        label = "Radial gradient stroke";
                        break;
                    case PathStyleType.ConicalGradientStroke:
                        label = "Conical gradient stroke";
                        break;
                    case PathStyleType.TileStroke:
                        label = "Tile stroke";
                        break;
                    case PathStyleType.ImageArrayStroke:
                        label = "Image array stroke";
                        break;
                }
                strokes.push({
                    strokeType: strokeType,
                    label: label,
                    id: stroke.id,
                    color: "#696969" // TODO: stroke.color
                });
            }
        }
        return strokes;
    }

    async selectFill(elementId) {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const fillElements = componentElement.querySelectorAll(".fill-item");
        for (const fillElement of fillElements) {
            const fillElementId = fillElement.id;
            if (elementId == fillElementId) {
                fillElement.setAttribute("data-selected", "true");
            }
            else {
                fillElement.setAttribute("data-selected", "false");
            }
        }
        const canDelete = !(this.mapItemTemplate.ref.isBuiltIn || this.mapItemTemplate.ref.isFromTemplate);
        const deleteButton = componentElement.querySelector("#delete-fill-button");
        deleteButton.disabled = !canDelete;
        const fill = this.mapItemTemplate.fills.find(f => f.id == elementId);
        await this.#setCurrentFill(fill);
    }

    async selectStroke(elementId) {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const strokeElements = componentElement.querySelectorAll(".stroke-item");
        for (const strokeElement of strokeElements) {
            const strokeElementId = strokeElement.id;
            if (elementId == strokeElementId) {
                strokeElement.setAttribute("data-selected", "true");
            }
            else {
                strokeElement.setAttribute("data-selected", "false");
            }
        }
        const canDelete = !(this.mapItemTemplate.ref.isBuiltIn || this.mapItemTemplate.ref.isFromTemplate);
        const deleteButton = componentElement.querySelector("#delete-stroke-button");
        deleteButton.disabled = !canDelete;
        const stroke = this.mapItemTemplate.strokes.find(s => s.id == elementId);
        await this.#setCurrentStroke(stroke);
    }

    getCurrentFill() {
        return this.#currentFill;
    }

    getCurrentStroke() {
        return this.#currentStroke;
    }

    hasCurrentFill() {
        return this.#currentFill ? true : false;
    }

    hasCurrentStroke() {
        return this.#currentStroke ? true : false;
    }

    async updateRef() {
        const mapItemTemplate = {
            ref: {
                isBuiltIn: this.mapItemTemplate?.ref.isBuiltIn,
                isFromTemplate: this.mapItemTemplate?.ref.isFromTemplate
            },
            fills: this.mapItemTemplate.fills,
            strokes: this.mapItemTemplate.strokes
        };
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        mapItemTemplate.ref.name = InputUtilities.cleanseString(componentElement.querySelector("#map-item-template-name").value.trim());
        mapItemTemplate.ref.versionId = parseInt(componentElement.querySelector("#map-item-template-version").value);
        this.mapItemTemplate = new MapItemTemplate(mapItemTemplate);
        this.#update();
        this.validationResult = await this.#validate();
        if (this.validationResult.isValid) {
            const map = await MapWorkerClient.getMap();
            const mapItemTemplateRefIndex = map.mapItemTemplateRefs.findIndex(mitr => EntityReference.areEqual(mitr, this.startingMapItemTemplate.ref));
            const mapItemTemplateIndex = map.mapItemTemplates.findIndex(mit => EntityReference.areEqual(mit.ref, this.startingMapItemTemplate.ref));
            const changes = [
                {
                    changeType: ChangeType.Delete,
                    changeObjectType: Map.name,
                    propertyName: "mapItemTemplateRefs",
                    itemIndex: mapItemTemplateRefIndex,
                    itemValue: this.startingMapItemTemplate.ref.getData()
                },
                {
                    changeType: ChangeType.Delete,
                    changeObjectType: Map.name,
                    propertyName: "mapItemTemplates",
                    itemIndex: mapItemTemplateIndex,
                    itemValue: this.startingMapItemTemplate.getData()
                },
                {
                    changeType: ChangeType.Insert,
                    changeObjectType: Map.name,
                    propertyName: "mapItemTemplateRefs",
                    itemIndex: mapItemTemplateRefIndex,
                    itemValue: this.mapItemTemplate.ref.getData()
                },
                {
                    changeType: ChangeType.Insert,
                    changeObjectType: Map.name,
                    propertyName: "mapItemTemplates",
                    itemIndex: mapItemTemplateIndex,
                    itemValue: this.mapItemTemplate.getData()
                }
            ];
            const isInMapItemTemplatePalettes = this.#isToolInPalettes(map.toolPalette.mapItemTemplatePalettes, this.startingMapItemTemplate.ref);
            if (isInMapItemTemplatePalettes) {
                const oldPalettesData = map.toolPalette.getPalettesData(map.toolPalette.mapItemTemplatePalettes);
                let newPalettesData = this.#updateToolFromPalettesData(oldPalettesData, this.startingMapItemTemplate.ref, this.mapItemTemplate.ref);
                changes.push({
                    changeType: ChangeType.Edit,
                    changeObjectType: ToolPalette.name,
                    propertyName: "mapItemTemplatePalettes",
                    oldValue: oldPalettesData,
                    newValue: newPalettesData
                });
            }
            const mapItemsToUpdate = this.#getMapItemsToUpdate(map, this.startingMapItemTemplate.ref, this.mapItemTemplate.ref);
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
        else {
            await this.#reRenderElement("if-visible-map-item-template");
        }
    }

    async updateProperty(elementId) {
        this.#update();
        this.validationResult = await this.#validate();
        if (this.validationResult.isValid) {
            const componentElement = KitRenderer.getComponentElement(this.componentId);
            let element = componentElement.querySelector(`#${elementId}`);
            let propertyName = null;
            let oldValue = null;
            let newValue = null;
            switch (elementId) {
                case "map-item-template-thumbnail":
                    propertyName = "thumbnailSrc";
                    oldValue = this.startingMapItemTemplate.thumbnailSrc;
                    newValue = InputUtilities.cleanseSvg(element.value.trim());
                    break;
                case "map-item-template-tags":
                    propertyName = "tags";
                    oldValue = this.startingMapItemTemplate.tags;
                    newValue = InputUtilities.cleanseString(element.value.trim());
                    break;
                case "map-item-template-default-z-group":
                    propertyName = "defaultZGroup";
                    oldValue = this.startingMapItemTemplate.defaultZGroup;
                    newValue = parseInt(element.value);
                    break;
            }
            if (propertyName) {
                const changes = [
                    {
                        changeType: ChangeType.Edit,
                        changeObjectType: MapItemTemplate.name,
                        propertyName: propertyName,
                        oldValue: oldValue,
                        newValue: newValue,
                        mapItemTemplateRef: this.startingMapItemTemplate.ref.getData()
                    }
                ];
                await this.#updateMap(changes);
            }
        }
        else {
            await this.#reRenderElement("if-visible-map-item-template");
        }
    }

    allowDrop(evt) {
        evt.preventDefault();
    }

    isDraggable() {
        return (!this.mapItemTemplate || this.mapItemTemplate.ref.isBuiltIn || this.mapItemTemplate.ref.isFromTemplate) ? false : true;
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
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const element = componentElement.querySelector(`#${elementId}`);
        element.dispatchEvent(dragStartEvent);
    }

    async dropFill(evt) {

        // get drop location 
        const fillId = evt.dataTransfer.getData("text");
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const fillListElement = componentElement.querySelector("#fill-list");
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
            if (fillItems[i].id == fillId) {
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
                mapItemTemplateRef: this.startingMapItemTemplate.ref.getData()
            },
            {
                changeType: ChangeType.Insert,
                changeObjectType: MapItemTemplate.name,
                propertyName: "fills",
                itemIndex: newIndex,
                itemValue: fill.getData(),
                mapItemTemplateRef: this.startingMapItemTemplate.ref.getData()
            }
        ];
        await this.#updateMap(changes);
    }

    async dropStroke(evt) {

        // get drop location 
        const strokeId = evt.dataTransfer.getData("text");
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const strokeListElement = componentElement.querySelector("#stroke-list");
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
            if (strokeItems[i].id == strokeId) {
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
                mapItemTemplateRef: this.startingMapItemTemplate.ref.getData()
            },
            {
                changeType: ChangeType.Insert,
                changeObjectType: MapItemTemplate.name,
                propertyName: "strokes",
                itemIndex: newIndex,
                itemValue: stroke.getData(),
                mapItemTemplateRef: this.startingMapItemTemplate.ref.getData()
            }
        ];
        await this.#updateMap(changes);
    }

    // helpers
    #currentFill;
    #currentStroke;

    #update() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        this.mapItemTemplate.thumbnailSrc = InputUtilities.cleanseSvg(componentElement.querySelector("#map-item-template-thumbnail").value.trim());
        this.mapItemTemplate.tags = InputUtilities.cleanseString(componentElement.querySelector("#map-item-template-tags").value.trim());
        this.mapItemTemplate.defaultZGroup = parseInt(componentElement.querySelector("#map-item-template-default-z-group").value);
    }

    async #validate() {
        const validationResult = {
            isValid: false
        };
        const map = await MapWorkerClient.getMap();
        if (this.mapItemTemplate && !this.mapItemTemplate.ref.isBuiltIn && !this.mapItemTemplate.ref.isFromTemplate) {

            const isStartingRef = EntityReference.areEqual(this.startingMapItemTemplate.ref, this.mapItemTemplate.ref);

            // validate name
            if (this.mapItemTemplate.ref.name.length == 0) {
                validationResult.name = "Name is required.";
            }
            if (!this.mapItemTemplate.ref.name.match(/^[a-zA-Z0-9\s()]*$/)) {
                validationResult.name = "Invalid character(s). Alpha-numeric only.";
            }
            if (!isStartingRef && map.mapItemTemplateRefs.some(mitr => EntityReference.areEqual(mitr, this.mapItemTemplate.ref))) {
                validationResult.name = "The combination of name and version must be unique.";
            }

            // validate version
            if (isNaN(this.mapItemTemplate.ref.versionId)) {
                validationResult.version = "Version is required.";
            }
            if (this.mapItemTemplate.ref.versionId < 1 || this.mapItemTemplate.ref.versionId > 1000) {
                validationResult.version = "Version must be an integer between 1 and 1000.";
            }
            if (!isStartingRef && map.mapItemTemplateRefs.some(mitr => EntityReference.areEqual(mitr, this.mapItemTemplate.ref))) {
                validationResult.version = "The combination of name and version must be unique.";
            }

            // validate thumbnail
            if (!this.mapItemTemplate.thumbnailSrc || this.mapItemTemplate.thumbnailSrc.length == 0) {
                validationResult.thumbnail = "Thumbnail is required.";
            }

            // validate tags
            if (this.mapItemTemplate.tags && !this.mapItemTemplate.tags.match(/^[a-zA-Z0-9\s()]*$/)) {
                validationResult.tags = "Invalid character(s). Alpha-numeric only.";
            }

            // validate default z group
            if (isNaN(this.mapItemTemplate.defaultZGroup)) {
                validationResult.defaultZGroup = "Default z-order rendering group is required.";
            }
            if (this.mapItemTemplate.defaultZGroup < -10 || this.mapItemTemplate.defaultZGroup > 10) {
                validationResult.defaultZGroup = "Default z-order rendering group must be an integer between -10 and 10.";
            }

            if (!validationResult.name
                && !validationResult.version
                && !validationResult.thumbnail
                && !validationResult.tags
                && !validationResult.defaultZGroup) {
                validationResult.isValid = true;
            }
        }
        return validationResult;
    }

    async #reRenderElement(elementId) {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        if (componentElement) {
            const element = componentElement.querySelector(`#${elementId}`);
            const componentId = element.getAttribute("data-kit-component-id");
            await KitRenderer.renderComponent(componentId);
        }
    }

    async #updateMap(changes) {

        // update local copy
        const map = await MapWorkerClient.getMap();
        map.applyChangeSet(new ChangeSet({ changes: changes }));

        // update map worker
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    async #setCurrentFill(fill) {
        this.#currentFill = fill;
        await this.#reRenderElement("currentFillForm");
    }

    async #setCurrentStroke(stroke) {
        this.#currentStroke = stroke;
        await this.#reRenderElement("currentStrokeForm");
    }

    #detailsState;
    #getDetailsState() {
        if (!this.#detailsState) {
            const detailsState = [];
            const componentElement = KitRenderer.getComponentElement(this.componentId);
            const detailsElements = componentElement.querySelectorAll("details");
            for (const detailsElement of detailsElements) {
                detailsState.push({
                    id: detailsElement.id,
                    isOpen: detailsElement.open
                });
            }
            this.#detailsState = detailsState;
        }
        return this.#detailsState;
    }

    #applyDetailsState() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        if (componentElement) {
            const detailsElements = componentElement.querySelectorAll("details");
            const detailsState = this.#getDetailsState();
            for (const detailsElement of detailsElements) {
                const isOpen = detailsState.find(x => x.id == detailsElement.id)?.isOpen;
                detailsElement.open = isOpen;
            }
        }
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
                    newPalette.push(newToolRef.getData());
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
                            oldValue: oldTemplateRef.getData(),
                            newValue: newTemplateRef.getData()
                        })
                    }
                }
            }
        }
        return mapItems;
    }
}
