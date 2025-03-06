
import { Change, ChangeSet, ChangeType, EntityReference, InputUtilities } from "../references.js";

/** @readonly @enum {string} */
export const ToolType = {
    EditingTool: "EditingTool",
    DrawingTool: "DrawingTool"
};

export class BuiltInTools {

    static #tools = null;

    static async getTools(baseUrl) {
        const selectCursorSrc = '<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 100 100"><g stroke="black" stroke-width="4" fill="white"><path d="M 5,5 L 80,80 A 5 5 -45 0 0 90 70 L 35,15 z" /></g></svg>';
        const drawCursorSrc = '<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 100 100"><g stroke="white" stroke-width="4" fill="black"><path d="M 5,5 L 80,80 A 5 5 -45 0 0 90 70 L 35,15 z" /></g></svg>';
        if (!BuiltInTools.#tools) {
            BuiltInTools.#tools = [];

            BuiltInTools.#tools.push(new Tool({
                ref: {
                    versionId: 1,
                    isBuiltIn: true,
                    name: "Pan"
                },
                moduleSrc: `${baseUrl}/domain/tools/pan.js`,
                thumbnailSrc: '<svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 0 100 100"><g class="icon"><path d="M 50,10 L 35,20 45,20 45,45 20,45 20,35 10,50 20,65 20,55 45,55 45,80 35,80 50,90 65,80 55,80 55,55 80,55 80,65 90,50 80,35 80,45 55,45 55,20 65,20z"></path></g></svg>',
                cursorSrc: '<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 100 100"><g fill="white" stroke="black" stroke-width="4"><path d="M 50,10 L 35,20 45,20 45,45 20,45 20,35 10,50 20,65 20,55 45,55 45,80 35,80 50,90 65,80 55,80 55,55 80,55 80,65 90,50 80,35 80,45 55,45 55,20 65,20z"></path></g></svg>',
                cursorHotspot: { x: 15, y: 15 },
                toolType: ToolType.EditingTool
            }));

            BuiltInTools.#tools.push(new Tool({
                ref: {
                    versionId: 1,
                    isBuiltIn: true,
                    name: "Zoom"
                },
                moduleSrc: `${baseUrl}/domain/tools/zoom.js`,
                thumbnailSrc: '<svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 0 100 100"><g class="icon"><path stroke-dasharray="4" d="M 35,35 l 60,0 0,60 -60,0 z" /><ellipse cx="35" cy="35" rx="25" ry="25" /><line x1="50" y1="50" x2="90" y2="90" /></g></svg>',
                cursorSrc: '<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 100 100"><g stroke="black" stroke-width="4" fill="none"><path stroke-dasharray="4" d="M 35,35 l 60,0 0,60 -60,0 z" /><ellipse cx="35" cy="35" rx="25" ry="25" /><line x1="50" y1="50" x2="90" y2="90" /></g></svg>',
                cursorHotspot: { x: 10, y: 10 },
                toolType: ToolType.EditingTool
            }));

            BuiltInTools.#tools.push(new Tool({
                ref: {
                    versionId: 1,
                    isBuiltIn: true,
                    name: "Select path"
                },
                moduleSrc: `${baseUrl}/domain/tools/select-path.js`,
                thumbnailSrc: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" height="25" width="25"><g class="icon"><path stroke-dasharray="4" d="M 50,5 Q 15 5, 10 15 T 20 40 T 20 60 T 20 80 T 50 85 T 80 80 T 90 45 T 55 20 z" /><path d="M 15,15 L 65,65 A 2.5 2.5 -45 0 0 70 60 L 35,25 z" /></g></svg>',
                cursorSrc: selectCursorSrc,
                cursorHotspot: { x: 0, y: 0 },
                toolType: ToolType.EditingTool
            }));

            BuiltInTools.#tools.push(new Tool({
                ref: {
                    versionId: 1,
                    isBuiltIn: true,
                    name: "Select rectangle"
                },
                moduleSrc: `${baseUrl}/domain/tools/select-rectangle.js`,
                thumbnailSrc: '<svg aria-hidden="true" focusable="false" viewBox="0 0 100 100" height="25" width="25"><g class="icon"><path stroke-dasharray="4" d="M 10,10 l 80,0 0,80 -80,0 z" /><path d="M 15,15 L 65,65 A 2.5 2.5 -45 0 0 70 60 L 35,25 z" /></g></svg>',
                cursorSrc: selectCursorSrc,
                cursorHotspot: { x: 0, y: 0 },
                toolType: ToolType.EditingTool
            }));

            BuiltInTools.#tools.push(new Tool({
                ref: {
                    versionId: 1,
                    isBuiltIn: true,
                    name: "Edit transits"
                },
                moduleSrc: `${baseUrl}/domain/tools/edit-transits.js`,
                thumbnailSrc: '<svg aria-hidden="true" focusable="false" viewBox="0 0 100 100" height="25" width="25"><g class="icon"><path d="M 10,50 l 0,40 80,0 0,-50" /><path stroke-dasharray="4" d="M 90,50 l -20,-40 -60,40" /><path d="M 10,50 m -4,-4 l 8,0 0,8 -8,0 z" /><path d="M 90,50 m -4,-4 l 8,0 0,8 -8,0 z" /><path d="M 70,10 m -4,-4 l 8,0 0,8 -8,0 z" /></g></svg>',
                cursorSrc: selectCursorSrc,
                cursorHotspot: { x: 0, y: 0 },
                toolType: ToolType.EditingTool
            }));

            BuiltInTools.#tools.push(new Tool({
                ref: {
                    versionId: 1,
                    isBuiltIn: true,
                    name: "Fit selection"
                },
                moduleSrc: `${baseUrl}/domain/tools/fit-selection.js`,
                thumbnailSrc: '<svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 0 150 150"><g class="icon"><path d="M 50,5 Q 15 5, 10 15 T 20 40 T 20 60 T 20 80 T 50 85 T 80 80 T 90 45 T 55 20 z" /><path stroke-dasharray="4" d="M 90,45 Q 55 45, 50 55 T 60 80 T 60 100 T 60 120 T 90 125 T 120 120 T 130 85 T 95 60 z" /><line stroke-width="4" x1="66" y1="45" x2="54" y2="63" /><line stroke-width="4" x1="74" y1="45" x2="54" y2="75" /><line stroke-width="4" x1="82" y1="45" x2="62" y2="75" /><line stroke-width="4" x1="90" y1="45" x2="70" y2="75" /><line stroke-width="4" x1="94" y1="51" x2="78" y2="75" /></g></svg>',
                cursorSrc: selectCursorSrc,
                cursorHotspot: { x: 0, y: 0 },
                toolType: ToolType.EditingTool
            }));

            BuiltInTools.#tools.push(new Tool({
                ref: {
                    versionId: 1,
                    isBuiltIn: true,
                    name: "Draw point"
                },
                moduleSrc: `${baseUrl}/domain/tools/draw-point.js`,
                thumbnailSrc: '<svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 0 100 100"><g class="icon-text"><path d="M 15,15 L 65,65 A 2.5 2.5 -45 0 0 70 60 L 35,25 z" /></g></svg>',
                cursorSrc: drawCursorSrc,
                cursorHotspot: { x: 0, y: 0 },
                toolType: ToolType.DrawingTool
            }));

            BuiltInTools.#tools.push(new Tool({
                ref: {
                    versionId: 1,
                    isBuiltIn: true,
                    name: "Draw path"
                },
                moduleSrc: `${baseUrl}/domain/tools/draw-path.js`,
                thumbnailSrc: '<svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 0 100 100"><g class="icon"><path d="M 50,5 Q 15 5, 10 15 T 20 40 T 20 60 T 20 80 T 50 85 T 80 80 T 90 45 T 55 20 z" /><path class="icon-text" d="M 15,15 L 65,65 A 2.5 2.5 -45 0 0 70 60 L 35,25 z" /></g></svg>',
                cursorSrc: drawCursorSrc,
                cursorHotspot: { x: 0, y: 0 },
                toolType: ToolType.DrawingTool
            }));

            BuiltInTools.#tools.push(new Tool({
                ref: {
                    versionId: 1,
                    isBuiltIn: true,
                    name: "Draw rectangle"
                },
                moduleSrc: `${baseUrl}/domain/tools/draw-rectangle.js`,
                thumbnailSrc: '<svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 0 100 100"><g class="icon"><path d="M 15,15 l 40,0 0,50 -40,0 z" /><path class="icon-text" d="M 15,15 L 65,65 A 2.5 2.5 -45 0 0 70 60 L 35,25 z" /></g></svg>',
                cursorSrc: '<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 100 100"><g stroke="white" stroke-width="2" fill="black"><path d="M 70 10 l 20,0 0,20 -20,0 z" /><path d="M 5,5 L 80,80 A 5 5 -45 0 0 90 70 L 35,15 z" /></g></svg>',
                cursorHotspot: { x: 0, y: 0 },
                toolType: ToolType.DrawingTool
            }));

            BuiltInTools.#tools.push(new Tool({
                ref: {
                    versionId: 1,
                    isBuiltIn: true,
                    name: "Draw ellipse"
                },
                moduleSrc: `${baseUrl}/domain/tools/draw-ellipse.js`,
                thumbnailSrc: '<svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 0 100 100"><g class="icon"><path d="M 30 15 a 25 25 0 0 0 0 50 a 25 25 0 0 0 0 -50 z" /><path class="icon-text" d="M 15,20 L 65,70 A 2.5 2.5 -45 0 0 70 65 L 35,30 z" /></g></svg>',
                cursorSrc: '<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 100 100"><g stroke="white" stroke-width="4" fill="black"><path d="M 80 20 a 10 10 0 0 0 0 20 a 10 10 0 0 0 0 -20 z" /><path d="M 5,5 L 80,80 A 5 5 -45 0 0 90 70 L 35,15 z" /></g></svg>',
                cursorHotspot: { x: 0, y: 0 },
                toolType: ToolType.DrawingTool
            }));

            BuiltInTools.#tools.push(new Tool({
                ref: {
                    versionId: 1,
                    isBuiltIn: true,
                    name: "Draw arc"
                },
                moduleSrc: `${baseUrl}/domain/tools/draw-arc.js`,
                thumbnailSrc: '<svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 0 100 100"><g class="icon"><path d="M 30 15 a 25 25 0 0 0 0 50" /><path class="icon-text" d="M 15,20 L 65,70 A 2.5 2.5 -45 0 0 70 65 L 35,30 z" /></g></svg>',
                cursorSrc: '<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 100 100"><g><path stroke="black" stroke-width="2" fill="none" d="M 80 20 a 10 10 0 0 0 0 20" /><path stroke="white" stroke-width="2" fill="black" d="M 5,5 L 80,80 A 5 5 -45 0 0 90 70 L 35,15 z" /></g></svg>',
                cursorHotspot: { x: 0, y: 0 },
                toolType: ToolType.DrawingTool
            }));

            BuiltInTools.#tools.push(new Tool({
                ref: {
                    versionId: 1,
                    isBuiltIn: true,
                    name: "Draw polytransit"
                },
                moduleSrc: `${baseUrl}/domain/tools/draw-polytransit.js`,
                thumbnailSrc: '<svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 0 100 100"><g class="icon"><path  d="M 30,10 l 0,20 -20,20 20,20, 0,20 40,0 0,-20 a 20 20 0 0 0 0 -40 l 0,-20 -20,10 z" /><path class="icon-text" d="M 30,30 l 50,50 a 2.5 2.5 -45 0 0 5 -5 l -35,-35 z" /></g></svg>',
                cursorSrc: drawCursorSrc,
                cursorHotspot: { x: 0, y: 0 },
                toolType: ToolType.DrawingTool
            }));

        }
        return BuiltInTools.#tools;
    }

    static getTool(baseUrl, toolRef) {
        return BuiltInTools.getTools(baseUrl).find(t => EntityReference.areEqual(t.ref, toolRef));
    }
}

