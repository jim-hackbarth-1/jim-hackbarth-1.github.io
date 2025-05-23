﻿
import { GeometryUtilities } from "../references.js";

export class SetUtilities {

    // properties
    #geometryUtilities;
    get geometryUtilities() {
        if (!this.#geometryUtilities) {
            this.#geometryUtilities = new GeometryUtilities();
        }
        return this.#geometryUtilities;
    }

    // methods
    getUnionAll(primaryPaths, secondaryPaths, closedPath) {
        let pathsOut = [];
        let pathsIn = [];
        for (const path of primaryPaths) {
            pathsIn.push(path);
        }
        for (const secondaryPath of secondaryPaths) {
            pathsOut = [];
            for (const pathIn of pathsIn) {
                const unionPaths = this.getUnion(pathIn, secondaryPath, closedPath);
                for (const unionPath of unionPaths) {
                    if (!pathsOut.some(p => this.geometryUtilities.arePointsEqual(p.start, unionPath.start))) {
                        pathsOut.push(unionPath);
                    }
                }
            }
            pathsIn = pathsOut;
        }
        return pathsOut;
    }

    getUnion(pathInfoA, pathInfoB, closedPath) {

        // get bounds
        const boundsA = this.geometryUtilities.getPathBounds(pathInfoA.start, pathInfoA.transits);
        const boundsB = this.geometryUtilities.getPathBounds(pathInfoB.start, pathInfoB.transits);

        // get transits into
        const transitsInfoA = this.#getTransitsIntersectionInfo(pathInfoA, boundsB, pathInfoB, closedPath);
        const transitsInfoB = this.#getTransitsIntersectionInfo(pathInfoB, boundsA, pathInfoA, true);

        // mark shared transits
        this.#markSharedTransitInfos(transitsInfoA, transitsInfoB);

        // get contiguous fragments
        const contiguousFragmentsA = this.#getContiguousFragments(transitsInfoA);
        const contiguousFragmentsB = this.#getContiguousFragments(transitsInfoB);

        // get union fragments
        const contiguousFragments = this.#getUnionFragments(contiguousFragmentsA, contiguousFragmentsB);

        // get new path infos
        let setPathInfos = this.#generatePathInfosFromContiguousFragments(contiguousFragments);

        // identify clip paths
        this.#markClipPaths(setPathInfos);

        // add clip paths
        setPathInfos = this.#getClipPaths(pathInfoA, pathInfoB, setPathInfos);

        // return new path info
        return setPathInfos
    }

    getIntersectionAll(primaryPaths, secondaryPaths, closedPath) {
        const pathsOut = [];
        let unionOfSecondaryPaths = secondaryPaths;
        if (secondaryPaths.length > 1) {
            const array1 = [secondaryPaths[0]];
            const array2 = secondaryPaths.slice(1);
            unionOfSecondaryPaths = this.getUnionAll(array1, array2);
        }
        for (const secondaryPath of unionOfSecondaryPaths) {
            for (const primaryPath of primaryPaths) {
                const intersectionPaths = this.getIntersection(primaryPath, secondaryPath, closedPath);
                for (const intersectionPath of intersectionPaths) {
                    pathsOut.push(intersectionPath);
                }
            }
        }
        return pathsOut;
    }

    getIntersection(pathInfoA, pathInfoB, closedPath) {

        // get bounds
        const boundsA = this.geometryUtilities.getPathBounds(pathInfoA.start, pathInfoA.transits);
        const boundsB = this.geometryUtilities.getPathBounds(pathInfoB.start, pathInfoB.transits);

        // get transits into
        const transitsInfoA = this.#getTransitsIntersectionInfo(pathInfoA, boundsB, pathInfoB, closedPath);
        const transitsInfoB = this.#getTransitsIntersectionInfo(pathInfoB, boundsA, pathInfoA, true);

        // mark shared transits
        this.#markSharedTransitInfos(transitsInfoA, transitsInfoB);

        // get contiguous fragments
        const contiguousFragmentsA = this.#getContiguousFragments(transitsInfoA);
        const contiguousFragmentsB = this.#getContiguousFragments(transitsInfoB);

        // get intersection fragments
        const contiguousFragments = this.#getIntersectionFragments(contiguousFragmentsA, contiguousFragmentsB);

        // get new path infos
        let setPathInfos = this.#generatePathInfosFromContiguousFragments(contiguousFragments);

        // identity clip paths
        this.#markClipPaths(setPathInfos);

        // add clip paths
        setPathInfos = this.#getClipPaths(pathInfoA, pathInfoB, setPathInfos);

        // return new path info
        return setPathInfos
    }

