import { useEffect, useState } from "react";
import cafeApi from "../api/cafeApi";
import { Categoria, CategoriesResponse } from '../interfaces/appInterfaces';


export const useCategories = () => {

    //Implementando este useState podemos saber en cada momento si las categorias
    // se estan cargando o han sido cargadas
    
    const [isLoading, setIsLoading] = useState(true);

    //Partimos de un estado inicial en el que array de categorias esta vacio
    //para posteriormente cuando obtengamos las categorias mediante axios
    // rellenarlo con su set.
    const [categories, setCategories] = useState<Categoria[]>([]);

    //LLamamos las categorias por primera y unica vez
    //Es interesante ver que realizamos una funcion asincrona para obtener las 
    // categorias fuera del useEffect y luego llamamos dicha funcion
    // Esta operacion es realizada de esta manera porque el useEffect no puede ser
    // asincrono

    useEffect(() => {
        getCategories();

    }, []);

    const getCategories = async () => {
        const resp = await cafeApi.get<CategoriesResponse>('/categorias');
        setCategories(resp.data.categorias);
        setIsLoading(false);
    }

    return {
        isLoading,
        categories
    }
};
