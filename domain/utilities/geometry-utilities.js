
export class GeometryUtilities {

    // methods
    transformPoint(point, scale, translation) {
        const dx = translation?.x ?? 0;
        const dy = translation?.y ?? 0;
        const scaleX = scale?.x ?? 1;
        const scaleY = scale?.y ?? 1;
        let x = (point.x * scaleX) + dx;
        let y = (point.y * scaleY) + dy;
        return { x: x, y: y };
    }

    getRotatedPoint(point, angleDegrees, centerOfRotation) {
        const radians = (angleDegrees * Math.PI) / 180;
        const translatedX = point.x - centerOfRotation.x;
        const translatedY = point.y - centerOfRotation.y;
        const rotatedX = translatedX * Math.cos(radians) - translatedY * Math.sin(radians);
        const rotatedY = translatedX * Math.sin(radians) + translatedY * Math.cos(radians);
        const finalX = rotatedX + centerOfRotation.x;
        const finalY = rotatedY + centerOfRotation.y;
        return { x: finalX, y: finalY };
    }

    isPointOnSegment(point, segment) {
        let x1 = segment.point1.x;
        let y1 = segment.point1.y;
        let x2 = segment.point2.x;
        let y2 = segment.point2.y;
  
        // check case where segment is point
        if (x1 === x2 && y1 === y2) {
            return (point.x === x1 && point.y === y1);
        }

        // check segment bounds
        if (point.x < Math.min(x1, x2)
            || point.x > Math.max(x1, x2)
            || point.y < Math.min(y1, y2)
            || point.y > Math.max(y1, y2)) {
            return false;
        }

        // check distances
        const d1 = Math.sqrt(((point.x - x1) ** 2) + ((point.y - y1) ** 2));
        const d2 = Math.sqrt(((point.x - x2) ** 2) + ((point.y - y2) ** 2));
        const d3 = Math.sqrt(((x1 - x2) ** 2) + ((y1 - y2) ** 2));
        return ((d1 + d2) - d3 <= 1);
    }

    getRotatedSegment(segment, angleDegrees, centerOfRotation) {
        return {
            point1: this.getRotatedPoint(segment.point1, angleDegrees, centerOfRotation),
            point2: this.getRotatedPoint(segment.point2, angleDegrees, centerOfRotation),
        };
    }

    getSegmentSegmentIntersection(segment1, segment2) {
        const x1 = segment1.point1.x;
        const y1 = segment1.point1.y;
        const x2 = segment1.point2.x;
        const y2 = segment1.point2.y;
        const x3 = segment2.point1.x;
        const y3 = segment2.point1.y;
        const x4 = segment2.point2.x;
        const y4 = segment2.point2.y;

        // check cases where one or both segments are points
        if (x1 === x2 && y1 === y2 && x3 === x4 && y3 === y4) {
            return (x1 === x3 && y1 === y3) ? segment1.point1 : null;
        }
        if (x1 === x2 && y1 === y2) {
            return this.isPointOnSegment(segment1.point1, segment2) ? segment1.point1 : null;
        }
        if (x3 === x4 && y3 === y4) {
            return this.isPointOnSegment(segment2.point1, segment1) ? segment2.point1 : null;
        }

        // check for parallel segments
        const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        if (denominator === 0) {
            return null;
        }

        // check segment bounds
        const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
        const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
            return null;
        }

