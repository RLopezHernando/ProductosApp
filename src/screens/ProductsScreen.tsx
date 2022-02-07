import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, RefreshControl, TouchableOpacity, View,StyleSheet,Text } from 'react-native';


import { ProductsContext } from '../context/ProductsContext';
import { ProductsStacksParams } from '../navigator/productsNavigator';


interface Props extends NativeStackScreenProps<ProductsStacksParams, 'ProductsScreen'> { }

export const ProductsScreen = ({ navigation }: Props) => {

    const [isRefreshing,setIsRefreshing] = useState(false);

    const { products, loadProducts } = useContext(ProductsContext);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{ marginRight: 10 }}
                    onPress={() => navigation.navigate('ProductScreen', {})}
                >
                    <Text>Agregar</Text>

                </TouchableOpacity>
            )
        })
    }, []);


    //Pull To Refresh
    const loadProductsFromBackend = async () => {
        setIsRefreshing(true);
        await loadProducts();
        setIsRefreshing(false);
    }


    return (

        <View style={{ flex: 1, marginHorizontal: 10 }}>
            <FlatList
                data={products}
                keyExtractor={(p:any) => p._id.toString() + p.nombre.toString()}
                renderItem={({ item }:any) => (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('ProductScreen', {
                            id: item._id,
                            name: item.nombre
                        })}
                    >
                        <Text style={styles.productName}>{item.nombre}</Text>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (
                    <View style={styles.itemSeparator} />
                )}

                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={loadProductsFromBackend}
                    
                    />
                }
            />
        </View>
    )

};

const styles = StyleSheet.create({
    productName: {
        fontSize: 20
    },
    itemSeparator: {
        borderBottomWidth: 2,
        marginvertical: 5,
        borderBottomColor: 'rgba(0,0,0,0.1)'
    }
});



    // onPress={() => navigation.navigate('ProductScreen', {
                        //     id: item._id,
                        //     name: item.nombre
                        // })}>