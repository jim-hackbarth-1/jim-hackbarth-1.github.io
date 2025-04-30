
export function createToolModel() {
    return new DrawArcTool();
}

class DrawArcTool {

    // fields
    #mapWorker;
    #xStart;
    #yStart;
    #xCurrent;
    #yCurrent;
    #isDrawing;
    #isShiftPressed;
    #isLockModeOn;
    #isSnapToOverlayModeOn;

    // methods
    async onActivate(mapWorker) {
        this.#mapWorker = mapWorker;
        this.#isShiftPressed = false;
        this.#initializeToolOptions();    
    }

    async onApplyToolOption(toolOptionInfo) {
        this.#updateToolOptionValue(toolOptionInfo.name, toolOptionInfo.value, false);
    }

    async handleClientEvent(clientEvent) {
        const eventData = clientEvent?.eventData;
        switch (clientEvent?.eventType) {
            case "pointerdown":
                await this.#onPointerDown(eventData);
                break;
            case "pointermove":
                await this.#onPointerMove(eventData);
                break;
            case "pointerup":
                await this.#onPointerUp(eventData);
                break;
            case "keydown":
                this.#onKeyDown(eventData);
                break;
            case "keyup":
                this.#onKeyUp(eventData);
                break;
        }
    }

    // helpers
    #updateToolOptionValue(name, value, notifyMapWorker) {
        if (name == "LockMode") {
            this.#isLockModeOn = value;
        }
        if (name == "SnapToOverlay") {
            this.#isSnapToOverlayModeOn = value;
        }
        if (notifyMapWorker) {
            this.#mapWorker.setToolOptionValue(name, value);
        }
    }

    #initializeToolOptions() {
        this.#mapWorker.initializeToolOptions(["LockMode", "SnapToOverlay"]);
        this.#isLockModeOn = this.#mapWorker.getToolOption("LockMode").isToggledOn;
        this.#isSnapToOverlayModeOn = this.#mapWorker.getToolOption("SnapToOverlay").isToggledOn;
    }

    async #onPointerDown(eventData) {
        if (eventData && eventData.button === 0 && this.#mapWorker.activeMapItemTemplate) {
            this.#drawStart(eventData);
        }
    }

    async #onPointerMove(eventData) {
        if (eventData && this.#isDrawing) {
            await this.#draw(eventData);
        }
    }

    async #onPointerUp(eventData) {
        if (this.#isDrawing) {
            await this.#drawEnd();
        }
    }

    #onKeyDown(eventData) {
        if (eventData.key == "Shift") {
            this.#isShiftPressed = true;
        }
        if (eventData.altKey && eventData.key?.toLowerCase() == "o" && !eventData.repeat) {
            this.#updateToolOptionValue("SnapToOverlay", !this.#isSnapToOverlayModeOn, true);
        }
        if (eventData.altKey && eventData.key?.toLowerCase() == "l" && !eventData.repeat) {
            this.#updateToolOptionValue("LockMode", !this.#isLockModeOn, true);
        }
    }

    #onKeyUp(eventData) {
        if (eventData.key == "Shift") {
            this.#isShiftPressed = false;
        }
    }

    #drawStart(eventData) {
        this.#mapWorker.renderingContext.setLineDash([5, 10]);
        let start = { x: eventData.offsetX, y: eventData.offsetY };
        if (this.#isSnapToOverlayModeOn) {
            let mapPoint = this.#transformCanvasPoint(start.x, start.y);
            mapPoint = this.#mapWorker.map.overlay.getNearestOverlayPoint(mapPoint);
            start = this.#transformMapPoint(mapPoint.x, mapPoint.y);
        }
        this.#xStart = start.x;
        this.#yStart = start.y;
        this.#setCurrentPoint(start);
        this.#isDrawing = true;
    }

    async #draw(eventData) {
        let point = { x: eventData.offsetX, y: eventData.offsetY };
        if (this.#isSnapToOverlayModeOn) {
            let mapPoint = this.#transformCanvasPoint(point.x, point.y);
            mapPoint = this.#mapWorker.map.overlay.getNearestOverlayPoint(mapPoint);
            point = this.#transformMapPoint(mapPoint.x, mapPoint.y);
        }
        this.#setCurrentPoint(point);
        await this.#drawArc();
    }

    #setCurrentPoint(point) {
        this.#xCurrent = point.x;
        if (this.#isShiftPressed || this.#isLockModeOn) {
            const xDelta = Math.abs(this.#xCurrent - this.#xStart);
            if (point.y < this.#yStart) {
                this.#yCurrent = this.#yStart - xDelta;
            }
            else {
                this.#yCurrent = this.#yStart + xDelta;
            }
        }
        else {
            this.#yCurrent = point.y;
        }
    }

    async #drawEnd() {
        this.#isDrawing = false;
        await this.#addMapItemGroup();
    }

    async #drawArc() {
        await this.#mapWorker.renderMap();
        this.#mapWorker.renderingContext.restore();
        this.#mapWorker.renderingContext.resetTransform();
        const rect = new Path2D(`M ${this.#xStart},${this.#yStart} L ${this.#xStart},${this.#yCurrent} ${this.#xCurrent},${this.#yCurrent} ${this.#xCurrent},${this.#yStart} z`);
        const xRadius = Math.abs(this.#xCurrent - this.#xStart);
        const yRadius = Math.abs(this.#yCurrent - this.#yStart);
        let sweepFlag = 0;
        let end = { x: this.#xCurrent - this.#xStart, y: this.#yCurrent - this.#yStart };
        if (this.#xStart < this.#xCurrent && this.#yStart < this.#yCurrent) {
            sweepFlag = 1;
        }
        if (this.#xStart > this.#xCurrent && this.#yStart > this.#yCurrent) {
            sweepFlag = 1;
        }
        const arc = new Path2D(`M ${this.#xStart},${this.#yStart} a ${xRadius} ${yRadius} 0 0 ${sweepFlag} ${end.x} ${end.y} l ${-end.x},0 0,${-end.y} z`);
        this.#mapWorker.renderingContext.strokeStyle = "darkgray";
        this.#mapWorker.renderingContext.lineWidth = 1;
        this.#mapWorker.renderingContext.stroke(rect);
        this.#mapWorker.renderingContext.lineWidth = 3;
        this.#mapWorker.renderingContext.stroke(arc);
        this.#mapWorker.renderingContext.strokeStyle = "white";
        this.#mapWorker.renderingContext.lineWidth = 1;
        this.#mapWorker.renderingContext.stroke(arc);
    }

    async #addMapItemGroup() {
        if (this.#mapWorker.map && this.#mapWorker.activeMapItemTemplate) {
            const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
            const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
            const start = this.#mapWorker.geometryUtilities.transformPoint(
                { x: this.#xStart, y: this.#yStart }, scale, translation);
            const end = this.#mapWorker.geometryUtilities.transformPoint(
                { x: this.#xCurrent - this.#xStart, y: this.#yCurrent - this.#yStart }, scale);
            const radii = this.#mapWorker.geometryUtilities.transformPoint(
                { x: Math.abs(this.#xCurrent - this.#xStart), y: Math.abs(this.#yCurrent - this.#yStart) }, scale);
            let sweepFlag = 0;
            if (end.x > 0 && end.y > 0) {
                sweepFlag = 1;
            }
            if (end.x < 0 && end.y < 0) {
                sweepFlag = 1;
            }
            const transits = [
                {
                    end: end,
                    center: { x: 0, y: end.y },
                    radii: radii,
                    rotationAngle: 0,
                    sweepFlag: sweepFlag
                },
                { x: -end.x, y: 0 }
            ];
            const bounds = this.#mapWorker.geometryUtilities.getPathBounds(start, transits);
            if (bounds.height < 5 || bounds.width < 5) {
                await this.#mapWorker.renderMap();
                return;
            }
            const mapItemData = {
                mapItemTemplateRef: this.#mapWorker.activeMapItemTemplate.ref,
                paths: [{
                    start: start,
                    transits: transits,
                    inView: true
                }],
                zGroup: this.#mapWorker.activeMapItemTemplate.defaultZGroup,
                captionText: this.#mapWorker.activeMapItemTemplate.caption.defaultText,
                isCaptionVisible: this.#mapWorker.activeMapItemTemplate.caption.defaultText.length > 0
            };
            const data = {
                mapItems: [mapItemData]
            };
            const mapItemGroup = this.#mapWorker.createMapItemGroup(data);
            this.#mapWorker.map.getActiveLayer().addMapItemGroup(mapItemGroup);
        }
        await this.#mapWorker.renderMap();
    }

    #transformCanvasPoint(x, y) {
        const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
        const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
        return this.#mapWorker.geometryUtilities.transformPoint({ x: x, y: y }, scale, translation);
    }

    #transformMapPoint(x, y) {
        const scale = { x: this.#mapWorker.map.zoom, y: this.#mapWorker.map.zoom };
        const translation = { x: this.#mapWorker.map.pan.x, y: this.#mapWorker.map.pan.y };
        return this.#mapWorker.geometryUtilities.transformPoint({ x: x, y: y }, scale, translation);
    }
}