        // return intersection
        return { x: x1 + ua * (x2 - x1), y: y1 + ua * (y2 - y1) };
    }

    getSegmentArcIntersections(segment, arcStart, arc) {

        // translate so that the arc center is the origin
        const dx = arcStart.x + arc.center.x;
        const dy = arcStart.y + arc.center.y;
        const origin = { x: 0, y: 0 };
        let transformedSegment = {
            point1: { x: segment.point1.x - dx, y: segment.point1.y - dy },
            point2: { x: segment.point2.x - dx, y: segment.point2.y - dy }
        };
        let transformedArcStart = { x: arcStart.x - dx, y: arcStart.y - dy };
        const arcEnd = { x: arcStart.x + arc.end.x, y: arcStart.y + arc.end.y };
        let transformedArcEnd = { x: arcEnd.x - dx, y: arcEnd.y - dy };
        transformedSegment = this.getRotatedSegment(transformedSegment, -arc.rotationAngle, origin);
        transformedArcStart = this.getRotatedPoint(transformedArcStart, -arc.rotationAngle, origin);
        transformedArcEnd = this.getRotatedPoint(transformedArcEnd, -arc.rotationAngle, origin);

        // get line - ellipse intersections
        const x1 = transformedSegment.point1.x;
        const y1 = transformedSegment.point1.y;
        const x2 = transformedSegment.point2.x;
        const y2 = transformedSegment.point2.y;
        const rx = arc.radii.x;
        const ry = arc.radii.y;
        let ellipseIntersections = [];
        if (x1 === x2) {
            // vertical line, no slope
            const t = 1 - (x1 ** 2) / (rx ** 2);
            if (t < 0) {
                return [];
            }
            const yRoot = ry * Math.sqrt(1 - x1 ** 2 / rx ** 2);
            if (t === 0) {
                ellipseIntersections = [{ x: x1, y: yRoot }];
            }
            if (t > 0) {
                ellipseIntersections = [
                    { x: x1, y: yRoot },
                    { x: x1, y: -yRoot }
                ];
            }
        }
        else {
            const m = (y1 - y2) / (x1 - x2);
            const b = (-m * x1) + y1;
            const t1 = (ry ** 2) + (rx ** 2) * (m ** 2);
            const t2 = 2 * b * m * (rx ** 2);
            const t3 = (b ** 2) * (rx ** 2) - (rx ** 2) * (ry ** 2);
            const d = (t2 ** 2) - 4 * t1 * t3;
            if (d < 0) {
                return [];
            }
            if (d === 0) {
                const xRoot = (-t2) / (2 * t1);
                ellipseIntersections = [{ x: xRoot, y: m * xRoot + b, }];
            }
            if (d > 0) {
                const xRoot1 = (-t2 + Math.sqrt(d)) / (2 * t1);
                const xRoot2 = (-t2 - Math.sqrt(d)) / (2 * t1);
                ellipseIntersections = [
                    { x: xRoot1, y: m * xRoot1 + b, },
                    { x: xRoot2, y: m * xRoot2 + b }
                ];
            }
        }

        // get segment - arc intersections
        const intersections = [];
        const startAngle = this.#getPointAngleToOrigin(transformedArcStart);
        let endAngle = this.#getPointAngleToOrigin(transformedArcEnd);
        endAngle = startAngle - endAngle;
        if (endAngle < 0) {
            endAngle += 360;
        }
        for (const intersection of ellipseIntersections) {
            if (this.isPointOnSegment(intersection, transformedSegment)) {
                let pointAngle = this.#getPointAngleToOrigin(intersection);
                pointAngle = startAngle - pointAngle;
                if (pointAngle < 0) {
                    pointAngle += 360;
                }
                const inSweep = (arc.sweepFlag === 0) ? pointAngle <= endAngle : pointAngle >= endAngle;
                if (inSweep) {
                    const unrotatedIntersection = this.getRotatedPoint(intersection, arc.rotationAngle, origin);
                    const unTranslatedIntersection = { x: unrotatedIntersection.x + dx, y: unrotatedIntersection.y + dy };
                    intersections.push(unTranslatedIntersection);
                }
            }
        }
        return intersections;
    }

    getEllipseEllipseIntersections(ellipse1Start, ellipse1, ellipse2Start, ellipse2) {
        const ellipse1Center = { x: ellipse1Start.x + ellipse1.center.x, y: ellipse1Start.y + ellipse1.center.y };
        const ellipse1Coefficients = EllipseCoefficients.fromEllipse(ellipse1Center, ellipse1.radii, ellipse1.rotationAngle);
        const ellipse2Center = { x: ellipse2Start.x + ellipse2.center.x, y: ellipse2Start.y + ellipse2.center.y };
        const ellipse2Coefficients = EllipseCoefficients.fromEllipse(ellipse2Center, ellipse2.radii, ellipse2.rotationAngle);
        const implicitCoefficients = EllipseCoefficients.elliminateTerm(ellipse1Coefficients, ellipse2Coefficients, "a");
        const b = implicitCoefficients.b;
        const c = implicitCoefficients.c;
        const d = implicitCoefficients.d;
        const e = implicitCoefficients.e;
        const f = implicitCoefficients.f;
        const temp1 = c * d + b * e;
        const temp2 = d * e + b * f;
        const quartC1 = ellipse1Coefficients.a * c * c
            + ellipse1Coefficients.c * b * b
            - ellipse1Coefficients.b * b * c;
        const quartC2 = 2 * ellipse1Coefficients.a * c * e
            + 2 * ellipse1Coefficients.c * b * d
            + ellipse1Coefficients.e * b * b
            - ellipse1Coefficients.d * b * c
            - ellipse1Coefficients.b * temp1;
        const quartC3 = ellipse1Coefficients.a * (2 * c * f + e * e)
            + ellipse1Coefficients.c * d * d
            + 2 * ellipse1Coefficients.e * b * d
            + ellipse1Coefficients.f * b * b
            - ellipse1Coefficients.d * temp1
            - ellipse1Coefficients.b * temp2;
        const quartC4 = 2 * ellipse1Coefficients.a * e * f
            + ellipse1Coefficients.e * d * d
            + 2 * ellipse1Coefficients.f * b * d
            - ellipse1Coefficients.d * temp2
            - ellipse1Coefficients.b * d * f;
        const quartC5 = ellipse1Coefficients.a * f * f
            + ellipse1Coefficients.f * d * d
            - ellipse1Coefficients.d * d * f;
        let quarticRoots = this.#getPolynomialRoots([quartC1, quartC2, quartC3, quartC4, quartC5]);
        quarticRoots = ComplexNumber.removeDuplicates(quarticRoots, 0.0001);
        quarticRoots = ComplexNumber.removeImaginary(quarticRoots, 0.0001);
        const ellipseIntersections = [];
        for (const quarticRoot of quarticRoots) {
            const denominator = b * quarticRoot.real + d;
            if (Math.abs(denominator) < 1E-10) {
                const quadC1 = ellipse1Coefficients.a;
                const quadC2 = ellipse1Coefficients.b * quarticRoot.real + ellipse1Coefficients.d;
                const quadC3 = ellipse1Coefficients.c * quarticRoot.real ** 2 + ellipse1Coefficients.e * quarticRoot.real + ellipse1Coefficients.f;
                let quadRoots = this.#getPolynomialRoots([quadC1, quadC2, quadC3]);
                quadRoots = ComplexNumber.removeDuplicates(quadRoots, 0.0001);
                quadRoots = ComplexNumber.removeImaginary(quadRoots, 0.0001);
                for (const quadRoot of quadRoots) {
                    ellipseIntersections.push({ x: quadRoot.real, y: quarticRoot.real });
                }
            }
            else {
                const numerator = c * quarticRoot.real ** 2 + e * quarticRoot.real + f;
                ellipseIntersections.push({ x: -numerator / denominator, y: quarticRoot.real });
            }
        }
        return ellipseIntersections;
    }

    getArcArcIntersections(arc1Start, arc1, arc2Start, arc2) {
        const ellipseIntersections = this.getEllipseEllipseIntersections(arc1Start, arc1, arc2Start, arc2);
        const intersections = [];
        for (const ellipseIntersection of ellipseIntersections) {
            const isOnArc1 = this.isEllipsePointOnArc(ellipseIntersection, arc1Start, arc1);
            const isOnArc2 = this.isEllipsePointOnArc(ellipseIntersection, arc2Start, arc2);
            if (isOnArc1 && isOnArc2) {
                intersections.push(ellipseIntersection);
            }
        }
        return intersections;
    }

    getTransitTransitIntersections(transit1Start, transit1, transit2Start, transit2) {
        if (transit1.radii) {
            if (transit2.radii) {
                return this.getArcArcIntersections(transit1Start, transit1, transit2Start, transit2);
            }
            else {
                const segment2 = {
                    point1: transit2Start,
                    point2: { x: transit2Start.x + transit2.x, y: transit2Start.y + transit2.y }
                };
                return this.getSegmentArcIntersections(segment2, transit1Start, transit1);
            }
        }
        else {
            const segment1 = {
                point1: transit1Start,
                point2: { x: transit1Start.x + transit1.x, y: transit1Start.y + transit1.y }
            };
            if (transit2.radii) {
                return this.getSegmentArcIntersections(segment1, transit2Start, transit2);
            }
            else {
                const segment2 = {
                    point1: transit2Start,
                    point2: { x: transit2Start.x + transit2.x, y: transit2Start.y + transit2.y }
                };
                const intersection = this.getSegmentSegmentIntersection(segment1, segment2);
                return intersection ? [intersection] : [];
            }
        }
    }

    getTransitPathIntersections(transitStart, transit, pathBounds, path) {
        if (!this.doesTransitIntersectBounds(transitStart, transit, pathBounds)) {
            return [];
        }
        const intersections = [];
        const transitBounds = this.getTransitBounds(transitStart, transit);
        let start2 = path.start;
        const transits = [...path.transits];
        transits.push(this.#getPathClosingTransit(path));
        for (const pathTransit of transits) {
            if (this.doesTransitIntersectBounds(start2, pathTransit, transitBounds)) {
                const transitIntersections = this.getTransitTransitIntersections(transitStart, transit, start2, pathTransit);
                if (transitIntersections.length > 0) {
                    for (const transitIntersection of transitIntersections) {
                        const existingIntersection = intersections.find((point) => point.x == transitIntersection.x && point.y == transitIntersection.y);
                        if (!existingIntersection) {
                            intersections.push(transitIntersection);
                        }
                    }
                }
            }
            if (pathTransit.radii) {
                start2 = { x: start2.x + pathTransit.end.x, y: start2.y + pathTransit.end.y };
            }
            else {
                start2 = { x: start2.x + pathTransit.x, y: start2.y + pathTransit.y };
            }
        }
        return intersections;
    }

    getPathPathIntersections(path1, path2) {
        const intersections = [];
        const path2Bounds = path2.bounds;
        let transitStart = path1.start;
        const transits = [...path1.transits];
        transits.push(this.#getPathClosingTransit(path1));
        for (const transit of transits) {
            const transitIntersections = this.getTransitPathIntersections(transitStart, transit, path2Bounds, path2);
            for (const intersection of transitIntersections) {
                const existingIntersection = intersections.find((point) => point.x == intersection.x && point.y == intersection.y);
                if (!existingIntersection) {
                    intersections.push(intersection);
                }
            }
            transitStart = this.#getTransitEndPoint(transitStart, transit);
        }
        return intersections;
    }

    getIntersectionPathDataList(path1, path2) {
        let fragments = this.#getIntersectionPathFragments(path1, path2);
        fragments = fragments.filter((f) => f.inPath2);
        let path2Fragments = this.#getIntersectionPathFragments(path2, path1);
        path2Fragments = path2Fragments.filter((f) => f.inPath2);
        for (const fragment of path2Fragments) {
            fragments.push(fragment);
        }
        return this.#getPathDataListFromFragments(fragments);
    }

    getUnionPathDataList(path1, path2) {
        const path1Fragments = this.#getIntersectionPathFragments(path1, path2);
        const path2Fragments = this.#getIntersectionPathFragments(path2, path1);
        const fragments = [];
        for (const fragment of path1Fragments) {
            if (!fragment.inPath2) {
                fragments.push(fragment);
            }
        }
        for (const fragment of path2Fragments) {
            if (!fragment.inPath2) {
                fragments.push(fragment);
            }
        }
        const commonFragments = this.#findCommonFragments(path1Fragments, path2Fragments);
        for (const fragment of commonFragments) {
            fragments.push(fragment);
        }
        return this.#getPathDataListFromFragments(fragments);
    }

    getExclusionPathDataList(path1, path2) {
        let fragments = this.#getIntersectionPathFragments(path1, path2);
        fragments = fragments.filter((f) => !f.inPath2);
        let path2Fragments = this.#getIntersectionPathFragments(path2, path1);
        path2Fragments = path2Fragments.filter((f) => f.inPath2);
        for (const fragment of path2Fragments) {
            fragments.push(fragment);
        }
        const pathDataList = this.#getPathDataListFromFragments(fragments);
        return this.#convertExcludedInteriorPathsToClipPaths(pathDataList);
    }

    removeExteriorClipPaths(path) {
        const clipPaths = [];
        const bounds = this.getPathBounds(path.start, path.transits);
        for (const clipPath of path.clipPaths) {
            const isStartInPath = this.isPointInPath(clipPath.start, bounds, path);
            const intersections = this.getPathPathIntersections(clipPath, path);
            if (isStartInPath && intersections.length == 0) {
                clipPaths.push(clipPath);
            }
        }
        path.clipPaths = clipPaths;
    }

    isPointInBounds(point, bounds) {
        return point.x >= bounds.x
            && point.x <= bounds.x + bounds.width
            && point.y >= bounds.y
            && point.y <= bounds.y + bounds.height;
    }

    getSegmentBounds(segment) {
        const left = Math.min(segment.point1.x, segment.point2.x);
        const right = Math.max(segment.point1.x, segment.point2.x);
        const top = Math.min(segment.point1.y, segment.point2.y);
        const bottom = Math.max(segment.point1.y, segment.point2.y);
        return { x: left, y: top, width: right - left, height: bottom - top };
    }

    getArcBounds(start, arc) {
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
        const extrema = [start, end];
        if (this.isEllipsePointOnArc(top, start, arc)) {
            extrema.push(top);
        }
        if (this.isEllipsePointOnArc(left, start, arc)) {
            extrema.push(left);
        }
        if (this.isEllipsePointOnArc(bottom, start, arc)) {
            extrema.push(bottom);
        }
        if (this.isEllipsePointOnArc(right, start, arc)) {
            extrema.push(right);
        }
        const xExtrema = extrema.map(pt => pt.x);
        const yExtrema = extrema.map(pt => pt.y);
        const xBoundsMin = Math.min(...xExtrema);
        const xBoundsMax = Math.max(...xExtrema);
        const yBoundsMin = Math.min(...yExtrema);
        const yBoundsMax = Math.max(...yExtrema);
        return { x: xBoundsMin, y: yBoundsMin, width: xBoundsMax - xBoundsMin, height: yBoundsMax - yBoundsMin };
    }

    getTransitBounds(transitStart, transit) {
        if (transit.radii) {
            return this.getArcBounds(transitStart, transit);
        }
        else {
            const segment = {
                point1: transitStart,
                point2: { x: transitStart.x + transit.x, y: transitStart.y + transit.y }
            };
            return this.getSegmentBounds(segment);
        }
    }

    getPathBounds(start, transits) {
        let transitStart = start;
        let xMin = transitStart.x, xMax = transitStart.x, yMin = transitStart.y, yMax = transitStart.y;
        let transitBounds = null;
        let left = null;
        let top = null;
        for (const transit of transits) {
            if (transit.radii) {
                transitBounds = this.getArcBounds(transitStart, transit);
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

    isPointInPath(point, pathBounds, path, offsetCheck) {
        if (!this.isPointInBounds(point, pathBounds)) {
            return false;
        }

        const topRayPoint = { x: point.x, y: pathBounds.y - 5 };
        let transit = { x: topRayPoint.x - point.x, y: topRayPoint.y - point.y };
        const topRayIntersections = this.getTransitPathIntersections(point, transit, pathBounds, path);
        if (topRayIntersections.length == 0) {
            return false;
        }

        const bottomRayPoint = { x: point.x, y: pathBounds.y + pathBounds.height + 5 };
        transit = { x: bottomRayPoint.x - point.x, y: bottomRayPoint.y - point.y };
        const bottomRayIntersections = this.getTransitPathIntersections(point, transit, pathBounds, path);
        if (bottomRayIntersections.length == 0) {
            return false;
        }

        const leftRayPoint = { x: pathBounds.x - 5, y: point.y };
        transit = { x: leftRayPoint.x - point.x, y: leftRayPoint.y - point.y };
        const leftRayIntersections = this.getTransitPathIntersections(point, transit, pathBounds, path);
        if (leftRayIntersections.length == 0) {
            return false;
        }

        const rightRayPoint = { x: pathBounds.x + pathBounds.width + 5, y: point.y };
        transit = { x: rightRayPoint.x - point.x, y: rightRayPoint.y - point.y };
        const rightRayIntersections = this.getTransitPathIntersections(point, transit, pathBounds, path);
        if (rightRayIntersections.length == 0) {
            return false;
        }

        if (topRayIntersections.length == 1
            && bottomRayIntersections.length == 1
            && leftRayIntersections.length == 1
            && rightRayIntersections.length == 1) {
            return true;
        }

        let isInPath = false;
        if (offsetCheck) {
            isInPath = this.#evenOddIntersectionTest([topRayIntersections, bottomRayIntersections, leftRayIntersections, bottomRayIntersections]);
        }
        else {
            const offsetPoint = { x: point.x + 2, y: point.y + 2 };
            isInPath = this.isPointInPath(offsetPoint, pathBounds, path, true);
        }
        return isInPath;
    }

    isEllipsePointOnArc(point, arcStart, arc) {
        const center = { x: arcStart.x + arc.center.x, y: arcStart.y + arc.center.y };      
        let startAngle = this.#getPointAngle(arcStart, center);
        let endAngle = this.#getPointAngle({ x: arcStart.x + arc.end.x, y: arcStart.y + arc.end.y }, center);
        let pointAngle = this.#getPointAngle(point, center);
        endAngle -= startAngle;
        if (endAngle < 0) {
            endAngle += 360;
        }
        pointAngle -= startAngle;
        if (pointAngle < 0) {
            pointAngle += 360;
        }
        startAngle = 0;
        let inSweep = (pointAngle >= startAngle && pointAngle <= endAngle);
        if (arc.sweepFlag === 1) {
            inSweep = (pointAngle <= startAngle || pointAngle >= endAngle)
        }
        return inSweep;
    }

    doesTransitIntersectBounds(transitStart, transit, bounds) {
        if (this.isPointInBounds(transitStart, bounds)) {
            return true;
        }
        let start2 = { x: bounds.x, y: bounds.y };
        let transit2 = { x: bounds.width, y: 0 }; 
        if (this.getTransitTransitIntersections(transitStart, transit, start2, transit2).length > 0) {
            return true;
        }
        start2 = { x: bounds.x + bounds.width, y: bounds.y };
        transit2 = { x: 0, y: bounds.height };
        if (this.getTransitTransitIntersections(transitStart, transit, start2, transit2).length > 0) {
            return true;
        }
        start2 = { x: bounds.x, y: bounds.y + bounds.height  };
        transit2 = { x: bounds.width, y: 0 };
        if (this.getTransitTransitIntersections(transitStart, transit, start2, transit2).length > 0) {
            return true;
        }
        start2 = { x: bounds.x, y: bounds.y };
        transit2 = { x: 0, y: bounds.height };
        if (this.getTransitTransitIntersections(transitStart, transit, start2, transit2).length > 0) {
            return true;
        }
        return false;
    }

    // helpers
    #getPointAngleToOrigin(point) {
        if (point.x === 0) {
            return (point.y > 0) ? 90 : 270;
        }
        if (point.y == 0) {
            return (point.x) > 0 ? 0 : 180;
        }
        let angle = Math.atan(point.y / point.x);
        if (point.y > 0 && point.x < 0) {
            angle += Math.PI;
        }
        if (point.y < 0 && point.x < 0) {
            angle += Math.PI;
        }
        if (point.y < 0 && point.x > 0) {
            angle += (2 * Math.PI);
        }
        return angle * (180 / Math.PI);
    }

    #getPolynomialRoots(coefficients) {
        const nonZeroCoefficients = coefficients.filter(c => c != 0);
        if (nonZeroCoefficients.length === 2) {
            return this.#getLinearRoots(nonZeroCoefficients);
        }
        if (nonZeroCoefficients.length === 3) {
            return this.#getQuadraticRoots(nonZeroCoefficients);
        }
        if (nonZeroCoefficients.length === 4) {
            return this.#getCubicRoots(nonZeroCoefficients);
        }
        if (nonZeroCoefficients.length === 5) {
            return this.#getQuarticRoots(nonZeroCoefficients);
        }
        throw new Error("invalid coefficients");
    }

    #getLinearRoots(coefficients) {
        const c0 = coefficients[0];
        const linearCoefficients = coefficients.reverse();
        for (let i = 0; i < linearCoefficients.length; i++) {
            linearCoefficients[i] /= c0;
        }
        return [new ComplexNumber(-linearCoefficients[0], 0)];
    }

    #getQuadraticRoots(coefficients) {
        const c0 = coefficients[0];
        const quadraticCoefficients = coefficients.reverse();
        for (let i = 0; i < quadraticCoefficients.length; i++) {
            quadraticCoefficients[i] /= c0;
        }
        const qc0 = quadraticCoefficients[0];
        const qc1 = quadraticCoefficients[1];
        const temp1 = qc1 * qc1 - 4 * qc0;
        const temp2 = Math.sqrt(Math.abs(temp1));
        const complexTemp = (temp1 >= 0) ? new ComplexNumber(temp2, 0) : new ComplexNumber(0, temp2);
        return [
            complexTemp.subtract(qc1).divide(2),
            complexTemp.negate().subtract(qc1).divide(2)
        ];
    }

    #getCubicRoots(coefficients) {
        const c0 = coefficients[0];
        const cubicCoefficients = coefficients.reverse();
        for (let i = 0; i < cubicCoefficients.length; i++) {
            cubicCoefficients[i] /= c0;
        }
        const cc0 = cubicCoefficients[0];
        const cc1 = cubicCoefficients[1];
        const cc2 = cubicCoefficients[2];
        const depressedCubicCoefficients = new Array(cubicCoefficients.length);
        depressedCubicCoefficients[0] = -(9 * cc1 * cc2 - 27 * cc0 - 2 * cc2 * cc2 * cc2) / 27;
        depressedCubicCoefficients[1] = (3 * cc1 - cc2 * cc2) / 3;
        depressedCubicCoefficients[2] = 0;
        depressedCubicCoefficients[3] = 1;
        const roots = [];
        const temp1 = cubicCoefficients[2] / 3;
        if (depressedCubicCoefficients[1] == 0) {
            roots.push(new ComplexNumber(Math.cbrt(depressedCubicCoefficients[0]), 0)).subtract(temp1);
        }
        else {
            const complexTemp1 = new ComplexNumber(-depressedCubicCoefficients[0] / 2, 0);
            const complexTemp2 = new ComplexNumber(depressedCubicCoefficients[1] / 3, 0);
            const complexTemp3 = complexTemp1.subtract(complexTemp1.squared().add(complexTemp2.cubed()).sqrt());
            const cubeRoots = complexTemp3.getRoots(3);
            for (const root of cubeRoots) {
                roots.push(root.subtract(complexTemp2.multiply(root.pow(-1))).subtract(temp1));
            }
        }
        return roots;
    }

    #getQuarticRoots(coefficients) {
        const c0 = coefficients[0];
        const quarticCoefficients = [...coefficients].reverse();
        for (let i = 0; i < quarticCoefficients.length; i++) {
            quarticCoefficients[i] /= c0;
        }
        const qc0 = quarticCoefficients[0];
        const qc1 = quarticCoefficients[1];
        const qc2 = quarticCoefficients[2];
        const qc3 = quarticCoefficients[3];
        const depressedQuarticCoefficients = new Array(quarticCoefficients.length);
        depressedQuarticCoefficients[0] = -(3 * qc3 * qc3 * qc3 * qc3 / 256) + (qc3 * qc3 * qc2 / 16) - (qc3 * qc1 / 4) + qc0;
        depressedQuarticCoefficients[1] = (qc3 * qc3 * qc3 / 8) - (qc3 * qc2 / 2) + qc1;
        depressedQuarticCoefficients[2] = (-3 * qc3 * qc3 / 8) + qc2;
        depressedQuarticCoefficients[3] = 0;
        depressedQuarticCoefficients[4] = 1;
        const dqc0 = depressedQuarticCoefficients[0];
        const dqc1 = depressedQuarticCoefficients[1];
        const dqc2 = depressedQuarticCoefficients[2];
        const dqc3 = depressedQuarticCoefficients[3];
        const dqc4 = depressedQuarticCoefficients[4];
        const temp1 = quarticCoefficients[3] / 4;
        let roots = [];
        if (depressedQuarticCoefficients[1] == 0) {
            if (dqc2 == 0) {
                const complexTemp1 = new ComplexNumber(-dqc0, 0).sqrt().sqrt();
                roots.push(complexTemp1);
                roots.push(complexTemp1.negate());
            }
            else {
                const quadRoots = this.#getQuadraticRoots([dqc4, dqc2, dqc0]);
                for (const root of quadRoots) {
                    const complexTemp2 = root.sqrt();
                    roots.push(complexTemp2.subtract(temp1));
                    roots.push(complexTemp2.negate().subtract(temp1));
                }
            }
        }
        else {
            const cc0 = 4 * dqc2 * dqc0 - dqc1 * dqc1 - dqc3 * dqc3 * dqc0;
            const cc1 = dqc1 * dqc3 - 4 * dqc0;
            const cc2 = -dqc2;
            const cc3 = 1;
            const cubicRoots = this.#getCubicRoots([cc3, cc2, cc1, cc0]);
            let yMin = 1E100;
            let iMin = 1E100;
            for (const root of cubicRoots) {
                if (Math.abs(root.imaginary) < iMin) {
                    yMin = root.real;
                    iMin = Math.abs(root.imaginary);
                }
            }
            const temp2 = yMin - dqc2;
            const temp3 = Math.sqrt(Math.abs(temp2));
            const complexTemp1 = (temp2 >= 0) ? new ComplexNumber(temp3, 0) : new ComplexNumber(0, temp3);
            let complexTemp2;
            let complexTemp3;
            if (complexTemp1.isZero(1E-8)) {
                const temp4 = yMin * yMin - 4 * dqc0;
                const temp5 = Math.sqrt(Math.abs(temp4));
                const complexTemp4 = (temp4 >= 0) ? new ComplexNumber(temp5, 0) : new ComplexNumber(0, temp5);
                complexTemp2 = complexTemp4.sqrt().multiply(2).subtract(2 * dqc2);
                complexTemp3 = complexTemp4.sqrt().multiply(2).negate().subtract(2 * dqc2);
            }
            else {
                complexTemp2 = complexTemp1.squared().add(2 * dqc2).negate().add(complexTemp1.pow(-1).multiply(-2 * dqc1)).sqrt();
                complexTemp3 = complexTemp1.squared().add(2 * dqc2).negate().subtract(complexTemp1.pow(-1).multiply(-2 * dqc1)).sqrt();
            }
            roots.push(complexTemp1.add(complexTemp2).divide(2).subtract(temp1));
            roots.push(complexTemp1.subtract(complexTemp2).divide(2).subtract(temp1));
            roots.push(complexTemp1.negate().add(complexTemp3).divide(2).subtract(temp1));
            roots.push(complexTemp1.negate().subtract(complexTemp3).divide(2).subtract(temp1));
        }
        return roots;
    }

    #getPathClosingTransit(path) {
        let end = path.start;
        for (const transit of path.transits) {
            end = this.#getTransitEndPoint(end, transit);
        }
        return { x: path.start.x - end.x, y: path.start.y - end.y };
    }

    #getTransitEndPoint(start, transit) {
        if (transit.radii) {
            return { x: start.x + transit.end.x, y: start.y + transit.end.y };
        }
        else {
            return { x: start.x + transit.x, y: start.y + transit.y };
        }
    }

    #getIntersectionPathFragments(path1, path2) {
        const transitInfoList = this.#getIntersectionTransitInfo(path1, path2);
        let fragments = [];
        let currentFragment = null;
        let end = null;
        for (const transitInfo of transitInfoList) {
            if (currentFragment?.inPath2 != transitInfo.inPath2) {
                if (currentFragment) {
                    currentFragment.end = end;
                    fragments.push(currentFragment);
                }
                currentFragment = {
                    start: transitInfo.start,
                    transitInfoList: [],
                    inPath2: transitInfo.inPath2
                }
            }
            currentFragment.transitInfoList.push(transitInfo);
            end = transitInfo.end;
        }
        if (currentFragment) {
            currentFragment.end = end
            fragments.push(currentFragment);
        }
        return fragments;
    }

    #getIntersectionTransitInfo(path1, path2) {
        const transitInfoList = [];
        let start = path1.start;
        const path2Bounds = path2.bounds;
        let checkIfInPath = true;
        let inPath2 = false;
        const transits = [...path1.transits];
        transits.push(this.#getPathClosingTransit(path1));
        for (const transit of transits) {
            let subTransits = this.#getTransitPathIntersectionTransits(start, transit, path2Bounds, path2);
            if (subTransits.length > 0) {
                for (const subTransit of subTransits) {
                    transitInfoList.push({
                        start: subTransit.start,
                        end: subTransit.end,
                        transit: subTransit.transit,
                        inPath2: this.#isTransitInPath(subTransit.start, subTransit.transit, path2Bounds, path2)
                    });
                }
                checkIfInPath = true;
            }
            else {
                if (checkIfInPath) {
                    inPath2 = this.#isTransitInPath(start, transit, path2Bounds, path2);
                    checkIfInPath = false;
                }
                transitInfoList.push({
                    start: start,
                    end: this.#getTransitEndPoint(start, transit),
                    transit: transit,
                    inPath2: inPath2
                });
            }
            start = this.#getTransitEndPoint(start, transit);
        }
        return transitInfoList;
    }

    #getTransitPathIntersectionTransits(transitStart, transit, pathBounds, path) {
        let intersections = this.getTransitPathIntersections(transitStart, transit, pathBounds, path);
        if (intersections.length == 0) {
            return [];
        }
        if (transit.radii) {
            intersections = this.#sortArcPointsByAngleFromStart(transitStart, transit, intersections);
        }
        else {
            intersections = this.#sortLinePointsByDistanceFromStart(transitStart, intersections);
        }
        const subTransits = [];
        let subTransitStart = transitStart;
        let tempTransit = transit;
        let transitSplit;
        for (const intersection of intersections) {
            transitSplit = this.#splitTransit(subTransitStart, tempTransit, intersection);
            subTransits.push(transitSplit[0]);
            subTransitStart = transitSplit[1].start;
            tempTransit = transitSplit[1].transit;
        }
        subTransits.push(transitSplit[1]);
        return subTransits;
    }

    #isTransitInPath(start, transit, pathBounds, path) {
        if (transit.radii) {
            const point1 = { x: start.x + transit.end.x, y: start.y };
            const point2 = { x: start.x, y: start.y + transit.end.y };
            const intersections = this.getSegmentArcIntersections({ point1: point1, point2: point2 }, start, transit);
            for (const intersection of intersections) {
                if (this.isPointInPath(intersection, pathBounds, path)) {
                    return true;
                }
            }
            return false;
        }
        else {
            const midPoint = { x: start.x + transit.x / 2, y: start.y + transit.y / 2 };
            return this.isPointInPath(midPoint, pathBounds, path);
        }
    }

    #sortArcPointsByAngleFromStart(start, arc, points) {
        const center = { x: start.x + arc.center.x, y: start.y + arc.center.y };
        let startAngle = this.#getPointAngle(start, center);
        const geometryUtilities = this;
        function compareAngleFromCenter(point1, point2) {
            let pointAngle1 = geometryUtilities.#getPointAngle(point1, center);
            pointAngle1 -= startAngle;
            if (pointAngle1 < 0) {
                pointAngle1 += 360;
            }
            let pointAngle2 = geometryUtilities.#getPointAngle(point2, center);
            pointAngle2 -= startAngle;
            if (pointAngle2 < 0) {
                pointAngle2 += 360;
            }
            if (pointAngle1 < pointAngle2) {
                return -1;
            }
            if (pointAngle1 > pointAngle2) {
                return 1;
            }
            return 0;
        }
        let temp = points.sort(compareAngleFromCenter);
        if (arc.sweepFlag == 1) {
            temp = temp.reverse();
        }
        return temp;
    }

    #getPointAngle(point, center) {
        const pointQuadrant = this.#getQuadrant(point, center);
        let pointAngle = Math.PI / 2;
        if (center.y < point.y) {
            pointAngle = -pointAngle;
        }
        if (point.x != center.x) {
            pointAngle = Math.atan((point.y - center.y) / (point.x - center.x));
        }
        if (pointQuadrant === 1 || pointQuadrant == 4) {
            pointAngle = Math.PI * 2 - pointAngle;
        }
        else {
            pointAngle = Math.PI - pointAngle;
        }
        pointAngle = pointAngle * 180 / Math.PI;
        pointAngle = pointAngle % 360;
        return pointAngle;
    }

    #getQuadrant(point, center) {
        return (point.x <= center.x)
            ? (point.y <= center.y) ? 2 : 3
            : (point.y <= center.y) ? 1 : 4;
    }

    #sortLinePointsByDistanceFromStart(start, points) {
        function compareDistanceFromStart(point1, point2) {
            const distance1 = Math.abs(start.x - point1.x) + Math.abs(start.y - point1.y);
            const distance2 = Math.abs(start.x - point2.x) + Math.abs(start.y - point2.y);
            if (distance1 < distance2) {
                return -1;
            }
            if (distance1 > distance2) {
                return 1;
            }
            return 0;
        }
        return points.sort(compareDistanceFromStart);
    }

    #splitTransit(start, transit, splitPoint) {
        let splitArc = false;
        if (transit.radii) {
            if (transit.largeArcFlag == 1) {
                splitArc = true;
            }
            else {
                const distance = Math.sqrt(Math.abs(start.x - transit.end.x) ** 2 + Math.abs(start.y - transit.end.y) ** 2);
                splitArc = (distance > 10);
            }
        }
        if (splitArc) {
            const arc1 = transit.copy();
            arc1.end = { x: splitPoint.x - start.x, y: splitPoint.y - start.y };
            const arc2 = transit.copy();
            const transit2End = { x: start.x + transit.end.x, y: start.y + transit.end.y };
            const transit2Center = { x: start.x + transit.center.x, y: start.y + transit.center.y };
            arc2.end = { x: transit2End.x - splitPoint.x, y: transit2End.y - splitPoint.y };
            arc2.center = { x: transit2Center.x - splitPoint.x, y: transit2Center.y - splitPoint.y };
            return [
                { start: start, end: splitPoint, transit: arc1 },
                { start: splitPoint, end: transit2End, transit: arc2 }
            ];
        }
        else {
            const transit2End = { x: start.x + transit.x, y: start.y + transit.y };
            return [
                { start: start, end: splitPoint, transit: { x: splitPoint.x - start.x, y: splitPoint.y - start.y } },
                { start: splitPoint, end: transit2End, transit: { x: transit2End.x - splitPoint.x, y: transit2End.y - splitPoint.y } }
            ];
        }
    }

    #getPathDataListFromFragments(fragments) {
        if (fragments.length == 0) {
            return [];
        }
        const pathDataList = [];
        for (let i = 0; i < fragments.length; i++) {
            fragments[i].index = i;
        }
        let currentFragment = fragments[0];
        let currentPathData = {
            start: currentFragment.start,
            transits: []
        };
        let count = 0;
        while (currentFragment) {

            // limit number of intersections
            count++;
            if (count > 100) {
                return [];
            }
            // add current fragment transits
            for (const transitInfo of currentFragment.transitInfoList) {
                currentPathData.transits.push(transitInfo.transit);
            }

            // mark current fragment as traversed
            fragments[currentFragment.index].isTraversed = true;

            // find next fragment
            let lastFragmentEnd = currentFragment.end;
            let nearestFragmentInfo = this.#getNearestFragmentInfo(currentFragment, fragments);
            if (nearestFragmentInfo.index > -1 && nearestFragmentInfo.distance < 5) {
                currentFragment = fragments[nearestFragmentInfo.index];
                if (nearestFragmentInfo.isNearestAtEnd) {
                    currentFragment = this.#reverseFragment(currentFragment);
                }
                let transit = { x: currentFragment.start.x - lastFragmentEnd.x, y: currentFragment.start.y - lastFragmentEnd.y };
                currentPathData.transits.push(transit);
            }
            else {
                currentFragment = fragments.find((f) => !f.isTraversed);
                if (currentFragment) {
                    pathDataList.push(currentPathData);
                    currentPathData = {
                        start: currentFragment.start,
                        transits: []
                    }
                }
            }
        }
        pathDataList.push(currentPathData);
        for (const pathData of pathDataList) {
            const transits = [];
            for (const transit of pathData.transits) {
                if (transit.radii || transit.x != 0 || transit.y != 0) {
                    transits.push(transit);
                }
            }
            pathData.transits = transits;
        }
        return pathDataList;
    }

    #getNearestFragmentInfo(currentFragment, fragments) {
        let minDistance = 10000;
        let index = -1;
        let isNearestAtEnd = null;
        const currentIndex = currentFragment.index;
        const end = currentFragment.end;
        for (let i = 0; i < fragments.length; i++) {
            if (i != currentIndex && !fragments[i].isTraversed) {
                let distance = Math.sqrt((end.x - fragments[i].start.x) ** 2 + (end.y - fragments[i].start.y) ** 2);
                if (distance < minDistance) {
                    minDistance = distance;
                    index = i;
                    isNearestAtEnd = false;
                }
                distance = Math.sqrt((end.x - fragments[i].end.x) ** 2 + (end.y - fragments[i].end.y) ** 2);
                if (distance < minDistance) {
                    minDistance = distance;
                    index = i;
                    isNearestAtEnd = true;
                }
            }
        }
        return { index: index, isNearestAtEnd: isNearestAtEnd, distance: minDistance };
    }

    #reverseFragment(fragment) {
        const transitInfoList = [];
        for (let i = fragment.transitInfoList.length - 1; i > -1; i--) {
            transitInfoList.push(this.#reverseTransitInfo(fragment.transitInfoList[i]));
        }
        return {
            start: fragment.end,
            end: fragment.start,
            index: fragment.index,
            transitInfoList: transitInfoList
        };
    }

    #reverseTransitInfo(transitInfo) {
        return {
            start: transitInfo.end,
            end: transitInfo.start,
            transit: this.#reverseTransit(transitInfo.start, transitInfo.transit)
        }
    }

    #reverseTransit(start, transit) {
        if (transit.radii) {
            const arc = transit.copy();
            const end = { x: start.x + transit.end.x, y: start.y + transit.end.y };
            const center = { x: start.x + transit.center.x, y: start.y + transit.center.y };
            const cdx = end.x - center.x;
            const cdy = end.y - center.y;
            const newEnd = { x: -transit.end.x, y: -transit.end.y };
            const newCenter = { x: -cdx, y: -cdy };
            arc.end = newEnd;
            arc.center = newCenter;
            arc.sweepFlag = transit.sweepFlag == 0 ? 1 : 0;
            return arc;
        }
        else {
            return { x: -transit.x, y: -transit.y };
        }
    }

    #findCommonFragments(path1Fragments, path2Fragments) {
        const commonFragments = [];
        const foundIndices = [];
        const intersectionFragments = [];
        for (const fragment of path1Fragments) {
            if (fragment.inPath2) {
                intersectionFragments.push(fragment);
            }
        }
        for (const fragment of path2Fragments) {
            if (fragment.inPath2) {
                intersectionFragments.push(fragment);
            }
        }
        for (let i = 0; i < intersectionFragments.length; i++) {
            if (!foundIndices.includes(i)) {
                const candidate = intersectionFragments[i];
                let j = intersectionFragments.findIndex((fragment, index) =>
                    (i != index) && this.#areFragmentsEqual(candidate, fragment)
                );
                if (j > -1 && !foundIndices.includes(i) && !foundIndices.includes(j)) {
                    foundIndices.push(i);
                    foundIndices.push(j);
                    commonFragments.push(intersectionFragments[i]);
                }
            }
        }
        return commonFragments;
    }

    #areFragmentsEqual(fragment1, fragment2) {
        if (fragment1.transitInfoList.length != fragment2.transitInfoList.length) {
            return false;
        }
        let startEqual = this.#arePointsEqual(fragment1.start, fragment2.start);
        let endEqual = this.#arePointsEqual(fragment1.end, fragment2.end);
        if (!(startEqual && endEqual)) {
            fragment2 = this.#reverseFragment(fragment2);
            startEqual = this.#arePointsEqual(fragment1.start, fragment2.start);
            endEqual = this.#arePointsEqual(fragment1.end, fragment2.end);
        }
        if (!(startEqual && endEqual)) {
            return false;
        }
        for (let i = 0; i < fragment1.transitInfoList.length; i++) {
            if (!this.#areTransitsEqual(fragment1.transitInfoList[i].transit, fragment2.transitInfoList[i].transit)) {
                return false;
            }
        }
        return true;
    }

    #arePointsEqual(point1, point2, maxDifference) {
        if (!maxDifference) {
            maxDifference = 2; // <-- should be one?
        }
        return (Math.abs(point1.x - point2.x) <= maxDifference) && (Math.abs(point1.y - point2.y) <= maxDifference)
    }

    #areTransitsEqual(transit1, transit2) {
        let transit1IsArc = false;
        if (transit1.radii) {
            transit1IsArc = true;
        }
        let transit2IsArc = false;
        if (transit2.radii) {
            transit2IsArc = true;
        }
        if (transit1IsArc != transit2IsArc) {
            return false;
        }
        if (transit1IsArc) {
            return transit1.end.x == transit2.end.x
                && transit1.end.y == transit2.end.y
                && transit1.center.x == transit2.center.x
                && transit1.center.y == transit2.center.y
                && transit1.radii.x == transit2.radii.x
                && transit1.radii.y == transit2.radii.y
                && transit1.rotationAngle == transit2.rotationAngle
                && transit1.largeArcFlag == transit2.largeArcFlag
                && transit1.sweepFlag == transit2.sweepFlag;
        }
        else {
            return transit1.x == transit2.x
                && transit1.y == transit2.y;
        }
    }

    #evenOddIntersectionTest(intersectionsList) {
        let evens = 0;
        let odds = 0;
        for (const intersections of intersectionsList) {
            if (intersections.length % 2 == 0) {
                evens++;
            }
            else {
                odds++;
            }
        }
        return (odds >= evens);
    } 

    #convertExcludedInteriorPathsToClipPaths(pathDataListIn) {
        const pathDataListWorking = [];
        for (let i = 0; i < pathDataListIn.length; i++) {
            pathDataListIn[i].clipPaths = [];
            pathDataListWorking.push({
                pathData: pathDataListIn[i],
                bounds: this.getPathBounds(pathDataListIn[i].start, pathDataListIn[i].transits),
                index: i,
                isClip: false
            });
        }
        for (const pathDataInfo1 of pathDataListWorking) {
            for (const pathDataInfo2 of pathDataListWorking) {
                if (pathDataInfo1.index != pathDataInfo2.index) {
                    if (this.isPointInPath(pathDataInfo1.pathData.start, pathDataInfo2.bounds, pathDataInfo2.pathData)) {
                        pathDataInfo1.isClip = true;
                        pathDataInfo2.pathData.clipPaths.push(pathDataInfo1.pathData);
                        break;
                    }
                }
            }
        }
        return pathDataListWorking.filter(x => !x.isClip).map(x => x.pathData);
    }
}

