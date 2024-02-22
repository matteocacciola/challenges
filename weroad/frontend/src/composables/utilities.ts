export const getCleanObject = (obj: object, without: string[] = []): object => {
    let cleanObj = {};
    Object.keys(obj).forEach((k) => {
        if (obj[k] && obj[k]!="") {
            cleanObj[k] = obj[k]
        }
    });
    return objectWithoutProperties(cleanObj, without);
};

export const objectWithoutProperties = (obj: object, keys?: string[]) => {
    if (!keys || keys.length === 0) return obj;

    const target = {};
    for (const i in obj) {
        if (keys.indexOf(i) >= 0) continue;
        if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
        target[i] = obj[i];
    }
    return target;
};

export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
