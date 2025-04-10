
export function createToolModel() {
    return new DrawPointTool();
}

class DrawPointTool {

    // fields
    #mapWorker;
    #isSnapToOverlayModeOn;

    // methods
    async onActivate(mapWorker) {
        this.#mapWorker = mapWorker;
        this.#initializeToolOptions();  
    }

    async onApplyToolOption(toolOptionInfo) {
        this.#updateToolOptionValue(toolOptionInfo.name, toolOptionInfo.value, false);
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
        }
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

    async #onPointerUp(eventData) {
        await this.#addMapItemGroup(eventData);
    }

    #onKeyDown(eventData) {
        if (eventData.altKey && eventData.key?.toLowerCase() == "o" && !eventData.repeat) {
            this.#updateToolOptionValue("SnapToOverlay", !this.#isSnapToOverlayModeOn, true);
        }
    }

    async #addMapItemGroup(eventData) {
        if (eventData && this.#mapWorker.map && this.#mapWorker.activeMapItemTemplate) {
            let point = this.#transformCanvasPoint(eventData.offsetX, eventData.offsetY);
            if (this.#isSnapToOverlayModeOn) {
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
                }],
                zGroup: this.#mapWorker.activeMapItemTemplate.defaultZGroup
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
