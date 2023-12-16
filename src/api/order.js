import axios from "axios";
import LINK_API from "./link";

const LINK_SHIPPER_API = "https://localshipper.azurewebsites.net/shipper/api/"

const createAxiosInstance = (token) => {
    return axios.create({
        baseURL: LINK_API,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

export const GetOrder = async (data, token) => {

    // id status storeId batchId shipperId tracking_number tracking_number distance_price subtotal_price totalPrice other

    let path = ""

    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            path += `${key}=${data[key]}&`
        }
    }

    path += "shipperLatitude=0&shipperLongitude=0"
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + "orders?" + path);
        return response;
    } catch (error) {
        console.log("GetOrder in api/order.js error : ", error);
        return [];
    }
};

export const PostOrder = async (data, token) => {

    // storeId batchId

    try {
        const instance = createAxiosInstance(token);
        const response = await instance.post(`${LINK_API}` + "orders", data);
        return response;
    } catch (error) {
        return [];
    }
};

export const PutOrder = async (id, data, token) => {

    // status cancelReason other

    try {
        const instance = createAxiosInstance(token);
        const response = await instance.post(`${LINK_API}` + "orders?id=" + id, data);
        return response;
    } catch (error) {
        return [];
    }
};

export const AssigningOrder = async (token) => {
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + "orders?status=2");
        return response;
    } catch (error) {
        return error;
    }
};

export const ShipperAcpOrder = async (data, orderID, token) => {
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.put(`${LINK_API}` + `Order/${orderID}/ShipperAcpOrder`, data);
        return response;
    } catch (error) {
        console.error("Error singup:", error);
        return error;
    }
};

export const CompleteOrder = async (orderID) => {

    try {
        const instance = createAxiosInstance(token);
        const response = await instance.put(`${LINK_API}` + `Order/${orderID}/CompleteOrder`);
        return response;
    } catch (error) {
        console.error("Error singup:", error);
        return error;
    }
};

export const PickupProduct = async (orderID) => {
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.put(`${LINK_API}` + `Order/${orderID}/PickupProduct`);
        return response;
    } catch (error) {
        console.error("Error singup:", error);
        return error;
    }
};

export const CancelOrder = async (orderID) => {
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.put(`${LINK_API}` + `Order/${orderID}/CancelOrder`);
        return response;
    } catch (error) {
        console.error("Error singup:", error);
        return error;
    }
};

export const ShipperOrder = async (ID, token) => {
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + `orders?shipperId=${ID}`);
        return response;
    } catch (error) {
        console.error("Error singup:", error);
        return error;
    }
};

export const ReceiveRateByShipperId = async (ID) => {
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + `Order/ReceiveRateByShipperId?shipperId=${ID}`);
        return response;
    } catch (error) {
        console.error("Error singup:", error);
        return error;
    }
};

export const CancelRateByShipperId = async (ID) => {
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + `Order/CancelRateByShipperId?shipperId=${ID}`);
        return response;
    } catch (error) {
        console.error("Error singup:", error);
        return error;
    }
};

export const TotalPriceAndOrderCountInMonth = async (ID, month, year) => {
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + `Order/TotalPriceAndOrderCountInMonth?shipperId=${ID}&month=${month}&year=${year}`);
        return response;
    } catch (error) {
        console.error("Error singup:", error);
        return error;
    }
};

export const TotalPriceAndOrderCountInWeek = async (ID, week, month, year) => {
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + `Order/TotalPriceAndOrderCountInWeek?shipperId=${ID}&month=${month}&weekOfMonth=${week}&year=${year}`);
        return response;
    } catch (error) {
        console.error("Error get total:", error);
        return error;
    }
};

export const TotalPriceAndOrderCountInDay = async (ID, day, month, year) => {
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + `Order/TotalPriceAndOrderCountInDay?shipperId=${ID}&month=${month}&day=${day}&year=${year}`);
        return response;
    } catch (error) {
        console.error("Error singup:", error);
        return error;
    }
};

export const UploadEnvidence = async (id, image, token) => {
    try {
        const formData = new FormData();
        formData.append('image', {
            uri: image,
            type: 'image/jpeg',
            name: 'evidence.jpg',
        });
        const instance = createAxiosInstance(token);
        const response = await instance.put(
            `${LINK_SHIPPER_API}orders/envidence?orderId=${id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response;
    } catch (error) {
        console.error('Error uploading evidence:', error);
        console.log(error?.data);
        return error;
    }
};

// export const UploadEnvidence = async (id, image, token) => {

//     const data = {
//         image: image
//     }

//     // const data = image

//     console.log(data);

//     try {
//         const instance = createAxiosInstance(token);
//         const response = await instance.put(`${LINK_SHIPPER_API}` + `orders/envidence?orderId=${id}`, data);
//         return response;
//     } catch (error) {
//         return error;
//     }
// };
