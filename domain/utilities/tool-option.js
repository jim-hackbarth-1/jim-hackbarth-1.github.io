
import { InputUtilities } from "../references.js";

export class ToolOption {

    // constructor
    constructor(data) {
        this.#name = InputUtilities.cleanseString(data?.name);
        this.#label = InputUtilities.cleanseString(data?.label);
        if (data?.keyboardEventInfo) {
            this.#keyboardEventInfo = new KeyboardEventInfo(data.keyboardEventInfo);
        }
        this.#description = InputUtilities.cleanseString(data?.description);
        this.#isVisible = InputUtilities.cleanseBoolean(data?.isVisible);
    }

    // properties
    #name;
    get name() {
        return this.#name;
    }

    #label;
    get label() {
        return this.#label;
    }

    #keyboardEventInfo;
    get keyboardEventInfo() {
        return this.#keyboardEventInfo;
    }

    #description;
    get description() {
        return this.#description;
    }

    #isVisible;
    get isVisible() {
        return this.#isVisible;
    }
    set isVisible(isVisible) {
        this.#isVisible = isVisible;
    }

    #typeName;
    get typeName() {
        return this.constructor.name;
    }

    // methods
    getData() {
        return {
            name: this.#name,
            label: this.#label,
            keyboardEventInfo: this.keyboardEventInfo ? this.keyboardEventInfo.getData() : null,
            description: this.#description,
            isVisible: this.#isVisible,
            typeName: this.typeName
        };
    }

    getKeyboardInfoLabel() {
        if (!this.keyboardEventInfo) {
            return "";
        }
        return this.keyboardEventInfo.getLabel();
    }
}

export class BooleanToolOption extends ToolOption {

    // constructor
    constructor(data) {
        super(data);
        if (data) {
            this.#isToggledOn = data.isToggledOn;
        }
    }

    // properties
    #isToggledOn;
    get isToggledOn() {
        return this.#isToggledOn;
    }
    set isToggledOn(isToggleOn) {
        this.#isToggledOn = isToggleOn;
    }

    // methods
    getData() {
        const data = super.getData();
        data.isToggledOn = this.#isToggledOn;
        return data;
    }
}

export class StatesToolOption extends ToolOption {

    // constructor
    constructor(data) {
        super(data);
        if (data) {
            this.#states = null;
            if (data?.states) {
                const states = [];
                for (const stateData of data.states) {
                    states.push(new ToolOptionState(stateData));
                }
                this.#states = states;
            }
            this.#currentStateName = data.currentStateName;
        }
    }

    // properties
    #states;
    get states() {
        return this.#states;
    }

    #currentStateName;
    get currentStateName() {
        return this.#currentStateName;
    }
    set currentStateName(stateName) {
        this.#currentStateName = stateName;
    }

    // methods
    getData() {
        const data = super.getData();
        let states = null;
        if (this.states) {
            states = [];
            for (const state of this.states) {
                states.push(state.getData());
            }
        }
        data.states = states;
        data.currentStateName = this.#currentStateName;
        return data;
    }
}

export class KeyboardEventInfo {

    // constructor
    constructor(data) {
        this.#key = InputUtilities.cleanseString(data?.key);
        this.#requiresControlKey = InputUtilities.cleanseBoolean(data?.requiresControlKey);
        this.#requiresShiftKey = InputUtilities.cleanseBoolean(data?.requiresShiftKey);
        this.#requiresAltKey = InputUtilities.cleanseBoolean(data?.requiresAltKey);
    }

    // properties
    #key;
    get key() {
        return this.#key;
    }

    #requiresControlKey;
    get requiresControlKey() {
        return this.#requiresControlKey;
    }

    #requiresShiftKey;
    get requiresShiftKey() {
        return this.#requiresShiftKey;
    }

    #requiresAltKey;
    get requiresAltKey() {
        return this.#requiresAltKey;
    }

    // methods
    getData() {
        return {
            key: this.#key,
            requiresControlKey: this.#requiresControlKey,
            requiresShiftKey: this.#requiresShiftKey,
            requiresAltKey: this.#requiresAltKey
        };
    }

