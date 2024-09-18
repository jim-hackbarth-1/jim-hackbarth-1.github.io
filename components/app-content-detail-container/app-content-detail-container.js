
import { KitMessenger, KitNavigator, KitRenderer } from "../../ui-kit.js";

export function createModel() {
    return new AppContentDetailContainer();
}

class AppContentDetailContainer {
    async onRenderStart(componentId) {
        this.componentId = componentId;
        this.routeName = KitNavigator.getCurrentUrlFragment();
        KitMessenger.subscribe(KitNavigator.navTopicName, this.componentId, this.onNavigation.name);
    }

    onNavigation(url) {
        this.routeName = KitNavigator.getUrlFragment(url);
        KitRenderer.renderComponent(this.componentId);
    }

}
