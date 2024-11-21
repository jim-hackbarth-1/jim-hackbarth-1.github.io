
export function createToolModel() {
    return new SelectPathTool();
}

class SelectPathTool {

    // fields
    #mapWorker;
    #activityState;
    #cursor;
    #pointDown;
    #points;
    #selectionBounds;
    #pathDark;
    #pathLight;
    #selectionStartData;
    #changeReferenceBounds;

    // methods
    async onActivate(mapWorker) {
        this.#mapWorker = mapWorker;
        if (this.#mapWorker.map) {
            this.#mapWorker.map.addEventListener("afterChangeEvent", this.handleMapChange);
        }
        this.#activityState = ActivityState.Default;
        this.#cursor = "Default";
    }

    async handleCanvasEvent(canvasEvent) {
        const eventData = canvasEvent?.eventData;
        switch (canvasEvent?.canvasEventType) {
            case "pointerdown":
                this.#onPointerDown(eventData);
                break;
            case "pointermove":
                this.#onPointerMove(eventData);
                break;
            case "pointerup":
                this.#onPointerUp(eventData);
                break;
        }
    }

    handleMapChange = async (change) => {
        this.#selectionBounds = null;
    }

    async onCursorChange(cursor) {
        this.#cursor = cursor;
    }

    // helpers
    #onPointerDown(eventData) {
        if (eventData && eventData.button === 0) {
            this.#pointDown = { x: eventData.offsetX, y: eventData.offsetY };
            this.#points = [];
            this.#activityState = this.#getActivityState(eventData);
            if (this.#activityState === ActivityState.Select) {
                this.#selectDown(eventData);
            }
            if (this.#activityState === ActivityState.Move
                || this.#activityState === ActivityState.ResizeSE
                || this.#activityState === ActivityState.ResizeS
                || this.#activityState === ActivityState.ResizeSW
                || this.#activityState === ActivityState.ResizeW
                || this.#activityState === ActivityState.ResizeNW
                || this.#activityState === ActivityState.ResizeN
                || this.#activityState === ActivityState.ResizeNE
                || this.#activityState === ActivityState.ResizeE) {
                this.#startChange(eventData);
            }
            if (this.#activityState === ActivityState.Rotate) {
                this.#rotateDown(eventData);
            }
        }
    }

    #onPointerMove(eventData) {
        if (eventData) {
            if (this.#activityState === ActivityState.Default) {
                this.#setCursor(eventData);
            }
            if (this.#activityState === ActivityState.Select) {
                this.#selectMove(eventData);
            }
            if (this.#activityState === ActivityState.Move) {
                this.#moveMove(eventData);
            }
            if (this.#activityState === ActivityState.ResizeSE) {
                this.#resizeSEMove(eventData);
            }
            if (this.#activityState === ActivityState.ResizeS) {
                this.#resizeSMove(eventData);
            }
            if (this.#activityState === ActivityState.ResizeSW) {
                this.#resizeSWMove(eventData);
            }
            if (this.#activityState === ActivityState.ResizeW) {
                this.#resizeWMove(eventData);
            }
            if (this.#activityState === ActivityState.ResizeNW) {
                this.#resizeNWMove(eventData);
            }
            if (this.#activityState === ActivityState.ResizeN) {
                this.#resizeNMove(eventData);
            }
            if (this.#activityState === ActivityState.ResizeNE) {
                this.#resizeNEMove(eventData);
            }
            if (this.#activityState === ActivityState.ResizeE) {
                this.#resizeEMove(eventData);
            }
            if (this.#activityState === ActivityState.Rotate) {
                this.#rotateMove(eventData);
            }
        }
    }

    #onPointerUp(eventData) {
        if (eventData) {
            if (this.#activityState === ActivityState.Select) {
                this.#selectUp(eventData);
            }
            if (this.#activityState === ActivityState.Move) {
                this.#completeChange("Move");
            }
            if (this.#activityState === ActivityState.ResizeSE
                || this.#activityState === ActivityState.ResizeS
                || this.#activityState === ActivityState.ResizeSW
                || this.#activityState === ActivityState.ResizeW
                || this.#activityState === ActivityState.ResizeNW
                || this.#activityState === ActivityState.ResizeN
                || this.#activityState === ActivityState.ResizeNE
                || this.#activityState === ActivityState.ResizeE) {
                this.#completeChange("Resize");
            }
            if (this.#activityState === ActivityState.Rotate) {
                this.#completeChange("Rotate");
                this.#mapWorker.renderMap();
            }
        }
        this.#activityState = ActivityState.Default;
    }

    #getActivityState(eventData) {
        const point = this.#transformCanvasPoint(eventData.offsetX, eventData.offsetY);
        const selectionBoundsInfo = this.#getSelectionBoundsInfoForPoint(point);
        return selectionBoundsInfo?.boundsType ?? "Select";
    }

    #transformCanvasPoint(x, y) {
        const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
        const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
        return this.#mapWorker.transformPoint({ x: x, y: y }, scale, translation);
    }

    #getSelectionBoundsInfoForPoint(point) {
        return this.#getSelectionBoundsInfoForPointAndBoundsType(point, "Rotate")
            ?? this.#getSelectionBoundsInfoForPointAndBoundsType(point, "ResizeNW")
            ?? this.#getSelectionBoundsInfoForPointAndBoundsType(point, "ResizeN")
            ?? this.#getSelectionBoundsInfoForPointAndBoundsType(point, "ResizeNE")
            ?? this.#getSelectionBoundsInfoForPointAndBoundsType(point, "ResizeE")
            ?? this.#getSelectionBoundsInfoForPointAndBoundsType(point, "ResizeSE")
            ?? this.#getSelectionBoundsInfoForPointAndBoundsType(point, "ResizeS")
            ?? this.#getSelectionBoundsInfoForPointAndBoundsType(point, "ResizeSW")
            ?? this.#getSelectionBoundsInfoForPointAndBoundsType(point, "ResizeW")
            ?? this.#getSelectionBoundsInfoForPointAndBoundsType(point, "Move");
    }

    #getSelectionBoundsInfoForPointAndBoundsType(point, boundsType) {
        if (this.#selectionBounds) {
            for (const selectionBounds of this.#selectionBounds) {
                const bounds = this.#getBoundsToCheck(selectionBounds, boundsType);
                if (bounds
                    && point.x >= bounds.x
                    && point.x <= bounds.x + bounds.width
                    && point.y >= bounds.y
                    && point.y <= bounds.y + bounds.height) {
                    return {
                        selectionBounds: selectionBounds,
                        boundsType: boundsType
                    };
                }
            }
        }
        return null;
    }

    #getBoundsToCheck(selectionBounds, boundsType) {
        if (selectionBounds) {
            if (boundsType === "Rotate") {
                return selectionBounds.rotate;
            }
            if (boundsType === "ResizeNW") {
                return selectionBounds.resizeNW;
            }
            if (boundsType === "ResizeN") {
                return selectionBounds.resizeN;
            }
            if (boundsType === "ResizeNE") {
                return selectionBounds.resizeNE;
            }
            if (boundsType === "ResizeE") {
                return selectionBounds.resizeE;
            }
            if (boundsType === "ResizeSE") {
                return selectionBounds.resizeSE;
            }
            if (boundsType === "ResizeS") {
                return selectionBounds.resizeS;
            }
            if (boundsType === "ResizeSW") {
                return selectionBounds.resizeSW;
            }
            if (boundsType === "ResizeW") {
                return selectionBounds.resizeW;
            }
            if (boundsType === "Move") {
                return selectionBounds.move;
            }
        }
        return null;
    }

    #setCursor(eventData) {
        if (!this.#selectionBounds) {
            this.#resetSelectionBounds();
        }
        const point = this.#transformCanvasPoint(eventData.offsetX, eventData.offsetY);
        const selectionBoundsInfo = this.#getSelectionBoundsInfoForPoint(point);
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

    #resetSelectionBounds() {
        this.#selectionBounds = [];
        if (this.#mapWorker.renderingContext && this.#mapWorker.map) {
            const layer = this.#mapWorker.map.getActiveLayer();
            if (layer) {
                this.#selectionBounds = layer.getSelectionBounds(this.#mapWorker.map);
            }
        }
    }

    #startChange(eventData) {
        this.#selectionStartData = [];
        if (this.#mapWorker.map) {
            this.#mapWorker.map.startChange();
            const layer = this.#mapWorker.map.getActiveLayer();
            if (layer?.mapItems) {
                for (const mapItem of layer.mapItems) {
                    if (mapItem.isSelected && mapItem.paths) {
                        for (const path of mapItem.paths) {
                            this.#selectionStartData.push(this.#getSelectionStartPathData(mapItem, path));
                        }
                    }
                }
                this.#changeReferenceBounds = this.#getChangeReferenceBounds(eventData.offsetX, eventData.offsetY);
            }
        }
    }

    #getSelectionStartPathData(mapItem, path) {
        if (path.constructor.name === "PathArc") {
            return {
                mapItemId: mapItem.id,
                path: path,
                startingMapItemData: {
                    bounds: mapItem.getBounds()
                },
                startingPathData: {
                    start: path.start,
                    end: path.end,
                    center: path.center,
                    radii: path.radii
                }
            };
        }
        else {
            return {
                mapItemId: mapItem.id,
                path: path,
                startingMapItemData: {
                    bounds: mapItem.getBounds()
                },
                startingPathData: {
                    start: path.start,
                    points: path.points
                }
            };
        }
    }

    #getChangeReferenceBounds(x, y) {
        const point = this.#transformCanvasPoint(x, y);
        const boundsInfo = this.#getSelectionBoundsInfoForPointAndBoundsType(point, "Move");
        return boundsInfo.selectionBounds.move;
    }

    #completeChange(changeType) {
        const layer = this.#mapWorker.map.getActiveLayer();
        const change = this.#mapWorker.createChange({
            changeObjectType: "Layer",
            changeObjectRef: layer.name,
            changeType: changeType,
            changeData: this.#selectionStartData.map(s => ({ mapItemId: s.mapItemId, pathId: s.path.id, start: s.startingPathData }))
        });
        this.#mapWorker.map.completeChange(change);
        this.#resetSelectionBounds();
    }

    // selection helpers
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
                this.#selectMapItemsByPoints();
            }
            else {
                this.#selectMapItemsByPath();
            }
        }
        this.#resetSelectionBounds();
        this.#mapWorker.renderMap();
    }

    #selectMapItemsByPoints() {
        const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
        const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
        const points = this.#points.map(pt => this.#mapWorker.transformPoint(pt, scale, translation));
        const layer = this.#mapWorker.map.getActiveLayer();
        layer.selectMapItemsByPoints(this.#mapWorker.renderingContext, this.#mapWorker.map, points);
    }

    #selectMapItemsByPath() {
        const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
        const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
        const start = this.#mapWorker.transformPoint(this.#pointDown, scale, translation);
        const points = this.#points.map(pt => this.#mapWorker.transformPoint(pt, scale, translation));
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
        layer.selectMapItemsByPath(this.#mapWorker.renderingContext, selectionBounds, selectionPath);
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

    // move helpers
    #moveMove(eventData) {
        const dx = (eventData.offsetX - this.#pointDown.x) / this.#mapWorker.map.zoom;
        const dy = (eventData.offsetY - this.#pointDown.y) / this.#mapWorker.map.zoom;
        for (const selection of this.#selectionStartData) {
            selection.path.start = { x: selection.startingPathData.start.x + dx, y: selection.startingPathData.start.y + dy };
        }
        this.#mapWorker.renderMap();
    }

    // resize helpers
    #resizeSEMove(eventData) {
        const dx = (eventData.offsetX - this.#pointDown.x) / this.#mapWorker.map.zoom;
        const dy = (eventData.offsetY - this.#pointDown.y) / this.#mapWorker.map.zoom;
        const bounds = this.#changeReferenceBounds;
        const width = bounds.width;
        const height = bounds.height;
        const scaleX = (width + dx) / width;
        const scaleY = (height + dy) / height;
        for (const selection of this.#selectionStartData) {
            const originalBounds = selection.path.getBounds();
            if ((originalBounds.width < 15 && scaleX < 1) || (originalBounds.height < 15 && scaleY < 1)) {
                continue;
            }
            this.#scaleSelection(selection, scaleX, scaleY);
            const newBounds = selection.path.getBounds();
            const boundsDx = newBounds.x - originalBounds.x;
            const boundsDy = newBounds.y - originalBounds.y;
            selection.path.start = { x: selection.path.start.x - boundsDx, y: selection.path.start.y - boundsDy };
        }
        this.#mapWorker.renderMap();
    }

    #resizeSMove(eventData) {
        const dy = (eventData.offsetY - this.#pointDown.y) / this.#mapWorker.map.zoom;
        const bounds = this.#changeReferenceBounds;
        const height = bounds.height;
        const scale = (height + dy) / height;
        for (const selection of this.#selectionStartData) {
            const originalBounds = selection.path.getBounds();
            if (originalBounds.height < 15 && scale < 1) {
                continue;
            }
            this.#scaleSelection(selection, 1, scale);
            const newBounds = selection.path.getBounds();
            const boundsDy = newBounds.y - originalBounds.y;
            selection.path.start = { x: selection.path.start.x, y: selection.path.start.y - boundsDy };
        }
        this.#mapWorker.renderMap();
    }

    #resizeSWMove(eventData) {
        const dx = (this.#pointDown.x - eventData.offsetX) / this.#mapWorker.map.zoom;
        const dy = (eventData.offsetY - this.#pointDown.y) / this.#mapWorker.map.zoom;
        const bounds = this.#changeReferenceBounds;
        const width = bounds.width;
        const height = bounds.height;
        const scaleX = (width + dx) / width;
        const scaleY = (height + dy) / height;
        for (const selection of this.#selectionStartData) {
            const originalBounds = selection.path.getBounds();
            if ((originalBounds.width < 15 && scaleX < 1) || (originalBounds.height < 15 && scaleY < 1)) {
                continue;
            }
            this.#scaleSelection(selection, scaleX, scaleY);
            const newBounds = selection.path.getBounds();
            const boundsDx = (newBounds.x + newBounds.width) - (originalBounds.x + originalBounds.width);
            selection.path.start = { x: selection.path.start.x - boundsDx, y: selection.path.start.y };
        }
        this.#mapWorker.renderMap();
    }

    #resizeWMove(eventData) {
        const dx = (this.#pointDown.x - eventData.offsetX) / this.#mapWorker.map.zoom;
        const bounds = this.#changeReferenceBounds;
        const width = bounds.width;
        const scale = (width + dx) / width;
        for (const selection of this.#selectionStartData) {
            const originalBounds = selection.path.getBounds();
            if (originalBounds.width < 15 && scale < 1) {
                continue;
            }
            this.#scaleSelection(selection, scale, 1);
            const newBounds = selection.path.getBounds();
            const boundsDx = (newBounds.x + newBounds.width) - (originalBounds.x + originalBounds.width);
            selection.path.start = { x: selection.path.start.x - boundsDx, y: selection.path.start.y };
        }
        this.#mapWorker.renderMap();
    }

    #resizeNWMove(eventData) {
        const dx = (this.#pointDown.x - eventData.offsetX) / this.#mapWorker.map.zoom;
        const dy = (this.#pointDown.y - eventData.offsetY) / this.#mapWorker.map.zoom;
        const bounds = this.#changeReferenceBounds;
        const width = bounds.width;
        const height = bounds.height;
        const scaleX = (width + dx) / width;
        const scaleY = (height + dy) / height;
        for (const selection of this.#selectionStartData) {
            const originalBounds = selection.path.getBounds();
            if ((originalBounds.width < 15 && scaleX < 1) || (originalBounds.height < 15 && scaleY < 1)) {
                continue;
            }
            this.#scaleSelection(selection, scaleX, scaleY);
            const newBounds = selection.path.getBounds();
            const boundsDx = (newBounds.x + newBounds.width) - (originalBounds.x + originalBounds.width);
            const boundsDy = (newBounds.y + newBounds.height) - (originalBounds.y + originalBounds.height);
            selection.path.start = { x: selection.path.start.x - boundsDx, y: selection.path.start.y - boundsDy };
        }
        this.#mapWorker.renderMap();
    }

    #resizeNMove(eventData) {
        const dy = (this.#pointDown.y - eventData.offsetY) / this.#mapWorker.map.zoom;
        const bounds = this.#changeReferenceBounds;
        const height = bounds.height;
        const scale = (height + dy) / height;
        for (const selection of this.#selectionStartData) {
            const originalBounds = selection.path.getBounds();
            if (originalBounds.height < 15 && scale < 1) {
                continue;
            }
            this.#scaleSelection(selection, 1, scale);
            const newBounds = selection.path.getBounds();
            const boundsDy = (newBounds.y + newBounds.height) - (originalBounds.y + originalBounds.height);
            selection.path.start = { x: selection.path.start.x, y: selection.path.start.y - boundsDy };
        }
        this.#mapWorker.renderMap();
    }

    #resizeNEMove(eventData) {
        const dx = (eventData.offsetX - this.#pointDown.x) / this.#mapWorker.map.zoom;
        const dy = (this.#pointDown.y - eventData.offsetY) / this.#mapWorker.map.zoom;
        const bounds = this.#changeReferenceBounds;
        const width = bounds.width;
        const height = bounds.height;
        const scaleX = (width + dx) / width;
        const scaleY = (height + dy) / height;
        for (const selection of this.#selectionStartData) {
            const originalBounds = selection.path.getBounds();
            if ((originalBounds.width < 15 && scaleX < 1) || (originalBounds.height < 15 && scaleY < 1)) {
                continue;
            }
            this.#scaleSelection(selection, scaleX, scaleY);
            const newBounds = selection.path.getBounds();
            const boundsDx = newBounds.x - originalBounds.x;
            const boundsDy = (newBounds.y + newBounds.height) - (originalBounds.y + originalBounds.height);
            selection.path.start = { x: selection.path.start.x - boundsDx, y: selection.path.start.y - boundsDy };
        }
        this.#mapWorker.renderMap();
    }

    #resizeEMove(eventData) {
        const dx = (eventData.offsetX - this.#pointDown.x) / this.#mapWorker.map.zoom;
        const bounds = this.#changeReferenceBounds;
        const width = bounds.width;
        const scale = (width + dx) / width;    
        for (const selection of this.#selectionStartData) {
            const originalBounds = selection.path.getBounds();
            if (originalBounds.width < 15 && scale < 1) {
                continue;
            }
            this.#scaleSelection(selection, scale, 1);
            const newBounds = selection.path.getBounds();
            const boundsDx = newBounds.x - originalBounds.x;
            selection.path.start = { x: selection.path.start.x - boundsDx, y: selection.path.start.y };
        }
        this.#mapWorker.renderMap();
    }

    #scaleSelection(selection, scaleX, scaleY) {
        if (selection.path.constructor.name === "PathArc") {
            selection.path.end = { x: selection.startingPathData.end.x * scaleX, y: selection.startingPathData.end.y * scaleY };
            selection.path.center = { x: selection.startingPathData.center.x * scaleX, y: selection.startingPathData.center.y * scaleY };
            const oldRotation = selection.startingPathData.rotationAngle;
            const oldRx = selection.startingPathData.radii.x;
            const oldRy = selection.startingPathData.radii.y;
            const newRotation = Math.atan((scaleY / scaleX) * Math.tan(oldRotation));
            const newRx = (scaleX * oldRx * Math.cos(oldRotation)) / Math.cos(newRotation);
            const newRy = (scaleY * oldRy * Math.cos(oldRotation)) / Math.cos(newRotation);
            selection.path.radii = { x: newRx, y: newRy };
        }
        else {
            selection.path.points = selection.startingPathData.points.map(pt => ({ x: pt.x * scaleX, y: pt.y * scaleY }));
        }
    }

    // rotate helpers
    #rotateDown(eventData) {
        this.#selectionStartData = [];
        if (this.#mapWorker.map) {
            this.#mapWorker.map.startChange();
            const layer = this.#mapWorker.map.getActiveLayer();
            if (layer?.mapItems) {
                for (const mapItem of layer.mapItems) {
                    if (mapItem.isSelected && mapItem.paths) {
                        for (const path of mapItem.paths) {
                            this.#selectionStartData.push(this.#getSelectionStartPathData(mapItem, path));
                        }
                    }
                }
                const point = this.#transformCanvasPoint(eventData.offsetX, eventData.offsetY);
                const boundsInfo = this.#getSelectionBoundsInfoForPointAndBoundsType(point, "Rotate");
                this.#changeReferenceBounds = boundsInfo.selectionBounds.move;
            }
        }
    }

    #rotateMove(eventData) {
        this.#mapWorker.renderMap();
        const currentPoint = this.#transformCanvasPoint(eventData.offsetX, eventData.offsetY);
        const currentX = currentPoint.x;
        const currentY = currentPoint.y;
        const bounds = this.#changeReferenceBounds;
        const cx = bounds.x + (bounds.width / 2);
        const cy = bounds.y + (bounds.height / 2);
        const path = new Path2D(`M ${currentX},${currentY} L ${cx},${cy}`);
        const lineScale = 1 / this.#mapWorker.map.zoom;
        const radius = 5 * lineScale;
        const circle = new Path2D(`M ${cx},${cy} m 0,${-radius} a ${radius} ${radius} 0 0 0 0 ${2 * radius} a ${radius} ${radius} 0 0 0 0 ${-2 * radius} z`);
        this.#mapWorker.renderingContext.setLineDash([5 * lineScale, 5 * lineScale]);
        this.#mapWorker.renderingContext.strokeStyle = "dimgray";
        this.#mapWorker.renderingContext.lineWidth = 3 * lineScale;
        this.#mapWorker.renderingContext.stroke(path);
        this.#mapWorker.renderingContext.stroke(circle);
        this.#mapWorker.renderingContext.strokeStyle = "lightyellow";
        this.#mapWorker.renderingContext.lineWidth = 1 * lineScale;
        this.#mapWorker.renderingContext.stroke(path);
        let theta = Math.atan((currentX - cx) / (currentY - cy));
        if (currentY > cy) {
            theta += Math.PI;
        }
        for (const selection of this.#selectionStartData) {
            const originalBounds = this.#getPointsBounds(selection.startingPathData.points);
            const boundsCx = selection.startingPathData.start.x + originalBounds.x + originalBounds.width / 2;
            const boundsCy = selection.startingPathData.start.y + originalBounds.y + originalBounds.height / 2;
            const xStart = selection.startingPathData.start.x - boundsCx;
            const yStart = selection.startingPathData.start.y - boundsCy;
            const xStartRotated = boundsCx + xStart * Math.cos(theta) + yStart * Math.sin(theta);
            const yStartRotated = boundsCy + yStart * Math.cos(theta) - xStart * Math.sin(theta);
            selection.path.start = { x: xStartRotated, y: yStartRotated };
            selection.path.rotationAngle = selection.path.rotationAngle + theta % (Math.PI * 2);
            if (selection.path.constructor.name === "PathArc") {
                const arcCenter = selection.path.center;
                selection.path.center = {
                    x: arcCenter.x * Math.cos(theta) + arcCenter.y * Math.sin(theta),
                    y: arcCenter.y * Math.cos(theta) - arcCenter.x * Math.sin(theta)
                };
                const arcEnd = selection.path.end;
                selection.path.end = {
                    x: arcEnd.x * Math.cos(theta) + arcEnd.y * Math.sin(theta),
                    y: arcEnd.y * Math.cos(theta) - arcEnd.x * Math.sin(theta)
                };
            }
            else {
                selection.path.points = selection.startingPathData.points.map(pt => ({
                    x: pt.x * Math.cos(theta) + pt.y * Math.sin(theta),
                    y: pt.y * Math.cos(theta) - pt.x * Math.sin(theta)
                }));
            } 
        }
    }

    #getPointsBounds(points) {
        let x = 0;
        let y = 0;
        let xMin = NaN, xMax = NaN, yMin = NaN, yMax = NaN;
        for (const point of points) {
            x += point.x;
            y += point.y;
            if (isNaN(xMin) ||  x < xMin) {
                xMin = x;
            }
            if (isNaN(xMax) || x > xMax) {
                xMax = x;
            }
            if (isNaN(yMin) || y < yMin) {
                yMin = y;
            }
            if (isNaN(yMax) || y > yMax) {
                yMax = y;
            }
        }
        return { x: xMin, y: yMin, width: xMax - xMin, height: yMax - yMin };
    }
}

/** @readonly @enum {string} */
const ActivityState = {
    Default: "Default",
    Select: "Select",
    Move: "Move",
    ResizeN: "ResizeN",
    ResizeNE: "ResizeNE",
    ResizeE: "ResizeE",
    ResizeSE: "ResizeSE",
    ResizeS: "ResizeS",
    ResizeSW: "ResizeSW",
    ResizeW: "ResizeW",
    ResizeNW: "ResizeNW",
    Rotate: "Rotate"
};
