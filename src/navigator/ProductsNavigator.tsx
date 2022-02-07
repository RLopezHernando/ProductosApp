import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductsScreen } from '../screens/ProductsScreen';
import { ProductScreen } from '../screens/ProductScreen';

export type ProductsStacksParams = {
    ProductsScreen: undefined,
    ProductScreen: { id?: string, name?: string }
}


const Stack = createNativeStackNavigator<ProductsStacksParams>();

export const ProductsNavigator = () => {
    return (
        <Stack.Navigator  >
            <Stack.Screen name="ProductsScreen" component={ProductsScreen}
                options={{ title: 'Productos' }} />
            <Stack.Screen name="ProductScreen" component={ProductScreen} />
        </Stack.Navigator>
    );
};
