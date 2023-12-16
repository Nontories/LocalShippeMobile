import axios from "axios";
import LINK_API from "./link";

const createAxiosInstance = (token) => {
    return axios.create({
        baseURL: LINK_API,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const GetPackage = async (data, token) => {

    // batchId id status actionId typeId customerName customerAddress customerPhome custommerEmail totalPrice

    let path = ""

    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            path += `${key}=${data[key]}&`
        }
    }

    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + "packages?" + path);
        return response;
    } catch (error) {
        return [];
    }
};

export const InteractPackageStatus = async ( data , token) => {

    let path = ""

    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            path += `${key}=${data[key]}&`
        }
    }

    try {
        const instance = createAxiosInstance(token);
        const response = await instance.put(`${LINK_API}` + `packages/status?${path}`);
        return response;
    } catch (error) {
        return [];
    }
};
