
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

export class PathArcs {

    // constructor
    constructor(data) {
        this.#id = data?.id ?? crypto.randomUUID();
        this.#start = data?.start;
        if (data?.arcs) {
            this.#arcs = [];
            for (const arc of data.arcs) {
                this.#arcs.push(new Arc(arc));
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

    /** @type {[Arc]} */
    #arcs;
    get arcs() {
        return this.#arcs ?? [];
    }
    set arcs(arcs) {
        const change = this.#getPropertyChange("arcs", this.#arcs, arcs);
        this.#arcs = arcs;
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
            start: this.#start,
            arcs: this.#arcs ? this.#arcs.map(a => a.getData()) : null,
            rotationAngle: this.#rotationAngle,
            pathType: PathArcs.name
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
        let pathInfo = `M ${this.#start.x},${this.#start.y}`;
        for (const arc of this.arcs) {
            pathInfo += ` ${arc.getPathInfo()}`;
        }
        return pathInfo;
    }

    getBounds() {
        let xMin = NaN, xMax = NaN, yMin = NaN, yMax = NaN;
        let start = this.start;
        for (const arc of this.arcs) {   
            const arcBounds = Arc.getBounds(start, arc);
            if (isNaN(xMin) || arcBounds.x < xMin) {
                xMin = arcBounds.x;
            }
            if (isNaN(xMax) || arcBounds.x + arcBounds.width > xMax) {
                xMax = arcBounds.x + arcBounds.width;
            }
            if (isNaN(yMin) || arcBounds.y < yMin) {
                yMin = arcBounds.y;
            }
            if (isNaN(yMax) || arcBounds.y + arcBounds.height > yMax) {
                yMax = arcBounds.y + arcBounds.height;
            }
            start = { x: start.x + arc.end.x, y: start.y + arc.end.y };
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
            changeObjectType: PathArcs.name,
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

export class Arc {

    // constructor
    constructor(data) {
        this.#end = data?.end;
        this.#center = data?.center;
        this.#radii = data?.radii;
        this.#rotationAngle = data?.rotationAngle;
        this.#largeArcFlag = data?.largeArcFlag;
        this.#sweepFlag = data?.sweepFlag;
    }

    // properties
    /** @type {{x: number, y: number}} */
    #end;
    get end() {
        return this.#end ?? { x: 0, y: 0 };
    }
    set end(end) {
        this.#end = end;
    }

    /** @type {{x: number, y: number}} */
    #center;
    get center() {
        return this.#center ?? { x: 0, y: 0 };
    }
    set center(center) {
        this.#center = center;
    }

    /** @type {{x: number, y: number}} */
    #radii;
    get radii() {
        return this.#radii ?? { x: 0, y: 0 };
    }
    set radii(radii) {
        this.#radii = radii;
    }

    /** @type {number} */
    #rotationAngle;
    get rotationAngle() {
        return this.#rotationAngle ?? 0;
    }
    set rotationAngle(rotationAngle) {
        this.#rotationAngle = rotationAngle;
    }

    /** @type {number} */
    #largeArcFlag;
    get largeArcFlag() {
        return this.#largeArcFlag ?? 0;
    }
    set largeArcFlag(largeArcFlag) {
        this.#largeArcFlag = largeArcFlag;
    }

    /** @type {number} */
    #sweepFlag;
    get sweepFlag() {
        return this.#sweepFlag ?? 0;
    }
    set sweepFlag(sweepFlag) {
        this.#sweepFlag = sweepFlag;
    }

    // methods
    getData() {
        return {
            end: this.#end,
            center: this.#center,
            radii: this.#radii,
            rotationAngle: this.#rotationAngle,
            largeArcFlag: this.#largeArcFlag,
            sweepFlag: this.#sweepFlag
        };
    }

    getPathInfo() {
        return `a ${this.radii.x} ${this.radii.y} ${this.rotationAngle} ${this.largeArcFlag} ${this.sweepFlag} ${this.end.x} ${this.end.y}`;
    }

    static getBounds(start, arc) {

        const radians = arc.rotationAngle * (Math.PI / 180);
        const rx = arc.radii.x;
        const ry = arc.radii.y;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        let xRight = Math.sqrt(rx ** 2 * cos ** 2 + ry ** 2 * sin ** 2);
        let yRight = -((ry ** 2 - rx ** 2) * Math.sin(2 * radians)) / (2 * Math.sqrt(rx ** 2 * cos ** 2 + ry ** 2 * sin ** 2));
        let xLeft = -xRight;
        let yLeft = -yRight;
        let xTop = ((ry ** 2 - rx ** 2) * Math.sin(2 * radians)) / (2 * Math.sqrt(rx ** 2 * sin ** 2 + ry ** 2 * cos ** 2));
        let yTop = -Math.sqrt(rx ** 2 * sin ** 2 + ry ** 2 * cos ** 2);
        let xBottom = -xTop;
        let yBottom = -yTop;
        const end = { x: start.x + arc.end.x, y: start.y + arc.end.y };
        const dx = start.x + arc.center.x;
        const dy = start.y + arc.center.y;
        const top = { x: xTop + dx, y: yTop + dy };
        const left = { x: xLeft + dx, y: yLeft + dy };
        const bottom = { x: xBottom + dx, y: yBottom + dy };
        const right = { x: xRight + dx, y: yRight + dy };
        const center = { x: (left.x + right.x) / 2, y: (top.y + bottom.y) / 2 };

        const startQuadrant = (start.x <= center.x)
            ? (start.y <= center.y) ? 2 : 3
            : (start.y <= center.y) ? 1 : 4;
        const endQuadrant = (end.x <= center.x)
            ? (end.y <= center.y) ? 2 : 3
            : (end.y <= center.y) ? 1 : 4;

        const extrema = [start, end];
        if (arc.sweepFlag == 0) {
            if (startQuadrant === 1) {
                if (endQuadrant === 2) {
                    extrema.push(top);
                }
                if (endQuadrant === 3) {
                    extrema.push(top);
                    extrema.push(left);
                }
                if (endQuadrant === 4) {
                    extrema.push(top);
                    extrema.push(left);
                    extrema.push(bottom);
                }
                if (endQuadrant === 1 && start.x < end.x) {
                    extrema.push(top);
                    extrema.push(left);
                    extrema.push(bottom);
                    extrema.push(right);
                }
            }
            if (startQuadrant === 2) {
                if (endQuadrant === 3) {
                    extrema.push(left);
                }
                if (endQuadrant === 4) {
                    extrema.push(left);
                    extrema.push(bottom);
                }
                if (endQuadrant === 1) {
                    extrema.push(left);
                    extrema.push(bottom);
                    extrema.push(right);
                }
                if (endQuadrant === 2 && start.x < end.x) {
                    extrema.push(left);
                    extrema.push(bottom);
                    extrema.push(right);
                    extrema.push(top);
                }
            }
            if (startQuadrant === 3) {
                if (endQuadrant === 4) {
                    extrema.push(bottom);
                }
                if (endQuadrant === 1) {
                    extrema.push(bottom);
                    extrema.push(right);
                }
                if (endQuadrant === 2) {
                    extrema.push(bottom);
                    extrema.push(right);
                    extrema.push(top);
                }
                if (endQuadrant === 3 && start.x > end.x) {
                    extrema.push(bottom);
                    extrema.push(right);
                    extrema.push(top);
                    extrema.push(left);
                }
            }
            if (startQuadrant === 4) {
                if (endQuadrant === 1) {
                    extrema.push(right);
                }
                if (endQuadrant === 2) {
                    extrema.push(right);
                    extrema.push(top);
                }
                if (endQuadrant === 3) {
                    extrema.push(right);
                    extrema.push(top);
                    extrema.push(left);
                }
                if (endQuadrant === 4 && start.x > end.x) {
                    extrema.push(right);
                    extrema.push(top);
                    extrema.push(left);
                    extrema.push(bottom);
                }
            }
        }
        else {
            if (startQuadrant === 1) {
                if (endQuadrant === 4) {
                    extrema.push(right);
                }
                if (endQuadrant === 3) {
                    extrema.push(right);
                    extrema.push(bottom);
                }
                if (endQuadrant === 2) {
                    extrema.push(right);
                    extrema.push(bottom);
                    extrema.push(left);
                }
                if (endQuadrant === 1 && start.x > end.x) {
                    extrema.push(right);
                    extrema.push(bottom);
                    extrema.push(left);
                    extrema.push(top);
                }
            }
            if (startQuadrant === 4) {
                if (endQuadrant === 3) {
                    extrema.push(bottom);
                }
                if (endQuadrant === 2) {
                    extrema.push(bottom);
                    extrema.push(left);
                }
                if (endQuadrant === 1) {
                    extrema.push(bottom);
                    extrema.push(left);
                    extrema.push(top);
                }
                if (endQuadrant === 4 && start.x < end.x) {
                    extrema.push(bottom);
                    extrema.push(left);
                    extrema.push(top);
                    extrema.push(right);
                }
            }
            if (startQuadrant === 3) {
                if (endQuadrant === 2) {
                    extrema.push(left);
                }
                if (endQuadrant === 1) {
                    extrema.push(left);
                    extrema.push(top);
                }
                if (endQuadrant === 4) {
                    extrema.push(left);
                    extrema.push(top);
                    extrema.push(right);
                }
                if (endQuadrant === 3 && start.x < end.x) {
                    extrema.push(left);
                    extrema.push(top);
                    extrema.push(right);
                    extrema.push(bottom);
                }
            }
            if (startQuadrant === 2) {
                if (endQuadrant === 1) {
                    extrema.push(top);
                }
                if (endQuadrant === 4) {
                    extrema.push(top);
                    extrema.push(right);
                }
                if (endQuadrant === 3) {
                    extrema.push(top);
                    extrema.push(right);
                    extrema.push(bottom);
                }
                if (endQuadrant === 2 && start.x > end.x) {
                    extrema.push(top);
                    extrema.push(right);
                    extrema.push(bottom);
                    extrema.push(left);
                }
            }
        }
        const xExtrema = extrema.map(pt => pt.x);
        const yExtrema = extrema.map(pt => pt.y);
        const xBoundsMin = Math.min(...xExtrema);
        const xBoundsMax = Math.max(...xExtrema);
        const yBoundsMin = Math.min(...yExtrema);
        const yBoundsMax = Math.max(...yExtrema);
        return { x: xBoundsMin, y: yBoundsMin, width: xBoundsMax - xBoundsMin, height: yBoundsMax - yBoundsMin };
    }

    static resizeArc(arc, scaleX, scaleY, resizeDirection) {

        // find radii endpoints
        const theta = arc.rotationAngle * (Math.PI / 180);
        const rxp1 = { x: arc.center.x + arc.radii.x * Math.cos(theta), y: arc.center.y + arc.radii.x * Math.sin(theta) };
        const rxp2 = { x: arc.center.x + -arc.radii.x * Math.cos(theta), y: arc.center.y + -arc.radii.x * Math.sin(theta) };
        const ryp1 = { x: arc.center.x + arc.radii.y * Math.sin(theta), y: arc.center.y + -arc.radii.y * Math.cos(theta) };
        const ryp2 = { x: arc.center.x + -arc.radii.y * Math.sin(theta), y: arc.center.y + arc.radii.y * Math.cos(theta) };

        // find radius to scale
        let xResize = arc.center.x;
        if (resizeDirection.endsWith("E")) {
            xResize = Math.max(...[rxp1.x, rxp2.x, ryp1.x, ryp2.x]);
        }
        if (resizeDirection.endsWith("W")) {
            xResize = Math.min(...[rxp1.x, rxp2.x, ryp1.x, ryp2.x]);
        }
        let yResize = arc.center.y;
        if (resizeDirection.startsWith("N")) {
            yResize = Math.min(...[rxp1.y, rxp2.y, ryp1.y, ryp2.y]);
        }
        if (resizeDirection.startsWith("S")) {
            yResize = Math.max(...[rxp1.y, rxp2.y, ryp1.y, ryp2.y]);
        }
        let radius = "x";
        let closestEndpoint = rxp1;
        let d = (rxp1.x - xResize) ** 2 + (rxp1.y - yResize) ** 2;
        let testD = (rxp2.x - xResize) ** 2 + (rxp2.y - yResize) ** 2;
        if (testD < d) {
            d = testD;
            closestEndpoint = rxp2;
        }
        testD = (ryp1.x - xResize) ** 2 + (ryp1.y - yResize) ** 2;
        if (testD < d) {
            d = testD;
            closestEndpoint = ryp1;
            radius = "y";
        }
        testD = (ryp2.x - xResize) ** 2 + (ryp2.y - yResize) ** 2;
        if (testD < d) {
            d = testD;
            closestEndpoint = ryp2;
            radius = "y";
        }

        // calculate angle of rotation
        let dx = Math.abs(closestEndpoint.x - arc.center.x) * scaleX;
        let dy = Math.abs(closestEndpoint.y - arc.center.y) * scaleY;
        if ((arc.rotationAngle > 90 && arc.rotationAngle < 180) || (arc.rotationAngle > 270)) {
            dx = Math.abs(closestEndpoint.y - arc.center.y) * scaleY;
            dy = Math.abs(closestEndpoint.x - arc.center.x) * scaleX;
        }
        let newTheta = 0;
        if (radius == "x" && dx != 0) {
            newTheta = Math.atan(dy / dx);
        }
        if (radius == "y" && dy != 0) {
            newTheta = Math.atan(dx / dy);
        }     
        newTheta = newTheta % (Math.PI * 2);
        if (arc.rotationAngle > 90 && arc.rotationAngle < 180) {
            newTheta += (Math.PI / 2);
        }
        if (arc.rotationAngle > 180 && arc.rotationAngle < 270) {
            newTheta += Math.PI;
        }
        if (arc.rotationAngle > 270) {
            newTheta += (3* Math.PI / 2);
        }
        const newRotation = newTheta * (180 / Math.PI);

        // calculate scale considering rotation
        let scaleXWithRotation = Math.sqrt(((scaleX * Math.cos(newTheta)) ** 2) + ((scaleY * Math.sin(newTheta)) ** 2));
        let scaleYWithRotation = Math.sqrt(((scaleX * Math.sin(newTheta)) ** 2) + ((scaleY * Math.cos(newTheta)) ** 2));
        const newRadii = { x: arc.radii.x * scaleXWithRotation, y: arc.radii.y * scaleYWithRotation };

        // get start and end points relative to center
        const startFromCenter = { x: -arc.center.x, y: -arc.center.y };
        const endFromCenter = { x: arc.end.x - arc.center.x, y: arc.end.y - arc.center.y };

        // get unrotated start and end points
        let xStartUnrotated = -startFromCenter.x * Math.cos(-theta) + startFromCenter.y * Math.sin(-theta);
        let yStartUnrotated = startFromCenter.x * Math.sin(-theta) + startFromCenter.y * Math.cos(-theta);
        let xEndUnrotated = -endFromCenter.x * Math.cos(-theta) + endFromCenter.y * Math.sin(-theta);
        let yEndUnrotated = endFromCenter.x * Math.sin(-theta) + endFromCenter.y * Math.cos(-theta);

        // scale unrotated start and end points
        xStartUnrotated = xStartUnrotated * scaleXWithRotation;
        yStartUnrotated = yStartUnrotated * scaleYWithRotation;
        xEndUnrotated = xEndUnrotated * scaleXWithRotation;
        yEndUnrotated = yEndUnrotated * scaleYWithRotation;

        // apply rotation
        let newXStart = xStartUnrotated * Math.cos(-newTheta) + yStartUnrotated * Math.sin(-newTheta);
        let newYStart = -xStartUnrotated * Math.sin(-newTheta) + yStartUnrotated * Math.cos(-newTheta);
        let newXEnd = xEndUnrotated * Math.cos(-newTheta) + yEndUnrotated * Math.sin(-newTheta);
        let newYEnd = -xEndUnrotated * Math.sin(-newTheta) + yEndUnrotated * Math.cos(-newTheta);
        
        // get new end relative to start
        const translateX = startFromCenter.x - newXStart;
        const translateY = startFromCenter.y - newYStart;
        const newEnd = { x: newXEnd + arc.center.x + translateX, y: newYEnd + arc.center.y + translateY };

        // get new center
        const newCenter = { x: arc.center.x + translateX, y: arc.center.y + translateY };

        // return resized arc data
        return {
            end: newEnd,
            center: newCenter,
            radii: newRadii,
            rotationAngle: newRotation,
            largeArcFlag: arc.largeArcFlag,
            sweepFlag: arc.sweepFlag
        };
    }
}
