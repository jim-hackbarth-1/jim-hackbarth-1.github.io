
//import { MapItem, MapWorker } from "http://localhost:63743/domain/references.js";

export function createToolModel() {
    return new DrawPathTool();
}

class DrawPathTool {

    static #baseUrl;
    static #references;
    static MapItem;
    static MapWorker;
    xStart = null;
    x = null;
    yStart = null;
    y = null;
    isDrawing = false;
    pathDark = null;
    pathLight = null;
    pts = [];

    async onActivate(baseUrl) {
        DrawPathTool.#baseUrl = baseUrl;
    }

    async handleCanvasEvent(canvasEvent) {
        if (!DrawPathTool.#references) {
            const { MapItem, MapWorker } = await import(`${DrawPathTool.#baseUrl}/domain/references.js`);
            DrawPathTool.MapItem = MapItem;
            DrawPathTool.MapWorker = MapWorker;
        }
        const eventData = canvasEvent?.eventData;
        switch (canvasEvent?.canvasEventType) {
            case "mousedown":
                await this.onMouseDown(eventData);
                break;
            case "touchstart":
                await this.onTouchStart(eventData);
                break;
            case "mousemove":
                await this.onMouseMove(eventData);
                break;
            case "touchmove":
                await this.onTouchMove(eventData);
                break;
            case "mouseup":
                await this.onMouseUp(eventData);
                break;
            case "touchend":
                await this.onTouchEnd(eventData);
                break;
        }
    }

    async onMouseDown(eventData) {
        if (eventData && eventData.buttons == 1) {
            this.drawStart(eventData);
        }
    }

    async onTouchStart(eventData) {
        if (eventData) {
            this.drawStart(eventData);
        }
    }

    async onMouseMove(eventData) {
        if (eventData && this.isDrawing) {
            this.draw(eventData);
        }
    }

    async onTouchMove(eventData) {
        if (eventData && this.isDrawing) {
            this.draw(eventData);
        }
    }

    async onMouseUp(eventData) {
        if (eventData && this.isDrawing) {
            await this.drawEnd(eventData);     
        }
    }

    async onTouchEnd(eventData) {
        if (eventData && this.isDrawing) {
            await this.drawEnd(eventData);
        }
    }

    drawStart(eventData) {
        const context = DrawPathTool?.MapWorker?.renderingContext;
        const debugMsg = `hasContext: ${context ? "yes" : "no"}`;
        DrawPathTool.MapWorker.postMessage({ messageType: "DebugInfo", data: debugMsg });
        return;
        DrawPathTool.MapWorker.renderingContext.restore();
        DrawPathTool.MapWorker.renderingContext.setLineDash([5, 10]);
        this.xStart = eventData.offsetX;
        this.yStart = eventData.offsetY;
        this.x = eventData.offsetX;
        this.y = eventData.offsetY;
        this.pathDark = new Path2D();
        this.pathLight = new Path2D();
        this.pathDark.moveTo(this.xStart, this.yStart);
        this.pathLight.moveTo(this.xStart, this.yStart);
        this.pts = [];
        this.isDrawing = true;
    }

    draw(eventData) {
        this.drawLine(eventData.offsetX, eventData.offsetY);
        this.pts.push(`${eventData.offsetX - this.x},${eventData.offsetY - this.y}`);
        this.x = eventData.offsetX;
        this.y = eventData.offsetY;
    }

    async drawEnd(eventData) {
        this.drawLine(eventData.offsetX, eventData.offsetY);
        this.drawLine(this.xStart, this.yStart);
        this.pts.push(`${eventData.offsetX - this.x},${eventData.offsetY - this.y}`);
        this.isDrawing = false;
        await this.addMapItem();  
    }

    drawLine(x, y) {
        this.setDarkLineStyle();
        this.pathDark.lineTo(x, y);
        DrawPathTool.MapWorker.renderingContext.stroke(this.pathDark);
        this.setLightLineStyle();
        this.pathLight.lineTo(x, y);
        DrawPathTool.MapWorker.renderingContext.stroke(this.pathLight);
    }

    setDarkLineStyle() {
        DrawPathTool.MapWorker.renderingContext.strokeStyle = "darkgray";
        DrawPathTool.MapWorker.renderingContext.lineWidth = 3;
    }

    setLightLineStyle() {
        DrawPathTool.MapWorker.renderingContext.strokeStyle = "white";
        DrawPathTool.MapWorker.renderingContext.lineWidth = 1;
    }

    async addMapItem() {  
        if (DrawPathTool.MapWorker.map && DrawPathTool.MapWorker.activeMapItemTemplate) {
            let pathData = `M ${this.xStart},${this.yStart} l ${this.pts.join(" ")}`;
            if (DrawPathTool.MapWorker.activeMapItemTemplate.fills.length > 0) {
                pathData += " z";
            }
            const data = {
                mapItemTemplateRef: DrawPathTool.MapWorker.activeMapItemTemplate.ref.getData(),
                pathData: pathData
            };
            const mapItem = new DrawPathTool.MapItem(data);
            DrawPathTool.MapWorker.map.getActiveLayer().addMapItem(mapItem);
        }
        DrawPathTool.MapWorker.renderMap();
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