    getExclusionAll(primaryPaths, secondaryPaths, closedPath) {
        let pathsOut = [];
        let pathsIn = [];
        for (const path of primaryPaths) {
            pathsIn.push(path);
        }
        for (const secondaryPath of secondaryPaths) {
            pathsOut = [];
            for (const pathIn of pathsIn) {
                const exclusionPaths = this.getExclusion(pathIn, secondaryPath, closedPath);
                for (const exclusionPath of exclusionPaths) {
                    pathsOut.push(exclusionPath);
                }
            }
            pathsIn = pathsOut;
        }
        return pathsOut;
    }

    getExclusion(pathInfoA, pathInfoB, closedPath) {

        // get bounds
        const boundsA = this.geometryUtilities.getPathBounds(pathInfoA.start, pathInfoA.transits);
        const boundsB = this.geometryUtilities.getPathBounds(pathInfoB.start, pathInfoB.transits);

        // get transits into
        const transitsInfoA = this.#getTransitsIntersectionInfo(pathInfoA, boundsB, pathInfoB, closedPath);
        const transitsInfoB = this.#getTransitsIntersectionInfo(pathInfoB, boundsA, pathInfoA, true);

        // mark shared transits
        this.#markSharedTransitInfos(transitsInfoA, transitsInfoB);

        // get contiguous fragments
        const contiguousFragmentsA = this.#getContiguousFragments(transitsInfoA);
        const contiguousFragmentsB = this.#getContiguousFragments(transitsInfoB);

        // get intersection fragments
        const contiguousFragments = this.#getExclusionFragments(contiguousFragmentsA, contiguousFragmentsB);

        // get new path infos
        let setPathInfos = this.#generatePathInfosFromContiguousFragments(contiguousFragments);

        // identity clip paths
        this.#markClipPaths(setPathInfos);

        // add clip paths
        setPathInfos = this.#getClipPaths(pathInfoA, pathInfoB, setPathInfos);

        // return new path info
        return setPathInfos
    }

    // helpers
    #getTransitsIntersectionInfo(pathInfo, intersectingPathBounds, intersectingPath, addClosingTransit) {

        // get starting info
        let transitsIntersectionInfo = [];
        let start = pathInfo.start;
        let isIntersecting = this.geometryUtilities.isPointInPath(start, intersectingPathBounds, intersectingPath);
        const transits = [...pathInfo.transits];
        if (addClosingTransit) {
            const closingTransit = this.geometryUtilities.getPathClosingTransit(pathInfo);
            if (Math.abs(closingTransit.x) > 2 || Math.abs(closingTransit.y) > 2) {
                transits.push(closingTransit);
            }
        }
        
