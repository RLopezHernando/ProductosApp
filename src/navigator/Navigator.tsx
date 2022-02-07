import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { ProtectedScreen } from "../screens/ProtectedScreen";
import { AuthContext } from '../context/AuthContext';
import { LoadingScreen } from "../screens/LoadingScreen";
import { ProductsNavigator } from "./ProductsNavigator";




const Stack = createNativeStackNavigator();

export const Navigator = () => {

    const { status } = useContext(AuthContext);

    if(status == 'checking') return <LoadingScreen/>

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: 'white'
                }
            }}
        >

            {
                (status !== 'authenticated') ?
                    (
                        <>
                            <Stack.Screen name="LoginScreen" component={LoginScreen} />
                            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                        </>
                    )
                    : (
                        // <Stack.Screen name="ProtectedScreen" component={ProtectedScreen}/>
                        //Importante recalcar que aqui no especificamos una pantalla en concreto
                        // sino otro navigator que a su vez contendra una o mas pantallas
                        <Stack.Screen name="ProductsNavigator" component={ProductsNavigator}/>
                    )
            }
        </Stack.Navigator>
    );
}