export class Tool {

    // constructor
    constructor(data) {
        this.#ref = new EntityReference(data?.ref);
        this.#moduleSrc = InputUtilities.cleanseString(data?.moduleSrc);
        this.#thumbnailSrc = InputUtilities.cleanseSvg(data?.thumbnailSrc);
        this.#cursorSrc = InputUtilities.cleanseSvg(data?.cursorSrc);
        this.#cursorHotspot = InputUtilities.cleansePoint(data?.cursorHotspot);
        this.#toolType = InputUtilities.cleanseString(data?.toolType);
        this.#eventListeners = {};
    }

    // properties
    /** @type {EntityReference}  */
    #ref;
    get ref() {
        return this.#ref;
    }

    /** @type {string}  */
    #moduleSrc;
    get moduleSrc() {
        return this.#moduleSrc;
    }
    set moduleSrc(moduleSrc) {
        const changeSet = this.#getPropertyChange("moduleSrc", this.#moduleSrc, moduleSrc);
        this.#moduleSrc = moduleSrc;
        this.#onChange(changeSet);
    }

    /** @type {string}  */
    #thumbnailSrc;
    get thumbnailSrc() {
        return this.#thumbnailSrc;
    }
    set thumbnailSrc(thumbnailSrc) {
        const changeSet = this.#getPropertyChange("thumbnailSrc", this.#thumbnailSrc, thumbnailSrc);
        this.#thumbnailSrc = thumbnailSrc;
        this.#onChange(changeSet);
    }

