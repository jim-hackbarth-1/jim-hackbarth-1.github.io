
import { KitDependencyManager } from "../../ui-kit.js";

export function createModel() {
    return new HeadingModel();
}

class HeadingModel {

    displayNav = true;

    async onRenderStart(componentId) {
        this.componentId = componentId;
    }

    async toggleNav() {
        this.displayNav = !this.displayNav;
        let appNavLeft = "0px";
        if (!this.displayNav) {
            appNavLeft = "calc(-1 * var(--app-nav-width-expanded))";
        }
        const appDocument = KitDependencyManager.getDocument();
        const element = appDocument.documentElement;
        element.style.setProperty("--app-nav-left", appNavLeft);
    }
   
}
