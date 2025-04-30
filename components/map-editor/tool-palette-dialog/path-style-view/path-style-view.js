
import { KitDependencyManager, KitMessenger, KitRenderer } from "../../../../ui-kit.js";
import {
    ChangeType,
    EntityReference,
    FileManager, 
    MapItemTemplate,
    MapWorkerClient,
    MapWorkerInputMessageType,
    PathStyle,
    PathStyleOption,
    PathStyleType
} from "../../../../domain/references.js";
import { EditorModel } from "../../editor/editor.js";

export function createModel() {
    return new PathStyleViewModel();
}

export class PathStyleViewModel {

    // event handlers
    async onRenderStart(componentId, modelInput) {
        this.componentId = componentId;
        this.mapItemTemplateRef = modelInput?.mapItemTemplateRef;
        this.pathStyleId = null;
        this.pathStyle = null;
        this.isForCaptionBackgroundFill = modelInput.isForCaptionBackgroundFill;
        this.isForCaptionBorderStroke = modelInput.isForCaptionBorderStroke;
        if (modelInput?.pathStyle) {
            this.pathStyleId = modelInput.pathStyle.id;
            this.pathStyle = await this.#getPathStyle();
        }
    }

    async onRenderComplete() {
        KitMessenger.subscribe(EditorModel.MapUpdatedNotificationTopic, this.componentId, this.onMapUpdated.name);
        this.#loadStyleTypes();
        this.#loadImageSources();
        let select = this.#getElement("#selectStyleType");
        if (this.isForCaptionBackgroundFill) {
            select = this.#getElement("#selectStyleType-captionBackgroundFill");
        }
        if (this.isForCaptionBorderStroke) {
            select = this.#getElement("#selectStyleType-captionBorderStroke");
        }
        if (select) {
            select.scrollIntoView();
        }
    }

    async onMapUpdated(message) {
        if (this.pathStyle) {
            let reRender = false;
            if (message?.data?.changeSet?.changes) {
                const pathStyleChange = message.data.changeSet.changes.some(c => c.changeObjectType == PathStyle.name);
                reRender = pathStyleChange;
            }
            if (reRender) {
                this.pathStyle = await this.#getPathStyle();
                await this.#reRenderElement("if-path-style-visible");
            }
            this.#loadStyleTypes();
            setTimeout(() => {
                this.#loadImageSources();
            }, 20);
        }
    }

    onKeyDown(event) {
        event.stopPropagation();
    }

    // methods
    isVisible() {
        if (this.pathStyle) {
            return true;
        }
        return false;
    }

    isDisabled() {
        if (this.mapItemTemplateRef) {
            return (this.mapItemTemplateRef.isBuiltIn || this.mapItemTemplateRef.isFromTemplate) ? "disabled" : null;
        }
        return "disabled";
    }

    getStyleType() {
        if (this.pathStyle) {
            return this.pathStyle.getStyleOptionValue(PathStyleOption.PathStyleType);
        }
        return null;
    }

    getPathStyle() {
        return this.pathStyle;
    }

    getSelectStyleTypeId() {
        let id = "selectStyleType";
        if (this.isForCaptionBackgroundFill) {
            id += "-captionBackgroundFill";
        }
        if (this.isForCaptionBorderStroke) {
            id += "-captionBorderStroke";
        }
        return id;
    }

    getValidationMessage(optionName) {
        return "";
    }

    getOption(optionName) {
        if (this.pathStyle) {
            let optionValue = this.pathStyle.getStyleOptionValue(optionName);
            if ((optionName == "Dash" || optionName == "ImageArrayOffsets") && optionValue) {
                optionValue = optionValue.join("-");
            }
            return optionValue;
        }
        return null;
    }