    /** @type {string}  */
    #cursorSrc;
    get cursorSrc() {
        return this.#cursorSrc;
    }
    set cursorSrc(cursorSrc) {
        const changeSet = this.#getPropertyChange("cursorSrc", this.#cursorSrc, cursorSrc);
        this.#cursorSrc = cursorSrc;
        this.#onChange(changeSet);
    }

    /** @type {{x: number, y: number}} */
    #cursorHotspot;
    get cursorHotspot() {
        return this.#cursorHotspot;
    }
    set cursorHotspot(cursorHotspot) {
        const changeSet = this.#getPropertyChange("cursorHotspot", this.#cursorHotspot, cursorHotspot);
        this.#cursorHotspot = cursorHotspot;
        this.#onChange(changeSet);
    }

    /** @type {ToolType}  */
    #toolType;
    get toolType() {
        return this.#toolType;
    }
    set toolType(toolType) {
        const changeSet = this.#getPropertyChange("toolType", this.#toolType, toolType);
        this.#toolType = toolType;
        this.#onChange(changeSet);
    }

    // methods
    getData() {
        return {
            ref: this.#ref ? this.#ref.getData() : null,
            moduleSrc: this.#moduleSrc,
            thumbnailSrc: this.#thumbnailSrc,
            cursorSrc: this.#cursorSrc,
            cursorHotspot: this.#cursorHotspot,
            toolType: this.#toolType
        };
    }

