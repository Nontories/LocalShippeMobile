import axios from "axios";
import LINK_API from "./link";

const LINK_SHIPPER_API = "https://localshipper.azurewebsites.net/shipper/api/"

const createAxiosInstance = (token) => {
  return axios.create({
    baseURL: LINK_API,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const ShipperByAcountId = async (id, token) => {
  try {
    const instance = createAxiosInstance(token);
    const response = await instance.get(`${LINK_API}` + `shippers?accountId=${id}`);
    return response;
  } catch (error) {
    return [];
  }
};

export const ChangeShipperStatus = async (id, status, token) => {

  data = {
    status: status
  }

  try {
    const instance = createAxiosInstance(token);
    const response = await instance.put(`${LINK_API}` + `shippers/status?shipperId=${id}`, data);
    return response;
  } catch (error) {
    return [];
  }
};

export const InteractOrder = async (data, token) => {

  let path = ""

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      path += `${key}=${data[key]}&`
    }
  }

  try {
    const instance = createAxiosInstance(token);
    const response = await instance.put(`${LINK_SHIPPER_API}orders?${path}`);
    return response;
  } catch (error) {
    console.log("InteractOrder in api/shipper error : ", error);
    return error;
  }
};

export const GetCompleteRate = async (id, token) => {

  try {
    const instance = createAxiosInstance(token);
    const response = await instance.get(`${LINK_SHIPPER_API}` + `orders/rate-complete?shipperId=${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const GetCancelRate = async (id, token) => {

  try {
    const instance = createAxiosInstance(token);
    const response = await instance.get(`${LINK_SHIPPER_API}` + `orders/rate-cancel?shipperId=${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const GetRate = async (id, token) => {

  try {
    const instance = createAxiosInstance(token);
    const response = await instance.get(`${LINK_API}` + `ratings?shipperId=${id}`);
    return response;
  } catch (error) {
    return error;
  }
};
