
import {
    Change,
    ChangeSet,
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
        const changeSet = this.#getPropertyChange("defaultText", this.#defaultText, defaultText);
        this.#defaultText = defaultText;
        this.#onChange(changeSet);
    }

    /** @type {number}  */
    #opacity;
    get opacity() {
        return this.#opacity;
    }
    set opacity(opacity) {
        const changeSet = this.#getPropertyChange("opacity", this.#opacity, opacity);
        this.#opacity = opacity;
        this.#onChange(changeSet);
    }

    /** @type {string}  */
    #font;
    get font() {
        return this.#font;
    }
    set font(font) {
        const changeSet = this.#getPropertyChange("font", this.#font, font);
        this.#font = font;
        this.#onChange(changeSet);
    }

    /** @type {number}  */
    #fontSize;
    get fontSize() {
        return this.#fontSize;
    }
    set fontSize(fontSize) {
        const changeSet = this.#getPropertyChange("fontSize", this.#fontSize, fontSize);
        this.#fontSize = fontSize;
        this.#onChange(changeSet);
    }

    /** @type {string}  */
    #fontColor;
    get fontColor() {
        return this.#fontColor;
    }
    set fontColor(fontColor) {
        const changeSet = this.#getPropertyChange("fontColor", this.#fontColor, fontColor);
        this.#fontColor = fontColor;
        this.#onChange(changeSet);
    }

    /** @type {string}  */
    #fontVariantCaps;
    get fontVariantCaps() {
        return this.#fontVariantCaps;
    }
    set fontVariantCaps(fontVariantCaps) {
        const changeSet = this.#getPropertyChange("fontVariantCaps", this.#fontVariantCaps, fontVariantCaps);
        this.#fontVariantCaps = fontVariantCaps;
        this.#onChange(changeSet);
    }

    /** @type {string}  */
    #fontOutlineColor;
    get fontOutlineColor() {
        return this.#fontOutlineColor;
    }
    set fontOutlineColor(fontOutlineColor) {
        const changeSet = this.#getPropertyChange("fontOutlineColor", this.#fontOutlineColor, fontOutlineColor);
        this.#fontOutlineColor = fontOutlineColor;
        this.#onChange(changeSet);
    }

    /** @type {Shadow}  */
    #fontShadow;
    get fontShadow() {
        return this.#fontShadow;
    }
    set fontShadow(fontShadow) {
        const changeSet = this.#getPropertyChange("fontShadow", this.#fontShadow, fontShadow);
        this.#fontShadow = fontShadow;
        this.#onChange(changeSet);
    }

    /** @type {string}  */
    #align;
    get align() {
        return this.#align;
    }
    set align(align) {
        const changeSet = this.#getPropertyChange("align", this.#align, align);
        this.#align = align;
        this.#onChange(changeSet);
    }

    /** @type {string}  */
    #baseline;
    get baseline() {
        return this.#baseline;
    }
    set baseline(baseline) {
        const changeSet = this.#getPropertyChange("baseline", this.#baseline, baseline);
        this.#baseline = baseline;
        this.#onChange(changeSet);
    }

    /** @type {ColorFill}  */
    #backgroundFill;
    get backgroundFill() {
        return this.#backgroundFill;
    }
    set backgroundFill(backgroundFill) {
        const changeSet = this.#getPropertyChange("backgroundFill", this.#backgroundFill, backgroundFill);
        this.#backgroundFill = backgroundFill;
        this.#onChange(changeSet);
    }

    /** @type {ColorStroke}  */
    #borderStroke;
    get borderStroke() {
        return this.#borderStroke;
    }
    set borderStroke(borderStroke) {
        const changeSet = this.#getPropertyChange("borderStroke", this.#borderStroke, borderStroke);
        this.#borderStroke = borderStroke;
        this.#onChange(changeSet);
    }

    /** @type {Shadow}  */
    #shadow;
    get shadow() {
        return this.#shadow;
    }
    set shadow(shadow) {
        const changeSet = this.#getPropertyChange("shadow", this.#shadow, shadow);
        this.#shadow = shadow;
        this.#onChange(changeSet);
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

    #applyPropertyChange(propertyName, propertyValue) {
        switch (propertyName) {
            case "defaultText":
                this.defaultText = InputUtilities.cleanseString(propertyValue);
                break;
            case "opacity":
                this.opacity = InputUtilities.cleanseNumber(propertyValue);
                break;
            case "font":
                this.font = InputUtilities.cleanseString(propertyValue);
                break;
            case "fontSize":
                this.fontSize = InputUtilities.cleanseNumber(propertyValue);
                break;
            case "fontColor":
                this.fontColor = InputUtilities.cleanseString(propertyValue);
                break;
            case "fontVariantCaps":
                this.fontVariantCaps = InputUtilities.cleanseString(propertyValue);
                break;
            case "fontOutlineColor":
                this.fontOutlineColor = InputUtilities.cleanseString(propertyValue);
                break;
            case "fontShadow":
                this.fontShadow = propertyValue ? new Shadow(propertyValue) : null;
                break;
            case "align":
                this.align = InputUtilities.cleanseString(propertyValue);
                break;
            case "baseline":
                this.baseline = InputUtilities.cleanseString(propertyValue);
                break;
            case "backgroundFill":
                let fill = null;
                if (propertyValue?.color) {
                    fill = new ColorFill(propertyValue);
                }
                if (propertyValue?.gradientType) {
                    fill = new GradientFill(propertyValue);
                }
                if (propertyValue?.imageSrc) {
                    fill = new TileFill(propertyValue);
                }
                if (propertyValue?.imageSources) {
                    fill = new ImageArrayFill(propertyValue);
                }
                this.backgroundFill = fill;
                break;
            case "borderStroke":
                let stroke = null;
                if (propertyValue?.color) {
                    stroke = new ColorStroke(propertyValue);
                }
                if (propertyValue?.gradientType) {
                    stroke = new GradientStroke(propertyValue);
                }
                if (propertyValue?.imageSrc) {
                    stroke = new TileStroke(propertyValue);
                }
                if (propertyValue?.imageSources) {
                    stroke = new ImageArrayStroke(propertyValue);
                }
                this.borderStroke = stroke;
                break;
            case "shadow":
                this.shadow = propertyValue ? new Shadow(propertyValue) : null;
                break;
        }
    }

    // helpers
    #eventListeners;

    #onChange = (changeSet) => {
        if (this.#eventListeners[Change.ChangeEvent]) {
            for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                listener(changeSet);
            }
        }
    }

    #getPropertyChange(propertyName, v1, v2) {
        return ChangeSet.getPropertyChange(Caption.name, propertyName, v1, v2);
    }
}