    addEventListener(eventName, listener) {
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
        this.#eventListeners[eventName].push(listener);
    }

    removeEventListener(eventName, listener) {
        if (!this.#eventListeners[eventName]) {
            this.#eventListeners[eventName] = [];
        }
        const index = this.#eventListeners[eventName].findIndex(l => l === listener);
        if (index > -1) {
            this.#eventListeners[eventName].splice(index, 1);
        }
    }
    applyChange(change, undoing) {
        if (change.changeType == ChangeType.Edit) {
            this.#applyPropertyChange(change.propertyName, undoing ? change.oldValue : change.newValue);
        }
    }

    #applyPropertyChange(propertyName, propertyValue) {
        switch (propertyName) {
            case "moduleSrc":
                this.moduleSrc = InputUtilities.cleanseString(propertyValue);
                break;
            case "thumbnailSrc":
                this.thumbnailSrc = InputUtilities.cleanseSvg(propertyValue);
                break;
            case "cursorSrc":
                this.cursorSrc = InputUtilities.cleanseSvg(propertyValue);
                break;
            case "cursorHotspot":
                this.cursorHotspot = InputUtilities.cleansePoint(propertyValue);
                break;
            case "toolType":
                this.toolType = InputUtilities.cleanseString(propertyValue);
                break;
        }
    }

    // helpers
    #eventListeners;

    #onChange = (changeSet) => {
        if (this.#eventListeners[Change.ChangeEvent]) {
            if (changeSet?.changes) {
                for (const change of changeSet.changes) {
                    change.toolRef = this.ref.getData();
                }
            }
            for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                listener(changeSet);
            }
        }
    }

    #getPropertyChange(propertyName, v1, v2) {
        return ChangeSet.getPropertyChange(Tool.name, propertyName, v1, v2);
    } 
}
