
import { InputUtilities } from "../references.js";

export class EntityReference {

    // constructor
    constructor(data) {
        data = EntityReference.#cleanseData(data);
        if (data) {
            this.#versionId = data.versionId;
            this.#isBuiltIn = data.isBuiltIn;
            this.#isFromTemplate = data.isFromTemplate;
            this.#name = data.name;
        }
    }

    // properties
    /** @type {number}  */
    #versionId;
    get versionId() {
        return this.#versionId;
    }

    /** @type {boolean}  */
    #isBuiltIn;
    get isBuiltIn() {
        return this.#isBuiltIn;
    }

    /** @type {boolean}  */
    #isFromTemplate;
    get isFromTemplate() {
        return this.#isFromTemplate;
    }

    /** @type {string}  */
    #name;
    get name() {
        return this.#name;
    }

    // methods
    getData() {
        return {
            versionId: this.#versionId,
            isBuiltIn: this.#isBuiltIn,
            isFromTemplate: this.#isFromTemplate,
            name: this.#name
        };
    }

    static areEqual(entityReference1, entityReference2) {
        const versionId1 = entityReference1?.versionId ?? 0;
        const versionId2 = entityReference2?.versionId ?? 0;
        const isBuiltIn1 = entityReference1?.isBuiltIn ?? false;
        const isBuiltIn2 = entityReference2?.isBuiltIn ?? false;
        const isFromTemplate1 = entityReference1?.isFromTemplate ?? false;
        const isFromTemplate2 = entityReference2?.isFromTemplate ?? false;
        const name1 = entityReference1?.name ?? "";
        const name2 = entityReference2?.name ?? "";
        return versionId1 === versionId2
            && isBuiltIn1 === isBuiltIn2
            && isFromTemplate1 === isFromTemplate2
            && name1 === name2;
    }

    // helpers
    static #cleanseData(data) {
        if (!data) {
            return null;
        }
        return {
            versionId: InputUtilities.cleanseNumber(data.versionId),
            isBuiltIn: InputUtilities.cleanseBoolean(data.isBuiltIn),
            isFromTemplate: InputUtilities.cleanseBoolean(data.isFromTemplate),
            name: InputUtilities.cleanseString(data.name)
        };
    }
}
