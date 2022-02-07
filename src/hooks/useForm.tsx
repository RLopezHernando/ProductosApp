import { useState } from 'react';

export const useForm = <T extends Object>(initState: T) => {

    const [state, setState] = useState(initState);


    //Mantemos los valores anteriores con el state y solo utilizamos 
    // los valores nuevos del formulario
    //Mantenemos el estado anterior y le colocamos los datos nuevos
    // Si por ejemplo dejamos el ...state sobreescribimos todos los datos
    // cambien o no. Esto es menos eficiente por esta razo se tienen en cuenta
    // los datos nuevos ...form . De hecho solo con el form bastaria

    const setFormValue = (form: T) => {
        setState(form);
        //Si en vez de el form utilizamos este objeto seria mas eficiente
        // {
        //     ...state,
        //     ...form
        // }
    }

    const onChange = (value: string, field: keyof T) => {
        setState({
            ...state,
            [field]: value
        });
    }

    return {
        ...state,
        form: state,
        onChange,
        setFormValue
    }

}