    getLabel() {
        if (!this.key) {
            return "";
        }
        let label = this.key;
        if (this.requiresControlKey) {
            label = "Ctrl+" + label;
        }
        if (this.requiresAltKey) {
            label = "Alt+" + label;
        }
        if (this.requiresShiftKey) {
            label = "Shift+" + label;
        }
        return label;
    }

    isApplicableKeyEvent(key, isCtrlKey, isAltKey, isShiftKey) {
        let result = false;
        if (key && this.key && key?.toLowerCase() == this.key?.toLowerCase()) {
            result = true;
            if (this.requiresControlKey && !isCtrlKey) {
                result = false;
            }
            if (this.requiresShiftKey && !isShiftKey) {
                result = false;
            }
            if (this.requiresAltKey && !isAltKey) {
                result = false;
            }
        }
        return result;
    }
}

export class ToolOptionState {

    // constructor
    constructor(data) {
        this.#name = InputUtilities.cleanseString(data?.name);
        this.#label = InputUtilities.cleanseString(data?.label);
        if (data?.keyboardEventInfo) {
            this.#keyboardEventInfo = new KeyboardEventInfo(data.keyboardEventInfo);
        }
        this.#description = InputUtilities.cleanseString(data?.description);
    }

    // properties
    #name;
    get name() {
        return this.#name;
    }

    #label;
    get label() {
        return this.#label;
    }

    #keyboardEventInfo;
    get keyboardEventInfo() {
        return this.#keyboardEventInfo;
    }

    #description;
    get description() {
        return this.#description;
    }

    // methods
    getData() {
        return {
            name: this.#name,
            label: this.#label,
            keyboardEventInfo: this.keyboardEventInfo ? this.keyboardEventInfo.getData() : null,
            description: this.#description
        };
    }

    getKeyboardInfoLabel() {
        if (!this.keyboardEventInfo) {
            return "";
        }
        return this.keyboardEventInfo.getLabel();
    }
}

export class SharedToolOptions {

    static getAll() {
        return [
            new ToolOption({
                name: "AcceptChanges",
                label: "Accept changes",
                keyboardEventInfo: { key: "Enter", requiresAltKey: true },
                description: "Create poly-transit map item, accept preview set operation, ..."
            }),
            new ToolOption({
                name: "CancelChanges",
                label: "Cancel changes",
                keyboardEventInfo: { key: "Escape", requiresAltKey: true },
                description: "Clear poly-transits, ..."
            }),
            new BooleanToolOption({
                name: "LockMode",
                label: "Toggle lock mode",
                keyboardEventInfo: { key: "L", requiresAltKey: true },
                description: "Preserve aspect ration when resizing, move along only x or y axis, rotate in 45deg increments, ...",
                isToggledOn: false
            }),
            new BooleanToolOption({
                name: "MoveCaptionMode",
                label: "Move captions mode",
                keyboardEventInfo: { key: "C", requiresAltKey: true },
                description: "Move captions only",
                isToggledOn: false
            }),
            new StatesToolOption({
                name: "SetOperationMode",
                label: "Set operation",
                states: [
                    new ToolOptionState({
                        name: "Intersect",
                        label: "Intersect",
                        keyboardEventInfo: { key: "I", requiresAltKey: true },
                        description: "Get intersection of primary selection and secondary selections",
                    }),
                    new ToolOptionState({
                        name: "Union",
                        label: "Union",
                        keyboardEventInfo: { key: "U", requiresAltKey: true },
                        description: "Get union of primary selection and secondary selections",
                    }),
                    new ToolOptionState({
                        name: "Exclude",
                        label: "Exclude",
                        keyboardEventInfo: { key: "X", requiresAltKey: true },
                        description: "Get primary selection excluding secondary selections",
                    })
                ],
                currentStateName: "Intersect"
            }),
            new BooleanToolOption({
                name: "SingleSelectionMode",
                label: "Single selection mode",
                keyboardEventInfo: { key: "S", requiresAltKey: true },
                description: "Move, resize, rotate a single selection rather than all selections",
                isToggledOn: false
            }),
            new BooleanToolOption({
                name: "SnapToOverlay",
                label: "Snap to overlay",
                keyboardEventInfo: { key: "O", requiresAltKey: true },
                description: "Snap to overlay lines when drawing, moving, or resizing",
                isToggledOn: false
            })
        ];
    }
}
