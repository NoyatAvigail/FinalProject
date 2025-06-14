import axios from "axios";
import Cookies from "js-cookie";
import { logOutFunc } from "../js/logout.js"
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
let getToken = () => Cookies.get('token');

export function setTokenGetter(fn) {
    getToken = fn;
}

const registerAuth = async (endpoint, body, onSuccess, onError) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/users/${endpoint}`,
            body,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(`Response from ${endpoint}:`, response);
        const data = response.data;
        if (onSuccess) onSuccess(data);
        return data;
    } catch (error) {
        console.error(error);
        if (onError) onError(error.message);
    }
};

async function request(userId, type, url, params = {}, method = 'GET', body = null, onSuccess, onError) {
    try {
        const token = getToken();
        const config = {
            method,
            url: `${API_URL}/api/users/${type}/${userId}/${url}`,
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            params
        };
        if (method !== 'DELETE' && body) {
            config.data = body;
        }
        const response = await axios(config);
        const data = response.data;
        if (onSuccess) {
            onSuccess(data)
        };
        return data;
    } catch (error) {
        if (error.response?.status == 403) {
            logOutFunc();
        }
        console.error(error);
        if (onError) onError(error.message);
    }
}

export const userService = {
    getAll: (userId, table, onSuccess, onError) =>
        request(userId, type, table, {}, 'GET', null, onSuccess, onError),
    getByValue: (userId, type, table, params, onSuccess, onError) =>
        request(userId, type, table, params, 'GET', null, onSuccess, onError),
    getById: (userId, table, onSuccess, onError) =>
        request(userId, `${table}`, {}, 'GET', null, onSuccess, onError),
    getNested: (userId, base, id, nested, params, onSuccess, onError) =>
        request(userId, `${base}/${id}/${nested}`, params, 'GET', null, onSuccess, onError),
    create: (userId, userType, entityName, body, onSuccess, onError) =>
        request(userId, userType, entityName, {}, 'POST', body, onSuccess, onError),
    update: (userId, userType, entityName, id, data, onSuccess, onError) =>
        request(userId, userType, `${entityName}/${id}`, {}, 'PUT', data, onSuccess, onError),
    patch: (userId, userType, entityName, id, data, onSuccess, onError) =>
        request(userId, userType, `${entityName}/${id}`, {}, 'PATCH', data, onSuccess, onError),
    remove: (userId, userType, entityName, id, onSuccess, onError) =>
        request(userId, userType, `${entityName}/${id}`, {}, 'DELETE', null, onSuccess, onError),
};

export const signup = (body, onSuccess, onError) => registerAuth("signup", body, onSuccess, onError);
export const login = (body, onSuccess, onError) => registerAuth("login", body, onSuccess, onError);