﻿
export class SelectionUtilities {

    // properties
    #activityState;
    get activityState() {
        return this.#activityState ?? ActivityState.Default;
    }
    set activityState(activityState) {
        this.#activityState = activityState;
    }

    #selectionBounds;
    get selectionBounds() {
        return this.#selectionBounds;
    }
    set selectionBounds(selectionBounds) {
        this.#selectionBounds = selectionBounds;
    }

    #selectionStartData;
    get selectionStartData() {
        return this.#selectionStartData;
    }
    set selectionStartData(selectionStartData) {
        this.#selectionStartData = selectionStartData;
    }

    #changeReferenceBounds;
    get changeReferenceBounds() {
        return this.#changeReferenceBounds;
    }
    set changeReferenceBounds(changeReferenceBounds) {
        this.#changeReferenceBounds = changeReferenceBounds;
    }

    // methods
    setActivityState(point, isCtrlPressed) {
        if (isCtrlPressed) {
            this.activityState = ActivityState.Select;
        }
        else {
            const selectionBoundsInfo = this.getSelectionBoundsInfoForPoint(point);
            this.activityState = selectionBoundsInfo?.boundsType ?? ActivityState.Select;
        }
    }

    getSelectionBoundsInfoForPoint(point) {
        return this.#getSelectionBoundsInfoForPointAndBoundsType(point, ActivityState.Rotate)
            ?? this.#getSelectionBoundsInfoForPointAndBoundsType(point, ActivityState.ResizeNW)
            ?? this.#getSelectionBoundsInfoForPointAndBoundsType(point, ActivityState.ResizeN)
            ?? this.#getSelectionBoundsInfoForPointAndBoundsType(point, ActivityState.ResizeNE)
            ?? this.#getSelectionBoundsInfoForPointAndBoundsType(point, ActivityState.ResizeE)
            ?? this.#getSelectionBoundsInfoForPointAndBoundsType(point, ActivityState.ResizeSE)
            ?? this.#getSelectionBoundsInfoForPointAndBoundsType(point, ActivityState.ResizeS)
            ?? this.#getSelectionBoundsInfoForPointAndBoundsType(point, ActivityState.ResizeSW)
            ?? this.#getSelectionBoundsInfoForPointAndBoundsType(point, ActivityState.ResizeW)
            ?? this.#getSelectionBoundsInfoForPointAndBoundsType(point, ActivityState.Move);
    }

    resetSelectionBounds(mapWorker) {
        this.selectionBounds = [];
        if (mapWorker?.renderingContext && mapWorker?.map) {
            const layer = mapWorker.map.getActiveLayer();
            if (layer) {
                this.selectionBounds = layer.getSelectionBounds(mapWorker.map);
            }
        }
    }

