
export function createToolModel() {
    return new DrawPointTool();
}

class DrawPointTool {

    // fields
    #mapWorker;
    #isOPressed;

    // methods
    async onActivate(mapWorker) {
        this.#mapWorker = mapWorker;
        this.#isOPressed = false;
    }

    async handleClientEvent(clientEvent) {
        const eventData = clientEvent?.eventData;
        switch (clientEvent?.eventType) {
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
    async #onPointerUp(eventData) {
        await this.#addMapItemGroup(eventData);
    }

    #onKeyDown(eventData) {
        if (eventData.key?.toLowerCase() == "o") {
            this.#isOPressed = true;
        }
    }

    #onKeyUp(eventData) {
        if (eventData.key?.toLowerCase() == "o") {
            this.#isOPressed = false;
        }
    }

    async #addMapItemGroup(eventData) {
        if (eventData && this.#mapWorker.map && this.#mapWorker.activeMapItemTemplate) {
            let point = this.#transformCanvasPoint(eventData.offsetX, eventData.offsetY);
            if (this.#isOPressed) {
                point = this.#mapWorker.map.overlay.getNearestOverlayPoint(point);
            }
            const size = 5;
            const mapItemData = {
                mapItemTemplateRef: this.#mapWorker.activeMapItemTemplate.ref,
                paths: [{
                    start: { x: point.x - size / 2, y: point.y - size / 2 },
                    transits: [
                        { x: size, y: 0 },
                        { x: 0, y: size },
                        { x: -size, y: 0 },
                        { x: 0, y: -size }
                    ],
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
}
