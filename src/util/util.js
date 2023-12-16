export function getKeyByValue(obj, value) {
    for (const key in obj) {
        if (obj[key] === value) {
            return key;
        }
    }
    return null;
}

export function findObjectByValue(arr, valueToFind) {
    return arr?.find(obj => obj.value == valueToFind);
}

export const findObjectById = (array, id) => {

    const obj = array?.find(item => item.id == id)

    if (obj) {
        return obj
    } else {
        // console.log('Object not found.');
        return {}
    }
};

export const dynamicSearch = (array, search) => {

    let filterOrder = filteredOrders(array, search);

    return uniqueFilteredOrdersById(filterOrder)
}

export function uniqueFilteredOrdersById(elements) {
    const uniqueElements = [];
    const seenIds = new Set();

    for (const element of elements) {
        const elementId = element.id; // Change 'id' to match your object's ID attribute
        if (!seenIds.has(elementId)) {
            seenIds.add(elementId);
            uniqueElements.push(element);
        }
    }

    return uniqueElements;
}

export const filteredOrders = (order, search) => {
    let orderList = []
    order.filter(orderItem => {
        const searchTerm = search.toLowerCase();
        if (
            // orderItem.trackingNumber.toLowerCase().includes(searchTerm) ||
            // orderItem.customerCity.toLowerCase().includes(searchTerm) ||
            // orderItem.customerCommune.toLowerCase().includes(searchTerm) ||
            // orderItem.customerName.toLowerCase().includes(searchTerm) ||
            orderItem.store.storeName.toLowerCase().includes(searchTerm)
            // orderItem.store.storeAddress.toLowerCase().includes(searchTerm)
        ) {
            orderList.push(orderItem)
        }
    })
    return orderList
}

export const getOrderAddable = (orders) => {
    const orderList = orders.filter(item => item.routeId === null && item.pickupTime === null);
    return orderList
}

export const deleteElement = (array, value) => {
    const newArray = array
    const indexToDelete = newArray?.indexOf(value);
    if (indexToDelete !== -1) {
        newArray.splice(indexToDelete, 1);
    }
    return newArray
}

export const formatPrice = (price) => {
    const numberString = String(price);
    const numberArray = numberString.split('');
    const dotPosition = numberArray.length % 3 || 3;
    for (let i = dotPosition; i < numberArray.length; i += 4) {
        numberArray.splice(i, 0, '.');
    }
    const formattedNumber = numberArray.join('');
    return formattedNumber;
}

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedDate = `${day} Th${date.getMonth() + 1}, ${hours}:${minutes} ${ampm}`;

    return formattedDate;
}

export const getDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB');

    return formattedDate;
}

export const getTime = (dateString) => {
    const date = new Date(dateString);
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return formattedTime;
}