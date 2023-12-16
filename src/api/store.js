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

export const InteractStore = async (data, token) => {
  let path = ""

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      path += `${key}=${data[key]}&`
    }
  }
  
  // console.log(`${LINK_API}` + `stores?${path}`);

  try {
    const instance = createAxiosInstance(token);
    const response = await instance.get(`${LINK_API}` + `stores?${path}`);
    return response;
  } catch (error) {
    return error;
  }
};

