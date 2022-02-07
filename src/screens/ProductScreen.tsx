
import { ProductsStacksParams } from '../navigator/productsNavigator';
import { useCategories } from '../hooks/useCategories';
import { useForm } from '../hooks/useForm';
import { ProductsContext } from '../context/ProductsContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import { launchCamera } from 'react-native-image-picker';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, TextInput, View, Text, ActivityIndicator, Button, Image, StyleSheet } from 'react-native';

interface Props extends NativeStackScreenProps<ProductsStacksParams, 'ProductScreen'> { }

//Recordemos con el navigation vamos de una pagina a otra
// y con el route podemos obtener los valores que se pasan a
// traves de la ruta

export const ProductScreen = ({ navigation, route }: Props) => {

    const { id = '', name = '' } = route.params;

    const [tempUri, setTempUri] = useState<string>();

    const { categories } = useCategories();

    const { loadProductById, addProduct, updateProduct, uploadImage } = useContext(ProductsContext);


    const { _id, categoriaId, nombre, img, form, onChange, setFormValue } = useForm({
        _id: id,
        categoriaId: '',
        nombre: name,
        img: ''
    });


    useEffect(() => {
        navigation.setOptions({
            title: (nombre) ? nombre : 'Sin Nombre del Producto'
        })
    }, [nombre]);


    useEffect(() => {
        loadProduct()
    }, []);



    const loadProduct = async () => {
        if (id.length === 0) return;
        const producto = await loadProductById(id)
        setFormValue({
            _id: id,
            categoriaId: producto.categoria._id,
            img: producto.img || '',
            nombre
        })
    };


    const saveOrUpdate = async () => {
        if (id.length > 0) {
            updateProduct(categoriaId, nombre, id);
        } else {
            const tempCategoriaId = categoriaId || categories[0]._id;
            const newproduct = await addProduct(tempCategoriaId, nombre);
            onChange(newproduct._id, '_id');

        }
    }


    const takePhoto = () => {
        launchCamera({
            mediaType: 'photo',
            quality: 0.5
        }, (resp) => {
            if (resp.didCancel) return;
            if (!resp.uri) return;

            setTempUri(resp.uri);
            uploadImage(resp, _id);
        });

    }
    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.label}>Nombre del Producto</Text>
                <TextInput
                    placeholder="Producto"
                    style={styles.textInput}
                    value={nombre}
                    onChangeText={(value) => onChange(value, 'nombre')}
                />

                {/* Picker o Selector */}
                <Text style={styles.label}>Categoria</Text>

                <Picker
                    selectedValue={categoriaId}
                    onValueChange={(itemValue) =>
                        onChange(itemValue, 'categoriaId')
                    }>
                    {!categoriaId && nombre !== ''
                        ? <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        >
                            <ActivityIndicator
                                size={40}
                                color={'black'}
                            />
                        </View>
                        :
                        categories.map((item: any) => (
                            <Picker.Item label={item.nombre} value={item._id} key={item._id} />
                        ))
                    }
                </Picker>

                <Button
                    title="Guardar"

                    onPress={saveOrUpdate}
                    color="#5856D6"

                />

                {
                    (_id.length > 0) && (
                        <View style={styles.buttonsView}>

                            <Button
                                title="Camara"

                                onPress={takePhoto}
                                color="#5856D6"
                            />

                            <View style={{ width: 10 }} />
                            <Button
                                title="Galeria"

                                onPress={() => { }}
                                color="#5856D6"
                            />
                        </View>
                    )
                }


                {
                    (img.length > 0 && !tempUri) && (
                        <Image
                            source={{ uri: img }}
                            style={{
                                marginTop: 20,
                                width: '100%',
                                height: 300
                            }}
                        />
                    )
                }

                {/* Mostrar Imagen Temporal */}

                {
                    (tempUri) && (
                        <Image
                            source={{ uri: tempUri }}
                            style={{
                                marginTop: 20,
                                width: '100%',
                                height: 300
                            }}
                        />
                    )
                }


            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 20
    },
    label: {
        fontSize: 18
    },
    textInput: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderColor: 'rgba(0,0,0,0.2)',
        height: 45,
        marginTop: 5,
        marginBottom: 10
    },
    buttonsView: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    }
});