    startChange(mapWorker, point) {
        this.selectionStartData = [];
        if (mapWorker?.map) {
            mapWorker.map.startChange();
            const layer = mapWorker.map.getActiveLayer();
            if (layer?.mapItemGroups) {
                for (const mapItemGroup of layer.mapItemGroups) {
                    let bounds = mapItemGroup.getBounds();
                    if (mapItemGroup.selectionStatus) {
                        for (const mapItem of mapItemGroup.mapItems) {
                            for (const path of mapItem.paths) {
                                this.selectionStartData.push(this.#getSelectionStartPathData(mapItemGroup.id, bounds, mapItem.id, path));
                            }
                        }
                    }
                }
                this.changeReferenceBounds = this.#getChangeReferenceBounds(point);
            }
        }
    }

    completeChange(mapWorker, changeType) {
        const layer = mapWorker.map.getActiveLayer();
        const change = mapWorker.createChange({
            changeObjectType: "Layer",
            changeObjectRef: layer.name,
            changeType: changeType,
            changeData: this.selectionStartData.map(s => ({ mapItemGroupId: s.mapItemGroupId, mapItemId: s.mapItemId, pathId: s.path.id, start: s.startingPathData }))
        });
        mapWorker.map.completeChange(change);
        this.resetSelectionBounds(mapWorker);
    }

    move(mapWorker, startPoint, endPoint) {
        const dx = (endPoint.x - startPoint.x) / mapWorker.map.zoom;
        const dy = (endPoint.y - startPoint.y) / mapWorker.map.zoom;
        for (const selection of this.selectionStartData) {
            selection.path.start = { x: selection.startingPathData.start.x + dx, y: selection.startingPathData.start.y + dy };
            for (const clipPath of selection.path.clipPaths) {
                const startDataPath = selection.startingPathData.clipPaths.find(p => p.id == clipPath.id);
                if (startDataPath) {
                    clipPath.start = { x: startDataPath.start.x + dx, y: startDataPath.start.y + dy };
                }
            }
        }
    }

    resize(mapWorker, startPoint, endPoint) {
        if (this.activityState === ActivityState.ResizeSE) {
            this.#resizeSEMove(mapWorker, startPoint, endPoint);
        }
        if (this.activityState === ActivityState.ResizeS) {
            this.#resizeSMove(mapWorker, startPoint, endPoint);
        }
        if (this.activityState === ActivityState.ResizeSW) {
            this.#resizeSWMove(mapWorker, startPoint, endPoint);
        }
        if (this.activityState === ActivityState.ResizeW) {
            this.#resizeWMove(mapWorker, startPoint, endPoint);
        }
        if (this.activityState === ActivityState.ResizeNW) {
            this.#resizeNWMove(mapWorker, startPoint, endPoint);
        }
        if (this.activityState === ActivityState.ResizeN) {
            this.#resizeNMove(mapWorker, startPoint, endPoint);
        }
        if (this.activityState === ActivityState.ResizeNE) {
            this.#resizeNEMove(mapWorker, startPoint, endPoint);
        }
        if (this.activityState === ActivityState.ResizeE) {
            this.#resizeEMove(mapWorker, startPoint, endPoint);
        }
    }

    rotateDown(mapWorker, point) {
        this.selectionStartData = [];
        if (mapWorker?.map) {
            mapWorker.map.startChange();
            const layer = mapWorker.map.getActiveLayer();
            if (layer?.mapItemGroups) {
                for (const mapItemGroup of layer.mapItemGroups) {
                    let bounds = mapItemGroup.getBounds();
                    if (mapItemGroup.selectionStatus) {
                        for (const mapItem of mapItemGroup.mapItems) {
                            for (const path of mapItem.paths) {
                                this.selectionStartData.push(this.#getSelectionStartPathData(mapItemGroup.id, bounds, mapItem.id, path));
                            }
                        }
                    }
                }
                const boundsInfo = this.#getSelectionBoundsInfoForPointAndBoundsType(point, ActivityState.Rotate);
                this.changeReferenceBounds = boundsInfo.selectionBounds.move;
            }
        }
    }

    rotateMove(mapWorker, currentPoint) {
        const referenceBounds = this.changeReferenceBounds;
        const referenceCenterOfRotation = {
            x: referenceBounds.x + (referenceBounds.width / 2),
            y: referenceBounds.y + (referenceBounds.height / 2)
        };
        let theta = (currentPoint.x < referenceCenterOfRotation.x) ? (Math.PI / 2) : (3 * Math.PI / 2);
        if (referenceCenterOfRotation.y != currentPoint.y) {
            theta = Math.atan((referenceCenterOfRotation.x - currentPoint.x) / (referenceCenterOfRotation.y - currentPoint.y));
        }
        const quadrant = (currentPoint.x <= referenceCenterOfRotation.x)
            ? (currentPoint.y <= referenceCenterOfRotation.y) ? 2 : 3
            : (currentPoint.y <= referenceCenterOfRotation.y) ? 1 : 4;
        if (quadrant == 3 || quadrant == 4) {
            theta += Math.PI;
        }
        if (quadrant == 1) {
            theta += (Math.PI * 2);
        }
        theta = theta % (Math.PI * 2);
        const thetaDegrees = theta * (180 / Math.PI);
        for (const selection of this.selectionStartData) {
            const bounds = selection.mapItemGroupBounds;
            const centerOfRotation = { x: bounds.x + (bounds.width / 2), y: bounds.y + (bounds.height / 2) };
            this.#rotatePath(selection.path, theta, centerOfRotation, selection.startingPathData, mapWorker);
            for (const clipPath of selection.path.clipPaths) {
                const startDataPath = selection.startingPathData.clipPaths.find(p => p.id == clipPath.id);
                if (startDataPath) {
                    this.#rotatePath(clipPath, theta, centerOfRotation, startDataPath, mapWorker);
                }
            }
        }
    }

    drawArcsRadii(mapWorker) {
        const lineScale = 1 / mapWorker.map.zoom;
        mapWorker.renderingContext.strokeStyle = "green";
        mapWorker.renderingContext.lineWidth = 1 * lineScale;
        mapWorker.renderingContext.setLineDash([4 * lineScale, 4 * lineScale]);
        if (this.selectionStartData) {
            for (const selection of this.selectionStartData) {
                let transitStart = selection.path.start;
                let arcCount = 0;
                for (const transit of selection.path.transits) {
                    if (transit.radii) {
                        arcCount++;
                        if (arcCount < 2) {
                            this.#drawRadii(mapWorker, transitStart, transit);
                        }
                        transitStart = { x: transitStart.x + transit.end.x, y: transitStart.y + transit.end.y };
                    }
                    else {
                        transitStart = { x: transitStart.x + transit.x, y: transitStart.y + transit.y };
                    }
                }
            }
        }
    }

    drawRotationIndicator(mapWorker, currentPoint) {
        const referenceBounds = this.changeReferenceBounds;
        const centerOfRotation = {
            x: referenceBounds.x + (referenceBounds.width / 2),
            y: referenceBounds.y + (referenceBounds.height / 2)
        };
        const line = new Path2D(`M ${currentPoint.x},${currentPoint.y} L ${centerOfRotation.x},${centerOfRotation.y}`);
        const lineScale = 1 / mapWorker.map.zoom;
        const radius = 5 * lineScale;
        const circle = new Path2D(`M ${centerOfRotation.x},${centerOfRotation.y} m 0,${-radius} a ${radius} ${radius} 0 0 0 0 ${2 * radius} a ${radius} ${radius} 0 0 0 0 ${-2 * radius} z`);
        mapWorker.renderingContext.setLineDash([5 * lineScale, 5 * lineScale]);
        mapWorker.renderingContext.strokeStyle = "dimgray";
        mapWorker.renderingContext.lineWidth = 3 * lineScale;
        mapWorker.renderingContext.stroke(line);
        mapWorker.renderingContext.stroke(circle);
        mapWorker.renderingContext.strokeStyle = "lightyellow";
        mapWorker.renderingContext.lineWidth = 1 * lineScale;
        mapWorker.renderingContext.stroke(line);
    }

    removeExteriorClipPaths(mapWorker) {
        for (const selection of this.selectionStartData) {
            mapWorker.geometryUtilities.removeExteriorClipPaths(selection.path);
        }
    }

    // helpers
    #getSelectionBoundsInfoForPointAndBoundsType(point, boundsType) {
        if (this.selectionBounds) {
            for (const selectionBounds of this.selectionBounds) {
                const bounds = this.#getBoundsToCheck(selectionBounds, boundsType);
                if (bounds
                    && point.x >= bounds.x
                    && point.x <= bounds.x + bounds.width
                    && point.y >= bounds.y
                    && point.y <= bounds.y + bounds.height) {
                    return {
                        selectionBounds: selectionBounds,
                        boundsType: boundsType
                    };
                }
            }
        }
        return null;
    }

    #getChangeReferenceBounds(point) {
        const boundsInfo = this.#getSelectionBoundsInfoForPointAndBoundsType(point, ActivityState.Move);
        return boundsInfo.selectionBounds.move;
    }

