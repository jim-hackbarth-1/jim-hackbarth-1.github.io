
import { KitNavigator } from "../../ui-kit.js";

export function createModel() {
    return new ContentModel();
}

class ContentModel {

    // properties
    routeName;

    // event handlers
    async init(kitElement) {
        this.#kitElement = kitElement;
        this.routeName = UIKit.navigator.getHash(UIKit.document.location.href) ?? "";
        const elementKey = this.#kitElement.getAttribute("kit-element-key");
        const subscriber = {
            elementKey: elementKey,
            id: `nav-${elementKey}`,
            object: this,
            callback: this.onNavigation.name
        };
        UIKit.messenger.subscribe(KitNavigator.NavTopic, subscriber);
    }

    async onRendered() {
        if (!this.isPresentationView()) {
            this.#kitElement.querySelector("#loading-indicator-container").classList.add("hide");
        }
    }

    async onNavigation(url) {
        this.routeName = UIKit.navigator.getHash(url) ?? "";
        await UIKit.renderer.renderKitElement(this.#kitElement);
    }

    // methods
    isPresentationView() {
        const routeName = UIKit.navigator.getHash(UIKit.document.location.href) ?? "";
        return (routeName == "#presentation-view");
    }

    onCssLoaded() {
        this.#kitElement.querySelector(".content-component").classList.remove("css-not-loaded");
    }

    // helpers
    #kitElement;
}
