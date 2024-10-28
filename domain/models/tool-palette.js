
import { ChangeEventType, ChangeType, EntityReference } from "../references.js";

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
        this.#beforeChange({ changeType: ChangeType.ToolPaletteProperty, changeData: { propertyName: "editingToolPalettes", propertyValue: this.editingToolPalettes } });
        this.#editingToolPalettes = editingToolPalettes ?? [];
        this.#afterChange({ changeType: ChangeType.ToolPaletteProperty, changeData: { propertyName: "editingToolPalettes", propertyValue: this.editingToolPalettes } });
    }

    /** @type {EntityReference[][]}  */
    #drawingToolPalettes;
    get drawingToolPalettes() {
        return this.#drawingToolPalettes;
    }
    set drawingToolPalettes(drawingToolPalettes) {
        this.#beforeChange({ changeType: ChangeType.ToolPaletteProperty, changeData: { propertyName: "drawingToolPalettes", propertyValue: this.drawingToolPalettes } });
        this.#drawingToolPalettes = drawingToolPalettes ?? [];
        this.#afterChange({ changeType: ChangeType.ToolPaletteProperty, changeData: { propertyName: "drawingToolPalettes", propertyValue: this.drawingToolPalettes } });
    }

    /** @type {EntityReference[][]}  */
    #mapItemTemplatePalettes;
    get mapItemTemplatePalettes() {
        return this.#mapItemTemplatePalettes;
    }
    set mapItemTemplatePalettes(mapItemTemplatePalettes) {
        this.#beforeChange({ changeType: ChangeType.ToolPaletteProperty, changeData: { propertyName: "mapItemTemplatePalettes", propertyValue: this.mapItemTemplatePalettes } });
        this.#mapItemTemplatePalettes = mapItemTemplatePalettes ?? [];
        this.#afterChange({ changeType: ChangeType.ToolPaletteProperty, changeData: { propertyName: "mapItemTemplatePalettes", propertyValue: this.mapItemTemplatePalettes } });
    }

    // methods
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
        this.#beforeChange({ changeType: ChangeType.ToolPaletteAddEditingToolPalette, changeData: { editingToolPalette: editingToolPalette } });
        this.#editingToolPalettes.push(editingToolPalettes);
        this.#afterChange({ changeType: ChangeType.ToolPaletteAddEditingToolPalette, changeData: { editingToolPalette: editingToolPalette } });
    }

    insertEditingToolPalette(index, editingToolPalette) {
        if (!editingToolPalette) {
            throw new Error(ErrorMessage.NullValue);
        }
        this.#beforeChange({ changeType: ChangeType.ToolPaletteInsertEditingToolPalette, changeData: { index: index, editingToolPalette: editingToolPalette } });
        this.#editingToolPalettes.splice(index, 0, editingToolPalette);
        this.#afterChange({ changeType: ChangeType.ToolPaletteInsertEditingToolPalette, changeData: { index: index, editingToolPalette: editingToolPalette } });
    }

    removeEditingToolPalette(editingToolPalette) {
        const index = this.#editingToolPalettes.findIndex(p => p === editingToolPalette);
        if (index > -1) {
            this.#beforeChange({ changeType: ChangeType.ToolPaletteRemoveEditingToolPalette, changeData: { index: index, editingToolPalette: editingToolPalette } });
            this.#editingToolPalettes.splice(index, 1);
            this.#afterChange({ changeType: ChangeType.ToolPaletteRemoveEditingToolPalette, changeData: { index: index, editingToolPalette: editingToolPalette } });
        }
    }

    clearEditingToolPalettes() {
        this.editingToolPalettes([]);
    }

    addDrawingToolPalette(drawingToolPalette) {
        if (!drawingToolPalette) {
            throw new Error(ErrorMessage.NullValue);
        }
        this.#beforeChange({ changeType: ChangeType.ToolPaletteAddDrawingToolPalette, changeData: { drawingToolPalette: drawingToolPalette } });
        this.#drawingToolPalettes.push(drawingToolPalette);
        this.#afterChange({ changeType: ChangeType.ToolPaletteAddDrawingToolPalette, changeData: { drawingToolPalette: drawingToolPalette } });
    }

    insertDrawingToolPalette(index, drawingToolPalette) {
        if (!drawingToolPalette) {
            throw new Error(ErrorMessage.NullValue);
        }
        this.#beforeChange({ changeType: ChangeType.ToolPaletteInsertDrawingToolPalette, changeData: { index: index, drawingToolPalette: drawingToolPalette } });
        this.#drawingToolPalettes.splice(index, 0, drawingToolPalette);
        this.#afterChange({ changeType: ChangeType.ToolPaletteInsertDrawingToolPalette, changeData: { index: index, drawingToolPalette: drawingToolPalette } });
    }

    removeDrawingToolPalette(drawingToolPalette) {
        const index = this.#drawingToolPalettes.findIndex(p => p === drawingToolPalette);
        if (index > -1) {
            this.#beforeChange({ changeType: ChangeType.ToolPaletteRemoveDrawingToolPalette, changeData: { index: index, drawingToolPalette: drawingToolPalette } });
            this.#drawingToolPalettes.splice(index, 1);
            this.#afterChange({ changeType: ChangeType.ToolPaletteRemoveDrawingToolPalette, changeData: { index: index, drawingToolPalette: drawingToolPalette } });
        }
    }

    clearDrawingToolPalettes() {
        this.drawingToolPalettes([]);
    }

    addMapItemTemplatePalette(mapItemTemplatePalette) {
        if (!mapItemTemplatePalette) {
            throw new Error(ErrorMessage.NullValue);
        }
        this.#beforeChange({ changeType: ChangeType.ToolPaletteAddMapItemTemplatePalette, changeData: { mapItemTemplatePalette: mapItemTemplatePalette } });
        this.#mapItemTemplatePalettes.push(mapItemTemplatePalette);
        this.#afterChange({ changeType: ChangeType.ToolPaletteAddMapItemTemplatePalette, changeData: { mapItemTemplatePalette: mapItemTemplatePalette } });
    }

    insertMapItemTemplatePalette(index, mapItemTemplatePalette) {
        if (!mapItemTemplatePalette) {
            throw new Error(ErrorMessage.NullValue);
        }
        this.#beforeChange({ changeType: ChangeType.ToolPaletteInsertMapItemTemplatePalette, changeData: { index: index, mapItemTemplatePalette: mapItemTemplatePalette } });
        this.#mapItemTemplatePalettes.splice(index, 0, mapItemTemplatePalette);
        this.#afterChange({ changeType: ChangeType.ToolPaletteInsertMapItemTemplatePalette, changeData: { index: index, mapItemTemplatePalette: mapItemTemplatePalette } });
    }

    removeMapItemTemplatePalette(mapItemTemplatePalette) {
        const index = this.#mapItemTemplatePalettes.findIndex(p => p === mapItemTemplatePalette);
        if (index > -1) {
            this.#beforeChange({ changeType: ChangeType.ToolPaletteRemoveMapItemTemplatePalette, changeData: { index: index, mapItemTemplatePalette: mapItemTemplatePalette } });
            this.#mapItemTemplatePalettes.splice(index, 1);
            this.#afterChange({ changeType: ChangeType.ToolPaletteRemoveMapItemTemplatePalette, changeData: { index: index, mapItemTemplatePalette: mapItemTemplatePalette } });
        }
    }

    clearMapItemTemplatePalettes() {
        this.mapItemTemplatePalettes([]);
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
}
