
export function createToolModel() {
    return new FitSelectionTool();
}

class FitSelectionTool {

    // fields
    #mapWorker;
    #cursor;
    #pointDown;
    #points;
    #pathDark;
    #pathLight;
    #selectionUtilities;
    #setOperationMode;
    #isArrowPressed;
    #moveIncrementIteration;
    #isLockModeOn;
    #isToggleSelectionModeOn;
    #isSingleSelectionModeOn;
    #isSnapToOverlayModeOn;

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
        this.#initializeToolOptions();  
        this.#previewSetOperation();
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
                this.#onPointerMove(eventData);
                break;
            case "pointerup":
                this.#onPointerUp(eventData);
                break;
            case "keydown":
                this.#onKeyDown(eventData);
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
        this.#previewSetOperation(true);
    }

    async onCursorChange(cursor) {
        this.#cursor = cursor;
    }

    // helpers
    #updateToolOptionValue(name, value, notifyMapWorker) {
        if (name == "AcceptChanges") {
            this.#performSetOperation();
            return;
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
        if (name == "SetOperationMode") {
            this.#setOperationMode = value;
        }
        if (notifyMapWorker) {
            this.#mapWorker.setToolOptionValue(name, value);
        }
        this.#previewSetOperation();
    }

    #initializeToolOptions() {
        this.#mapWorker.initializeToolOptions(["AcceptChanges", "LockMode", "SetOperationMode", "SingleSelectionMode", "SnapToOverlay"]);
        this.#isLockModeOn = this.#mapWorker.getToolOption("LockMode").isToggledOn;
        this.#setOperationMode = this.#mapWorker.getToolOption("SetOperationMode").currentStateName;
        this.#isSingleSelectionModeOn = this.#mapWorker.getToolOption("SingleSelectionMode").isToggledOn;
        this.#isSnapToOverlayModeOn = this.#mapWorker.getToolOption("SnapToOverlay").isToggledOn;
    }

    #onPointerDown(eventData) {
        if (eventData && eventData.button === 0) {
            this.#pointDown = { x: eventData.offsetX, y: eventData.offsetY };
            this.#points = [];
            const transformedPoint = this.#transformCanvasPoint(eventData.offsetX, eventData.offsetY);
            this.#selectionUtilities.setActivityState(transformedPoint, this.#isToggleSelectionModeOn);
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

    #onPointerMove(eventData) {
        let preview = false;
        let drawArcsRadii = false;
        let drawRotationIndicator = false;
        let rotatePoint = null;
        if (eventData) {
            const currentPoint = { x: eventData.offsetX, y: eventData.offsetY };
            if (this.#selectionUtilities.activityState === "Default") {
                this.#setCursor(eventData);
            }
            if (this.#selectionUtilities.activityState === "Select") {
                this.#selectMove(eventData);
            }
            if (this.#selectionUtilities.activityState === "Move") {
                this.#selectionUtilities.move(this.#mapWorker, this.#pointDown, currentPoint, this.#isLockModeOn);
                preview = true;
            }
            if (this.#selectionUtilities.activityState.startsWith("Resize")) {
                this.#selectionUtilities.resize(this.#mapWorker, this.#pointDown, currentPoint, this.#isLockModeOn);
                preview = true;
                drawArcsRadii = true;              
            }
            if (this.#selectionUtilities.activityState === "Rotate") { 
                rotatePoint = this.#transformCanvasPoint(eventData.offsetX, eventData.offsetY);
                this.#selectionUtilities.rotateMove(this.#mapWorker, rotatePoint, this.#isLockModeOn);
                preview = true;
                drawRotationIndicator = true;
                drawArcsRadii = true;
            }
        }
        if (preview) {
            this.#previewSetOperation();
        }
        if (drawRotationIndicator && rotatePoint) {
            this.#selectionUtilities.drawRotationIndicator(this.#mapWorker, rotatePoint);
        }
        if (drawArcsRadii) {
            this.#selectionUtilities.drawArcsRadii(this.#mapWorker);
        }
    }

    #onPointerUp(eventData) {
        if (eventData) {
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
        this.#selectionUtilities.activityState = "Default";
        this.#previewSetOperation();
    }

    #onKeyDown(eventData) {
        if (eventData.key == "Shift" || eventData.key == "Control" || eventData.key == "Alt") {
            this.#isToggleSelectionModeOn = true;
        }
        if (eventData.key == "ArrowLeft") {
            this.#moveIncrement(eventData, -1, 0);
        }
        if (eventData.key == "ArrowRight") {
            this.#moveIncrement(eventData, 1, 0);
        }
        if (eventData.key == "ArrowUp") {
            this.#moveIncrement(eventData, 0, -1);
        }
        if (eventData.key == "ArrowDown") {
            this.#moveIncrement(eventData, 0, 1);
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
        if (eventData.altKey && eventData.key?.toLowerCase() == "i" && !eventData.repeat) {
            this.#updateToolOptionValue("SetOperationMode", "Intersect", true);
        }
        if (eventData.altKey && eventData.key?.toLowerCase() == "u" && !eventData.repeat) {
            this.#updateToolOptionValue("SetOperationMode", "Union", true);
        }
        if (eventData.altKey && eventData.key?.toLowerCase() == "x" && !eventData.repeat) {
            this.#updateToolOptionValue("SetOperationMode", "Exclude", true);
        }
        if (eventData.altKey && eventData.key == "Enter") {
            this.#updateToolOptionValue("AcceptChanges", null, false);
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

    #setCursor(eventData) {
        if (!this.#selectionUtilities.selectionBounds) {
            this.#selectionUtilities.resetSelectionBounds(this.#mapWorker);
        }
        const point = this.#transformCanvasPoint(eventData.offsetX, eventData.offsetY);
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
        this.#pathDark = new Path2D();
        this.#pathLight = new Path2D();
        this.#pathDark.moveTo(eventData.offsetX, eventData.offsetY);
        this.#pathLight.moveTo(eventData.offsetX, eventData.offsetY);
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
        layer.selectByPoints(this.#mapWorker.renderingContext, this.#mapWorker.map, points, this.#isToggleSelectionModeOn);
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
        layer.selectByPath(this.#mapWorker.geometryUtilities, selectionBounds, selectionPath, this.#isToggleSelectionModeOn, true);
    }

    #drawSelectionLine(x, y) {
        this.#mapWorker.renderingContext.setLineDash([5, 5]);
        this.#mapWorker.renderingContext.strokeStyle = "dimgray";
        this.#mapWorker.renderingContext.lineWidth = 3;
        this.#pathDark.lineTo(x, y);
        this.#mapWorker.renderingContext.stroke(this.#pathDark);
        this.#mapWorker.renderingContext.strokeStyle = "lightyellow";
        this.#mapWorker.renderingContext.lineWidth = 1;
        this.#pathLight.lineTo(x, y);
        this.#mapWorker.renderingContext.stroke(this.#pathLight);
    }

    #previewSetOperation(doNotPreRenderMap) {
        if (!doNotPreRenderMap) {
            this.#mapWorker.renderMap();
        }
        
        // get primary paths
        const layer = this.#mapWorker.map.getActiveLayer();
        const primaryPaths = [];
        const primarySelections = layer.mapItemGroups.filter(mi => mi.selectionStatus == "Primary");
        for (const mapItemGroup of primarySelections) {
            for (const mapItem of mapItemGroup.mapItems) {
                for (const path of mapItem.paths) {
                    primaryPaths.push(path.getData());
                }
            }
        }

        // get secondary selection path(s)  
        const secondaryPaths = [];
        const secondarySelections = layer.mapItemGroups.filter(mi => mi.selectionStatus == "Secondary");
        for (const mapItemGroup of secondarySelections) {
            for (const mapItem of mapItemGroup.mapItems) {
                for (const path of mapItem.paths) {
                    secondaryPaths.push(path.getData());
                }
            }
        }

        // preview set operation
        const setOperationPaths = this.#getSetOperationPaths(primaryPaths, secondaryPaths);
        for (const setOperationPath of setOperationPaths) {
            const path = this.#mapWorker.createPath(setOperationPath);
            this.#displayPath(path);
            for (const clipPath of path.clipPaths) {
                this.#displayPath(clipPath);
            }
        }
    }

    #performSetOperation() {

        // get secondary selection path(s)
        const layer = this.#mapWorker.map.getActiveLayer();
        const secondaryPaths = [];
        const secondarySelections = layer.mapItemGroups.filter(mi => mi.selectionStatus == "Secondary");
        for (const mapItemGroup of secondarySelections) {
            for (const mapItem of mapItemGroup.mapItems) {
                for (const path of mapItem.paths) {
                    secondaryPaths.push(path.getData());
                }
            }
        }

        // perform set operations
        const primarySelections = layer.mapItemGroups.filter(mi => mi.selectionStatus == "Primary");
        let mapItemPaths = [];
        for (const mapItemGroup of primarySelections) {
            for (const mapItem of mapItemGroup.mapItems) {
                const primaryPaths = mapItem.paths.map(p => p.getData());
                const setOperationPaths = this.#getSetOperationPaths(primaryPaths, secondaryPaths);
                mapItemPaths = [];
                for (const setOperationPath of setOperationPaths) {
                    mapItemPaths.push(this.#mapWorker.createPath(setOperationPath));
                }
                if (mapItemPaths.length > 0) {
                    mapItem.paths = mapItemPaths;
                }
            }
        }

        // unselect secondary selections
        for (const mapItemGroup of secondarySelections) {
            mapItemGroup.selectionStatus = null;
        }

        this.#mapWorker.renderMap();
    }

    #getSetOperationPaths(primaryPaths, secondaryPaths) {
        if (this.#setOperationMode == "Union") {
            return this.#mapWorker.setUtilities.getUnionAll(primaryPaths, secondaryPaths);
        }
        if (this.#setOperationMode == "Intersect") {
            return this.#mapWorker.setUtilities.getIntersectionAll(primaryPaths, secondaryPaths);
        }
        if (this.#setOperationMode == "Exclude") {
            return this.#mapWorker.setUtilities.getExclusionAll(primaryPaths, secondaryPaths);
        }
        return [];
    }

    #displayPath(path) {
        const scale = 1 / this.#mapWorker.map.zoom;
        const path2D = new Path2D(`${path.getPathInfo()} z`);
        this.#mapWorker.renderingContext.setLineDash([]);
        this.#mapWorker.renderingContext.strokeStyle = "darkred";
        this.#mapWorker.renderingContext.lineWidth = 3 * scale;
        this.#mapWorker.renderingContext.stroke(path2D);
        this.#mapWorker.renderingContext.strokeStyle = "white";
        this.#mapWorker.renderingContext.lineWidth = 1 * scale;;
        this.#mapWorker.renderingContext.stroke(path2D);
    }

    #moveIncrement(eventData, dx, dy) {
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
            this.#selectionUtilities.moveIncrement(this.#mapWorker, dx, dy, this.#isSingleSelectionModeOn);
            this.#previewSetOperation();
        }
    }
}
