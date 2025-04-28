
import { Change, ChangeSet, ChangeType, GeometryUtilities, InputUtilities } from "../references.js";

/** @readonly @enum {string} */
export const PathStyleOption = {
    PathStyleType: "PathStyleType",
    Color: "Color",
    Opacity: "Opacity",
    ColorStop1: "ColorStop1",
    ColorStop2: "ColorStop2",
    ColorStop3: "ColorStop3",
    ColorStop4: "ColorStop4",
    ColorStop5: "ColorStop5",
    TileImageSource: "TileImageSource",
    ImageArrayOffsets: "ImageArrayOffsets",
    ImageArraySource1: "ImageArraySource1",
    ImageArraySource2: "ImageArraySource2",
    ImageArraySource3: "ImageArraySource3",
    ImageArraySource4: "ImageArraySource4",
    ImageArraySource5: "ImageArraySource5",
    ImageArraySource6: "ImageArraySource6",
    ImageArraySource7: "ImageArraySource7",
    ImageArraySource8: "ImageArraySource8",
    ImageArraySource9: "ImageArraySource9",
    ImageArraySource10: "ImageArraySource10",
    Width: "Width",
    Dash: "Dash",
    DashOffset: "DashOffset",
    Cap: "Cap",
    Join: "Join",
    GradientStart: "GradientStart",
    GradientEnd: "GradientEnd",
    GradientStartRadius: "GradientStartRadius",
    GradientEndRadius: "GradientEndRadius",
    GradientAngle: "GradientAngle",
    StrokeOffset: "StrokeOffset"
};

/** @readonly @enum {string} */
export const PathStyleType = {
    ColorFill: "ColorFill",
    ColorStroke: "ColorStroke",
    LinearGradientFill: "LinearGradientFill",
    LinearGradientStroke: "LinearGradientStroke",
    RadialGradientFill: "RadialGradientFill",
    RadialGradientStroke: "RadialGradientStroke",
    ConicalGradientFill: "ConicalGradientFill",
    ConicalGradientStroke: "ConicalGradientStroke",
    TileFill: "TileFill",
    TileStroke: "TileStroke",
    ImageArrayFill: "ImageArrayFill",
    ImageArrayStroke: "ImageArrayStroke"
};

export class PathStyle {

    // constructor
    constructor(data) {
        this.#id = InputUtilities.cleanseString(data?.id) ?? crypto.randomUUID();
        this.#options = this.#cleanseOptions(data?.options);
        this.#eventListeners = {};
    }

    // properties
    #id;
    get id() {
        return this.#id;
    }

    /** @type {{ key: PathStyleOption, value: any}[]}  */
    #options;
    get options() {
        return this.#options;
    }
    set options(options) {
        const changeSet = this.#getPropertyChange("options", this.#options, options);
        this.#pattern = null;
        this.#options = options;
        this.#onChange(changeSet);
    }

    // methods
    getData() {
        return {
            id: this.#id,
            options: this.#options
        };
    }

    addEventListener(eventName, listener) {
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
        this.#eventListeners[eventName].push(listener);
    }

    removeEventListener(eventName, listener) {
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
        const index = this.#eventListeners[eventName].findIndex(l => l === listener);
        if (index > -1) {
            this.#eventListeners[eventName].splice(index, 1);
        }
    }

    applyChange(change, undoing) {
        if (change.changeType == ChangeType.Edit) {
            this.#applyPropertyChange(change.propertyName, undoing ? change.oldValue : change.newValue);
        }
    }

    getStyleOptionValue(optionName) {
        return this.options.find(o => o.key == optionName)?.value;
    }

    getColorStops() {
        return this.options.filter(o => o.key.startsWith("ColorStop")).map(o => o.value);
    }

    getImages() {
        return this.options.filter(o => o.key.startsWith("ImageArraySource")).map(o => o.value);
    }

