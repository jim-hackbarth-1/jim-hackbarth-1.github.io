
import {
    ChangeType,
    EntityReference,
    MapItemTemplate,
    MapWorkerClient,
    MapWorkerInputMessageType,
    PathStyle,
    PathStyleOption,
    PathStyleType
} from "../../../../domain/references.js";
import { ToolPalettesDialogModel } from "../tool-palettes-dialog.js";

export function createModel() {
    return new PathStylesViewModel();
}

class PathStylesViewModel {

    // event handlers
    async init(kitElement, kitObjects) {
        this.#kitElement = kitElement;
        PathStylesViewModel.#dialogModel = kitObjects.find(o => o.alias == "dialogModel")?.object;
        const componentInfo = PathStylesViewModel.#dialogModel.getSelectedDetailComponentInfo();
        if (componentInfo.componentName == "path.styles") {
            PathStylesViewModel.#map = await MapWorkerClient.getMap();
            const parts = componentInfo.id.split("-");
            PathStylesViewModel.#pathStylesType = parts[0];
            const ref = ToolPalettesDialogModel.deSerializeRef(parts[1]);
            PathStylesViewModel.#mapItemTemplate
                = PathStylesViewModel.#map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, ref));
        }
    }

    // methods
    getPathStylesLabel() {
        if (PathStylesViewModel.#pathStylesType == "strokes") {
            return "Strokes";
        }
        return "Fills";
    }

    getMapItemTemplateName() {
        const name = PathStylesViewModel.#mapItemTemplate.ref.name;
        return name.length > 25 ? name.slice(0, 25) + "..." : name;
    }

