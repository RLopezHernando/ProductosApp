import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Background } from '../components/Background';
import { WhiteLogo } from '../components/WhiteLogo';
import { AuthContext } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { loginStyles } from '../theme/loginTheme';

//Podemos hacer la navegacion por medio del useNavigation (hook)
// o bien por medio de las properties, como es el caso. Es posible
//mediante las properties porque LoginScreen se encunetra en nuestra parte de 
// navegacion compartiendose asi un objeto comun

interface Props extends NativeStackScreenProps<any, any> { }

export const LoginScreen = ({ navigation }: Props) => {

    const { signIn, errorMessage,removeError } = useContext(AuthContext);

    //El onChange es la funcion del useForm que nos va a permitir cambiar los valores
    // del formulario

    const { email, password, onChange } = useForm({
        email: '',
        password: ''
    });


    // Cuando tenemos el ErrorMessage salta el efecto y dependiendo como venga
    // este hacemos una accion u otra
    useEffect(() => {
        if (errorMessage.length === 0) return;
        Alert.alert('Login Incorrecto', 
        errorMessage,
        [
            {
                text:'Ok',
                onPress:removeError
            }
        ]
        
        );
    }, [errorMessage]);


    const onLogin = () => {
        console.log(email, password);
        //Al tocar el boton de login se oculta el teclado
        Keyboard.dismiss();
        signIn({ correo: email, password });
    }


    return (
        <>
            <Background />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={(Platform.OS === 'ios') ? 'padding' : 'height'}
            >




                <View style={loginStyles.formContainer}>

                    <WhiteLogo />
                    <Text style={loginStyles.title}>Login</Text>
                    <Text style={loginStyles.label}>Email:</Text>
                    <TextInput
                        placeholder='Ingrese su Email'
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        keyboardType='email-address'
                        underlineColorAndroid="white"
                        style={[
                            loginStyles.inputField,
                            (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                        ]}
                        selectionColor="white"

                        onChangeText={(value) => onChange(value, 'email')}
                        value={email}
                        onSubmitEditing={onLogin}

                        autoCapitalize='none'
                        autoCorrect={false}
                    />

                    <Text style={loginStyles.label}>Contraseña:</Text>
                    <TextInput
                        placeholder='********'
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        underlineColorAndroid="white"
                        secureTextEntry={true}
                        style={[
                            loginStyles.inputField,
                            (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                        ]}
                        selectionColor="white"

                        onChangeText={(value) => onChange(value, 'password')}
                        value={password}
                        onSubmitEditing={onLogin}

                        autoCapitalize='none'
                        autoCorrect={false}
                    />

                    {/* Boton login */}

                    <View style={loginStyles.buttonContainer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={loginStyles.button}
                            onPress={onLogin}
                        >
                            <Text style={loginStyles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Crear una nueva cuenta */}

                    <View style={loginStyles.newUserContainer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation.replace('RegisterScreen')}
                        >
                            <Text style={loginStyles.buttonText}>Nueva Cuenta</Text>

                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </>
    )
};
