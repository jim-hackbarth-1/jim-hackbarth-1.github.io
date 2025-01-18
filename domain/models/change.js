
/** @readonly @enum {string} */
export const ChangeType = {
    Edit: "Edit",
    Insert: "Insert",
    Delete: "Delete",
    Sort: "Sort" // <-- ???
};

export class Change {

    static get ChangeEvent() {
        return "ChangeEvent";
    }

    // constructor
    constructor(data) {
        this.#changeType = data?.changeType;
        this.#changeObjectType = data?.changeObjectType;
        this.#propertyName = data?.propertyName;
        this.#oldValue = data?.oldValue;
        this.#newValue = data?.newValue;
        this.#itemIndex = data?.itemIndex;
        this.#itemValue = data?.itemValue;
        this.#layerName = data?.layerName;
        this.#mapItemGroupId = data?.mapItemGroupId;
        this.#mapItemId = data?.mapItemId;
        this.#pathId = data?.pathId;
        this.#clipPathId = data?.clipPathId;      
    }

    //  properties
    #changeType;
    get changeType() {
        return this.#changeType;
    }

    /** @type {string}  */
    #changeObjectType;
    get changeObjectType() {
        return this.#changeObjectType;
    }

    /** @type {string}  */
    #propertyName;
    get propertyName() {
        return this.#propertyName;
    }

    /** @type {any}  */
    #oldValue;
    get oldValue() {
        return this.#oldValue;
    }

    /** @type {any}  */
    #newValue;
    get newValue() {
        return this.#newValue;
    }

    /** @type {number}  */
    #itemIndex;
    get itemIndex() {
        return this.#itemIndex;
    }

    /** @type {any}  */
    #itemValue;
    get itemValue() {
        return this.#itemValue;
    }

    /** @type {string}  */
    #layerName;
    get layerName() {
        return this.#layerName;
    }
    set layerName(layerName) {
        this.#layerName = layerName;
    }

    /** @type {string}  */
    #mapItemGroupId;
    get mapItemGroupId() {
        return this.#mapItemGroupId;
    }
    set mapItemGroupId(mapItemGroupId) {
        this.#mapItemGroupId = mapItemGroupId;
    }

    /** @type {string}  */
    #mapItemId;
    get mapItemId() {
        return this.#mapItemId;
    }
    set mapItemId(mapItemId) {
        this.#mapItemId = mapItemId;
    }

    /** @type {string}  */
    #pathId;
    get pathId() {
        return this.#pathId;
    }
    set pathId(pathId) {
        this.#pathId = pathId;
    }

    /** @type {string}  */
    #clipPathId;
    get clipPathId() {
        return this.#clipPathId;
    }
    set clipPathId(clipPathId) {
        this.#clipPathId = clipPathId;
    }

    // methods
    getData() {
        return {
            changeType: this.#changeType,
            changeObjectType: this.#changeObjectType,
            propertyName: this.#propertyName,
            oldValue: this.#oldValue,
            newValue: this.#newValue,
            itemIndex: this.#itemIndex,
            itemValue: this.#itemValue,
            layerName: this.#layerName,
            mapItemGroupId: this.#mapItemGroupId,
            mapItemId: this.#mapItemId,
            pathId: this.#pathId,
            clipPathId: this.#clipPathId
        };
    }
}

export class ChangeSet {

    // constructor
    constructor(data) {
        this.#changes = [];
        if (data?.changes) {
            for (const change of data.changes) {
                this.#changes.push(new Change(change));
            }
        }
    }

    // properties
    /** @type {[Change]}  */
    #changes;
    get changes() {
        return this.#changes ?? [];
    }

    // methods
    getData() {
        const changes = [];
        for (const change of this.#changes) {
            changes.push(change.getData());
        }
        return {
            changes: changes
        };
    }

    static getPropertyChange(changeObjectType, propertyName, v1, v2) {
        const oldValue = v1?.getData ? v1.getData() : v1;
        const newValue = v2?.getData ? v2.getData() : v2;
        return new ChangeSet({
            changes: [{
                changeType: ChangeType.Edit,
                changeObjectType: changeObjectType,
                propertyName: propertyName,
                oldValue: oldValue,
                newValue: newValue
            }]
        });
    }
}