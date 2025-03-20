
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
    setActivityState(point, toggleCurrentSelections) {
        if (toggleCurrentSelections) {
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

    startChange(mapWorker, point, activityState, useSingleSelectionMode) {
        this.selectionStartData = [];
        if (mapWorker?.map) {
            mapWorker.map.startChangeSet();
            const layer = mapWorker.map.getActiveLayer();
            if (layer?.mapItemGroups) {
                for (const mapItemGroup of layer.mapItemGroups) {
                    let bounds = mapItemGroup.bounds;
                    if (mapItemGroup.selectionStatus) {
                        for (const mapItem of mapItemGroup.mapItems) {
                            for (const path of mapItem.paths) {
                                const clipPaths = [];
                                if (path.clipPaths) {
                                    for (const clipPath of path.clipPaths) {
                                        clipPaths.push({
                                            id: clipPath.id,
                                            start: clipPath.start,
                                            transits: clipPath.transits,
                                            rotationAngle: clipPath.rotationAngle
                                        });
                                    }
                                }
                                this.selectionStartData.push({
                                    mapItemGroupId: mapItemGroup.id,
                                    mapItemGroupBounds: bounds,
                                    mapItemId: mapItem.id,
                                    path: path,
                                    startingPathData: {
                                        id: path.id,
                                        start: path.start,
                                        transits: path.transits,
                                        rotationAngle: path.rotationAngle,
                                        clipPaths: clipPaths
                                    }
                                });
                            }
                        }
                    }
                }
                const boundsInfo = this.#getSelectionBoundsInfoForPointAndBoundsType(point, activityState);
                if (boundsInfo) {
                    this.changeReferenceBounds = {
                        mapItemGroupId: boundsInfo.mapItemGroupId,
                        bounds: boundsInfo.selectionBounds.move
                    }
                }
                else {
                    this.changeReferenceBounds = null;
                }
                if (useSingleSelectionMode) {
                    this.selectionStartData = this.selectionStartData.filter(ssd => ssd.mapItemGroupId == boundsInfo?.mapItemGroupId);
                }
            }
        }
    }

    completeChange(mapWorker, changeType) {
        const layer = mapWorker.map.getActiveLayer();
        const changes = [];
        for (const selection of this.selectionStartData) {
            if (selection.path.start.x != selection.startingPathData.start.x || selection.path.start.y != selection.startingPathData.start.y) {
                changes.push({
                    changeType: "Edit",
                    changeObjectType: "Path",
                    propertyName: "start",
                    oldValue: selection.startingPathData.start,
                    newValue: selection.path.start,
                    layerName: layer.name,
                    mapItemGroupId: selection.mapItemGroupId,
                    mapItemId: selection.mapItemId,
                    pathId: selection.path.id
                });
            }
            if (changeType == "Resize" || changeType == "Rotate") {
                changes.push({
                    changeType: "Edit",
                    changeObjectType: "Path",
                    propertyName: "transits",
                    oldValue: selection.startingPathData.transits,
                    newValue: selection.path.transits,
                    layerName: layer.name,
                    mapItemGroupId: selection.mapItemGroupId,
                    mapItemId: selection.mapItemId,
                    pathId: selection.path.id
                });
            }
            if (selection.path.rotationAngle != selection.startingPathData.rotationAngle) {
                changes.push({
                    changeType: "Edit",
                    changeObjectType: "Path",
                    propertyName: "rotationAngle",
                    oldValue: selection.startingPathData.rotationAngle,
                    newValue: selection.path.rotationAngle,
                    layerName: layer.name,
                    mapItemGroupId: selection.mapItemGroupId,
                    mapItemId: selection.mapItemId,
                    pathId: selection.path.id
                });
            }
            if (selection.path.clipPaths) {
                if (selection.path.clipPaths.length != selection.startingPathData.clipPaths.length) {
                    changes.push({
                        changeType: "Edit",
                        changeObjectType: "Path",
                        propertyName: "clipPaths",
                        oldValue: this.#getListData(selection.startingPathData.clipPaths),
                        newValue: this.#getListData(selection.path.clipPaths),
                        layerName: layer.name,
                        mapItemGroupId: selection.mapItemGroupId,
                        mapItemId: selection.mapItemId,
                        pathId: selection.path.id
                    });
                }
                for (const clipPath of selection.path.clipPaths) {
                    const startingClipPathData = selection.startingPathData.clipPaths.find(cp => cp.id == clipPath.id);
                    if (startingClipPathData) {
                        if (clipPath.start.x != startingClipPathData.start.x || clipPath.start.y != startingClipPathData.start.y) {
                            changes.push({
                                changeType: "Edit",
                                changeObjectType: "ClipPath",
                                propertyName: "start",
                                oldValue: startingClipPathData.start,
                                newValue: clipPath.start,
                                layerName: layer.name,
                                mapItemGroupId: selection.mapItemGroupId,
                                mapItemId: selection.mapItemId,
                                pathId: selection.path.id,
                                clipPathId: clipPath.id
                            });
                        }
                        if (changeType == "Resize" || changeType == "Rotate") {
                            changes.push({
                                changeType: "Edit",
                                changeObjectType: "ClipPath",
                                propertyName: "transits",
                                oldValue: startingClipPathData.transits,
                                newValue: clipPath.transits,
                                layerName: layer.name,
                                mapItemGroupId: selection.mapItemGroupId,
                                mapItemId: selection.mapItemId,
                                pathId: selection.path.id,
                                clipPathId: clipPath.id
                            });
                        }
                        if (clipPath.rotationAngle != startingClipPathData.rotationAngle) {
                            changes.push({
                                changeType: "Edit",
                                changeObjectType: "ClipPath",
                                propertyName: "rotationAngle",
                                oldValue: startingClipPathData.rotationAngle,
                                newValue: clipPath.rotationAngle,
                                layerName: layer.name,
                                mapItemGroupId: selection.mapItemGroupId,
                                mapItemId: selection.mapItemId,
                                pathId: selection.path.id,
                                clipPathId: clipPath.id
                            });
                        }
                    }
                }
            }
        }
        const changeSet = mapWorker.createChangeSet(changes);
        mapWorker.map.completeChangeSet(changeSet);
        this.resetSelectionBounds(mapWorker);
    } 

    getSelectionChangeSet(mapWorker, layerName, oldSelections, newSelections) {
        const selectionChanges = [];
        for (const selection of oldSelections) {
            const match = newSelections.find(s => s.mapItemGroupId === selection.mapItemGroupId);
            const selectionStatus = match?.selectionStatus ?? undefined;
            if (!match || selection.selectionStatus != selectionStatus) {
                selectionChanges.push({
                    mapItemGroupId: selection.mapItemGroupId,
                    oldValue: selection.selectionStatus,
                    newValue: selectionStatus
                });
            }
        }
        for (const selection of newSelections) {
            const match = oldSelections.find(s => s.mapItemGroupId === selection.mapItemGroupId);
            const selectionStatus = match?.selectionStatus ?? undefined;
            if (!match || selection.selectionStatus != selectionStatus) {
                if (!selectionChanges.some(change => change.mapItemGroupId == match?.mapItemGroupId)) {
                    selectionChanges.push({
                        mapItemGroupId: selection.mapItemGroupId,
                        oldValue: selectionStatus,
                        newValue: selection.selectionStatus
                    });
                }
            }
        }
        const changes = selectionChanges.map(change => ({
            changeType: "Edit",
            changeObjectType: "MapItemGroup",
            propertyName: "selectionStatus",
            oldValue: change.oldValue,
            newValue: change.newValue,
            layerName: layerName,
            mapItemGroupId: change.mapItemGroupId
        }));
        return mapWorker.createChangeSet(changes);
    }

    move(mapWorker, startPoint, endPoint, useLockMode) {
        let dx = (endPoint.x - startPoint.x) / mapWorker.map.zoom;
        let dy = (endPoint.y - startPoint.y) / mapWorker.map.zoom;
        if (useLockMode) {
            if (Math.abs(dx) > Math.abs(dy)) {
                dy = 0;
            }
            else {
                dx = 0;
            }
        }
        const snapToOverlay = mapWorker.getToolOption("SnapToOverlay").isToggledOn;
        let selectionStartData = this.selectionStartData;
        for (const selection of selectionStartData) {
            const start = { x: selection.startingPathData.start.x + dx, y: selection.startingPathData.start.y + dy }
            let snapDx = 0;
            let snapDy = 0;
            if (snapToOverlay) {
                const selectionBounds = mapWorker.geometryUtilities.getPathBounds(start, selection.startingPathData.transits);
                const topLeft = { x: selectionBounds.x, y: selectionBounds.y };
                const snapPoint = mapWorker.map.overlay.getNearestOverlayPoint(topLeft);
                snapDx = topLeft.x - snapPoint.x;
                snapDy = topLeft.y - snapPoint.y;
            }
            start.x -= snapDx;
            start.y -= snapDy;
            selection.path.start = start;
            for (const clipPath of selection.path.clipPaths) {
                const startDataPath = selection.startingPathData.clipPaths.find(p => p.id == clipPath.id);
                if (startDataPath) {
                    clipPath.start = { x: startDataPath.start.x + dx - snapDx, y: startDataPath.start.y + dy - snapDy };
                }
            }
        }
    }

    moveIncrement(mapWorker, incrementX, incrementY, usePrimarySelectionMode) {
        let dx = incrementX / mapWorker.map.zoom;
        let dy = incrementY / mapWorker.map.zoom;
        const layer = mapWorker.map.getActiveLayer();
        if (layer?.mapItemGroups) {
            for (const mapItemGroup of layer.mapItemGroups) {
                if ((!usePrimarySelectionMode && mapItemGroup.selectionStatus) || (mapItemGroup.selectionStatus == "Primary")) {
                    for (const mapItem of mapItemGroup.mapItems) {
                        for (const path of mapItem.paths) {
                            path.start = { x: path.start.x + dx, y: path.start.y + dy };
                            for (const clipPath of path.clipPaths) {
                                clipPath.start = { x: clipPath.start.x + dx, y: clipPath.start.y + dy };
                            }
                        }
                    }
                }
            }
        }
    }

    resize(mapWorker, startPoint, endPoint, useLockMode) {
        if (!this.changeReferenceBounds) {
            return;
        }
        const snapToOverlay = mapWorker.getToolOption("SnapToOverlay").isToggledOn;
        if (this.activityState === ActivityState.ResizeSE) {
            this.#resizeSEMove(mapWorker, startPoint, endPoint, useLockMode, snapToOverlay);
        }
        if (this.activityState === ActivityState.ResizeS) {
            this.#resizeSMove(mapWorker, startPoint, endPoint, snapToOverlay);
        }
        if (this.activityState === ActivityState.ResizeSW) {
            this.#resizeSWMove(mapWorker, startPoint, endPoint, useLockMode, snapToOverlay);
        }
        if (this.activityState === ActivityState.ResizeW) {
            this.#resizeWMove(mapWorker, startPoint, endPoint, snapToOverlay);
        }
        if (this.activityState === ActivityState.ResizeNW) {
            this.#resizeNWMove(mapWorker, startPoint, endPoint, useLockMode, snapToOverlay);
        }
        if (this.activityState === ActivityState.ResizeN) {
            this.#resizeNMove(mapWorker, startPoint, endPoint, snapToOverlay);
        }
        if (this.activityState === ActivityState.ResizeNE) {
            this.#resizeNEMove(mapWorker, startPoint, endPoint, useLockMode, snapToOverlay);
        }
        if (this.activityState === ActivityState.ResizeE) {
            this.#resizeEMove(mapWorker, startPoint, endPoint, snapToOverlay);
        }
    }

    rotateMove(mapWorker, currentPoint, useLockMode) {
        const referenceBounds = this.changeReferenceBounds;
        if (!referenceBounds) {
            return;
        }
        const referenceCenterOfRotation = {
            x: referenceBounds.bounds.x + (referenceBounds.bounds.width / 2),
            y: referenceBounds.bounds.y + (referenceBounds.bounds.height / 2)
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
        if (useLockMode) {
            let lockTheta = 0;
            let lock = 0;
            let min = 0;
            let max = 0;
            for (let i = 1; i < 8; i++) {
                lock = i * Math.PI / 4;
                min = lock - (Math.PI / 8);
                max = lock + (Math.PI / 8);
                if (theta >= min && theta <= max) {
                    lockTheta = lock;
                }
            }
            theta = lockTheta;
        }
        let selectionStartData = this.selectionStartData;
        for (const selection of selectionStartData) {
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
        let selectionStartData = this.selectionStartData;
        if (selectionStartData) {
            for (const selection of selectionStartData) {
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
        if (!referenceBounds) {
            return;
        }
        const centerOfRotation = {
            x: referenceBounds.bounds.x + (referenceBounds.bounds.width / 2),
            y: referenceBounds.bounds.y + (referenceBounds.bounds.height / 2)
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
                        mapItemGroupId: selectionBounds.mapItemGroup.id,
                        selectionBounds: selectionBounds,
                        boundsType: boundsType
                    };
                }
            }
        }
        return null;
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

    #resizeSEMove(mapWorker, startPoint, endPoint, useLockMode, snapToOverlay) {
        const dx = (endPoint.x - startPoint.x) / mapWorker.map.zoom;
        const dy = (endPoint.y - startPoint.y) / mapWorker.map.zoom;
        let defaultScaleX = (this.changeReferenceBounds.bounds.width + dx) / this.changeReferenceBounds.bounds.width;
        let defaultScaleY = (this.changeReferenceBounds.bounds.height + dy) / this.changeReferenceBounds.bounds.height;
        if (useLockMode) {
            defaultScaleY = defaultScaleX;
        }
        for (const selection of this.selectionStartData) {
            let scaleX = defaultScaleX;
            let scaleY = defaultScaleY;
            if (snapToOverlay) {
                const scaledWidth = selection.mapItemGroupBounds.width * defaultScaleX;
                const scaledHeight = selection.mapItemGroupBounds.height * defaultScaleY;
                const br = { x: selection.mapItemGroupBounds.x + scaledWidth, y: selection.mapItemGroupBounds.y + scaledHeight };
                const overlayPoint = mapWorker.map.overlay.getNearestOverlayPoint(br);
                scaleX = (overlayPoint.x - selection.mapItemGroupBounds.x) / selection.mapItemGroupBounds.width;
                scaleY = (overlayPoint.y - selection.mapItemGroupBounds.y) / selection.mapItemGroupBounds.height;
            }
            this.#scaleSelection(mapWorker, selection, scaleX, scaleY);
            let scaledXRelativeToMig = (selection.startingPathData.start.x - selection.mapItemGroupBounds.x) * scaleX;
            let scaledYRelativeToMig = (selection.startingPathData.start.y - selection.mapItemGroupBounds.y) * scaleY;
            let startX = selection.mapItemGroupBounds.x + scaledXRelativeToMig;
            let startY = selection.mapItemGroupBounds.y + scaledYRelativeToMig;
            selection.path.start = { x: startX, y: startY };
            if (selection.path.clipPaths) {
                for (const clipPath of selection.path.clipPaths) {
                    const startingPathData = selection.startingPathData.clipPaths.find(x => x.id == clipPath.id);
                    scaledXRelativeToMig = (startingPathData.start.x - selection.mapItemGroupBounds.x) * scaleX;
                    scaledYRelativeToMig = (startingPathData.start.y - selection.mapItemGroupBounds.y) * scaleY;
                    startX = selection.mapItemGroupBounds.x + scaledXRelativeToMig;
                    startY = selection.mapItemGroupBounds.y + scaledYRelativeToMig;
                    clipPath.start = { x: startX, y: startY };
                }
            }
        }
    }

    #resizeSMove(mapWorker, startPoint, endPoint, snapToOverlay) {
        const dy = (endPoint.y - startPoint.y) / mapWorker.map.zoom;
        let defaultScaleX = 1;
        let defaultScaleY = (this.changeReferenceBounds.bounds.height + dy) / this.changeReferenceBounds.bounds.height;
        for (const selection of this.selectionStartData) {
            let scaleX = defaultScaleX;
            let scaleY = defaultScaleY;
            if (snapToOverlay) {
                const scaledWidth = selection.mapItemGroupBounds.width * defaultScaleX;
                const scaledHeight = selection.mapItemGroupBounds.height * defaultScaleY;
                const br = { x: selection.mapItemGroupBounds.x + scaledWidth, y: selection.mapItemGroupBounds.y + scaledHeight };
                const overlayPoint = mapWorker.map.overlay.getNearestOverlayPoint(br);
                scaleY = (overlayPoint.y - selection.mapItemGroupBounds.y) / selection.mapItemGroupBounds.height;
            }
            this.#scaleSelection(mapWorker, selection, scaleX, scaleY);
            let scaledXRelativeToMig = (selection.startingPathData.start.x - selection.mapItemGroupBounds.x) * scaleX;
            let scaledYRelativeToMig = (selection.startingPathData.start.y - selection.mapItemGroupBounds.y) * scaleY;
            let startX = selection.mapItemGroupBounds.x + scaledXRelativeToMig;
            let startY = selection.mapItemGroupBounds.y + scaledYRelativeToMig;
            selection.path.start = { x: startX, y: startY };
            if (selection.path.clipPaths) {
                for (const clipPath of selection.path.clipPaths) {
                    const startingPathData = selection.startingPathData.clipPaths.find(x => x.id == clipPath.id);
                    scaledXRelativeToMig = (startingPathData.start.x - selection.mapItemGroupBounds.x) * scaleX;
                    scaledYRelativeToMig = (startingPathData.start.y - selection.mapItemGroupBounds.y) * scaleY;
                    startX = selection.mapItemGroupBounds.x + scaledXRelativeToMig;
                    startY = selection.mapItemGroupBounds.y + scaledYRelativeToMig;
                    clipPath.start = { x: startX, y: startY };
                }
            }
        }
    }

    #resizeSWMove(mapWorker, startPoint, endPoint, useLockMode, snapToOverlay) {
        const dx = (startPoint.x - endPoint.x) / mapWorker.map.zoom;
        const dy = (endPoint.y - startPoint.y) / mapWorker.map.zoom;
        let defaultScaleX = (this.changeReferenceBounds.bounds.width + dx) / this.changeReferenceBounds.bounds.width;
        let defaultScaleY = (this.changeReferenceBounds.bounds.height + dy) / this.changeReferenceBounds.bounds.height;
        if (useLockMode) {
            defaultScaleY = defaultScaleX;
        }
        for (const selection of this.selectionStartData) {
            let scaleX = defaultScaleX;
            let scaleY = defaultScaleY;
            if (snapToOverlay) {
                const scaledWidth = selection.mapItemGroupBounds.width * defaultScaleX;
                const scaledHeight = selection.mapItemGroupBounds.height * defaultScaleY;
                const bl = {
                    x: selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - scaledWidth,
                    y: selection.mapItemGroupBounds.y + scaledHeight
                };
                const overlayPoint = mapWorker.map.overlay.getNearestOverlayPoint(bl);
                scaleX = (selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - overlayPoint.x) / selection.mapItemGroupBounds.width;
                scaleY = (overlayPoint.y - selection.mapItemGroupBounds.y) / selection.mapItemGroupBounds.height;
            }
            this.#scaleSelection(mapWorker, selection, scaleX, scaleY);
            let scaledXRelativeToMig = (selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - selection.startingPathData.start.x) * scaleX;
            let scaledYRelativeToMig = (selection.startingPathData.start.y - selection.mapItemGroupBounds.y) * scaleY;
            let startX = selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - scaledXRelativeToMig;
            let startY = selection.mapItemGroupBounds.y + scaledYRelativeToMig;
            selection.path.start = { x: startX, y: startY };
            if (selection.path.clipPaths) {
                for (const clipPath of selection.path.clipPaths) {
                    const startingPathData = selection.startingPathData.clipPaths.find(x => x.id == clipPath.id);
                    scaledXRelativeToMig = (selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - startingPathData.start.x) * scaleX;
                    scaledYRelativeToMig = (startingPathData.start.y - selection.mapItemGroupBounds.y) * scaleY;
                    startX = selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - scaledXRelativeToMig;
                    startY = selection.mapItemGroupBounds.y + scaledYRelativeToMig;
                    clipPath.start = { x: startX, y: startY };
                }
            }
        }
    }

    #resizeWMove(mapWorker, startPoint, endPoint, snapToOverlay) {
        const dx = (startPoint.x - endPoint.x) / mapWorker.map.zoom;
        let defaultScaleX = (this.changeReferenceBounds.bounds.width + dx) / this.changeReferenceBounds.bounds.width;
        let defaultScaleY = 1;
        for (const selection of this.selectionStartData) {
            let scaleX = defaultScaleX;
            let scaleY = defaultScaleY;
            if (snapToOverlay) {
                const scaledWidth = selection.mapItemGroupBounds.width * defaultScaleX;
                const scaledHeight = selection.mapItemGroupBounds.height * defaultScaleY;
                const bl = {
                    x: selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - scaledWidth,
                    y: selection.mapItemGroupBounds.y + scaledHeight
                };
                const overlayPoint = mapWorker.map.overlay.getNearestOverlayPoint(bl);
                scaleX = (selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - overlayPoint.x) / selection.mapItemGroupBounds.width;
            }
            this.#scaleSelection(mapWorker, selection, scaleX, scaleY);
            let scaledXRelativeToMig = (selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - selection.startingPathData.start.x) * scaleX;
            let scaledYRelativeToMig = (selection.startingPathData.start.y - selection.mapItemGroupBounds.y) * scaleY;
            let startX = selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - scaledXRelativeToMig;
            let startY = selection.mapItemGroupBounds.y + scaledYRelativeToMig;
            selection.path.start = { x: startX, y: startY };
            if (selection.path.clipPaths) {
                for (const clipPath of selection.path.clipPaths) {
                    const startingPathData = selection.startingPathData.clipPaths.find(x => x.id == clipPath.id);
                    scaledXRelativeToMig = (selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - startingPathData.start.x) * scaleX;
                    scaledYRelativeToMig = (startingPathData.start.y - selection.mapItemGroupBounds.y) * scaleY;
                    startX = selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - scaledXRelativeToMig;
                    startY = selection.mapItemGroupBounds.y + scaledYRelativeToMig;
                    clipPath.start = { x: startX, y: startY };
                }
            }
        }
    }

    #resizeNWMove(mapWorker, startPoint, endPoint, useLockMode, snapToOverlay) {
        const dx = (startPoint.x - endPoint.x) / mapWorker.map.zoom;
        const dy = (startPoint.y - endPoint.y) / mapWorker.map.zoom;
        let defaultScaleX = (this.changeReferenceBounds.bounds.width + dx) / this.changeReferenceBounds.bounds.width;
        let defaultScaleY = (this.changeReferenceBounds.bounds.height + dy) / this.changeReferenceBounds.bounds.height;
        if (useLockMode) {
            defaultScaleY = defaultScaleX;
        }
        for (const selection of this.selectionStartData) {
            let scaleX = defaultScaleX;
            let scaleY = defaultScaleY;
            if (snapToOverlay) {
                const scaledWidth = selection.mapItemGroupBounds.width * defaultScaleX;
                const scaledHeight = selection.mapItemGroupBounds.height * defaultScaleY;
                const tl = {
                    x: selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - scaledWidth,
                    y: selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - scaledHeight
                };
                const overlayPoint = mapWorker.map.overlay.getNearestOverlayPoint(tl);
                scaleX = (selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - overlayPoint.x) / selection.mapItemGroupBounds.width;
                scaleY = (selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - overlayPoint.y) / selection.mapItemGroupBounds.height;
            }
            this.#scaleSelection(mapWorker, selection, scaleX, scaleY);
            let scaledXRelativeToMig = (selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - selection.startingPathData.start.x) * scaleX;
            let scaledYRelativeToMig = (selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - selection.startingPathData.start.y) * scaleY;
            let startX = selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - scaledXRelativeToMig;
            let startY = selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - scaledYRelativeToMig;
            selection.path.start = { x: startX, y: startY };
            if (selection.path.clipPaths) {
                for (const clipPath of selection.path.clipPaths) {
                    const startingPathData = selection.startingPathData.clipPaths.find(x => x.id == clipPath.id);
                    scaledXRelativeToMig = (selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - startingPathData.start.x) * scaleX;
                    scaledYRelativeToMig = (selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - startingPathData.start.y) * scaleY;
                    startX = selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - scaledXRelativeToMig;
                    startY = selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - scaledYRelativeToMig;
                    clipPath.start = { x: startX, y: startY };
                }
            }
        }
    }

    #resizeNMove(mapWorker, startPoint, endPoint, snapToOverlay) {
        const dy = (startPoint.y - endPoint.y) / mapWorker.map.zoom;
        let defaultScaleX = 1;
        let defaultScaleY = (this.changeReferenceBounds.bounds.height + dy) / this.changeReferenceBounds.bounds.height;
        for (const selection of this.selectionStartData) {
            let scaleX = defaultScaleX;
            let scaleY = defaultScaleY;
            if (snapToOverlay) {
                const scaledWidth = selection.mapItemGroupBounds.width * defaultScaleX;
                const scaledHeight = selection.mapItemGroupBounds.height * defaultScaleY;
                const tl = {
                    x: selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - scaledWidth,
                    y: selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - scaledHeight
                };
                const overlayPoint = mapWorker.map.overlay.getNearestOverlayPoint(tl);
                scaleY = (selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - overlayPoint.y) / selection.mapItemGroupBounds.height;
            }
            this.#scaleSelection(mapWorker, selection, scaleX, scaleY);
            let scaledXRelativeToMig = (selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - selection.startingPathData.start.x) * scaleX;
            let scaledYRelativeToMig = (selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - selection.startingPathData.start.y) * scaleY;
            let startX = selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - scaledXRelativeToMig;
            let startY = selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - scaledYRelativeToMig;
            selection.path.start = { x: startX, y: startY };
            if (selection.path.clipPaths) {
                for (const clipPath of selection.path.clipPaths) {
                    const startingPathData = selection.startingPathData.clipPaths.find(x => x.id == clipPath.id);
                    scaledXRelativeToMig = (selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - startingPathData.start.x) * scaleX;
                    scaledYRelativeToMig = (selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - startingPathData.start.y) * scaleY;
                    startX = selection.mapItemGroupBounds.x + selection.mapItemGroupBounds.width - scaledXRelativeToMig;
                    startY = selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - scaledYRelativeToMig;
                    clipPath.start = { x: startX, y: startY };
                }
            }
        }
    }

    #resizeNEMove(mapWorker, startPoint, endPoint, useLockMode, snapToOverlay) {
        const dx = (endPoint.x - startPoint.x) / mapWorker.map.zoom;
        const dy = (startPoint.y - endPoint.y) / mapWorker.map.zoom;
        let defaultScaleX = (this.changeReferenceBounds.bounds.width + dx) / this.changeReferenceBounds.bounds.width;
        let defaultScaleY = (this.changeReferenceBounds.bounds.height + dy) / this.changeReferenceBounds.bounds.height;
        if (useLockMode) {
            defaultScaleY = defaultScaleX;
        }
        for (const selection of this.selectionStartData) {
            let scaleX = defaultScaleX;
            let scaleY = defaultScaleY;
            if (snapToOverlay) {
                const scaledWidth = selection.mapItemGroupBounds.width * defaultScaleX;
                const scaledHeight = selection.mapItemGroupBounds.height * defaultScaleY;
                const tr = {
                    x: selection.mapItemGroupBounds.x + scaledWidth,
                    y: selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - scaledHeight
                };
                const overlayPoint = mapWorker.map.overlay.getNearestOverlayPoint(tr);
                scaleX = (overlayPoint.x - selection.mapItemGroupBounds.x) / selection.mapItemGroupBounds.width;
                scaleY = (selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - overlayPoint.y) / selection.mapItemGroupBounds.height;
            }
            this.#scaleSelection(mapWorker, selection, scaleX, scaleY);
            let scaledXRelativeToMig = (selection.startingPathData.start.x - selection.mapItemGroupBounds.x) * scaleX;
            let scaledYRelativeToMig = (selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - selection.startingPathData.start.y) * scaleY;
            let startX = selection.mapItemGroupBounds.x + scaledXRelativeToMig;
            let startY = selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - scaledYRelativeToMig;
            selection.path.start = { x: startX, y: startY };
            if (selection.path.clipPaths) {
                for (const clipPath of selection.path.clipPaths) {
                    const startingPathData = selection.startingPathData.clipPaths.find(x => x.id == clipPath.id);
                    scaledXRelativeToMig = (startingPathData.start.x - selection.mapItemGroupBounds.x) * scaleX;
                    scaledYRelativeToMig = (selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - startingPathData.start.y) * scaleY;
                    startX = selection.mapItemGroupBounds.x + scaledXRelativeToMig;
                    startY = selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - scaledYRelativeToMig;
                    clipPath.start = { x: startX, y: startY };
                }
            }
        }
    }

    #resizeEMove(mapWorker, startPoint, endPoint, snapToOverlay) {
        const dx = (endPoint.x - startPoint.x) / mapWorker.map.zoom;
        let defaultScaleX = (this.changeReferenceBounds.bounds.width + dx) / this.changeReferenceBounds.bounds.width;
        let defaultScaleY = 1;
        for (const selection of this.selectionStartData) {
            let scaleX = defaultScaleX;
            let scaleY = defaultScaleY;
            if (snapToOverlay) {
                const scaledWidth = selection.mapItemGroupBounds.width * defaultScaleX;
                const scaledHeight = selection.mapItemGroupBounds.height * defaultScaleY;
                const tr = {
                    x: selection.mapItemGroupBounds.x + scaledWidth,
                    y: selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - scaledHeight
                };
                const overlayPoint = mapWorker.map.overlay.getNearestOverlayPoint(tr);
                scaleX = (overlayPoint.x - selection.mapItemGroupBounds.x) / selection.mapItemGroupBounds.width;
            }
            this.#scaleSelection(mapWorker, selection, scaleX, scaleY);
            let scaledXRelativeToMig = (selection.startingPathData.start.x - selection.mapItemGroupBounds.x) * scaleX;
            let scaledYRelativeToMig = (selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - selection.startingPathData.start.y) * scaleY;
            let startX = selection.mapItemGroupBounds.x + scaledXRelativeToMig;
            let startY = selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - scaledYRelativeToMig;
            selection.path.start = { x: startX, y: startY };
            if (selection.path.clipPaths) {
                for (const clipPath of selection.path.clipPaths) {
                    const startingPathData = selection.startingPathData.clipPaths.find(x => x.id == clipPath.id);
                    scaledXRelativeToMig = (startingPathData.start.x - selection.mapItemGroupBounds.x) * scaleX;
                    scaledYRelativeToMig = (selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - startingPathData.start.y) * scaleY;
                    startX = selection.mapItemGroupBounds.x + scaledXRelativeToMig;
                    startY = selection.mapItemGroupBounds.y + selection.mapItemGroupBounds.height - scaledYRelativeToMig;
                    clipPath.start = { x: startX, y: startY };
                }
            }
        }
    }

    #canPathBeScaled(path, scaleX, scaleY) {
        if (scaleX < 1 || scaleY < 1) {
            const originalBounds = path.bounds;
            if ((originalBounds.width < 15 && scaleX < 1) || (originalBounds.height < 15 && scaleY < 1)) {
                return false;
            }
        }
        return true;
    }

    #getScaledTransits(transits, scaleX, scaleY, mapWorker) {
        const scaledTransits = [];
        let scaledTransit = null;
        for (const transit of transits) {
            if (transit.radii) {
                scaledTransit = mapWorker.resizeArc(transit, scaleX, scaleY);
            }
            else {
                scaledTransit = { x: transit.x * scaleX, y: transit.y * scaleY };
            }
            scaledTransits.push(scaledTransit);
        }
        return scaledTransits;
    }

    #scaleSelection(mapWorker, selection, scaleX, scaleY) {
        if (this.#canPathBeScaled(selection.path, scaleX, scaleY)) {
            selection.path.transits = this.#getScaledTransits(selection.startingPathData.transits, scaleX, scaleY, mapWorker);
            if (selection.path.clipPaths) {
                for (const clipPath of selection.path.clipPaths) {
                    const startingPathDataClip = selection.startingPathData.clipPaths.find(p => p.id == clipPath.id);
                    if (startingPathDataClip) {
                        if (this.#canPathBeScaled(clipPath, scaleX, scaleY)) {
                            clipPath.transits = this.#getScaledTransits(startingPathDataClip.transits, scaleX, scaleY, mapWorker);
                        }
                    }
                }
            }
        }
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

    #getListData(list) {
        return list ? list.map(x => x.getData ? x.getData() : x) : null;
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