class ComplexNumber {

    constructor(real, imaginary) {
        this.real = real;
        this.imaginary = imaginary;
    }

    static fromPolar(mod, arg) {
        return new ComplexNumber(mod * Math.cos(arg), mod * Math.sin(arg));
    }

    static removeDuplicates(inputNumbers, maxDifference) {
        const outputNumbers = [];
        let isDuplicate = false;
        for (const input of inputNumbers) {
            isDuplicate = false;
            for (const output of outputNumbers) {
                if (input.isEqual(output, maxDifference)) {
                    isDuplicate = true;
                    break;
                }
            }
            if (!isDuplicate) {
                outputNumbers.push(input);
            }
        }
        return outputNumbers;
    }

    static removeImaginary(inputNumbers, maxImaginary) {
        const outputNumbers = [];
        for (const input of inputNumbers) {
            if (Math.abs(input.imaginary) < maxImaginary) {
                outputNumbers.push(new ComplexNumber(input.real, 0));
            }
        }
        return outputNumbers;
    }

    abs() {
        return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
    }

    add(n) {
        if (n instanceof ComplexNumber) {
            return new ComplexNumber(this.real + n.real, this.imaginary + n.imaginary);
        }
        return new ComplexNumber(this.real + n, this.imaginary);
    }

    arg() {
        return Math.atan2(this.imaginary, this.real);
    }

