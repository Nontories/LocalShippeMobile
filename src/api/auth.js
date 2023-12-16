import axios from "axios";
import LINK_API from "./link";

const LINK_STORE_API = "https://localshipper.azurewebsites.net/store/api/"

const createAxiosInstance = (token) => {
  return axios.create({
    baseURL: LINK_API,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const signIn = async (data) => {
  try {
    const response = await axios.post(`${LINK_API}` + "logins", data);
    return response;
  } catch (error) {
    return [];
  }
};

export const signInWithOtp = async (mail) => {
  try {
    const response = await axios.post(`${LINK_API}` + `logins/otp?email=${mail}`);
    return response;
  } catch (error) {
    return [];
  }
};

export const verifyOtp = async (mail, otp) => {
  try {
    const response = await axios.get(`${LINK_API}` + `logins/verify-otp?email=${mail}&otp=${otp}`);
    return response;
  } catch (error) {
    return error;
  }
};


export const signUp = async (data) => {
  try {
    const response = await axios.post(`${LINK_API}` + "accounts/register-shipper-account", data);
    return response;
  } catch (error) {
    console.error("Error singup:", error);
    return error;
  }
};

export const checkValidMail = async (mail) => {
  try {
    const response = await axios.get(`${LINK_API}` + "logins/check-email?email=" + mail);
    return response;
  } catch (error) {
    console.error("Error singup:", error);
    return error;
  }
};

export const forgotPassword = async (mail) => {
  try {
    const response = await axios.put(`${LINK_API}` + `accounts/forgot-password?email=${mail}`);
    return response;
  } catch (error) {
    return [];
  }
};

export const forgotOtp = async (mail, otp) => {
  try {
    const response = await axios.get(`${LINK_API}` + `accounts/verify-forgot?email=${mail}&otp=${otp}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const newPassword = async (mail, password) => {
  try {
    const response = await axios.post(`${LINK_API}` + `accounts/reset-password?email=${mail}&newPassword=${password}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const changePassword = async (accountId, password, rePassword, token) => {
  try {
    const instance = createAxiosInstance(token);
    const response = await instance.post(`${LINK_API}` + `accounts/change-password?userId=${accountId}&currentPassword=${password}&newPassword=${rePassword}`);
    return response;
  } catch (error) {
    return error;
  }
};
