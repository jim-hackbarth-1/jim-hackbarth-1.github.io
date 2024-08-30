
import { KitDependencyManager } from "../ui-kit.js";

export class LocalStorage {

    static theme = "app-theme";
    static darkMode = "app-dark-mode";

    static getTheme() {
        return LocalStorage.getItem(LocalStorage.theme);
    }

    static setTheme(theme) {
        LocalStorage.setItem(LocalStorage.theme, theme);
    }

    static getDarkMode() {
        return LocalStorage.getItem(LocalStorage.darkMode);
    }

    static setDarkMode(darkMode) {
        LocalStorage.setItem(LocalStorage.darkMode, darkMode);
    }

    static getItem(key) {
        const appWindow = KitDependencyManager.getWindow();
        const storage = appWindow.localStorage;
        return storage.getItem(key);
    }

    static setItem(key, value) {
        const appWindow = KitDependencyManager.getWindow();
        const storage = appWindow.localStorage;
        storage.setItem(key, value);
    }
}
