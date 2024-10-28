
import {
    ChangeEventType,
    ChangeType,
    ColorFill,
    ColorStroke,
    GradientFill,
    GradientStroke,
    ImageArrayFill,
    ImageArrayStroke,
    Shadow,
    TileFill,
    TileStroke
} from "../references.js";

export class Caption {

    // constructor
    constructor(data) {
        this.#opacity = 1;
        if (data) {
            this.#defaultText = data.defaultText;
            this.#opacity = data.opacity ?? 1;
            this.#font = data.font;
            this.#fontSize = data.fontSize;
            this.#fontColor = data.fontColor;
            this.#fontVariantCaps = data.fontVariantCaps;
            this.#fontOutlineColor = data.fontOutlineColor;
            if (data.fontShadow) {
                this.#fontShadow = new Shadow(data.fontShadow);
            }
            this.#align = data.align;
            this.#baseline = data.baseline;
            if (data.backgroundFill) {
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
            if (data.borderStroke) {
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
            if (data.shadow) {
                this.#shadow = new Shadow(data.shadow);
            }
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
        this.#beforeChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "defaultText", propertyValue: this.defaultText } });
        this.#defaultText = defaultText;
        this.#afterChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "defaultText", propertyValue: this.defaultText } });
    }

    /** @type {number}  */
    #opacity;
    get opacity() {
        return this.#opacity;
    }
    set opacity(opacity) {
        this.#beforeChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "opacity", propertyValue: this.opacity } });
        this.#opacity = opacity;
        this.#afterChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "opacity", propertyValue: this.opacity } });
    }

    /** @type {string}  */
    #font;
    get font() {
        return this.#font;
    }
    set font(font) {
        this.#beforeChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "font", propertyValue: this.font } });
        this.#font = font;
        this.#afterChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "font", propertyValue: this.font } });
    }

    /** @type {number}  */
    #fontSize;
    get fontSize() {
        return this.#fontSize;
    }
    set fontSize(fontSize) {
        this.#beforeChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "fontSize", propertyValue: this.fontSize } });
        this.#fontSize = fontSize;
        this.#afterChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "fontSize", propertyValue: this.fontSize } });
    }

    /** @type {string}  */
    #fontColor;
    get fontColor() {
        return this.#fontColor;
    }
    set fontColor(fontColor) {
        this.#beforeChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "fontColor", propertyValue: this.fontColor } });
        this.#fontColor = fontColor;
        this.#afterChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "fontColor", propertyValue: this.fontColor } });
    }

    /** @type {string}  */
    #fontVariantCaps;
    get fontVariantCaps() {
        return this.#fontVariantCaps;
    }
    set fontVariantCaps(fontVariantCaps) {
        this.#beforeChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "fontVariantCaps", propertyValue: this.fontVariantCaps } });
        this.#fontVariantCaps = fontVariantCaps;
        this.#afterChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "fontVariantCaps", propertyValue: this.fontVariantCaps } });
    }

    /** @type {string}  */
    #fontOutlineColor;
    get fontOutlineColor() {
        return this.#fontOutlineColor;
    }
    set fontOutlineColor(fontOutlineColor) {
        this.#beforeChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "fontOutlineColor", propertyValue: this.fontOutlineColor } });
        this.#fontOutlineColor = fontOutlineColor;
        this.#afterChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "fontOutlineColor", propertyValue: this.fontOutlineColor } });
    }

    /** @type {Shadow}  */
    #fontShadow;
    get fontShadow() {
        return this.#fontShadow;
    }
    set fontShadow(fontShadow) {
        this.#beforeChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "fontShadow", propertyValue: this.fontShadow } });
        this.#fontShadow = fontShadow;
        this.#afterChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "fontShadow", propertyValue: this.fontShadow } });
    }

    /** @type {string}  */
    #align;
    get align() {
        return this.#align;
    }
    set align(align) {
        this.#beforeChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "align", propertyValue: this.align } });
        this.#align = align;
        this.#afterChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "align", propertyValue: this.align } });
    }

    /** @type {string}  */
    #baseline;
    get baseline() {
        return this.#baseline;
    }
    set baseline(baseline) {
        this.#beforeChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "baseline", propertyValue: this.baseline } });
        this.#baseline = baseline;
        this.#afterChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "baseline", propertyValue: this.baseline } });
    }

    /** @type {ColorFill}  */
    #backgroundFill;
    get backgroundFill() {
        return this.#backgroundFill;
    }
    set backgroundFill(backgroundFill) {
        this.#beforeChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "backgroundFill", propertyValue: this.backgroundFill } });
        this.#backgroundFill = backgroundFill;
        this.#afterChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "backgroundFill", propertyValue: this.backgroundFill } });
    }

    /** @type {ColorStroke}  */
    #borderStroke;
    get borderStroke() {
        return this.#borderStroke;
    }
    set borderStroke(borderStroke) {
        this.#beforeChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "borderStroke", propertyValue: this.borderStroke } });
        this.#borderStroke = borderStroke;
        this.#afterChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "borderStroke", propertyValue: this.borderStroke } });
    }

    /** @type {Shadow}  */
    #shadow;
    get shadow() {
        return this.#shadow;
    }
    set shadow(shadow) {
        this.#beforeChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "shadow", propertyValue: this.shadow } });
        this.#shadow = shadow;
        this.#afterChange({ changeType: ChangeType.CaptionProperty, changeData: { propertyName: "shadow", propertyValue: this.shadow } });
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
            this.#eventListeners.splice(index, 1);
        }
    }

    // helpers
    #eventListeners;

    #beforeChange(change) {
        if (this.#eventListeners[ChangeEventType.beforeChangeEvent]) {
            for (const listener of this.#eventListeners[ChangeEventType.beforeChangeEvent]) {
                listener(change);
            }
        }
    }

    #afterChange(change) {
        if (this.#eventListeners[ChangeEventType.afterChangeEvent]) {
            for (const listener of this.#eventListeners[ChangeEventType.afterChangeEvent]) {
                listener(change);
            }
        }
    }
}
