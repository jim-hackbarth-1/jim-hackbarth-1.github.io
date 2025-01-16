
import { InputUtilities } from "../references.js";

/** @readonly @enum {string} */
export const OverlayPattern = {
    None: "None",
    Grid: "Grid",
    Dots: "Dots",
    Hex: "Hex"
};

export class Overlay {

    // constructor
    constructor(data) {
        this.#pattern = InputUtilities.cleanseString(data?.pattern);
        this.#size = InputUtilities.cleanseNumber(data?.size);
        this.#color = InputUtilities.cleanseString(data?.color);
        this.#opacity = InputUtilities.cleanseNumber(data?.opacity);
    }

    // properties
    /** @type {OverlayPattern}  */
    #pattern;
    get pattern() {
        return this.#pattern ?? OverlayPattern.None;
    }

    /** @type {number}  */
    #size;
    get size() {
        return this.#size ?? 120;
    }

    /** @type {string}  */
    #color;
    get color() {
        return this.#color ?? "#000000";
    }

    /** @type {number}  */
    #opacity;
    get opacity() {
        return this.#opacity ?? 0.5;
    }

    // methods
    getData() {
        return {
            pattern: this.#pattern,
            size: this.#size,
            color: this.#color,
            opacity: this.#opacity
        };
    }

    render(context, map, options) {
        if (this.pattern == OverlayPattern.None) {
            return;
        }
        context.strokeStyle = this.color;
        context.lineWidth = 0.5 / map.zoom;
        context.globalAlpha = this.opacity;
        switch (this.pattern) {
            case OverlayPattern.Grid:
                this.#renderGrid(context, map, options);
                break;
            case OverlayPattern.Dots:
                this.#renderDots(context, map, options);
                break;
            case OverlayPattern.Hex:
                this.#renderHex(context, map, options);
                break;
        }
        context.globalAlpha = 1; 
    }

    getNearestOverlayPoint(point) {
        if (this.pattern == OverlayPattern.Grid || this.pattern == OverlayPattern.Dots) {
            return this.#getNearestGridOverlayPoint(point);
        }
        if (this.pattern == OverlayPattern.Hex) {
            return this.#getNearestHexOverlayPoint(point);
        }
        return point;
    }

    #getNearestGridOverlayPoint(point) {
        const increment = this.size;
        const startX = Math.floor(point.x / increment) * increment;
        const startY = Math.floor(point.y / increment) * increment;
        const candidates = [
            { x: startX, y: startY },
            { x: startX, y: startY + increment },
            { x: startX + increment, y: startY },
            { x: startX + increment, y: startY + increment }
        ];
        let minD = 2 * increment;
        let result = point;
        let d;
        for (const candidate of candidates) {
            d = Math.abs(candidate.x - point.x) + Math.abs(candidate.y - point.y);
            if (d < minD) {
                result = candidate;
                minD = d;
            }
        }
        return result;
    }

    #getNearestHexOverlayPoint(point) {
        const dx = this.size;
        const cos = Math.cos(Math.PI / 3) * dx;
        const sin = Math.sin(Math.PI / 3) * dx;
        const incrementX = 3 * dx;
        const incrementY = 2 * sin;
        const startX = Math.floor(point.x / incrementX) * incrementX;
        const startY = Math.floor(point.y / incrementY) * incrementY;
        const candidates = [
            { x: startX, y: startY },
            { x: startX + cos, y: startY + sin },
            { x: startX, y: startY + (2 * sin) },
            { x: startX + cos + dx, y: startY + sin },
            { x: startX + dx + (2 * cos), y: startY },
            { x: startX + dx + (2 * cos), y: startY + (2 * sin) },
            { x: startX + (2 * dx) + (2 * cos), y: startY },
            { x: startX + (2 * dx) + (2 * cos), y: startY + (2 * sin) },
            { x: startX + (2 * dx) + (3 * cos), y: startY + sin }
        ];
        let minD = incrementX + incrementY;
        let result = point;
        let d;
        for (const candidate of candidates) {
            d = Math.abs(candidate.x - point.x) + Math.abs(candidate.y - point.y);
            if (d < minD) {
                result = candidate;
                minD = d;
            }
        }
        return result;
    }

    #renderGrid(context, map, options) {
        const increment = this.size;
        const startX = Math.floor(-map.pan.x / increment) * increment;
        const startY = Math.floor(-map.pan.y / increment) * increment;
        const maxX = Math.abs(startX) + map.currentViewPort.width + increment;
        const maxY = Math.abs(startY) + map.currentViewPort.height + increment;
        let x = startX;
        while (x <= maxX) {
            context.stroke(new Path2D(`M ${x},${startY} l 0,${maxY}`));
            x += increment;
        }
        let y = startY;
        while (y <= maxY) {
            context.stroke(new Path2D(`M ${startX},${y} l ${maxX},0`));
            y += increment;
        }
    }

    #renderDots(context, map, options) {
        const increment = this.size;
        const startX = Math.floor(-map.pan.x / increment) * increment;
        const startY = Math.floor(-map.pan.y / increment) * increment;
        const maxX = Math.abs(startX) + map.currentViewPort.width + increment;
        const maxY = Math.abs(startY) + map.currentViewPort.height + increment;
        const dash = 4;
        let x = startX;
        let y = startY;
        while (x <= maxX) {
            y = startY;
            while (y <= maxY) {
                context.stroke(new Path2D(`M ${x - dash},${y} l ${2 * dash},0`));
                context.stroke(new Path2D(`M ${x},${y - dash} l 0,${2 * dash}`));
                y += increment;
            }
            x += increment;
        }
    }

    #renderHex(context, map, options) {
        const dx = this.size;
        const cos = Math.cos(Math.PI / 3) * dx;
        const sin = Math.sin(Math.PI / 3) * dx;
        const incrementX = 3 * dx;
        const incrementY = 2 * sin;
        const startX = Math.floor(-map.pan.x / incrementX) * incrementX;
        const startY = Math.floor(-map.pan.y / incrementY) * incrementY - incrementY;
        const maxX = Math.abs(startX) + map.currentViewPort.width + incrementX;
        const maxY = Math.abs(startY) + map.currentViewPort.height + (2 * incrementY);
        let x = startX;
        let y = startY;
        while (x <= maxX) {
            y = startY;
            while (y <= maxY) {
                context.stroke(new Path2D(`M ${x},${y} l ${cos},${sin} ${-cos},${sin} m ${cos},${-sin} l ${dx},0 ${cos},${-sin} ${dx},0 m ${-dx - cos},${sin} l ${cos},${sin}`));
                y += incrementY;
            }
            x += incrementX;
        }
    }
}
