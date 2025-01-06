
import { Change, ChangeType, EntityReference } from "../references.js";

export class ToolPalette {

    // constructor
    constructor(data) {
        this.#editingToolPalettes = [];
        this.#drawingToolPalettes = [];
        this.#mapItemTemplatePalettes = [];
        if (data) {
            this.#editingToolPalettes = this.#getPalettes(data.editingToolPalettes);
            this.#drawingToolPalettes = this.#getPalettes(data.drawingToolPalettes);
            this.#mapItemTemplatePalettes = this.#getPalettes(data.mapItemTemplatePalettes);
        }
        this.#eventListeners = {};
    }

    // properties
    /** @type {EntityReference[][]}  */
    #editingToolPalettes;
    get editingToolPalettes() {
        return this.#editingToolPalettes;
    }
    set editingToolPalettes(editingToolPalettes) {
        const change = this.#getPropertyChange("editingToolPalettes", this.#editingToolPalettes, editingToolPalettes);
        this.#editingToolPalettes = editingToolPalettes ?? [];
        this.#onChange(change);
    }

    /** @type {EntityReference[][]}  */
    #drawingToolPalettes;
    get drawingToolPalettes() {
        return this.#drawingToolPalettes;
    }
    set drawingToolPalettes(drawingToolPalettes) {
        const change = this.#getPropertyChange("drawingToolPalettes", this.#drawingToolPalettes, drawingToolPalettes);
        this.#drawingToolPalettes = drawingToolPalettes ?? [];
        this.#onChange(change);
    }

    /** @type {EntityReference[][]}  */
    #mapItemTemplatePalettes;
    get mapItemTemplatePalettes() {
        return this.#mapItemTemplatePalettes;
    }
    set mapItemTemplatePalettes(mapItemTemplatePalettes) {
        const change = this.#getPropertyChange("mapItemTemplatePalettes", this.#mapItemTemplatePalettes, mapItemTemplatePalettes);
        this.#mapItemTemplatePalettes = mapItemTemplatePalettes ?? [];
        this.#onChange(change);
    }

    // methods
    static cleanseData(data, inputUtilities) {
        if (!data) {
            return null;
        }
        return {
            editingToolPalettes: ToolPalette.#cleansePalettesData(data.editingToolPalettes, inputUtilities),
            drawingToolPalettes: ToolPalette.#cleansePalettesData(data.drawingToolPalettes, inputUtilities),
            mapItemTemplatePalettes: ToolPalette.#cleansePalettesData(data.mapItemTemplatePalettes, inputUtilities),
        }
    }

