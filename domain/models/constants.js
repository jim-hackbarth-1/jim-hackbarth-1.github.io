
/**
 * @readonly
 * @enum {string}
 */
export const ErrorMessage = {
    NullValue: "value may not be null"
}

/**
 * @readonly
 * @enum {string}
 */
export const ChangeType = {
    CaptionProperty: "CaptionProperty",
    LayerAddMapItem: "LayerAddMapItem",
    LayerInsertMapItem: "LayerInsertMapItem",
    LayerProperty: "LayerProperty",
    LayerRemoveMapItem: "LayerRemoveMapItem",
    MapAddLayer: "MapAddLayer",
    MapAddMapItemTemplate: "MapAddMapItemTemplate",
    MapAddMapItemTemplateRef: "MapAddMapItemTemplateRef",
    MapAddTool: "MapAddTool",
    MapAddToolRef: "MapAddToolRef",
    MapInsertLayer: "MapInsertLayer",
    MapInsertMapItemTemplate: "MapInsertMapItemTemplate",
    MapInsertMapItemTemplateRef: "MapInsertMapItemTemplateRef",
    MapInsertTool: "MapInsertTool",
    MapInsertToolRef: "MapInsertToolRef",
    MapRemoveLayer: "MapRemoveLayer",
    MapRemoveMapItemTemplate: "MapRemoveMapItemTemplate",
    MapRemoveMapItemTemplateRef: "MapRemoveMapItemTemplateRef",
    MapRemoveTool: "MapRemoveTool",
    MapRemoveToolRef: "MapRemoveToolRef",
    MapProperty: "MapProperty",
    MapItemProperty: "MapItemProperty",
    MapItemTemplateAddFill: "MapItemTemplateAddFill",
    MapItemTemplateAddStroke: "MapItemTemplateAddStroke",
    MapItemTemplateInsertFill: "MapItemTemplateInsertFill",
    MapItemTemplateInsertStroke: "MapItemTemplateInsertStroke",
    MapItemTemplateProperty: "MapItemTemplateProperty",
    MapItemTemplateRemoveFill: "MapItemTemplateRemoveFill",
    MapItemTemplateRemoveStroke: "MapItemTemplateRemoveStroke",
    ToolPaletteAddDrawingToolPalette: "ToolPaletteAddDrawingToolPalette",
    ToolPaletteAddEditingToolPalette: "ToolPaletteAddEditingToolPalette",
    ToolPaletteAddMapItemTemplatePalette: "ToolPaletteAddMapItemTemplatePalette",
    ToolPaletteInsertDrawingToolPalette: "ToolPaletteInsertDrawingToolPalette",
    ToolPaletteInsertEditingToolPalette: "ToolPaletteInsertEditingToolPalette",
    ToolPaletteInsertMapItemTemplatePalette: "ToolPaletteInsertMapItemTemplatePalette",
    ToolPaletteProperty: "ToolPaletteProperty",
    ToolPaletteRemoveDrawingToolPalette: "ToolPaletteRemoveDrawingToolPalette",
    ToolPaletteRemoveEditingToolPalette: "ToolPaletteRemoveEditingToolPalette",
    ToolPaletteRemoveMapItemTemplatePalette: "ToolPaletteRemoveMapItemTemplatePalette",
    ToolProperty: "ToolProperty"
};

/**
 * @readonly
 * @enum {string}
 */
export const ChangeEventType = {
    beforeChangeEvent: "beforeChangeEvent",
    afterChangeEvent: "afterChangeEvent"
};

/**
 * @readonly
 * @enum {string}
 */
export const GradientType = {
    LinearGradient: "LinearGradient",
    RadialGradient: "RadialGradient"
};

/**
 * @readonly
 * @enum {string}
 */
export const ToolType = {
    EditingTool: "EditingTool",
    DrawingTool: "DrawingTool"
};
