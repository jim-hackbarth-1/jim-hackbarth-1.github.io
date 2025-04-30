
export function createToolModel() {
    return new DrawPolytransitTool();
}

class DrawPolytransitTool {

    // fields
    #mapWorker;
    #start;
    #last;
    #candidate;
    #points;
    #transits;
    #isShiftPressed;
    #isLockModeOn;
    #isArcModeOn;
    #sweepFlag;
    #isSnapToOverlayModeOn;

    // methods
    async onActivate(mapWorker) {
        this.#mapWorker = mapWorker;
        if (this.#mapWorker.map) {
            this.#mapWorker.map.addEventListener("ChangeEvent", this.handleMapChange);
        }
        this.#isShiftPressed = false;
        this.#initializeToolOptions();  
        this.#initializeTransitInfo();
    }

    async onApplyToolOption(toolOptionInfo) {
        await this.#updateToolOptionValue(toolOptionInfo.name, toolOptionInfo.value, false);
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
            case "keydown":
                await this.#onKeyDown(eventData);
                break;
            case "keyup":
                this.#onKeyUp(eventData);
                break;
        }
    }

    handleMapChange = async (change) => {
        this.#initializeTransitInfo();
        await this.#drawTransitInfo();
    }

    // helpers
    async #updateToolOptionValue(name, value, notifyMapWorker) {
        if (name == "AcceptChanges") {
            await this.#addMapItemGroup();
            return;
        }
        if (name == "ArcMode") {
            this.#isArcModeOn = value;
            await this.#drawCandidate();
        }
        if (name == "CancelChanges") {
            this.#initializeTransitInfo();
            await this.#drawTransitInfo();
            return;
        }
        if (name == "LockMode") {
            this.#isLockModeOn = value;
        }
        if (name == "RemoveLastPoint") {
            if (this.#points.length > 1) {
                this.#points.pop();
                this.#transits.pop();
                this.#last = this.#points[this.#points.length - 1];
            }
            await this.#drawTransitInfo();
            return;
        }
        if (name == "SnapToOverlay") {
            this.#isSnapToOverlayModeOn = value;
        }
        if (name == "SweepFlag") {
            this.#sweepFlag = value ? 1 : 0;
            await this.#drawCandidate();
        }
        if (notifyMapWorker) {
            this.#mapWorker.setToolOptionValue(name, value);
        }
    }

    #initializeToolOptions() {
        this.#mapWorker.initializeToolOptions(["AcceptChanges", "CancelChanges", "LockMode", "SnapToOverlay"]);
        this.#isLockModeOn = this.#mapWorker.getToolOption("LockMode").isToggledOn;
        this.#isSnapToOverlayModeOn = this.#mapWorker.getToolOption("SnapToOverlay").isToggledOn;
        const arcMode = this.#mapWorker.getToolOption("ArcMode");
        if (arcMode) {
            arcMode.isVisible = true;
        }
        else {
            this.#mapWorker.addToolOption({
                name: "ArcMode",
                label: "Arc mode",
                keyboardEventInfo: { key: "A", requiresAltKey: true },
                description: "Draw arc transits",
                typeName: "BooleanToolOption",
                isVisible: true,
                isToggledOn: false
            });
        }
        const sweepFlag = this.#mapWorker.getToolOption("SweepFlag");
        if (sweepFlag) {
            sweepFlag.isVisible = true;
        }
        else {
            this.#mapWorker.addToolOption({
                name: "SweepFlag",
                label: "Sweep flag",
                keyboardEventInfo: { key: "S", requiresAltKey: true },
                description: "Draw arcs counter-clockwise around center",
                typeName: "BooleanToolOption",
                isVisible: true,
                isToggledOn: false
            });
        }
        const removeLastPoint = this.#mapWorker.getToolOption("RemoveLastPoint");
        if (removeLastPoint) {
            removeLastPoint.isVisible = true;
        }
        else {
            this.#mapWorker.addToolOption({
                name: "RemoveLastPoint",
                label: "Remove last point",
                keyboardEventInfo: { key: "Backspace", requiresAltKey: true },
                description: "Remove the last poly-transit point",
                isVisible: true
            });
        }
        this.#mapWorker.postChangeToolOptionsMessage();
    }

    #initializeTransitInfo() {
        this.#start = null;
        this.#last = null;
        this.#candidate = null;
        this.#points = [];
        this.#transits = [];
    }

    async #onPointerDown(eventData) {
        if (eventData && eventData.button === 0 && this.#mapWorker.activeMapItemTemplate) {
            await this.#addTransit(eventData);
        }
    }

    async #onPointerMove(eventData) {
        if (eventData && this.#last) {
            this.#setCandidate(eventData);
            await this.#drawCandidate();
        }
    }

    async #onKeyDown(eventData) {
        if (eventData.key == "Shift") {
            this.#isShiftPressed = true;
        }
        if (eventData.altKey && eventData.key?.toLowerCase() == "o" && !eventData.repeat) {
            await this.#updateToolOptionValue("SnapToOverlay", !this.#isSnapToOverlayModeOn, true);
        }
        if (eventData.altKey && eventData.key?.toLowerCase() == "l" && !eventData.repeat) {
            await this.#updateToolOptionValue("LockMode", !this.#isLockModeOn, true);
        }
        if (eventData.altKey && eventData.key?.toLowerCase() == "a" && !eventData.repeat) {
            await this.#updateToolOptionValue("ArcMode", !this.#isArcModeOn, true);
        }
        if (eventData.altKey && eventData.key?.toLowerCase() == "s" && !eventData.repeat) {
            const sweepFlag = (this.#sweepFlag == 1) ? 0 : 1;
            await this.#updateToolOptionValue("SweepFlag", sweepFlag, true);
        }
        if (eventData.altKey && eventData.key == "Backspace") {
            await this.#updateToolOptionValue("RemoveLastPoint", null, false);
        }
        if (eventData.altKey && eventData.key == "Escape") {
            await this.#updateToolOptionValue("CancelChanges", null, false);
        }
        if (eventData.altKey && eventData.key == "Enter") {
            await this.#updateToolOptionValue("AcceptChanges", null, false);
        }
    }

    #onKeyUp(eventData) {
        if (eventData.key == "Shift") {
            this.#isShiftPressed = false;
        }
    }

    async #addTransit(eventData) {
        if (!this.#start) {
            this.#start = this.#getPoint({ x: eventData.offsetX, y: eventData.offsetY });
            this.#last = this.#start;
            this.#points.push(this.#start);
            return;
        }
        const next = this.#getPoint({ x: eventData.offsetX, y: eventData.offsetY }, this.#last);
        const transit = this.#getTransit(this.#last ?? this.#start, next);
        this.#transits.push(transit);
        this.#points.push(next);
        this.#last = next;
        await this.#drawTransitInfo();
    }

    #getPoint(pointIn, previousPoint) {
        let point = pointIn;
        if (previousPoint && (this.#isLockModeOn || this.#isShiftPressed)) {
            let x = point.x;
            let y = point.y;
            const xDelta = point.x - previousPoint.x;
            const xSign = (xDelta < 0) ? -1 : 1;
            const yDelta = point.y - previousPoint.y;
            const ySign = (yDelta < 0) ? -1 : 1;
            const xDeltaAbs = Math.abs(xDelta);
            const yDeltaAbs = Math.abs(yDelta);
            if (xDeltaAbs > yDeltaAbs) {
                y = previousPoint.y + xDeltaAbs * ySign;
                if ((xDeltaAbs > 2 * yDeltaAbs) && !this.#isArcModeOn) {
                    y = previousPoint.y;
                }
            }
            else {
                x = previousPoint.x + yDeltaAbs * xSign;
                if ((yDeltaAbs > 2 * xDeltaAbs) && !this.#isArcModeOn) {
                    x = previousPoint.x;
                }
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

    #getTransit(startIn, endIn) {
        const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
        const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
        const start = this.#mapWorker.geometryUtilities.transformPoint(startIn, scale, translation);
        const end = this.#mapWorker.geometryUtilities.transformPoint(endIn, scale, translation);
        let transit = { x: end.x - start.x, y: end.y - start.y };
        if (this.#isArcModeOn && Math.abs(transit.x) > 5 && Math.abs(transit.y) > 5) {
            let sweepFlag = 0;
            if (end.x > 0 && end.y > 0) {
                sweepFlag = 1;
            }
            if (end.x < 0 && end.y < 0) {
                sweepFlag = 1;
            }
            if (this.#sweepFlag == 1) {
                sweepFlag = sweepFlag == 1 ? 0 : 1;
            }
            let center = { x: 0, y: transit.y };
            if (sweepFlag == 1) {
                center = { x: transit.x, y: 0 };
                if ((transit.x > 0 && transit.y > 0) || (transit.x < 0 && transit.y < 0)) {
                    center = { x: 0, y: transit.y };
                }
            }
            else {
                if ((transit.x > 0 && transit.y > 0) || (transit.x < 0 && transit.y < 0)) {
                    center = { x: transit.x, y: 0 };
                }
            }
            const radii = { x: Math.abs(transit.x), y: Math.abs(transit.y) };
            transit = {
                end: transit,
                center: center,
                radii: radii,
                rotationAngle: 0,
                sweepFlag: sweepFlag
            };
        }
        return transit;
    }

    async #drawTransitInfo() {
        await this.#mapWorker.renderMap();
        const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
        const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
        if (this.#start && this.#transits.length > 0) {
            const start = this.#mapWorker.geometryUtilities.transformPoint(this.#start, scale, translation);
            const path = this.#mapWorker.createPath({
                start: start,
                transits: this.#transits
            });
            this.#drawPath(new Path2D(path.getPathInfo()));
        }
        const size = 2 / this.#mapWorker.map.zoom;
        for (const point of this.#points) {
            const scaledPoint = this.#mapWorker.geometryUtilities.transformPoint(point, scale, translation);
            const rect = new Path2D(`M ${scaledPoint.x},${scaledPoint.y} m -${size},-${size} l ${size * 2},0 0,${size * 2} -${size * 2},0 z`);
            this.#drawPath(rect);
        }
    }

    #drawPath(path) {
        this.#mapWorker.renderingContext.strokeStyle = "darkgray";
        this.#mapWorker.renderingContext.lineWidth = 3;
        this.#mapWorker.renderingContext.stroke(path);
        this.#mapWorker.renderingContext.strokeStyle = "white";
        this.#mapWorker.renderingContext.lineWidth = 1;
        this.#mapWorker.renderingContext.stroke(path);
    }

    #setCandidate(eventData) {
        this.#candidate = this.#getPoint({ x: eventData.offsetX, y: eventData.offsetY }, this.#last);
    }

    async #drawCandidate() {
        await this.#drawTransitInfo();
        if (this.#candidate) {
            const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
            const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
            const last = this.#mapWorker.geometryUtilities.transformPoint(this.#last, scale, translation);
            let transit = this.#getTransit(this.#last, this.#candidate);
            const path = this.#mapWorker.createPath({
                start: last,
                transits: [transit]
            });
            this.#drawPath(new Path2D(path.getPathInfo()));
        }
    }

    async #addMapItemGroup() {
        if (this.#mapWorker.map && this.#mapWorker.activeMapItemTemplate && this.#start) {
            const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
            const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
            const start = this.#mapWorker.geometryUtilities.transformPoint(this.#start, scale, translation);
            const bounds = this.#mapWorker.geometryUtilities.getPathBounds(start, this.#transits);
            if (bounds.height > 5 && bounds.width > 5) {
                const mapItemData = {
                    mapItemTemplateRef: this.#mapWorker.activeMapItemTemplate.ref,
                    paths: [{
                        start: start,
                        transits: this.#transits,
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
        }
        this.#initializeTransitInfo();
        await this.#drawTransitInfo();
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
