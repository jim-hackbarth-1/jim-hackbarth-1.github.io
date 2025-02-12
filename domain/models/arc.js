
import { GeometryUtilities, InputUtilities } from "../references.js";

export class Arc {

    // constructor
    constructor(data) {
        this.#end = InputUtilities.cleansePoint(data?.end);
        this.#center = InputUtilities.cleansePoint(data?.center);
        this.#radii = InputUtilities.cleansePoint(data?.radii);
        this.#rotationAngle = InputUtilities.cleanseNumber(data?.rotationAngle);
        this.#sweepFlag = InputUtilities.cleanseNumber(data?.sweepFlag);
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
            sweepFlag: this.#sweepFlag
        };
    }

    getPathInfo() {
        const largeArcFlag = 0;
        return `a ${this.radii.x} ${this.radii.y} ${this.rotationAngle} ${largeArcFlag} ${this.sweepFlag} ${this.end.x} ${this.end.y}`;
    }

    static getBounds(start, arc) {
        const geometryUtilities = new GeometryUtilities();
        return geometryUtilities.getArcBounds(start, arc);
    }

    static rotateArc(arc, angleRadians) {
        const arcCenter = {
            x: arc.center.x * Math.cos(angleRadians) + arc.center.y * Math.sin(angleRadians),
            y: arc.center.y * Math.cos(angleRadians) - arc.center.x * Math.sin(angleRadians)
        };
        const arcEnd = {
            x: arc.end.x * Math.cos(angleRadians) + arc.end.y * Math.sin(angleRadians),
            y: arc.end.y * Math.cos(angleRadians) - arc.end.x * Math.sin(angleRadians)
        };
        const angleDegrees = angleRadians * (180 / Math.PI);
        let rotationAngle = arc.rotationAngle - angleDegrees;
        if (rotationAngle < 0) {
            rotationAngle += 360;
        }
        rotationAngle = rotationAngle % 360;
        return new Arc({
            end: arcEnd,
            center: arcCenter,
            radii: arc.radii,
            rotationAngle: rotationAngle,
            sweepFlag: arc.sweepFlag
        });
    }

    static resizeArc(arc, scaleX, scaleY) {

        // calculate scale considering rotation
        const theta = arc.rotationAngle * (Math.PI / 180);
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);
        let scaleXWithRotation = Math.sqrt(((scaleX * cos) ** 2) + ((scaleY * sin) ** 2));
        let scaleYWithRotation = Math.sqrt(((scaleX * sin) ** 2) + ((scaleY * cos) ** 2));
        const newRadii = { x: arc.radii.x * scaleXWithRotation, y: arc.radii.y * scaleYWithRotation };

        // get start and end points relative to center
        const startFromCenter = { x: -arc.center.x, y: -arc.center.y };
        const endFromCenter = { x: arc.end.x - arc.center.x, y: arc.end.y - arc.center.y };

        // get unrotated start and end points
        const cosNeg = Math.cos(-theta);
        const sinNeg = Math.sin(-theta);
        let xStartUnrotated = startFromCenter.x * cosNeg - startFromCenter.y * sinNeg;
        let yStartUnrotated = startFromCenter.x * sinNeg + startFromCenter.y * cosNeg;
        let xEndUnrotated = endFromCenter.x * cosNeg - endFromCenter.y * sinNeg;
        let yEndUnrotated = endFromCenter.x * sinNeg + endFromCenter.y * cosNeg;

        // scale unrotated start and end points
        xStartUnrotated = xStartUnrotated * scaleXWithRotation;
        yStartUnrotated = yStartUnrotated * scaleYWithRotation;
        xEndUnrotated = xEndUnrotated * scaleXWithRotation;
        yEndUnrotated = yEndUnrotated * scaleYWithRotation;

        // apply rotation
        let newXStart = xStartUnrotated * cosNeg + yStartUnrotated * sinNeg;
        let newYStart = -xStartUnrotated * sinNeg + yStartUnrotated * cosNeg;
        let newXEnd = xEndUnrotated * cosNeg + yEndUnrotated * sinNeg;
        let newYEnd = -xEndUnrotated * sinNeg + yEndUnrotated * cosNeg;

        // get new end relative to start
        const translateX = startFromCenter.x - newXStart;
        const translateY = startFromCenter.y - newYStart;
        const newEnd = { x: newXEnd + arc.center.x + translateX, y: newYEnd + arc.center.y + translateY };

        // get new center
        const newCenter = { x: arc.center.x + translateX, y: arc.center.y + translateY };

        // return new resized arc
        return new Arc({
            end: newEnd,
            center: newCenter,
            radii: newRadii,
            rotationAngle: arc.rotationAngle,
            sweepFlag: arc.sweepFlag
        });
    }
}