    async updateStyleType(selectId) {
        const newStyleType = this.#getElement(`#${selectId}`).value;
        const currentStyleType = this.pathStyle.getStyleOptionValue(PathStyleOption.PathStyleType);
        if (newStyleType == "" && currentStyleType.endsWith("Fill")) {
            await this.#clearCaptionBackgroundFill();
            return;
        }
        if (newStyleType == "" && currentStyleType.endsWith("Stroke")) {
            await this.#clearCaptionBorderStroke();
            return;
        }
        const originalPathStyle = (await this.#getPathStyle()).getData();
        this.pathStyle.options = PathStyle.getOptionDefaults(newStyleType);
        const changes = [
            {
                changeType: ChangeType.Edit,
                changeObjectType: PathStyle.name,
                propertyName: "options",
                oldValue: originalPathStyle.options,
                newValue: this.pathStyle.options,
                mapItemTemplateRef: this.mapItemTemplateRef.getData(),
                pathStyleId: this.pathStyle.id
            }
        ];
        await this.#updateMap(changes);
    }

    async #clearCaptionBackgroundFill() {
        const map = await MapWorkerClient.getMap();
        const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, this.mapItemTemplateRef));
        const oldValue = mapItemTemplate.caption.getData();
        const newValue = mapItemTemplate.caption.getData();
        newValue.backgroundFill = null;
        const changes = [
            {
                changeType: ChangeType.Edit,
                changeObjectType: MapItemTemplate.name,
                propertyName: "caption",
                oldValue: oldValue,
                newValue: newValue,
                mapItemTemplateRef: this.mapItemTemplateRef.getData()
            }
        ];
        await this.#updateMap(changes);
    }

    async #clearCaptionBorderStroke() {
        const map = await MapWorkerClient.getMap();
        const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, this.mapItemTemplateRef));
        const oldValue = mapItemTemplate.caption.getData();
        const newValue = mapItemTemplate.caption.getData();
        newValue.borderStroke = null;
        const changes = [
            {
                changeType: ChangeType.Edit,
                changeObjectType: MapItemTemplate.name,
                propertyName: "caption",
                oldValue: oldValue,
                newValue: newValue,
                mapItemTemplateRef: this.mapItemTemplateRef.getData()
            }
        ];
        await this.#updateMap(changes);
    }

    async updateOptions() {
        const originalPathStyle = (await this.#getPathStyle()).getData();
        this.#update();
        const validationResult = this.#validate();
        if (validationResult.isValid) {
            const changes = [
                {
                    changeType: ChangeType.Edit,
                    changeObjectType: PathStyle.name,
                    propertyName: "options",
                    oldValue: originalPathStyle.options,
                    newValue: this.pathStyle.options,
                    mapItemTemplateRef: this.mapItemTemplateRef.getData(),
                    pathStyleId: this.pathStyle.id
                }
            ];
            await this.#updateMap(changes);
        }
        else {
            await this.#reRenderElement("if-path-style-visible");
        }
    }

    getColorStops() {
        if (this.pathStyle) {
            const colorStops = this.pathStyle.getColorStops();
            const unspecifiedCount = 5 - colorStops.length;
            for (let i = 0; i < unspecifiedCount; i++) {
                colorStops.push({ offset: 0, color: null });
            }
            return colorStops;
        }
        return [];
    }

    async browse(optionName) {
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
        const dataElement = this.#getElement(`#${optionName}-Data`);
        dataElement.value = imageSource;
        this.updateOptions();
    }

    removeImage(optionName) {
        const dataElement = this.#getElement(`#${optionName}-Data`);
        dataElement.value = null;
        this.updateOptions();
    }

    isRemoveImageDisabled(optionName) {
        const imageSource = this.pathStyle.getStyleOptionValue(optionName);
        if (imageSource) {
            return "";
        }
        return "disabled";
    }

    getImages() {
        if (this.pathStyle) {
            const images = this.pathStyle.getImages();
            const unspecifiedCount = 10 - images.length;
            for (let i = 0; i < unspecifiedCount; i++) {
                images.push(null);
            }
            const imagesOut = [];
            let index = 1;
            for (const image of images) {
                imagesOut.push({ sourceId: `ImageArraySource${index}`, image: image });
                index++;
            }
            return imagesOut;
        }
        return [];
    }

    hasImage(imageInfo) {
        if (imageInfo.image && imageInfo.image.length > 0) {
            return true;
        }
        return false;
    }

    getMapItemTemplateRef() {
        return this.mapItemTemplateRef;
    }

    // helpers
    async #getPathStyle() {
        const map = await MapWorkerClient.getMap();
        const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, this.mapItemTemplateRef));
        let pathStyle = null;
        if (mapItemTemplate) {
            pathStyle = mapItemTemplate.fills.find(ps => ps.id == this.pathStyleId);
            if (!pathStyle) {
                pathStyle = mapItemTemplate.strokes.find(ps => ps.id == this.pathStyleId);
            }
            if (this.isForCaptionBackgroundFill) {
                pathStyle = mapItemTemplate.caption?.backgroundFill;
            }
            if (this.isForCaptionBorderStroke) {
                pathStyle = mapItemTemplate.caption?.borderStroke;
            }
        }
        return pathStyle;
    }

    #loadStyleTypes() {
        let styleType = null;
        if (this.pathStyle) {
            styleType = this.pathStyle.getStyleOptionValue(PathStyleOption.PathStyleType);
        }
        const appDocument = KitDependencyManager.getDocument();
        let selectElement = this.#getElement("#selectStyleType");
        let styleTypes = [
            { value: PathStyleType.ColorFill, label: "Color fill" },
            { value: PathStyleType.LinearGradientFill, label: "Linear gradient fill" },
            { value: PathStyleType.RadialGradientFill, label: "Radial gradient fill" },
            { value: PathStyleType.ConicalGradientFill, label: "Conical gradient fill" },
            { value: PathStyleType.TileFill, label: "Tile fill" },
            { value: PathStyleType.ImageArrayFill, label: "Image array fill" }
        ];
        if (styleType && styleType.endsWith("Stroke")) {
            styleTypes = [
                { value: PathStyleType.ColorStroke, label: "Color stroke" },
                { value: PathStyleType.LinearGradientStroke, label: "Linear gradient stroke" },
                { value: PathStyleType.RadialGradientStroke, label: "Radial gradient stroke" },
                { value: PathStyleType.ConicalGradientStroke, label: "Conical gradient stroke" },
                { value: PathStyleType.TileStroke, label: "Tile stroke" },
                { value: PathStyleType.ImageArrayStroke, label: "Image array stroke" }
            ];
        }
        if (this.isForCaptionBackgroundFill) {
            selectElement = this.#getElement("#selectStyleType-captionBackgroundFill");
            styleTypes = [
                { value: "", label: "None" },
                { value: PathStyleType.ColorFill, label: "Color fill" },
                { value: PathStyleType.LinearGradientFill, label: "Linear gradient fill" },
                { value: PathStyleType.RadialGradientFill, label: "Radial gradient fill" },
                { value: PathStyleType.ConicalGradientFill, label: "Conical gradient fill" },
                { value: PathStyleType.TileFill, label: "Tile fill" }
            ];
        }
        if (this.isForCaptionBorderStroke) {
            selectElement = this.#getElement("#selectStyleType-captionBorderStroke");
            styleTypes = [
                { value: "", label: "None" },
                { value: PathStyleType.ColorStroke, label: "Color stroke" },
                { value: PathStyleType.LinearGradientStroke, label: "Linear gradient stroke" },
                { value: PathStyleType.RadialGradientStroke, label: "Radial gradient stroke" },
                { value: PathStyleType.ConicalGradientStroke, label: "Conical gradient stroke" },
                { value: PathStyleType.TileStroke, label: "Tile stroke" }
            ];
        }
        if (selectElement) {
            for (const st of styleTypes) {
                const option = appDocument.createElement("option");
                option.value = st.value;
                option.title = st.label;
                option.innerHTML = st.label;
                option.selected = (st.value == styleType);
                selectElement.appendChild(option);
            }
        }
    }

    #loadImageSources() {
        const imgElements = this.#getElements(".data-tile-preview");
        const src = this.getOption(PathStyleOption.TileImageSource);
        for (const img of imgElements) {
            img.setAttribute("src", src);
        }
        for (let i = 1; i <= 10; i++) {
            const idQuery = `#ImageArraySource${i}-Preview`;
            const imgElement = this.#getElement(idQuery);
            const imageSource = this.getOption(`ImageArraySource${i}`);
            if (imgElement && imageSource) {
                imgElement.setAttribute("src", imageSource);
            }
        }
    }

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

    #update() {
        if (this.pathStyle) {
            const options = [];
            let styleSelectElement = this.#getElement("#selectStyleType");
            if (this.isForCaptionBackgroundFill) {
                styleSelectElement = this.#getElement("#selectStyleType-captionBackgroundFill");
            }
            if (this.isForCaptionBorderStroke) {
                styleSelectElement = this.#getElement("#selectStyleType-captionBorderStroke");
            }
            const styleType = styleSelectElement.value;
            options.push({ key: PathStyleOption.PathStyleType, value: styleType });
            switch (styleType) {
                case PathStyleType.ColorFill:
                    options.push(this.#getColorOption(styleType));
                    options.push(this.#getOpacityOption(styleType));
                    break;
                case PathStyleType.ColorStroke:
                    options.push(this.#getColorOption(styleType));
                    options.push(...this.#getStrokeOptions(styleType));
                    options.push(this.#getOpacityOption(styleType));
                    break;
                case PathStyleType.LinearGradientFill:
                    options.push(this.#getGradientStartOption(styleType));
                    options.push(this.#getGradientEndOption(styleType));
                    options.push(...this.#getColorStopOptions(styleType));
                    options.push(this.#getOpacityOption(styleType));
                    break;
                case PathStyleType.LinearGradientStroke:
                    options.push(this.#getGradientStartOption(styleType));
                    options.push(this.#getGradientEndOption(styleType));
                    options.push(...this.#getColorStopOptions(styleType));
                    options.push(...this.#getStrokeOptions(styleType));
                    options.push(this.#getOpacityOption(styleType));
                    break;
                case PathStyleType.RadialGradientFill:
                    options.push(this.#getGradientStartOption(styleType));
                    options.push(this.#getStartRadiusOption(styleType));
                    options.push(this.#getGradientEndOption(styleType));
                    options.push(this.#getEndRadiusOption(styleType));
                    options.push(...this.#getColorStopOptions(styleType));
                    options.push(this.#getOpacityOption(styleType));
                    break;
                case PathStyleType.RadialGradientStroke:
                    options.push(this.#getGradientStartOption(styleType));
                    options.push(this.#getStartRadiusOption(styleType));
                    options.push(this.#getGradientEndOption(styleType));
                    options.push(this.#getEndRadiusOption(styleType));
                    options.push(...this.#getColorStopOptions(styleType));
                    options.push(...this.#getStrokeOptions(styleType));
                    options.push(this.#getOpacityOption(styleType));
                    break;
                case PathStyleType.ConicalGradientFill:
                    options.push(this.#getGradientStartOption(styleType));
                    options.push(this.#getGradientAngleOption(styleType));
                    options.push(...this.#getColorStopOptions(styleType));
                    options.push(this.#getOpacityOption(styleType));
                    break;
                case PathStyleType.ConicalGradientStroke:
                    options.push(this.#getGradientStartOption(styleType));
                    options.push(this.#getGradientAngleOption(styleType));
                    options.push(...this.#getColorStopOptions(styleType));
                    options.push(...this.#getStrokeOptions(styleType));
                    options.push(this.#getOpacityOption(styleType));
                    break;
                case PathStyleType.TileFill:
                    options.push(this.#getTileImageSourceOption(styleType));
                    options.push(this.#getOpacityOption(styleType));
                    break;
                case PathStyleType.TileStroke:
                    options.push(this.#getTileImageSourceOption(styleType));
                    options.push(...this.#getStrokeOptions(styleType));
                    options.push(this.#getOpacityOption(styleType));
                    break;
                case PathStyleType.ImageArrayFill:
                    options.push(...this.#getImageArraySourceOptions(styleType));
                    options.push(this.#getOpacityOption(styleType));
                    break;
                case PathStyleType.ImageArrayStroke:
                    options.push(...this.#getImageArraySourceOptions(styleType));
                    options.push(...this.#getStrokeOptions(styleType));
                    options.push(this.#getOpacityOption(styleType));
                    break;
            }
            this.pathStyle.options = options;
        }
    }

    #getColorOption(styleType) {
        return { key: PathStyleOption.Color, value: this.#getElement(`#${styleType}-Color`).value };
    }

    #getOpacityOption(styleType) {
        return { key: PathStyleOption.Opacity, value: parseInt(this.#getElement(`#${styleType}-Opacity`).value) };
    }

    #getStrokeOptions(styleType) {
        const dashString = this.#getElement(`#${styleType}-Dash`).value;
        const dashes = dashString.replaceAll(' ', '').split('-').map(d => parseInt(d));
        const strokeOffset = {
            x: this.#getElement(`#${styleType}-StrokeOffset-X`).value,
            y: this.#getElement(`#${styleType}-StrokeOffset-Y`).value,
        };
        return [
            { key: PathStyleOption.Width, value: this.#getElement(`#${styleType}-Width`).value },
            { key: PathStyleOption.Dash, value: dashes },
            { key: PathStyleOption.DashOffset, value: this.#getElement(`#${styleType}-DashOffset`).value },
            { key: PathStyleOption.StrokeOffset, value: strokeOffset },
            { key: PathStyleOption.Cap, value: this.#getElement(`#${styleType}-Cap`).value },
            { key: PathStyleOption.Join, value: this.#getElement(`#${styleType}-Join`).value }
        ];
    }

    #getGradientStartOption(styleType) {
        const x = parseInt(this.#getElement(`#${styleType}-Start-X`).value);
        const y = parseInt(this.#getElement(`#${styleType}-Start-Y`).value);
        return { key: PathStyleOption.GradientStart, value: { x: x, y: y } };
    }

    #getGradientEndOption(styleType) {
        const x = parseInt(this.#getElement(`#${styleType}-End-X`).value);
        const y = parseInt(this.#getElement(`#${styleType}-End-Y`).value);
        return { key: PathStyleOption.GradientEnd, value: { x: x, y: y } };
    }

    #getColorStopOptions(styleType) {
        const options = [];
        for (let i = 1; i <= 5; i++) {
            const offset = parseInt(this.#getElement(`#${styleType}-ColorStop-${i}-Offset`).value);
            const color = this.#getElement(`#${styleType}-ColorStop-${i}-Color`).value;
            if (!isNaN(offset) && color) {
                options.push({ key: `ColorStop${i}`, value: { offset: offset, color: color } });
            }
        }
        return options;
    }

    #getStartRadiusOption(styleType) {
        return { key: PathStyleOption.GradientStartRadius, value: parseInt(this.#getElement(`#${styleType}-StartRadius`).value) };
    }

    #getEndRadiusOption(styleType) {
        return { key: PathStyleOption.GradientEndRadius, value: parseInt(this.#getElement(`#${styleType}-EndRadius`).value) };
    }

    #getGradientAngleOption(styleType) {
        return { key: PathStyleOption.GradientAngle, value: parseInt(this.#getElement(`#${styleType}-StartAngle`).value) };
    }

    #getTileImageSourceOption(styleType) {
        return { key: PathStyleOption.TileImageSource, value: this.#getElement(`#${styleType}-Data`).value };
    }

    #getImageArraySourceOptions(styleType) {
        const offsetsString = this.#getElement(`#${styleType}-ImageArrayOffsets`).value;
        const offsets = offsetsString.replaceAll(' ', '').split('-').map(o => parseInt(o));
        const options = [
            { key: PathStyleOption.ImageArrayOffsets, value: offsets }
        ];
        for (let i = 1; i <= 10; i++) {
            const element = this.#getElement(`#ImageArraySource${i}-Data`);
            if (element) {
                const data = element.value;
                if (data && data != "undefined" && data.length > 0) {
                    options.push({ key: `ImageArraySource${i}`, value: data });
                }
            }
        }
        return options;
    }

    #validate() {
        const validationResult = {
            isValid: true
        };
        // TODO: validation
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
        //const map = await MapWorkerClient.getMap();
        //map.applyChangeSet(new ChangeSet({ changes: changes }));

        // update map worker
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }
}