    cubed() {
        const real = this.real * this.real * this.real - 3 * this.real * this.imaginary * this.imaginary;
        const imaginary = 3 * this.real * this.real * this.imaginary - this.imaginary * this.imaginary * this.imaginary;
        return new ComplexNumber(real, imaginary);
    }

    divide(n) {
        if (n instanceof ComplexNumber) {
            const absSquared = new ComplexNumber(n.real, n.imaginary).absSquared();
            const real = (this.real * n.real + this.imaginary * n.imaginary) / absSquared;
            const imaginary = (this.imaginary * n.real - this.real * n.imaginary) / absSquared;
            return new ComplexNumber(real, imaginary);
        }
        return new ComplexNumber(this.real / n, this.imaginary / n);
    }

    exp() {
        const temp1 = Math.exp(this.real);
        const temp2 = Math.cos(this.imaginary);
        return new ComplexNumber(0, 1).multiply(Math.sin(this.imaginary)).add(temp2).multiply(temp1);
    }

    getRoots(rootPower) {
        let roots = [];
        if (rootPower >= 2) {
            const temp1 = Math.atan2(this.imaginary, this.real) / rootPower;
            const temp2 = Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
            const temp3 = Math.pow(temp2, 1 / rootPower);
            const temp4 = 2 * Math.PI / rootPower;
            for (let i = 0; i < rootPower; i++) {
                roots.push(ComplexNumber.fromPolar(temp3, temp1 + i * temp4));
            }
        }
        return roots;
    }

