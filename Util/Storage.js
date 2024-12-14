import AsyncStorage from '@react-native-async-storage/async-storage';
export function formateDate(date) {
    function pad(s) {
        return s < 10 ? '0' + s : s;
    }
    return [
        pad(date.getDate()),
        pad(date.getMonth() + 1),
        date.getFullYear(),
    ].join('/');
}
const storeData = async (key, value) => {
    console.log("store data", key, value)
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        // saving error
    }
};
const storeObjectData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        // saving error
    }
};
const getData = async key => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            // value previously stored
            return value;
        }
    } catch (e) {
        // error reading value
    }
};
const getObjectData = async key => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue !== null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
    }
};
const clearAll = async () => {
    console.log("clear all")
    try {
        await AsyncStorage.clear();
    } catch (e) {
        // clear error
    }
};

const removeItemAyncStorage = async key => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        // clear error
    }
};


export { storeData, storeObjectData, getData, getObjectData, clearAll, removeItemAyncStorage };
