
import { GradientType, InputUtilities } from "../references.js";

export class BaseFill {

    // constructor
    constructor(data) {
        this.#opacity = InputUtilities.cleanseNumber(data?.opacity) ?? 1;
    }

    // properties
    /** @type {number}  */
    #opacity;
    get opacity() {
        return this.#opacity;
    }

    // methods
    getData() {
        return {
            opacity: this.#opacity
        };
    }
}

export class ColorFill extends BaseFill {

    // constructor
    constructor(data) {
        super(data);
        this.#color = InputUtilities.cleanseString(data?.color);
    }

    // properties
    /** @type {string}  */
    #color;
    get color() {
        return this.#color;
    }

    // methods
    getData() {
        const data = super.getData();
        data.color = this.#color;
        return data;
    }
}

export class GradientFill extends BaseFill {

    // constructor
    constructor(data) {
        super(data);
        this.#gradientType = InputUtilities.cleanseString(data.gradientType);
        this.#colorStops = [];
        if (data?.colorStops) {
            for (const colorStop of data.colorStops) {
                this.#colorStops.push({
                    offset: InputUtilities.cleanseNumber(colorStop.offset),
                    color: InputUtilities.cleanseString(colorStop.color)
                });
            }
        }
    }

    // properties
    /** @type {GradientType}  */
    #gradientType;
    get gradientType() {
        return this.#gradientType;
    }

    /** @type {{ offset: number, color: string}[]}  */
    #colorStops;
    get colorStops() {
        return this.#colorStops;
    }

    // methods
    getData() {
        const data = super.getData();
        data.gradientType = this.#gradientType;
        data.colorStops = this.#colorStops;
        return data;
    }
}

export class TileFill extends BaseFill {

    // constructor
    constructor(data) {
        super(data);
        this.#imageSrc = InputUtilities.cleanseSvg(data?.imageSrc);
    }

    // properties
    /** @type {string}  */
    #imageSrc;
    get imageSrc() {
        return this.#imageSrc;
    }

    // methods
    getData() {
        const data = super.getData();
        data.imageSrc = this.#imageSrc;
        return data;
    }
}

export class ImageArrayFill extends BaseFill {

    // constructor
    constructor(data) {
        super(data);
        this.#imageSources = [];
        if (data?.imageSources) {
            for (const imageSource of data.imageSources) {
                this.#imageSources.push(InputUtilities.cleanseSvg(imageSource));
            }
        }
        this.#offsetX = ImageUtilities.cleanseNumber(data.offsetX);
        this.#offsetY = ImageUtilities.cleanseNumber(data.offsetY);
    }

    // properties
    /** @type {string[]}  */
    #imageSources;
    get imageSources() {
        return this.#imageSources;
    }

    /** @type {number}  */
    #offsetX;
    get offsetX() {
        return this.#offsetX;
    }

    /** @type {number}  */
    #offsetY;
    get offsetY() {
        return this.#offsetY;
    }

    // methods
    getData() {
        const data = super.getData();
        data.imageSources = this.#imageSources;
        data.offsetX = this.#offsetX;
        data.offsetY = this.#offsetY;
        return data;
    }
}
