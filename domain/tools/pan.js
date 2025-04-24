
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
    #isArrowPressed;
    #panIncrementIteration;

    // methods
    async onActivate(mapWorker) {
        this.#mapWorker = mapWorker
        if (this.#mapWorker.map) {
            this.#mapWorker.map.addEventListener("AfterRenderEvent", this.handleAfterRenderEvent);
        }
        this.#isArrowPressed = false;
        this.#panIncrementIteration = 0;
        this.#drawCurrentPan();
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
                await this.#onPointerUp();
                break;
            case "keydown":
                await this.#onKeyDown(eventData);
                break;
            case "keyup":
                this.#onKeyUp(eventData);
                break;
        }
    }

    handleAfterRenderEvent = async (change) => {
        this.#drawCurrentPan();
    }

    // helpers
    #onPointerDown(eventData) {
        if (eventData && eventData.button === 0) {
            this.#panStart(eventData);
        }
    }

    async #onPointerMove(eventData) {
        if (eventData && this.#isPanning) {
            await this.#pan(eventData);
        }
    }

    async #onPointerUp() {
        if (this.#isPanning) {
            await this.#panEnd();     
        }
    }

    async #onKeyDown(eventData) {
        if (eventData.key == "ArrowLeft") {
            await this.#panIncrement(eventData, -1, 0);
        }
        if (eventData.key == "ArrowRight") {
            await this.#panIncrement(eventData, 1, 0);
        }
        if (eventData.key == "ArrowUp") {
            await this.#panIncrement(eventData, 0, -1);
        }
        if (eventData.key == "ArrowDown") {
            await this.#panIncrement(eventData, 0, 1);
        }
    }

    #onKeyUp(eventData) {
        if (eventData.key?.startsWith("Arrow")) {
            this.#panIncrementIteration = 0;
            this.#isArrowPressed = false;
        }
    }

    #panStart(eventData) {
        this.#xStart = eventData.offsetX;
        this.#yStart = eventData.offsetY;
        this.#xPanStart = this.#mapWorker.map.pan.x;
        this.#yPanStart = this.#mapWorker.map.pan.y;
        this.#mapWorker.map.startChangeSet();
        this.#isPanning = true;
    }

    async #pan(eventData) {
        const dx = (eventData.offsetX - this.#xStart) / this.#mapWorker.map.zoom;
        const dy = (eventData.offsetY - this.#yStart) / this.#mapWorker.map.zoom;
        this.#mapWorker.map.pan = { x: this.#xPanStart + dx, y: this.#yPanStart + dy };
        await this.#mapWorker.renderMap({ updatedViewPort: true });
        this.#drawCurrentPan();
    }

    async #panEnd() {
        const changeSet = this.#mapWorker.createChangeSet([{
            changeType: "Edit",
            changeObjectType: "Map",
            propertyName: "pan",
            oldValue: { x: this.#xPanStart, y: this.#yPanStart },
            newValue: this.#mapWorker.map.pan
        }]);
        this.#mapWorker.map.completeChangeSet(changeSet);
        this.#isPanning = false;
        await this.#mapWorker.renderMap();
    }

    async #panIncrement(eventData, dx, dy) {
        this.#isArrowPressed = true;
        if (eventData.repeat) {
            dx = dx * 10;
            dy = dy * 10;
            this.#panIncrementIteration += 10;
        }
        else {
            this.#panIncrementIteration = 0;
        }
        const maxIteration = Math.min(this.#mapWorker.map.currentViewPort.width, this.#mapWorker.map.currentViewPort.height);
        if (this.#panIncrementIteration < maxIteration && this.#isArrowPressed) {
            this.#mapWorker.map.pan = { x: this.#mapWorker.map.pan.x + dx, y: this.#mapWorker.map.pan.y + dy };
            await this.#mapWorker.renderMap({ updatedViewPort: true });
            this.#drawCurrentPan();
        }
    }

    #drawCurrentPan() {
        let x = this.#mapWorker.map.pan.x.toFixed(0);
        if (x == -0) {
            x = 0;
        }
        let y = this.#mapWorker.map.pan.y.toFixed(0);
        if (y == -0) {
            y = 0;
        }
        const text = `pan: ${x}, ${y}`;
        const scale = 1 / this.#mapWorker.map.zoom;
        const fontSize = 12 * scale;
        this.#mapWorker.renderingContext.font = `${fontSize}px sans-serif`;
        const bounds = this.#mapWorker.renderingContext.measureText(text);
        const padding = 10 * scale;
        const width = bounds.width + padding;
        const height = bounds.actualBoundingBoxAscent + bounds.actualBoundingBoxDescent + padding;
        const rectStart = this.#transformCanvasPoint(5, 5);
        const rect = new Path2D(`M ${rectStart.x},${rectStart.y} l ${width},0 0,${height} ${-(width)},0 z`);      
        this.#mapWorker.renderingContext.lineWidth = 2 * scale;
        this.#mapWorker.renderingContext.fillStyle = "white";
        this.#mapWorker.renderingContext.globalAlpha = 0.5; 
        this.#mapWorker.renderingContext.fill(rect);
        this.#mapWorker.renderingContext.globalAlpha = 1; 
        this.#mapWorker.renderingContext.strokeStyle = "dimgray";
        this.#mapWorker.renderingContext.stroke(rect);
        const textStart = this.#transformCanvasPoint(10, 20);
        this.#mapWorker.renderingContext.fillStyle = "dimgray";
        this.#mapWorker.renderingContext.fillText(text, textStart.x, textStart.y);
    }

    #transformCanvasPoint(x, y) {
        const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
        const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
        return this.#mapWorker.geometryUtilities.transformPoint({ x: x, y: y }, scale, translation);
    }
}
