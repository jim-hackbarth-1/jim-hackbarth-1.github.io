
import { KitComponent, KitDependencyManager, KitMessenger, KitRenderer } from "../../../../ui-kit.js";
import {
    ChangeType,
    EntityReference,
    FileManager, 
    MapItemTemplate,
    MapWorkerClient,
    MapWorkerInputMessageType,
    PathStyle,
    PathStyleOption,
    PathStyleType,
    PresentationMode
} from "../../../../domain/references.js";
import { EditorModel } from "../../editor/editor.js";
import { ToolPaletteDialogModel } from "../tool-palette-dialog.js";

export function createModel() {
    return new PathStyleViewModel();
}

export class PathStyleViewModel {

    // event handlers
    async onRenderStart(componentId, modelInput) {
        this.componentId = componentId;
        this.pathStyleInfo = modelInput.pathStyleInfo;
        this.pathStyle = await this.#getPathStyle();
    }

    async onRenderComplete() {
        KitMessenger.subscribe(EditorModel.MapUpdatedNotificationTopic, this.componentId, this.onMapUpdated.name);
        this.#completeRender();
    }

    async onMapUpdated(message) {
        this.pathStyle = await this.#getPathStyle()
        if (this.pathStyle) {
            let reRender = false;
            if (message?.data?.changeSet?.changes) {
                const pathStyleChange = message.data.changeSet.changes.some(
                    c => c.changeObjectType == PathStyle.name && c.pathStyleId == this.pathStyle.id);
                reRender = pathStyleChange;
            }   
            setTimeout(async () => {
                if (reRender) {
                    await this.#reRenderElement("if-path-style-visible");
                }
            }, 20);
            setTimeout(() => {
                this.#completeRender();
            }, 40);
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
        const ref = this.pathStyleInfo.mapItemTemplateRef;
        if (ref) {
            return (ref.isBuiltIn || ref.isFromTemplate) ? "disabled" : null;
        }
        return "disabled";
    }

    getStyleType() {
        if (this.pathStyle) {
            return this.pathStyle.getStyleOptionValue(PathStyleOption.PathStyleType);
        }
        return null;
    }

    getOption(optionName) {
        if (this.pathStyle) {
            let optionValue = this.pathStyle.getStyleOptionValue(optionName);
            if (optionName == "Dash" || optionName == "ImageArrayOffsets") {
                optionValue = (optionValue ?? []).join(", ");
            }
            if (optionName == "Opacity") {
                optionValue = (optionValue ?? 1) * 100;
            }
            return optionValue;
        }
        return null;
    }

    async updateStyleType() {
        const newStyleType = this.#getElement("#select-style-type").value;        
        if (newStyleType == "" && this.pathStyleInfo.isCaptionBackgroundFill) {
            await this.#clearCaptionBackgroundFill();
            return;
        }
        if (newStyleType == "" && this.pathStyleInfo.isCaptionBorderStroke) {
            await this.#clearCaptionBorderStroke();
            return;
        }
        const oldValue = this.pathStyle.getData().options;
        const newValue = PathStyle.getOptionDefaults(newStyleType);
        const changes = [
            {
                changeType: ChangeType.Edit,
                changeObjectType: PathStyle.name,
                propertyName: "options",
                oldValue: oldValue,
                newValue: newValue,
                mapItemTemplateRef: this.pathStyleInfo.mapItemTemplateRef.getData(),
                pathStyleId: this.pathStyle.id
            }
        ];
        await this.#updateMap(changes);
    }

    getColorStops() {
        const colorStops = [];
        if (this.pathStyle) {
            for (let i = 1; i <= 5; i++) {
                colorStops.push({
                    index: i,
                    colorStop: this.pathStyle.getStyleOptionValue(`ColorStop${i}`)
                });
            }
        }
        return colorStops;
    }

    getImages() {
        const images = [];
        if (this.pathStyle) {
            for (let i = 1; i <= 10; i++) {
                images.push({
                    index: i,
                    image: this.pathStyle.getStyleOptionValue(`ImageArraySource${i}`)
                });
            }
        }
        return images;
    }

    getImageSource(imageIndex) {
        return this.pathStyle.getStyleOptionValue(`ImageArraySource${imageIndex}`);
    }

    async browseImage(imageIndex) {
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
        let elementId = "image-data";
        if (imageIndex) {
            elementId = `image-data-${imageIndex}`;
        }
        const dataElement = this.#getElement(`#${elementId}`);
        dataElement.value = imageSource;
        await this.update();
    }

    hasImage(image) {
        if (image && image.length > 0) {
            return true;
        }
        return false;
    }

    isRemoveImageDisabled(imageIndex) {
        const imageSource = this.pathStyle.getStyleOptionValue(`ImageArraySource${imageIndex}`);
        if (imageSource) {
            return "";
        }
        return "disabled";
    }

    async removeImage(imageIndex) {
        const dataElement = this.#getElement(`#image-data-${imageIndex}`);
        dataElement.value = null;
        await this.update();
    }

    async update() {
        if (this.pathStyleInfo.captionViewModel) {
            await this.pathStyleInfo.captionViewModel.update();
        }
        else {
            const validationResult = this.validate();
            if (validationResult.isValid) {
                const oldValue = this.pathStyle.getData().options;
                const newValue = validationResult.options;
                const changes = [
                    {
                        changeType: ChangeType.Edit,
                        changeObjectType: PathStyle.name,
                        propertyName: "options",
                        oldValue: oldValue,
                        newValue: newValue,
                        mapItemTemplateRef: this.pathStyleInfo.mapItemTemplateRef.getData(),
                        pathStyleId: this.pathStyle.id
                    }
                ];
                await this.#updateMap(changes);
            }
        }
    }

    validate() {
        let isValid = true;
        const options = [];
        const styleType = this.getStyleType();
        if (styleType && styleType.length > 0) {
            options.push({ key: PathStyleOption.PathStyleType, value: styleType });
        }
        if (styleType == PathStyleType.ColorFill
            || styleType == PathStyleType.ColorStroke) {
            const colorResult = this.#validateColor();
            isValid = isValid && colorResult.isValid;
            options.push({ key: PathStyleOption.Color, value: colorResult.color });
        }
        if (styleType && styleType.length > 0) {
            const opacityResult = this.#validateOpacity();
            isValid = isValid && opacityResult.isValid;
            options.push({ key: PathStyleOption.Opacity, value: opacityResult.opacity });

            const presentationModeResult = this.#validatePresentationMode();
            isValid = isValid && presentationModeResult.isValid;
            options.push({ key: PathStyleOption.PresentationMode, value: presentationModeResult.presentationMode });
        }
        if (styleType == PathStyleType.LinearGradientFill
            || styleType == PathStyleType.LinearGradientStroke
            || styleType == PathStyleType.RadialGradientFill
            || styleType == PathStyleType.RadialGradientStroke
            || styleType == PathStyleType.ConicalGradientFill
            || styleType == PathStyleType.ConicalGradientStroke) {
            for (let i = 1; i <= 5; i++) {
                const colorStopResult = this.#validateColorStop(i);
                isValid = isValid && colorStopResult.isValid;
                options.push({ key: `ColorStop${i}`, value: colorStopResult.colorStop });
            }
            const gradientStartResult = this.#validateGradientStart();
            isValid = isValid && gradientStartResult.isValid;
            options.push({ key: PathStyleOption.GradientStart, value: gradientStartResult.gradientStart });
        }
        if (styleType == PathStyleType.TileFill
            || styleType == PathStyleType.TileStroke) {
            const tileImageSourceResult = this.#validateTileImageSource();
            isValid = isValid && tileImageSourceResult.isValid;
            options.push({ key: PathStyleOption.TileImageSource, value: tileImageSourceResult.tileImageSource });
        }
        if (styleType == PathStyleType.ImageArrayFill
            || styleType == PathStyleType.ImageArrayStroke) {
            const imageArrayOffsetsResult = this.#validateImageArrayOffsets();
            isValid = isValid && imageArrayOffsetsResult.isValid;
            options.push({ key: PathStyleOption.ImageArrayOffsets, value: imageArrayOffsetsResult.imageArrayOffsets });
            for (let i = 1; i <= 10; i++) {
                const imageResult = this.#validateImageArraySource(i);
                isValid = isValid && imageResult.isValid;
                options.push({ key: `ImageArraySource${i}`, value: imageResult.imageSource });
            }
        }
        if (styleType == PathStyleType.ColorStroke
            || styleType == PathStyleType.LinearGradientStroke
            || styleType == PathStyleType.RadialGradientStroke
            || styleType == PathStyleType.ConicalGradientStroke
            || styleType == PathStyleType.TileStroke
            || styleType == PathStyleType.ImageArrayStroke) {
            const strokeStylesResult = this.#validateStrokeStyles();
            isValid = isValid && strokeStylesResult.isValid;
            options.push({ key: PathStyleOption.Width, value: strokeStylesResult.width });
            options.push({ key: PathStyleOption.Dash, value: strokeStylesResult.dash });
            options.push({ key: PathStyleOption.DashOffset, value: strokeStylesResult.dashOffset });
            options.push({ key: PathStyleOption.Cap, value: strokeStylesResult.endCap });
            options.push({ key: PathStyleOption.Join, value: strokeStylesResult.join });
            options.push({ key: PathStyleOption.StrokeOffset, value: strokeStylesResult.offset });
        }
        if (styleType == PathStyleType.LinearGradientFill
            || styleType == PathStyleType.LinearGradientStroke
            || styleType == PathStyleType.RadialGradientFill
            || styleType == PathStyleType.RadialGradientStroke) {
            const gradientEndResult = this.#validateGradientEnd();
            isValid = isValid && gradientEndResult.isValid;
            options.push({ key: PathStyleOption.GradientEnd, value: gradientEndResult.gradientEnd });
        }
        if (styleType == PathStyleType.RadialGradientFill
            || styleType == PathStyleType.RadialGradientStroke) {
            const gradientStartRadiusResult = this.#validateGradientStartRadius();
            isValid = isValid && gradientStartRadiusResult.isValid;
            options.push({ key: PathStyleOption.GradientStartRadius, value: gradientStartRadiusResult.gradientStartRadius });
            const gradientEndRadiusResult = this.#validateGradientEndRadius();
            isValid = isValid && gradientEndRadiusResult.isValid;
            options.push({ key: PathStyleOption.GradientEndRadius, value: gradientEndRadiusResult.gradientEndRadius });
        }
        if (styleType == PathStyleType.ConicalGradientFill
            || styleType == PathStyleType.ConicalGradientStroke) {
            const gradientStartAngleResult = this.#validateGradientStartAngle();
            isValid = isValid && gradientStartAngleResult.isValid;
            options.push({ key: PathStyleOption.GradientAngle, value: gradientStartAngleResult.gradientStartAngle });
        }
        return {
            isValid: isValid,
            options: options
        }
    }

    isSelected(optionName, optionValue) {
        const currentValue = this.getOption(optionName);
        if (currentValue == optionValue) {
            return "selected";
        }
        return "";
    }

    // helpers
    #validateColor() {
        let isValid = true;
        const color = this.#getElement("#color")?.value;
        if (!color || !color.match(/^#[0-9a-f]{6}/i)) {
            this.#getElement("#validation-color").innerHTML = "Valid hex color value (e.g. '#c0c0c0') required.";
            isValid = false;
        }
        return {
            isValid: isValid,
            color: color
        };
    }

    #validateOpacity() {
        let isValid = true;
        const opacity = parseInt(this.#getElement("#opacity")?.value);
        if (isNaN(opacity) || opacity < 0 || opacity > 100) {
            this.#getElement("#validation-opacity").innerHTML = "Valid number between 0 and 100 required";
            isValid = false;
        }
        return {
            isValid: isValid,
            opacity: opacity / 100
        };
    }

    #validatePresentationMode() {
        let isValid = true;
        const presentationMode = this.#getElement("#presentation-mode")?.value ?? "";
        const presentationModes = [PresentationMode.Normal, PresentationMode.EditViewOnly, PresentationMode.PresentationViewOnly];
        if (!presentationModes.includes(presentationMode)) {
            this.#getElement("#validation-presentation-mode").innerHTML = "Valid presentation mode selection required.";
            isValid = false;
        }
        return {
            isValid: isValid,
            presentationMode: presentationMode
        };
    }

