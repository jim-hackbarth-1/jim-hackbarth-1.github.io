
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
        try {
            await writable.write(json);
            await writable.close();
        }
        catch (error) {
            await writable.abort();
        }
    }

    static async download(data, fileName, anchor) {
        anchor.href = URL.createObjectURL(data);
        anchor.download = fileName;
        anchor.click();
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
