//Conexiones a una API externa

import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
const baseURL = "http://192.168.105.121:8080/api";
const cafeApi = axios.create({ baseURL });

//Aplicamos un Middleware
//Este Middleware establecera el token en todas las peticiones si este existe
//Todas las peticiones que tienen como base cafeAxios que son todas

cafeApi.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers!['x-token'] = token;
        }
        return config;
    }
)

export default cafeApi;
