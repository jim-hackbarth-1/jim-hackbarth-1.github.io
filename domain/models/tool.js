﻿
import { Change, ChangeType, EntityReference } from "../references.js";

/** @readonly @enum {string} */
export const ToolType = {
    EditingTool: "EditingTool",
    DrawingTool: "DrawingTool"
};

export class BuiltInTools {

    static #tools = null;

    static async getTools(baseUrl) {
        const selectCursorSrc = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 100 100"><g stroke="black" stroke-width="4" fill="white"><path d="M 5,5 L 80,80 A 5 5 -45 0 0 90 70 L 35,15 z" /></g></svg>')}`;
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
                cursorSrc: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 100 100"><g fill="white" stroke="black" stroke-width="4"><path d="M 50,10 L 35,20 45,20 45,45 20,45 20,35 10,50 20,65 20,55 45,55 45,80 35,80 50,90 65,80 55,80 55,55 80,55 80,65 90,50 80,35 80,45 55,45 55,20 65,20z"></path></g></svg>')}`,
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
                    name: "Draw path"
                },
                moduleSrc: `${baseUrl}/domain/tools/draw-path.js`,
                thumbnailSrc: '<svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 0 100 100"><g class="icon"><path d="M 50,5 Q 15 5, 10 15 T 20 40 T 20 60 T 20 80 T 50 85 T 80 80 T 90 45 T 55 20 z" /><path class="icon-text" d="M 15,15 L 65,65 A 2.5 2.5 -45 0 0 70 60 L 35,25 z" /></g></svg>',
                cursorSrc: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 100 100"><g stroke="white" stroke-width="4" fill="black"><path d="M 5,5 L 80,80 A 5 5 -45 0 0 90 70 L 35,15 z" /></g></svg>')}`,
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
                cursorSrc: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 100 100"><g stroke="white" stroke-width="4" fill="black"><path d="M 80 20 a 10 10 0 0 0 0 20 a 10 10 0 0 0 0 -20 z" /><path d="M 5,5 L 80,80 A 5 5 -45 0 0 90 70 L 35,15 z" /></g></svg>')}`,
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
