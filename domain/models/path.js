
import { Change, ChangeType } from "../references.js";

export class PathLines {

    // constructor
    constructor(data) {
        this.#id = data?.id ?? crypto.randomUUID();
        this.#mapItemId = data?.mapItemId;
        this.#start = data?.start;
        this.#points = data?.points;
        this.#rotationAngle = data?.rotationAngle;
        this.#eventListeners = {};
    }

    // properties
    #id;
    get id() {
        return this.#id;
    }

    #mapItemId;
    get mapItemId() {
        return this.#mapItemId;
    }
    set mapItemId(mapItemId) {
        const change = this.#getPropertyChange("mapItemId", this.#mapItemId, mapItemId);
        this.#mapItemId = mapItemId;
        this.#onChange(change);
    }

    /** @type {{x: number, y: number}} */
    #start;
    get start() {
        return this.#start ?? { x: 0, y: 0 };
    }
    set start(start) {
        const change = this.#getPropertyChange("start", this.#start, start);
        this.#start = start;
        this.#onChange(change);
    }

    /** @type {[{x: number, y: number}]} */
    #points;
    get points() {
        return this.#points ?? [];
    }
    set points(points) {
        const change = this.#getPropertyChange("points", this.#points, points);
        this.#points = points;
        this.#onChange(change);
    }

    /** @type {number} */
    #rotationAngle; // for tracking tile fill/stroke rotation
    get rotationAngle() {
        return this.#rotationAngle ?? 0;
    }
    set rotationAngle(rotationAngle) {
        const change = this.#getPropertyChange("rotationAngle", this.#rotationAngle, rotationAngle);
        this.#rotationAngle = rotationAngle;
        this.#onChange(change);
    }

    // methods
    getData() {
        return {
            id: this.#id,
            mapItemId: this.#mapItemId,
            start: this.#start,
            points: this.#points,
            rotationAngle: this.#rotationAngle,
            pathType: PathLines.name
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

    getPathInfo() {
        let pathInfo = `M ${this.#start.x},${this.#start.y} l`;
        for (const point of this.points) {
            pathInfo += ` ${point.x},${point.y}`;
        }
        return pathInfo;
    }

    getBounds() {
        let x = this.start.x;
        let y = this.start.y;
        let xMin = x, xMax = x, yMin = y, yMax = y;
        for (const point of this.points) {
            x += point.x;
            y += point.y;
            if (x < xMin) {
                xMin = x;
            }
            if (x > xMax) {
                xMax = x;
            }
            if (y < yMin) {
                yMin = y;
            }
            if (y > yMax) {
                yMax = y;
            }
        }
        return { x: xMin, y: yMin, width: xMax - xMin, height: yMax - yMin };
    }

    // helpers
    #eventListeners;

    #onChange = (change) => {
        if (this.#eventListeners[Change.ChangeEvent]) {
            for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                listener(change);
            }
        }
    }

    #getPropertyChange(propertyName, oldValue, newValue) {
        return new Change({
            changeObjectType: PathLines.name,
            changeObjectRef: this.id,
            changeType: ChangeType.Edit,
            changeData: [
                {
                    propertyName: propertyName,
                    oldValue: oldValue,
                    newValue: newValue
                }
            ]
        });
    }
}

export class PathArc {

    // constructor
    constructor(data) {
        this.#id = data?.id ?? crypto.randomUUID();
        this.#start = data?.start;
        this.#end = data?.end;
        this.#center = data?.center;
        this.#radii = data?.radii;
        this.#rotationAngle = data?.rotationAngle;
        this.#largeArcFlag = data?.largeArcFlag;
        this.#sweepFlag = data?.sweepFlag;
        this.#eventListeners = {};
    }

    // properties
    #id;
    get id() {
        return this.#id;
    }

    /** @type {{x: number, y: number}} */
    #start;
    get start() {
        return this.#start ?? { x: 0, y: 0 };
    }
    set start(start) {
        const change = this.#getPropertyChange("start", this.#start, start);
        this.#start = start;
        this.#onChange(change);
    }

    /** @type {{x: number, y: number}} */
    #end;
    get end() {
        return this.#end ?? { x: 0, y: 0 };
    }
    set end(end) {
        const change = this.#getPropertyChange("end", this.#end, end);
        this.#end = end;
        this.#onChange(change);
    }

    /** @type {{x: number, y: number}} */
    #center;
    get center() {
        return this.#center ?? { x: 0, y: 0 };
    }
    set center(center) {
        const change = this.#getPropertyChange("center", this.#center, center);
        this.#center = center;
        this.#onChange(change);
    }