    async setStyle(context, map, path) {
        const pathStyleType = this.options.find(o => o.key == PathStyleOption.PathStyleType).value;
        switch (pathStyleType) {
            case PathStyleType.ColorFill:
            case PathStyleType.ImageArrayFill:
                this.#setColorFill(context);
                break;
            case PathStyleType.ColorStroke:
            case PathStyleType.ImageArrayStroke:
                this.#setColorStroke(context, map);
                break;
            case PathStyleType.LinearGradientFill:
                this.#setLinearGradientFill(context, path.bounds);
                break;
            case PathStyleType.LinearGradientStroke:
                this.#setLinearGradientStroke(context, map, path.bounds);
                break;
            case PathStyleType.RadialGradientFill:
                this.#setRadialGradientFill(context, path.bounds);
                break;
            case PathStyleType.RadialGradientStroke:
                this.#setRadialGradientStroke(context, map, path.bounds);
                break;
            case PathStyleType.ConicalGradientFill:
                this.#setConicalGradientFill(context, path.bounds);
                break;
            case PathStyleType.ConicalGradientStroke:
                this.#setConicalGradientStroke(context, map, path.bounds);
                break;
            case PathStyleType.TileFill:
                await this.#setTileFill(context, map);
                break;
            case PathStyleType.TileStroke:
                await this.#setTileStroke(context, map);
                break;
        }
    }

