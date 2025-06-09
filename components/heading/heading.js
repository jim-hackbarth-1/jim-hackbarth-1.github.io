
import { KitDependencyManager, KitNavigator } from "../../ui-kit.js";
import { DebugConsole } from "../shared/debug-console.js"
import { Preferences } from "../shared/preferences.js"

export function createModel() {
    return new HeadingModel();
}

class HeadingModel {

    displayNav = true;

    async onRenderStart(componentId) {
        this.componentId = componentId;
        KitDependencyManager.setConsole(new DebugConsole());
        Preferences.applyTheme();
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

    isPresentationView() {
        const routeName = KitNavigator.getCurrentUrlFragment() ?? "";
        return (routeName == "#presentation-view");
    }
}
