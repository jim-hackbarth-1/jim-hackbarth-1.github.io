
export class Change {

    static get ChangeEvent() {
        return "ChangeEvent";
    }

    // constructor
    constructor(data) {
        this.#changeObjectType = data?.changeObjectType;
        this.#changeObjectRef = data?.changeObjectRef;
        this.#changeType = data?.changeType;
        this.#changeData = data?.changeData;
    }

    //  properties
    /** @type {string}  */
    #changeObjectType;
    get changeObjectType() {
        return this.#changeObjectType;
    }

    #changeObjectRef;
    get changeObjectRef() {
        return this.#changeObjectRef;
    }

    #changeType;
    get changeType() {
        return this.#changeType;
    }

    #changeData;
    get changeData() {
        return this.#changeData;
    }

    // methods
    getData() {
        return {
            changeObjectType: this.#changeObjectType,
            changeObjectRef: this.#changeObjectRef,
            changeType: this.#changeType,
            changeData: this.#changeData
        };
    }
}

/** @readonly @enum {string} */
export const ChangeType = {
    Edit: "Edit",
    Insert: "Insert",
    Delete: "Delete",
    Sort: "Sort",
    Move: "Move",
    Resize: "Resize"
};