    static getOptionDefaults(pathStyleType) {
        const options = [
            { key: PathStyleOption.PathStyleType, value: pathStyleType }
        ];
        switch (pathStyleType) {
            case PathStyleType.ColorFill:
                options.push({ key: PathStyleOption.Color, value: "#c0c0c0" });
                options.push({ key: PathStyleOption.Opacity, value: 100 });
                break;
            case PathStyleType.ColorStroke:
                options.push(...PathStyle.#getStrokeDefaults());
                options.push({ key: PathStyleOption.Color, value: "#696969" });
                options.push({ key: PathStyleOption.Opacity, value: 100 });
                break;
            case PathStyleType.LinearGradientFill:
                options.push(...PathStyle.#getColorStopDefaults());
                options.push({ key: PathStyleOption.GradientStart, value: { x: 0, y: 0 } });
                options.push({ key: PathStyleOption.GradientEnd, value: { x: 100, y: 100 } });
                options.push({ key: PathStyleOption.Opacity, value: 100 });
                break;
            case PathStyleType.LinearGradientStroke:
                options.push(...PathStyle.#getColorStopDefaults());
                options.push(...PathStyle.#getStrokeDefaults());
                options.push({ key: PathStyleOption.GradientStart, value: { x: 0, y: 0 } });
                options.push({ key: PathStyleOption.GradientEnd, value: { x: 100, y: 100 } });
                options.push({ key: PathStyleOption.Opacity, value: 100 });
                break;
            case PathStyleType.RadialGradientFill:
                options.push(...PathStyle.#getColorStopDefaults());
                options.push({ key: PathStyleOption.GradientStart, value: { x: 50, y: 50 } });
                options.push({ key: PathStyleOption.GradientStartRadius, value: 0 });
                options.push({ key: PathStyleOption.GradientEnd, value: { x: 50, y: 50 } });
                options.push({ key: PathStyleOption.GradientEndRadius, value: 100 });
                options.push({ key: PathStyleOption.Opacity, value: 100 });
                break;
            case PathStyleType.RadialGradientStroke:
                options.push(...PathStyle.#getColorStopDefaults());
                options.push(...PathStyle.#getStrokeDefaults());
                options.push({ key: PathStyleOption.GradientStart, value: { x: 0, y: 0 } });
                options.push({ key: PathStyleOption.GradientStartRadius, value: 0 });
                options.push({ key: PathStyleOption.GradientEnd, value: { x: 0, y: 0 } });
                options.push({ key: PathStyleOption.GradientEndRadius, value: 100 });
                options.push({ key: PathStyleOption.Opacity, value: 100 });
                break;
            case PathStyleType.ConicalGradientFill:
                options.push(...PathStyle.#getColorStopDefaults());
                options.push({ key: PathStyleOption.GradientStart, value: { x: 50, y: 50 } });
                options.push({ key: PathStyleOption.GradientAngle, value: 0 });
                options.push({ key: PathStyleOption.Opacity, value: 100 });
                break;
            case PathStyleType.ConicalGradientStroke:
                options.push(...PathStyle.#getColorStopDefaults());
                options.push(...PathStyle.#getStrokeDefaults());
                options.push({ key: PathStyleOption.GradientStart, value: { x: 50, y: 50 } });
                options.push({ key: PathStyleOption.GradientAngle, value: 0 });
                options.push({ key: PathStyleOption.Opacity, value: 100 });
                break;
            case PathStyleType.TileFill:
                options.push({ key: PathStyleOption.TileImageSource, value: PathStyle.#getDefaultTileFill() });
                options.push({ key: PathStyleOption.Opacity, value: 100 });
                break;
            case PathStyleType.TileStroke:
                options.push(...PathStyle.#getStrokeDefaults());
                options.push({ key: PathStyleOption.TileImageSource, value: PathStyle.#getDefaultTileStroke() });
                options.push({ key: PathStyleOption.Opacity, value: 100 });
                break;
            case PathStyleType.ImageArrayFill:
                options.push(...PathStyle.#getDefaultImageArray());
                options.push({ key: PathStyleOption.Opacity, value: 100 });
                break;
            case PathStyleType.ImageArrayStroke:
                options.push(...PathStyle.#getDefaultImageArray());
                options.push(...PathStyle.#getStrokeDefaults());
                options.push({ key: PathStyleOption.Opacity, value: 100 });
                break;
        }
        return options;
    }

    static async buildImageLocationArray(path, isClip, pathStyle, images) {
        const isStroke = (pathStyle.getStyleOptionValue(PathStyleOption.PathStyleType) == PathStyleType.ImageArrayStroke);
        const strokeWidth = pathStyle.getStyleOptionValue(PathStyleOption.Width) ?? 0;
        let heightSum = 0;
        let widthSum = 0;
        for (const image of images) {
            heightSum += image.height;
            widthSum += image.width;
        }
        const heightAvg = heightSum / images.length;
        const widthAvg = widthSum / images.length;

        const offsets = pathStyle.getStyleOptionValue(PathStyleOption.ImageArrayOffsets);

        const imageOffsetsX = [];
        for (const offset of offsets) {
            const imageOffset = (4 + offset) * widthAvg / 8;
            imageOffsetsX.push(imageOffset)
        }
        const imageOffsetsY = [];
        for (const offset of offsets) {
            const imageOffset = (4 + offset) * heightAvg / 8;
            imageOffsetsY.push(imageOffset)
        }
        let x = path.bounds.x;
        let y = path.bounds.y;
        let yBase = y;
        let xOffset = 0;
        let yOffset = 0;
        let imageIndex = 0;
        let image = null;
        let addToArray = false;
        const boundsRight = path.bounds.x + path.bounds.width;
        const boundsBottom = path.bounds.y + path.bounds.height;
        const geometryUtilities = new GeometryUtilities();
        const locations = [];
        while (yBase < boundsBottom) {
            while (x < boundsRight) {
                xOffset = imageOffsetsX[PathStyle.#getRandomInteger(0, imageOffsetsX.length - 1)];
                if (xOffset < 0.5 * widthAvg) {
                    xOffset = 0.5 * widthAvg;
                }
                x += xOffset;
                yOffset = imageOffsetsY[PathStyle.#getRandomInteger(0, imageOffsetsY.length - 1)];
                if (yOffset < 0.5 * heightAvg) {
                    yOffset = 0.5 * heightAvg;
                }
                y = yBase + yOffset;
                imageIndex = PathStyle.#getRandomInteger(0, images.length - 1);
                image = images[imageIndex];
                if (isStroke) {
                    addToArray = PathStyle.#isImageOnPathStroke(strokeWidth, x, y, image, path, isClip, geometryUtilities);
                }
                else {
                    addToArray = !isClip && PathStyle.#isImageInPathFill(x, y, image, path, geometryUtilities);
                }
                if (addToArray) {
                    addToArray = !PathStyle.#doesImageIntersectExistingBounds(geometryUtilities, x - path.start.x, y - path.start.y, image, locations);
                    if (!addToArray) {
                    }
                }
                if (addToArray) {
                    locations.push({
                        index: imageIndex,
                        bounds: { x: x - path.start.x, y: y - path.start.y, width: image.width, height: image.height }
                    });
                }
            }
            x = 0;
            yBase += 0.75 * heightAvg;
        }
        return {
            pathStyleId: pathStyle.id,
            locations: locations
        };
    }

    // helpers
    #eventListeners;

    static #getRandomInteger(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
    }

    static #isImageInPathFill(x, y, image, path, geometryUtilities) {
        const bottomLeft = { x: x, y: y + image.height };
        const bottomRight = { x: x + image.width, y: y + image.height };
        const center = { x: x + image.width / 2, y: y + image.height / 2 };
        return geometryUtilities.isPointInPath(bottomLeft, path.bounds, path)
            && geometryUtilities.isPointInPath(bottomRight, path.bounds, path)
            && geometryUtilities.isPointInPath(center, path.bounds, path);
    }

    static #isImageOnPathStroke(strokeWidth, x, y, image, path, isClip, geometryUtilities) {
        const halfWidth = strokeWidth / 2;
        const topLeft = { x: x - halfWidth, y: y - halfWidth };
        const topRight = { x: x + image.width +  halfWidth, y: y - halfWidth };
        const bottomLeft = { x: x - halfWidth, y: y + image.height + halfWidth };
        const bottomRight = { x: x + image.width + halfWidth, y: y + image.height + halfWidth };
        let pointsIn = [];
        pointsIn.push(geometryUtilities.isPointInPath(topLeft, path.bounds, path));
        pointsIn.push(geometryUtilities.isPointInPath(topRight, path.bounds, path));
        pointsIn.push(geometryUtilities.isPointInPath(bottomLeft, path.bounds, path));
        pointsIn.push(geometryUtilities.isPointInPath(bottomRight, path.bounds, path));
        if (pointsIn.some(p => p == false) && pointsIn.some(p => p == true)) {
            const inPath = PathStyle.#isImageInPathFill(x, y, image, path, geometryUtilities);
            if (isClip) {
                return inPath;
            }
            return !inPath;
        } 
        return false;
    }

    static #doesImageIntersectExistingBounds(geometryUtilities, x, y, image, array) {
        const bottomLeft = { x: x, y: y + image.height };
        const bottomRight = { x: x + image.width, y: y + image.height };
        for (const item of array) {
            if (geometryUtilities.isPointInBounds(bottomLeft, item.bounds) || geometryUtilities.isPointInBounds(bottomRight, item.bounds)) {
                return true;
            }
        }
        return false;
    }

    #onChange = (changeSet) => {
        if (this.#eventListeners[Change.ChangeEvent]) {
            if (changeSet?.changes) {
                for (const change of changeSet.changes) {
                    change.pathStyleId = this.id;
                }
            }
            for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                listener(changeSet);
            }
        }
    }

    #getPropertyChange(propertyName, v1, v2) {
        return ChangeSet.getPropertyChange(PathStyle.name, propertyName, v1, v2);
    }

    #applyPropertyChange(propertyName, propertyValue) {
        switch (propertyName) {
            case "options":
                this.options = this.#cleanseOptions(propertyValue);
                break;
        }
    }

    #cleanseOptions(optionsIn) {
        const optionsOut = [];
        if (optionsIn) {
            for (const option of optionsIn) {
                switch (option.key) {
                    case PathStyleOption.PathStyleType:
                    case PathStyleOption.Color:
                    case PathStyleOption.TileImageSource:
                    case PathStyleOption.ImageArraySource1:
                    case PathStyleOption.ImageArraySource2:
                    case PathStyleOption.ImageArraySource3:
                    case PathStyleOption.ImageArraySource4:
                    case PathStyleOption.ImageArraySource5:
                    case PathStyleOption.ImageArraySource6:
                    case PathStyleOption.ImageArraySource7:
                    case PathStyleOption.ImageArraySource8:
                    case PathStyleOption.ImageArraySource9:
                    case PathStyleOption.ImageArraySource10:
                    case PathStyleOption.Cap:
                    case PathStyleOption.Join:
                        optionsOut.push({ key: option.key, value: InputUtilities.cleanseString(option.value) });
                        break;
                    case PathStyleOption.Opacity:
                    case PathStyleOption.Width:
                    case PathStyleOption.DashOffset:
                    case PathStyleOption.GradientStartRadius:
                    case PathStyleOption.GradientEndRadius:
                    case PathStyleOption.GradientAngle:
                        optionsOut.push({ key: option.key, value: InputUtilities.cleanseNumber(option.value) });
                        break;
                    case PathStyleOption.ColorStop1:
                    case PathStyleOption.ColorStop2:
                    case PathStyleOption.ColorStop3:
                    case PathStyleOption.ColorStop4:
                    case PathStyleOption.ColorStop5:
                        const offset = InputUtilities.cleanseNumber(option.value.offset);
                        const color = InputUtilities.cleanseString(option.value.color);
                        optionsOut.push({ key: option.key, value: { offset: offset, color: color } });
                        break;
                    case PathStyleOption.GradientStart:
                    case PathStyleOption.GradientEnd:
                    case PathStyleOption.StrokeOffset:
                        optionsOut.push({ key: option.key, value: InputUtilities.cleansePoint(option.value) });
                        break;
                    case PathStyleOption.Dash:
                    case PathStyleOption.ImageArrayOffsets:
                        const numbersOut = [];
                        for (const item of option.value) {
                            numbersOut.push(InputUtilities.cleanseNumber(item));
                        }
                        optionsOut.push({ key: option.key, value: numbersOut });
                        break;
                }
            }
        }
        return optionsOut;
    }

    #setColorFill(context) {
        this.#setOpacity(context);
        context.fillStyle = this.options.find(o => o.key == PathStyleOption.Color)?.value ?? "#c0c0c0";
    }

    #setColorStroke(context, map) {
        this.#setOpacity(context);
        this.#setStrokeOptions(context, map);
        context.strokeStyle = this.options.find(o => o.key == PathStyleOption.Color)?.value ?? "#696969";
    }

    #setLinearGradientFill(context, bounds) {
        let start = this.options.find(o => o.key == PathStyleOption.GradientStart)?.value ?? { x: 0, y: 0 };
        start = this.#getAbsoluteCoordinates(bounds, start);
        let end = this.options.find(o => o.key == PathStyleOption.GradientEnd)?.value ?? { x: 100, y: 100 };
        end = this.#getAbsoluteCoordinates(bounds, end);
        const gradient = context.createLinearGradient(start.x, start.y, end.x, end.y);
        this.#setColorStops(gradient);
        this.#setOpacity(context);
        context.fillStyle = gradient;
    }

    #setLinearGradientStroke(context, map, bounds) {
        let start = this.options.find(o => o.key == PathStyleOption.GradientStart)?.value ?? { x: 0, y: 0 };
        start = this.#getAbsoluteCoordinates(bounds, start);
        let end = this.options.find(o => o.key == PathStyleOption.GradientEnd)?.value ?? { x: 100, y: 100 };
        end = this.#getAbsoluteCoordinates(bounds, end);
        const gradient = context.createLinearGradient(start.x, start.y, end.x, end.y);
        this.#setColorStops(gradient);
        this.#setOpacity(context);
        this.#setStrokeOptions(context, map);
        context.strokeStyle = gradient;
    }

    #setRadialGradientFill(context, bounds) {
        let start = this.options.find(o => o.key == PathStyleOption.GradientStart)?.value ?? { x: 0, y: 0 };
        start = this.#getAbsoluteCoordinates(bounds, start);
        let end = this.options.find(o => o.key == PathStyleOption.GradientEnd)?.value ?? { x: 100, y: 100 };
        end = this.#getAbsoluteCoordinates(bounds, end);
        let startRadius = this.options.find(o => o.key == PathStyleOption.GradientStartRadius)?.value ?? 0;
        startRadius = this.#getAbsoluteRadius(bounds, startRadius);
        let endRadius = this.options.find(o => o.key == PathStyleOption.GradientEndRadius)?.value ?? 0;
        endRadius = this.#getAbsoluteRadius(bounds, endRadius);
        const gradient = context.createRadialGradient(start.x, start.y, startRadius, end.x, end.y, endRadius);
        this.#setColorStops(gradient);
        this.#setOpacity(context);
        context.fillStyle = gradient;
    }

    #setRadialGradientStroke(context, map, bounds) {
        let start = this.options.find(o => o.key == PathStyleOption.GradientStart)?.value ?? { x: 0, y: 0 };
        start = this.#getAbsoluteCoordinates(bounds, start);
        let end = this.options.find(o => o.key == PathStyleOption.GradientEnd)?.value ?? { x: 100, y: 100 };
        end = this.#getAbsoluteCoordinates(bounds, end);
        let startRadius = this.options.find(o => o.key == PathStyleOption.GradientStartRadius)?.value ?? 0;
        startRadius = this.#getAbsoluteRadius(bounds, startRadius);
        let endRadius = this.options.find(o => o.key == PathStyleOption.GradientEndRadius)?.value ?? 0;
        endRadius = this.#getAbsoluteRadius(bounds, endRadius);
        const gradient = context.createRadialGradient(start.x, start.y, startRadius, end.x, end.y, endRadius);
        this.#setColorStops(gradient);
        this.#setOpacity(context);
        this.#setStrokeOptions(context, map);
        context.strokeStyle = gradient;
    }

    #setConicalGradientFill(context, bounds) {
        let start = this.options.find(o => o.key == PathStyleOption.GradientStart)?.value ?? { x: 0, y: 0 };
        start = this.#getAbsoluteCoordinates(bounds, start);   
        const startAngle = this.options.find(o => o.key == PathStyleOption.GradientAngle)?.value ?? 0;
        const gradient = context.createConicGradient(startAngle, start.x, start.y);
        this.#setColorStops(gradient);
        this.#setOpacity(context);
        context.fillStyle = gradient;
    }

    #setConicalGradientStroke(context, map, bounds) {
        let start = this.options.find(o => o.key == PathStyleOption.GradientStart)?.value ?? { x: 0, y: 0 };
        start = this.#getAbsoluteCoordinates(bounds, start);
        const startAngle = this.options.find(o => o.key == PathStyleOption.GradientAngle)?.value ?? 0;
        const gradient = context.createConicGradient(startAngle, start.x, start.y);
        this.#setColorStops(gradient);
        this.#setOpacity(context);
        this.#setStrokeOptions(context, map);
        context.strokeStyle = gradient;
    }

    async #setTileFill(context, map) {
        const key = `${this.id}-${PathStyleOption.TileFill}`;
        const data = this.options.find(o => o.key == PathStyleOption.TileImageSource).value; 
        const pattern = await this.#getPattern(context, map, key, data);
        this.#setOpacity(context);
        context.fillStyle = pattern;
    }

    async #setTileStroke(context, map) {
        const key = `${this.id}-${PathStyleOption.TileStroke}`;
        const data = this.options.find(o => o.key == PathStyleOption.TileImageSource).value;
        const pattern = await this.#getPattern(context, map, key, data);
        this.#setOpacity(context);
        this.#setStrokeOptions(context, map);
        context.strokeStyle = pattern;
    }

    #setOpacity(context) {
        context.globalAlpha = (this.options.find(o => o.key == PathStyleOption.Opacity)?.value ?? 100) / 100;
    }

