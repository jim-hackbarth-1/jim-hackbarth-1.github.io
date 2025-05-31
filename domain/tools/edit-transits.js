
export function createToolModel() {
    return new EditTransitsTool();
}

class EditTransitsTool {

    // fields
    #mapWorker;
    #cursor;
    #pointDown;
    #points;
    #path;
    #selectionUtilities;
    #isArrowPressed;
    #moveIncrementIteration;
    #isLockModeOn;
    #isToggleSelectionModeOn;
    #isAlternateSelectionModeOn;
    #isSingleSelectionModeOn;
    #bounds;
    #moveTransitMode;
    #boundsItem;
    #isSnapToOverlayModeOn;
    #isMoveCaptionModeOn;

    // methods
    async onActivate(mapWorker) {
        this.#mapWorker = mapWorker;
        if (this.#mapWorker.map) {
            this.#mapWorker.map.addEventListener("ChangeEvent", this.handleMapChange);
            this.#mapWorker.map.addEventListener("AfterRenderEvent", this.handleAfterRenderEvent);
        }
        this.#selectionUtilities = this.#mapWorker.createSelectionUtilities();
        this.#cursor = "Default";
        this.#isArrowPressed = false;
        this.#moveIncrementIteration = 0;
        this.#isToggleSelectionModeOn = false;
        this.#moveTransitMode = false;
        this.#initializeToolOptions();  
        await this.#displayTransitEndpoints();
    }

    async onApplyToolOption(toolOptionInfo) {
        this.#updateToolOptionValue(toolOptionInfo.name, toolOptionInfo.value, false);
    }

    async handleClientEvent(clientEvent) {
        const eventData = clientEvent?.eventData;
        switch (clientEvent?.eventType) {
            case "pointerdown":
                this.#onPointerDown(eventData);
                break;
            case "pointermove":
                await this.#onPointerMove(eventData);
                break;
            case "pointerup":
                await this.#onPointerUp(eventData);
                break;
            case "keydown":
                await this.#onKeyDown(eventData);
                break;
            case "keyup":
                this.#onKeyUp(eventData);
                break;
        }
    }

    handleMapChange = async (change) => {
        this.#selectionUtilities.selectionBounds = null;
    }

    handleAfterRenderEvent = async (change) => {
        await this.#displayTransitEndpoints(true);
    }

    async onCursorChange(cursor) {
        this.#cursor = cursor;
    }

