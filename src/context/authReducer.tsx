import { Usuario } from "../interfaces/appInterfaces";

export interface AuthState {
    status: 'checking' | 'authenticated' | 'not-authenticated';
    token: string | null;
    errorMessage: string;
    user: Usuario | null;
}

//Definimos las acciones de la autenticacion
// Fijandonos en lo que nos devuelve el backend mendiante postman podemos ver que cuando
// creamos un usuario o nos logeamos lo que nos devuelve el backend es un token: string y un objeto usuario

type AuthAction =
    | { type: 'signUp', payload: { token: string, user: Usuario } }
    | { type: 'addError', payload: string }
    | { type: 'removeError' }
    | { type: 'notAuthenticated' }
    | { type: 'logout' }


//Especificamos las acciones en un switch. Siempre se devuelve un tipo AuthState de hay que se cree la interface
//al principio


export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'addError':
            return {
                ...state,
                status: 'not-authenticated',
                user: null,
                token: null,
                errorMessage: action.payload
            }

        case 'removeError': {
            return {
                ...state,
                errorMessage: ''
            }
        }

        case 'signUp': {
            return {
                ...state,
                errorMessage: '',
                status: 'authenticated',
                token: action.payload.token,
                user: action.payload.user
            }
        }

        // Se realiza la verificacion del Token y este no es valido

        case 'logout':
        case 'notAuthenticated':
            return {
                ...state,
                status: 'not-authenticated',
                token: null,
                user: null
            }


        default:
            return state;
    }
}