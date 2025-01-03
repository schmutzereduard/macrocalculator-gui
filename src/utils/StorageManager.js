export class StorageManager {
    static storageType = sessionStorage; // Default storage type

    /**
     * Sets the storage type dynamically.
     * @param {boolean} remember - If true, use localStorage; otherwise, use sessionStorage.
     */
    static setStorageType(remember) {
        this.storageType = remember ? localStorage : sessionStorage;
    }

    /**
     * Saves data to the selected storage.
     * @param {string} key - The key to store the data under.
     * @param {any} value - The value to store (will be stringified).
     */
    static save(key, value) {
        this.storageType.setItem(key, JSON.stringify(value));
    }

    /**
     * Retrieves data from the selected storage.
     * @param {string} key - The key to retrieve the data from.
     * @returns {any} - The parsed value from storage, or null if not found.
     */
    static retrieve(key) {
        const data =
            sessionStorage.getItem(key) ||
            localStorage.getItem(key); // Fallback to other storage
        return data ? JSON.parse(data) : null;
    }

    /**
     * Removes data from both localStorage and sessionStorage.
     * @param {string} key - The key to remove from storage.
     */
    static remove(key) {
        sessionStorage.removeItem(key);
        localStorage.removeItem(key);
    }

    static clear() {
        sessionStorage.clear();
        localStorage.clear();
    }
}
