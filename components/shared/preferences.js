
import { KitDependencyManager } from "../../ui-kit.js";

export class Preferences {

    //properties
    static get theme() {
        const appWindow = KitDependencyManager.getWindow();
        return appWindow.localStorage.getItem("theme");
    }
    static set theme(theme) {
        const appWindow = KitDependencyManager.getWindow();
        appWindow.localStorage.setItem("theme", theme);
    }

    static get darkMode() {
        const appWindow = KitDependencyManager.getWindow();
        return appWindow.localStorage.getItem("dark-mode");
    }
    static set darkMode(darkMode) {
        const appWindow = KitDependencyManager.getWindow();
        appWindow.localStorage.setItem("dark-mode", darkMode);
    }

    // methods
    static applyTheme() {
        const currentDate = new Date();
        let theme = Preferences.theme;
        if (!theme) {
            theme = "northern-seasons";
        }
        if (theme == "northern-seasons") {
            theme = this.#getNorthernSeasonsTheme(currentDate);
        }
        if (theme == "southern-seasons") {
            theme = this.#getSouthernSeasonsTheme(currentDate);
        }
        let darkMode = Preferences.darkMode;
        if (!darkMode) {
            darkMode = "time-of-day";
        }
        if (darkMode == "time-of-day") {
            darkMode = this.#getTimeOfDayDarkMode(currentDate);
        }
        if (darkMode == "dark") {
            theme += "-dark";
        }
        const appDocument = KitDependencyManager.getDocument();
        appDocument.documentElement.setAttribute("data-app-theme", theme);
    }

    // helpers
    static #getNorthernSeasonsTheme(currentDate) {
        const currentYear = currentDate.getFullYear();
        const springStart = new Date(currentYear, 3, 21);
        const summerStart = new Date(currentYear, 6, 21);
        const fallStart = new Date(currentYear, 9, 21);
        const winterStart = new Date(currentYear, 12, 21);
        if (currentDate >= springStart && currentDate < summerStart) {
            return "spring";
        }
        if (currentDate >= summerStart && currentDate < fallStart) {
            return "summer";
        }
        if (currentDate >= fallStart && currentDate < winterStart) {
            return "fall";
        }
        return "winter";
    }

    static #getSouthernSeasonsTheme(currentDate) {
        let theme = this.#getNorthernSeasonsTheme(currentDate);
        if (theme == "spring") {
            return "fall";
        }
        if (theme == "summer") {
            return "winter";
        }
        if (theme == "fall") {
            return "spring";
        }
        return "summer";
    }

    static #getTimeOfDayDarkMode(currentDate) {
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDayOfMonth = currentDate.getDate();
        const dayStart = new Date(currentYear, currentMonth, currentDayOfMonth, 5);
        const nightStart = new Date(currentYear, currentMonth, currentDayOfMonth, 19);
        if (currentDate >= dayStart && currentDate < nightStart) {
            return "light";
        }
        return "dark";
    }

}
