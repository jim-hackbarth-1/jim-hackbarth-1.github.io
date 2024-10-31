
export function createToolModel() {
    return new PanTool();
}

class PanTool {

    mapWorker = null;
    xStart = null;
    yStart = null;
    mapStart = null;
    isPanning = false;

    async onActivate(mapWorker) {
        this.mapWorker = mapWorker
    }

    async handleCanvasEvent(canvasEvent) {
        const eventData = canvasEvent?.eventData;
        switch (canvasEvent?.canvasEventType) {
            case "pointerdown":
                await this.onPointerDown(eventData);
                break;
            case "pointermove":
                await this.onPointerMove(eventData);
                break;
            case "pointerup":
                await this.onPointerUp(eventData);
                break;
        }
    }

    async onPointerDown(eventData) {
        if (eventData && eventData.button === 0) {
            this.panStart(eventData);
        }
    }

    async onPointerMove(eventData) {
        if (eventData && this.isPanning) {
            this.pan(eventData);
        }
    }

    async onPointerUp(eventData) {
        if (eventData && this.isPanning) {
            await this.panEnd(eventData);     
        }
    }

    panStart(eventData) {
        this.xStart = eventData.offsetX;
        this.yStart = eventData.offsetY;
        this.mapStart = { x: this.mapWorker.map.pan.x, y: this.mapWorker.map.pan.y };
        this.mapWorker.map.startChange({ changeType: "MapPan", changeData: { panStart: this.mapStart } });
        this.isPanning = true;
    }

    pan(eventData) {
        const dx = eventData.offsetX - this.xStart;
        const dy = eventData.offsetY - this.yStart
        this.mapWorker.map.pan = { x: this.mapStart.x + dx, y: this.mapStart.y + dy };
        this.mapWorker.renderMap();
    }

    async panEnd(eventData) {
        this.mapWorker.map.completeChange({ changeType: "MapPan", changeData: { panStart: this.mapStart, panEnd: this.mapWorker.map.pan } });
        this.isPanning = false;
    }
}
