import React, { useEffect } from "react";
import { createContext, useReducer } from "react";
import cafeApi from "../api/cafeApi";
import { Usuario, LoginResponse, LoginData, RegisterData } from '../interfaces/appInterfaces';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { authReducer, AuthState } from './authReducer';

type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    signUp: (registerData: RegisterData) => void;
    signIn: (loginData: LoginData) => void;
    logOut: () => void;
    removeError: () => void;
}


//Estado inicial al cargarse la aplicacion - justo cuando la aplicacion se abre
const authInicialState: AuthState = {
    status: 'checking',
    token: null,
    user: null,
    errorMessage: ''

}

export const AuthContext = createContext({} as AuthContextProps);
export const AuthProvider = ({ children }: any) => {

    //El dispatch es la funcion que sirve para disparar las acciones
    const [state, dispatch] = useReducer(authReducer, authInicialState);

    useEffect(() => {
        checkToken();

    }, []);

    const checkToken = async () => {
        const token = await AsyncStorage.getItem('token');
        // No token no autenticado
        if (!token) return dispatch({ type: 'notAuthenticated' });

        //Hay Token

        const resp = await cafeApi.get('/auth');

        if (resp.status != 200) {
            return dispatch({ type: 'notAuthenticated' });
        }
        await AsyncStorage.setItem('token', resp.data.token);
        dispatch({
            type: 'signUp',
            payload: {
                token: resp.data.token,
                user: resp.data.usuario
            }
        });

    }


    const signIn = async ({ correo, password }: LoginData) => {
        try {
            const { data } = await cafeApi.post<LoginResponse>('/auth/login', { correo, password });
            //Una vez logeados pasamos al metodo signUp del reducer que va a recoger los datos
            // del payload y cambiar las propiedades en funcion de lo que le mandemos en el objeto
            dispatch({
                type: 'signUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            });
            //Guardamos el token con AsyncStorage. AsyncStorage es una libreria disponible
            // para React que nos permite guardas claves clave-valor al estilo LocalStorage
            await AsyncStorage.setItem('token', data.token);

        } catch (error: any) {
            console.log(error.response.data.msg)
            dispatch({
                type: 'addError',
                payload: error.response.data.msg || 'Informacion incorrecta'
            })
        }
    };
    const signUp = async ({ nombre, correo, password }: RegisterData) => {
        try {
            const { data } = await cafeApi.post<LoginResponse>('/usuarios', { correo, password,nombre });
            //Una vez logeados pasamos al metodo signUp del reducer que va a recoger los datos
            // del payload y cambiar las propiedades en funcion de lo que le mandemos en el objeto
            dispatch({
                type: 'signUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            });
            //Guardamos el token con AsyncStorage. AsyncStorage es una libreria disponible
            // para React que nos permite guardas claves clave-valor al estilo LocalStorage
            await AsyncStorage.setItem('token', data.token);

        } catch (error: any) {
            console.log(error.response.data.msg)
            dispatch({
                type: 'addError',
                payload: error.response.data.errors[0].msg || 'Revise la Informacion'
            })
        }


     };

    const logOut = async () => {
        await AsyncStorage.removeItem('token');
        dispatch({ type: 'logout' });
    };
    const removeError = () => {
        dispatch({ type: 'removeError' })

    };

    // En este Return que ira a nuestra App.tsx y definira el estado inicial de nuestra aplicacion
    // debemos satisfacer todo lo definido en la interface de AuthContext . Por esta razon se han definido
    // los metodos a objeto vacio (signUp,signIn,logOut,removeError). Aparte de esto definimos en este AuthContextProps
    // el state que esta formado por : status, token, user, errorMessage

    return (
        <AuthContext.Provider value={{
            ...state,
            signUp,
            signIn,
            logOut,
            removeError
        }}>
            {children}
        </AuthContext.Provider>
    )
}