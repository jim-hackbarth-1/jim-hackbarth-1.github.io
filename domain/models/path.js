
import { Arc, Change, ChangeSet, ChangeType, GeometryUtilities, InputUtilities, PathStyle, PathStyleOption, PathStyleType } from "../references.js";

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
        this.#imageLocationInfoList = Path.cleanseImageLocationInfoList(data?.imageLocationInfoList);
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
        this.#imageLocationInfoList = null;
        this.#onChange(changeSet, true);
    }

    /** @type {number} */
    #rotationAngle; 
    get rotationAngle() {
        return this.#rotationAngle ?? 0;
    }
    set rotationAngle(rotationAngle) {
        const changeSet = this.#getPropertyChange("rotationAngle", this.#rotationAngle, rotationAngle);
        this.#rotationAngle = rotationAngle;
        this.#imageLocationInfoList = null;
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
    getData(copy) {
        return {
            id: copy ? crypto.randomUUID() : this.#id,
            start: this.#start,
            transits: this.#getListData(this.#transits),
            rotationAngle: this.#rotationAngle,
            bounds: this.#bounds,
            imageLocationInfoList: this.#imageLocationInfoList
        };
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

    #imageLocationInfoList;
    getImageLocationInfo(pathStyleId) {
        if (this.#imageLocationInfoList) {
            return this.#imageLocationInfoList.find(x => x.pathStyleId == pathStyleId);
        }
        return null;
    }

    clearImageLocationInfo() {
        this.#imageLocationInfoList = null;
    }

    setImageLocationInfo(locationInfo) {
        if (!this.#imageLocationInfoList) {
            this.#imageLocationInfoList = [];
        }
        const index = this.#imageLocationInfoList.findIndex(x => x.pathStyleId == locationInfo.pathStyleId);
        if (index > -1) {
            this.#imageLocationInfoList[index] = locationInfo;
        }
        else {
            this.#imageLocationInfoList.push(locationInfo);
        }
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
        this.#inView = InputUtilities.cleanseBoolean(data?.inView);
        this.#imageLocationInfoList = Path.cleanseImageLocationInfoList(data?.imageLocationInfoList);
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
        this.#rotatedPathInfo = null;
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
        this.#rotatedPathInfo = null;
        this.#imageLocationInfoList = null;
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
        this.#imageLocationInfoList = null;
        for (const clipPath of this.#clipPaths) {
            this.#addChangeEventListeners(clipPath);
        }
        this.#onChange(changeSet, true);
    }

    /** @type {number} */
    #rotationAngle;
    get rotationAngle() {
        return this.#rotationAngle ?? 0;
    }
    set rotationAngle(rotationAngle) {
        const changeSet = this.#getPropertyChange("rotationAngle", this.#rotationAngle, rotationAngle);
        this.#rotationAngle = rotationAngle;
        this.#rotatedPathInfo = null;
        this.#imageLocationInfoList = null;
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

    #rotatedPathInfo;
    get rotatedPathInfo() {
        if (!this.#rotatedPathInfo) {
            this.#rotatedPathInfo = Path.getRotatedPathInfo(this);
        }
        return this.#rotatedPathInfo;
    }

    // methods
    getData(copy) {
        return {
            id: copy ? crypto.randomUUID() : this.#id,
            start: this.#start,
            transits: this.#getListData(this.#transits),
            clipPaths: this.#getListData(this.#clipPaths, copy),
            rotationAngle: this.#rotationAngle,
            bounds: this.#bounds,
            inView: this.#inView,
            imageLocationInfoList: this.#imageLocationInfoList
        };
    }

    static getRotatedPathInfo(path) {
        const theta = path.rotationAngle * (Math.PI / 180);
        const bounds = path.bounds;
        const centerX = bounds.x + bounds.width / 2;
        const centerY = bounds.y + bounds.height / 2;
        const xStart = path.start.x - centerX;
        const yStart = path.start.y - centerY;
        const xStartRotated = centerX + xStart * Math.cos(theta) + yStart * Math.sin(theta);
        const yStartRotated = centerY + yStart * Math.cos(theta) - xStart * Math.sin(theta);
        const transits = [];
        let rotatedTransit = null;
        for (const transit of path.transits) {
            if (transit.radii) {
                rotatedTransit = Arc.rotateArc(transit, theta);
            }
            else {
                rotatedTransit = {
                    x: transit.x * Math.cos(theta) + transit.y * Math.sin(theta),
                    y: transit.y * Math.cos(theta) - transit.x * Math.sin(theta)
                };
            }
            transits.push(rotatedTransit);
        }
        let pathInfo = `M ${xStartRotated},${yStartRotated} `;
        for (const transit of transits) {
            if (transit.radii) {
                pathInfo += ` ${transit.getPathInfo()}`;
            }
            else {
                pathInfo += ` l ${transit.x},${transit.y}`;
            }
        }
        return pathInfo;
    }

    #imageLocationInfoList;
    getImageLocationInfo(pathStyleId) {
        if (this.#imageLocationInfoList) {
            return this.#imageLocationInfoList.find(x => x.pathStyleId == pathStyleId);
        }
        return null;
    }

    clearImageLocationInfo() {
        this.#imageLocationInfoList = null;
        if (this.clipPaths) {
            for (const clipPath of this.clipPaths) {
                clipPath.clearImageLocationInfo();
            }
        }
    }

    setImageLocationInfo(locationInfo) {
        if (!this.#imageLocationInfoList) {
            this.#imageLocationInfoList = [];
        }
        const index = this.#imageLocationInfoList.findIndex(x => x.pathStyleId == locationInfo.pathStyleId);
        if (index > -1) {
            this.#imageLocationInfoList[index] = locationInfo;
        }
        else {
            this.#imageLocationInfoList.push(locationInfo);
        }
    }

    static cleanseImageLocationInfoList(imageLocationInfoList) {
        if (!imageLocationInfoList) {
            return null;
        }
        const listOut = [];
        for (const item of imageLocationInfoList) {
            const pathStyleId = InputUtilities.cleanseString(item.pathStyleId);
            const locations = [];
            for (const location of item.locations) {
                const index = InputUtilities.cleanseNumber(location.index);
                const x = InputUtilities.cleanseNumber(location.bounds.x);
                const y = InputUtilities.cleanseNumber(location.bounds.y);
                const width = InputUtilities.cleanseNumber(location.bounds.width);
                const height = InputUtilities.cleanseNumber(location.bounds.height);
                locations.push({
                    index: index,
                    bounds: { x: x, y: y, width: width, height: height }
                });
            }
            listOut.push({
                pathStyleId: pathStyleId,
                locations: locations
            });
        }
        return listOut;
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
        this.#imageLocationInfoList = null;
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
        this.#imageLocationInfoList = null;
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
            this.#imageLocationInfoList = null;
            this.#onChange(changeSet, true);
        }
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

    async renderStroke(context, map, stroke, options, closePath, zGroup, z, quickRender) {
        if (stroke && this.#isViewable(map, options)) {
            const offset = stroke.getStyleOptionValue(PathStyleOption.StrokeOffset) ?? { x: 0, y: 0 };
            if (!quickRender && stroke.getStyleOptionValue(PathStyleOption.PathStyleType) == PathStyleType.ImageArrayStroke) {
                const imageArrayInfo = await Path.#getImageArrayInfo(map, this, false, stroke);
                context.globalAlpha = stroke.options.find(o => o.key == PathStyleOption.Opacity)?.value ?? 1;
                map.renderImageArray(context, this, imageArrayInfo, zGroup, z, offset);
                if (this.clipPaths) {
                    for (const clipPath of this.clipPaths) {
                        imageArrayInfo = await Path.#getImageArrayInfo(map, clipPath, true, stroke);
                        map.renderImageArray(context, clipPath, imageArrayInfo, zGroup, z, offset);
                    }
                }
                return;
            }
            let pathInfo = this.getPathInfo();
            const isRotatedTileStyle = this.#isRotatedTileStyle(stroke);
            context.translate(offset.x, offset.y);
            const currentTransform = context.getTransform();
            if (isRotatedTileStyle) {
                pathInfo = this.rotatedPathInfo;
                const center = Path.#getCenter(this.bounds);
                context.translate(center.x, center.y);
                context.rotate((this.rotationAngle * Math.PI) / 180);
                context.translate(-center.x, -center.y);
            }
            if (closePath) {
                pathInfo += " z";
            }
            const path2D = new Path2D(pathInfo);
            await stroke.setStyle(context, map, this.bounds, closePath);
            context.stroke(path2D);
            if (isRotatedTileStyle) {
                context.setTransform(currentTransform);
            }
            if (this.clipPaths) {
                for (const clipPath of this.clipPaths) {
                    let innerPathInfo = clipPath.getPathInfo();
                    if (closePath) {
                        innerPathInfo += " z";
                    }
                    context.stroke(new Path2D(innerPathInfo));
                }
            } 
            context.translate(-offset.x, -offset.y);
        }
    }

    async renderFill(context, map, fill, options, zGroup, z, quickRender) {
        if (fill && this.#isViewable(map, options)) {
            if (!quickRender && fill.getStyleOptionValue(PathStyleOption.PathStyleType) == PathStyleType.ImageArrayFill) {
                let imageArrayInfo = await Path.#getImageArrayInfo(map, this, false, fill);
                context.globalAlpha = fill.options.find(o => o.key == PathStyleOption.Opacity)?.value ?? 1;
                map.renderImageArray(context, this, imageArrayInfo, zGroup, z, { x: 0, y: 0 });
                if (this.clipPaths) {
                    for (const clipPath of this.clipPaths) {
                        imageArrayInfo = await Path.#getImageArrayInfo(map, clipPath, true, fill);
                        map.renderImageArray(context, path, imageArrayInfo, zGroup, z, { x: 0, y: 0 });
                    }
                }
                return;
            }
            let pathInfo = this.getPathInfo();
            pathInfo += " z";
            context.save();
            let path2D = new Path2D(pathInfo);
            if (this.clipPaths && this.clipPaths.length > 0) {
                const outerPath = new Path2D(pathInfo);
                for (const clipPath of this.clipPaths) {
                    let innerPathInfo = clipPath.getPathInfo();
                    innerPathInfo += " z";
                    const innerPath = new Path2D(innerPathInfo);
                    outerPath.addPath(innerPath);
                }
                context.clip(outerPath, "evenodd");
            }
            const currentTransform = context.getTransform();
            const isRotatedTileStyle = this.#isRotatedTileStyle(fill);
            if (isRotatedTileStyle) {
                pathInfo = this.rotatedPathInfo;
                pathInfo += " z";
                path2D = new Path2D(pathInfo);
                const center = Path.#getCenter(this.bounds);
                context.translate(center.x, center.y);
                context.rotate((this.rotationAngle * Math.PI) / 180);
                context.translate(-center.x, -center.y);
            }
            await fill.setStyle(context, map, this.bounds, true);
            context.fill(path2D);
            if (isRotatedTileStyle) {
                context.setTransform(currentTransform);
            }
            context.restore();
        }
    }

    renderShadow(context, map, options, shadow, hasFills, aboveStrokes) {
        if (this.#isViewable(map, options)) {
            if (aboveStrokes) {
                this.#renderShadowAboveStrokes(context, shadow, hasFills);
                return;
            }
            let pathInfo = this.getPathInfo();
            if (hasFills) {
                pathInfo += " z";
            }
            context.save();
            let path2D = new Path2D(pathInfo);
            if (this.clipPaths && this.clipPaths.length > 0) {
                const shadowPathInfo = this.#getShadowPathInfo(shadow);
                const outerPath = new Path2D(shadowPathInfo);
                const maxOffset = Math.max(shadow.offsetX, shadow.offsetY);
                for (const clipPath of this.clipPaths) {
                    let innerPathInfo = clipPath.getPathInfo();
                    innerPathInfo += " z";
                    const innerPath = new Path2D(innerPathInfo);
                    context.lineWidth = maxOffset / 2;
                    context.strokeStyle = shadow.color;
                    context.globalAlpha = 0.5;
                    let offsetX = shadow.offsetX / 5;
                    let offsetY = shadow.offsetY / 5;
                    context.translate(offsetX, offsetY);
                    context.filter = `blur(${maxOffset / 5}px)`;
                    context.stroke(innerPath);
                    context.filter = "none";
                    context.translate(-offsetX, -offsetY);
                    context.lineWidth = maxOffset + 1;
                    context.globalAlpha = 1;
                    offsetX = shadow.offsetX / 2;
                    offsetY = shadow.offsetY / 2;
                    context.translate(offsetX, offsetY);
                    context.filter = `blur(${maxOffset / 2}px)`;
                    context.stroke(innerPath);
                    context.filter = "none";
                    context.translate(-offsetX, -offsetY);
                    outerPath.addPath(innerPath);
                }
                context.clip(outerPath, "evenodd");
            }
            context.shadowColor = shadow.color;
            context.shadowOffsetX = shadow.offsetX;
            context.shadowOffsetY = shadow.offsetY;
            context.shadowBlur = shadow.blur;
            if (hasFills) {
                context.fillStyle = shadow.color;
                context.fill(path2D);
            }
            else {
                context.strokeStyle = shadow.color;
                context.stroke(path2D);
            }
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowBlur = 0;
            context.restore();
        }
    }

    #renderShadowAboveStrokes(context, shadow, hasFills) {

        context.strokeStyle = shadow.color;
        context.globalAlpha = 1;
        context.filter = `blur(${shadow.blur}px)`;
        context.lineWidth = shadow.blur;
        let pathInfo = this.getPathInfo();
        if (hasFills) {
            pathInfo += " z";
        }
        let path2D = new Path2D(pathInfo);

        const offsetX = shadow.offsetX;
        const offsetY = shadow.offsetY;
        context.translate(offsetX, offsetY);

        context.stroke(path2D);
        context.stroke(path2D);

        if (this.clipPaths) {
            for (const clipPath of this.clipPaths) {
                pathInfo = clipPath.getPathInfo();
                pathInfo += " z";
                path2D = new Path2D(pathInfo);
                context.stroke(path2D);
                context.stroke(path2D);
            }
        }

        context.translate(-offsetX, -offsetY);
        context.filter = "none";

    }

    #getShadowPathInfo(shadow) {
        const x = this.bounds.x - shadow.blur - shadow.offsetX;
        const y = this.bounds.y - shadow.blur - shadow.offsetY;
        const width = this.bounds.width + 2 * (shadow.blur + shadow.offsetX);
        const height = this.bounds.height + 2 * (shadow.blur + shadow.offsetY);
        return `M ${x},${y} l ${width},0 0,${height} -${width},0 z`;
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
            const startInViewPort = geometryUtilities.isPointInBounds(this.start, map.currentViewPort);
            const viewPortStartInBounds = geometryUtilities.isPointInBounds({ x: map.currentViewPort.x, y: map.currentViewPort.y }, this.bounds);
            if (startInViewPort || viewPortStartInBounds) {
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
                this.#inView = geometryUtilities.hasPathPathIntersections(path1, path2);
            }
        }
        return this.#inView;
    }

    #getListData(list, copy) {
        return list ? list.map(x => x.getData ? x.getData(copy) : x) : null;
    }

    #isRotatedTileStyle(pathStyle) {
        if (this.rotationAngle && this.rotationAngle != 0) {
            return pathStyle.options.some(
                o => o.key == PathStyleOption.PathStyleType && (o.value == PathStyleType.TileFill || o.value == PathStyleType.TileStroke));
        }
        return false;
    }

    static #getCenter(bounds) {
        return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
    }

    static async #getImageArrayInfo(map, path, isClip, pathStyle) {
        let locationInfo = path.getImageLocationInfo(pathStyle.id);
        const images = await Path.#getImagesFromPathStyle(map, pathStyle);
        if (!locationInfo) {
            locationInfo = await PathStyle.buildImageLocationArray(path, isClip, pathStyle, images); 
            path.setImageLocationInfo(locationInfo);
        }
        return {
            images: images,
            locationInfo: locationInfo
        };
    }

    static async #getImagesFromPathStyle(map, pathStyle) {
        const images = [];
        for (let i = 1; i <= 10; i++) {
            const data = pathStyle.getStyleOptionValue(`ImageArraySource${i}`);
            if (data) {
                const key = `${pathStyle.id}-ImageArraySource${i}`;
                const image = await map.getImage(key, data);
                images.push(image);
            }
        }
        return images;
    }
}
