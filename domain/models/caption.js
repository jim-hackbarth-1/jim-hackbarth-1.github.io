
import { InputUtilities, PathStyle, Shadow } from "../references.js";

/** @readonly @enum {string} */
export const FontVariantCap = {
    Normal: "normal",
    SmallCaps: "small-caps",
    AllSmallCaps: "all-small-caps",
    PetiteCaps: "petite-caps",
    AllPetiteCaps: "all-petite-caps",
    Unicase: "unicase",
    TitlingCaps: "titling-caps"
};

export class Caption {

    // constructor
    constructor(data) {
        this.#defaultText = InputUtilities.cleanseString(data?.defaultText);
        this.#opacity = InputUtilities.cleanseNumber(data?.opacity);
        this.#font = InputUtilities.cleanseString(data?.font);
        this.#fontColor = InputUtilities.cleanseString(data?.fontColor);
        this.#fontVariantCaps = InputUtilities.cleanseString(data?.fontVariantCaps);
        this.#fontOutlineColor = InputUtilities.cleanseString(data?.fontOutlineColor);
        this.#textShadow = new Shadow(data?.textShadow);
        if (data?.backgroundFill) {
            this.#backgroundFill = new PathStyle(data.backgroundFill);
        }
        if (data?.borderStroke) {
            this.#borderStroke = new PathStyle(data.borderStroke);
        }
        this.#shadow = new Shadow(data?.shadow);
    }

    // properties
    /** @type {string}  */
    #defaultText;
    get defaultText() {
        return this.#defaultText ?? "";
    }

    /** @type {number}  */
    #opacity;
    get opacity() {
        return this.#opacity ?? 1;
    }

    /** @type {string}  */
    #font;
    get font() {
        return this.#font ?? "12px Arial, sans-serif";
    }

    /** @type {string}  */
    #fontColor;
    get fontColor() {
        return this.#fontColor ?? "#000000";
    }

    /** @type {FontVariantCap}  */
    #fontVariantCaps;
    get fontVariantCaps() {
        return this.#fontVariantCaps ?? "normal";
    }

    /** @type {string}  */
    #fontOutlineColor;
    get fontOutlineColor() {
        return this.#fontOutlineColor ?? "#000000";
    }

    /** @type {Shadow}  */
    #textShadow;
    get textShadow() {
        return this.#textShadow;
    }

    /** @type {PathStyle}  */
    #backgroundFill;
    get backgroundFill() {
        return this.#backgroundFill;
    }

    /** @type {PathStyle}  */
    #borderStroke;
    get borderStroke() {
        return this.#borderStroke;
    }

    /** @type {Shadow}  */
    #shadow;
    get shadow() {
        return this.#shadow;
    }

    // methods
    getData() {
        return {
            defaultText: this.#defaultText,
            opacity: this.#opacity,
            font: this.#font,
            fontColor: this.#fontColor,
            fontVariantCaps: this.#fontVariantCaps,
            fontOutlineColor: this.#fontOutlineColor,
            textShadow: this.#textShadow ? this.#textShadow.getData() : null,
            backgroundFill: this.#backgroundFill ? this.#backgroundFill.getData() : null,
            borderStroke: this.#borderStroke ? this.#borderStroke.getData() : null,
            shadow: this.#shadow ? this.#shadow.getData() : null
        };
    }

    async render(context, map, captionText, captionLocation, options) {

        // get bounding box
        const scale = map.zoom;
        context.font = this.font;
        context.fontVariantCaps = this.fontVariantCaps;
        context.letterSpacing = "0px";
        const strokeText = (this.fontOutlineColor != this.fontColor);
        if (strokeText) {
            context.letterSpacing = "1px";
            context.lineWidth = 1;
        }
        const textBounds = context.measureText(captionText);
        const padding = 5 / scale;
        
        // render background
        if (this.backgroundFill || this.borderStroke) {
            const width = textBounds.width + (2 * padding);
            const height = textBounds.actualBoundingBoxAscent + textBounds.actualBoundingBoxDescent + (2 * padding);
            const rectBounds = { x: captionLocation.x, y: captionLocation.y - (height / 2), width: width, height: height };
            const rectPath = new Path2D(`M ${rectBounds.x},${rectBounds.y} l ${rectBounds.width},0 0,${rectBounds.height} ${-(rectBounds.width)},0 z`); 
            if (this.shadow.offsetX != 0 || this.shadow.offsetY != 0 || this.shadow.blur > 0) {
                context.shadowColor = this.shadow.color;
                context.shadowOffsetX = this.shadow.offsetX * scale;
                context.shadowOffsetY = this.shadow.offsetY * scale;
                context.shadowBlur = this.shadow.blur;
            }
            if (!PathStyle.isPathStyleHidden(this.backgroundFill, options)) {
                this.backgroundFill.setStyle(context, map, rectBounds);
                context.fill(rectPath);
            }
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowBlur = 0;
            if (!PathStyle.isPathStyleHidden(this.borderStroke, options)) {
                this.borderStroke.setStyle(context, map, rectBounds);
                context.stroke(rectPath);
            }
        }

        // render text
        const textStart = {
            x: captionLocation.x + padding,
            y: captionLocation.y + (textBounds.actualBoundingBoxAscent - textBounds.actualBoundingBoxDescent) / 2
        };
        context.globalAlpha = this.opacity;
        if (this.textShadow.offsetX != 0 || this.textShadow.offsetY != 0 || this.textShadow.blur > 0) {
            context.shadowColor = this.textShadow.color;
            context.shadowOffsetX = this.textShadow.offsetX * scale;
            context.shadowOffsetY = this.textShadow.offsetY * scale;
            context.shadowBlur = this.textShadow.blur;
        }
        if (strokeText) {
            context.strokeStyle = this.fontOutlineColor;
            context.lineWidth = 1;
            context.setLineDash([]);
            context.strokeText(captionText, textStart.x, textStart.y);
        }
        context.fillStyle = this.fontColor;  
        context.fillText(captionText, textStart.x, textStart.y);
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 0;
        context.globalAlpha = 1;
    }
}