    #setStrokeOptions(context, map) {
        const scale = 1 / map.zoom;
        context.lineWidth = (this.options.find(o => o.key == PathStyleOption.Width)?.value ?? 3) * scale;
        context.setLineDash(this.options.find(o => o.key == PathStyleOption.Dash)?.value ?? []);
        context.lineDashOffset = this.options.find(o => o.key == PathStyleOption.DashOffset)?.value ?? 0;
        context.lineCap = this.options.find(o => o.key == PathStyleOption.Cap)?.value ?? "round";
        context.lineJoin = this.options.find(o => o.key == PathStyleOption.Join)?.value ?? "round";
    }

    static #getStrokeDefaults() {
        return [
            { key: PathStyleOption.Width, value: 3 },
            { key: PathStyleOption.Dash, value: [] },
            { key: PathStyleOption.DashOffset, value: 0 },
            { key: PathStyleOption.StrokeOffset, value: { x: 0, y: 0 } },
            { key: PathStyleOption.Cap, value: "round" },
            { key: PathStyleOption.Join, value: "round" }
        ];
    }

    #setColorStops(gradient) {
        for (let i = 1; i <= 5; i++) {
            let colorStop = this.options.find(o => o.key == `ColorStop${i}`);
            if (colorStop && colorStop.value && colorStop.value.offset && colorStop.value.color) {
                gradient.addColorStop(colorStop.value.offset / 100, colorStop.value.color);
            }
            else {
                break;
            }
        }
    }

    static #getColorStopDefaults() {
        return [
            { key: PathStyleOption.ColorStop1, value: { offset: 25, color: "#dac2bd"} },
            { key: PathStyleOption.ColorStop2, value: { offset: 50, color: "#c37160" } },
            { key: PathStyleOption.ColorStop3, value: { offset: 75, color: "#a7351d" } },
        ];
    }

    #getAbsoluteCoordinates(bounds, relativeCoordinates) {
        const x = bounds.x + (bounds.width * (relativeCoordinates.x / 100));
        const y = bounds.y + (bounds.height * (relativeCoordinates.y / 100));
        return { x: x, y: y };
    }

    #getAbsoluteRadius(bounds, relativeRadius) {
        if (bounds.width > bounds.height) {
            return bounds.width * (relativeRadius / 100);
        }
        else {
            return bounds.height * (relativeRadius / 100);
        }
    }

    #pattern;
    async #getPattern(context, map, key, data) {
        if (!this.#pattern) {
            const image = await map.getImage(key, data);
            this.#pattern = context.createPattern(image, "repeat");
        }
        return this.#pattern;
    }

    static #getDefaultTileFill() {
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGEAAABhCAYAAADGBs+jAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAACQUSURBVHhe3d15vG3l/Afw1ck8z7OSUilTZjclMpfSIGSMkDEUFylXkVJEUqioCJWppNIgCSEZGlBIJDMhc1i/5/3d+7t79rr73POcm79+n9dr37PW2p+91rOe4Tuvdburr766v+KKK/r//Oc/fQ379bF//etfy/H++9//xqfGP/7xj/4Xv/jF1HHbw/P//e9/D16NVt6wbfDXv/61/+Uvfzl13Vae7Xofrrrqqv5Xv/rV5DvnGfJs/+lPf+p//etfL4oHyYO58jEQnb+w7777dltttVU3NzfXFWJ30EEHdZdcckl89+9//3vC22233brnPOc53SqrrNKVju/e9a53dT/72c/iO+dzHF7xild0L3vZy2L/z3/+c3fAAQd0pRPiO7xEK+/Zz35298Y3vjHa97vf/S6ue+WVV8Z39XVbee51//33j/0y2HHdv/zlL/Gd+3Xc5wlPeEJ36KGHxvZll13WHXjggV2ZmF3pyOinxfD8fcQjHtEdc8wxcR2dOoVvfvOb/UknnRTbZvVjHvOY/swzz4z9Gl/96lf7008/PbZLp/XlpP03vvGN2K/xxS9+sT/rrLNi28zCu/DCC2O/Rivv1FNP7b/+9a/H9g9/+MN+44037n/605/Gfo1W3uc+97n+W9/6Vmx/97vfDd5vf/vb2K9x/PHH9xdddFFsn3POOf0jH/nIWC1DtPCsgE9+8pN9mdyxv4p/RsOx8nAKI5x/58P/mmd2mekLYbG8hfj5vRm96qqrjo8uj1beXJmB3Y477jjeHeErX/lK9/SnPz2WUeKzn/3scrwy20Ik6SzQYR/72Me6l770pbGf+NSnPtW96EUvmurQ97///d2uu+463huhhedaRx55ZIiv7CjHiJE3v/nNsQ+tPDj44IO717/+9ROe6++1114hpmq8/e1v7/bcc88Jz9+lS5d273vf+2I/0crbfffduw9+8IPd3E1ucpPuzne+c4yaRvp74xvfuFtttdViP3Gzm91siueDd9e73nWKd/Ob33zC88ljd7nLXSY8N3nrW996pXiO3fKWt+zudKc7Lce73e1uF8d8Wnlwq1vdqrv97W8/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";
    }

    static #getDefaultTileStroke() {
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAADZeSURBVHheTdwF2DVV1cbxMcFEUcTu7g4swERFUWzFxO7uwu7ExAILC0ykbMDu7u7uZL7zW/h/v2dd1+N75szMnr3Xute97rXn4PLPf/5zPcc5zrE+/OEPX//973+v3/72t9db3epW64477rj+5je/Wa92tautD3nIQ1b2zW9+c73UpS61br/99uuznvWs+e4///nP+utf/3r9xz/+Mf+++93vXr/3ve+tO++88/r85z9/Nf43vvGN9epXv/p6oQtdaP3d7363XvKSl5xz7LOf/ex6rnOdaz396U+/vvrVr57v/vvf/66/+MUv5t/vf//76+GHH75+4QtfmDHf+MY3rn/5y1/Wr3zlK+uFL3zhdffdd19/9atfrec973nXt7/97XP/UUcdNeOd/exnXw899ND5zlg/+9nP5vNXv/rV9cMf/vCMe9aznnU94ogj1t/+9rfrpz71qXnGPvvss373u9+deR1zzDFzj7FPdrKTrRe84AXXj370o/Pd8ccfv/70pz+dz5/85Cfn75BDDpnnusa8jjvuuJnLfe5zn/VrX/vaes5znnP9/Oc/P/dY73K3u91t/cMf/jB/nOTiP/3pTxMUi8te9rKXrcuyrFe84hXX73znO/NdD7/pTW86D/jxj3881zzsYQ9b//znP8/5i1zkIuvFL37xGf/kJz/5euc733nuYU9+8pPn+j322GMmy375y1/OwnbZZZf1Gc94xvq5z31urnnOc54zY3Lemc985vX617/++vOf/3zOPeEJT5h7//Wvf60PfOAD57vb3/7269///vf5HjD+9re/zVwOOuig9T3vec9cc+CBB04wOetUpzrVeu9733vA4lxg4Ivb3e52890DHvCA+Q7orAdIBOlDH/rQ+pKXvGSuee9737v+9a9/neAK2CMe8Yhtazj44IPnfvfuvffe893mb5movfnNb56FQaQsgLQHP/jBM4E73elOc/EjH/nIGcAE9txzz/UCF7jAHLvfeY53n8+f+MQn1qc//enr+c9//hnPwl760peuT3rSkyazbnjDG851HMt+//vfr1e5ylUGBGz//fef8zLlec973nyW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";
    }

    static #getDefaultImageArray() {
        return [
            { key: PathStyleOption.ImageArrayOffsets, value: [5, 4, 4, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
            { key: PathStyleOption.ImageArraySource1, value: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADDSURBVEhL7ZXtCcMgEIZt93GLTGCH6U/xZ4apE3QLB0p5DwPXw4rY00KaByJqIM99BDW/4oLBe7/RKhNCoP2RXDGklGgB+HwkJJY4594qMIKi+HF/kpw/+ZUa1Et82FpLGyg1xJLbuuSZMTHGr/+BZjGHBwF6AukSS3qqoSLmtAahLubUWjJULNkDQQDHyXhqj1tlnC5xrYStNIt7sqrxUayRVY2iGGiLJMXbabQUFMUzOMXTOMXT+GMxjsr9uDwwxrwASAKaw390ze0AAAAASUVORK5CYII=" },
            { key: PathStyleOption.ImageArraySource2, value: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADFSURBVEhL7ZVNCsMgEEZt7+MyF/EK3fYO4h2y7RW8SJceKOUbDEwHK2JHC2keRNRA3vwENb/igsF7v9EqE0Kg/ZFcMaSUaAH4fCQkljjn3iowgqL4tj5Jzp/8Sg3qJT5sraUNlBpiyeO+5JkxMcav/4FmMYcHAXoC6RJLeqqhIua0BqEu5tRaMlQs2QNBAMfJeGqPW2WcLnGthK00i3uyqvFRrJFVjaIYaIskxdtptBQUxTM4xdM4xdP4YzGOyv24PDDGvACYS5ql52O2YwAAAABJRU5ErkJggg=="},
            { key: PathStyleOption.ImageArraySource3, value: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADFSURBVEhL7ZVNCsMgEEZt7+M5svcUvUJX4ipX6Cnc9xweKOUbDEwHK2JHC2keRNRA3vwENb/igsF7v9EqE0Kg/ZFcMaSUaAH4fCQkljjn3iowgqJ4WR8k509+pQb1Eh+21tIGSg2x5Hm/5ZkxMcav/4FmMYcHAXoC6RJLeqqhIua0BqEu5tRaMlQs2QNBAMfJeGqPW2WcLnGthK00i3uyqvFRrJFVjaIYaIskxdtptBQUxTM4xdM4xdP4YzGOyv24PDDGvABtl5pJ06s46AAAAABJRU5ErkJggg=="}
        ];
    }
}
