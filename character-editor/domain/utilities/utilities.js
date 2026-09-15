
export class Utilities {

    static areArraysEqual(array1, array2, propertyNames) {
        if (array1 === array2) {
            return true;
        }
        if (array1 == null || array2 == null) {
            return false;
        }
        if (array1.length !== array2.length) {
            return false;
        }
        const hasProperties = (propertyNames && propertyNames.length > 0);
        for (var i = 0; i < array1.length; ++i) {
            if (hasProperties) {
                for (const propertyName of propertyNames) {
                    if (array1[i][propertyName] !== array2[i][propertyName]) {
                        return false;
                    }
                }
            }
            else {
                if (array1[i] !== array2[i]) {
                    return false;
                }
            }
            
        }
        return true;
    }

    static sort(array, sortField) {
        function sortByProperty(item1, item2) {
            if (item1[sortField] < item2[sortField]) {
                return -1;
            }
            if (item1[sortField] > item2[sortField]) {
                return 1;
            }
            return 0;
        }
        array.sort(sortByProperty);
        return array;
    }

}
