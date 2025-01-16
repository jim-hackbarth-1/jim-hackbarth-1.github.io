
import { GradientType, InputUtilities } from "../references.js";

export class BaseStroke {

    // constructor
    constructor(data) {
        this.#width = InputUtilities.cleanseNumber(data?.width) ?? 1;
        this.#opacity = InputUtilities.cleanseNumber(data?.opacity) ?? 1;
        this.#dash = [];
        if (data?.dash) {
            for (const dashItem of data.dash) {
                this.#dash.push(InputUtilities.cleanseNumber(dashItem));
            }    
        }
        this.#dashOffset = InputUtilities.cleanseNumber(data?.dashOffset);
        this.#cap = InputUtilities.cleanseString(data?.cap);
        this.#join = InputUtilities.cleanseString(data?.join);
    }

    // properties
    /** @type {number}  */
    #width;
    get width() {
        return this.#width;
    }

    /** @type {number}  */
    #opacity;
    get opacity() {
        return this.#opacity;
    }

    /** @type {number[]}  */
    #dash;
    get dash() {
        return this.#dash;
    }

    /** @type {number}  */
    #dashOffset;
    get dashOffset() {
        return this.#dashOffset;
    }

    /** @type {string}  */
    #cap;
    get cap() {
        return this.#cap;
    }

    /** @type {string}  */
    #join;
    get join() {
        return this.#join;
    }

    // methods
    getData() {
        return {
            width: this.#width,
            opacity: this.#opacity,
            dash: this.#dash,
            dashOffset: this.#dashOffset,
            cap: this.#cap,
            join: this.#join
        };
    }
}

export class ColorStroke extends BaseStroke {

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
        const returnData = BaseStroke.cleanseData(data, inputUtilities);
        returnData.color = inputUtilities.cleanseString(data.color);
        return returnData;
    }

    getData() {
        const data = super.getData();
        data.color = this.#color;
        return data;
    }
}

export class GradientStroke extends BaseStroke {

    // constructor
    constructor(data) {
        this.#colorStops = [];
        super(data);
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
        const returnData = BaseStroke.cleanseData(data, inputUtilities);
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

export class TileStroke extends BaseStroke {

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
        const returnData = BaseStroke.cleanseData(data, inputUtilities);
        returnData.imageSrc = inputUtilities.cleanseString(data.imageSrc);
        return returnData;
    }

    getData() {
        const data = super.getData();
        data.imageSrc = this.#imageSrc;
        return data;
    }
}

export class ImageArrayStroke extends BaseStroke {

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
        const returnData = BaseStroke.cleanseData(data, inputUtilities);
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
