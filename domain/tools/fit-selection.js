
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
    #isCtrlPressed;
    #isShiftPressed;
    #isAltPressed;
    #setOperationMode;
    #isArrowPressed;
    #moveIncrementIteration;

    // methods
    async onActivate(mapWorker) {
        this.#mapWorker = mapWorker;
        if (this.#mapWorker.map) {
            this.#mapWorker.map.addEventListener("afterChangeEvent", this.handleMapChange);
        }
        this.#selectionUtilities = this.#mapWorker.createSelectionUtilities();
        this.#cursor = "Default";
        this.#isCtrlPressed = false;
        this.#isShiftPressed = false;
        this.#isAltPressed = false;
        this.#setOperationMode = "Intersect";
        this.#isArrowPressed = false;
        this.#moveIncrementIteration = 0;
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

    async onCursorChange(cursor) {
        this.#cursor = cursor;
    }

    // helpers
    #onPointerDown(eventData) {
        if (eventData && eventData.button === 0) {
            this.#pointDown = { x: eventData.offsetX, y: eventData.offsetY };
            this.#points = [];
            const transformedPoint = this.#transformCanvasPoint(eventData.offsetX, eventData.offsetY);
            this.#selectionUtilities.setActivityState(transformedPoint, this.#isAltPressed);
            if (this.#selectionUtilities.activityState === "Select") {
                this.#selectDown(eventData);
            }
            if (this.#selectionUtilities.activityState === "Move"
                || this.#selectionUtilities.activityState.startsWith("Resize")) {
                this.#selectionUtilities.startChange(this.#mapWorker, transformedPoint);
            }
            if (this.#selectionUtilities.activityState === "Rotate") {
                this.#selectionUtilities.rotateDown(this.#mapWorker, transformedPoint);
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
                this.#selectionUtilities.move(this.#mapWorker, this.#pointDown, currentPoint, this.#isShiftPressed, this.#isCtrlPressed);
                preview = true;
            }
            if (this.#selectionUtilities.activityState.startsWith("Resize")) {
                this.#selectionUtilities.resize(this.#mapWorker, this.#pointDown, currentPoint, this.#isShiftPressed, this.#isCtrlPressed);
                preview = true;
                drawArcsRadii = true;              
            }
            if (this.#selectionUtilities.activityState === "Rotate") { 
                rotatePoint = this.#transformCanvasPoint(eventData.offsetX, eventData.offsetY);
                this.#selectionUtilities.rotateMove(this.#mapWorker, rotatePoint, this.#isShiftPressed, this.#isCtrlPressed);
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
            this.#selectionUtilities.drawArcsRadii(this.#mapWorker, this.#isCtrlPressed);
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
        if (eventData.key == "Control") {
            this.#isCtrlPressed = true;
        }
        if (eventData.key == "Shift") {
            this.#isShiftPressed = true;
        }
        if (eventData.key == "Alt") {
            this.#isAltPressed = true;
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
    }

    #onKeyUp(eventData) {
        if (eventData.key == "Control") {
            this.#isCtrlPressed = false;
        }
        if (eventData.key == "Shift") {
            this.#isShiftPressed = false;
        }
        if (eventData.key == "Alt") {
            this.#isAltPressed = false;
        }
        if (eventData.key?.toLowerCase() == "i") {
            this.#setOperationMode = "Intersect";
            this.#previewSetOperation();
        }
        if (eventData.key?.toLowerCase() == "u") {
            this.#setOperationMode = "Union";
            this.#previewSetOperation();
        }
        if (eventData.key?.toLowerCase() == "x") {
            this.#setOperationMode = "Exclude";
            this.#previewSetOperation();
        }
        if (eventData.key == "Enter") {
            this.#performSetOperation();
            this.#mapWorker.renderMap();
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
        if (this.#mapWorker.map) {
            if (this.#points.length < 4) {
                this.#selectByPoints();
            }
            else {
                this.#selectByPath();
            }
        }
        this.#selectionUtilities.resetSelectionBounds(this.#mapWorker);
    }

    #selectByPoints() {
        const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
        const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
        const points = this.#points.map(pt => this.#mapWorker.geometryUtilities.transformPoint(pt, scale, translation));
        const layer = this.#mapWorker.map.getActiveLayer();
        layer.selectByPoints(this.#mapWorker.renderingContext, this.#mapWorker.map, points, this.#isAltPressed);
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
        let pathData = `M ${start.x},${start.y}`;
        for (const point of points) {
            pathData += ` L ${point.x},${point.y}`;
        }
        pathData += " z";
        const selectionPath = new Path2D(pathData);
        const layer = this.#mapWorker.map.getActiveLayer();
        layer.selectByPath(this.#mapWorker.renderingContext, selectionBounds, selectionPath, this.#isAltPressed);
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

    #previewSetOperation() {
        this.#mapWorker.renderMap();

        // get secondary selection path(s)
        const layer = this.#mapWorker.map.getActiveLayer();
        const secondaryPaths = [];
        const secondarySelections = layer.mapItemGroups.filter(mi => mi.selectionStatus == "Secondary");
        for (const mapItemGroup of secondarySelections) {
            for (const mapItem of mapItemGroup.mapItems) {
                for (const path of mapItem.paths) {
                    secondaryPaths.push(path);
                }
            }
        }

        // display set operation paths
        const primarySelections = layer.mapItemGroups.filter(mi => mi.selectionStatus == "Primary");
        for (const mapItemGroup of primarySelections) {
            for (const mapItem of mapItemGroup.mapItems) {
                for (const primaryPath of mapItem.paths) {
                    for (const secondaryPath of secondaryPaths) {
                        const setOperationPaths = this.#getSetOperationPaths(primaryPath, secondaryPath);
                        for (const setOperationPath of setOperationPaths) {
                            this.#displayPath(setOperationPath);
                            for (const clipPath of setOperationPath.clipPaths) {
                                this.#displayPath(clipPath);
                            }
                        }
                        if (setOperationPaths.length > 0) {
                            break;
                        }
                    }
                }
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
                    secondaryPaths.push(path);
                }
            }
        }

        // perform set operations
        const primarySelections = layer.mapItemGroups.filter(mi => mi.selectionStatus == "Primary");
        let mapItemPaths = [];
        for (const mapItemGroup of primarySelections) {
            for (const mapItem of mapItemGroup.mapItems) {
                mapItemPaths = [];
                for (const primaryPath of mapItem.paths) {
                    for (const secondaryPath of secondaryPaths) {
                        const setOperationPaths = this.#getSetOperationPaths(primaryPath, secondaryPath);
                        for (const setOperationPath of setOperationPaths) {
                            setOperationPath.mapItemId = mapItem.id;
                            for (const clipPath of primaryPath.clipPaths) {
                                setOperationPath.clipPaths.push(clipPath);
                            }
                            this.#mapWorker.geometryUtilities.removeExteriorClipPaths(setOperationPath);
                            mapItemPaths.push(setOperationPath);
                        }
                        if (setOperationPaths.length > 0) {
                            break;
                        }
                    }
                }
                if (mapItemPaths.length > 0) {
                    mapItem.paths = mapItemPaths;
                }
            }
        }
        this.#mapWorker.renderMap();
    }

    #getSetOperationPaths(path1, path2) {
        let pathDataList = [];
        if (this.#setOperationMode == "Intersect") {
            pathDataList = this.#mapWorker.geometryUtilities.getIntersectionPathDataList(path1, path2);
        }
        if (this.#setOperationMode == "Union") {
            pathDataList = this.#mapWorker.geometryUtilities.getUnionPathDataList(path1, path2);
        }
        if (this.#setOperationMode == "Exclude") {
            pathDataList = this.#mapWorker.geometryUtilities.getExclusionPathDataList(path1, path2);
        }
        const paths = [];
        for (const pathData of pathDataList) {
            paths.push(this.#mapWorker.createPath(pathData));
        }
        return paths;
    }

    #displayPath(path) {
        const path2D = new Path2D(`${path.getPathInfo()} z`);
        this.#mapWorker.renderingContext.setLineDash([]);
        this.#mapWorker.renderingContext.strokeStyle = "darkred";
        this.#mapWorker.renderingContext.lineWidth = 3;
        this.#mapWorker.renderingContext.stroke(path2D);
        this.#mapWorker.renderingContext.strokeStyle = "white";
        this.#mapWorker.renderingContext.lineWidth = 1;
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
        const maxIteration = Math.min(this.#mapWorker.map.currentViewPort.width, this.#mapWorker.map.currentViewPort.height);
        if (this.#moveIncrementIteration < maxIteration && this.#isArrowPressed) {
            this.#selectionUtilities.moveIncrement(this.#mapWorker, dx, dy, this.#isCtrlPressed);
            this.#previewSetOperation();
        }
    }
}