    isEqual(complexNumber, maxDifference) {
        return Math.abs(this.real - complexNumber.real) < maxDifference
            && Math.abs(this.imaginary - complexNumber.imaginary) < maxDifference;
    }

    isZero(maxDifference) {
        return (Math.abs(this.real) < maxDifference) && (Math.abs(this.imaginary) < maxDifference);
    }

    log() {
        const real = Math.log(this.abs());
        const imaginary = (this.real < 0 && this.imaginary == 0) ? Math.PI : this.arg();
        return new ComplexNumber(real, imaginary);
    }

    multiply(n) {
        if (n instanceof ComplexNumber) {
            const real = this.real * n.real - this.imaginary * n.imaginary;
            const imaginary = this.real * n.imaginary + this.imaginary * n.real;
            return new ComplexNumber(real, imaginary);
        }
        return new ComplexNumber(this.real * n, this.imaginary * n);
    }

    negate() {
        return new ComplexNumber(-this.real, -this.imaginary);
    }

    pow(power) {
        return this.log().multiply(power).exp();
    }

    sqrt() {
        const abs = this.abs();
        const real = Math.sqrt(0.5 * (abs + this.real));
        let imaginary = Math.sqrt(0.5 * (abs - this.real));
        if (this.imaginary < 0) {
            imaginary *= -1;
        }
        return new ComplexNumber(real, imaginary);
    }

