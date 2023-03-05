import axios from "axios";
import {PUBLIC_API_URL} from '$env/static/public';
import {goto} from '$app/navigation';
import Cookies from 'js-cookie'

axios.defaults.baseURL = PUBLIC_API_URL;
axios.defaults.timeout = 10000;
axios.defaults.headers.common['Authorization'] = `Bearer ` + Cookies.get('token');
axios.defaults.headers['Content-Type'] = 'application/json';

let refresh = false;

axios.interceptors.response.use(response => response, async error => {
    if (error?.response?.status === 401 && !refresh) {
        refresh = true;

        goto('/login')
    }

    return error;
});
