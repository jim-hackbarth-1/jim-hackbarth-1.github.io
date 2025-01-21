
import { Arc, Change, ChangeSet, ChangeType, GeometryUtilities, InputUtilities } from "../references.js";

export class ClipPath {

    // constructor
    constructor(data) {
        this.#id = InputUtilities.cleanseString(data?.id) ?? crypto.randomUUID();
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
        this.#rotationAngle = InputUtilities.cleanseNumber(data?.rotationAngle);
        this.#bounds = InputUtilities.cleanseBounds(data?.bounds);
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
        const changeSet = this.#getPropertyChange("start", this.#start, start);
        this.#start = start;
        this.#onChange(changeSet, true);
    }

    /** @type {[{x: number, y: number}|Arc]} */
    #transits;
    get transits() {
        return this.#transits ?? [];
    }
    set transits(transits) {
        const changeSet = this.#getPropertyChange("transits", this.#getListData(this.#transits), this.#getListData(transits));
        this.#transits = transits;
        this.#onChange(changeSet, true);
    }

    /** @type {number} */
    #rotationAngle; // for tracking tile fill/stroke rotation
    get rotationAngle() {
        return this.#rotationAngle ?? 0;
    }
    set rotationAngle(rotationAngle) {
        const changeSet = this.#getPropertyChange("rotationAngle", this.#rotationAngle, rotationAngle);
        this.#rotationAngle = rotationAngle;
        this.#onChange(changeSet, true);
    }

    /** @type {x: number, y: number, width: number, height: number} */
    #bounds;
    get bounds() {
        if (!this.#bounds) {
            const geometryUtilities = new GeometryUtilities();
            this.#bounds = geometryUtilities.getPathBounds(this.start, this.transits);
        }
        return this.#bounds;
    }

    // methods
    getData() {
        return {
            id: this.#id,
            start: this.#start,
            transits: this.#getListData(this.#transits),
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
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
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

    applyChange(change, undoing) {
        if (change.changeType == ChangeType.Edit) {
            this.#applyPropertyChange(change.propertyName, undoing ? change.oldValue : change.newValue);
        }
    }

    #applyPropertyChange(propertyName, propertyValue) {
        switch (propertyName) {
            case "start":
                this.start = InputUtilities.cleansePoint(propertyValue);
                break;
            case "transits":
                const transits = [];
                if (propertyValue) {
                    for (const transitData of propertyValue) {
                        if (transitData.radii) {
                            transits.push(new Arc(transitData));
                        }
                        else {
                            transits.push(InputUtilities.cleansePoint(transitData));
                        }
                    }
                }
                this.transits = transits;
                break;
            case "rotationAngle":
                this.rotationAngle = InputUtilities.cleanseNumber(propertyValue);
                break;
        }
    }

    // helpers
    #eventListeners;

    #onChange = (changeSet, invalidateBounds) => {
        if (this.#eventListeners[Change.ChangeEvent]) {
            if (changeSet?.changes) {
                for (const change of changeSet.changes) {
                    change.clipPathId = this.id;
                }
            }
            for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                listener(changeSet, invalidateBounds);
            }
        }
        if (invalidateBounds) {
            this.#bounds = null;
        }
    }

    #getPropertyChange(propertyName, v1, v2) {
        return ChangeSet.getPropertyChange(ClipPath.name, propertyName, v1, v2);
    }

    #getListData(list) {
        return list ? list.map(x => x.getData ? x.getData() : x) : null;
    }
}

export class Path {

