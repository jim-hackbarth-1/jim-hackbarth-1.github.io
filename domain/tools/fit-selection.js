
export function createToolModel() {
    return new FitSelectionTool();
}

class FitSelectionTool {

    // fields
    #mapWorker;
    #cursor;
    #pointDown;
    #points;
    #path;
    #selectionUtilities;
    #setOperationMode;
    #isArrowPressed;
    #moveIncrementIteration;
    #isLockModeOn;
    #isToggleSelectionModeOn;
    #isAlternateSelectionModeOn;
    #isSingleSelectionModeOn;
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
        this.#initializeToolOptions();  
        await this.#previewSetOperation();
    }

    async onApplyToolOption(toolOptionInfo) {
        await this.#updateToolOptionValue(toolOptionInfo.name, toolOptionInfo.value, false);
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
        await this.#previewSetOperation(true);
    }

    async onCursorChange(cursor) {
        this.#cursor = cursor;
    }

    // helpers
    async #updateToolOptionValue(name, value, notifyMapWorker) {
        if (name == "AcceptChanges") {
            await this.#performSetOperation();
            return;
        }
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
        if (name == "SetOperationMode") {
            this.#setOperationMode = value;
        }
        if (name == "MoveCaptionMode") {
            this.#isMoveCaptionModeOn = value;
        }
        if (notifyMapWorker) {
            this.#mapWorker.setToolOptionValue(name, value);
        }
        await this.#previewSetOperation();
    }

    #initializeToolOptions() {
        this.#mapWorker.initializeToolOptions(["AcceptChanges", "AlternateSelectionMode", "LockMode", "SetOperationMode", "SingleSelectionMode", "SnapToOverlay", "MoveCaptionMode"]);
        this.#isAlternateSelectionModeOn = this.#mapWorker.getToolOption("AlternateSelectionMode").isToggledOn;
        this.#isLockModeOn = this.#mapWorker.getToolOption("LockMode").isToggledOn;
        this.#setOperationMode = this.#mapWorker.getToolOption("SetOperationMode").currentStateName;
        this.#isSingleSelectionModeOn = this.#mapWorker.getToolOption("SingleSelectionMode").isToggledOn;
        this.#isSnapToOverlayModeOn = this.#mapWorker.getToolOption("SnapToOverlay").isToggledOn;
        this.#isMoveCaptionModeOn = this.#mapWorker.getToolOption("MoveCaptionMode").isToggledOn;
    }

    #onPointerDown(eventData) {
        if (eventData && eventData.button === 0) {
            this.#pointDown = { x: eventData.offsetX, y: eventData.offsetY };
            this.#points = [];
            const transformedPoint = this.#transformCanvasPoint(eventData.offsetX, eventData.offsetY);
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

    async #onPointerMove(eventData) {
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
                this.#selectionUtilities.move(this.#mapWorker, this.#pointDown, currentPoint, this.#isLockModeOn, this.#isMoveCaptionModeOn);
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
            await this.#previewSetOperation(false, true);
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
        await this.#previewSetOperation();
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
            await this.#updateToolOptionValue("AlternateSelectionMode", !this.#isAlternateSelectionModeOn, true);
        }
        if (eventData.altKey && eventData.key?.toLowerCase() == "o" && !eventData.repeat) {
            await this.#updateToolOptionValue("SnapToOverlay", !this.#isSnapToOverlayModeOn, true);
        }
        if (eventData.altKey && eventData.key?.toLowerCase() == "l" && !eventData.repeat) {
            await this.#updateToolOptionValue("LockMode", !this.#isLockModeOn, true);
        }
        if (eventData.altKey && eventData.key?.toLowerCase() == "s" && !eventData.repeat) {
            await this.#updateToolOptionValue("SingleSelectionMode", !this.#isSingleSelectionModeOn, true);
        }
        if (eventData.altKey && eventData.key?.toLowerCase() == "i" && !eventData.repeat) {
            await this.#updateToolOptionValue("SetOperationMode", "Intersect", true);
        }
        if (eventData.altKey && eventData.key?.toLowerCase() == "u" && !eventData.repeat) {
            await this.#updateToolOptionValue("SetOperationMode", "Union", true);
        }
        if (eventData.altKey && eventData.key?.toLowerCase() == "x" && !eventData.repeat) {
            await this.#updateToolOptionValue("SetOperationMode", "Exclude", true);
        }
        if (eventData.altKey && eventData.key == "Enter") {
            await this.#updateToolOptionValue("AcceptChanges", null, false);
        }
        if (eventData.altKey && eventData.key?.toLowerCase() == "c" && !eventData.repeat) {
            await this.#updateToolOptionValue("MoveCaptionMode", !this.#isMoveCaptionModeOn, true);
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

    async #previewSetOperation(doNotPreRenderMap, quickRender) {
        if (!doNotPreRenderMap) {
            await this.#mapWorker.renderMap({ quickRender: quickRender });
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
        const setOperationPaths = this.#getSetOperationPaths(primaryPaths, secondaryPaths, true);
        for (const setOperationPath of setOperationPaths) {
            const path = this.#mapWorker.createPath(setOperationPath);
            this.#displayPath(path);
            for (const clipPath of path.clipPaths) {
                this.#displayPath(clipPath);
            }
        }
    }

    async #performSetOperation() {

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
                const hasFills = this.#hasFills(mapItem);
                const setOperationPaths = this.#getSetOperationPaths(primaryPaths, secondaryPaths, hasFills);
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

        await this.#mapWorker.renderMap();
    }

    #getSetOperationPaths(primaryPaths, secondaryPaths, hasFills) {
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
        this.#mapWorker.strokeClipPath(path2D);
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
            await this.#previewSetOperation(false, true);
        }
    }

    #isAltSelectModeOn() {
        return this.#isAlternateSelectionModeOn || this.#isToggleSelectionModeOn;
    }

    #hasFills(mapItem) {
        const mapItemTemplate = this.#mapWorker.getMapItemTemplate(mapItem);
        if (mapItemTemplate) {
            return (mapItemTemplate.fills.length > 0);
        }
        return false;
    }
}
