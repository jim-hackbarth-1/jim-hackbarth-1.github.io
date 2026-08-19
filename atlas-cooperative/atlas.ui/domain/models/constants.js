
/** @readonly @enum {string} */
export const ErrorMessage = {
    NullValue: "value may not be null",
    InvalidIndex: "invalid index value",
    ItemAlreadyExistsInList: "item already exists in list"
}

/** @readonly @enum {string} */
export const GradientType = {
    LinearGradient: "LinearGradient",
    RadialGradient: "RadialGradient"
};

/** @readonly @enum {string} */
export const SelectionStatusType = {
    Primary: "Primary",
    Secondary: "Secondary"
};

export const ToolSource = {
    Default: `


export function createToolModel() {
    return new CustomTool();
}

class CustomTool {

    // fields
    #mapWorker;
    #xStart;
    #yStart;
    #xCurrent;
    #yCurrent;
    #isDrawing;
    #path;
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
        this.#mapWorker.renderingContext.resetTransform();
        this.#mapWorker.renderingContext.setLineDash([5, 10]);
        this.#xStart = eventData.offsetX;
        this.#yStart = eventData.offsetY;
        this.#xCurrent = eventData.offsetX;
        this.#yCurrent = eventData.offsetY;
        this.#path = new Path2D();
        this.#path.moveTo(this.#xStart, this.#yStart);
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
        await this.#addMapItemGroup();
    }

    #drawLine(x, y) {
        this.#path.lineTo(x, y);
        this.#mapWorker.strokeDrawingPath(this.#path);
    }

    async #addMapItemGroup() {
        if (this.#mapWorker.map && this.#mapWorker.activeMapItemTemplate) {
            const scale = { x: 1 / this.#mapWorker.map.zoom, y: 1 / this.#mapWorker.map.zoom };
            const translation = { x: -this.#mapWorker.map.pan.x, y: -this.#mapWorker.map.pan.y };
            const start = this.#mapWorker.geometryUtilities.transformPoint({ x: this.#xStart, y: this.#yStart }, scale, translation);
            const points = this.#points.map(pt => this.#mapWorker.geometryUtilities.transformPoint(pt, scale));
            const bounds = this.#mapWorker.geometryUtilities.getPathBounds(start, points);
            if (!this.#isBiggerThanMinSize(bounds)) {
                await this.#mapWorker.renderMap();
                return;
            }
            const mapItemData = {
                mapItemTemplateRef: this.#mapWorker.activeMapItemTemplate.ref,
                paths: [{
                    start: start,
                    transits: points,
                    inView: true
                }],
                zGroup: this.#mapWorker.activeMapItemTemplate.defaultZGroup,
                captionText: this.#mapWorker.activeMapItemTemplate.caption.defaultText,
                isCaptionVisible: this.#mapWorker.activeMapItemTemplate.caption.defaultText.length > 0
            };
            const data = {
                mapItems: [mapItemData]
            };
            const mapItemGroup = this.#mapWorker.createMapItemGroup(data);
            this.#mapWorker.map.getActiveLayer().addMapItemGroup(mapItemGroup);
        }
        await this.#mapWorker.renderMap();
    }

    #isBiggerThanMinSize(bounds) {
        if (this.#mapWorker.activeMapItemTemplate.fills.length == 0) {
            return (bounds.height >= 5 || bounds.width >= 5);
        }
        else {
            return (bounds.height >= 5 && bounds.width >= 5);
        }
    }
}

`
};
