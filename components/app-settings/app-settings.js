
import { KitDependencyManager } from "../../ui-kit.js";
import { LocalStorage } from "../../utilities/local-storage.js";

export function createModel() {
    return new AppSettingsModel();
}

class AppSettingsModel {

    getThemes() {
        let theme = LocalStorage.getTheme();
        if (!theme) {
            theme = "summer";
        }
        return [
            { id: "spring", label: "Spring", checked: theme === "spring" ? "checked" : "" },
            { id: "summer", label: "Summer", checked: theme === "summer" ? "checked" : "" },
            { id: "fall", label: "Fall", checked: theme === "fall" ? "checked" : "" },
            { id: "winter", label: "Winter", checked: theme === "winter" ? "checked" : "" }
        ];
    }

    selectTheme(theme) {
        LocalStorage.setTheme(theme);
        const appDocument = KitDependencyManager.getDocument();
        appDocument.documentElement.setAttribute("data-app-theme", theme);
    }

    isDarkModeOn() {
        const darkMode = LocalStorage.getDarkMode();
        return darkMode === "on";
    }

    toggleDarkMode() {
        let darkMode = LocalStorage.getDarkMode();
        if (darkMode !== "on") {
            darkMode = "off";
        }
        darkMode = darkMode === "on" ? "off" : "on";
        LocalStorage.setDarkMode(darkMode);
        const darkModeTheme = darkMode === "on" ? 1 : 0;
        const appDocument = KitDependencyManager.getDocument();
        appDocument.documentElement.style.setProperty("--theme-dark-mode", darkModeTheme);
    }
}
