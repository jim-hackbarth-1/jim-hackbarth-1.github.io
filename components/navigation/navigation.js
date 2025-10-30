
import { UIKit, KitNavigator } from "../../ui-kit.js";

export function createModel() {
    return new NavigationModel();
}

class NavigationModel {

    // event handlers
    async init(kitElement) {
        this.#kitElement = kitElement;
        this.routeName = UIKit.navigator.getHash(UIKit.document.location.href);
        const elementKey = this.#kitElement.getAttribute("kit-element-key");
        const subscriber = {
            elementKey: elementKey,
            id: `nav-${elementKey}`,
            object: this,
            callback: this.onNavigation.name
        }
        UIKit.messenger.subscribe(KitNavigator.NavTopic, subscriber);
    }

    async onRendered() {
        this.#setSelectedLink();
    }

    onNavigation(url) {
        this.routeName = UIKit.navigator.getHash(url);
        this.#setSelectedLink();
    }

    // methods
    isPresentationView() {
        const routeName = UIKit.navigator.getHash(UIKit.document.location.href) ?? "";
        return (routeName == "#presentation-view");
    }

    getNavItems() {
        return [
            { id: "home", label: "Home" },
            { id: "editor", label: "Editor" },
            { id: "catalog", label: "Catalog" },
            { id: "account", label: "Account" },
            { id: "help", label: "Help" }
        ];
    }

    // helpers
    #kitElement;

    #setSelectedLink() {
        const listItems = this.#kitElement.querySelectorAll("li");
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
