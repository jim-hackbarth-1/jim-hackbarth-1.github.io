
export function createToolModel() {
    return new SelectRectangleTool();
}

class SelectRectangleTool {

    // fields
    #mapWorker;
    #cursor;
    #pointDown;
    #pointCurrent;
    #selectionUtilities;
    #isArrowPressed;
    #moveIncrementIteration;
    #isLockModeOn;
    #isToggleSelectionModeOn;
    #isAlternateSelectionModeOn;
    #isSingleSelectionModeOn;
    #isSnapToOverlayModeOn;
    #isMoveCaptionModeOn;
    #badgePoint;

    // methods
    async onActivate(mapWorker) {
        this.#mapWorker = mapWorker;
        if (this.#mapWorker.map) {
            this.#mapWorker.map.addEventListener("ChangeEvent", this.handleMapChange);
        }
        this.#selectionUtilities = this.#mapWorker.createSelectionUtilities();
        this.#cursor = "Default";
        this.#isArrowPressed = false;
        this.#moveIncrementIteration = 0;
        this.#isToggleSelectionModeOn = false;
        this.#badgePoint = null;
        this.#initializeToolOptions();  
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
            this.#badgePoint = null;
            const isPointInBadge = this.#isPointInBadge(this.#pointDown);
            if (isPointInBadge) {
                this.#badgePoint = this.#pointDown;
                return;
            }
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
        if (eventData) {
            const currentPoint = { x: eventData.offsetX, y: eventData.offsetY };
            if (this.#selectionUtilities.activityState === "Default") {
                this.#setCursor(eventData);
            }
            if (this.#selectionUtilities.activityState === "Select") {
                await this.#selectMove(eventData);
            }
            if (this.#selectionUtilities.activityState === "Move") {
                this.#selectionUtilities.move(this.#mapWorker, this.#pointDown, currentPoint, this.#isLockModeOn, this.#isMoveCaptionModeOn);
                await this.#mapWorker.renderMap({ quickRender: true });
            }
            if (this.#selectionUtilities.activityState.startsWith("Resize")) {
                this.#selectionUtilities.resize(this.#mapWorker, this.#pointDown, currentPoint, this.#isLockModeOn);
                await this.#mapWorker.renderMap({ quickRender: true });
                this.#selectionUtilities.drawArcsRadii(this.#mapWorker);
            }
            if (this.#selectionUtilities.activityState === "Rotate") {
                const point = this.#transformCanvasPoint(eventData.offsetX, eventData.offsetY);
                this.#selectionUtilities.rotateMove(this.#mapWorker, point, this.#isLockModeOn);
                await this.#mapWorker.renderMap({ quickRender: true });
                this.#selectionUtilities.drawRotationIndicator(this.#mapWorker, point);
                this.#selectionUtilities.drawArcsRadii(this.#mapWorker);
            }          
        }
    }

    async #onPointerUp(eventData) {
        if (eventData) {
            if (this.#badgePoint) {
                const endPoint = { x: eventData.offsetX, y: eventData.offsetY };
                this.#toggleBadge([this.#badgePoint, endPoint]);
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
            await this.#mapWorker.renderMap();
        }
        this.#selectionUtilities.activityState = "Default";
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

    #isPointInBadge(point) {
        const layer = this.#mapWorker.map.getActiveLayer();
        return layer.areAllPointsInBadge(this.#mapWorker.renderingContext, [point]);
    }

    #toggleBadge(points) {
        const layer = this.#mapWorker.map.getActiveLayer();
        layer.toggleBadge(this.#mapWorker.renderingContext, points);
    }

    #selectDown(eventData) {
        this.#mapWorker.renderingContext.setLineDash([5, 10]);
        this.#pointCurrent = { x: eventData.offsetX, y: eventData.offsetY };
    }

    async #selectMove(eventData) {
        this.#pointCurrent = { x: eventData.offsetX, y: eventData.offsetY };
        await this.#mapWorker.renderMap({ quickRender: true });
        this.#mapWorker.renderingContext.resetTransform();
        const startX = this.#pointDown.x;
        const startY = this.#pointDown.y;
        const currentX = this.#pointCurrent.x;
        const currentY = this.#pointCurrent.y;
        const rect = new Path2D(`M ${startX},${startY} L ${startX},${currentY} ${currentX},${currentY} ${currentX},${startY} z`);
        this.#mapWorker.strokeSelectionPath(rect);
    }

    async #selectUp(eventData) {
        this.#pointCurrent = { x: eventData.offsetX, y: eventData.offsetY };
        const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
        const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
        const layer = this.#mapWorker.map.getActiveLayer();
        const oldSelections = layer.mapItemGroups
            .filter(mig => mig.selectionStatus)
            .map(mig => ({ mapItemGroupId: mig.id, selectionStatus: mig.selectionStatus }));
        this.#mapWorker.map.startChangeSet();
        if (Math.abs(this.#pointDown.x - this.#pointCurrent.x) < 10 && Math.abs(this.#pointDown.y - this.#pointCurrent.y) < 10) {
            this.#selectByPoints(scale, translation);
        }
        else {
            this.#selectByPath(scale, translation);
        }
        const newSelections = layer.mapItemGroups
            .filter(mig => mig.selectionStatus)
            .map(mig => ({ mapItemGroupId: mig.id, selectionStatus: mig.selectionStatus }));
        const changeSet = this.#selectionUtilities.getSelectionChangeSet(this.#mapWorker, layer.name, oldSelections, newSelections);
        this.#mapWorker.map.completeChangeSet(changeSet);
        this.#selectionUtilities.resetSelectionBounds(this.#mapWorker);
    }

    #selectByPoints(scale, translation) {
        const points = [
            { x: this.#pointDown.x, y: this.#pointDown.y },
            { x: this.#pointCurrent.x, y: this.#pointCurrent.y }
        ];
        const transformedPoints = points.map(pt => this.#mapWorker.geometryUtilities.transformPoint(pt, scale, translation));
        const layer = this.#mapWorker.map.getActiveLayer();
        layer.selectByPoints(this.#mapWorker.renderingContext, this.#mapWorker.map, transformedPoints, this.#isAltSelectModeOn());
    }

    #selectByPath(scale, translation) {
        const start = this.#mapWorker.geometryUtilities.transformPoint(
            { x: this.#pointDown.x, y: this.#pointDown.y }, scale, translation);
        const end = this.#mapWorker.geometryUtilities.transformPoint(
            { x: this.#pointCurrent.x, y: this.#pointCurrent.y }, scale, translation);
        const bounds = {
            x: Math.min(start.x, end.x),
            y: Math.min(start.y, end.y),
            width: Math.abs(start.x - end.x),
            height: Math.abs(start.y - end.y)
        };
        const selectionPath = {
            start: { x: bounds.x, y: bounds.y },
            transits: [
                { x: bounds.width, y: 0 },
                { x: 0, y: bounds.height },
                { x: -bounds.width, y: 0 }
            ]
        };

        const layer = this.#mapWorker.map.getActiveLayer();
        layer.selectByPath(this.#mapWorker.geometryUtilities, bounds, selectionPath, this.#isAltSelectModeOn(), true);
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
            await this.#mapWorker.renderMap({ quickRender: true });
        }
    }

    #isAltSelectModeOn() {
        return this.#isAlternateSelectionModeOn || this.#isToggleSelectionModeOn;
    }
}
