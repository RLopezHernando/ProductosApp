import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Navigator } from './src/navigator/Navigator';
import { AuthProvider } from './src/context/AuthContext';
import { ProductsProvider } from './src/context/ProductsContext';

//Podemos tipar con { children: JSX.Element | JSX.Element[] } o simplemente haber tipado con any

//Es importante recalcar que el <AuthProvider></AuthProvider> es el que esta encima de la jerarquia
// ya que si uno no esta autenticado no podra realizar muchas de las acciones sobre los productos
const AppState = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <AuthProvider>
      <ProductsProvider>
        {children}
      </ProductsProvider>
    </AuthProvider>
  )
}
const App = () => {
  return (
    <NavigationContainer>
      <AppState>
        <Navigator />
      </AppState>
    </NavigationContainer>
  )

};

export default App;
