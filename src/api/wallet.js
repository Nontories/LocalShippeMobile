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

export const GetWallet = async (data, token) => {
    let path = ""

    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            path += `${key}=${data[key]}&`
        }
    }

    // console.log(`${LINK_API}` + `stores?${path}`);

    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + `wallets?${path}`);
        return response;
    } catch (error) {
        return error;
    }
};

export const GetTransaction = async (data, token) => {
    let path = ""

    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            path += `${key}=${data[key]}&`
        }
    }

    // console.log(`${LINK_API}` + `stores?${path}`);
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + `wallets/wallet-transaction?${path}`);
        return response;
    } catch (error) {
        return error;
    }
};

export const CreateTransaction = async (fromId, toId, amount, token) => {

    const data = {
        fromWalletId: fromId,
        toWalletId: toId,
        amount: amount
    }

    console.log(data);

    try {
        const instance = createAxiosInstance(token);
        const response = await instance.post(`${LINK_API}` + `wallets/create-wallet-transaction`, data);
        return response;
    } catch (error) {
        return error;
    }
};
