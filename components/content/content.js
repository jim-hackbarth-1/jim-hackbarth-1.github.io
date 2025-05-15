
import { KitMessenger, KitNavigator, KitRenderer } from "../../ui-kit.js";

export function createModel() {
    return new ContentModel();
}

class ContentModel {

    async onRenderStart(componentId) {
        this.componentId = componentId;
        this.routeName = KitNavigator.getCurrentUrlFragment() ?? "";
        KitMessenger.subscribe(KitNavigator.navTopicName, this.componentId, this.onNavigation.name);
    }

    async onRenderComplete() {
        if (!this.isPresentationView()) {
            const element = KitRenderer.getComponentElement(this.componentId);
            element.querySelector("#loading-indicator-container").classList.add("hide");
        }
    }

    onNavigation(url) {
        this.routeName = KitNavigator.getUrlFragment(url) ?? "";
        KitRenderer.renderComponent(this.componentId);
    }

    isPresentationView() {
        const routeName = KitNavigator.getCurrentUrlFragment() ?? "";
        return (routeName == "#presentation-view");
    }
}
