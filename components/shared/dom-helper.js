import { KitComponent, KitRenderer } from "../../ui-kit.js";

export class DomHelper {

    static getElement(componentElement, selector) {
        return componentElement.querySelector(selector);
    }

    static getElements(componentElement, selector) {
        return componentElement.querySelectorAll(selector);
    }

    static findComponentByElementId(componentElement, elementId) {
        const element = DomHelper.getElement(componentElement, `#${elementId}`);
        const componentId = element.getAttribute("data-kit-component-id");
        return KitComponent.find(componentId);
    }

    static async reRenderElement(componentElement, elementId) {
        const element = DomHelper.getElement(componentElement, `#${elementId}`);
        if (element) {
            const componentId = element.getAttribute("data-kit-component-id");
            if (KitComponent.find(componentId)) {
                await KitRenderer.renderComponent(componentId);
            }
        }
    }

    static async dragStartItem(componentElement, evt, elementId) {
        if (!evt?.dataTransfer) {
            return;
        }
        evt.dataTransfer.setData("text", elementId);
        const dragStartEvent = new DragEvent("dragstart", {
            bubbles: true,
            cancelable: true,
            clientX: evt.clientX,
            clientY: evt.clientY,
        });
        const element = DomHelper.getElement(componentElement, `#${elementId}`);
        element.dispatchEvent(dragStartEvent);
    }

    static dragItem(evt) {
        evt.dataTransfer.setData("text", evt.srcElement.id);
    }

    static allowDrop(evt) {
        evt.preventDefault();
    }
}