    #getSelectionStartPathData(mapItemGroupId, mapItemGroupBounds, mapItemId, path) {
        const clipPaths = [];
        for (const clipPath of path.clipPaths) {
            clipPaths.push({
                id: clipPath.id,
                start: clipPath.start,
                transits: clipPath.transits
            });
        }
        return {
            mapItemGroupId: mapItemGroupId,
            mapItemGroupBounds: mapItemGroupBounds,
            mapItemId: mapItemId,
            path: path,
            startingPathData: {
                start: path.start,
                transits: path.transits,
                clipPaths: clipPaths
            }
        };
    }

    #rotatePath(path, theta, centerOfRotation, startingPathData, mapWorker) {
        const xStart = startingPathData.start.x - centerOfRotation.x;
        const yStart = startingPathData.start.y - centerOfRotation.y;
        const xStartRotated = centerOfRotation.x + xStart * Math.cos(theta) + yStart * Math.sin(theta);
        const yStartRotated = centerOfRotation.y + yStart * Math.cos(theta) - xStart * Math.sin(theta);
        path.start = { x: xStartRotated, y: yStartRotated };
        const thetaDegrees = theta * (180 / Math.PI);
        let pathRotationAngle = startingPathData.rotationAngle - thetaDegrees;
        if (pathRotationAngle < 0) {
            pathRotationAngle += 360;
        }
        pathRotationAngle = pathRotationAngle % 360;
        path.rotationAngle = pathRotationAngle;
        const transits = [];
        let rotatedTransit = null;
        for (const transit of startingPathData.transits) {
            if (transit.radii) {
                rotatedTransit = mapWorker.rotateArc(transit, theta);
            }
            else {
                rotatedTransit = {
                    x: transit.x * Math.cos(theta) + transit.y * Math.sin(theta),
                    y: transit.y * Math.cos(theta) - transit.x * Math.sin(theta)
                };
            }
            transits.push(rotatedTransit);
        }
        path.transits = transits;
    }

    #resizeSEMove(mapWorker, startPoint, endPoint) {
        const dx = (endPoint.x - startPoint.x) / mapWorker.map.zoom;
        const dy = (endPoint.y - startPoint.y) / mapWorker.map.zoom;
        const scaleX = (this.changeReferenceBounds.width + dx) / this.changeReferenceBounds.width;
        const scaleY = (this.changeReferenceBounds.height + dy) / this.changeReferenceBounds.height;
        for (const selection of this.selectionStartData) {
            if (this.#canPathBeScaled(selection.path, scaleX, scaleY)) {
                const offset = this.#resizePathSE(selection.path, scaleX, scaleY, selection.startingPathData, mapWorker);
                for (const clipPath of selection.path.clipPaths) {
                    const startDataPath = selection.startingPathData.clipPaths.find(p => p.id == clipPath.id);
                    if (startDataPath) {
                        this.#resizePathSE(clipPath, scaleX, scaleY, startDataPath, mapWorker, offset);
                    }
                }
            }
        }
    }

    #resizePathSE(path, scaleX, scaleY, startingPathData, mapWorker, offset) {
        const originalBounds = path.getBounds();
        path.transits = this.#getScaledTransits(startingPathData.transits, scaleX, scaleY, mapWorker, "SE");
        if (!offset) {
            const newBounds = path.getBounds();
            const boundsDx = newBounds.x - originalBounds.x;
            const boundsDy = newBounds.y - originalBounds.y;
            offset = { x: boundsDx, y: boundsDy };
        }
        path.start = { x: path.start.x - offset.x, y: path.start.y - offset.y };
        return offset;
    }

    #resizeSMove(mapWorker, startPoint, endPoint) {
        const dy = (endPoint.y - startPoint.y) / mapWorker.map.zoom;
        const scaleX = 1;
        const scaleY = (this.changeReferenceBounds.height + dy) / this.changeReferenceBounds.height;
        for (const selection of this.selectionStartData) {
            if (this.#canPathBeScaled(selection.path, scaleX, scaleY)) {
                const offset = this.#resizePathS(selection.path, scaleX, scaleY, selection.startingPathData, mapWorker);
                for (const clipPath of selection.path.clipPaths) {
                    const startDataPath = selection.startingPathData.clipPaths.find(p => p.id == clipPath.id);
                    if (startDataPath) {
                        this.#resizePathS(clipPath, scaleX, scaleY, startDataPath, mapWorker, offset);
                    }
                }
            }
        }
    }

    #resizePathS(path, scaleX, scaleY, startingPathData, mapWorker, offset) {
        const originalBounds = path.getBounds();
        path.transits = this.#getScaledTransits(startingPathData.transits, scaleX, scaleY, mapWorker, "S");
        if (!offset) {
            const newBounds = path.getBounds();
            const boundsDy = newBounds.y - originalBounds.y;
            offset = { x: 0, y: boundsDy };
        }
        path.start = { x: path.start.x, y: path.start.y - offset.y };
        return offset;
    }

    #resizeSWMove(mapWorker, startPoint, endPoint) {
        const dx = (startPoint.x - endPoint.x) / mapWorker.map.zoom;
        const dy = (endPoint.y - startPoint.y) / mapWorker.map.zoom;
        const scaleX = (this.changeReferenceBounds.width + dx) / this.changeReferenceBounds.width;
        const scaleY = (this.changeReferenceBounds.height + dy) / this.changeReferenceBounds.height;
        for (const selection of this.selectionStartData) {
            if (this.#canPathBeScaled(selection.path, scaleX, scaleY)) {
                const offset = this.#resizePathSW(selection.path, scaleX, scaleY, selection.startingPathData, mapWorker);
                for (const clipPath of selection.path.clipPaths) {
                    const startDataPath = selection.startingPathData.clipPaths.find(p => p.id == clipPath.id);
                    if (startDataPath) {
                        this.#resizePathSW(clipPath, scaleX, scaleY, startDataPath, mapWorker, offset);
                    }
                }
            }
        }
    }

    #resizePathSW(path, scaleX, scaleY, startingPathData, mapWorker, offset) {
        const originalBounds = path.getBounds();
        path.transits = this.#getScaledTransits(startingPathData.transits, scaleX, scaleY, mapWorker, "SW");
        if (!offset) {
            const newBounds = path.getBounds();
            const boundsDx = (newBounds.x + newBounds.width) - (originalBounds.x + originalBounds.width);
            const boundsDy = newBounds.y - originalBounds.y;
            offset = { x: boundsDx, y: boundsDy };
        }
        path.start = { x: path.start.x - offset.x, y: path.start.y - offset.y };
        return offset;
    }

    #resizeWMove(mapWorker, startPoint, endPoint) {
        const dx = (startPoint.x - endPoint.x) / mapWorker.map.zoom;
        const scaleX = (this.changeReferenceBounds.width + dx) / this.changeReferenceBounds.width;
        const scaleY = 1;
        for (const selection of this.selectionStartData) {
            if (this.#canPathBeScaled(selection.path, scaleX, scaleY)) {
                const offset = this.#resizePathW(selection.path, scaleX, scaleY, selection.startingPathData, mapWorker);
                for (const clipPath of selection.path.clipPaths) {
                    const startDataPath = selection.startingPathData.clipPaths.find(p => p.id == clipPath.id);
                    if (startDataPath) {
                        this.#resizePathW(clipPath, scaleX, scaleY, startDataPath, mapWorker, offset);
                    }
                }
            }
        }
    }

    #resizePathW(path, scaleX, scaleY, startingPathData, mapWorker, offset) {
        const originalBounds = path.getBounds();
        path.transits = this.#getScaledTransits(startingPathData.transits, scaleX, scaleY, mapWorker, "W");
        if (!offset) {
            const newBounds = path.getBounds();
            const boundsDx = (newBounds.x + newBounds.width) - (originalBounds.x + originalBounds.width);
            const boundsDy = 0;
            offset = { x: boundsDx, y: boundsDy };
        }
        path.start = { x: path.start.x - offset.x, y: path.start.y };
        return offset;
    }

    #resizeNWMove(mapWorker, startPoint, endPoint) {
        const dx = (startPoint.x - endPoint.x) / mapWorker.map.zoom;
        const dy = (startPoint.y - endPoint.y) / mapWorker.map.zoom;
        const scaleX = (this.changeReferenceBounds.width + dx) / this.changeReferenceBounds.width;
        const scaleY = (this.changeReferenceBounds.height + dy) / this.changeReferenceBounds.height;
        for (const selection of this.selectionStartData) {
            if (this.#canPathBeScaled(selection.path, scaleX, scaleY)) {
                const offset = this.#resizePathNW(selection.path, scaleX, scaleY, selection.startingPathData, mapWorker);
                for (const clipPath of selection.path.clipPaths) {
                    const startDataPath = selection.startingPathData.clipPaths.find(p => p.id == clipPath.id);
                    if (startDataPath) {
                        this.#resizePathNW(clipPath, scaleX, scaleY, startDataPath, mapWorker, offset);
                    }
                }
            }
        }
    }

    #resizePathNW(path, scaleX, scaleY, startingPathData, mapWorker, offset) {
        const originalBounds = path.getBounds();
        path.transits = this.#getScaledTransits(startingPathData.transits, scaleX, scaleY, mapWorker, "NW");
        if (!offset) {
            const newBounds = path.getBounds();
            const boundsDx = (newBounds.x + newBounds.width) - (originalBounds.x + originalBounds.width);
            const boundsDy = (newBounds.y + newBounds.height) - (originalBounds.y + originalBounds.height);
            offset = { x: boundsDx, y: boundsDy };
        }
        path.start = { x: path.start.x - offset.x, y: path.start.y - offset.y };
        return offset;
    }

    #resizeNMove(mapWorker, startPoint, endPoint) {
        const dy = (startPoint.y - endPoint.y) / mapWorker.map.zoom;
        const scaleX = 1;
        const scaleY = (this.changeReferenceBounds.height + dy) / this.changeReferenceBounds.height;
        for (const selection of this.selectionStartData) {
            if (this.#canPathBeScaled(selection.path, scaleX, scaleY)) {
                const offset = this.#resizePathN(selection.path, scaleX, scaleY, selection.startingPathData, mapWorker);
                for (const clipPath of selection.path.clipPaths) {
                    const startDataPath = selection.startingPathData.clipPaths.find(p => p.id == clipPath.id);
                    if (startDataPath) {
                        this.#resizePathN(clipPath, scaleX, scaleY, startDataPath, mapWorker, offset);
                    }
                }
            }
        }
    }

    #resizePathN(path, scaleX, scaleY, startingPathData, mapWorker, offset) {
        const originalBounds = path.getBounds();
        path.transits = this.#getScaledTransits(startingPathData.transits, scaleX, scaleY, mapWorker, "N");
        if (!offset) {
            const newBounds = path.getBounds();
            const boundsDy = (newBounds.y + newBounds.height) - (originalBounds.y + originalBounds.height);
            offset = { x: 0, y: boundsDy };
        }
        path.start = { x: path.start.x, y: path.start.y - offset.y };
        return offset;
    }

    #resizeNEMove(mapWorker, startPoint, endPoint) {
        const dx = (endPoint.x - startPoint.x) / mapWorker.map.zoom;
        const dy = (startPoint.y - endPoint.y) / mapWorker.map.zoom;
        const scaleX = (this.changeReferenceBounds.width + dx) / this.changeReferenceBounds.width;
        const scaleY = (this.changeReferenceBounds.height + dy) / this.changeReferenceBounds.height;
        for (const selection of this.selectionStartData) {
            if (this.#canPathBeScaled(selection.path, scaleX, scaleY)) {
                const offset = this.#resizePathNE(selection.path, scaleX, scaleY, selection.startingPathData, mapWorker);
                for (const clipPath of selection.path.clipPaths) {
                    const startDataPath = selection.startingPathData.clipPaths.find(p => p.id == clipPath.id);
                    if (startDataPath) {
                        this.#resizePathNE(clipPath, scaleX, scaleY, startDataPath, mapWorker, offset);
                    }
                }
            }
        }
    }

    #resizePathNE(path, scaleX, scaleY, startingPathData, mapWorker, offset) {
        const originalBounds = path.getBounds();
        path.transits = this.#getScaledTransits(startingPathData.transits, scaleX, scaleY, mapWorker, "NE");
        if (!offset) {
            const newBounds = path.getBounds();
            const boundsDx = newBounds.x - originalBounds.x;
            const boundsDy = (newBounds.y + newBounds.height) - (originalBounds.y + originalBounds.height);
            offset = { x: boundsDx, y: boundsDy };
        }
        path.start = { x: path.start.x - offset.x, y: path.start.y - offset.y };
        return offset;
    }

    #resizeEMove(mapWorker, startPoint, endPoint) {
        const dx = (endPoint.x - startPoint.x) / mapWorker.map.zoom;
        const scaleX = (this.changeReferenceBounds.width + dx) / this.changeReferenceBounds.width;
        const scaleY = 1;
        for (const selection of this.selectionStartData) {
            if (this.#canPathBeScaled(selection.path, scaleX, scaleY)) {
                const offset = this.#resizePathE(selection.path, scaleX, scaleY, selection.startingPathData, mapWorker);
                for (const clipPath of selection.path.clipPaths) {
                    const startDataPath = selection.startingPathData.clipPaths.find(p => p.id == clipPath.id);
                    if (startDataPath) {
                        this.#resizePathE(clipPath, scaleX, scaleY, startDataPath, mapWorker, offset);
                    }
                }
            }
        }
    }

    #resizePathE(path, scaleX, scaleY, startingPathData, mapWorker, offset) {
        const originalBounds = path.getBounds();
        path.transits = this.#getScaledTransits(startingPathData.transits, scaleX, scaleY, mapWorker, "E");
        if (!offset) {
            const newBounds = path.getBounds();
            const boundsDx = newBounds.x - originalBounds.x;
            offset = { x: boundsDx, y: 0 };
        }
        path.start = { x: path.start.x - offset.x, y: path.start.y };
        return offset;
    }

    #canPathBeScaled(path, scaleX, scaleY) {
        if (scaleX < 1 || scaleY < 1) {
            const originalBounds = path.getBounds();
            if ((originalBounds.width < 15 && scaleX < 1) || (originalBounds.height < 15 && scaleY < 1)) {
                return false;
            }
            if (path.clipPaths) {
                for (const clipPath of path.clipPaths) {
                    if (!this.#canPathBeScaled(clipPath, scaleX, scaleY)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    #getScaledTransits(transits, scaleX, scaleY, mapWorker, resizeDirection) {
        const scaledTransits = [];
        let scaledTransit = null;
        for (const transit of transits) {
            if (transit.radii) {
                scaledTransit = mapWorker.resizeArc(transit, scaleX, scaleY, resizeDirection);
            }
            else {
                scaledTransit = { x: transit.x * scaleX, y: transit.y * scaleY };
            }
            scaledTransits.push(scaledTransit);
        }
        return scaledTransits;
    }

    #drawRadii(mapWorker, start, arc) {
        let theta = arc.rotationAngle * (Math.PI / 180);
        if (theta < 0) {
            theta += (Math.PI * 2);
        }
        theta = theta % (Math.PI * 2);
        const rxX = arc.radii.x * Math.cos(theta);
        const rxY = arc.radii.x * Math.sin(theta);
        const ryX = arc.radii.y * Math.sin(theta);
        const ryY = arc.radii.y * Math.cos(theta);
        let pt1 = { x: start.x + arc.center.x + rxX, y: start.y + arc.center.y + rxY };
        let pt2 = { x: start.x + arc.center.x - rxX, y: start.y + arc.center.y - rxY };
        let pt3 = { x: start.x + arc.center.x + ryX, y: start.y + arc.center.y - ryY };
        let pt4 = { x: start.x + arc.center.x - ryX, y: start.y + arc.center.y + ryY };
        const radius1Path = new Path2D(`M ${pt1.x},${pt1.y} L ${pt2.x},${pt2.y}`);
        const radius2Path = new Path2D(`M ${pt3.x},${pt3.y} L ${pt4.x},${pt4.y}`);
        mapWorker.renderingContext.stroke(radius1Path);
        mapWorker.renderingContext.stroke(radius2Path);
    }

    #getBoundsToCheck(selectionBounds, boundsType) {
        if (selectionBounds) {
            if (boundsType === ActivityState.Rotate) {
                return selectionBounds.rotate;
            }
            if (boundsType === ActivityState.ResizeNW) {
                return selectionBounds.resizeNW;
            }
            if (boundsType === ActivityState.ResizeN) {
                return selectionBounds.resizeN;
            }
            if (boundsType === ActivityState.ResizeNE) {
                return selectionBounds.resizeNE;
            }
            if (boundsType === ActivityState.ResizeE) {
                return selectionBounds.resizeE;
            }
            if (boundsType === ActivityState.ResizeSE) {
                return selectionBounds.resizeSE;
            }
            if (boundsType === ActivityState.ResizeS) {
                return selectionBounds.resizeS;
            }
            if (boundsType === ActivityState.ResizeSW) {
                return selectionBounds.resizeSW;
            }
            if (boundsType === ActivityState.ResizeW) {
                return selectionBounds.resizeW;
            }
            if (boundsType === ActivityState.Move) {
                return selectionBounds.move;
            }
        }
        return null;
    }
}

/** @readonly @enum {string} */
const ActivityState = {
    Default: "Default",
    Select: "Select",
    Move: "Move",
    ResizeN: "ResizeN",
    ResizeNE: "ResizeNE",
    ResizeE: "ResizeE",
    ResizeSE: "ResizeSE",
    ResizeS: "ResizeS",
    ResizeSW: "ResizeSW",
    ResizeW: "ResizeW",
    ResizeNW: "ResizeNW",
    Rotate: "Rotate"
};