    getData() {
        return {
            editingToolPalettes: this.#getPalettesData(this.#editingToolPalettes),
            drawingToolPalettes: this.#getPalettesData(this.#drawingToolPalettes),
            mapItemTemplatePalettes: this.#getPalettesData(this.#mapItemTemplatePalettes)
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

    addEditingToolPalette(editingToolPalette) {
        if (!editingToolPalette) {
            throw new Error(ErrorMessage.NullValue);
        }
        const change = new Change({
            changeObjectType: ToolPalette.name,
            changeType: ChangeType.Insert,
            changeData: { propertyName: "editingToolPalettes", indices: [this.editingToolPalettes.length] }
        });
        this.#editingToolPalettes.push(editingToolPalette);
        this.#onChange(change);
    }

    insertEditingToolPalette(editingToolPalette, index) {
        if (!editingToolPalette) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (index < 0 || index > this.editingToolPalettes.length) {
            throw new Error(ErrorMessage.InvalidIndex);
        }
        const change = new Change({
            changeObjectType: ToolPalette.name,
            changeType: ChangeType.Insert,
            changeData: { propertyName: "editingToolPalettes", indices: [index] }
        });
        this.#editingToolPalettes.splice(index, 0, editingToolPalette);
        this.#onChange(change);
    }

    removeEditingToolPalette(editingToolPalette) {
        const index = this.#editingToolPalettes.findIndex(p => p === editingToolPalette);
        if (index > -1) {
            const change = new Change({
                changeObjectType: ToolPalette.name,
                changeType: ChangeType.Delete,
                changeData: {
                    propertyName: "editingToolPalettes",
                    editingToolPalettes: [{ editingToolPaletteData: editingToolPalette.getData(), index: index }]
                }
            });
            this.#editingToolPalettes.splice(index, 1);
            this.#onChange(change);
        }
    }

    clearEditingToolPalettes() {
        this.editingToolPalettes = [];
    }

    addDrawingToolPalette(drawingToolPalette) {
        if (!drawingToolPalette) {
            throw new Error(ErrorMessage.NullValue);
        }
        const change = new Change({
            changeObjectType: ToolPalette.name,
            changeType: ChangeType.Insert,
            changeData: { propertyName: "drawingToolPalettes", indices: [this.drawingToolPalettes.length] }
        });
        this.#drawingToolPalettes.push(drawingToolPalette);
        this.#onChange(change);
    }

    insertDrawingToolPalette(drawingToolPalette, index) {
        if (!drawingToolPalette) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (index < 0 || index > this.drawingToolPalettes.length) {
            throw new Error(ErrorMessage.InvalidIndex);
        }
        const change = new Change({
            changeObjectType: ToolPalette.name,
            changeType: ChangeType.Insert,
            changeData: { propertyName: "drawingToolPalettes", indices: [index] }
        });
        this.#drawingToolPalettes.splice(index, 0, drawingToolPalette);
        this.#onChange(change);
    }

    removeDrawingToolPalette(drawingToolPalette) {
        const index = this.#drawingToolPalettes.findIndex(p => p === drawingToolPalette);
        if (index > -1) {
            const change = new Change({
                changeObjectType: ToolPalette.name,
                changeType: ChangeType.Delete,
                changeData: {
                    propertyName: "drawingToolPalettes",
                    drawingToolPalettes: [{ drawingToolPaletteData: drawingToolPalette.getData(), index: index }]
                }
            });
            this.#drawingToolPalettes.splice(index, 1);
            this.#onChange(change);
        }
    }

    clearDrawingToolPalettes() {
        this.drawingToolPalettes = [];
    }

    addMapItemTemplatePalette(mapItemTemplatePalette) {
        if (!mapItemTemplatePalette) {
            throw new Error(ErrorMessage.NullValue);
        }
        const change = new Change({
            changeObjectType: ToolPalette.name,
            changeType: ChangeType.Insert,
            changeData: { propertyName: "mapItemTemplatePalettes", indices: [this.mapItemTemplatePalettes.length] }
        });
        this.#mapItemTemplatePalettes.push(mapItemTemplatePalette);
        this.#onChange(change);
    }

    insertMapItemTemplatePalette(mapItemTemplatePalette, index) {
        if (!mapItemTemplatePalette) {
            throw new Error(ErrorMessage.NullValue);
        }
        if (index < 0 || index > this.mapItemTemplatePalettes.length) {
            throw new Error(ErrorMessage.InvalidIndex);
        }
        const change = new Change({
            changeObjectType: ToolPalette.name,
            changeType: ChangeType.Insert,
            changeData: { propertyName: "mapItemTemplatePalettes", indices: [index] }
        });
        this.#mapItemTemplatePalettes.splice(index, 0, mapItemTemplatePalette);
        this.#onChange(change);
    }

    removeMapItemTemplatePalette(mapItemTemplatePalette) {
        const index = this.#mapItemTemplatePalettes.findIndex(p => p === mapItemTemplatePalette);
        if (index > -1) {
            const change = new Change({
                changeObjectType: ToolPalette.name,
                changeType: ChangeType.Delete,
                changeData: {
                    propertyName: "mapItemTemplatePalettes",
                    mapItemTemplatePalettes: [{ mapItemTemplatePaletteData: mapItemTemplatePalette.getData(), index: index }]
                }
            });
            this.#mapItemTemplatePalettes.splice(index, 1);
            this.#onChange(change);
        }
    }

    clearMapItemTemplatePalettes() {
        this.mapItemTemplatePalettes = [];
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
            changeObjectType: ToolPalette.name,
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

    #getPalettes(palettesData) {
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

    #getPalettesData(palettes) {
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

    static #cleansePalettesData(palettes, inputUtilities) {
        const cleansedPalettes = [];
        if (palettes) {
            for (const palette of palettes) {
                const cleansedPalette = [];
                for (const ref of palette) {
                    cleansedPalette.push(EntityReference.cleanseData(ref, inputUtilities));
                }
                cleansedPalettes.push(cleansedPalette);
            }
        }
        return cleansedPalettes;
    }
}
