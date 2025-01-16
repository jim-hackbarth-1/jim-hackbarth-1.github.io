
import { InputUtilities } from "../references.js";

export class Shadow {

    // constructor
    constructor(data) {
        if (data) {
            this.#blur = InputUtilities.cleanseNumber(data.blur);
            this.#color = InputUtilities.cleanseString(data.color);
            this.#offsetX = InputUtilities.cleanseNumber(data.offsetX);
            this.#offsetY = InputUtilities.cleanseNumber(data.offsetY);
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
