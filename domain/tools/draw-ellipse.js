
export function createToolModel() {
    return new DrawEllipseTool();
}

class DrawEllipseTool {

    // fields
    #mapWorker;
    #xStart;
    #yStart;
    #xCurrent;
    #yCurrent;
    #isDrawing;

    // methods
    async onActivate(mapWorker) {
        this.#mapWorker = mapWorker
    }

    async handleCanvasEvent(canvasEvent) {
        const eventData = canvasEvent?.eventData;
        switch (canvasEvent?.canvasEventType) {
            case "pointerdown":
                await this.#onPointerDown(eventData);
                break;
            case "pointermove":
                await this.#onPointerMove(eventData);
                break;
            case "pointerup":
                await this.#onPointerUp(eventData);
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

    #drawStart(eventData) {
        this.#mapWorker.renderingContext.setLineDash([5, 10]);
        this.#xStart = eventData.offsetX;
        this.#yStart = eventData.offsetY;
        this.#xCurrent = eventData.offsetX;
        this.#yCurrent = eventData.offsetY;
        this.#isDrawing = true;
    }

    #draw(eventData) {
        this.#xCurrent = eventData.offsetX;
        this.#yCurrent = eventData.offsetY;
        this.#drawEllipse();
    }

    async #drawEnd() {   
        this.#isDrawing = false;
        await this.#addMapItem();
    }

    #drawEllipse() {
        this.#mapWorker.renderMap();
        this.#mapWorker.renderingContext.restore();
        this.#mapWorker.renderingContext.resetTransform();
        const rect = new Path2D(`M ${this.#xStart},${this.#yStart} L ${this.#xStart},${this.#yCurrent} ${this.#xCurrent},${this.#yCurrent} ${this.#xCurrent},${this.#yStart} z`);
        const xStart = (this.#xCurrent + this.#xStart) / 2;
        const yStart = this.#yStart;
        const xRadius = Math.abs((this.#xCurrent - this.#xStart) / 2);
        const yRadius = Math.abs((this.#yCurrent - this.#yStart) / 2);
        const end = (this.#yCurrent < this.#yStart) ? -2 : 2;
        const ellipse = new Path2D(`M ${xStart},${yStart} a ${xRadius} ${yRadius} 0 0 0 0 ${end * yRadius} a ${xRadius} ${yRadius} 0 0 0 0 ${-end * yRadius} z`);
        this.#mapWorker.renderingContext.strokeStyle = "darkgray";
        this.#mapWorker.renderingContext.lineWidth = 1;
        this.#mapWorker.renderingContext.stroke(rect);
        this.#mapWorker.renderingContext.lineWidth = 3;
        this.#mapWorker.renderingContext.stroke(ellipse);
        this.#mapWorker.renderingContext.strokeStyle = "white";
        this.#mapWorker.renderingContext.lineWidth = 1;
        this.#mapWorker.renderingContext.stroke(ellipse);        
    }

    async #addMapItem() {
        if (this.#mapWorker.map && this.#mapWorker.activeMapItemTemplate) {
            const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
            const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
            const xStart = (this.#xCurrent + this.#xStart) / 2;
            const yStart = this.#yStart;
            const start = this.#mapWorker.transformPoint({ x: xStart, y: yStart }, scale, translation);
            const yEnd = this.#yCurrent - this.#yStart;
            const end = this.#mapWorker.transformPoint({ x: 0, y: (yEnd) }, scale);
            const center = this.#mapWorker.transformPoint({ x: 0, y: yEnd / 2 }, scale);
            const xRadius = Math.abs((this.#xCurrent - this.#xStart) / 2);
            const yRadius = Math.abs((this.#yCurrent - this.#yStart) / 2);
            const radii = this.#mapWorker.transformPoint({ x: xRadius, y: yRadius }, scale);
            const data = {
                mapItemTemplateRef: this.#mapWorker.activeMapItemTemplate.ref.getData(),
                paths: [{
                    pathType: "PathArcs",
                    start: start,
                    arcs: [
                        {
                            end: { x: end.x, y: end.y },
                            center: { x: center.x, y: center.y },
                            radii: { x: radii.x, y: radii.y }
                        },
                        {
                            end: { x: end.x, y: -end.y },
                            center: { x: center.x, y: -center.y },
                            radii: { x: radii.x, y: radii.y }
                        }
                    ]
                }]
            };
            const mapItem = this.#mapWorker.createMapItem(data);
            this.#mapWorker.map.getActiveLayer().addMapItem(mapItem);
        }
        this.#mapWorker.renderMap();
    }
}
