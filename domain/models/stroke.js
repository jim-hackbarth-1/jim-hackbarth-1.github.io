
export class BaseStroke {

    // constructor
    constructor(data) {
        this.#width = 1;
        this.#opacity = 1;
        this.#dash = [];
        if (data) {
            this.#width = data.width ?? 1;
            this.#opacity = data.opacity ?? 1;
            this.#dash = data.dash ?? [];
            this.#dashOffset = data.dashOffset;
            this.#cap = data.cap;
            this.#join = data.join;
        }
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
    getData() {
        const data = super.getData();
        data.imageSources = this.#imageSources;
        data.offsetX = this.#offsetX;
        data.offsetY = this.#offsetY;
        return data;
    }
}
