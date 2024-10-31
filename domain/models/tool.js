
import { ChangeEventType, ChangeType, EntityReference, ToolType } from "../references.js";

export class BuiltInTools {

    static #tools = null;

    static async getTools(baseUrl) {
        if (!BuiltInTools.#tools) {
            const moduleSrc = `${baseUrl}/domain/tools/draw-path.js`;
            BuiltInTools.#tools = [];
            const toolData = {
                ref: {
                    versionId: 1,
                    isBuiltIn: true,
                    name: "Draw Path"
                },
                moduleSrc: moduleSrc,
                thumbnailSrc: '<svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 0 100 100"><g class="icon" fill="none"><circle cx="25" cy="25" r="10"></circle><line x1="25" y1="10" x2="25" y2="20" /><line x1="25" y1="30" x2="25" y2="40" /><line x1="10" y1="25" x2="20" y2="25" /><line x1="30" y1="25" x2="40" y2="25" /><path stroke-dasharray="4" d="M 25,25 l 10,10 15,15 -10,15, 10,15 20,10"></path></g></svg>',
                cursorSrc: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 100 100"><g fill="none" stroke="black" stroke-width="2"><circle cx="50" cy="50" r="20"></circle><line x1="50" y1="20" x2="50" y2="40" /><line x1="50" y1="60" x2="50" y2="80" /><line x1="20" y1="50" x2="40" y2="50" /><line x1="60" y1="50" x2="80" y2="50" /></g></svg>')}`,
                cursorHotspot: { x: 15, y: 15 },
                toolType: ToolType.DrawingTool
            };
            BuiltInTools.#tools.push(new Tool(toolData));
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
        this.#beforeChange({ changeType: ChangeType.ToolProperty, changeData: { propertyName: "moduleSrc", propertyValue: this.moduleSrc } });
        this.#moduleSrc = moduleSrc;
        this.#afterChange({ changeType: ChangeType.ToolProperty, changeData: { propertyName: "moduleSrc", propertyValue: this.moduleSrc } });
    }

    /** @type {string}  */
    #thumbnailSrc;
    get thumbnailSrc() {
        return this.#thumbnailSrc;
    }
    set thumbnailSrc(thumbnailSrc) {
        this.#beforeChange({ changeType: ChangeType.ToolProperty, changeData: { propertyName: "thumbnailSrc", propertyValue: this.thumbnailSrc } });
        this.#ref = ref;
        this.#afterChange({ changeType: ChangeType.ToolProperty, changeData: { propertyName: "thumbnailSrc", propertyValue: this.thumbnailSrc } });
    }

    /** @type {string}  */
    #cursorSrc;
    get cursorSrc() {
        return this.#cursorSrc;
    }
    set cursorSrc(cursorSrc) {
        this.#beforeChange({ changeType: ChangeType.ToolProperty, changeData: { propertyName: "cursorSrc", propertyValue: this.cursorSrc } });
        this.#cursorSrc = cursorSrc;
        this.#afterChange({ changeType: ChangeType.ToolProperty, changeData: { propertyName: "cursorSrc", propertyValue: this.cursorSrc } });
    }

    /** @type {{x: number, y: number}} */
    #cursorHotspot;
    get cursorHotspot() {
        return this.#cursorHotspot;
    }
    set cursorHotspot(cursorHotspot) {
        this.#beforeChange({ changeType: ChangeType.MapItemProperty, changeData: { propertyName: "cursorHotspot", propertyValue: this.cursorHotspot } });
        this.#cursorHotspot = cursorHotspot;
        this.#afterChange({ changeType: ChangeType.MapItemProperty, changeData: { propertyName: "cursorHotspot", propertyValue: this.cursorHotspot } });
    }

    /** @type {ToolType}  */
    #toolType;
    get toolType() {
        return this.#toolType;
    }
    set toolType(toolType) {
        if (!toolType) {
            throw new Error(ErrorMessage.NullValue);
        }
        this.#beforeChange({ changeType: ChangeType.ToolProperty, changeData: { propertyName: "toolType", propertyValue: this.toolType } });
        this.#toolType = toolType;
        this.#afterChange({ changeType: ChangeType.ToolProperty, changeData: { propertyName: "toolType", propertyValue: this.toolType } });
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

    #beforeChange = (change) => {
        if (this.#eventListeners[ChangeEventType.beforeChangeEvent]) {
            for (const listener of this.#eventListeners[ChangeEventType.beforeChangeEvent]) {
                listener(change);
            }
        }
    }

    #afterChange = (change) => {
        if (this.#eventListeners[ChangeEventType.afterChangeEvent]) {
            for (const listener of this.#eventListeners[ChangeEventType.afterChangeEvent]) {
                listener(change);
            }
        }
    }
}
