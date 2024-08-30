
import { KitDependencyManager } from "../../ui-kit.js";
import { LocalStorage } from "../../utilities/local-storage.js";

export function createModel() {
    return new AppHeadingModel();
}

export class AppHeadingModel {

    displayNav = true;

    async initialize(componentId) {
        this.componentId = componentId;

        // set theme
        let theme = LocalStorage.getTheme();
        if (!theme) {
            theme = "summer";
        }
        const appDocument = KitDependencyManager.getDocument();
        appDocument.documentElement.setAttribute("data-app-theme", theme);

        // set dark mode
        const darkMode = LocalStorage.getDarkMode();
        const darkModeTheme = darkMode === "on" ? 1 : 0;
        appDocument.documentElement.style.setProperty("--theme-dark-mode", darkModeTheme);
    }

    toggleNav() {
        this.displayNav = !this.displayNav;
        let appNavWidth = "var(--app-nav-width-expanded)";
        let appNavLeft = "0px";
        if (!this.displayNav) {
            appNavWidth = "0px";
            appNavLeft = "calc(-1 * var(--app-nav-width-expanded))";
        }
        const appDocument = KitDependencyManager.getDocument();
        const element = appDocument.documentElement;
        element.style.setProperty('--app-nav-width', appNavWidth);
        element.style.setProperty('--app-nav-left', appNavLeft);
    }
   
}