        // get intersections info
        let testIsIntersecting = false;
        for (const transit of transits) {
            const intersections = this.geometryUtilities.getTransitPathIntersections(start, transit, intersectingPathBounds, intersectingPath);
            const transitInfos = this.#getTransitIntersectionInfo(
                start, isIntersecting, transit, intersectingPathBounds, intersectingPath, intersections, testIsIntersecting);
            for (const transitInfo of transitInfos) {
                transitsIntersectionInfo.push(transitInfo);
            }
            const lastTransitInfo = transitInfos[transitInfos.length - 1];
            start = lastTransitInfo.end;
            isIntersecting = lastTransitInfo.isIntersecting;
            testIsIntersecting = (intersections.length > 0);
        }

        // return intersections info
        return transitsIntersectionInfo;
    }

    #getTransitIntersectionInfo(start, isIntersecting, transit, intersectingPathBounds, intersectingPath, intersections, testIsIntersecting) {
        const end = this.geometryUtilities.getTransitEndPoint(start, transit);
        if ((intersections.length == 0) || (intersections.length == 1 && this.geometryUtilities.arePointsEqual(intersections[0], end))) {
            let isTranitIntersecting = isIntersecting;
            if (testIsIntersecting || transit.radii) {
                isTranitIntersecting = this.#isTransitInPath(start, transit, intersectingPathBounds, intersectingPath);
            }
            return [new TransitInfo(start, transit, isTranitIntersecting)];
        }
        if (transit.radii) {
            intersections = this.#sortArcPointsByAngleFromStart(start, transit, intersections);
        }
        else {
            intersections = this.#sortLinePointsByDistanceFromStart(start, intersections);
        }
        const divisionPoints = [];
        for (const intersection of intersections) {
            const isStart = this.geometryUtilities.arePointsEqual(intersection, start);
            const isEnd = this.geometryUtilities.arePointsEqual(intersection, end);
            const exists = divisionPoints.some(pt => this.geometryUtilities.arePointsEqual(intersection, pt));
            if (!isStart && !isEnd && !exists) {
                divisionPoints.push(intersection);
            }
        }
        return this.#divideTransit(transit, start, end, divisionPoints, intersectingPathBounds, intersectingPath);
    }

    #markSharedTransitInfos(transitsInfoA, transitsInfoB) {
        for (const transitInfoA of transitsInfoA) {
            const transitInfoB = transitsInfoB.find(tib => this.#areTransitInfosEqual(transitInfoA, tib));
            if (transitInfoB) {
                transitInfoA.isShared = true;
                transitInfoB.isShared = true;
            }
        }
    }

    #getContiguousFragments(transitsInfo) {
        const fragments = [];
        let startIndex = 0;
        for (let i = 1; i < transitsInfo.length; i++) {
            const isIntersectingChanged = transitsInfo[startIndex].isIntersecting != transitsInfo[i].isIntersecting;
            const isSharedChanged = transitsInfo[startIndex].isShared != transitsInfo[i].isShared;
            if (isIntersectingChanged || isSharedChanged) {
                fragments.push(new ContiguousFragment(
                    transitsInfo[startIndex].start,
                    transitsInfo.slice(startIndex, i),
                    transitsInfo[startIndex].isIntersecting,
                    transitsInfo[startIndex].isShared));
                startIndex = i;
            }
        }
        fragments.push(new ContiguousFragment(
            transitsInfo[startIndex].start,
            transitsInfo.slice(startIndex, transitsInfo.length),
            transitsInfo[startIndex].isIntersecting,
            transitsInfo[startIndex].isShared));
        return fragments;
    }

    #getUnionFragments(contiguousFragmentsA, contiguousFragmentsB) {
        const fragments = [];
        for (const fragment of contiguousFragmentsA) {
            if (!fragment.isIntersecting) {
                fragments.push(fragment);
            }
        }
        for (const fragment of contiguousFragmentsB) {
            if (!fragment.isIntersecting) {
                fragments.push(fragment);
            }
        }
        return fragments;
    }

    #getIntersectionFragments(contiguousFragmentsA, contiguousFragmentsB) {
        const fragments = [];
        for (const fragment of contiguousFragmentsA) {
            if (fragment.isIntersecting) {
                fragments.push(fragment);
            }
        }
        for (const fragment of contiguousFragmentsB) {
            if (fragment.isIntersecting && !fragment.isShared) {
                fragments.push(fragment);
            }
        }
        if (fragments.length < contiguousFragmentsA.length && fragments.every(f => f.isShared)) {
            return [];
        }
        return fragments;
    }

    #getExclusionFragments(contiguousFragmentsA, contiguousFragmentsB) {
        const fragments = [];
        for (const fragment of contiguousFragmentsA) {
            if (!fragment.isIntersecting || fragment.isShared) {
                fragments.push(fragment);
            }
        }
        for (const fragment of contiguousFragmentsB) {
            if (fragment.isIntersecting && !fragment.isShared) {
                fragments.push(fragment);
            }
        }
        return fragments;
    }

    #generatePathInfosFromContiguousFragments(contiguousFragments) {
        const paths = [];
        let hasUnprocessed = contiguousFragments.some(f => !f.isProcessed);
        while (hasUnprocessed) {
            paths.push(this.#generatePathInfoFromContiguousFragments(contiguousFragments));
            hasUnprocessed = contiguousFragments.some(f => !f.isProcessed);
        }
        return paths;
    }

    #generatePathInfoFromContiguousFragments(contiguousFragments) {
        let nextFragment = contiguousFragments.find(f => !f.isProcessed);
        const start = nextFragment.start;
        let transits = []; 
        let reverse = false;
        while (nextFragment) {
            const tempTransits = this.#getContiguousFragmentTransits(nextFragment, reverse);
            for (const transit of tempTransits) {
                transits.push(transit);
            }
            nextFragment.isProcessed = true;
            const end = reverse ? nextFragment.start : nextFragment.end;
            nextFragment = this.#findNextContiguousFragment(end, contiguousFragments);
            if (nextFragment) {
                const startDistance = Math.abs(end.x - nextFragment.start.x) + Math.abs(end.y - nextFragment.start.y);
                const endDistance = Math.abs(end.x - nextFragment.end.x) + Math.abs(end.y - nextFragment.end.y);
                reverse = (endDistance < startDistance);
            }
        }
        transits = this.#filterNearZeroLengthTransits(transits);
        return new PathInfo(start, transits);
    }

    #getContiguousFragmentTransits(contiguousFragment, reverse) {
        let transitInfos = contiguousFragment.transitInfos;
        if (reverse) {
            transitInfos = [];
            for (let i = contiguousFragment.transitInfos.length - 1; i > -1; i--) {
                const transitInfo = contiguousFragment.transitInfos[i];
                transitInfos.push(new TransitInfo(
                    transitInfo.end, this.#reverseTransit(transitInfo.start, transitInfo.transit), transitInfo.isIntersecting));
            }
        }
        return transitInfos.map(ti => ti.transit);
    }

    #reverseTransit(start, transit) {
        if (transit.radii) {
            const arc = this.#copyArcInfo(transit);
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

    #findNextContiguousFragment(end, contiguousFragments) {
        const candidates = [];
        for (const fragment of contiguousFragments) {
            if (!fragment.isProcessed) {
                const startDistance = Math.abs(end.x - fragment.start.x) + Math.abs(end.y - fragment.start.y);
                const endDistance = Math.abs(end.x - fragment.end.x) + Math.abs(end.y - fragment.end.y);
                const testDistance = Math.min(startDistance, endDistance);
                if (testDistance < 5) {
                    candidates.push({ fragment: fragment, isShared: fragment.isShared, testDistance: testDistance });
                }
            }
        }
        if (candidates.length == 0) {
            return null;
        }
        function sortCandidates(candidate1, candidate2) {
            if (candidate1.isShared == candidate2.isShared) {
                return (candidate1.testDistance > candidate2.testDistance) ? 1 : -1;
            }
            else {
                return candidate1.isShared ? 1 : -1;
            }
        }
        const sortedCandidates = candidates.sort(sortCandidates);
        if (sortedCandidates.length > 1) {
            for (let i = 1; i < sortedCandidates.length; i++) {
                sortedCandidates[i].fragment.isProcessed = true;
            }
        }
        return sortedCandidates[0].fragment;
    }

    #markClipPaths(pathInfos) {
        for (let i = 0; i < pathInfos.length; i++) {
            for (let j = 0; j < pathInfos.length; j++) {
                if (i != j) {
                    if (this.geometryUtilities.isPath1ContainedInPath2(pathInfos[i], pathInfos[j])) {
                        pathInfos[i].isClip = true;
                    }
                }
            }
        }
    }

    #getClipPaths(pathInfoA, pathInfoB, setPathInfos) {
        const pathInfosOut = setPathInfos.filter(pi => !pi.isClip);
        let clipPaths = setPathInfos.filter(pi => pi.isClip);
        if (pathInfoA.clipPaths) {
            for (const clipPath of pathInfoA.clipPaths) {
                clipPaths.push(clipPath);
            }
        }
        if (pathInfoB.clipPaths) {
            for (const clipPath of pathInfoB.clipPaths) {
                clipPaths.push(clipPath);
            }
        }
        let unionOfClipPaths = clipPaths;
        if (clipPaths.length > 1) {
            const array1 = [clipPaths[0]];
            const array2 = clipPaths.slice(1);
            unionOfClipPaths = this.getUnionAll(array1, array2);
        }
        for (const path of pathInfosOut) {
            for (const clipPath of unionOfClipPaths) {
                if (this.geometryUtilities.isPath1ContainedInPath2(clipPath, path)) {
                    path.clipPaths.push(clipPath);
                }
            }
        }
        return pathInfosOut;
    }

    #getTransitDelta(transit) {
        if (transit.radii) {
            return { x: transit.end.x, y: transit.end.y };
        }
        else {
            return { x: transit.x, y: transit.y };
        }
    }

    #sortArcPointsByAngleFromStart(start, arc, points) {
        const center = { x: start.x + arc.center.x, y: start.y + arc.center.y };
        const geometryUtilities = this.geometryUtilities;
        let startAngle = geometryUtilities.getPointAngle(start, center);
        function compareAngleFromCenter(point1, point2) {
            let pointAngle1 = geometryUtilities.getPointAngle(point1, center);
            pointAngle1 -= startAngle;
            if (pointAngle1 < 0) {
                pointAngle1 += 360;
            }
            let pointAngle2 = geometryUtilities.getPointAngle(point2, center);
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

    #divideTransit(transit, start, end, divisionPoints, intersectingPathBounds, intersectingPath) {
        const transitsOut = [];
        let tempStart = start;
        let tempTransit = transit;
        let splits = [];
        for (const divisionPoint of divisionPoints) {
            splits = this.#splitTransit(tempStart, tempTransit, divisionPoint, intersectingPathBounds, intersectingPath);
            const split0 = splits[0];
            transitsOut.push(split0);
            tempStart = split0.end;
            tempTransit = splits[1].transit;
        }
        transitsOut.push(new TransitInfo(
            tempStart, tempTransit, this.#isTransitInPath(tempStart, tempTransit, intersectingPathBounds, intersectingPath)));
        return transitsOut;
    }

    #splitTransit(start, transit, splitPoint, intersectingPathBounds, intersectingPath) {
        let splitArc = false;
        if (transit.radii) {
            const distance = Math.sqrt(Math.abs(start.x - transit.end.x) ** 2 + Math.abs(start.y - transit.end.y) ** 2);
            splitArc = (distance > 10);
        }
        if (splitArc) {
            const arc1 = this.#copyArcInfo(transit);
            arc1.end = { x: splitPoint.x - start.x, y: splitPoint.y - start.y };
            const arc2 = this.#copyArcInfo(transit);
            const transit2End = { x: start.x + transit.end.x, y: start.y + transit.end.y };
            const transit2Center = { x: start.x + transit.center.x, y: start.y + transit.center.y };
            arc2.end = { x: transit2End.x - splitPoint.x, y: transit2End.y - splitPoint.y };
            arc2.center = { x: transit2Center.x - splitPoint.x, y: transit2Center.y - splitPoint.y };
            return [
                new TransitInfo(start, arc1, this.#isTransitInPath(start, arc1, intersectingPathBounds, intersectingPath)),
                new TransitInfo(splitPoint, arc2, this.#isTransitInPath(splitPoint, arc2, intersectingPathBounds, intersectingPath))];
        }
        else {
            const transit2End = { x: start.x + transit.x, y: start.y + transit.y };
            const segment1 = { x: splitPoint.x - start.x, y: splitPoint.y - start.y };
            const segment2 = { x: transit2End.x - splitPoint.x, y: transit2End.y - splitPoint.y };
            return [
                new TransitInfo(start, segment1, this.#isTransitInPath(start, segment1, intersectingPathBounds, intersectingPath)),
                new TransitInfo(splitPoint, segment2, this.#isTransitInPath(splitPoint, segment2, intersectingPathBounds, intersectingPath))
            ];
        }
    }

    #copyArcInfo(arcInfo) {
        return {
            end: arcInfo.end,
            center: arcInfo.center,
            radii: arcInfo.radii,
            rotationAngle: arcInfo.rotationAngle,
            sweepFlag: arcInfo.sweepFlag
        };
    }

    #isTransitInPath(start, transit, intersectingPathBounds, intersectingPath) {
        const end = this.geometryUtilities.getTransitEndPoint(start, transit);
        let testPoint = {
            x: start.x + ((end.x - start.x) / 2),
            y: start.y + ((end.y - start.y) / 2)
        };
        if (transit.radii) {
            const deltaX = Math.abs(end.x - start.x);
            const deltaY = Math.abs(end.y - start.y);
            const bounds = this.geometryUtilities.getTransitBounds(start, transit);
            let segment = {
                point1: { x: testPoint.x, y: bounds.y },
                point2: { x: testPoint.x, y: bounds.y + bounds.height }
            };
            if (deltaY > deltaX) {
                segment = {
                    point1: { x: bounds.x, y: testPoint.y },
                    point2: { x: bounds.x + bounds.width, y: testPoint.y }
                }
            }
            const intersections = this.geometryUtilities.getSegmentArcIntersections(segment, start, transit);
            if (intersections && intersections.length > 0) {
                testPoint = intersections[0];
            }
        }
        return this.geometryUtilities.isPointInPath(testPoint, intersectingPathBounds, intersectingPath);
    }

    #areTransitInfosEqual(transitInfo1, transitInfo2) {
        const areTransitsEqual = this.#areTransitsEqual(transitInfo1.transit, transitInfo2.transit);
        if (areTransitsEqual) {
            const startEqualsStart = this.geometryUtilities.arePointsEqual(transitInfo1.start, transitInfo2.start);
            const startEqualsEnd = this.geometryUtilities.arePointsEqual(transitInfo1.start, transitInfo2.end);
            const endEqualsStart = this.geometryUtilities.arePointsEqual(transitInfo1.end, transitInfo2.start);
            const endEqualsEnd = this.geometryUtilities.arePointsEqual(transitInfo1.end, transitInfo2.end);
            return (startEqualsStart && endEqualsEnd) || (startEqualsEnd && endEqualsStart);
        }
        return false;
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
            if (transit1.rotationAngle != transit2.rotationAngle
                || this.geometryUtilities.arePointsEqual(transit1.radii, transit2.radii)) {
                return false;
            }
            if (this.geometryUtilities.arePointsEqual(transit1.end, transit2.end)
                && this.geometryUtilities.arePointsEqual(transit1.center, transit2.center)
                && transit1.sweepFlag == transit2.sweepFlag) {
                return true;
            }
            const reverseArc = this.#reverseTransit({ x: 0, y: 0 }, transit2);
            if (this.geometryUtilities.arePointsEqual(transit1.end, reverseArc.end)
                && this.geometryUtilities.arePointsEqual(transit1.center, reverseArc.center)
                && transit1.sweepFlag == reverseArc.sweepFlag) {
                return true;
            }
            return false;
        }
        else {
            if (this.geometryUtilities.arePointsEqual(transit1, transit2)) {
                return true;
            }
            if (this.geometryUtilities.arePointsEqual(transit1, this.#reverseTransit({ x: 0, y: 0 }, transit2))) {
                return true;
            }
            return false;
        }
    }

    #filterNearZeroLengthTransits(transits) {
        const transitsOut = [];
        let offsetX = 0;
        let offsetY = 0;
        for (const transit of transits) {
            const delta = this.#getTransitDelta(transit);
            if (Math.abs(delta.x) > 2 || Math.abs(delta.y) > 2) {
                transitsOut.push(transit);
            }
            else {
                offsetX += delta.x;
                offsetY += delta.y;
            }
            if (Math.abs(offsetX) > 2 || Math.abs(offsetY) > 2) {
                transitsOut.push({ x: offsetX, y: offsetY });
                offsetX = 0;
                offsetY = 0;
            }
        }
        return transitsOut;
    }
}

class PathInfo {
    constructor(start, transits) {
        this.start = start;
        this.transits = transits;
        this.isClip = false;
        this.clipPaths = [];
        this.inView = true;
    }
}

class TransitInfo {
    constructor(start, transit, isIntersecting) {
        this.start = start;
        this.transit = transit;
        if (transit.radii) {
            this.end = { x: start.x + transit.end.x, y: start.y + transit.end.y };
        }
        else {
            this.end = { x: start.x + transit.x, y: start.y + transit.y };
        }
        this.isIntersecting = isIntersecting;
        this.isShared = false;
    }
}

class ContiguousFragment {
    constructor(start, transitInfos, isIntersecting, isShared) {
        this.start = start;
        this.transitInfos = transitInfos;
        if (this.transitInfos && this.transitInfos.length > 0) {
            const lastTransitInfo = this.transitInfos[this.transitInfos.length - 1];
            this.end = { x: lastTransitInfo.end.x, y: lastTransitInfo.end.y }; 
        }   
        this.isIntersecting = isIntersecting;
        this.isShared = isShared;
        this.isProcessed = false;
    }
}
