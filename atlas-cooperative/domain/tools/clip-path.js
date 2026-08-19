
export function createToolModel() {
    return new ClipPathTool();
}

class ClipPathTool {

    // fields
    #mapWorker;
    #pointDown;
    #points;
    #path;
    #selectionUtilities;
    #isClipModeOn;

    // methods
    async onActivate(mapWorker) {
        this.#mapWorker = mapWorker;
        if (this.#mapWorker.map) {
            this.#mapWorker.map.addEventListener("ChangeEvent", this.handleMapChange);
        }
        this.#selectionUtilities = this.#mapWorker.createSelectionUtilities();
        this.#isClipModeOn = this.#hasSelection();
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
        }
    }

    handleMapChange = async (change) => {
        this.#selectionUtilities.selectionBounds = null;
        this.#isClipModeOn = this.#hasSelection();
    }

    // helpers
    #onPointerDown(eventData) {
        if (eventData && eventData.button === 0) {
            this.#pointDown = { x: eventData.offsetX, y: eventData.offsetY };
            this.#points = [];
            this.#selectionUtilities.activityState = "Select";
            if (this.#selectionUtilities.activityState === "Select") {
                this.#selectDown(eventData);
            }
        }
    }

    async #onPointerMove(eventData) {
        if (eventData) {
            if (this.#selectionUtilities.activityState === "Select") {
                this.#selectMove(eventData);
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

    async #selectUp(eventData) {
        this.#drawSelectionLine(eventData.offsetX, eventData.offsetY);
        this.#drawSelectionLine(this.#pointDown.x, this.#pointDown.y);
        this.#points.push({ x: eventData.offsetX, y: eventData.offsetY });
        if (this.#isClipModeOn) {
            this.#clipSelections();
        }
        else {
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
        }
        this.#selectionUtilities.resetSelectionBounds(this.#mapWorker);
        await this.#mapWorker.renderMap();
    }

    #selectByPoints() {
        const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
        const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
        const points = this.#points.map(pt => this.#mapWorker.geometryUtilities.transformPoint(pt, scale, translation));
        const layer = this.#mapWorker.map.getActiveLayer();
        layer.selectByPoints(this.#mapWorker.renderingContext, this.#mapWorker.map, points, false);
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
        layer.selectByPath(this.#mapWorker.geometryUtilities, selectionBounds, selectionPath, false, true);
    }

    #drawSelectionLine(x, y) {
        this.#path.lineTo(x, y);
        this.#mapWorker.strokeClipPath(this.#path);
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

    #clipSelections() {
        const layer = this.#mapWorker.map.getActiveLayer();
        const mapItemGroups = layer.mapItemGroups.filter(mig => mig.selectionStatus);
        const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
        const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
        const start = this.#mapWorker.geometryUtilities.transformPoint({ x: this.#pointDown.x, y: this.#pointDown.y }, scale, translation);
        let pathPoints = [];
        let lastPoint = this.#pointDown;
        for (const point of this.#points) {
            pathPoints.push({ x: point.x - lastPoint.x, y: point.y - lastPoint.y });
            lastPoint = point;
        }
        pathPoints = pathPoints.map(pt => this.#mapWorker.geometryUtilities.transformPoint(pt, scale));

        const bounds = this.#mapWorker.geometryUtilities.getPathBounds(start, pathPoints);
        if (bounds.height < 5 || bounds.width < 5) {
            return;
        }

        const selectionPath = {
            start: start,
            transits: pathPoints
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
