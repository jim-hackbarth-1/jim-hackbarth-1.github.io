
import {
    ChangeType,
    EntityReference,
    Map,
    MapItemTemplate,
    MapWorkerClient,
    PathStyle,
    PathStyleOption,
    PathStyleType,
    Tool
} from "../../../domain/references.js";
import { DialogHelper } from "../../shared/dialog-helper.js";
import { EditorModel } from "../editor/editor.js";

export function createModel() {
    return new ToolPalettesDialogModel();
}

export class ToolPalettesDialogModel {

    // event handlers
    async init(kitElement) {
        this.#kitElement = kitElement;
        const kitKey = UIKit.renderer.getKitElementKey(this.#kitElement);
        UIKit.messenger.subscribe(
            EditorModel.MapUpdatedNotificationTopic,
            {
                elementKey: kitKey,
                id: `${EditorModel.MapUpdatedNotificationTopic}-${kitKey}`,
                object: this,
                callback: this.onMapUpdated.name
            }
        );
    }

    async onRendered() {
        if (ToolPalettesDialogModel.#isVisible) {
            this.#slideNavigation();
            const dialog = this.#kitElement.querySelector("dialog");
            const header = this.#kitElement.querySelector("header");
            this.#dialogHelper = new DialogHelper();
            this.#dialogHelper.show(dialog, header, this.#onCloseDialog);
        }
    }

    async onMapUpdated(message) {
        if (ToolPalettesDialogModel.#isVisible) {
            ToolPalettesDialogModel.#map = await MapWorkerClient.getMap(); 
            const changeInfo = ToolPalettesDialogModel.#getChangeInfo(message);
            switch (changeInfo.changeType) {
                case "tool-insert":
                    {
                        const toolsElement = this.#kitElement.querySelector("[data-nav-item-id='tools']");
                        await UIKit.renderer.renderKitElement(toolsElement.parentElement);
                        const newToolId = `tool-${ToolPalettesDialogModel.serializeRef(changeInfo.itemValue.ref)}`;
                        await this.selectNavItemByRefId(newToolId);
                    }
                    break;
                case "tool-edit":
                    {
                        const updatedToolId = `tool-${ToolPalettesDialogModel.serializeRef(changeInfo.toolRef)}`;
                        const toolElement = this.#kitElement.querySelector(`[data-nav-item-id="${updatedToolId}"]`);
                        await UIKit.renderer.renderKitElement(toolElement.parentElement);
                        await this.selectNavItemByRefId(updatedToolId);
                    }
                    break;
                case "tool-delete":
                    {
                        const toolsElement = this.#kitElement.querySelector("[data-nav-item-id='tools']");
                        await UIKit.renderer.renderKitElement(toolsElement.parentElement);
                        await this.selectNavItemByRefId("tools");
                        const prevElement = this.#kitElement.querySelector("[data-nav-item-id='palette.map.item.templates']");
                        prevElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
                    }
                    break;
                case "map.item.template-insert":
                    {
                        const mapItemTemplatesElement = this.#kitElement.querySelector("[data-nav-item-id='map.item.templates']");
                        await UIKit.renderer.renderKitElement(mapItemTemplatesElement.parentElement);
                        const newMapItemTemplateId
                            = `map.item.template-${ToolPalettesDialogModel.serializeRef(changeInfo.itemValue.ref)}`;
                        await this.selectNavItemByRefId(newMapItemTemplateId);
                    }
                    break;
                case "map.item.template-edit":
                    {
                        const updatedMapItemTemplateId
                            = `map.item.template-${ToolPalettesDialogModel.serializeRef(changeInfo.mapItemTemplateRef)}`;
                        const mapItemTemplateElement
                            = this.#kitElement.querySelector(`[data-nav-item-id="${updatedMapItemTemplateId}"]`);
                        await UIKit.renderer.renderKitElement(mapItemTemplateElement.parentElement);
                        await this.selectNavItemByRefId(updatedMapItemTemplateId);
                    }
                    break;
                case "map.item.template-delete":
                    {
                        const mapItemTemplatesElement = this.#kitElement.querySelector("[data-nav-item-id='map.item.templates']");
                        await UIKit.renderer.renderKitElement(mapItemTemplatesElement.parentElement);
                        await this.selectNavItemByRefId("map.item.templates");
                        const prevElement = this.#kitElement.querySelector("[data-nav-item-id='tools']");
                        prevElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
                    }
                    break;
                case "fills-sort":
                    {
                        const serialRef = ToolPalettesDialogModel.serializeRef(changeInfo.mapItemTemplateRef);
                        const fillsElement = this.#kitElement.querySelector(`[data-nav-item-id='fills-${serialRef}']`);
                        await UIKit.renderer.renderKitElement(fillsElement.parentElement);
                        await this.selectNavItemByRefId(`fills-${serialRef}`);
                    }
                    break;
                case "fill-insert":
                    {
                        const serialRef = ToolPalettesDialogModel.serializeRef(changeInfo.mapItemTemplateRef);
                        const fillsElement = this.#kitElement.querySelector(`[data-nav-item-id='fills-${serialRef}']`);
                        await UIKit.renderer.renderKitElement(fillsElement.parentElement);
                        const pathStyleId = changeInfo.pathStyle.id.replaceAll("-", ".");
                        await this.selectNavItemByRefId(`fill-${pathStyleId}-${serialRef}`);
                    }
                    break;
                case "fill-delete":
                    {
                        const serialRef = ToolPalettesDialogModel.serializeRef(changeInfo.mapItemTemplateRef);
                        const fillsElement = this.#kitElement.querySelector(`[data-nav-item-id='fills-${serialRef}']`);
                        await UIKit.renderer.renderKitElement(fillsElement.parentElement);
                        await this.selectNavItemByRefId(`fills-${serialRef}`);
                    }
                    break;
                case "strokes-sort":
                    {
                        const serialRef = ToolPalettesDialogModel.serializeRef(changeInfo.mapItemTemplateRef);
                        const strokesElement = this.#kitElement.querySelector(`[data-nav-item-id='strokes-${serialRef}']`);
                        await UIKit.renderer.renderKitElement(strokesElement.parentElement);
                        await this.selectNavItemByRefId(`strokes-${serialRef}`);
                    }
                    break;
                case "stroke-insert":
                    {
                        const serialRef = ToolPalettesDialogModel.serializeRef(changeInfo.mapItemTemplateRef);
                        const strokesElement = this.#kitElement.querySelector(`[data-nav-item-id='strokes-${serialRef}']`);
                        await UIKit.renderer.renderKitElement(strokesElement.parentElement);
                        const pathStyleId = changeInfo.pathStyle.id.replaceAll("-", ".");
                        await this.selectNavItemByRefId(`stroke-${pathStyleId}-${serialRef}`);
                    }
                    break;
                case "stroke-delete":
                    {
                        const serialRef = ToolPalettesDialogModel.serializeRef(changeInfo.mapItemTemplateRef);
                        const strokesElement = this.#kitElement.querySelector(`[data-nav-item-id='strokes-${serialRef}']`);
                        await UIKit.renderer.renderKitElement(strokesElement.parentElement);
                        await this.selectNavItemByRefId(`strokes-${serialRef}`);
                    }
                    break;
                case "path.style-edit":
                    {
                        const serialId = changeInfo.pathStyleId.replaceAll("-", ".");
                        const serialRef = ToolPalettesDialogModel.serializeRef(changeInfo.mapItemTemplateRef);
                        let navId = `fill-${serialId}-${serialRef}`;
                        let pathStyleElement = this.#kitElement.querySelector(`[data-nav-item-id='${navId}']`);
                        if (!pathStyleElement) {
                            navId = `stroke-${serialId}-${serialRef}`;
                            pathStyleElement = this.#kitElement.querySelector(`[data-nav-item-id='${navId}']`);
                        }
                        await UIKit.renderer.renderKitElement(pathStyleElement.parentElement);
                        await this.selectNavItemByRefId(navId);
                    }
                    break;
                case "caption.background.fill-insert":
                    {
                        const serialRef = ToolPalettesDialogModel.serializeRef(changeInfo.mapItemTemplateRef);
                        const captionElement = this.#kitElement.querySelector(`[data-nav-item-id='caption-${serialRef}']`);
                        await UIKit.renderer.renderKitElement(captionElement.parentElement);
                        await this.selectNavItemByRefId(`caption.background-${serialRef}`);
                    }
                    break;
                case "caption.background.fill-delete":
                    {
                        const serialRef = ToolPalettesDialogModel.serializeRef(changeInfo.mapItemTemplateRef);
                        const captionElement = this.#kitElement.querySelector(`[data-nav-item-id='caption-${serialRef}']`);
                        await UIKit.renderer.renderKitElement(captionElement.parentElement);
                        await this.selectNavItemByRefId(`caption-${serialRef}`);
                    }
                    break;
                case "caption.border.stroke-insert":
                    {
                        const serialRef = ToolPalettesDialogModel.serializeRef(changeInfo.mapItemTemplateRef);
                        const captionElement = this.#kitElement.querySelector(`[data-nav-item-id='caption-${serialRef}']`);
                        await UIKit.renderer.renderKitElement(captionElement.parentElement);
                        await this.selectNavItemByRefId(`caption.border-${serialRef}`);
                    }
                    break;
                case "caption.border.stroke-delete":
                    {
                        const serialRef = ToolPalettesDialogModel.serializeRef(changeInfo.mapItemTemplateRef);
                        const captionElement = this.#kitElement.querySelector(`[data-nav-item-id='caption-${serialRef}']`);
                        await UIKit.renderer.renderKitElement(captionElement.parentElement);
                        await this.selectNavItemByRefId(`caption-${serialRef}`);
                    }
                    break;
            }
            const detailContainer = this.#kitElement.querySelector("#detail-container");
            await UIKit.renderer.renderKitElement(detailContainer);
        }
    }

    // methods
    isVisible() {
        return ToolPalettesDialogModel.#isVisible;
    }

    async showDialog() {
        ToolPalettesDialogModel.#isVisible = true;
        ToolPalettesDialogModel.#map = await MapWorkerClient.getMap(); 
        await UIKit.renderer.renderKitElement(this.#kitElement);
        const navElement = this.#kitElement.querySelector("[data-nav-item-id='palette.editing.tools']");
        await this.selectNavItem(navElement);
    }

    closeDialog = () => {
        this.#dialogHelper.close();
    }

    toggleNavigation() {
        ToolPalettesDialogModel.#navMinimized = !ToolPalettesDialogModel.#navMinimized;
        this.#slideNavigation();
    }

    getRootNavItems() {
        return [
            { id: "palette.editing.tools" },
            { id: "palette.drawing.tools" },
            { id: "palette.map.item.templates" },
            { id: "tools" },
            { id: "map.item.templates" }
        ];
    }

    collapseNavItem(element) {
        const navElement = element.closest("[data-nav-item-id]");
        navElement.setAttribute("data-nav-item-expanded-state", "collapsed");
        navElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    expandNavItem(element, scrollIntoView = true) {
        const navElement = element.closest("[data-nav-item-id]");
        const expandableNavItemElements = [];
        this.#collectExpandableNavItemSelfAndAncestors(navElement, expandableNavItemElements);
        for (const expandableNavItemElement of expandableNavItemElements) {
            expandableNavItemElement.setAttribute("data-nav-item-expanded-state", "expanded");
        }
        if (scrollIntoView) {
            const firstChildNavItemElement = navElement.querySelector("[data-nav-item-id]");
            if (firstChildNavItemElement) {
                firstChildNavItemElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
            }
        }
    }

    async selectNavItem(element) {
        const selectedNavElement = this.#kitElement.querySelector("[data-nav-selected]");
        if (selectedNavElement) {
            selectedNavElement.removeAttribute("data-nav-selected");
        }
        const navElement = element.closest("[data-nav-item-id]");
        navElement.setAttribute("data-nav-selected", "");
        this.expandNavItem(navElement, false);
        navElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
        const detailContainer = this.#kitElement.querySelector("#detail-container");
        await UIKit.renderer.renderKitElement(detailContainer);
    }

    async selectNavItemByRefId(refId) {
        const element = this.#kitElement.querySelector(`[data-nav-item-id="${refId}"]`);
        await this.selectNavItem(element);
    }

    getNavItemModel(navItemId) {
        return ToolPalettesDialogModel.#getNavItemModelFromMap(navItemId);
    }

    getSelectedDetailComponentInfo() {
        const selectedNavElement = this.#kitElement.querySelector("[data-nav-selected]");
        let id = "";
        if (selectedNavElement) {
            id = selectedNavElement.getAttribute("data-nav-item-id");
        }
        if (id.startsWith("caption.text.shadow-")
            || id.startsWith("caption.shadow-")
            || id.startsWith("shadow-")) {
            return { componentName: "shadow", id: id };
        }
        if (id.startsWith("caption.border-")
            || id.startsWith("caption.background-")
            || id.startsWith("stroke-")
            || id.startsWith("fill-")) {
            return { componentName: "path.style", id: id };
        }
        if (id.startsWith("caption-")) {
            return { componentName: "caption", id: id }
        }
        if (id.startsWith("strokes-") || id.startsWith("fills-")) {
            return { componentName: "path.styles", id: id };
        }
        if (id.startsWith("map.item.template-")) {
            return { componentName: "map.item.template", id: id };
        }
        if (id.startsWith("tool-")) {
            return { componentName: "tool", id: id };
        }
        if (id == "map.item.templates") {
            return { componentName: "map.item.templates" };
        }
        if (id == "tools") {
            return { componentName: "tools" };
        }
        if (id.startsWith("palette")) {
            return { componentName: "palette", id: id };
        }
        return { componentName: "none" };
    }

    onInputKeyDown(event) {
        event.stopPropagation();
    }

    static serializeRef(ref) {
        return `${ref.name}.${ref.versionId}.${ref.isBuiltIn ? "true" : "false"}.${ref.isFromTemplate ? "true" : "false"}`;
    }

    static deSerializeRef(serialRef) {
        const parts = serialRef.split(".");
        const ref = {
            name: parts[0],
            versionId: Number(parts[1]),
            isBuiltIn: parts[2] == "true",
            isFromTemplate: parts[3] == "true"
        };
        return new EntityReference(ref);
    }

    static getPathStyleTypeDisplayName(pathStyleType) {
        switch (pathStyleType) {
            case PathStyleType.ColorFill:
                return "Color fill";
            case PathStyleType.ColorStroke:
                return "Color stroke";
            case PathStyleType.LinearGradientFill:
                return "Linear gradient fill";
            case PathStyleType.LinearGradientStroke:
                return "Linear gradient stroke";
            case PathStyleType.RadialGradientFill:
                return "Radial gradient fill";
            case PathStyleType.RadialGradientStroke:
                return "Radial gradient stroke";
            case PathStyleType.ConicalGradientFill:
                return "Conical gradient fill";
            case PathStyleType.ConicalGradientStroke:
                return "Conical gradient stroke";
            case PathStyleType.TileFill:
                return "Tile fill";
            case PathStyleType.TileStroke:
                return "Tile stroke";
            case PathStyleType.ImageArrayFill:
                return "Image array fill";
            case PathStyleType.ImageArrayStroke:
                return "Image array stroke";
            default:
                return "Unknown path style";
        }
    }

    static getThumbnailSrc(pathStyle) {
        const pathStyleType = pathStyle.getStyleOptionValue(PathStyleOption.PathStyleType);
        if (pathStyleType == PathStyleType.TileFill || pathStyleType == PathStyleType.TileStroke) {
            return pathStyle.getStyleOptionValue(PathStyleOption.TileImageSource);
        }
        if (pathStyleType == PathStyleType.ImageArrayFill || pathStyleType == PathStyleType.ImageArrayStroke) {
            return pathStyle.getStyleOptionValue(PathStyleOption.ImageArraySource1);
        }
        return null;
    }

    static getThumbnailSvgSrc(pathStyle) {
        const pathStyleType = pathStyle.getStyleOptionValue(PathStyleOption.PathStyleType);
        if (pathStyleType == PathStyleType.ColorFill || pathStyleType == PathStyleType.ColorStroke) {
            const color = pathStyle.getStyleOptionValue(PathStyleOption.Color);
            return `<rect x="10" y="10" width="80" height="80" stroke="dimgray" stroke-width="2" fill="${color}" rx="10" />`;
        }
        if (pathStyleType == PathStyleType.LinearGradientFill || pathStyleType == PathStyleType.LinearGradientStroke) {
            const linearGradientId = `linearGradient-${pathStyle.id}`;
            let svg = `<defs><linearGradient id="${linearGradientId}" >`;
            const colorStopsLinear = pathStyle.getColorStops().filter(cs => cs.offset > 0);
            for (const colorStop of colorStopsLinear) {
                svg += `<stop offset="${colorStop.offset}%" stop-color="${colorStop.color}" />`;
            }
            svg += "</linearGradient></defs>";
            svg += `<rect x="10" y="10" width="80" height="80" stroke="dimgray" stroke-width="2" fill="url(#${linearGradientId})" rx="10" />`;
            return svg;
        }
        if (pathStyleType == PathStyleType.RadialGradientFill
            || pathStyleType == PathStyleType.RadialGradientStroke
            || pathStyleType == PathStyleType.ConicalGradientFill
            || pathStyleType == PathStyleType.ConicalGradientStroke) {
            const radialGradientId = `radialGradient-${pathStyle.id}`;
            let svg = `<defs><radialGradient id="${radialGradientId}" cx="0.5" cy="0.5" r="0.5" >`;
            const colorStopsLinear = pathStyle.getColorStops().filter(cs => cs.offset > 0);
            for (const colorStop of colorStopsLinear) {
                svg += `<stop offset="${colorStop.offset}%" stop-color="${colorStop.color}" />`;
            }
            svg += "</radialGradient></defs>";
            svg += `<rect x="10" y="10" width="80" height="80" stroke="dimgray" stroke-width="2" fill="url(#${radialGradientId})" rx="10" />`;
            return svg;
        }
        return null;
    }

    // helpers
    static #isVisible = false;
    static #navMinimized = false;
    static #map = null;
    #kitElement = null;
    #dialogHelper = null;

    #onCloseDialog = async () => {
        ToolPalettesDialogModel.#isVisible = false;
        await UIKit.renderer.renderKitElement(this.#kitElement);
    }

    #slideNavigation = (slideOpen) => {
        let navWidth = "40px";
        let showLabel = false;
        if (!ToolPalettesDialogModel.#navMinimized && !slideOpen) {
            navWidth = "250px";
            showLabel = true;
        }
        const navLabel = this.#kitElement.querySelector("#navigation-heading-label");
        const navTree = this.#kitElement.querySelector("#navigation-tree-container");
        if (showLabel) {
            navLabel.style.display = "block";
            navTree.style.display = "block";
        }
        else {
            navLabel.style.display = "none";
            navTree.style.display = "none";
        }
        UIKit.document.documentElement.style.setProperty("--tool-palettes-nav-width", navWidth);
    }

    #collectExpandableNavItemSelfAndAncestors(navItemElement, expandableNavItemElements) {
        const expandedState = navItemElement.getAttribute("data-nav-item-expanded-state");
        if (expandedState == "collapsed") {
            expandableNavItemElements.push(navItemElement);
        }
        if (navItemElement.parentElement) {
            const parentNavItemElement = navItemElement.parentElement.closest("[data-nav-item-id]");
            if (parentNavItemElement) {
                this.#collectExpandableNavItemSelfAndAncestors(parentNavItemElement, expandableNavItemElements)
            }
        }
    }

    static #getNavItemModelFromMap(id) {
        const model = { id: id, children: [] };
        const map = ToolPalettesDialogModel.#map;
        function sortByDisplayName(item1, item2) {
            if (item1.displayName.toLowerCase() < item2.displayName.toLowerCase()) {
                return -1;
            }
            if (item1.displayName.toLowerCase() > item2.displayName.toLowerCase()) {
                return 1;
            }
            return 0;
        }
        if (id == "palette.editing.tools") {
            model.displayName = "Editing tools palette";
        }
        if (id == "palette.drawing.tools") {
            model.displayName = "Drawing tools palette";
        }
        if (id == "palette.map.item.templates") {
            model.displayName = "Map item templates palette";
        }
        if (id == "tools") {
            model.displayName = "Tools";
            const tools = [];
            for (const tool of map.tools) {
                const ref = tool.ref;
                tools.push({
                    id: `tool-${ToolPalettesDialogModel.serializeRef(ref)}`,
                    displayName: ref.name.length > 25 ? ref.name.slice(0, 25) + "..." : ref.name,
                });
            }
            tools.sort(sortByDisplayName);
            model.children = tools.map(t => ({ id: t.id }));
            model.expandedState = model.children.length > 0 ? "collapsed" : null;
        }
        if (id.startsWith("tool-")) {
            const serialRef = id.replace("tool-", "");
            const ref = ToolPalettesDialogModel.deSerializeRef(serialRef);
            const tool = ToolPalettesDialogModel.#map.tools.find(t => EntityReference.areEqual(t.ref, ref));
            model.thumbnailSvgSrc = tool.thumbnailSrc;
            model.displayName = ref.name.length > 25 ? ref.name.slice(0, 25) + "..." : ref.name;
        }
        if (id == "map.item.templates") {
            model.displayName = "Map item templates";
            const mapItemTemplates = [];
            for (const mapItemTemplate of map.mapItemTemplates) {
                const ref = mapItemTemplate.ref;
                mapItemTemplates.push({
                    id: `map.item.template-${ToolPalettesDialogModel.serializeRef(ref)}`,
                    displayName: ref.name.length > 25 ? ref.name.slice(0, 25) + "..." : ref.name,
                });
            }
            mapItemTemplates.sort(sortByDisplayName);
            model.children = mapItemTemplates.map(t => ({ id: t.id }));
            model.expandedState = model.children.length > 0 ? "collapsed" : null;
        }
        if (id.startsWith("map.item.template-")) {
            const serialRef = id.replace("map.item.template-", "");
            const ref = ToolPalettesDialogModel.deSerializeRef(serialRef);
            const mapItemTemplate = ToolPalettesDialogModel.#getMapItemTemplate(serialRef);
            model.thumbnailSrc = mapItemTemplate.thumbnailSrc;
            model.displayName = ref.name.length > 25 ? ref.name.slice(0, 25) + "..." : ref.name;
            model.children = [
                { id: `fills-${serialRef}` },
                { id: `strokes-${serialRef}` },
                { id: `shadow-${serialRef}` },
                { id: `caption-${serialRef}` }
            ];
            model.expandedState = "collapsed";
        }
        if (id.startsWith("fills-")) {
            model.displayName = "Fills";
            const serialRef = id.replace("fills-", "");
            const mapItemTemplate = ToolPalettesDialogModel.#getMapItemTemplate(serialRef);
            const fills = [];
            for (const fill of mapItemTemplate.fills) {
                const fillId = fill.id.replaceAll("-", ".");
                fills.push({ id: `fill-${fillId}-${serialRef}` });
            }
            model.children = fills;
            model.expandedState = model.children.length > 0 ? "collapsed" : null;
        }
        if (id.startsWith("fill-")) {
            const parts = id.split("-");
            const fillId = parts[1].replaceAll(".", "-");
            const serialRef = parts[2];
            const mapItemTemplate = ToolPalettesDialogModel.#getMapItemTemplate(serialRef);
            const pathStyle = mapItemTemplate.fills.find(f => f.id == fillId);
            const pathStyleType = pathStyle.getStyleOptionValue(PathStyleOption.PathStyleType);
            model.displayName = ToolPalettesDialogModel.getPathStyleTypeDisplayName(pathStyleType);
            model.thumbnailSrc = ToolPalettesDialogModel.getThumbnailSrc(pathStyle);
            model.thumbnailSvgSrc = ToolPalettesDialogModel.getThumbnailSvgSrc(pathStyle);
        }
        if (id.startsWith("strokes-")) {
            model.displayName = "Strokes";
            const serialRef = id.replace("strokes-", "");
            const mapItemTemplate = ToolPalettesDialogModel.#getMapItemTemplate(serialRef);
            const strokes = [];
            for (const stroke of mapItemTemplate.strokes) {
                const strokeId = stroke.id.replaceAll("-", ".");
                strokes.push({ id: `stroke-${strokeId}-${serialRef}` });
            }
            model.children = strokes;
            model.expandedState = model.children.length > 0 ? "collapsed" : null;
        }
        if (id.startsWith("stroke-")) {
            const parts = id.split("-");
            const strokeId = parts[1].replaceAll(".", "-");
            const serialRef = parts[2];
            const mapItemTemplate = ToolPalettesDialogModel.#getMapItemTemplate(serialRef);
            const pathStyle = mapItemTemplate.strokes.find(s => s.id == strokeId);
            const pathStyleType = pathStyle.getStyleOptionValue(PathStyleOption.PathStyleType);
            model.displayName = ToolPalettesDialogModel.getPathStyleTypeDisplayName(pathStyleType);
            model.thumbnailSrc = ToolPalettesDialogModel.getThumbnailSrc(pathStyle);
            model.thumbnailSvgSrc = ToolPalettesDialogModel.getThumbnailSvgSrc(pathStyle);
        }
        if (id.startsWith("shadow-")) {
            model.displayName = "Shadow";
        }
        if (id.startsWith("caption-")) {
            model.displayName = "Caption";
            const serialRef = id.replace("caption-", "");
            const mapItemTemplate = ToolPalettesDialogModel.#getMapItemTemplate(serialRef);
            const caption = mapItemTemplate.caption;
            const children = [];
            if (caption.backgroundFill) {
                children.push({ id: `caption.background-${serialRef}` });
            }
            if (caption.borderStroke) {
                children.push({ id: `caption.border-${serialRef}` });
            }
            children.push({ id: `caption.shadow-${serialRef}` });
            children.push({ id: `caption.text.shadow-${serialRef}` });
            model.children = children;
            model.expandedState = "collapsed";
        }
        if (id.startsWith("caption.background-")) {
            model.displayName = "Background";
        }
        if (id.startsWith("caption.border-")) {
            model.displayName = "Border";
        }
        if (id.startsWith("caption.shadow-")) {
            model.displayName = "Shadow";
        }
        if (id.startsWith("caption.text.shadow-")) {
            model.displayName = "Text shadow";
        }
        return model;
    }

