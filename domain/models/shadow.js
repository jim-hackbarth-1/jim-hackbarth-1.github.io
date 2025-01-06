
export class Shadow {

    // constructor
    constructor(data) {
        if (data) {
            this.#blur = data.blur;
            this.#color = data.color;
            this.#offsetX = data.offsetX;
            this.#offsetY = data.offsetY;
        }
    }

    // properties
    /** @type {number}  */
    #blur;
    get blur() {
        return this.#blur;
    }

    /** @type {string}  */
    #color;
    get color() {
        return this.#color;
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
        return {
            blur: inputUtilities.cleanseNumber(data.blur),
            color: inputUtilities.cleanseString(data.color),
            offsetX: inputUtilities.cleanseNumber(data.offsetX),
            offsetY: inputUtilities.cleanseNumber(data.offsetY)
        }
    }

    getData() {
        return {
            blur: this.#blur,
            color: this.#color,
            offsetX: this.#offsetX,
            offsetY: this.#offsetY
        };
    }
}
