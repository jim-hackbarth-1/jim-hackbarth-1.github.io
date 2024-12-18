import { Path } from "../references.js";

export function createToolModel() {
    return new EditIntersectTool();
}

class EditIntersectTool {

    // fields
    #mapWorker;
    #actionMode;
    #drawMode;
    #setOperationMode;
    #xStart;
    #yStart;
    #xCurrent;
    #yCurrent;
    #isDrawing;
    #pathDark;
    #pathLight;
    #points;

    // methods
    async onActivate(mapWorker) {
        this.#mapWorker = mapWorker
        this.#actionMode = (this.#getSelectedMapItems().length > 0) ? "Draw" : "Select";
        this.#drawMode = "Path";
        this.#setOperationMode = "Intersect";
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
            case "keyup":
                this.#onKeyUp(eventData);
                break;
        }
    }

    // helpers
    #onPointerDown(eventData) {
        if (this.#actionMode == "Select") {
            this.#selectMapItems(eventData);
        }
        else {
            if (eventData && eventData.button === 0) {
                this.#drawStart(eventData);
            }
        }
    }

    #onPointerMove(eventData) {
        if (eventData && this.#isDrawing) {
            this.#draw(eventData);
        }
    }

    #onPointerUp(eventData) {
        if (eventData && this.#isDrawing) {
            this.#drawEnd(eventData);
        }
    }  

    #onKeyUp(eventData) {
        if (eventData.key == "Escape") {
            this.#unselectMapItems();
            this.#clearDrawing();
            this.#actionMode = "Select";
            this.#mapWorker.renderMap();
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
        
    }

    #clearDrawing() {
        this.#isDrawing = false;
        this.#points = [];
    }

    #getSelectedMapItems() {
        const layer = this.#mapWorker.map.getActiveLayer();
        return layer.mapItems.filter((mapItem) => mapItem.isSelected);
    }

    #selectMapItems(eventData) {
        const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
        const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
        const point = this.#mapWorker.geometryUtilities.transformPoint({ x: eventData.offsetX, y: eventData.offsetY }, scale, translation);
        const layer = this.#mapWorker.map.getActiveLayer();
        layer.selectMapItemsByPoints(this.#mapWorker.renderingContext, this.#mapWorker.map, [point]);
        const selectedMapItems = layer.mapItems.filter((mapItem) => mapItem.isSelected);
        if (selectedMapItems.length > 0) {
            this.#actionMode = "Draw";
        }
        this.#mapWorker.renderMap();
    }

    #unselectMapItems() {
        const layer = this.#mapWorker.map.getActiveLayer();
        for (const mapItem of layer.mapItems) {
            mapItem.isSelected = false;
        }
    }

    #drawStart(eventData) {
        this.#mapWorker.renderMap();
        this.#mapWorker.renderingContext.restore();
        this.#mapWorker.renderingContext.resetTransform();
        this.#mapWorker.renderingContext.setLineDash([5, 10]);
        this.#xStart = eventData.offsetX;
        this.#yStart = eventData.offsetY;
        this.#xCurrent = eventData.offsetX;
        this.#yCurrent = eventData.offsetY;
        this.#pathDark = new Path2D();
        this.#pathLight = new Path2D();
        this.#pathDark.moveTo(this.#xStart, this.#yStart);
        this.#pathLight.moveTo(this.#xStart, this.#yStart);
        this.#points = [];
        this.#isDrawing = true;
    }

    #draw(eventData) {
        this.#drawLine(eventData.offsetX, eventData.offsetY);
        const distance = Math.sqrt((eventData.offsetX - this.#xCurrent) ** 2 + (eventData.offsetY - this.#yCurrent) ** 2);
        if (distance > 3) {
            this.#points.push({ x: eventData.offsetX - this.#xCurrent, y: eventData.offsetY - this.#yCurrent });
            this.#xCurrent = eventData.offsetX;
            this.#yCurrent = eventData.offsetY;
        }
    }

    #drawEnd(eventData) {
        this.#drawLine(eventData.offsetX, eventData.offsetY);
        this.#drawLine(this.#xStart, this.#yStart);
        const distance = Math.sqrt((eventData.offsetX - this.#xCurrent) ** 2 + (eventData.offsetY - this.#yCurrent) ** 2);
        if (distance > 3) {
            this.#points.push({ x: eventData.offsetX - this.#xCurrent, y: eventData.offsetY - this.#yCurrent });
        }
        this.#isDrawing = false;
        this.#previewSetOperation();
    }

    #drawLine(x, y) {
        this.#mapWorker.renderingContext.strokeStyle = "darkgray";
        this.#mapWorker.renderingContext.lineWidth = 3;
        this.#pathDark.lineTo(x, y);
        this.#mapWorker.renderingContext.stroke(this.#pathDark);
        this.#mapWorker.renderingContext.strokeStyle = "white";
        this.#mapWorker.renderingContext.lineWidth = 1;
        this.#pathLight.lineTo(x, y);
        this.#mapWorker.renderingContext.stroke(this.#pathLight);
    }

    #previewSetOperation() {
        this.#mapWorker.renderMap();
        if (!this.#points || this.#points.length == 0) {
            return;
        }
        const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
        const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
        const start = this.#mapWorker.geometryUtilities.transformPoint({ x: this.#xStart, y: this.#yStart }, scale, translation);
        const points = this.#points.map(pt => this.#mapWorker.geometryUtilities.transformPoint(pt, scale));
        const intersectionPath = new Path({
            start: start,
            transits: points
        });
        this.#displayPath(intersectionPath, false);
        const selectedMapItems = this.#getSelectedMapItems();
        for (const mapItem of selectedMapItems) {
            for (const path of mapItem.paths) {             
                const setOperationPaths = this.#getSetOperationPaths(path, intersectionPath);
                for (const setOperationPath of setOperationPaths) {
                    this.#displayPath(setOperationPath, true);
                }  
            }
        }
    }

    #performSetOperation() {
        if (!this.#points || this.#points.length == 0) {
            return;
        }
        const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
        const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
        const start = this.#mapWorker.geometryUtilities.transformPoint({ x: this.#xStart, y: this.#yStart }, scale, translation);
        const points = this.#points.map(pt => this.#mapWorker.geometryUtilities.transformPoint(pt, scale));
        const intersectionPath = new Path({
            start: start,
            transits: points
        });
        const selectedMapItems = this.#getSelectedMapItems();
        let mapItemPaths = [];
        for (const mapItem of selectedMapItems) {
            mapItemPaths = [];
            for (const path of mapItem.paths) {
                const setOperationPaths = this.#getSetOperationPaths(path, intersectionPath);
                for (const setOperationPath of setOperationPaths) {
                    mapItemPaths.push(setOperationPath);
                }
            }
            if (mapItemPaths.length > 0) {
                mapItem.paths = mapItemPaths;
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
            paths.push(new Path(pathData));
        }
        return paths;
    }

    #displayPath(path, isSetOperationPath) {
        const stroke = isSetOperationPath ? "darkred" : "darkgray";
        const lineDash = isSetOperationPath ? [] : [4, 4];
        const path2D = new Path2D(`${path.getPathInfo()} z`);
        this.#mapWorker.renderingContext.setLineDash(lineDash);
        this.#mapWorker.renderingContext.strokeStyle = stroke;
        this.#mapWorker.renderingContext.lineWidth = 3;
        this.#mapWorker.renderingContext.stroke(path2D);
        this.#mapWorker.renderingContext.strokeStyle = "white";
        this.#mapWorker.renderingContext.lineWidth = 1;
        this.#mapWorker.renderingContext.stroke(path2D);
    }
}
