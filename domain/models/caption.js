
import {
    Change,
    ChangeType,
    ColorFill,
    ColorStroke,
    GradientFill,
    GradientStroke,
    ImageArrayFill,
    ImageArrayStroke,
    InputUtilities,
    Shadow,
    TileFill,
    TileStroke
} from "../references.js";

export class Caption {

    // constructor
    constructor(data) {
        this.#defaultText = InputUtilities.cleanseString(data?.defaultText);
        this.#opacity = InputUtilities.cleanseNumber(data?.opacity) ?? 1;
        this.#font = InputUtilities.cleanseString(data?.font);
        this.#fontSize = InputUtilities.cleanseNumber(data?.fontSize);
        this.#fontColor = InputUtilities.cleanseString(data?.fontColor);
        this.#fontVariantCaps = InputUtilities.cleanseString(data?.fontVariantCaps);
        this.#fontOutlineColor = InputUtilities.cleanseString(data?.fontOutlineColor);
        if (data?.fontShadow) {
            this.#fontShadow = new Shadow(data.fontShadow);
        }
        this.#align = InputUtilities.cleanseString(data?.align);
        this.#baseline = InputUtilities.cleanseString(data?.baseline);
        if (data?.backgroundFill) {
            if (data.backgroundFill.color) {
                this.#backgroundFill = new ColorFill(data.backgroundFill);
            }
            if (data.backgroundFill.gradientType) {
                this.#backgroundFill = new GradientFill(data.backgroundFill);
            }
            if (data.backgroundFill.imageSrc) {
                this.#backgroundFill = new TileFill(data.backgroundFill);
            }
            if (data.backgroundFill.imageSources) {
                this.#backgroundFill = new ImageArrayFill(data.backgroundFill);
            }
        }
        if (data?.borderStroke) {
            if (data.borderStroke.color) {
                this.#borderStroke = new ColorStroke(data.borderStroke);
            }
            if (data.borderStroke.gradientType) {
                this.#borderStroke = new GradientStroke(data.borderStroke);
            }
            if (data.borderStroke.imageSrc) {
                this.#borderStroke = new TileStroke(data.borderStroke);
            }
            if (data.borderStroke.imageSources) {
                this.#borderStroke = new ImageArrayStroke(data.borderStroke);
            }
        }
        if (data?.shadow) {
            this.#shadow = new Shadow(data.shadow);
        }
        this.#eventListeners = {};
    }

    // properties
    /** @type {string}  */
    #defaultText;
    get defaultText() {
        return this.#defaultText;
    }
    set defaultText(defaultText) {
        const change = this.#getPropertyChange("defaultText", this.#defaultText, defaultText);
        this.#defaultText = defaultText;
        this.#onChange(change);
    }

    /** @type {number}  */
    #opacity;
    get opacity() {
        return this.#opacity;
    }
    set opacity(opacity) {
        const change = this.#getPropertyChange("opacity", this.#opacity, opacity);
        this.#opacity = opacity;
        this.#onChange(change);
    }

    /** @type {string}  */
    #font;
    get font() {
        return this.#font;
    }
    set font(font) {
        const change = this.#getPropertyChange("font", this.#font, font);
        this.#font = font;
        this.#onChange(change);
    }

    /** @type {number}  */
    #fontSize;
    get fontSize() {
        return this.#fontSize;
    }
    set fontSize(fontSize) {
        const change = this.#getPropertyChange("fontSize", this.#fontSize, fontSize);
        this.#fontSize = fontSize;
        this.#onChange(change);
    }

    /** @type {string}  */
    #fontColor;
    get fontColor() {
        return this.#fontColor;
    }
    set fontColor(fontColor) {
        const change = this.#getPropertyChange("fontColor", this.#fontColor, fontColor);
        this.#fontColor = fontColor;
        this.#onChange(change);
    }

