
export class SessionStorageManager {

    static retrieveUserInfo() {
        const stored = sessionStorage.getItem("userInfo");
        if (stored) {
            return JSON.parse(stored);
        } else {
            return null;
        }
    }

    static saveUserInfo(info) {

        console.log("saveUserInfo: " + JSON.stringify(info));

        const stored = sessionStorage.getItem("userInfo");
        if (stored) {
            const userInfo = JSON.parse(stored);
            sessionStorage.setItem("userInfo", JSON.stringify({
                ...userInfo,
                ...info
            }));
        } else {
            sessionStorage.setItem("userInfo", JSON.stringify(info));
        }
    }
}