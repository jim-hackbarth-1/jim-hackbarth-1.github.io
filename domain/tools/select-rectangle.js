
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
    #isCtrlPressed;

    // methods
    async onActivate(mapWorker) {
        this.#mapWorker = mapWorker;
        if (this.#mapWorker.map) {
            this.#mapWorker.map.addEventListener("afterChangeEvent", this.handleMapChange);
        }
        this.#selectionUtilities = this.#mapWorker.createSelectionUtilities();
        this.#cursor = "Default";
        this.#isCtrlPressed = false;
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
            const transformedPoint = this.#transformCanvasPoint(eventData.offsetX, eventData.offsetY);
            this.#selectionUtilities.setActivityState(transformedPoint, this.#isCtrlPressed);
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
        if (eventData) {
            const currentPoint = { x: eventData.offsetX, y: eventData.offsetY };
            if (this.#selectionUtilities.activityState === "Default") {
                this.#setCursor(eventData);
            }
            if (this.#selectionUtilities.activityState === "Select") {
                this.#selectMove(eventData);
            }
            if (this.#selectionUtilities.activityState === "Move") {
                this.#selectionUtilities.move(this.#mapWorker, this.#pointDown, currentPoint);
                this.#mapWorker.renderMap();
            }
            if (this.#selectionUtilities.activityState.startsWith("Resize")) {
                this.#selectionUtilities.resize(this.#mapWorker, this.#pointDown, currentPoint);
                this.#mapWorker.renderMap();
                this.#selectionUtilities.drawArcsRadii(this.#mapWorker);
            }
            if (this.#selectionUtilities.activityState === "Rotate") {
                const point = this.#transformCanvasPoint(eventData.offsetX, eventData.offsetY);
                this.#selectionUtilities.rotateMove(this.#mapWorker, point);
                this.#mapWorker.renderMap();
                this.#selectionUtilities.drawRotationIndicator(this.#mapWorker, point);
                this.#selectionUtilities.drawArcsRadii(this.#mapWorker);
            }          
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
                this.#mapWorker.renderMap();
            }
            if (this.#selectionUtilities.activityState === "Rotate") {
                this.#selectionUtilities.completeChange(this.#mapWorker, "Rotate"); 
                this.#mapWorker.renderMap();
            }  
        }
        this.#selectionUtilities.activityState = "Default";
    }

    #onKeyDown(eventData) {
        if (eventData.key == "Control") {
            this.#isCtrlPressed = true;
        }
    }

    #onKeyUp(eventData) {
        if (eventData.key == "Control") {
            this.#isCtrlPressed = false;
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
        this.#mapWorker.renderingContext.setLineDash([5, 10]);
        this.#pointCurrent = { x: eventData.offsetX, y: eventData.offsetY };
    }

    #selectMove(eventData) {
        this.#pointCurrent = { x: eventData.offsetX, y: eventData.offsetY };
        this.#mapWorker.renderMap();
        this.#mapWorker.renderingContext.restore();
        this.#mapWorker.renderingContext.resetTransform();
        const startX = this.#pointDown.x;
        const startY = this.#pointDown.y;
        const currentX = this.#pointCurrent.x;
        const currentY = this.#pointCurrent.y;
        const rect = new Path2D(`M ${startX},${startY} L ${startX},${currentY} ${currentX},${currentY} ${currentX},${startY} z`);
        this.#mapWorker.renderingContext.setLineDash([5, 5]);
        this.#mapWorker.renderingContext.strokeStyle = "dimgray";
        this.#mapWorker.renderingContext.lineWidth = 3;
        this.#mapWorker.renderingContext.stroke(rect);
        this.#mapWorker.renderingContext.strokeStyle = "lightyellow";
        this.#mapWorker.renderingContext.lineWidth = 1;
        this.#mapWorker.renderingContext.stroke(rect);
    }

    #selectUp(eventData) {
        this.#pointCurrent = { x: eventData.offsetX, y: eventData.offsetY };
        const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
        const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
        if (Math.abs(this.#pointDown.x - this.#pointCurrent.x) < 10 && Math.abs(this.#pointDown.y - this.#pointCurrent.y) < 10) {
            this.#selectByPoints(scale, translation);
        }
        else {
            this.#selectByPath(scale, translation);
        }
        this.#selectionUtilities.resetSelectionBounds(this.#mapWorker);
        this.#mapWorker.renderMap();
    }

    #selectByPoints(scale, translation) {
        const points = [
            { x: this.#pointDown.x, y: this.#pointDown.y },
            { x: this.#pointCurrent.x, y: this.#pointCurrent.y }
        ];
        const transformedPoints = points.map(pt => this.#mapWorker.geometryUtilities.transformPoint(pt, scale, translation));
        const layer = this.#mapWorker.map.getActiveLayer();
        layer.selectByPoints(this.#mapWorker.renderingContext, this.#mapWorker.map, transformedPoints, this.#isCtrlPressed);
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
        const pathData = `M ${bounds.x},${bounds.y} l ${bounds.width},0 0,${bounds.height} ${-bounds.width},0 z`;
        const selectionPath = new Path2D(pathData);
        const layer = this.#mapWorker.map.getActiveLayer();
        layer.selectByPath(this.#mapWorker.renderingContext, bounds, selectionPath, this.#isCtrlPressed);
    }
}
