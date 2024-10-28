
export class DbManager {

    // methods
    static async getMap() {
        const db = await DbManager.#getDb();
        const request = db.transaction("maps").objectStore("maps").get("current-map");
        return new Promise((resolve) => { request.onsuccess = () => { resolve(request.result); }; });
    }

    static async setMap(mapData) {
        const db = await DbManager.#getDb();
        db.transaction("maps", "readwrite").objectStore("maps").put(mapData, "current-map");
    }

    // helpers
    static #db;

    static #getDb() {
        if (!DbManager.#db) {
            const request = indexedDB.open("atlas");
            return new Promise((resolve) => {
                request.onsuccess = () => {
                    DbManager.#db = request.result;
                    resolve(DbManager.#db);
                };
                request.onupgradeneeded = () => {
                    DbManager.#db = request.result;
                    if (!DbManager.#db.objectStoreNames.contains("maps")) {
                        DbManager.#db.createObjectStore("maps");
                    }
                };
            });
        }
        return DbManager.#db;
    }
}
