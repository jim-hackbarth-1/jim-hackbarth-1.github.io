
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
    getData() {
        return {
            blur: this.#blur,
            color: this.#color,
            offsetX: this.#offsetX,
            offsetY: this.#offsetY
        };
    }
}
