
export class FileManager {

    // properties
    static fileHandle;

    // methods
    static async openMap() {
        const file = await FileManager.fileHandle.getFile();
        return await file.text();
    }

    static async saveMap(json) {
        const writable = await FileManager.fileHandle.createWritable();
        await writable.write(json);
        await writable.close();
        console.log("saved");
    }
}
