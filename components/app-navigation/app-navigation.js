
import { KitMessenger, KitNavigator, KitRenderer } from "../../ui-kit.js";

export function createModel() {
    return new AppNavigationModel();
}

class AppNavigationModel {

    componentId;

    async onRenderStart(componentId) {
        this.componentId = componentId;
        this.routeName = KitNavigator.getCurrentUrlFragment();
        KitMessenger.subscribe(KitNavigator.navTopicName, this.componentId, this.onNavigation.name);
    }

    async onRenderComplete() {
        this.setSelectedLink();
    }

    onNavigation(url) {
        this.routeName = KitNavigator.getUrlFragment(url);
        this.setSelectedLink();
    }

    setSelectedLink() {
        const element = KitRenderer.getComponentElement(this.componentId);
        const listItems = element.querySelectorAll("li");
        let currentRouteName = this.routeName;
        if (!currentRouteName) {
            currentRouteName = "#home";
        }
        for (let i = 0; i < listItems.length; i++) {
            listItems[i].classList.remove("selected");
            if ("#" + listItems[i].id === currentRouteName) {
                listItems[i].classList.add("selected");
            }
        }
    }
}
