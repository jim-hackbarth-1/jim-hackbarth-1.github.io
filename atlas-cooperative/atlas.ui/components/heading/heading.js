
import { DebugConsole } from "../shared/debug-console.js"
import { Preferences } from "../shared/preferences.js"

export function createModel() {
    return new HeadingModel();
}

class HeadingModel {

    displayNav = true;

    async init() {
        UIKit.console = new DebugConsole();
        Preferences.applyTheme();
    }

    async toggleNav() {
        this.displayNav = !this.displayNav;
        let appNavLeft = "0px";
        if (!this.displayNav) {
            appNavLeft = "calc(-1 * var(--app-nav-width-expanded))";
        }
        UIKit.document.documentElement.style.setProperty("--app-nav-left", appNavLeft);
    }

    isPresentationView() {
        const routeName = UIKit.navigator.getHash(UIKit.document.location.href) ?? "";
        return (routeName == "#presentation-view");
    }
}