    /** @type {{x: number, y: number}} */
    #radii;
    get radii() {
        return this.#radii ?? { x: 0, y: 0 };
    }
    set radii(radii) {
        const change = this.#getPropertyChange("radii", this.#radii, radii);
        this.#radii = radii;
        this.#onChange(change);
    }

    /** @type {number} */
    #rotationAngle;
    get rotationAngle() {
        return this.#rotationAngle ?? 0;
    }
    set rotationAngle(rotationAngle) {
        const change = this.#getPropertyChange("rotationAngle", this.#rotationAngle, rotationAngle);
        this.#rotationAngle = rotationAngle;
        this.#onChange(change);
    }

    /** @type {number} */
    #largeArcFlag;
    get largeArcFlag() {
        return this.#largeArcFlag ?? 0;
    }
    set largeArcFlag(largeArcFlag) {
        const change = this.#getPropertyChange("largeArcFlag", this.#largeArcFlag, largeArcFlag);
        this.#largeArcFlag = largeArcFlag;
        this.#onChange(change);
    }

    /** @type {number} */
    #sweepFlag;
    get sweepFlag() {
        return this.#sweepFlag ?? 0;
    }
    set sweepFlag(sweepFlag) {
        const change = this.#getPropertyChange("sweepFlag", this.#sweepFlag, sweepFlag);
        this.#sweepFlag = sweepFlag;
        this.#onChange(change);
    }

