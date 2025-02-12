﻿
export function createToolModel() {
    return new DrawRectangleTool();
}

class DrawRectangleTool {

    // fields
    #mapWorker;
    #xStart;
    #yStart;
    #xCurrent;
    #yCurrent;
    #isDrawing;
    #isShiftPressed;
    #isOPressed;

    // methods
    async onActivate(mapWorker) {
        this.#mapWorker = mapWorker;
        this.#isShiftPressed = false;
        this.#isOPressed = false;
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
    async #onPointerDown(eventData) {
        if (eventData && eventData.button === 0 && this.#mapWorker.activeMapItemTemplate) {
            this.#drawStart(eventData);
        }
    }

    async #onPointerMove(eventData) {
        if (eventData && this.#isDrawing) {
            this.#draw(eventData);
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
    }

    #onKeyUp(eventData) {
        if (eventData.key == "Shift") {
            this.#isShiftPressed = false;
        }
        if (eventData.key?.toLowerCase() == "o") {
            this.#isOPressed = !this.#isOPressed;
        }
    }

    #drawStart(eventData) {
        this.#mapWorker.renderingContext.setLineDash([5, 10]);
        let start = { x: eventData.offsetX, y: eventData.offsetY };
        if (this.#isOPressed) {
            let mapPoint = this.#transformCanvasPoint(start.x, start.y);
            mapPoint = this.#mapWorker.map.overlay.getNearestOverlayPoint(mapPoint);
            start = this.#transformMapPoint(mapPoint.x, mapPoint.y);
        }
        this.#xStart = start.x;
        this.#yStart = start.y;
        this.#setCurrentPoint(start);
        this.#isDrawing = true;
    }

    #draw(eventData) {
        let point = { x: eventData.offsetX, y: eventData.offsetY };
        if (this.#isOPressed) {
            let mapPoint = this.#transformCanvasPoint(point.x, point.y);
            mapPoint = this.#mapWorker.map.overlay.getNearestOverlayPoint(mapPoint);
            point = this.#transformMapPoint(mapPoint.x, mapPoint.y);
        }
        this.#setCurrentPoint(point);
        this.#drawRectangle();
    }

    #setCurrentPoint(point) {
        this.#xCurrent = point.x;
        if (this.#isShiftPressed) {
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

    #drawRectangle() {
        this.#mapWorker.renderMap();
        this.#mapWorker.renderingContext.restore();
        this.#mapWorker.renderingContext.resetTransform();
        const rect = new Path2D(`M ${this.#xStart},${this.#yStart} L ${this.#xStart},${this.#yCurrent} ${this.#xCurrent},${this.#yCurrent} ${this.#xCurrent},${this.#yStart} z`);
        this.#mapWorker.renderingContext.strokeStyle = "darkgray";
        this.#mapWorker.renderingContext.lineWidth = 3;
        this.#mapWorker.renderingContext.stroke(rect);
        this.#mapWorker.renderingContext.strokeStyle = "white";
        this.#mapWorker.renderingContext.lineWidth = 2;
        this.#mapWorker.renderingContext.stroke(rect);
    }

    async #addMapItemGroup() {
        if (this.#mapWorker.map && this.#mapWorker.activeMapItemTemplate) {
            const start = this.#transformCanvasPoint(this.#xStart, this.#yStart);
            const end = this.#transformCanvasPoint(this.#xCurrent, this.#yCurrent);
            const transits = [
                { x: end.x - start.x, y: 0 },
                { x: 0, y: end.y - start.y },
                { x: start.x - end.x, y: 0 },
                { x: 0, y: start.y - end.y }
            ];
            const bounds = this.#mapWorker.geometryUtilities.getPathBounds(start, transits);
            if (bounds.height < 5 || bounds.width < 5) {
                this.#mapWorker.renderMap();
                return;
            }
            const mapItemData = {
                mapItemTemplateRef: this.#mapWorker.activeMapItemTemplate.ref,
                paths: [{
                    start: start,
                    transits: transits,
                    inView: true
                }]
            };
            const data = {
                mapItems: [mapItemData]
            };
            const mapItemGroup = this.#mapWorker.createMapItemGroup(data);
            this.#mapWorker.map.getActiveLayer().addMapItemGroup(mapItemGroup);
        }
        this.#mapWorker.renderMap();
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
