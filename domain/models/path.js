
import { Arc, Change, ChangeType, GeometryUtilities, InputUtilities } from "../references.js";

export class Path {

    // constructor
    constructor(data) {
        this.#id = InputUtilities.cleanseString(data?.id) ?? crypto.randomUUID();
        this.#mapItemId = InputUtilities.cleanseString(data?.mapItemId);
        this.#start = InputUtilities.cleansePoint(data?.start);
        if (data?.transits) {
            this.#transits = [];
            for (const transitData of data.transits) {
                if (transitData.radii) {
                    this.#transits.push(new Arc(transitData));
                }
                else {
                    this.#transits.push(InputUtilities.cleansePoint(transitData));
                }
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
        this.#rotationAngle = InputUtilities.cleanseNumber(data?.rotationAngle);
        this.#bounds = InputUtilities.cleanseBounds(data?.bounds);
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
        this.#onChange(change, false);
    }

    /** @type {{x: number, y: number}} */
    #start;
    get start() {
        return this.#start ?? { x: 0, y: 0 };
    }
    set start(start) {
        const change = this.#getPropertyChange("start", this.#start, start);
        this.#start = start;
        this.#onChange(change, true);
    }

    /** @type {[{x: number, y: number}|Arc]} */
    #transits;
    get transits() {
        return this.#transits ?? [];
    }
    set transits(transits) {
        const change = this.#getPropertyChange("transits", this.#transits, transits);
        this.#transits = transits;
        this.#onChange(change, true);
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
        this.#onChange(change, true);
    }

    /** @type {number} */
    #rotationAngle; // for tracking tile fill/stroke rotation
    get rotationAngle() {
        return this.#rotationAngle ?? 0;
    }
    set rotationAngle(rotationAngle) {
        const change = this.#getPropertyChange("rotationAngle", this.#rotationAngle, rotationAngle);
        this.#rotationAngle = rotationAngle;
        this.#onChange(change, true);
    }

    /** @type {x: number, y: number, width: number, height: number} */
    #bounds;
    get bounds() {
        if (!this.#bounds) {
            const geometryUtilities = new GeometryUtilities();
            this.#bounds = geometryUtilities.getPathBounds(this.start, this.transits);
            this.#inView = null;
        }
        return this.#bounds;
    }

    /** @type {boolean} */
    #inView;
    get inView() {
        return this.#inView;
    }

    // methods
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
            rotationAngle: this.#rotationAngle,
            bounds: this.#bounds
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
            this.#eventListeners[eventName].splice(index, 1);
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

    render(context, map, mapItemTemplate, options) {
        if (mapItemTemplate && this.#isViewable(map, options)) {
            const hasFill = mapItemTemplate.fills.length > 0;
            const scale = 1 / map.zoom;
            let pathInfo = this.getPathInfo();
            if (hasFill) {
                pathInfo += " z";
            }
            const path2D = new Path2D(pathInfo);
            context.setLineDash([]);
            context.strokeStyle = mapItemTemplate.strokes[0].color;
            context.lineWidth = mapItemTemplate.strokes[0].width * scale;
            context.stroke(path2D);
            context.save();
            this.#renderClipPaths(context, pathInfo, hasFill);
            context.fillStyle = mapItemTemplate.fills[0].color;
            context.fill(path2D);
            context.restore();
        }
    }

    #isViewable(map, options) {
        if (options?.updatedViewPort || this.inView === undefined) { 
            const geometryUtilities = new GeometryUtilities();
            const startInBounds = geometryUtilities.isPointInBounds(this.start, map.currentViewPort);
            if (startInBounds) {
                this.#inView = true;
            }
            else {
                const path1 = new Path({
                    start: { x: this.bounds.x, y: this.bounds.y },
                    transits: [
                        { x: this.bounds.width, y: 0 },
                        { x: 0, y: this.bounds.height },
                        { x: -this.bounds.width, y: 0 }
                    ],
                    bounds: this.bounds
                });
                const path2 = new Path({
                    start: { x: map.currentViewPort.x, y: map.currentViewPort.y },
                    transits: [
                        { x: map.currentViewPort.width, y: 0 },
                        { x: 0, y: map.currentViewPort.height },
                        { x: -map.currentViewPort.width, y: 0 }
                    ],
                    bounds: map.currentViewPort
                });
                const intersections = geometryUtilities.getPathPathIntersections(path1, path2);
                this.#inView = (intersections.length > 0);
            }
        }
        return this.#inView;
    }

    // helpers
    #eventListeners;

    #onChange = (change, invalidateBounds) => {
        if (this.#eventListeners[Change.ChangeEvent]) {
            for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                listener(change, invalidateBounds);
            }
        }
        if (invalidateBounds) {
            this.#bounds = null;
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

    #renderClipPaths(context, pathInfo, hasFill) {
        if (this.clipPaths) {
            const outerPath = new Path2D(pathInfo);
            for (const clipPath of this.clipPaths) {
                let innerPathInfo = clipPath.getPathInfo();
                if (hasFill) {
                    innerPathInfo += " z";
                }
                const innerPath = new Path2D(innerPathInfo);
                context.stroke(innerPath);
                outerPath.addPath(innerPath);
            }
            context.clip(outerPath, "evenodd");
        }
    }
}