    async editMapItemTemplate() {
        const refId = ToolPalettesDialogModel.serializeRef(PathStylesViewModel.#mapItemTemplate.ref);
        await PathStylesViewModel.#dialogModel.selectNavItemByRefId(`map.item.template-${refId}`);
    }

    isFromTemplate() {
        return PathStylesViewModel.#mapItemTemplate.ref.isFromTemplate;
    }

    getAddButtonLabel() {
        if (PathStylesViewModel.#pathStylesType == "strokes") {
            return "Add stroke";
        }
        return "Add fill";
    }

    getNoPathStylesLabel() {
        if (PathStylesViewModel.#pathStylesType == "strokes") {
            return "[No strokes]";
        }
        return "[No fills]";
    }

    hasPathStyles() {
        const mapItemTemplate = PathStylesViewModel.#mapItemTemplate;
        const pathStyles = PathStylesViewModel.#pathStylesType == "strokes" ? mapItemTemplate.strokes : mapItemTemplate.fills;
        return pathStyles.length > 0;
    }

    getPathStyles() {
        const mapItemTemplate = PathStylesViewModel.#mapItemTemplate;
        const pathStyles = PathStylesViewModel.#pathStylesType == "strokes" ? mapItemTemplate.strokes : mapItemTemplate.fills;
        const displayList = [];
        const displayName = PathStylesViewModel.#pathStylesType == "strokes" ? "Stroke" : "Fill";
        for (const pathStyle of pathStyles) {
            const pathStyleType = pathStyle.getStyleOptionValue(PathStyleOption.PathStyleType);
            let note = "";
            if (PathStylesViewModel.#pathStylesType == "strokes") {
                note = `Width: ${pathStyle.getStyleOptionValue(PathStyleOption.Width)}`;
            }
            displayList.push({
                id: pathStyle.id,
                thumbnailSrc: ToolPalettesDialogModel.getThumbnailSrc(pathStyle),
                thumbnailSvgSrc: ToolPalettesDialogModel.getThumbnailSvgSrc(pathStyle),
                displayName: ToolPalettesDialogModel.getPathStyleTypeDisplayName(pathStyleType),
                note: note
            });
        }
        return displayList;
    }

    addPathStyle() {
        const changes = [];
        if (PathStylesViewModel.#pathStylesType == "strokes") {
            const pathStyle = new PathStyle({
                options: PathStyle.getOptionDefaults(PathStyleType.ColorStroke)
            });
            changes.push({
                changeType: ChangeType.Insert,
                changeObjectType: MapItemTemplate.name,
                propertyName: "strokes",
                itemIndex: PathStylesViewModel.#mapItemTemplate.strokes.length,
                itemValue: pathStyle.getData(),
                mapItemTemplateRef: PathStylesViewModel.#mapItemTemplate.ref.getData()
            });
        }
        else {
            const pathStyle = new PathStyle({
                options: PathStyle.getOptionDefaults(PathStyleType.ColorFill)
            });
            changes.push({
                changeType: ChangeType.Insert,
                changeObjectType: MapItemTemplate.name,
                propertyName: "fills",
                itemIndex: PathStylesViewModel.#mapItemTemplate.fills.length,
                itemValue: pathStyle.getData(),
                mapItemTemplateRef: PathStylesViewModel.#mapItemTemplate.ref.getData()
            });
        }
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    async editPathStyle(id) {
        const pathStyleId = id.replaceAll("-", ".");
        const prefix = PathStylesViewModel.#pathStylesType == "strokes" ? "stroke" : "fill";
        const refId = ToolPalettesDialogModel.serializeRef(PathStylesViewModel.#mapItemTemplate.ref);
        await PathStylesViewModel.#dialogModel.selectNavItemByRefId(`${prefix}-${pathStyleId}-${refId}`);
    }

    copyPathStyle(id) {
        const changes = [];
        if (PathStylesViewModel.#pathStylesType == "strokes") {
            const pathStyle = PathStylesViewModel.#mapItemTemplate.strokes.find(s => s.id == id);
            const data = pathStyle.getData(true)
            changes.push({
                changeType: ChangeType.Insert,
                changeObjectType: MapItemTemplate.name,
                propertyName: "strokes",
                itemIndex: PathStylesViewModel.#mapItemTemplate.strokes.length,
                itemValue: data,
                mapItemTemplateRef: PathStylesViewModel.#mapItemTemplate.ref.getData()
            });
        }
        else {
            const pathStyle = PathStylesViewModel.#mapItemTemplate.fills.find(s => s.id == id);
            const data = pathStyle.getData(true)
            changes.push({
                changeType: ChangeType.Insert,
                changeObjectType: MapItemTemplate.name,
                propertyName: "fills",
                itemIndex: PathStylesViewModel.#mapItemTemplate.fills.length,
                itemValue: data,
                mapItemTemplateRef: PathStylesViewModel.#mapItemTemplate.ref.getData()
            });
        }
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    allowDrop(event) {
        event.preventDefault();
    }

    dropPathStyleItem(event) {
        if (!event.dataTransfer) {
            return;
        }
        const id = event.dataTransfer.getData("text");
        const listElements = this.#kitElement.querySelectorAll(".list-item");
        const mouseY = event.clientY;
        let newIndex = 0;
        let currentIndex = 0;
        for (let i = 0; i < listElements.length; i++) {
            const rect = listElements[i].getBoundingClientRect();
            if (mouseY > rect.top + rect.height / 2) {
                newIndex = i + 1;
            }
            if (listElements[i].id == id) {
                currentIndex = i;
            }
        }
        if (newIndex > currentIndex) {
            newIndex--;
        }
        if (newIndex == currentIndex) {
            return;
        }
        
        const refData = PathStylesViewModel.#mapItemTemplate.ref.getData();
        let pathStyle = null;
        let propertyName = null;
        if (PathStylesViewModel.#pathStylesType == "strokes") {
            pathStyle = PathStylesViewModel.#mapItemTemplate.strokes.find(s => s.id == id);
            propertyName = "strokes";
        }
        else {
            pathStyle = PathStylesViewModel.#mapItemTemplate.fills.find(f => f.id == id);
            propertyName = "fills";
        }
        if (!pathStyle) {
            return;
        }
        const changes = [
            {
                changeType: ChangeType.Delete,
                changeObjectType: MapItemTemplate.name,
                propertyName: propertyName,
                itemIndex: currentIndex,
                itemValue: pathStyle.getData(),
                mapItemTemplateRef: refData
            },
            {
                changeType: ChangeType.Insert,
                changeObjectType: MapItemTemplate.name,
                propertyName: propertyName,
                itemIndex: newIndex,
                itemValue: pathStyle.getData(),
                mapItemTemplateRef: refData
            }
        ];
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    dragItem(event) {
        event.dataTransfer.setData("text", event.srcElement.id);
    }

    // helpers
    static #dialogModel = null;
    static #map = null;
    static #mapItemTemplate = null;
    static #pathStylesType = null;
    #kitElement = null;

}
