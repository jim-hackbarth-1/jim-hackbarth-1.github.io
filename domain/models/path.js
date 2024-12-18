
import { Arc, Change, ChangeType } from "../references.js";

export class Path {

    // constructor
    constructor(data) {
        this.#id = data?.id ?? crypto.randomUUID();
        this.#mapItemId = data?.mapItemId;
        this.#start = data?.start;
        if (data?.transits) {
            this.#transits = [];
            for (const transitData of data.transits) {
                let transit = transitData;
                if (transit.radii) {
                    transit = new Arc(transitData);
                }
                this.#transits.push(transit);
            }
        }
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

    /** @type {[{x: number, y: number}|Arc]} */
    #transits;
    get transits() {
        return this.#transits ?? [];
    }
    set transits(transits) {
        const change = this.#getPropertyChange("transits", this.#transits, transits);
        this.#transits = transits;
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
        const transits = [];
        for (const transit of this.transits) {
            let transitData = transit;
            if (transit.radii) {
                transitData = transit.getData();
            }
            transits.push(transitData);
        }
        return {
            id: this.#id,
            mapItemId: this.#mapItemId,
            start: this.#start,
            transits: transits,
            rotationAngle: this.#rotationAngle
        };
    }

    copy() {
        const pathData = this.getData();
        pathData.id = crypto.randomUUID();
        return new Path(pathData);
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
        let pathInfo = `M ${this.#start.x},${this.#start.y} `;
        for (const transit of this.transits) {
            if (transit.radii) {
                
                pathInfo += ` ${transit.getPathInfo()}`;
            }
            else {
                pathInfo += ` l ${transit.x},${transit.y}`;
            }
        }
        return pathInfo;
    }

    getBounds() {
        return Path.getTransitsBounds(this.start, this.transits);
    }

    static getTransitsBounds(start, transits) {
        let transitStart = start;
        let xMin = transitStart.x, xMax = transitStart.x, yMin = transitStart.y, yMax = transitStart.y;
        let transitBounds = null;
        let left = null;
        let top = null;
        for (const transit of transits) {
            if (transit.radii) {
                transitBounds = Arc.getBounds(transitStart, transit);
                transitStart = { x: transitStart.x + transit.end.x, y: transitStart.y + transit.end.y };
            }
            else {
                left = Math.min(transitStart.x, transitStart.x + transit.x);
                top = Math.min(transitStart.y, transitStart.y + transit.y);
                transitBounds = { x: left, y: top, width: Math.abs(transit.x), height: Math.abs(transit.y) };
                transitStart = { x: transitStart.x + transit.x, y: transitStart.y + transit.y };
            }
            if (transitBounds.x < xMin) {
                xMin = transitBounds.x;
            }
            if (transitBounds.x + transitBounds.width > xMax) {
                xMax = transitBounds.x + transitBounds.width;
            }
            if (transitBounds.y < yMin) {
                yMin = transitBounds.y;
            }
            if (transitBounds.y + transitBounds.height > yMax) {
                yMax = transitBounds.y + transitBounds.height;
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
            changeObjectType: Path.name,
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
