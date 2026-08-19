
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
        if (arc.radii.x == arc.radii.y) {
            arc.rotationAngle = 0;
        }
        if (arc.rotationAngle % 90 == 0) {
            return Arc.#resizeArcAxisAligned(arc, scaleX, scaleY);
        }
        const scaledEllipsePoints = Arc.#getScaledEllipsePoints(arc, scaleX, scaleY);
        const coefficients = Arc.#findEllipseCoefficients(scaledEllipsePoints);
        if (!coefficients) {
            return Arc.#resizeArcAxisAligned(arc, scaleX, scaleY);
        }
        let A, B, C, D, E, F;
        [A, B, C, D, E, F] = [coefficients.A, coefficients.B, coefficients.C, coefficients.D, coefficients.E, coefficients.F];
        const rotationAngle = (1 / 2) * Math.atan2(-B, C - A) * (180 / Math.PI);
        const disc = B ** 2 - 4 * A * C;
        const rx = -Math.sqrt(2 * (A * E ** 2 + C * D ** 2 - B * D * E + disc * F) * ((A + C) + Math.sqrt((A - C) ** 2 + B ** 2))) / disc;
        const ry = -Math.sqrt(2 * (A * E ** 2 + C * D ** 2 - B * D * E + disc * F) * ((A + C) - Math.sqrt((A - C) ** 2 + B ** 2))) / disc;
        const scaledEnd = { x: arc.end.x * scaleX, y: arc.end.y * scaleY };
        const scaledCenter = { x: arc.center.x * scaleX, y: arc.center.y * scaleY };
        return new Arc({
            end: scaledEnd,
            center: scaledCenter,
            radii: { x: rx, y: ry },
            rotationAngle: rotationAngle,
            sweepFlag: arc.sweepFlag
        });

    }

    static #getScaledEllipsePoints(arc, scaleX, scaleY) {
        const extrema = Arc.#getEllipseExtrema(arc);
        const scaledExtrema = {
            top: { x: extrema.top.x * scaleX, y: extrema.top.y * scaleY },
            left: { x: extrema.left.x * scaleX, y: extrema.left.y * scaleY },
            bottom: { x: extrema.bottom.x * scaleX, y: extrema.bottom.y * scaleY },
            right: { x: extrema.right.x * scaleX, y: extrema.right.y * scaleY }
        };
        const scaledEnd = { x: arc.end.x * scaleX, y: arc.end.y * scaleY };
        const scaledCenter = { x: arc.center.x * scaleX, y: arc.center.y * scaleY };
        const scaledEndRelativeToScaledCenter = { x: scaledEnd.x - scaledCenter.x, y: scaledEnd.y - scaledCenter.y };
        const ellipsePoints = [scaledExtrema.top, scaledExtrema.right, scaledExtrema.bottom, scaledExtrema.left];
        if (!this.#arePointsEqual(scaledExtrema.top, scaledEndRelativeToScaledCenter)
            && !this.#arePointsEqual(scaledExtrema.bottom, scaledEndRelativeToScaledCenter)
            && !this.#arePointsEqual(scaledExtrema.left, scaledEndRelativeToScaledCenter)
            && !this.#arePointsEqual(scaledExtrema.right, scaledEndRelativeToScaledCenter)) {
            ellipsePoints.push(scaledEndRelativeToScaledCenter);
        }
        if (ellipsePoints.length == 4) {
            const scaledStartRelativeToScaledCenter = { x: -scaledCenter.x * scaleX, y: -scaledCenter.y };
            if (!this.#arePointsEqual(scaledExtrema.top, scaledStartRelativeToScaledCenter)
                && !this.#arePointsEqual(scaledExtrema.bottom, scaledStartRelativeToScaledCenter)
                && !this.#arePointsEqual(scaledExtrema.left, scaledStartRelativeToScaledCenter)
                && !this.#arePointsEqual(scaledExtrema.right, scaledStartRelativeToScaledCenter)) {
                ellipsePoints.push(scaledStartRelativeToScaledCenter);
            }
        }
        return ellipsePoints;
    }

    static #getEllipseExtrema(ellipse) {
        const radians = (ellipse.rotationAngle ?? 0) * (Math.PI / 180);
        const rx = ellipse.radii.x;
        const ry = ellipse.radii.y;
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
        const top = { x: xTop, y: yTop };
        const left = { x: xLeft, y: yLeft };
        const bottom = { x: xBottom, y: yBottom };
        const right = { x: xRight, y: yRight };
        return { top: top, left: left, bottom: bottom, right: right };
    }

    static #arePointsEqual(point1, point2, maxDifference) {
        if (!maxDifference) {
            maxDifference = 2;
        }
        return (Math.abs(point1.x - point2.x) <= maxDifference) && (Math.abs(point1.y - point2.y) <= maxDifference)
    }

    static #resizeArcAxisAligned(arc, scaleX, scaleY) {
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

    static #findEllipseCoefficients(points) {
        if (points.length != 5) {
            return null;
        }
        const matrix = [];
        for (const pt of points) {
            matrix.push([pt.x * pt.x, pt.x * pt.y, pt.y * pt.y, pt.x, pt.y, -1]);
        }
        const coefficients = Arc.#gaussJordanEllimination(matrix);
        const [A, B, C, D, E] = coefficients;
        const F = 1;
        if (B * B - 4 * A * C >= 0) {
            // coefficients do not define an ellipse
            return null;
        }
        return { A, B, C, D, E, F };
    }

    static #gaussJordanEllimination(matrix) {
        const n = matrix.length;
        for (let i = 0; i < n; i++) {
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(matrix[k][i]) > Math.abs(matrix[maxRow][i])) {
                    maxRow = k;
                }
            }
            [matrix[i], matrix[maxRow]] = [matrix[maxRow], matrix[i]];
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const factor = matrix[k][i] / matrix[i][i];
                    for (let j = i; j < n + 1; j++) {
                        matrix[k][j] -= factor * matrix[i][j];
                    }
                } else {
                    const factor = matrix[i][i];
                    for (let j = i; j < n + 1; j++) {
                        matrix[i][j] /= factor;
                    }
                }
            }
        }
        const result = matrix.map(row => row[n]);
        return result;
    }
}
