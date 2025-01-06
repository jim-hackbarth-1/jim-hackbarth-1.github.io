
import { GradientType } from "../references.js";

export class BaseFill {

    // constructor
    constructor(data) {
        this.#opacity = 1;
        if (data) {
            this.#opacity = data.opacity ?? 1;
        }
    }

    // properties
    /** @type {number}  */
    #opacity;
    get opacity() {
        return this.#opacity;
    }

    // methods
    static cleanseData(data, inputUtilities) {
        if (!data) {
            return null;
        }
        return {
            opacity: inputUtilities.cleanseNumber(data.opacity)
        }
    }

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
        if (data) {
            this.#color = data.color;
        }
    }

    // properties
    /** @type {string}  */
    #color;
    get color() {
        return this.#color;
    }

    // methods
    static cleanseData(data, inputUtilities) {
        if (!data) {
            return null;
        }
        const returnData = BaseFill.cleanseData(data, inputUtilities);
        returnData.color = inputUtilities.cleanseString(data.color);
        return returnData;
    }

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
        this.#colorStops = [];
        if (data) {
            this.#gradientType = data.gradientType;
            this.#colorStops = data.colorStops ?? [];
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
    static cleanseData(data, inputUtilities) {
        if (!data) {
            return null;
        }
        const returnData = BaseFill.cleanseData(data, inputUtilities);
        const colorStops = [];
        if (data.colorStops) {
            for (const colorStop of data.colorStops) {
                colorStops.push({
                    offset: inputUtilities.cleanseNumber(colorStop.offset),
                    color: inputUtilities.cleanseString(colorStop.color)
                });
            }
        }
        returnData.gradientType = inputUtilities.cleanseString(data.gradientType);
        returnData.colorStops = colorStops;
        return returnData;
    }

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
        if (data) {
            this.#imageSrc = data.imageSrc;
        }
    }

    // properties
    /** @type {string}  */
    #imageSrc;
    get imageSrc() {
        return this.#imageSrc;
    }

    // methods
    static cleanseData(data, inputUtilities) {
        if (!data) {
            return null;
        }
        const returnData = BaseFill.cleanseData(data, inputUtilities);
        returnData.imageSrc = inputUtilities.cleanseString(data.imageSrc);
        return returnData;
    }

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
        if (data) {
            this.#imageSources = data.imageSources ?? [];
            this.#offsetX = data.offsetX;
            this.#offsetY = data.offsetY;
        }
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
    static cleanseData(data, inputUtilities) {
        if (!data) {
            return null;
        }
        const returnData = BaseFill.cleanseData(data, inputUtilities);
        const imageSources = [];
        if (data.imageSources) {
            for (const imageSource of imageSources) {
                imageSources.push(inputUtilities.cleanseString(imageSource));
            }
        }
        returnData.imageSources = imageSources;
        returnData.offsetX = imageUtilities.cleanseNumber(data.offsetX);
        returnData.offsetY = imageUtilities.cleanseNumber(data.offsetY);
        return returnData;
    }

    getData() {
        const data = super.getData();
        data.imageSources = this.#imageSources;
        data.offsetX = this.#offsetX;
        data.offsetY = this.#offsetY;
        return data;
    }
}
