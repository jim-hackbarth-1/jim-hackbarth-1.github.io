
import { KitDependencyManager, KitMessenger, KitRenderer } from "../../../../ui-kit.js";
import {
    ChangeSet,
    ChangeType,
    EntityReference,
    FileManager, 
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
        if (modelInput?.pathStyle) {
            this.pathStyleId = modelInput.pathStyle.id;
            this.pathStyle = await this.#getPathStyle();
        }
        this.isForCaption = modelInput.isForCaption;
    }

    async onRenderComplete() {
        KitMessenger.subscribe(EditorModel.MapUpdatedNotificationTopic, this.componentId, this.onMapUpdated.name);
        this.#loadStyleTypes();
        this.#loadImageSources();
        const select = this.#getElement("#selectStyleType");
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

    getValidationMessage(optionName) {
        return "";
    }

    getOption(optionName) {
        if (this.pathStyle) {
            let optionValue = this.pathStyle.getStyleOptionValue(optionName);
            if (optionName == "Dash" && optionValue) {
                optionValue = optionValue.join("-");
            }
            return optionValue;
        }
        return null;
    }

    async updateStyleType() {
        const originalPathStyle = (await this.#getPathStyle()).getData();
        const styleType = this.#getElement("#selectStyleType").value;
        this.pathStyle.options = PathStyle.getOptionDefaults(styleType);
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
            for (let i = 0; i <= unspecifiedCount; i++) {
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

    getImages() {
        if (this.pathStyle) {
            return this.pathStyle.getImages();
        }
        return [];
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
            if (!pathStyle) {
                pathStyle = mapItemTemplate.caption?.backgroundFill;
            }
            if (!pathStyle) {
                pathStyle = mapItemTemplate.caption?.borderStroke;
            }
        }
        return pathStyle;
    }

    #loadStyleTypes() {
        let styleTypes = [
            { value: PathStyleType.ColorFill, label: "Color fill" },
            { value: PathStyleType.LinearGradientFill, label: "Linear gradient fill" },
            { value: PathStyleType.RadialGradientFill, label: "Radial gradient fill" },
            { value: PathStyleType.ConicalGradientFill, label: "Conical gradient fill" },
            { value: PathStyleType.TileFill, label: "Tile fill" },
            { value: PathStyleType.ImageArrayFill, label: "Image array fill" },
        ];
        let styleType = null;
        if (this.pathStyle) {
            styleType = this.pathStyle.getStyleOptionValue(PathStyleOption.PathStyleType);
        }
        if (styleType && styleType.endsWith("Stroke")) {
            styleTypes = [
                { value: PathStyleType.ColorStroke, label: "Color stroke" },
                { value: PathStyleType.LinearGradientStroke, label: "Linear gradient stroke" },
                { value: PathStyleType.RadialGradientStroke, label: "Radial gradient stroke" },
                { value: PathStyleType.ConicalGradientStroke, label: "Conical gradient stroke" },
                { value: PathStyleType.TileStroke, label: "Tile stroke" },
                { value: PathStyleType.ImageArrayStroke, label: "Image array stroke" },
            ];
        }
        const appDocument = KitDependencyManager.getDocument();
        const selectElement = this.#getElement("#selectStyleType");
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
            const styleType = this.#getElement("#selectStyleType").value;
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
        return [
            { key: PathStyleOption.Width, value: this.#getElement(`#${styleType}-Width`).value },
            { key: PathStyleOption.Dash, value: dashes },
            { key: PathStyleOption.DashOffset, value: this.#getElement(`#${styleType}-DashOffset`).value },
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
        const options = [];
        for (let i = 1; i <= 10; i++) {
            const data = this.#getElement(`#${styleType}-${i}-Data`).value;
            if (data && data.length > 0) {
                options.push({ key: `ImageArraySource${i}`, value: data });
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
        const map = await MapWorkerClient.getMap();
        map.applyChangeSet(new ChangeSet({ changes: changes }));

        // update map worker
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }
}
