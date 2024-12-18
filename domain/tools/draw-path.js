
export function createToolModel() {
    return new DrawPathTool();
}

class DrawPathTool {

    // fields
    #mapWorker;
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
        if (eventData && this.#isDrawing) {
            await this.#drawEnd(eventData);     
        }
    }

    #drawStart(eventData) {
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
        if (distance > 5) {
            this.#points.push({ x: eventData.offsetX - this.#xCurrent, y: eventData.offsetY - this.#yCurrent });
            this.#xCurrent = eventData.offsetX;
            this.#yCurrent = eventData.offsetY;
        }
        
    }

    async #drawEnd(eventData) {
        this.#drawLine(eventData.offsetX, eventData.offsetY);
        this.#drawLine(this.#xStart, this.#yStart);
        const distance = Math.sqrt((eventData.offsetX - this.#xCurrent) ** 2 + (eventData.offsetY - this.#yCurrent) ** 2);
        if (distance > 5) {
            this.#points.push({ x: eventData.offsetX - this.#xCurrent, y: eventData.offsetY - this.#yCurrent });
        }
        this.#isDrawing = false;
        await this.#addMapItem();  
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

    async #addMapItem() {  
        if (this.#mapWorker.map && this.#mapWorker.activeMapItemTemplate) {
            const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
            const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
            const start = this.#mapWorker.geometryUtilities.transformPoint({ x: this.#xStart, y: this.#yStart }, scale, translation);
            const points = this.#points.map(pt => this.#mapWorker.geometryUtilities.transformPoint(pt, scale));
            const data = {
                mapItemTemplateRef: this.#mapWorker.activeMapItemTemplate.ref.getData(),
                paths: [{
                    start: start,
                    transits: points
                }]
            };
            const mapItem = this.#mapWorker.createMapItem(data);
            this.#mapWorker.map.getActiveLayer().addMapItem(mapItem);
        }
        this.#mapWorker.renderMap();
    }
}

//const path1 = new Path2D("M80 80 A 45 45, 0, 0, 0, 125 125 L 125 80 Z");
//this.renderingContext.fillStyle = "green";
//this.renderingContext.fill(path1);

//const path1 = new Path2D();
//path1.moveTo(50, 50);
//path1.lineTo(100, 50);
//path1.lineTo(100, 100);
//path1.lineTo(50, 100);
//path1.closePath();

//const path2 = new Path2D();
//path2.moveTo(75, 75);
//path2.lineTo(125, 75);
//path2.lineTo(125, 125);
//path2.lineTo(75, 125);
//path2.closePath();

//// first border
//this.renderingContext.setLineDash([]);
//this.renderingContext.shadowColor = "black";
//this.renderingContext.shadowBlur = 15;
//this.renderingContext.lineWidth = 10;
//this.renderingContext.strokeStyle = "blue";
//this.renderingContext.stroke(path1);
//this.renderingContext.stroke(path2);

//// second border
//this.renderingContext.shadowColor = "transparent";
//this.renderingContext.lineWidth = 5;
//this.renderingContext.strokeStyle = "red";
//this.renderingContext.stroke(path1);
//this.renderingContext.stroke(path2);

//// fill
//this.renderingContext.fillStyle = "green";
//this.renderingContext.fill(path1);
//this.renderingContext.fill(path2);

//this.renderingContext.setLineDash([5, 10]); 