    // methods
    getData() {
        return {
            id: this.#id,
            start: this.#start,
            end: this.#end,
            center: this.#center,
            radii: this.#radii,
            rotationAngle: this.#rotationAngle,
            largeArcFlag: this.#largeArcFlag,
            sweepFlag: this.#sweepFlag,
            pathType: PathArc.name
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

    getPathInfo() {
        return `M ${this.#start.x},${this.#start.y} a ${this.radii.x} ${this.radii.y} ${this.rotationAngle} ${this.largeArcFlag} ${this.sweepFlag} ${this.end.x} ${this.end.y}`;
    }

    getBounds() {

        // get ellipse extrema at origin
        const cos = Math.cos(this.rotationAngle);
        const sin = Math.sin(this.rotationAngle);
        const rx = this.radii.x;
        const ry = this.radii.y;
        let xRight = Math.sqrt(rx ** 2 * cos ** 2 + ry ** 2 * sin ** 2);
        let yRight = ((ry ** 2 - rx ** 2) * Math.sin(2 * this.rotationAngle)) / (2 * Math.sqrt(rx ** 2 * cos ** 2 + ry ** 2 * sin ** 2));
        let xLeft = -xRight;
        let yLeft = -yRight;
        let xTop = ((ry ** 2 - rx ** 2) * Math.sin(2 * this.rotationAngle)) / (2 * Math.sqrt(rx ** 2 * sin ** 2 + ry ** 2 * cos ** 2));
        let lTop = Math.sqrt(rx ** 2 * sin ** 2 + ry ** 2 * cos ** 2);
        let xBottom = -xTop;
        let yBottom = -lTop;

        // apply path position
        const xCenter = this.start.x + this.center.x;
        const yCenter = this.start.y + this.center.y;
        const center = { x: xCenter, y: yCenter };
        const right = { x: xRight + xCenter, y: yRight + yCenter };
        const top = { x: xTop + xCenter, y: yTop + yCenter };
        const left = { x: xLeft + xCenter, y: yLeft + yCenter };
        const bottom = { x: xBottom + xCenter, y: yBottom + yCenter };
        const end = { x: this.end.x + xCenter, y: this.end.y + yCenter };

        // only include extrema that are on the arc
        const extrema = [this.start, end];
        const startQuadrant = this.#getQuadrant(start, center);
        const endQuadrant = this.#getQuadrant(end, center);
        if (this.sweepFlag == 1) {
            // counter-clockwise
            if (startQuadrant == 1) {
                if (endQuadrant == 2) {
                    extrema.push(top);
                }
                if (endQuadrant == 3) {
                    extrema.push(top);
                    extrema.push(left);
                }
                if (endQuadrant == 4) {
                    extrema.push(top);
                    extrema.push(left);
                    extrema.push(bottom);
                }
                if (endQuadrant == 1 && start.x < end.x) {
                    extrema.push(top);
                    extrema.push(left);
                    extrema.push(bottom);
                    extrema.push(right);
                }
            }
            if (startQuadrant == 2) {
                if (endQuadrant == 3) {
                    extrema.push(left);
                }
                if (endQuadrant == 4) {
                    extrema.push(left);
                    extrema.push(bottom);
                }
                if (endQuadrant == 1) {
                    extrema.push(left);
                    extrema.push(bottom);
                    extrema.push(right);
                }
                if (endQuadrant == 2 && start.x < end.x) {
                    extrema.push(left);
                    extrema.push(bottom);
                    extrema.push(right);
                    extrema.push(top);
                }
            }
            if (startQuadrant == 3) {
                if (endQuadrant == 4) {
                    extrema.push(bottom);
                }
                if (endQuadrant == 1) {
                    extrema.push(bottom);
                    extrema.push(right);
                }
                if (endQuadrant == 2) {
                    extrema.push(bottom);
                    extrema.push(right);
                    extrema.push(top);
                }
                if (endQuadrant == 2 && start.x > end.x) {
                    extrema.push(bottom);
                    extrema.push(right);
                    extrema.push(top);
                    extrema.push(left);
                }
            }
            if (startQuadrant == 4) {
                if (endQuadrant == 1) {
                    extrema.push(right);
                }
                if (endQuadrant == 2) {
                    extrema.push(right);
                    extrema.push(top);
                }
                if (endQuadrant == 3) {
                    extrema.push(right);
                    extrema.push(top);
                    extrema.push(left);
                }
                if (endQuadrant == 4 && start.x > end.x) {
                    extrema.push(right);
                    extrema.push(top);
                    extrema.push(left);
                    extrema.push(bottom);
                }
            }
        }
        else {
            // clockwise
            if (startQuadrant == 1) {
                if (endQuadrant == 4) {
                    extrema.push(right);
                }
                if (endQuadrant == 3) {
                    extrema.push(right);
                    extrema.push(bottom);
                }
                if (endQuadrant == 4) {
                    extrema.push(right);
                    extrema.push(bottom);
                    extrema.push(left);
                }
                if (endQuadrant == 1 && start.x > end.x) {
                    extrema.push(right);
                    extrema.push(bottom);
                    extrema.push(left);
                    extrema.push(top);
                }
            }
            if (startQuadrant == 4) {
                if (endQuadrant == 3) {
                    extrema.push(bottom);
                }
                if (endQuadrant == 2) {
                    extrema.push(bottom);
                    extrema.push(left);
                }
                if (endQuadrant == 1) {
                    extrema.push(bottom);
                    extrema.push(left);
                    extrema.push(top);
                }
                if (endQuadrant == 4 && start.x < end.x) {
                    extrema.push(bottom);
                    extrema.push(left);
                    extrema.push(top);
                    extrema.push(right);
                }
            }
            if (startQuadrant == 3) {
                if (endQuadrant == 2) {
                    extrema.push(left);
                }
                if (endQuadrant == 1) {
                    extrema.push(left);
                    extrema.push(top);
                }
                if (endQuadrant == 4) {
                    extrema.push(left);
                    extrema.push(top);
                    extrema.push(right);
                }
                if (endQuadrant == 3 && start.x < end.x) {
                    extrema.push(left);
                    extrema.push(top);
                    extrema.push(right);
                    extrema.push(bottom);
                }
            }
            if (startQuadrant == 2) {
                if (endQuadrant == 1) {
                    extrema.push(top);
                }
                if (endQuadrant == 4) {
                    extrema.push(top);
                    extrema.push(right);
                }
                if (endQuadrant == 3) {
                    extrema.push(top);
                    extrema.push(right);
                    extrema.push(bottom);
                }
                if (endQuadrant == 2 && start.x > end.x) {
                    extrema.push(top);
                    extrema.push(right);
                    extrema.push(bottom);
                    extrema.push(left);
                }
            }
        }

        // return bounds
        const xExtrema = extrema.map(pt => pt.x);
        const yExtrema = extrema.map(pt => pt.y);
        const xMin = Math.min(xExtrema);
        const xMax = Math.max(xExtrema);
        const yMin = Math.min(yExtrema);
        const yMax = Math.max(yExtrema);
        return { x: xMin, y: yMin, width: xMax - xMin, height: yMax - yMin };
    }

    // helpers
    #eventListeners;

    #onChange = (change) => {
        if (this.#eventListeners[Change.ChangeEvent]) {
            for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                listener(change);
            }
        }
    }

    #getPropertyChange(propertyName, oldValue, newValue) {
        return new Change({
            changeObjectType: PathArc.name,
            changeObjectRef: this.id,
            changeType: ChangeType.Edit,
            changeData: [
                {
                    propertyName: propertyName,
                    oldValue: oldValue,
                    newValue: newValue
                }
            ]
        });
    }

    #getQuadrant(point, center) {
        if (point.x >= center.x && point.y <= center.y) {
            return 1;
        }
        if (point.x <= center.x && point.y <= center.y) {
            return 2;
        }
        if (point.x <= center.x && point.y >= center.y) {
            return 3;
        }
        return 4;
    }
}