    squared() {
        const real = this.real * this.real - this.imaginary * this.imaginary;
        const imaginary = 2 * this.real * this.imaginary;
        return new ComplexNumber(real, imaginary);
    }

    subtract(n) {
        if (n instanceof ComplexNumber) {
            return new ComplexNumber(this.real - n.real, this.imaginary - n.imaginary);
        }
        return new ComplexNumber(this.real - n, this.imaginary);
    }
   
}

class EllipseCoefficients {

    constructor(a, b, c, d, e, f) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
    }

    static fromEllipse(center, radii, rotationAngle) {
        const radians = -rotationAngle * Math.PI / 180;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const cx = center.x;
        const cy = center.y;
        const xr2 = radii.x ** 2;
        const yr2 = radii.y ** 2;
        const temp1 = cos * cos / xr2 + sin * sin / yr2;
        const temp2 = -2 * cos * sin / xr2 + 2 * cos * sin / yr2;
        const temp3 = sin * sin / xr2 + cos * cos / yr2;
        const a = temp1;
        const b = temp2;
        const c = temp3;
        const d = -(2 * temp1 * cx + temp2 * cy);
        const e = -(temp2 * cx + 2 * temp3 * cy);
        const f = temp1 * cx * cx + temp2 * cx * cy + temp3 * cy * cy - 1;
        return new EllipseCoefficients(a, b, c, d, e, f);
    }

    static elliminateTerm(ellipseCoefficients1, ellipseCoefficients2, coefficient) {
        const coefficient1 = ellipseCoefficients1[coefficient];
        const coefficient2 = ellipseCoefficients2[coefficient];
        if (Number.isFinite(coefficient1) && Number.isFinite(coefficient2)) {  
            const tempCoefficients1 = ellipseCoefficients1.#multiply(coefficient2);
            const tempCoefficients2 = ellipseCoefficients2.#multiply(coefficient1);
            return tempCoefficients1.#subtract(tempCoefficients2);
        }
        return null;
    }

    #multiply(n) {
        if (Number.isFinite(n)) {
            return new EllipseCoefficients(this.a * n, this.b * n, this.c * n, this.d * n, this.e * n, this.f * n);
        }
        return new EllipseCoefficients(this.a, this.b, this.c, this.d, this.e, this.f);
    }

    #subtract(n) {
        if (n) {
            return new EllipseCoefficients(this.a - n.a, this.b - n.b, this.c - n.c, this.d - n.d, this.e - n.e, this.f - n.f);
        }
        return new EllipseCoefficients(this.a, this.b, this.c, this.d, this.e, this.f);
    }

}
