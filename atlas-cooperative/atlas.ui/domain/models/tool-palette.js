
import { Change, ChangeSet, ChangeType, EntityReference } from "../references.js";

export class ToolPalette {

    // constructor
    constructor(data) {
        this.#editingToolPalettes = this.getPalettes(data?.editingToolPalettes);
        this.#drawingToolPalettes = this.getPalettes(data?.drawingToolPalettes);
        this.#mapItemTemplatePalettes = this.getPalettes(data?.mapItemTemplatePalettes);
        this.#eventListeners = {};
    }

    // properties
    /** @type {EntityReference[][]}  */
    #editingToolPalettes;
    get editingToolPalettes() {
        return this.#editingToolPalettes;
    }
    set editingToolPalettes(editingToolPalettes) {
        const changeSet = this.#getPropertyChange(
            "editingToolPalettes", this.getPalettesData(this.#editingToolPalettes), this.getPalettesData(editingToolPalettes));
        this.#editingToolPalettes = editingToolPalettes ?? [];
        this.#onChange(changeSet);
    }

    /** @type {EntityReference[][]}  */
    #drawingToolPalettes;
    get drawingToolPalettes() {
        return this.#drawingToolPalettes;
    }
    set drawingToolPalettes(drawingToolPalettes) {
        const changeSet = this.#getPropertyChange(
            "drawingToolPalettes", this.getPalettesData(this.#drawingToolPalettes), this.getPalettesData(drawingToolPalettes));
        this.#drawingToolPalettes = drawingToolPalettes ?? [];
        this.#onChange(changeSet);
    }

    /** @type {EntityReference[][]}  */
    #mapItemTemplatePalettes;
    get mapItemTemplatePalettes() {
        return this.#mapItemTemplatePalettes;
    }
    set mapItemTemplatePalettes(mapItemTemplatePalettes) {
        const changeSet = this.#getPropertyChange(
            "mapItemTemplatePalettes", this.getPalettesData(this.#mapItemTemplatePalettes), this.getPalettesData(mapItemTemplatePalettes));
        this.#mapItemTemplatePalettes = mapItemTemplatePalettes ?? [];
        this.#onChange(changeSet);
    }

    // methods
    getData() {
        return {
            editingToolPalettes: this.getPalettesData(this.#editingToolPalettes),
            drawingToolPalettes: this.getPalettesData(this.#drawingToolPalettes),
            mapItemTemplatePalettes: this.getPalettesData(this.#mapItemTemplatePalettes)
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

    addEditingToolPalette(editingToolPalette) {
        if (!editingToolPalette) {
            throw new Error(ErrorMessage.NullValue);
        }
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: ToolPalette.name,
            propertyName: "editingToolPalettes",
            itemIndex: this.editingToolPalettes.length,
            itemValue: editingToolPalette.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#editingToolPalettes.push(editingToolPalette);
        this.#onChange(changeSet);
    }

    insertEditingToolPalette(editingToolPalette, index) {
        if (!editingToolPalette) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (index < 0 || index > this.editingToolPalettes.length) {
            throw new Error(ErrorMessage.InvalidIndex);
        }
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: ToolPalette.name,
            propertyName: "editingToolPalettes",
            itemIndex: index,
            itemValue: editingToolPalette.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#editingToolPalettes.splice(index, 0, editingToolPalette);
        this.#onChange(changeSet);
    }

    removeEditingToolPalette(editingToolPalette) {
        const index = this.#editingToolPalettes.findIndex(p => p === editingToolPalette);
        if (index > -1) {
            const changeData = {
                changeType: ChangeType.Delete,
                changeObjectType: ToolPalette.name,
                propertyName: "editingToolPalettes",
                itemIndex: index,
                itemValue: editingToolPalette.getData()
            };
            const changeSet = new ChangeSet({ changes: [changeData] });
            this.#editingToolPalettes.splice(index, 1);
            this.#onChange(changeSet);
        }
    }

    clearEditingToolPalettes() {
        this.editingToolPalettes = [];
    }

    addDrawingToolPalette(drawingToolPalette) {
        if (!drawingToolPalette) {
            throw new Error(ErrorMessage.NullValue);
        }
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: ToolPalette.name,
            propertyName: "drawingToolPalettes",
            itemIndex: this.drawingToolPalettes.length,
            itemValue: drawingToolPalette.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#drawingToolPalettes.push(drawingToolPalette);
        this.#onChange(changeSet);
    }

    insertDrawingToolPalette(drawingToolPalette, index) {
        if (!drawingToolPalette) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (index < 0 || index > this.drawingToolPalettes.length) {
            throw new Error(ErrorMessage.InvalidIndex);
        }
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: ToolPalette.name,
            propertyName: "drawingToolPalettes",
            itemIndex: index,
            itemValue: drawingToolPalette.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#drawingToolPalettes.splice(index, 0, drawingToolPalette);
        this.#onChange(changeSet);
    }

    removeDrawingToolPalette(drawingToolPalette) {
        const index = this.#drawingToolPalettes.findIndex(p => p === drawingToolPalette);
        if (index > -1) {
            const changeData = {
                changeType: ChangeType.Delete,
                changeObjectType: ToolPalette.name,
                propertyName: "drawingToolPalettes",
                itemIndex: index,
                itemValue: drawingToolPalette.getData()
            };
            const changeSet = new ChangeSet({ changes: [changeData] });
            this.#drawingToolPalettes.splice(index, 1);
            this.#onChange(changeSet);
        }
    }

    clearDrawingToolPalettes() {
        this.drawingToolPalettes = [];
    }

    addMapItemTemplatePalette(mapItemTemplatePalette) {
        if (!mapItemTemplatePalette) {
            throw new Error(ErrorMessage.NullValue);
        }
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: ToolPalette.name,
            propertyName: "mapItemTemplatePalettes",
            itemIndex: this.mapItemTemplatePalettes.length,
            itemValue: mapItemTemplatePalette.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#mapItemTemplatePalettes.push(mapItemTemplatePalette);
        this.#onChange(changeSet);
    }

    insertMapItemTemplatePalette(mapItemTemplatePalette, index) {
        if (!mapItemTemplatePalette) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (index < 0 || index > this.mapItemTemplatePalettes.length) {
            throw new Error(ErrorMessage.InvalidIndex);
        }
        const changeData = {
            changeType: ChangeType.Insert,
            changeObjectType: ToolPalette.name,
            propertyName: "mapItemTemplatePalettes",
            itemIndex: index,
            itemValue: mapItemTemplatePalette.getData()
        };
        const changeSet = new ChangeSet({ changes: [changeData] });
        this.#mapItemTemplatePalettes.splice(index, 0, mapItemTemplatePalette);
        this.#onChange(changeSet);
    }

    removeMapItemTemplatePalette(mapItemTemplatePalette) {
        const index = this.#mapItemTemplatePalettes.findIndex(p => p === mapItemTemplatePalette);
        if (index > -1) {
            const changeData = {
                changeType: ChangeType.Delete,
                changeObjectType: ToolPalette.name,
                propertyName: "mapItemTemplatePalettes",
                itemIndex: index,
                itemValue: mapItemTemplatePalette.getData()
            };
            const changeSet = new ChangeSet({ changes: [changeData] });
            this.#mapItemTemplatePalettes.splice(index, 1);
            this.#onChange(changeSet);
        }
    }

    clearMapItemTemplatePalettes() {
        this.mapItemTemplatePalettes = [];
    }

    getPalettes(palettesData) {
        const palettes = [];
        if (palettesData) {
            for (const paletteData of palettesData) {
                const refs = [];
                for (const ref of paletteData) {
                    refs.push(new EntityReference(ref));
                }
                palettes.push(refs);
            }
        }
        return palettes;
    }

    getPalettesData(palettes) {
        let palettesData = null;
        if (palettes && palettes.length > 0) {
            palettesData = [];
            for (const palette of palettes) {
                const refs = [];
                for (const ref of palette) {
                    refs.push(ref.getData());
                }
                palettesData.push(refs);
            }
        }
        return palettesData;
    }

    applyChange(change, undoing) {
        if (change.changeType == ChangeType.Edit) {
            this.#applyPropertyChange(change.propertyName, undoing ? change.oldValue : change.newValue);
        }
    }

    // helpers
    #eventListeners;

    #onChange = (changeSet) => {
        if (this.#eventListeners[Change.ChangeEvent]) {
            for (const listener of this.#eventListeners[Change.ChangeEvent]) {
                listener(changeSet);
            }
        }
    }

    #getPropertyChange(propertyName, v1, v2) {
        return ChangeSet.getPropertyChange(ToolPalette.name, propertyName, v1, v2);
    }

    #applyPropertyChange(propertyName, propertyValue) {
        switch (propertyName) {
            case "editingToolPalettes":
                this.editingToolPalettes = this.getPalettes(propertyValue);
                break;
            case "drawingToolPalettes":
                this.drawingToolPalettes = this.getPalettes(propertyValue);
                break;
            case "mapItemTemplatePalettes":
                this.mapItemTemplatePalettes = this.getPalettes(propertyValue);
                break;
        }
    }
}
