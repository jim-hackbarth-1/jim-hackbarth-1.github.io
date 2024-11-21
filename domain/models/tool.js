
import { Change, ChangeType, EntityReference } from "../references.js";

/** @readonly @enum {string} */
export const ToolType = {
    EditingTool: "EditingTool",
    DrawingTool: "DrawingTool"
};

export class BuiltInTools {

    static #tools = null;

    static async getTools(baseUrl) {
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
                cursorSrc: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 100 100"><g fill="white" stroke="black" stroke-width="2"><path d="M 50,10 L 35,20 45,20 45,45 20,45 20,35 10,50 20,65 20,55 45,55 45,80 35,80 50,90 65,80 55,80 55,55 80,55 80,65 90,50 80,35 80,45 55,45 55,20 65,20z"></path></g></svg>')}`,
                cursorHotspot: { x: 15, y: 15 },
                toolType: ToolType.EditingTool
            }));

            BuiltInTools.#tools.push(new Tool({
                ref: {
                    versionId: 1,
                    isBuiltIn: true,
                    name: "Select path"
                },
                moduleSrc: `${baseUrl}/domain/tools/select-path.js`,
                thumbnailSrc: '<svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 0 100 100"><g class="icon"><circle cx="25" cy="25" r="10"></circle><line x1="25" y1="10" x2="25" y2="20" /><line x1="25" y1="30" x2="25" y2="40" /><line x1="10" y1="25" x2="20" y2="25" /><line x1="30" y1="25" x2="40" y2="25" /><path stroke-dasharray="4" d="M 25,25 l 10,10 15,15 -10,15, 10,15 20,10"></path></g></svg>',
                cursorSrc: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 100 100"><g stroke="black" stroke-width="2" fill="white" stroke-linecap="round"><path d="M 0,0 m 50,10 a 40 40 0 0 0 0 80 l 0,-10 a 30 30 0 0 1 0 -60 z"></path><path d="M 0,0 m 50,10 a 40 40 0 0 1 1 80 l 0,-10 a 30 30 0 0 0 0 -60 z"></path><path d="M 45,5 l 10,0 0,20 -5,15 -5,-15 z" /><path d="M 95,45 l 0,10 -20,0 -15,-5 15,-5 z" /><path d="M 55,95 l -10,0 0,-20 5,-15 5,15 z" /><path d="M 5,55 l 0,-10 20,0 15,5 -15,5 z" /></g></svg>')}`,
                cursorHotspot: { x: 15, y: 15 },
                toolType: ToolType.EditingTool
            }));

            BuiltInTools.#tools.push(new Tool({
                ref: {
                    versionId: 1,
                    isBuiltIn: true,
                    name: "Draw path"
                },
                moduleSrc: `${baseUrl}/domain/tools/draw-path.js`,
                thumbnailSrc: '<svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 0 100 100"><g class="icon"><circle cx="25" cy="25" r="10"></circle><line x1="25" y1="10" x2="25" y2="20" /><line x1="25" y1="30" x2="25" y2="40" /><line x1="10" y1="25" x2="20" y2="25" /><line x1="30" y1="25" x2="40" y2="25" /><path stroke-dasharray="4" d="M 25,25 l 10,10 15,15 -10,15, 10,15 20,10"></path></g></svg>',
                cursorSrc: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 100 100"><g stroke="white" stroke-width="2" fill="black" stroke-linecap="round"><path d="M 0,0 m 50,10 a 40 40 0 0 0 0 80 l 0,-10 a 30 30 0 0 1 0 -60 z"></path><path d="M 0,0 m 50,10 a 40 40 0 0 1 1 80 l 0,-10 a 30 30 0 0 0 0 -60 z"></path><path d="M 45,5 l 10,0 0,20 -5,15 -5,-15 z" /><path d="M 95,45 l 0,10 -20,0 -15,-5 15,-5 z" /><path d="M 55,95 l -10,0 0,-20 5,-15 5,15 z" /><path d="M 5,55 l 0,-10 20,0 15,5 -15,5 z" /></g></svg>')}`,
                cursorHotspot: { x: 15, y: 15 },
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
        if (data) {
            this.#moduleSrc = data.moduleSrc;
            this.#thumbnailSrc = data.thumbnailSrc;
            this.#cursorSrc = data.cursorSrc,
            this.#cursorHotspot = data.cursorHotspot,
            this.#toolType = data.toolType;
        }
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
        const change = this.#getPropertyChange("moduleSrc", this.#moduleSrc, moduleSrc);
        this.#moduleSrc = moduleSrc;
        this.#onChange(change);
    }

    /** @type {string}  */
    #thumbnailSrc;
    get thumbnailSrc() {
        return this.#thumbnailSrc;
    }
    set thumbnailSrc(thumbnailSrc) {
        const change = this.#getPropertyChange("thumbnailSrc", this.#thumbnailSrc, thumbnailSrc);
        this.#thumbnailSrc = thumbnailSrc;
        this.#onChange(change);
    }

    /** @type {string}  */
    #cursorSrc;
    get cursorSrc() {
        return this.#cursorSrc;
    }
    set cursorSrc(cursorSrc) {
        const change = this.#getPropertyChange("cursorSrc", this.#cursorSrc, cursorSrc);
        this.#cursorSrc = cursorSrc;
        this.#onChange(change);
    }

    /** @type {{x: number, y: number}} */
    #cursorHotspot;
    get cursorHotspot() {
        return this.#cursorHotspot;
    }
    set cursorHotspot(cursorHotspot) {
        const change = this.#getPropertyChange("cursorHotspot", this.#cursorHotspot, cursorHotspot);
        this.#cursorHotspot = cursorHotspot;
        this.#onChange(change);
    }

    /** @type {ToolType}  */
    #toolType;
    get toolType() {
        return this.#toolType;
    }
    set toolType(toolType) {
        const change = this.#getPropertyChange("toolType", this.#toolType, toolType);
        this.#toolType = toolType;
        this.#onChange(change);
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
        const index = this.#eventListeners[eventName].findIndex(l => l === listener);
        if (index > -1) {
            this.#eventListeners.splice(index, 1);
        }
    }

    // helpers
    #eventListeners;

    #onChange = (change) => {
        if (this.#eventListeners[Change.ChangeEvent]) {
            for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                listener(change);
            }
        }
    }

    #getPropertyChange(propertyName, oldValue, newValue) {
        return new Change({
            changeObjectType: Tool.name,
            changeObjectRef: this.ref,
            changeType: ChangeType.Edit,
            changeData: [
                {
                    propertyName: propertyName,
                    oldValue: oldValue,
                    newValue: newValue
                }
            ]
        });
    }
}
