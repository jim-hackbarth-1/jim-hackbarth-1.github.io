
import { DebugConsole } from "../heading/heading.js";

export function createModel() {
    return new HelpModel();
}

class HelpModel {

    getDebugConsoleItems() {
        let items = DebugConsole.debugItems;
        if (items.length === 0) {
            items = [{ itemType: "info", data: "no items" }];
        }
        return items;
    }
}
