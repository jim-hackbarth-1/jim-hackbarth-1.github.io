
import { InputUtilities } from "../references.js";

export class EntityReference {

    // constructor
    constructor(data) {
        this.#versionId = InputUtilities.cleanseNumber(data?.versionId);
        this.#isBuiltIn = InputUtilities.cleanseBoolean(data?.isBuiltIn);
        this.#isFromTemplate = InputUtilities.cleanseBoolean(data?.isFromTemplate);
        this.#name = InputUtilities.cleanseString(data?.name);
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
    static getRefs(refsData) {
        const refs = [];
        if (refsData) {
            for (const ref of refsData) {
                refs.push(new EntityReference(ref));
            }
        }
        return refs;
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

    getData() {
        return {
            versionId: this.#versionId,
            isBuiltIn: this.#isBuiltIn,
            isFromTemplate: this.#isFromTemplate,
            name: this.#name
        };
    }

    validateUniqueEntityReferences(entityReferences) {
        if (entityReferences) {
            const foundReferences = [];
            for (const entityReference of entityReferences) {
                const foundReference = foundReferences.find(r => EntityReference.areEqual(r, entityReference));
                if (foundReference) {
                    throw new Error(ErrorMessage.ItemAlreadyExistsInList);
                }
                foundReferences.push(entityReference);
            }
        }
    }
}