    // constructor
    constructor(data) {
        this.#id = InputUtilities.cleanseString(data?.id) ?? crypto.randomUUID();
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
                const clipPath = new ClipPath(clipPathData);
                this.#clipPaths.push(clipPath);
                this.#addChangeEventListeners(clipPath);
            }
            InputUtilities.validateIds(this.#clipPaths);
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

    /** @type {{x: number, y: number}} */
    #start;
    get start() {
        return this.#start ?? { x: 0, y: 0 };
    }
    set start(start) {
        const changeSet = this.#getPropertyChange("start", this.#start, start);
        this.#start = start;
        this.#onChange(changeSet, true);
    }

    /** @type {[{x: number, y: number}|Arc]} */
    #transits;
    get transits() {
        return this.#transits ?? [];
    }
    set transits(transits) {
        const changeSet = this.#getPropertyChange("transits", this.#getListData(this.#transits), this.#getListData(transits));
        this.#transits = transits;
        this.#onChange(changeSet, true);
    }

    /** @type {[ClipPath]} */
    #clipPaths;
    get clipPaths() {
        return this.#clipPaths ?? [];
    }
    set clipPaths(clipPaths) {
        if (this.#clipPaths) {
            for (const clipPath of this.#clipPaths) {
                this.#removeChangeEventListeners(clipPath);
            }
        }
        const changeSet = this.#getPropertyChange("clipPaths", this.#getListData(this.#clipPaths), this.#getListData(clipPaths));
        InputUtilities.validateIds(clipPaths);
        this.#clipPaths = clipPaths ?? [];
        for (const clipPath of this.#clipPaths) {
            this.#addChangeEventListeners(clipPath);
        }
        this.#onChange(changeSet, true);
    }

    /** @type {number} */
    #rotationAngle; // for tracking tile fill/stroke rotation
    get rotationAngle() {
        return this.#rotationAngle ?? 0;
    }
    set rotationAngle(rotationAngle) {
        const changeSet = this.#getPropertyChange("rotationAngle", this.#rotationAngle, rotationAngle);
        this.#rotationAngle = rotationAngle;
        this.#onChange(changeSet, true);
    }

    /** @type {x: number, y: number, width: number, height: number} */
    #bounds;
    get bounds() {
        if (!this.#bounds) {
            const geometryUtilities = new GeometryUtilities();
            this.#bounds = geometryUtilities.getPathBounds(this.start, this.transits);
            this.#inView = undefined;
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
        return {
            id: this.#id,
            start: this.#start,
            transits: this.#getListData(this.#transits),
            clipPaths: this.#getListData(this.#clipPaths),
            rotationAngle: this.#rotationAngle,
            bounds: this.#bounds
        };
    }

    addClipPath(clipPath) {
        if (!clipPath) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (this.clipPaths.some(p => p.id == clipPath.id)) {
            throw new Error(ErrorMessage.ItemAlreadyExistsInList);
        }
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: Path.name,
            propertyName: "clipPaths",
            itemIndex: this.clipPaths.length,
            itemValue: clipPath.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#clipPaths.push(clipPath);
        this.#addChangeEventListeners(clipPath);
        this.#onChange(changeSet, true);
    }

    insertClipPath(clipPath, index) {
        if (!clipPath) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (this.clipPaths.some(p => p.id == clipPath.id)) {
            throw new Error(ErrorMessage.ItemAlreadyExistsInList);
        }
        if (index < 0 || index > this.clipPaths.length) {
            throw new Error(ErrorMessage.InvalidIndex);
        }
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: Path.name,
            propertyName: "clipPaths",
            itemIndex: index,
            itemValue: clipPath.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#clipPaths.splice(index, 0, clipPath);
        this.#addChangeEventListeners(clipPath);
        this.#onChange(changeSet, true);
    }

    removeClipPath(clipPath) {
        const index = this.#clipPaths.findIndex(p => p.id === clipPath.id);
        if (index > -1) {
            const changeData = {
                changeType: ChangeType.Delete,
                changeObjectType: Path.name,
                propertyName: "clipPaths",
                itemIndex: index,
                itemValue: clipPath.getData()
            };
            const changeSet = new ChangeSet({ changes: [changeData] });
            const deleted = this.#clipPaths.splice(index, 1);
            this.#removeChangeEventListeners(deleted[0]);
            this.#onChange(changeSet, true);
        }
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
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
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

    applyChange(change, undoing) {
        if (change.changeType == ChangeType.Edit) {
            this.#applyPropertyChange(change.propertyName, undoing ? change.oldValue : change.newValue);
        }
        if (change.changeType == ChangeType.Insert) {
            if (undoing) {
                this.#applyPropertyDelete(change.propertyName, change.itemValue);
            }
            else {
                this.#applyPropertyInsert(change.propertyName, change.itemIndex, change.itemValue);
            }
        }
        if (change.changeType == ChangeType.Delete) {
            if (undoing) {
                this.#applyPropertyInsert(change.propertyName, change.itemIndex, change.itemValue);
            }
            else {
                this.#applyPropertyDelete(change.propertyName, change.itemValue);
            }
        }
    }

    #applyPropertyChange(propertyName, propertyValue) {
        switch (propertyName) {
            case "start":
                this.start = InputUtilities.cleansePoint(propertyValue);
                break;
            case "transits":
                const transits = [];
                if (propertyValue) {
                    for (const transitData of propertyValue) {
                        if (transitData.radii) {
                            transits.push(new Arc(transitData));
                        }
                        else {
                            transits.push(InputUtilities.cleansePoint(transitData));
                        }
                    }
                }
                this.transits = transits;
                break;
            case "clipPaths":
                let clipPaths = [];
                if (propertyValue) {
                    for (const clipPath of propertyValue) {
                        clipPaths.push(new ClipPath(clipPath));
                    }
                }
                this.clipPaths = clipPaths;
                break;
            case "rotationAngle":
                this.rotationAngle = InputUtilities.cleanseNumber(propertyValue);
                break;
        }
    }

    #applyPropertyInsert(propertyName, index, value) {
        if (propertyName == "clipPaths") {
            this.insertClipPath(new ClipPath(value), index);
        }
    }

    #applyPropertyDelete(propertyName, value) {
        if (propertyName == "clipPaths") {
            this.removeClipPath(new ClipPath(value));
        }
    }

    // helpers
    #eventListeners;

    #onChange = (changeSet, invalidateBounds) => {
        if (this.#eventListeners[Change.ChangeEvent]) {
            if (changeSet?.changes) {
                for (const change of changeSet.changes) {
                    change.pathId = this.id;
                }
            }
            for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                listener(changeSet, invalidateBounds);
            }
        }
        if (invalidateBounds) {
            this.#bounds = null;
        }
    }

    #addChangeEventListeners(source) {
        if (source) {
            source.addEventListener(Change.ChangeEvent, this.#onChange);
        }
    }

    #removeChangeEventListeners(source) {
        if (source) {
            source.removeEventListener(Change.ChangeEvent, this.#onChange);
        }
    }

    #getPropertyChange(propertyName, v1, v2) {
        return ChangeSet.getPropertyChange(Path.name, propertyName, v1, v2);
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

    #getListData(list) {
        return list ? list.map(x => x.getData ? x.getData() : x) : null;
    }
}
