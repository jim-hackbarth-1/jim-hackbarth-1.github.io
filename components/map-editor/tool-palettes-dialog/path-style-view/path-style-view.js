
import {
    ChangeType,
    EntityReference,
    MapItemTemplate,
    MapWorkerClient,
    MapWorkerInputMessageType,
    PathStyle,
    PathStyleOption,
    PathStyleType,
    PresentationMode
} from "../../../../domain/references.js";
import { ToolPalettesDialogModel } from "../tool-palettes-dialog.js";

export function createModel() {
    return new PathStyleViewModel();
}

class PathStyleViewModel {

    // event handlers
    async init(kitElement, kitObjects) {
        this.#kitElement = kitElement;
        PathStyleViewModel.#dialogModel = kitObjects.find(o => o.alias == "dialogModel")?.object; 
        const componentInfo = PathStyleViewModel.#dialogModel.getSelectedDetailComponentInfo();
        if (componentInfo.componentName == "path.style") {
            PathStyleViewModel.#map = await MapWorkerClient.getMap();
            PathStyleViewModel.#mapItemTemplate = null;
            PathStyleViewModel.#pathStyle = null;
            PathStyleViewModel.#tempPathStyleType = null;
            PathStyleViewModel.#tempColorStops = null;
            PathStyleViewModel.#tempImages = null;
            const parts = componentInfo.id.split("-");
            PathStyleViewModel.#pathStyleNavType = parts[0];
            switch (PathStyleViewModel.#pathStyleNavType) {
                case "caption.background":
                    {
                        const mapItemTemplateRef = ToolPalettesDialogModel.deSerializeRef(parts[1]);
                        PathStyleViewModel.#mapItemTemplate = PathStyleViewModel.#map.mapItemTemplates.find(
                            mit => EntityReference.areEqual(mit.ref, mapItemTemplateRef));
                        PathStyleViewModel.#pathStyle = PathStyleViewModel.#mapItemTemplate.caption.backgroundFill;
                        PathStyleViewModel.#tempPathStyleType = PathStyleType.ColorFill;
                    }
                    break;
                case "caption.border":
                    {
                        const mapItemTemplateRef = ToolPalettesDialogModel.deSerializeRef(parts[1]);
                        PathStyleViewModel.#mapItemTemplate = PathStyleViewModel.#map.mapItemTemplates.find(
                            mit => EntityReference.areEqual(mit.ref, mapItemTemplateRef));
                        PathStyleViewModel.#pathStyle = PathStyleViewModel.#mapItemTemplate.caption.borderStroke;
                        PathStyleViewModel.#tempPathStyleType = PathStyleType.ColorStroke;
                    }
                    break;
                case "fill":
                    {
                        const pathStyleId = parts[1].replaceAll(".", "-");
                        const mapItemTemplateRef = ToolPalettesDialogModel.deSerializeRef(parts[2]);
                        PathStyleViewModel.#mapItemTemplate = PathStyleViewModel.#map.mapItemTemplates.find(
                            mit => EntityReference.areEqual(mit.ref, mapItemTemplateRef));
                        PathStyleViewModel.#pathStyle = PathStyleViewModel.#mapItemTemplate.fills.find(f => f.id == pathStyleId);
                    }
                    break;
                case "stroke":
                    {
                        const pathStyleId = parts[1].replaceAll(".", "-");
                        const mapItemTemplateRef = ToolPalettesDialogModel.deSerializeRef(parts[2]);
                        PathStyleViewModel.#mapItemTemplate = PathStyleViewModel.#map.mapItemTemplates.find(
                            mit => EntityReference.areEqual(mit.ref, mapItemTemplateRef));
                        PathStyleViewModel.#pathStyle = PathStyleViewModel.#mapItemTemplate.strokes.find(s => s.id == pathStyleId);
                    }
                    break;
            }
        }
    }

    // methods
    getThumbnailSrc() {
        return ToolPalettesDialogModel.getThumbnailSrc(PathStyleViewModel.#pathStyle);
    }

    getThumbnailSvgSrc() {
        return ToolPalettesDialogModel.getThumbnailSvgSrc(PathStyleViewModel.#pathStyle);
    }

    getTitle() {
        if (PathStyleViewModel.#pathStyleNavType == "caption.background") {
            return "Caption background";
        }
        if (PathStyleViewModel.#pathStyleNavType == "caption.border") {
            return "Caption border";
        }
        const pathStyleType = PathStyleViewModel.#pathStyle.getStyleOptionValue(PathStyleOption.PathStyleType);
        return ToolPalettesDialogModel.getPathStyleTypeDisplayName(pathStyleType);
    }

    getMapItemTemplateName() {
        const name = PathStyleViewModel.#mapItemTemplate.ref.name;
        return name.length > 25 ? name.slice(0, 25) + "..." : name;
    }
 
    async editMapItemTemplate() {
        const refId = ToolPalettesDialogModel.serializeRef(PathStyleViewModel.#mapItemTemplate.ref);
        await PathStyleViewModel.#dialogModel.selectNavItemByRefId(`map.item.template-${refId}`);
    }

    isFromTemplate() {
        return PathStyleViewModel.#mapItemTemplate.ref.isFromTemplate;
    }

    getPathStyleTypes() {
        const isStroke = this.isStroke();
        let items = [];
        if (isStroke) {
            items = [
                { id: PathStyleType.ColorStroke, name: "Color", isSelectedAttr: null },
                { id: PathStyleType.LinearGradientStroke, name: "Linear gradient", isSelectedAttr: null },
                { id: PathStyleType.RadialGradientStroke, name: "Radial gradient", isSelectedAttr: null },
                { id: PathStyleType.ConicalGradientStroke, name: "Conical gradient", isSelectedAttr: null },
                { id: PathStyleType.TileStroke, name: "Tile", isSelectedAttr: null },
                { id: PathStyleType.ImageArrayStroke, name: "Image array", isSelectedAttr: null }
            ];
        }
        else {
            items = [
                { id: PathStyleType.ColorFill, name: "Color", isSelectedAttr: null },
                { id: PathStyleType.LinearGradientFill, name: "Linear gradient", isSelectedAttr: null },
                { id: PathStyleType.RadialGradientFill, name: "Radial gradient", isSelectedAttr: null },
                { id: PathStyleType.ConicalGradientFill, name: "Conical gradient", isSelectedAttr: null },
                { id: PathStyleType.TileFill, name: "Tile", isSelectedAttr: null },
                { id: PathStyleType.ImageArrayFill, name: "Image array", isSelectedAttr: null }
            ];
        }
        const selectedItem = items.find(i => i.id == this.getPathStyleType());
        if (selectedItem) {
            selectedItem.isSelectedAttr = "";
        }
        return items;
    }

    async savePathStyle() {
        const validationResult = this.#validate();
        if (validationResult.isValid) {
            const currentPathStyle = PathStyleViewModel.#pathStyle;
            const updatedPathStyle = new PathStyle(validationResult.pathStyleData);
            if (!PathStyleViewModel.#areOptionsEqual(currentPathStyle.options, updatedPathStyle.options)) {
                const changes = [];
                switch (PathStyleViewModel.#pathStyleNavType) {
                    case "caption.background":
                        {
                            const oldValue = PathStyleViewModel.#mapItemTemplate.caption.getData();
                            const newValue = PathStyleViewModel.#mapItemTemplate.caption.getData();
                            newValue.backgroundFill = updatedPathStyle.getData();
                            changes.push({
                                changeType: ChangeType.Edit,
                                changeObjectType: MapItemTemplate.name,
                                propertyName: "caption",
                                oldValue: oldValue,
                                newValue: newValue,
                                mapItemTemplateRef: PathStyleViewModel.#mapItemTemplate.ref.getData()
                            });
                        }
                        break;
                    case "caption.border":
                        {
                            const oldValue = PathStyleViewModel.#mapItemTemplate.caption.getData();
                            const newValue = PathStyleViewModel.#mapItemTemplate.caption.getData();
                            newValue.borderStroke = updatedPathStyle.getData();
                            changes.push({
                                changeType: ChangeType.Edit,
                                changeObjectType: MapItemTemplate.name,
                                propertyName: "caption",
                                oldValue: oldValue,
                                newValue: newValue,
                                mapItemTemplateRef: PathStyleViewModel.#mapItemTemplate.ref.getData()
                            });
                        }
                        break;
                    default:
                        {
                            changes.push({
                                changeType: ChangeType.Edit,
                                changeObjectType: PathStyle.name,
                                propertyName: "options",
                                oldValue: currentPathStyle.options,
                                newValue: updatedPathStyle.options,
                                mapItemTemplateRef: PathStyleViewModel.#mapItemTemplate.ref.getData(),
                                pathStyleId: currentPathStyle.id
                            });
                        }
                        break;
                }
                MapWorkerClient.postWorkerMessage({
                    messageType: MapWorkerInputMessageType.UpdateMap,
                    changeSet: { changes: changes }
                });
            }
        }
    }

    async deletePathStyle() {
        const changes = [];
        switch (PathStyleViewModel.#pathStyleNavType) {
            case "caption.background":
                {
                    const oldValue = PathStyleViewModel.#mapItemTemplate.caption.getData();
                    const newValue = PathStyleViewModel.#mapItemTemplate.caption.getData();
                    newValue.backgroundFill = null;
                    changes.push({
                        changeType: ChangeType.Edit,
                        changeObjectType: MapItemTemplate.name,
                        propertyName: "caption",
                        oldValue: oldValue,
                        newValue: newValue,
                        mapItemTemplateRef: PathStyleViewModel.#mapItemTemplate.ref.getData()
                    });
                }
                break;
            case "caption.border":
                {
                    const oldValue = PathStyleViewModel.#mapItemTemplate.caption.getData();
                    const newValue = PathStyleViewModel.#mapItemTemplate.caption.getData();
                    newValue.borderStroke = null;
                    changes.push({
                        changeType: ChangeType.Edit,
                        changeObjectType: MapItemTemplate.name,
                        propertyName: "caption",
                        oldValue: oldValue,
                        newValue: newValue,
                        mapItemTemplateRef: PathStyleViewModel.#mapItemTemplate.ref.getData()
                    });
                }
                break;
            case "fill":
                {
                    const index
                        = PathStyleViewModel.#mapItemTemplate.fills.findIndex(s => s.id == PathStyleViewModel.#pathStyle.id);
                    changes.push({
                        changeType: ChangeType.Delete,
                        changeObjectType: MapItemTemplate.name,
                        propertyName: "fills",
                        itemIndex: index,
                        itemValue: PathStyleViewModel.#pathStyle.getData(),
                        mapItemTemplateRef: PathStyleViewModel.#mapItemTemplate.ref.getData()
                    });
                }
                break;
            case "stroke":
                {
                    const index
                        = PathStyleViewModel.#mapItemTemplate.strokes.findIndex(s => s.id == PathStyleViewModel.#pathStyle.id);
                    changes.push({
                        changeType: ChangeType.Delete,
                        changeObjectType: MapItemTemplate.name,
                        propertyName: "strokes",
                        itemIndex: index,
                        itemValue: PathStyleViewModel.#pathStyle.getData(),
                        mapItemTemplateRef: PathStyleViewModel.#mapItemTemplate.ref.getData()
                    });
                }
                break;
        }
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    getPathStyleTypeLabel() {
        return this.isStroke() ? "Stroke" : "Fill";
    }

    getPathStyleType() {
        if (!PathStyleViewModel.#tempPathStyleType) {
            PathStyleViewModel.#tempPathStyleType
                = PathStyleViewModel.#pathStyle.getStyleOptionValue(PathStyleOption.PathStyleType);
        }
        return PathStyleViewModel.#tempPathStyleType;
    }

    isPathStyleTypeDisabled() {
        return PathStyleViewModel.#isForCaption() || this.isFromTemplate();
    }

    async updatePathStyleType() {
        PathStyleViewModel.#tempPathStyleType = this.#kitElement.querySelector("#path-style-type").value;
        const form = this.#kitElement.querySelector(".detail-content");
        await UIKit.renderer.renderElement(form);
        const showGradientStart = this.showGradientStart();
        if (showGradientStart) {
            const gradientStart = this.#getDefaultGradientStart();
            this.#kitElement.querySelector("#path-style-gradient-start-x").value = gradientStart.x;
            this.#kitElement.querySelector("#path-style-gradient-start-y").value = gradientStart.y;
        }
        const showGradientEnd = this.showGradientEnd();
        if (showGradientEnd) {
            const gradientEnd = this.#getDefaultGradientEnd();
            this.#kitElement.querySelector("#path-style-gradient-end-x").value = gradientEnd.x;
            this.#kitElement.querySelector("#path-style-gradient-end-y").value = gradientEnd.y;
        }
    }

    getOpacity() {
        const opacity = PathStyleViewModel.#pathStyle.getStyleOptionValue(PathStyleOption.Opacity);
        return (opacity ?? 1) * 100;
    }

    getPresentationModes() {
        const items = [
            { id: "Normal", name: "Normal", isSelectedAttr: null },
            { id: "EditViewOnly", name: "Edit view only", isSelectedAttr: null },
            { id: "PresentationViewOnly", name: "Presentation view only", isSelectedAttr: null },
        ];
        const presentationMode
            = PathStyleViewModel.#pathStyle.getStyleOptionValue(PathStyleOption.PresentationMode) ?? PresentationMode.Normal;
        const selectedItem = items.find(i => i.id == presentationMode);
        if (selectedItem) {
            selectedItem.isSelectedAttr = "";
        }
        return items;
    }

    isPresentationModeDisabled() {
        return PathStyleViewModel.#isForCaption() || this.isFromTemplate();
    }

    getColor() {
        return PathStyleViewModel.#pathStyle.getStyleOptionValue(PathStyleOption.Color) ?? "#a7351d";
    }

    showGradientStart() {
        const pathStyleType = this.getPathStyleType();
        return pathStyleType == PathStyleType.ConicalGradientFill
            || pathStyleType == PathStyleType.ConicalGradientStroke
            || pathStyleType == PathStyleType.LinearGradientFill
            || pathStyleType == PathStyleType.LinearGradientStroke
            || pathStyleType == PathStyleType.RadialGradientFill
            || pathStyleType == PathStyleType.RadialGradientStroke;
    }

    getGradientStartX() {
        return this.#getGradientStart().x;
    }

    getGradientStartY() {
        return this.#getGradientStart().y;
    }

    showGradientEnd() {
        const pathStyleType = this.getPathStyleType();
        return pathStyleType == PathStyleType.LinearGradientFill
            || pathStyleType == PathStyleType.LinearGradientStroke
            || pathStyleType == PathStyleType.RadialGradientFill
            || pathStyleType == PathStyleType.RadialGradientStroke;
    }

    getGradientEndX() {
        return this.#getGradientEnd().x;
    }

    getGradientEndY() {
        return this.#getGradientEnd().y;
    }

    getGradientRadiusStart() {
        return PathStyleViewModel.#pathStyle.getStyleOptionValue(PathStyleOption.GradientStartRadius) ?? 0;
    }

    getGradientRadiusEnd() {
        return PathStyleViewModel.#pathStyle.getStyleOptionValue(PathStyleOption.GradientEndRadius) ?? 80;
    }

    getStartAngle() {
        return PathStyleViewModel.#pathStyle.getStyleOptionValue(PathStyleOption.GradientAngle) ?? 0;
    }

    showColorStops() {
        const pathStyleType = this.getPathStyleType();
        return pathStyleType == PathStyleType.ConicalGradientFill
            || pathStyleType == PathStyleType.ConicalGradientStroke
            || pathStyleType == PathStyleType.LinearGradientFill
            || pathStyleType == PathStyleType.LinearGradientStroke
            || pathStyleType == PathStyleType.RadialGradientFill
            || pathStyleType == PathStyleType.RadialGradientStroke;
    }

    isAddColorStopDisabled() {
        const colorStops = PathStyleViewModel.#getColorStops();
        return this.isFromTemplate() || colorStops.length >= 5;
    }

    async addColorStop() {
        const colorStops = PathStyleViewModel.#getColorStops();
        const defaultOffsets = [10, 30, 50, 70, 90];
        const defaultColors = ["#a7351d", "#9c1da5", "#1d78a5", "#26a51d", "#cdd110"];
        const offset = defaultOffsets[colorStops.length];
        const color = defaultColors[colorStops.length];
        PathStyleViewModel.#tempColorStops.push({ offset: offset, color: color });
        const colorStopsContainer = this.#kitElement.querySelector("#path-style-color-stops-container");
        await UIKit.renderer.renderElement(colorStopsContainer);
    }

    hasColorStops() {
        const colorStops = PathStyleViewModel.#getColorStops();
        return colorStops.length > 0;
    }

    getColorStops() {
        return PathStyleViewModel.#getColorStops();
    }

    updateColorStopColor = (colorStopViewModel) => {
        const index = parseInt(colorStopViewModel.id.replace("path-style-color-stop-color-", ""));
        const colorStop = PathStyleViewModel.#getColorStops()[index];
        colorStop.color = colorStopViewModel.getAttribute("value");
        this.#validate();
    }

    updateColorStopOffset(input) {
        const index = parseInt(input.id.replace("path-style-color-stop-offset-", ""));
        const colorStop = PathStyleViewModel.#getColorStops()[index];
        colorStop.offset = parseInt(input.value);
        this.#validate();
    }

    async removeColorStop(index) {
        PathStyleViewModel.#tempColorStops.splice(index, 1);
        const colorStopsContainer = this.#kitElement.querySelector("#path-style-color-stops-container");
        await UIKit.renderer.renderElement(colorStopsContainer);
    }

    getImage() {
        let image = PathStyleViewModel.#pathStyle.getStyleOptionValue(PathStyleOption.TileImageSource);
        if (!image) {
            image = null;
        }
        return image;
    }

    isAddImageDisabled() {
        const images = PathStyleViewModel.#getImages();
        return this.isFromTemplate() || images.length >= 10;
    }

    async addImage() {
        PathStyleViewModel.#tempImages.push(null);
        const imagesContainer = this.#kitElement.querySelector("#path-style-images-container");
        await UIKit.renderer.renderElement(imagesContainer);
    }

    hasImages() {
        const images = PathStyleViewModel.#getImages();
        return images.length > 0;
    }

    getImages() {
        return PathStyleViewModel.#getImages();
    }

    updateImage(imageViewModel) {
        const index = parseInt(imageViewModel.id.replace("path-style-image-", ""));
        PathStyleViewModel.#tempImages[index] = imageViewModel.getAttribute("src");
    }

    async removeImage(index) {
        PathStyleViewModel.#tempImages.splice(index, 1);
        const imagesContainer = this.#kitElement.querySelector("#path-style-images-container");
        await UIKit.renderer.renderElement(imagesContainer);
    }

    getImageArrayOffsets() {
        return PathStyleViewModel.#pathStyle.getStyleOptionValue(PathStyleOption.ImageArrayOffsets) ?? "";
    }

    isStroke() {
        return PathStyleViewModel.#pathStyleNavType == "stroke" || PathStyleViewModel.#pathStyleNavType == "caption.border";
    }

    getWidth() {
        return PathStyleViewModel.#pathStyle.getStyleOptionValue(PathStyleOption.Width) ?? 3;
    }

    getDash() {
        const dash = PathStyleViewModel.#pathStyle.getStyleOptionValue(PathStyleOption.Dash);
        return (dash ?? []).join(", ");
    }

    getDashOffset() {
        const dashOffset = PathStyleViewModel.#pathStyle.getStyleOptionValue(PathStyleOption.DashOffset);
        return dashOffset ? dashOffset : 0;
    }

    isEndCapDisabled() {
        return PathStyleViewModel.#isForCaption() || this.isFromTemplate();
    }

    getEndCaps() {
        const items = [
            { id: "round", name: "Round", isSelectedAttr: null },
            { id: "butt", name: "Butt", isSelectedAttr: null },
            { id: "square", name: "Square", isSelectedAttr: null }
        ];
        const endCap = PathStyleViewModel.#pathStyle.getStyleOptionValue(PathStyleOption.Cap) ?? "round";
        const selectedItem = items.find(i => i.id == endCap);
        if (selectedItem) {
            selectedItem.isSelectedAttr = "";
        }
        return items;
    }

    getJoins() {
        const items = [
            { id: "round", name: "Round", isSelectedAttr: null },
            { id: "bevel", name: "Bevel", isSelectedAttr: null },
            { id: "Miter", name: "Miter", isSelectedAttr: null }
        ];
        const join = PathStyleViewModel.#pathStyle.getStyleOptionValue(PathStyleOption.Join) ?? "round";
        const selectedItem = items.find(i => i.id == join);
        if (selectedItem) {
            selectedItem.isSelectedAttr = "";
        }
        return items;
    }

    isOffsetDisabled() {
        return PathStyleViewModel.#isForCaption() || this.isFromTemplate();
    }

    getOffsetX() {
        const strokeOffset = PathStyleViewModel.#pathStyle.getStyleOptionValue(PathStyleOption.StrokeOffset);
        return (strokeOffset ?? { x: 0, y: 0 }).x;
    }

    getOffsetY() {
        const strokeOffset = PathStyleViewModel.#pathStyle.getStyleOptionValue(PathStyleOption.StrokeOffset);
        return (strokeOffset ?? { x: 0, y: 0 }).y;
    }

    validate() {
        this.#validate();
    }

    // helpers
    static #dialogModel = null;
    #kitElement = null;
    static #map = null;
    static #pathStyleNavType = null;
    static #mapItemTemplate = null;
    static #pathStyle = null;
    static #tempPathStyleType = null;
    static #tempColorStops = null;
    static #tempImages = null;

    static #isForCaption() {
        const pathStyleNavType = PathStyleViewModel.#pathStyleNavType;
        return pathStyleNavType == "caption.background" || pathStyleNavType == "caption.border";
    }

    static #areOptionsEqual(options1, options2) {
        if (options1.length != options2.length) {
            return false;
        }
        return JSON.stringify(options1) == JSON.stringify(options2);
    }

    static #getColorStops() {
        if (!PathStyleViewModel.#tempColorStops) {
            const colorStops = [];
            for (const colorStop of PathStyleViewModel.#pathStyle.getColorStops()) {
                colorStops.push({ ...colorStop });
            }
            PathStyleViewModel.#tempColorStops = colorStops;
        }
        return PathStyleViewModel.#tempColorStops;
    }

    static #getImages() {
        if (!PathStyleViewModel.#tempImages) {
            PathStyleViewModel.#tempImages = PathStyleViewModel.#pathStyle.getImages();
        }
        return PathStyleViewModel.#tempImages;
    }

    #validate() {
        let isValid = true;
        const validationLabels = this.#kitElement.querySelectorAll(".validation-message");
        for (const label of validationLabels) {
            label.classList.remove("active");
            label.innerHTML = "";
        }
        const options = []; 

        // PathStyleType, Opacity, PresentationMode
        const pathStyleType = this.#kitElement.querySelector("#path-style-type").value;
        options.push({ key: PathStyleOption.PathStyleType, value: pathStyleType });

        const opacity = parseInt(this.#kitElement.querySelector("#path-style-opacity").value);
        options.push({ key: PathStyleOption.Opacity, value: opacity / 100 });
        if (isNaN(opacity)) {
            this.#showValidationMessage(
                "#path-style-opacity-validation",
                "Opacity is required.");
            isValid = false;
        }
        if (opacity < 0 || opacity > 100) {
            this.#showValidationMessage(
                "#path-style-opacity-validation",
                "Opacity must be an integer between 0 and 100.");
            isValid = false;
        }

        const presentationMode = this.#kitElement.querySelector("#path-style-presentation-mode").value;
        options.push({ key: PathStyleOption.PresentationMode, value: presentationMode });
        const presentationModes = [ PresentationMode.Normal, PresentationMode.EditViewOnly, PresentationMode.PresentationViewOnly ];
        if (!presentationModes.includes(presentationMode)) {
            this.#showValidationMessage(
                "#path-style-presentation-mode-validation",
                "Presentation mode is required.");
            isValid = false;
        }

        // Color
        if (pathStyleType == PathStyleType.ColorFill || pathStyleType == PathStyleType.ColorStroke) {
            const color = this.#kitElement.querySelector("#path-style-color").getAttribute("value");
            options.push({ key: PathStyleOption.Color, value: color });
            if (!color || !color.match(/^#[0-9a-f]{6}/i)) {
                this.#showValidationMessage(
                    "#path-style-color-validation",
                    "Valid hex color value (e.g. '#c0c0c0') required.");
                isValid = false;
            }
        }

        // GradientStart, GradientEnd
        if (pathStyleType == PathStyleType.LinearGradientFill
            || pathStyleType == PathStyleType.LinearGradientStroke
            || pathStyleType == PathStyleType.RadialGradientFill
            || pathStyleType == PathStyleType.RadialGradientStroke
            || pathStyleType == PathStyleType.ConicalGradientFill
            || pathStyleType == PathStyleType.ConicalGradientStroke) {
            const x = parseInt(this.#kitElement.querySelector("#path-style-gradient-start-x").value);
            const y = parseInt(this.#kitElement.querySelector("#path-style-gradient-start-y").value);
            options.push({ key: PathStyleOption.GradientStart, value: { x: x, y: y } });
            if (isNaN(x) || x < 0 || x > 100 || isNaN(y) || y < 0 || y > 100) {
                this.#showValidationMessage(
                    "#path-style-gradient-start-validation",
                    "x and y number values between 0 and 100 required.");
                isValid = false;
            }
        }
        if (pathStyleType == PathStyleType.LinearGradientFill
            || pathStyleType == PathStyleType.LinearGradientStroke
            || pathStyleType == PathStyleType.RadialGradientFill
            || pathStyleType == PathStyleType.RadialGradientStroke) {
            const x = parseInt(this.#kitElement.querySelector("#path-style-gradient-end-x").value);
            const y = parseInt(this.#kitElement.querySelector("#path-style-gradient-end-y").value);
            options.push({ key: PathStyleOption.GradientEnd, value: { x: x, y: y } });
            if (isNaN(x) || x < 0 || x > 100 || isNaN(y) || y < 0 || y > 100) {
                this.#showValidationMessage(
                    "#path-style-gradient-end-validation",
                    "x and y number values between 0 and 100 required.");
                isValid = false;
            }
        }

        // StartRadius, EndRadius
        if (pathStyleType == PathStyleType.RadialGradientFill || pathStyleType == PathStyleType.RadialGradientStroke) {
            const start = parseInt(this.#kitElement.querySelector("#path-style-gradient-radius-start").value);
            const end = parseInt(this.#kitElement.querySelector("#path-style-gradient-radius-end").value);
            options.push({ key: PathStyleOption.GradientStartRadius, value: start });
            options.push({ key: PathStyleOption.GradientEndRadius, value: end });
            if (isNaN(start) || start < 0 || start > 100 || isNaN(end) || end < 0 || end > 100) {
                this.#showValidationMessage(
                    "#path-style-gradient-radius-validation",
                    "Start and end number values between 0 and 100 required.");
                isValid = false;
            }
        }

        // StartAngle
        if (pathStyleType == PathStyleType.ConicalGradientFill || pathStyleType == PathStyleType.ConicalGradientStroke) {
            const angle = parseInt(this.#kitElement.querySelector("#path-style-start-angle").value);
            options.push({ key: PathStyleOption.GradientAngle, value: angle });
            if (isNaN(angle) || angle < 0 || angle > 360) {
                this.#showValidationMessage(
                    "#path-style-start-angle-validation",
                    "Angle number value between 0 and 360 required.");
                isValid = false;
            }
        }

        // Color stops
        if (pathStyleType == PathStyleType.LinearGradientFill
            || pathStyleType == PathStyleType.LinearGradientStroke
            || pathStyleType == PathStyleType.RadialGradientFill
            || pathStyleType == PathStyleType.RadialGradientStroke
            || pathStyleType == PathStyleType.ConicalGradientFill
            || pathStyleType == PathStyleType.ConicalGradientStroke) {
            const colorStops = PathStyleViewModel.#getColorStops();
            for (let i = 0; i < colorStops.length; i++) {
                const colorStop = colorStops[i];
                options.push({ key: `ColorStop${i + 1}`, value: colorStop });
                if (!colorStop.color || !colorStop.color.match(/^#[0-9a-f]{6}/i)) {
                    this.#showValidationMessage(
                        `#path-style-color-stop-color-${i}-validation`,
                        "Valid hex color value (e.g. '#c0c0c0') required.");
                    isValid = false;
                }
                if (isNaN(colorStop.offset) || colorStop.offset < 0 || colorStop.offset > 100) {
                    this.#showValidationMessage(
                        `#path-style-color-stop-offset-${i}-validation`,
                        "Offset number value between 0 and 100 required.");
                    isValid = false;
                }
            }
        }

        // TileImageSource
        if (pathStyleType == PathStyleType.TileFill || pathStyleType == PathStyleType.TileStroke) {
            const src = this.#kitElement.querySelector("#path-style-image").getAttribute("src");
            options.push({ key: PathStyleOption.TileImageSource, value: src });
        }

        // Images array, image offsets
        if (pathStyleType == PathStyleType.ImageArrayFill || pathStyleType == PathStyleType.ImageArrayStroke) {
            const images = PathStyleViewModel.#getImages();
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                options.push({ key: `ImageArraySource${i+1}`, value: image });
            }
            let offsets = this.#kitElement.querySelector("#path-style-image-offsets").value ?? "";
            offsets = offsets.replaceAll(' ', '').split(',').map(o => parseInt(o));
            options.push({ key: "ImageArrayOffsets", value: offsets });
            if (offsets.some(o => isNaN(o))) {
                this.#showValidationMessage(
                    "#path-style-image-offsets-validation",
                    "Invalid offsets string format. Comma-delimited list of integers expected.");
                isValid = false;
            }
            if (offsets.some(o => o < 1 || o > 10)) {
                this.#showValidationMessage(
                    "#path-style-image-offsets-validation",
                    "Invalid offsets value. Offset values must be integers between 1 and 10.");
                isValid = false;
            }
        }

        // Common stroke fields
        if (pathStyleType == PathStyleType.ColorStroke
            || pathStyleType == PathStyleType.LinearGradientStroke
            || pathStyleType == PathStyleType.RadialGradientStroke
            || pathStyleType == PathStyleType.ConicalGradientStroke
            || pathStyleType == PathStyleType.TileStroke
            || pathStyleType == PathStyleType.ImageArrayStroke) {

            const width = parseInt(this.#kitElement.querySelector("#path-style-width").value);
            options.push({ key: PathStyleOption.Width, value: width });
            if (isNaN(width)) {
                this.#showValidationMessage(
                    "#path-style-width-validation",
                    "Width is required.");
                isValid = false;
            }
            if (width < 1 || width > 100) {
                this.#showValidationMessage(
                    "#path-style-width-validation",
                    "Width must be an integer between 1 and 100.");
                isValid = false;
            }

            let dashInput = this.#kitElement.querySelector("#path-style-dash").value ?? "";
            dashInput = dashInput.trim();
            let dash = [];
            if (dashInput) {
                dash = dashInput.replaceAll(' ', '').split(',').map(d => parseInt(d));
            }
            options.push({ key: "Dash", value: dash });
            if (dash.some(d => isNaN(d))) {
                this.#showValidationMessage(
                    "#path-style-dash-validation",
                    "Invalid dash string format. Comma-delimited list of integers expected.");
                isValid = false;
            }
            if (dash.some(d => d < 1 || d > 100)) {
                this.#showValidationMessage(
                    "#path-style-dash-validation",
                    "Invalid dash value. Dash values must be integers between 1 and 100.");
                isValid = false;
            }

            const dashOffset = parseInt(this.#kitElement.querySelector("#path-style-dash-offset").value);
            options.push({ key: PathStyleOption.DashOffset, value: dashOffset });
            if (isNaN(dashOffset)) {
                this.#showValidationMessage(
                    "#path-style-dash-offset-validation",
                    "Dash offset is required.");
                isValid = false;
            }
            if (dashOffset < 0 || dashOffset > 10) {
                this.#showValidationMessage(
                    "#path-style-dash-offset-validation",
                    "Dash offset must be an integer between 0 and 10.");
                isValid = false;
            }

            const endCap = this.#kitElement.querySelector("#path-style-end-cap").value;
            options.push({ key: PathStyleOption.Cap, value: endCap });
            if (!endCap) {
                this.#showValidationMessage(
                    "#path-style-end-cap-validation",
                    "End cap is required.");
                isValid = false;
            }

            const join = this.#kitElement.querySelector("#path-style-join").value;
            options.push({ key: PathStyleOption.Join, value: join });
            if (!join) {
                this.#showValidationMessage(
                    "#path-style-join-validation",
                    "Join is required.");
                isValid = false;
            }

            const x = parseInt(this.#kitElement.querySelector("#path-style-offset-x").value);
            const y = parseInt(this.#kitElement.querySelector("#path-style-offset-y").value);
            options.push({ key: PathStyleOption.StrokeOffset, value: { x: x, y: y } });
            if (isNaN(x) || x < -100 || x > 100 || isNaN(y) || y < -100 || y > 100) {
                this.#showValidationMessage(
                    "#path-style-offset-validation",
                    "x and y number values between -100 and 100 required.");
                isValid = false;
            }
        }

        // enable/disable save button
        const enabled = (isValid && !this.isFromTemplate());
        this.#kitElement.querySelector("#save-button").disabled = !enabled;

        return {
            isValid: isValid,
            pathStyleData: {
                id: PathStyleViewModel.#pathStyle.id,
                options: options
            }
        };
    }

    #showValidationMessage(selector, message) {
        const element = this.#kitElement.querySelector(selector);
        element.innerHTML = message;
        element.classList.add("active");
        element.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    #getGradientStart() {
        let gradientStart = PathStyleViewModel.#pathStyle.getStyleOptionValue(PathStyleOption.GradientStart);
        if (!gradientStart) {
            gradientStart = this.#getDefaultGradientStart();
        }
        return gradientStart;
    }

    #getDefaultGradientStart() {
        let gradientStart = { x: 0, y: 0 };
        const pathStyleType = this.getPathStyleType();
        if (pathStyleType == PathStyleType.RadialGradientFill
            || pathStyleType == PathStyleType.RadialGradientStroke
            || pathStyleType == PathStyleType.ConicalGradientFill
            || pathStyleType == PathStyleType.ConicalGradientStroke) {
            gradientStart = { x: 50, y: 50 };
        }
        return gradientStart;
    }

    #getGradientEnd() {
        let gradientEnd = PathStyleViewModel.#pathStyle.getStyleOptionValue(PathStyleOption.GradientEnd);
        if (!gradientEnd) {
            gradientEnd = this.#getDefaultGradientEnd();
        }
        return gradientEnd;
    }

    #getDefaultGradientEnd() {
        let gradientEnd = { x: 100, y: 100 };
        const pathStyleType = this.getPathStyleType();
        if (pathStyleType == PathStyleType.RadialGradientFill || pathStyleType == PathStyleType.RadialGradientStroke) {
            gradientEnd = { x: 50, y: 50 };
        }
        return gradientEnd;
    }
}