    #validateColorStop(colorStopIndex) {
        const model = this.#getModelFromComponentElement(`color-stop-${colorStopIndex}`);
        const validationResult = model.validate();
        return {
            isValid: validationResult.isValid,
            colorStop: {
                offset: validationResult.offset,
                color: validationResult.color
            }
        }
    }

    #validateTileImageSource() {
        let isValid = true;
        const tileImageSource = this.#getElement("#image-data")?.value;
        if (!tileImageSource || !tileImageSource.startsWith("data:")) {
            this.#getElement("#validation-image").innerHTML = "Valid tile image source required (e.g. 'data:image/png;base64,iVBOR ...').";
            isValid = false;
        }
        return {
            isValid: isValid,
            tileImageSource: tileImageSource
        };
    }

    #validateImageArrayOffsets() {
        let isValid = true;
        let imageArrayOffsets = this.#getElement("#offsets")?.value;
        if (imageArrayOffsets) {
            imageArrayOffsets = imageArrayOffsets.replaceAll(' ', '').split(',').map(o => parseInt(o));
        }
        else {
            imageArrayOffsets = [];
        }
        if (imageArrayOffsets.some(o => isNaN(o))) {
            this.#getElement("#validation-offsets").innerHTML = "Invalid offsets string format. Comma-delimited list of integers expected.";
            isValid = false;
        }
        if (imageArrayOffsets.some(o => o < 1 || o > 10)) {
            this.#getElement("#validation-offsets").innerHTML = "Invalid offsets value. Offset values must be integers between 1 and 10.";
            isValid = false;
        }
        return {
            isValid: isValid,
            imageArrayOffsets: imageArrayOffsets
        };
    }

    #validateImageArraySource(imageIndex) {
        let isValid = true;
        let imageSource = this.#getElement(`#image-data-${imageIndex}`)?.value;
        if (imageSource) {
            imageSource = imageSource.replace("undefined", "");
        }
        if (imageSource && imageSource.length > 0) {
            if (!imageSource.startsWith("data:")) {
                this.#getElement(`#validation-image-${imageIndex}`).innerHTML = "Valid image source required (e.g. 'data:image/png;base64,iVBOR ...').";
                isValid = false;
            }
        }
        return {
            isValid: isValid,
            imageSource: imageSource
        };
    }

    #validateStrokeStyles() {
        const model = this.#getModelFromComponentElement("stroke-styles");
        return model.validate();
    }

    #validateGradientStart() {
        let isValid = true;
        const startX = parseInt(this.#getElement("#start-x")?.value);
        if (isNaN(startX) || startX < 0 || startX > 100) {
            this.#getElement("#validation-start-x").innerHTML = "Valid number between 0 and 100 required";
            isValid = false;
        }
        const startY = parseInt(this.#getElement("#start-y")?.value);
        if (isNaN(startY) || startY < 0 || startY > 100) {
            this.#getElement("#validation-start-y").innerHTML = "Valid number between 0 and 100 required";
            isValid = false;
        }
        return {
            isValid: isValid,
            gradientStart: { x: startX, y: startY }
        };
    }

    #validateGradientEnd() {
        let isValid = true;
        const endX = parseInt(this.#getElement("#end-x")?.value);
        if (isNaN(endX) || endX < 0 || endX > 100) {
            this.#getElement("#validation-end-x").innerHTML = "Valid number between 0 and 100 required";
            isValid = false;
        }
        const endY = parseInt(this.#getElement("#end-y")?.value);
        if (isNaN(endY) || endY < 0 || endY > 100) {
            this.#getElement("#validation-end-y").innerHTML = "Valid number between 0 and 100 required";
            isValid = false;
        }
        return {
            isValid: isValid,
            gradientEnd: { x: endX, y: endY }
        };
    }

    #validateGradientStartRadius() {
        let isValid = true;
        const startRadius = parseInt(this.#getElement("#start-radius")?.value);
        if (isNaN(startRadius) || startRadius < 0 || startRadius > 100) {
            this.#getElement("#validation-start-radius").innerHTML = "Valid number between 0 and 100 required";
            isValid = false;
        }
        return {
            isValid: isValid,
            gradientStartRadius: startRadius
        };
    }

    #validateGradientEndRadius() {
        let isValid = true;
        const endRadius = parseInt(this.#getElement("#end-radius")?.value);
        if (isNaN(endRadius) || endRadius < 0 || endRadius > 100) {
            this.#getElement("#validation-end-radius").innerHTML = "Valid number between 0 and 100 required";
            isValid = false;
        }
        return {
            isValid: isValid,
            gradientEndRadius: endRadius
        };
    }

    #validateGradientStartAngle() {
        let isValid = true;
        const startAngle = parseInt(this.#getElement("#start-angle")?.value);
        if (isNaN(startAngle) || startAngle < 0 || startAngle > 100) {
            this.#getElement("#validation-start-angle").innerHTML = "Valid number between 0 and 360 required";
            isValid = false;
        }
        return {
            isValid: isValid,
            gradientStartAngle: startAngle
        };
    }

    async #getPathStyle() {
        const map = await MapWorkerClient.getMap();
        const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, this.pathStyleInfo.mapItemTemplateRef));
        if (mapItemTemplate) {
            if (this.pathStyleInfo.isFill) {
                return mapItemTemplate.fills.find(f => f.id == this.pathStyleInfo.id);
            }
            if (this.pathStyleInfo.isStroke) {
                return mapItemTemplate.strokes.find(s => s.id == this.pathStyleInfo.id);
            }
            if (this.pathStyleInfo.isCaptionBackgroundFill) {
                return mapItemTemplate.caption.backgroundFill;
            }
            if (this.pathStyleInfo.isCaptionBorderStroke) {
                return mapItemTemplate.caption.borderStroke;
            }
        }
        return null;
    }

    #completeRender() {
        this.#loadStyleTypes();
        this.#loadImageSources();
        let select = this.#getElement("#select-style-type");
        if (select) {
            select.scrollIntoView();
        }
    }

    #loadStyleTypes() {
        let styleTypes = [
            { value: PathStyleType.ColorFill, label: "Color fill" },
            { value: PathStyleType.LinearGradientFill, label: "Linear gradient fill" },
            { value: PathStyleType.RadialGradientFill, label: "Radial gradient fill" },
            { value: PathStyleType.ConicalGradientFill, label: "Conical gradient fill" },
            { value: PathStyleType.TileFill, label: "Tile fill" },
            { value: PathStyleType.ImageArrayFill, label: "Image array fill" }
        ];
        if (this.pathStyleInfo.isStroke) {
            styleTypes = [
                { value: PathStyleType.ColorStroke, label: "Color stroke" },
                { value: PathStyleType.LinearGradientStroke, label: "Linear gradient stroke" },
                { value: PathStyleType.RadialGradientStroke, label: "Radial gradient stroke" },
                { value: PathStyleType.ConicalGradientStroke, label: "Conical gradient stroke" },
                { value: PathStyleType.TileStroke, label: "Tile stroke" },
                { value: PathStyleType.ImageArrayStroke, label: "Image array stroke" }
            ];
        }
        if (this.pathStyleInfo.isCaptionBackgroundFill) {
            styleTypes = [
                { value: "", label: "None" },
                { value: PathStyleType.ColorFill, label: "Color fill" },
                { value: PathStyleType.LinearGradientFill, label: "Linear gradient fill" },
                { value: PathStyleType.RadialGradientFill, label: "Radial gradient fill" },
                { value: PathStyleType.ConicalGradientFill, label: "Conical gradient fill" },
                { value: PathStyleType.TileFill, label: "Tile fill" }
            ];
        }
        if (this.pathStyleInfo.isCaptionBorderStroke) {
            styleTypes = [
                { value: "", label: "None" },
                { value: PathStyleType.ColorStroke, label: "Color stroke" },
                { value: PathStyleType.LinearGradientStroke, label: "Linear gradient stroke" },
                { value: PathStyleType.RadialGradientStroke, label: "Radial gradient stroke" },
                { value: PathStyleType.ConicalGradientStroke, label: "Conical gradient stroke" },
                { value: PathStyleType.TileStroke, label: "Tile stroke" }
            ];
        }
        const selectElement = this.#getElement("#select-style-type");
        if (selectElement) {
            const appDocument = KitDependencyManager.getDocument();
            const styleType = this.pathStyle.getStyleOptionValue(PathStyleOption.PathStyleType);
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
        let imgElement = this.#getElement("#image-preview")
        if (imgElement) {
            imgElement.setAttribute("src", this.getOption(PathStyleOption.TileImageSource));
        }
        for (let i = 1; i <= 10; i++) {
            imgElement = this.#getElement(`#image-preview-${i}`)
            if (imgElement) {
                const debug = this.getOption(`ImageArraySource${i}`);
                imgElement.setAttribute("src", this.getOption(`ImageArraySource${i}`));
            }
        }
    }

    async #clearCaptionBackgroundFill() {
        const map = await MapWorkerClient.getMap();
        const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, this.pathStyleInfo.mapItemTemplateRef));
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
                mapItemTemplateRef: this.pathStyleInfo.mapItemTemplateRef.getData()
            }
        ];
        await this.#updateMap(changes);
    }

    async #clearCaptionBorderStroke() {
        const map = await MapWorkerClient.getMap();
        const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, this.pathStyleInfo.mapItemTemplateRef));
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
                mapItemTemplateRef: this.pathStyleInfo.mapItemTemplateRef.getData()
            }
        ];
        await this.#updateMap(changes);
    }

    #componentElement;
    #getElement(selector) {
        if (!this.#componentElement) {
            this.#componentElement = KitRenderer.getComponentElement(this.componentId);
        }
        return this.#componentElement.querySelector(selector);
    }

    #getModelFromComponentElement(elementId) {
        const element = this.#getElement(`#${elementId}`);
        const componentId = element.getAttribute("data-kit-component-id");
        const component = KitComponent.find(componentId);
        return component?.model;
    }

    async #reRenderElement(elementId) {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        if (componentElement) {
            const element = componentElement.querySelector(`#${elementId}`);
            const componentId = element.getAttribute("data-kit-component-id");
            if (KitComponent.find(componentId) && KitComponent.find(this.componentId)) {
                await KitRenderer.renderComponent(componentId);
            }
        }
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
}
