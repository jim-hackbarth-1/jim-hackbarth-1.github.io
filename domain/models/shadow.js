
import { InputUtilities } from "../references.js";

/** @readonly @enum {string} */
export const RenderingOrder = {
    BelowStrokes: "BelowStrokes",
    AboveStrokes: "AboveStrokes"
};

export class Shadow {

    // constructor
    constructor(data) {
        if (data) {
            this.#blur = InputUtilities.cleanseNumber(data.blur);
            this.#color = InputUtilities.cleanseString(data.color);
            this.#offsetX = InputUtilities.cleanseNumber(data.offsetX);
            this.#offsetY = InputUtilities.cleanseNumber(data.offsetY);
            this.#renderingOrder = InputUtilities.cleanseString(data.renderingOrder);
        }
    }

    // properties
    /** @type {number}  */
    #blur;
    get blur() {
        return this.#blur ?? 0;
    }

    /** @type {string}  */
    #color;
    get color() {
        return this.#color ?? "#696969";
    }

    /** @type {number}  */
    #offsetX;
    get offsetX() {
        return this.#offsetX ?? 0;
    }

    /** @type {number}  */
    #offsetY;
    get offsetY() {
        return this.#offsetY ?? 0;
    }

    /** @type {RenderingOrder}  */
    #renderingOrder;
    get renderingOrder() {
        return this.#renderingOrder ?? RenderingOrder.BelowStrokes;
    }

    // methods
    getData() {
        return {
            blur: this.#blur,
            color: this.#color,
            offsetX: this.#offsetX,
            offsetY: this.#offsetY,
            renderingOrder: this.#renderingOrder
        };
    }
}
