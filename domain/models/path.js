
import { Arc, Change, ChangeType, GeometryUtilities } from "../references.js";

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
        if (data?.clipPaths) {
            this.#clipPaths = [];
            for (const clipPathData of data.clipPaths) {
                clipPathData.id = null;
                clipPathData.mapItemId = data?.mapItemId,
                clipPathData.clipPaths = null;
                this.#clipPaths.push(new Path(clipPathData));
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

    /** @type {[Path]} */
    #clipPaths;
    get clipPaths() {
        return this.#clipPaths ?? [];
    }
    set clipPaths(clipPaths) {
        const change = this.#getPropertyChange("clipPaths", this.#clipPaths, clipPaths);
        if (clipPaths) {
            for (const clipPath of clipPaths) {
                clipPath.mapItemId = this.mapItemId;
            }
        }
        this.#validateUniqueIds(clipPaths);
        this.#clipPaths = clipPaths;
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
    static cleanseData(data, inputUtilities) {
        if (!data) {
            return null;
        }
        const transits = [];
        if (data.transits) {
            for (const transit of data.transits) {
                if (transit.radii) {
                    transits.push(Arc.cleanseData(transit, inputUtilities));
                }
                else {
                    transits.push(inputUtilities.cleansePoint(transit));
                }
            }
        }
        const clipPaths = [];
        if (data.clipPaths) {
            for (const clipPath of data.clipPaths) {
                clipPaths.push(Path.cleanseData(clipPath, inputUtilities));
            }
        }
        return {
            id: data.cleanseString(data.id),
            mapItemId: data.cleanseString(data.mapItemId),
            start: inputUtilities.cleansePoint(data.start),
            transits: transits,
            clipPaths: clipPaths,
            rotationAngle: inputUtilities.cleanseNumber(data.rotationAngle)
        }
    }

    getData() {
        const transits = [];
        const clipPaths = [];
        for (const transit of this.transits) {
            let transitData = transit;
            if (transit.radii) {
                transitData = transit.getData();
            }
            transits.push(transitData);
        }
        for (const clipPath of this.clipPaths) {
            clipPaths.push(clipPath.getData());
        }
        return {
            id: this.#id,
            mapItemId: this.#mapItemId,
            start: this.#start,
            transits: transits,
            clipPaths: clipPaths,
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
        const geometryUtilities = new GeometryUtilities();
        return geometryUtilities.getPathBounds(this.start, this.transits);
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

    #validateUniqueIds(clipPaths) {
        if (clipPaths) {
            const ids = [];
            for (const clipPath of clipPaths) {
                if (ids.includes(clipPath.id)) {
                    throw new Error(ErrorMessage.ItemAlreadyExistsInList);
                }
                ids.push(clipPath.id);
            }
        }
    }
}
