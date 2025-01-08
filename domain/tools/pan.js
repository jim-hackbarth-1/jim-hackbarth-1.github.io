
export function createToolModel() {
    return new PanTool();
}

class PanTool {

    // fields
    #mapWorker;
    #xStart;
    #yStart;
    #xPanStart;
    #yPanStart;
    #isPanning;

    // methods
    async onActivate(mapWorker) {
        this.#mapWorker = mapWorker
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
                this.#onPointerUp();
                break;
        }
    }

    // helpers
    #onPointerDown(eventData) {
        if (eventData && eventData.button === 0) {
            this.#panStart(eventData);
        }
    }

    #onPointerMove(eventData) {
        if (eventData && this.#isPanning) {
            this.#pan(eventData);
        }
    }

    #onPointerUp() {
        if (this.#isPanning) {
            this.#panEnd();     
        }
    }

    #panStart(eventData) {
        this.#xStart = eventData.offsetX;
        this.#yStart = eventData.offsetY;
        this.#xPanStart = this.#mapWorker.map.pan.x;
        this.#yPanStart = this.#mapWorker.map.pan.y;
        this.#mapWorker.map.startChange();
        this.#isPanning = true;
    }

    #pan(eventData) {
        const dx = (eventData.offsetX - this.#xStart) / this.#mapWorker.map.zoom;
        const dy = (eventData.offsetY - this.#yStart) / this.#mapWorker.map.zoom;
        this.#mapWorker.map.pan = { x: this.#xPanStart + dx, y: this.#yPanStart + dy };
        this.#mapWorker.renderMap({ updatedViewPort: true });
    }

    #panEnd() {
        const change = this.#mapWorker.createChange({
            changeObjectType: "Map",
            changeObjectRef: this.#mapWorker.map.ref,
            changeType: "Edit",
            changeData: [
                {
                    propertyName: "pan",
                    oldValue: { x: this.#xPanStart, y: this.#yPanStart },
                    newValue: this.#mapWorker.map.pan
                }
            ]
        });
        this.#mapWorker.map.completeChange(change);
        this.#isPanning = false;
    }
}
