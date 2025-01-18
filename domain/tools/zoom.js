
export function createToolModel() {
    return new ZoomTool();
}

class ZoomTool {

    // fields
    #mapWorker;
    #pointDown;
    #pointCurrent;
    #isDrawing;

    // methods
    async onActivate(mapWorker) {
        this.#mapWorker = mapWorker;
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
        }
    }

    // helpers
    #onPointerDown(eventData) {
        if (eventData && eventData.button === 0) {
            this.#pointDown = { x: eventData.offsetX, y: eventData.offsetY };
            this.#mapWorker.renderingContext.setLineDash([5, 10]);
            this.#pointCurrent = { x: eventData.offsetX, y: eventData.offsetY };
            this.#isDrawing = true;
        }
    }

    #onPointerMove(eventData) {
        if (eventData && this.#isDrawing) {     
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
    }

    #onPointerUp(eventData) {
        if (eventData && this.#isDrawing) {

            // get pan
            this.#pointCurrent = { x: eventData.offsetX, y: eventData.offsetY };
            const start = this.#transformCanvasPoint(this.#pointDown.x, this.#pointDown.y);
            const end = this.#transformCanvasPoint(this.#pointCurrent.x, this.#pointCurrent.y);
            const x = Math.min(end.x, start.x);
            const y = Math.min(end.y, start.y);
            const pan = { x: -x, y: -y };

            // get zoom
            const dx = Math.abs(end.x - start.x);
            const dy = Math.abs(end.y - start.y);
            const width = this.#mapWorker.map.currentViewPort.width;
            const height = this.#mapWorker.map.currentViewPort.height;
            let zoom = Math.min(width / dx, height / dy);
            zoom = zoom.toFixed(2);
            zoom = zoom * this.#mapWorker.map.zoom;
            if (zoom < 0.25) {
                zoom = 0.25;
            }
            if (zoom > 4) {
                zoom = 4;
            }

            // set pan and zoom
            this.#mapWorker.map.startChangeSet();
            const panChangeData = {
                changeType: "Edit",
                changeObjectType: Map.name,
                changeObjectRef: this.#mapWorker.map.ref,
                propertyName: "pan",
                oldValue: this.#mapWorker.map.pan,
                newValue: pan
            };
            const zoomChangeData = {
                changeType: "Edit",
                changeObjectType: Map.name,
                changeObjectRef: this.#mapWorker.map.ref,
                propertyName: "zoom",
                oldValue: this.#mapWorker.map.zoom,
                newValue: zoom
            };
            this.#mapWorker.map.pan = pan;
            this.#mapWorker.map.zoom = zoom; 
            const changeSet = this.#mapWorker.createChangeSet([panChangeData, zoomChangeData]);
            this.#mapWorker.map.completeChangeSet(changeSet);

            // render map
            this.#isDrawing = false;
            this.#mapWorker.renderMap({ updatedViewPort: true });
        }
    }

    #transformCanvasPoint(x, y) {
        const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
        const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
        return this.#mapWorker.geometryUtilities.transformPoint({ x: x, y: y }, scale, translation);
    }
}
