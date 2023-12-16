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

export const InteractRoute = async (data, token) => {

  let path = ""

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      path += `${key}=${data[key]}&`
    }
  }

  try {
    const instance = createAxiosInstance(token);
    const response = await instance.get(`${LINK_API}` + `routes?${path}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const createRouteMannual = async (name, time, id, token) => {
  const data = {
    name: name,
    startDate: time,
    shipperId: id
  }
  try {
    const instance = createAxiosInstance(token);
    const response = await instance.post(`${LINK_API}` + `routes`, data);
    return response;
  } catch (error) {
    return error;
  }
};

export const createRouteAuto = async (data, tranfer, token) => {

  let path = ""

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      path += `${key}=${data[key]}&`
    }
  }

  try {
    const instance = createAxiosInstance(token);
    const response = await instance.post(`${LINK_SHIPPER_API}` + `routes-auto?${path}`, tranfer);
    return response;
  } catch (error) {
    return error;
  }
};

export const addOrderToRoute = async (shipperId, routeId, listId, token, location) => {

  const latitude = location?.coords?.latitude
  const longitude = location?.coords?.longitude
  const path = `shipperId=${shipperId}&routeId=${routeId}&shipperLatitude=${latitude}&shipperLongitude=${longitude}`

  try {
    const instance = createAxiosInstance(token);
    const response = await instance.post(`${LINK_SHIPPER_API}` + `routes?${path}`, listId);
    return response;
  } catch (error) {
    return error;
  }
};

export const changeRouteStatus = async (route, status, token) => {

  const data = {
    name: route?.name,
    fromStation: route?.fromStation,
    toStation: route?.toStation,
    createdDate: route?.createdDate,
    startDate: route?.startDate,
    eta: route?.eta,
    quantity: route?.quantity,
    progress: route?.progress,
    priority: route?.priority,
    status: status,
    shipperId: route?.shipperId
  }

  try {
    const instance = createAxiosInstance(token);
    const response = await instance.put(`${LINK_API}` + `routes?routeId=${route?.id}`, data);
    return response;
  } catch (error) {
    return error;
  }
};

export const editRoute = async (route, token) => {

  const data = {
    name: route?.name,
    fromStation: route?.fromStation,
    toStation: route?.toStation,
    createdDate: route?.createdDate,
    startDate: route?.startDate,
    eta: route?.eta,
    quantity: route?.quantity,
    progress: route?.progress,
    priority: route?.priority,
    status: route?.status,
    shipperId: route?.shipperId
  }

  try {
    const instance = createAxiosInstance(token);
    const response = await instance.put(`${LINK_API}` + `routes?routeId=${route?.id}`, data);
    return response;
  } catch (error) {
    return error;
  }
};

export const deleteRoute = async (id, token) => {
  try {
    const instance = createAxiosInstance(token);
    const response = await instance.delete(`${LINK_API}` + `routes?routeId=${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const DeleteOrder = async (orderList, token) => {

  const data = [...orderList]

  console.log(data);
  console.log(`${LINK_API}` + `routes/delete-order`);

  try {
    const instance = createAxiosInstance(token);
    const response = await instance.put(`${LINK_API}` + `routes/delete-order`, data);
    return response;
  } catch (error) {
    return error;
  }
};
