
export class FileManager {

    // properties
    static fileHandle;

    // methods
    static async openMap() {
        const file = await FileManager.fileHandle.getFile();
        return await file.text();
    }

    static async saveMap(json) {
        await FileManager.saveMapAs(json, FileManager.fileHandle);
    }

    static async saveMapAs(data, fileHandle) {
        const writable = await fileHandle.createWritable();
        try {
            await writable.write(data);
            await writable.close();
            console.log("saved");
        }
        catch (error) {
            console.log("error saving file");
            await writable.abort();
            console.log("save file cancelled");
        }
    }

    static async getImageSource(fileHandle) {
        const file = await fileHandle.getFile();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    }
}