    // helpers
    #updateToolOptionValue(name, value, notifyMapWorker) {
        if (name == "AlternateSelectionMode") {
            this.#isAlternateSelectionModeOn = value;
        }
        if (name == "LockMode") {
            this.#isLockModeOn = value;
        }
        if (name == "SnapToOverlay") {
            this.#isSnapToOverlayModeOn = value;
        }
        if (name == "SingleSelectionMode") {
            this.#isSingleSelectionModeOn = value;
        }
        if (name == "MoveCaptionMode") {
            this.#isMoveCaptionModeOn = value;
        }
        if (notifyMapWorker) {
            this.#mapWorker.setToolOptionValue(name, value);
        }
    }

    #initializeToolOptions() {
        this.#mapWorker.initializeToolOptions(["AlternateSelectionMode", "LockMode", "SingleSelectionMode", "SnapToOverlay", "MoveCaptionMode"]);
        this.#isAlternateSelectionModeOn = this.#mapWorker.getToolOption("AlternateSelectionMode").isToggledOn;
        this.#isLockModeOn = this.#mapWorker.getToolOption("LockMode").isToggledOn;
        this.#isSingleSelectionModeOn = this.#mapWorker.getToolOption("SingleSelectionMode").isToggledOn;
        this.#isSnapToOverlayModeOn = this.#mapWorker.getToolOption("SnapToOverlay").isToggledOn;
        this.#isMoveCaptionModeOn = this.#mapWorker.getToolOption("MoveCaptionMode").isToggledOn;
    }

    #onPointerDown(eventData) {
        if (eventData && eventData.button === 0) {
            this.#pointDown = { x: eventData.offsetX, y: eventData.offsetY };
            this.#points = [];
            const transformedPoint = this.#transformCanvasPoint(eventData.offsetX, eventData.offsetY);
            const bounds = this.#getBoundsForPoint(transformedPoint);
            if (bounds) {
                this.#moveTransitMode = true;
                this.#startChange(bounds);
            }
            else {
                this.#moveTransitMode = false;
                this.#selectionUtilities.setActivityState(transformedPoint, this.#isAltSelectModeOn());
                if (this.#selectionUtilities.activityState === "Select") {
                    this.#selectDown(eventData);
                }
                if (this.#selectionUtilities.activityState === "Move"
                    || this.#selectionUtilities.activityState.startsWith("Resize")) {
                    this.#selectionUtilities.startChange(this.#mapWorker, transformedPoint, "Move", this.#isSingleSelectionModeOn);
                }
                if (this.#selectionUtilities.activityState === "Rotate") {
                    this.#selectionUtilities.startChange(this.#mapWorker, transformedPoint, "Rotate", this.#isSingleSelectionModeOn);
                }
            }
        }
    }

    async #onPointerMove(eventData) {
        let displayTransitEndpoints = false;
        let drawArcsRadii = false;
        let drawRotationIndicator = false;
        let rotatePoint = null;
        if (eventData) {
            if (this.#moveTransitMode) {
                await this.#moveTransitEndpoint(eventData);
            }
            else {
                const currentPoint = { x: eventData.offsetX, y: eventData.offsetY };
                if (this.#selectionUtilities.activityState === "Default") {
                    this.#setCursor(eventData);
                }
                if (this.#selectionUtilities.activityState === "Select") {
                    this.#selectMove(eventData);
                }
                if (this.#selectionUtilities.activityState === "Move") {
                    this.#selectionUtilities.move(this.#mapWorker, this.#pointDown, currentPoint, this.#isLockModeOn, this.#isMoveCaptionModeOn);
                    displayTransitEndpoints = true;
                }
                if (this.#selectionUtilities.activityState.startsWith("Resize")) {
                    this.#selectionUtilities.resize(this.#mapWorker, this.#pointDown, currentPoint, this.#isLockModeOn);
                    displayTransitEndpoints = true;
                    drawArcsRadii = true;
                }
                if (this.#selectionUtilities.activityState === "Rotate") {
                    rotatePoint = this.#transformCanvasPoint(eventData.offsetX, eventData.offsetY);
                    this.#selectionUtilities.rotateMove(this.#mapWorker, rotatePoint, this.#isLockModeOn);
                    displayTransitEndpoints = true;
                    drawRotationIndicator = true;
                    drawArcsRadii = true;
                }
            }
        }
        if (displayTransitEndpoints) {
            await this.#displayTransitEndpoints(false, true);
        }
        if (drawRotationIndicator && rotatePoint) {
            this.#selectionUtilities.drawRotationIndicator(this.#mapWorker, rotatePoint);
        }
        if (drawArcsRadii) {
            this.#selectionUtilities.drawArcsRadii(this.#mapWorker);
        }
    }

    async #onPointerUp(eventData) {
        if (eventData) {
            if (this.#moveTransitMode) {
                this.#completeChange();
            }
            else {
                if (this.#selectionUtilities.activityState === "Select") {
                    this.#selectUp(eventData);
                }
                if (this.#selectionUtilities.activityState === "Move") {
                    this.#selectionUtilities.completeChange(this.#mapWorker, "Move");
                }
                if (this.#selectionUtilities.activityState.startsWith("Resize")) {
                    this.#selectionUtilities.removeExteriorClipPaths(this.#mapWorker);
                    this.#selectionUtilities.completeChange(this.#mapWorker, "Resize");
                }
                if (this.#selectionUtilities.activityState === "Rotate") {
                    this.#selectionUtilities.completeChange(this.#mapWorker, "Rotate");
                }
            }  
        }
        this.#moveTransitMode = false;
        this.#selectionUtilities.activityState = "Default";
        await this.#displayTransitEndpoints();
    }

    async #onKeyDown(eventData) {
        if (eventData.key == "Shift" || eventData.key == "Control" || eventData.key == "Alt") {
            this.#isToggleSelectionModeOn = true;
        }
        if (eventData.key == "ArrowLeft") {
            await this.#moveIncrement(eventData, -1, 0);
        }
        if (eventData.key == "ArrowRight") {
            await this.#moveIncrement(eventData, 1, 0);
        }
        if (eventData.key == "ArrowUp") {
            await this.#moveIncrement(eventData, 0, -1);
        }
        if (eventData.key == "ArrowDown") {
            await this.#moveIncrement(eventData, 0, 1);
        }
        if (eventData.altKey && eventData.key?.toLowerCase() == "a" && !eventData.repeat) {
            this.#updateToolOptionValue("AlternateSelectionMode", !this.#isAlternateSelectionModeOn, true);
        }
        if (eventData.altKey && eventData.key?.toLowerCase() == "o" && !eventData.repeat) {
            this.#updateToolOptionValue("SnapToOverlay", !this.#isSnapToOverlayModeOn, true);
        }
        if (eventData.altKey && eventData.key?.toLowerCase() == "l" && !eventData.repeat) {
            this.#updateToolOptionValue("LockMode", !this.#isLockModeOn, true);
        }
        if (eventData.altKey && eventData.key?.toLowerCase() == "s" && !eventData.repeat) {
            this.#updateToolOptionValue("SingleSelectionMode", !this.#isSingleSelectionModeOn, true);
        }
        if (eventData.altKey && eventData.key?.toLowerCase() == "c" && !eventData.repeat) {
            this.#updateToolOptionValue("MoveCaptionMode", !this.#isMoveCaptionModeOn, true);
        }
    }

    #onKeyUp(eventData) {
        if (eventData.key == "Shift" || eventData.key == "Control" || eventData.key == "Alt") {
            this.#isToggleSelectionModeOn = false;
        }
        if (eventData.key?.startsWith("Arrow")) {
            this.#moveIncrementIteration = 0;
            this.#isArrowPressed = false;
        }
    }

    #transformCanvasPoint(x, y) {
        const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
        const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
        return this.#mapWorker.geometryUtilities.transformPoint({ x: x, y: y }, scale, translation);
    }

    #transformMapPoint(x, y) {
        const scale = { x: this.#mapWorker.map.zoom, y: this.#mapWorker.map.zoom };
        const translation = { x: this.#mapWorker.map.pan.x, y: this.#mapWorker.map.pan.y };
        return {
            x: (x + translation.x) * scale.x,
            y: (y + translation.y) * scale.y
        };
    }

    #setCursor(eventData) {
        if (!this.#selectionUtilities.selectionBounds) {
            this.#selectionUtilities.resetSelectionBounds(this.#mapWorker);
        }
        const point = this.#transformCanvasPoint(eventData.offsetX, eventData.offsetY);
        const bounds = this.#getBoundsForPoint(point);
        if (bounds) {
            if (this.#cursor !== "ResizeAll") {
                this.#mapWorker.postMessage({ messageType: "ChangeCursor", data: { cursor: "ResizeAll" } });
            }
            return;
        }
        const selectionBoundsInfo = this.#selectionUtilities.getSelectionBoundsInfoForPoint(point);
        if (selectionBoundsInfo?.boundsType) {
            if (this.#cursor !== selectionBoundsInfo.boundsType) {
                this.#mapWorker.postMessage({ messageType: "ChangeCursor", data: { cursor: selectionBoundsInfo.boundsType } });
            }
        }
        else {
            if (this.#cursor !== "Default") {
                this.#mapWorker.postMessage({ messageType: "ChangeCursor", data: { cursor: "Default" } });
            }
        }
    }

    #selectDown(eventData) {
        this.#points.push({ x: eventData.offsetX, y: eventData.offsetY });
        this.#mapWorker.renderingContext.resetTransform();
        this.#mapWorker.renderingContext.restore();
        this.#path = new Path2D();
        this.#path.moveTo(eventData.offsetX, eventData.offsetY);
    }

    #selectMove(eventData) {
        this.#drawSelectionLine(eventData.offsetX, eventData.offsetY);
        this.#points.push({ x: eventData.offsetX, y: eventData.offsetY });
    }

    #selectUp(eventData) {
        this.#drawSelectionLine(eventData.offsetX, eventData.offsetY);
        this.#drawSelectionLine(this.#pointDown.x, this.#pointDown.y);
        this.#points.push({ x: eventData.offsetX, y: eventData.offsetY });
        const layer = this.#mapWorker.map.getActiveLayer();
        const oldSelections = layer.mapItemGroups
            .filter(mig => mig.selectionStatus)
            .map(mig => ({ mapItemGroupId: mig.id, selectionStatus: mig.selectionStatus }));
        this.#mapWorker.map.startChangeSet();
        if (this.#mapWorker.map) {
            if (this.#points.length < 4) {
                this.#selectByPoints();
            }
            else {
                this.#selectByPath();
            }
        }
        const newSelections = layer.mapItemGroups
            .filter(mig => mig.selectionStatus)
            .map(mig => ({ mapItemGroupId: mig.id, selectionStatus: mig.selectionStatus }));
        const changeSet = this.#selectionUtilities.getSelectionChangeSet(this.#mapWorker, layer.name, oldSelections, newSelections);
        this.#mapWorker.map.completeChangeSet(changeSet);
        this.#selectionUtilities.resetSelectionBounds(this.#mapWorker);
    }

    #selectByPoints() {
        const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
        const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
        const points = this.#points.map(pt => this.#mapWorker.geometryUtilities.transformPoint(pt, scale, translation));
        const layer = this.#mapWorker.map.getActiveLayer();
        layer.selectByPoints(this.#mapWorker.renderingContext, this.#mapWorker.map, points, this.#isAltSelectModeOn());
    }

    #selectByPath() {
        const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
        const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
        const start = this.#mapWorker.geometryUtilities.transformPoint(this.#pointDown, scale, translation);
        const points = this.#points.map(pt => this.#mapWorker.geometryUtilities.transformPoint(pt, scale, translation));
        let x = start.x;
        let y = start.y;
        let xMin = x, xMax = x, yMin = y, yMax = y;
        for (const point of points) {
            if (point.x < xMin) {
                xMin = point.x;
            }
            if (point.x > xMax) {
                xMax = point.x;
            }
            if (point.y < yMin) {
                yMin = point.y;
            }
            if (point.y > yMax) {
                yMax = point.y;
            }
        }
        const selectionBounds = { x: xMin, y: yMin, width: xMax - xMin, height: yMax - yMin };
        const transits = [];
        let lastPoint = start;
        for (const point of points) {
            transits.push({ x: point.x - lastPoint.x, y: point.y - lastPoint.y });
            lastPoint = point;
        }
        const selectionPath = {
            start: start,
            transits: transits
        };
        const layer = this.#mapWorker.map.getActiveLayer();
        layer.selectByPath(this.#mapWorker.geometryUtilities, selectionBounds, selectionPath, this.#isAltSelectModeOn(), true);
    }

    #drawSelectionLine(x, y) {
        this.#path.lineTo(x, y);
        this.#mapWorker.strokeSelectionPath(this.#path);
    }

    async #moveIncrement(eventData, dx, dy) {
        this.#isArrowPressed = true;
        if (eventData.repeat) {
            dx = dx * 10;
            dy = dy * 10;
            this.#moveIncrementIteration += 10;
        }
        else {
            this.#moveIncrementIteration = 0;
        }
        let maxIteration = Math.min(this.#mapWorker.map.currentViewPort.width, this.#mapWorker.map.currentViewPort.height);
        maxIteration = maxIteration * this.#mapWorker.map.zoom;
        if (this.#moveIncrementIteration < maxIteration && this.#isArrowPressed) {
            this.#selectionUtilities.moveIncrement(this.#mapWorker, dx, dy, this.#isSingleSelectionModeOn, this.#isMoveCaptionModeOn);
            await this.#displayTransitEndpoints(false, true);
        }
    }

    async #displayTransitEndpoints(doNotPreRenderMap, quickRender) {
        if (!doNotPreRenderMap) {
            await this.#mapWorker.renderMap({ quickRender: quickRender });
        }
        this.#bounds = this.#getBounds();
        for (const boundsItem of this.#bounds) {
            this.#displaybounds(boundsItem.bounds);
        }
    }

    #getBounds() {
        const bounds = [];
        const layer = this.#mapWorker.map.getActiveLayer();
        if (layer.mapItemGroups) {
            for (const mapItemGroup of layer.mapItemGroups) {
                if (mapItemGroup.selectionStatus) {
                    for (const mapItem of mapItemGroup.mapItems) {
                        for (const path of mapItem.paths) {
                            let point = { x: path.start.x, y: path.start.y };
                            let transitIndex = -1;
                            bounds.push(this.#getBoundsItem(mapItemGroup, mapItem, path, null, point, transitIndex));
                            for (const transit of path.transits) {
                                if (transit.radii) {
                                    point.x += transit.end.x;
                                    point.y += transit.end.y;
                                }
                                else {
                                    point.x += transit.x;
                                    point.y += transit.y;
                                }
                                transitIndex++;
                                bounds.push(this.#getBoundsItem(mapItemGroup, mapItem, path, null, point, transitIndex));
                            }
                            if (path.clipPaths) {
                                for (const clipPath of path.clipPaths) {
                                    point = { x: clipPath.start.x, y: clipPath.start.y };
                                    transitIndex = -1;
                                    bounds.push(this.#getBoundsItem(mapItemGroup, mapItem, path, clipPath, point, transitIndex));
                                    for (const transit of clipPath.transits) {
                                        if (transit.radii) {
                                            point.x += transit.end.x;
                                            point.y += transit.end.y;
                                        }
                                        else {
                                            point.x += transit.x;
                                            point.y += transit.y;
                                        }
                                        transitIndex++;
                                        bounds.push(this.#getBoundsItem(mapItemGroup, mapItem, path, clipPath, point, transitIndex));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return bounds;
    }

    #getBoundsItem(mapItemGroup, mapItem, path, clipPath, point, transitIndex) {
        const size = 10 / this.#mapWorker.map.zoom;
        const bounds = {
            x: point.x - size / 2,
            y: point.y - size / 2,
            width: size,
            height: size
        };
        const clipPaths = [];
        if (path.clipPaths) {
            for (const clipPath of path.clipPaths) {
                clipPaths.push({
                    id: clipPath.id,
                    start: clipPath.start,
                    transits: clipPath.transits
                });
            }
        }
        return {
            mapItemGroupId: mapItemGroup.id,
            mapItemId: mapItem.id,
            pathId: path.id,
            clipPathId: clipPath?.id,
            startingPathInfo: {
                id: path.id,
                start: path.start,
                transits: path.transits,
                clipPaths: clipPaths
            },
            bounds: bounds,
            transitIndex: transitIndex
        };
    }

    #displaybounds(bounds) {
        const scale = 1 / this.#mapWorker.map.zoom;
        const pathInfo = `M ${bounds.x},${bounds.y} l ${bounds.width},0 0,${bounds.height} -${bounds.width},0 z`;
        const path = new Path2D(pathInfo);
        this.#mapWorker.renderingContext.fillStyle = "gold";
        this.#mapWorker.renderingContext.fill(path);
        this.#mapWorker.renderingContext.strokeStyle = "blue";
        this.#mapWorker.renderingContext.lineWidth = 2 * scale;
        this.#mapWorker.renderingContext.stroke(path);    
    }

    #getBoundsForPoint(point) {
        if (this.#bounds) {
            for (const boundsItem of this.#bounds) {
                if (boundsItem.bounds
                    && point.x >= boundsItem.bounds.x
                    && point.x <= boundsItem.bounds.x + boundsItem.bounds.width
                    && point.y >= boundsItem.bounds.y
                    && point.y <= boundsItem.bounds.y + boundsItem.bounds.height) {
                    return boundsItem;
                }
            }
        }
        return null;
    }

    #startChange(boundsItem) {
        this.#boundsItem = boundsItem;
        this.#mapWorker.map.startChangeSet();
    }

    async #moveTransitEndpoint(eventData) {
        const point = this.#getMovePoint(eventData);
        const dx = (point.x - this.#pointDown.x) / this.#mapWorker.map.zoom;
        const dy = (point.y - this.#pointDown.y) / this.#mapWorker.map.zoom;
        const layer = this.#mapWorker.map.getActiveLayer();
        const mapItemGroup = layer.mapItemGroups.find(mig => mig.id == this.#boundsItem.mapItemGroupId);
        const mapItem = mapItemGroup.mapItems.find(mi => mi.id == this.#boundsItem.mapItemId);
        let path = mapItem.paths.find(p => p.id == this.#boundsItem.pathId);
        let clipPathId = null;
        if (this.#boundsItem.clipPathId) {
            path = path.clipPaths.find(cp => cp.id == this.#boundsItem.clipPathId);
            clipPathId = path.id;
        }
        this.#updatePath(path, dx, dy, clipPathId);
        await this.#displayTransitEndpoints(false, true);
    }

    #updatePath(path, dx, dy, clipPathId) {
        const transitIndex = this.#boundsItem.transitIndex;        
        const newTransits = [...path.transits];
        if (transitIndex > -1) { 
            newTransits[transitIndex] = this.#getUpdatedTransit(transitIndex, dx, dy, clipPathId);
        }
        else {           
            let originalStart = this.#boundsItem.startingPathInfo.start;
            if (clipPathId) {
                const clipPath = this.#boundsItem.startingPathInfo.clipPaths.find(cp => cp.id == clipPathId);
                originalStart = clipPath.start;
            }
            path.start = { x: originalStart.x + dx, y: originalStart.y + dy };
            const endPoint = this.#getPathEndPoint(path);
            if (this.#arePointsEqual(path.start, endPoint)) {
                newTransits[newTransits.length - 1] = this.#getUpdatedTransit(newTransits.length - 1, dx, dy, clipPathId);
            }
        }
        if (transitIndex < newTransits.length - 1) {
            newTransits[transitIndex + 1] = this.#getUpdatedTransit(transitIndex + 1, -dx, -dy, clipPathId);
        }  
        path.transits = newTransits;
    }

    #getUpdatedTransit(transitIndex, dx, dy, clipPathId) {
        let transit = this.#boundsItem.startingPathInfo.transits[transitIndex];
        if (clipPathId) {
            const clipPath = this.#boundsItem.startingPathInfo.clipPaths.find(cp => cp.id == clipPathId);
            transit = clipPath.transits[transitIndex];
        }
        if (transit.radii && Math.abs(transit.end.x + dx) > 5 && Math.abs(transit.end.y + dy) > 5) {
            const end = { x: transit.end.x + dx, y: transit.end.y + dy };
            let sweepFlag = transit.sweepFlag;
            let center = { x: 0, y: end.y };
            if (sweepFlag == 1) {
                center = { x: end.x, y: 0 };
                if ((end.x > 0 && end.y > 0) || (end.x < 0 && end.y < 0)) {
                    center = { x: 0, y: end.y };
                }
            }
            else {
                if ((end.x > 0 && end.y > 0) || (end.x < 0 && end.y < 0)) {
                    center = { x: end.x, y: 0 };
                }
            }
            const radii = { x: Math.abs(end.x), y: Math.abs(end.y) };
            const arcData = {
                end: end,
                center: center,
                radii: radii,
                rotationAngle: 0,
                sweepFlag: sweepFlag
            };
            return this.#mapWorker.createArc(arcData);
        }
        else {
            if (transit.radii) {
                return { x: transit.end.x + dx, y: transit.end.y + dy };
            }
            else {
                return { x: transit.x + dx, y: transit.y + dy };
            }
        }
    }

    #completeChange() {
        const oldPathInfo = this.#boundsItem.startingPathInfo;
        const layer = this.#mapWorker.map.getActiveLayer();
        const mapItemGroup = layer.mapItemGroups.find(mig => mig.id == this.#boundsItem.mapItemGroupId);
        const mapItem = mapItemGroup.mapItems.find(mi => mi.id == this.#boundsItem.mapItemId);
        const newPathInfo = mapItem.paths.find(p => p.id == this.#boundsItem.pathId);
        this.#mapWorker.geometryUtilities.removeExteriorClipPaths(newPathInfo);
        const changes = [
            {
                changeType: "Edit",
                changeObjectType: "Path",
                propertyName: "start",
                oldValue: oldPathInfo.start,
                newValue: newPathInfo.start,
                layerName: layer.name,
                mapItemGroupId: mapItemGroup.id,
                mapItemId: mapItem.id,
                pathId: newPathInfo.id
            },
            {
                changeType: "Edit",
                changeObjectType: "Path",
                propertyName: "transits",
                oldValue: oldPathInfo.transits,
                newValue: newPathInfo.transits,
                layerName: layer.name,
                mapItemGroupId: mapItemGroup.id,
                mapItemId: mapItem.id,
                pathId: newPathInfo.id
            },
            {
                changeType: "Edit",
                changeObjectType: "Path",
                propertyName: "clipPaths",
                oldValue: oldPathInfo.clipPaths,
                newValue: newPathInfo.clipPaths,
                layerName: layer.name,
                mapItemGroupId: mapItemGroup.id,
                mapItemId: mapItem.id,
                pathId: newPathInfo.id
            }
        ];
        const changeSet = this.#mapWorker.createChangeSet(changes);
        this.#mapWorker.map.completeChangeSet(changeSet);
        this.#boundsItem = null;
    }

    #getMovePoint(eventData) {
        let point = { x: eventData.offsetX, y: eventData.offsetY };
        if (this.#isLockModeOn) {
            let x = point.x;
            let y = point.y;
            const xDelta = point.x - this.#pointDown.x;
            const yDelta = point.y - this.#pointDown.y;
            if (Math.abs(xDelta) > Math.abs(yDelta)) {
                y = this.#pointDown.y;
            }
            else {
                x = this.#pointDown.x;
            }
            point.x = x;
            point.y = y;
        }
        if (this.#isSnapToOverlayModeOn) {
            point = this.#transformCanvasPoint(point.x, point.y);
            point = this.#mapWorker.map.overlay.getNearestOverlayPoint(point);
            point = this.#transformMapPoint(point.x, point.y);
        }
        return point;
    }

    #getPathEndPoint(pathInfo) {
        let end = pathInfo.start;
        for (const transit of pathInfo.transits) {
            end = this.#getTransitEndPoint(end, transit);
        }
        return end;
    }

    #getTransitEndPoint(start, transit) {
        if (transit.radii) {
            return { x: start.x + transit.end.x, y: start.y + transit.end.y };
        }
        else {
            return { x: start.x + transit.x, y: start.y + transit.y };
        }
    }

    #arePointsEqual(point1, point2, maxDifference) {
        if (!maxDifference) {
            maxDifference = 2;
        }
        return (Math.abs(point1.x - point2.x) <= maxDifference) && (Math.abs(point1.y - point2.y) <= maxDifference)
    }

    #isAltSelectModeOn() {
        return this.#isAlternateSelectionModeOn || this.#isToggleSelectionModeOn;
    }
}