    /** @type {string}  */
    #fontVariantCaps;
    get fontVariantCaps() {
        return this.#fontVariantCaps;
    }
    set fontVariantCaps(fontVariantCaps) {
        const change = this.#getPropertyChange("fontVariantCaps", this.#fontVariantCaps, fontVariantCaps);
        this.#fontVariantCaps = fontVariantCaps;
        this.#onChange(change);
    }

    /** @type {string}  */
    #fontOutlineColor;
    get fontOutlineColor() {
        return this.#fontOutlineColor;
    }
    set fontOutlineColor(fontOutlineColor) {
        const change = this.#getPropertyChange("fontOutlineColor", this.#fontOutlineColor, fontOutlineColor);
        this.#fontOutlineColor = fontOutlineColor;
        this.#onChange(change);
    }

    /** @type {Shadow}  */
    #fontShadow;
    get fontShadow() {
        return this.#fontShadow;
    }
    set fontShadow(fontShadow) {
        const change = this.#getPropertyChange("fontShadow", this.#fontShadow, fontShadow);
        this.#fontShadow = fontShadow;
        this.#onChange(change);
    }

    /** @type {string}  */
    #align;
    get align() {
        return this.#align;
    }
    set align(align) {
        const change = this.#getPropertyChange("align", this.#align, align);
        this.#align = align;
        this.#onChange(change);
    }

    /** @type {string}  */
    #baseline;
    get baseline() {
        return this.#baseline;
    }
    set baseline(baseline) {
        const change = this.#getPropertyChange("baseline", this.#baseline, baseline);
        this.#baseline = baseline;
        this.#onChange(change);
    }

    /** @type {ColorFill}  */
    #backgroundFill;
    get backgroundFill() {
        return this.#backgroundFill;
    }
    set backgroundFill(backgroundFill) {
        const change = this.#getPropertyChange("backgroundFill", this.#backgroundFill, backgroundFill);
        this.#backgroundFill = backgroundFill;
        this.#onChange(change);
    }

    /** @type {ColorStroke}  */
    #borderStroke;
    get borderStroke() {
        return this.#borderStroke;
    }
    set borderStroke(borderStroke) {
        const change = this.#getPropertyChange("borderStroke", this.#borderStroke, borderStroke);
        this.#borderStroke = borderStroke;
        this.#onChange(change);
    }

    /** @type {Shadow}  */
    #shadow;
    get shadow() {
        return this.#shadow;
    }
    set shadow(shadow) {
        const change = this.#getPropertyChange("shadow", this.#shadow, shadow);
        this.#shadow = shadow;
        this.#onChange(change);
    }

    // methods
    getData() {
        return {
            defaultText: this.#defaultText,
            opacity: this.#opacity,
            font: this.#font,
            fontSize: this.#fontSize,
            fontColor: this.#fontColor,
            fontVariantCaps: this.#fontVariantCaps,
            fontOutlineColor: this.#fontOutlineColor,
            fontShadow: this.#fontShadow ? this.#fontShadow.getData() : null,
            align: this.#align,
            baseline: this.#baseline,
            backgroundFill: this.#backgroundFill ? this.#backgroundFill.getData() : null,
            borderStroke: this.#borderStroke ? this.#borderStroke.getData() : null,
            shadow: this.#shadow ? this.#shadow.getData() : null
        };
    }

    addEventListener(eventName, listener) {
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
        this.#eventListeners[eventName].push(listener);
    }

    removeEventListener(eventName, listener) {
        const index = this.#eventListeners[eventName].findIndex(l => l === listener);
        if (index > -1) {
            this.#eventListeners[eventName].splice(index, 1);
        }
    }

    // helpers
    #eventListeners;

    #onChange = (change) => {
        if (this.#eventListeners[Change.ChangeEvent]) {
            for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                listener(change);
            }
        }
    }

    #getPropertyChange(propertyName, oldValue, newValue) {
        return new Change({
            changeObjectType: Caption.name,
            changeType: ChangeType.Edit,
            changeData: [
                {
                    propertyName: propertyName,
                    oldValue: oldValue,
                    newValue: newValue
                }
            ]
        });
    }
}