    static #getMapItemTemplate(serialRef) {
        const ref = ToolPalettesDialogModel.deSerializeRef(serialRef);
        return ToolPalettesDialogModel.#map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, ref));
    }

    static #getChangeInfo(message) {

        // tool-insert
        const changes = message.data.changeSet.changes;
        let item = ToolPalettesDialogModel.#findChange(changes, ChangeType.Insert, Map.name, "tools");
        if (item) {
            return { changeType: "tool-insert", itemValue: item.itemValue };
        }

        // tool-edit
        item = ToolPalettesDialogModel.#findChange(changes, ChangeType.Edit, Tool.name);
        if (item) {
            return { changeType: "tool-edit", toolRef: item.toolRef };
        }

        // tool-delete
        item = ToolPalettesDialogModel.#findChange(changes, ChangeType.Delete, Map.name, "tools");
        if (item) {
            return { changeType: "tool-delete", itemValue: item.itemValue };
        }

        // map.item.template-insert
        item = ToolPalettesDialogModel.#findChange(changes, ChangeType.Insert, Map.name, "mapItemTemplates");
        if (item) {
            return { changeType: "map.item.template-insert", itemValue: item.itemValue };
        }

        // shadow-edit
        item = ToolPalettesDialogModel.#findChange(changes, ChangeType.Edit, MapItemTemplate.name, "shadow");
        if (item) {
            return { changeType: "shadow-edit" };
        }

        // caption
        item = ToolPalettesDialogModel.#findChange(changes, ChangeType.Edit, MapItemTemplate.name, "caption");
        if (item) {
            if (!item.oldValue.backgroundFill && item.newValue.backgroundFill) {
                return { changeType: "caption.background.fill-insert", mapItemTemplateRef: item.mapItemTemplateRef };
            }
            if (item.oldValue.backgroundFill && !item.newValue.backgroundFill) {
                return { changeType: "caption.background.fill-delete", mapItemTemplateRef: item.mapItemTemplateRef };
            }
            if (!item.oldValue.borderStroke && item.newValue.borderStroke) {
                return { changeType: "caption.border.stroke-insert", mapItemTemplateRef: item.mapItemTemplateRef };
            }
            if (item.oldValue.borderStroke && !item.newValue.borderStroke) {
                return { changeType: "caption.border.stroke-delete", mapItemTemplateRef: item.mapItemTemplateRef };
            }
            return { changeType: "caption-edit" };
        }

        // map.item.template-edit
        item = ToolPalettesDialogModel.#findChange(changes, ChangeType.Edit, MapItemTemplate.name);
        if (item) {
            return { changeType: "map.item.template-edit", mapItemTemplateRef: item.mapItemTemplateRef };
        }

        // map.item.template-delete
        item = ToolPalettesDialogModel.#findChange(changes, ChangeType.Delete, Map.name, "mapItemTemplates");
        if (item) {
            return { changeType: "map.item.template-delete", itemValue: item.itemValue };
        }

        // fills-sort
        const hasFillInsert = ToolPalettesDialogModel.#someChange(changes, ChangeType.Insert, MapItemTemplate.name, "fills");
        const hasFillDelete = ToolPalettesDialogModel.#someChange(changes, ChangeType.Delete, MapItemTemplate.name, "fills");
        if (hasFillInsert && hasFillDelete) {
            const mapItemTemplateRef = ToolPalettesDialogModel.#findChange(
                changes, ChangeType.Insert, MapItemTemplate.name, "fills").mapItemTemplateRef;
            return { changeType: "fills-sort", mapItemTemplateRef: mapItemTemplateRef };
        }

        // fill-insert
        item = ToolPalettesDialogModel.#findChange(changes, ChangeType.Insert, MapItemTemplate.name, "fills");
        if (item) {
            return { changeType: "fill-insert", mapItemTemplateRef: item.mapItemTemplateRef, pathStyle: item.itemValue };
        }

        // fill-delete
        item = ToolPalettesDialogModel.#findChange(changes, ChangeType.Delete, MapItemTemplate.name, "fills");
        if (item) {
            return { changeType: "fill-delete", mapItemTemplateRef: item.mapItemTemplateRef, pathStyle: item.itemValue };
        }

        // strokes-sort
        const hasStrokeInsert = ToolPalettesDialogModel.#someChange(changes, ChangeType.Insert, MapItemTemplate.name, "strokes");
        const hasStrokeDelete = ToolPalettesDialogModel.#someChange(changes, ChangeType.Delete, MapItemTemplate.name, "strokes");
        if (hasStrokeInsert && hasStrokeDelete) {
            const mapItemTemplateRef = ToolPalettesDialogModel.#findChange(
                changes, ChangeType.Insert, MapItemTemplate.name, "strokes").mapItemTemplateRef;
            return { changeType: "strokes-sort", mapItemTemplateRef: mapItemTemplateRef };
        }

        // stroke-insert
        item = ToolPalettesDialogModel.#findChange(changes, ChangeType.Insert, MapItemTemplate.name, "strokes");
        if (item) {
            return { changeType: "stroke-insert", mapItemTemplateRef: item.mapItemTemplateRef, pathStyle: item.itemValue };
        }

        // stroke-delete
        item = ToolPalettesDialogModel.#findChange(changes, ChangeType.Delete, MapItemTemplate.name, "strokes");
        if (item) {
            return { changeType: "stroke-delete", mapItemTemplateRef: item.mapItemTemplateRef, pathStyle: item.itemValue };
        }

        // path.style-edit
        item = ToolPalettesDialogModel.#findChange(changes, ChangeType.Edit, PathStyle.name, "options");
        if (item) {
            return { changeType: "path.style-edit", mapItemTemplateRef: item.mapItemTemplateRef, pathStyleId: item.pathStyleId };
        }

        // other
        return { changeType: "other" };
    }

    static #findChange(changes, changeType, changeObjectType, propertyName) {
        if (propertyName) {
            return changes.find(
                c => c.changeType == changeType && c.changeObjectType == changeObjectType && c.propertyName == propertyName);
        }
        return changes.find(c => c.changeType == changeType && c.changeObjectType == changeObjectType)
    }

    static #someChange(changes, changeType, changeObjectType, propertyName) {
        if (propertyName) {
            return changes.some(
                c => c.changeType == changeType && c.changeObjectType == changeObjectType && c.propertyName == propertyName);
        }
        return changes.some(c => c.changeType == changeType && c.changeObjectType == changeObjectType)
    }
}
