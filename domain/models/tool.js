
import { ChangeEventType, ChangeType, EntityReference, ToolType } from "../references.js";

export class BuiltInTools {

    static #tools = null;

    static async getTools() {
        if (!BuiltInTools.#tools) {
            BuiltInTools.#tools = [];
            const toolData = {
                ref: {
                    versionId: 1,
                    isBuiltIn: true,
                    name: "Draw Path"
                },
                moduleSrc: "http://localhost:63743/domain/tools/draw-path.js",  // TODO: base path from config
                thumbnailSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFRSURBVEhLYxgFo2AUDDrg7u5eqaGh+b+gqPjPo0ePOKHCtAV6utoXN27e+v/Zi1f/S8rK/8fExv3/9+8fN1SaNkBNSfSrrrrk/4N7N/z//utP2uOnz/+DfA5k/4cqoT5QUxL7sGJizP89i9L+wyzfun3nf29vH9pZDPTpd5Cl7841gTHMcj1dnf+Hjx7///3nn9NQpdQDqopiv5AthVmsriT2f/vm5f+//fz9D6qUegBo6W9clq5ZPo02lgLj9B8+S0HxCgSMUOXUAURaygxVTh0AtPT/QAQvXktpkm3CfK1bpjcH09dSEFBTFP3/6nQDTkupnpBgIC3CAm7p+unxtPcpCCREuMwvSLT9X57u+N9EV/a/uaHS/11bl8N8ygZVRn1gZ67208fV6H9XY+7/k0d3gS2kafDCALCsPQSzDJRdvv36UwWVGgWjYBRgAQwMAGLzbRR/6RRMAAAAAElFTkSuQmCC",
                toolType: ToolType.DrawingTool
            };
            BuiltInTools.#tools.push(new Tool(toolData));
        }
        return BuiltInTools.#tools;
    }

    static getTool(toolRef) {
        return BuiltInTools.getTools.find(t => EntityReference.areEqual(t.ref, toolRef));
    }
}

export class Tool {

    // constructor
    constructor(data) {
        this.#ref = new EntityReference(data?.ref);
        if (data) {
            this.#moduleSrc = data.moduleSrc;
            this.#thumbnailSrc = data.thumbnailSrc;
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
