import axios from "axios";
import Cookies from "js-cookie";
import { logOutFunc } from "../js/logout.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

let getToken = () => Cookies.get('token');
export function setTokenGetter(fn) {
    getToken = fn;
}

async function request(body, url, method = 'GET', onSuccess, onError) {    
    try {
        const token = getToken();
        const config = {
            method,
            url: `${API_URL}/api/contacts${url}`,
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: body
        };
        const response = await axios(config);
        const data = response.data;
        if (onSuccess) onSuccess(data);
        return data;
    } catch (error) {
        if (error.response?.status === 403) {
            logOutFunc();
        }
        console.error(error);
        if (onError) onError(error.message);
    }
}

export const contactsServices = {
    getAll: (url,onSuccess, onErrorr) =>
        request("",`/${url}`, 'GET', onSuccess, onErrorr),
    getByValue:(url,id,onSuccess, onErrorr) =>
        request("",`/${url}/${id}`, 'GET', onSuccess, onErrorr),
    create: (body ,url ,onSuccess, onErrorr) =>
        request(body, `/${url}`, 'POST', onSuccess, onErrorr),
}