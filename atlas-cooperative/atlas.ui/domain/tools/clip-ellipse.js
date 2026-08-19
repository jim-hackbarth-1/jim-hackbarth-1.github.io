
export function createToolModel() {
    return new ClipEllipseTool();
}

class ClipEllipseTool {

    // fields
    #mapWorker;
    #pointDown;
    #pointCurrent;
    #selectionUtilities;
    #isSnapToOverlayModeOn;
    #isClipModeOn;

    // methods
    async onActivate(mapWorker) {
        this.#mapWorker = mapWorker;
        if (this.#mapWorker.map) {
            this.#mapWorker.map.addEventListener("ChangeEvent", this.handleMapChange);
        }
        this.#selectionUtilities = this.#mapWorker.createSelectionUtilities();
        this.#initializeToolOptions();
        this.#isClipModeOn = this.#hasSelection();
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
        }
    }

    handleMapChange = async (change) => {
        this.#selectionUtilities.selectionBounds = null;
        this.#isClipModeOn = this.#hasSelection();
    }

    // helpers
    #updateToolOptionValue(name, value, notifyMapWorker) {
        if (name == "SnapToOverlay") {
            this.#isSnapToOverlayModeOn = value;
        }
        if (notifyMapWorker) {
            this.#mapWorker.setToolOptionValue(name, value);
        }
    }

    #initializeToolOptions() {
        this.#mapWorker.initializeToolOptions(["SnapToOverlay"]);
        this.#isSnapToOverlayModeOn = this.#mapWorker.getToolOption("SnapToOverlay").isToggledOn;
    }

    #onPointerDown(eventData) {
        if (eventData && eventData.button === 0) {

            if (this.#isClipModeOn) {
                let pointDown = { x: eventData.offsetX, y: eventData.offsetY };
                if (this.#isSnapToOverlayModeOn) {
                    let mapPoint = this.#transformCanvasPoint(pointDown.x, pointDown.y);
                    mapPoint = this.#mapWorker.map.overlay.getNearestOverlayPoint(mapPoint);
                    pointDown = this.#transformMapPoint(mapPoint.x, mapPoint.y);
                }
                this.#pointDown = pointDown;
            }
            else {
                this.#pointDown = { x: eventData.offsetX, y: eventData.offsetY };
            }

            this.#selectionUtilities.activityState = "Select";
            if (this.#selectionUtilities.activityState === "Select") {
                this.#selectDown(eventData);
            }
        }
    }

    async #onPointerMove(eventData) {
        if (eventData) {
            if (this.#selectionUtilities.activityState === "Select") {
                await this.#selectMove(eventData);
            }
        }
    }

    async #onPointerUp(eventData) {
        if (eventData) {
            if (this.#selectionUtilities.activityState === "Select") {
                await this.#selectUp(eventData);
            }
        }
        this.#selectionUtilities.activityState = "Default";
    }

    async #onKeyDown(eventData) {
        if (eventData.altKey && eventData.key?.toLowerCase() == "o" && !eventData.repeat) {
            this.#updateToolOptionValue("SnapToOverlay", !this.#isSnapToOverlayModeOn, true);
        }
    }

    #selectDown(eventData) {
        this.#mapWorker.renderingContext.setLineDash([5, 10]);
        this.#pointCurrent = { x: eventData.offsetX, y: eventData.offsetY };
    }

    async #selectMove(eventData) {
        if (this.#isClipModeOn) {
            let pointCurrent = { x: eventData.offsetX, y: eventData.offsetY };
            if (this.#isSnapToOverlayModeOn) {
                let mapPoint = this.#transformCanvasPoint(pointCurrent.x, pointCurrent.y);
                mapPoint = this.#mapWorker.map.overlay.getNearestOverlayPoint(mapPoint);
                pointCurrent = this.#transformMapPoint(mapPoint.x, mapPoint.y);
            }
            this.#pointCurrent = pointCurrent;
        }
        else {
            this.#pointCurrent = { x: eventData.offsetX, y: eventData.offsetY };
        }
        await this.#mapWorker.renderMap({ quickRender: true });
        this.#mapWorker.renderingContext.resetTransform();
        const startX = this.#pointDown.x;
        const startY = this.#pointDown.y;
        const currentX = this.#pointCurrent.x;
        const currentY = this.#pointCurrent.y;
        const rect = new Path2D(`M ${startX},${startY} L ${startX},${currentY} ${currentX},${currentY} ${currentX},${startY} z`);
        const ellipseXStart = (currentX + startX) / 2;
        const ellipseYStart = startY;
        const xRadius = Math.abs((currentX - startX) / 2);
        const yRadius = Math.abs((currentY - startY) / 2);
        const end = (currentY < startY) ? -2 : 2;
        const ellipse = new Path2D(`M ${ellipseXStart},${ellipseYStart} a ${xRadius} ${yRadius} 0 0 0 0 ${end * yRadius} a ${xRadius} ${yRadius} 0 0 0 0 ${-end * yRadius} z`);
        this.#mapWorker.strokeClipPath(ellipse); 
    }

    async #selectUp(eventData) {
        if (this.#isClipModeOn) {
            let pointCurrent = { x: eventData.offsetX, y: eventData.offsetY };
            if (this.#isSnapToOverlayModeOn) {
                let mapPoint = this.#transformCanvasPoint(pointCurrent.x, pointCurrent.y);
                mapPoint = this.#mapWorker.map.overlay.getNearestOverlayPoint(mapPoint);
                pointCurrent = this.#transformMapPoint(mapPoint.x, mapPoint.y);
            }
            this.#pointCurrent = pointCurrent;
        }
        else {
            this.#pointCurrent = { x: eventData.offsetX, y: eventData.offsetY };
        }
        if (this.#isClipModeOn) {
            this.#clipSelections();
        }
        else {
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
        }
        this.#selectionUtilities.resetSelectionBounds(this.#mapWorker);
        await this.#mapWorker.renderMap();
    }

    #selectByPoints(scale, translation) {
        const points = [
            { x: this.#pointDown.x, y: this.#pointDown.y },
            { x: this.#pointCurrent.x, y: this.#pointCurrent.y }
        ];
        const transformedPoints = points.map(pt => this.#mapWorker.geometryUtilities.transformPoint(pt, scale, translation));
        const layer = this.#mapWorker.map.getActiveLayer();
        layer.selectByPoints(this.#mapWorker.renderingContext, this.#mapWorker.map, transformedPoints, false);
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
            start: start,
            transits: [
                { x: bounds.width, y: 0 },
                { x: 0, y: bounds.height },
                { x: -bounds.width, y: 0 }
            ]
        };

        const layer = this.#mapWorker.map.getActiveLayer();
        layer.selectByPath(this.#mapWorker.geometryUtilities, bounds, selectionPath, false, true);
    }

    #hasSelection() {
        if (this.#mapWorker.map) {
            const layer = this.#mapWorker.map.getActiveLayer();
            if (layer) {
                return layer.mapItemGroups.some(mig => mig.selectionStatus);
            }
        }
        return false;
    }

    #transformMapPoint(x, y) {
        const scale = { x: this.#mapWorker.map.zoom, y: this.#mapWorker.map.zoom };
        const translation = { x: this.#mapWorker.map.pan.x, y: this.#mapWorker.map.pan.y };
        return {
            x: (x + translation.x) * scale.x,
            y: (y + translation.y) * scale.y
        };
    }

    #transformCanvasPoint(x, y) {
        const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
        const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
        return this.#mapWorker.geometryUtilities.transformPoint({ x: x, y: y }, scale, translation);
    }

    #clipSelections() {
        const layer = this.#mapWorker.map.getActiveLayer();
        const mapItemGroups = layer.mapItemGroups.filter(mig => mig.selectionStatus);
        const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
        const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
        const xStart = (this.#pointCurrent.x + this.#pointDown.x) / 2;
        const yStart = this.#pointDown.y;
        const start = this.#mapWorker.geometryUtilities.transformPoint({ x: xStart, y: yStart }, scale, translation);
        const xRadius = Math.abs((this.#pointCurrent.x - this.#pointDown.x) / 2);
        const yRadius = Math.abs((this.#pointCurrent.y - this.#pointDown.y) / 2);
        const radii = this.#mapWorker.geometryUtilities.transformPoint({ x: xRadius, y: yRadius }, scale);
        if (this.#pointDown.y > this.#pointCurrent.y) {
            start.y -= 2 * yRadius;
        }
        const transits = [
            {
                end: { x: -radii.x, y: radii.y },
                center: { x: 0, y: radii.y },
                radii: { x: radii.x, y: radii.y },
                rotationAngle: 0,
                sweepFlag: 0
            },
            {
                end: { x: radii.x, y: radii.y },
                center: { x: radii.x, y: 0 },
                radii: { x: radii.x, y: radii.y },
                rotationAngle: 0,
                sweepFlag: 0
            },
            {
                end: { x: radii.x, y: -radii.y },
                center: { x: 0, y: -radii.y },
                radii: { x: radii.x, y: radii.y },
                rotationAngle: 0,
                sweepFlag: 0
            },
            {
                end: { x: -radii.x, y: -radii.y },
                center: { x: -radii.x, y: 0 },
                radii: { x: radii.x, y: radii.y },
                rotationAngle: 0,
                sweepFlag: 0
            }
        ];
        const bounds = this.#mapWorker.geometryUtilities.getPathBounds(start, transits);
        if (bounds.height < 5 || bounds.width < 5) {
            return;
        }
        const selectionPath = {
            start: start,
            transits: transits
        };
        this.#mapWorker.map.startChangeSet();
        let mapItemPaths = [];
        const changes = [];
        for (const mapItemGroup of mapItemGroups) {
            for (const mapItem of mapItemGroup.mapItems) {
                const primaryPaths = mapItem.paths.map(p => p.getData());
                const hasFills = this.#hasFills(mapItem);
                const setOperationPaths = this.#mapWorker.setUtilities.getExclusionAll(primaryPaths, [selectionPath], hasFills);
                mapItemPaths = [];
                for (const setOperationPath of setOperationPaths) {
                    mapItemPaths.push(this.#mapWorker.createPath(setOperationPath));
                }
                if (mapItemPaths.length > 0) {
                    let mapItemData = mapItem.getData();
                    changes.push({
                        changeType: "Edit",
                        changeObjectType: "MapItem",
                        propertyName: "paths",
                        oldValue: mapItemData.paths,
                        newValue: setOperationPaths,
                        layerName: layer.name,
                        mapItemGroupId: mapItemGroup.id,
                        mapItemId: mapItem.id
                    });
                    mapItem.paths = mapItemPaths;
                }
            }
        }
        const changeSet = this.#mapWorker.createChangeSet(changes);
        this.#mapWorker.map.completeChangeSet(changeSet);
    }

    #hasFills(mapItem) {
        const mapItemTemplate = this.#mapWorker.getMapItemTemplate(mapItem);
        if (mapItemTemplate) {
            return (mapItemTemplate.fills.length > 0);
        }
        return false;
    }
}
