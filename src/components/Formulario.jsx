import React from 'react'
import { Formik, Form, Field } from 'formik'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import Alerta from './Alerta'
import Spinner from './Spinner'

const Formulario = ({cliente, cargando}) => {

    const navigate = useNavigate();

    const nuevoClienteSchema = Yup.object().shape( {
        nombre: Yup.string()
                    .min(3, "El Nombre es muy corto")
                    .max(20, "El nombre es muy largo")
                    .required("El Nombre del Cliente es obligatorio"),
    
        empresa: Yup.string()
                    .required("El Nombre de Empresa es obligatorio"),
        email: Yup.string()
                    .required("El Email es obligaorio")
                    .email("El Email no es válido"),
        telefono: Yup.number()
                    .integer("Número no válido")
                    .positive("Número no válido")
                    .typeError("El número no es válido")                                        
    })

    const handleSubmit = async (valores) => {
        try {

            let respuesta
            if (cliente.id) {
                //Editar un Registro
                const url = `http://localhost:4000/clientes/${cliente.id}`
                respuesta = await fetch(url, {
                    method: "PUT",
                    body: JSON.stringify(valores),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })             
            } else {
                //Nuevo Registro
                const url = "http://localhost:4000/clientes"
                respuesta = await fetch(url, {
                    method: "POST",
                    body: JSON.stringify(valores),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
            }

            respuesta.json()
            navigate("/clientes")            

        } catch (error) {
            console.log(error)
        }
    }

  return (
    cargando ? <Spinner/> : (

        <div className='bg-white mt-10 px-5 py-10 rounded-md shadow-md md:w-3/4 mx-auto'>
            <h1 className='text-gray-600 font-bold text-xl uppercase text-center '>{cliente.nombre ? "Editar Cliente" : "Agregar cliente" }</h1>
            
            <Formik
                initialValues={ {
                    nombre: cliente?.nombre ?? "",
                    empresa: cliente?.empresa ?? "",
                    email: cliente?.email ?? "",
                    telefono: cliente?.telefono ?? "",
                    notas: cliente?.notas ?? "",
                }}
                enableReinitialize={true}
                onSubmit={ async (values, {resetForm}) => {
                    await handleSubmit(values)
                    resetForm();
                }}
                validationSchema={nuevoClienteSchema}
            >
                { ({errors, touched}) => { 
                    return (
                        <Form>
                            <div className="mb-4">
                                <label 
                                    className="text-gray-800"
                                    htmlFor="nombre"
                                >Nombre:</label>
                                <Field 
                                    id="nombre"
                                    type="text"    
                                    className="mt-2 block w-full p-3 bg-gray-50 shadow"
                                    placeholder="Nombre del Cliente"
                                    name="nombre"
                                />
                                {errors.nombre && touched.nombre ? (
                                    <Alerta>
                                        {errors.nombre}
                                    </Alerta>
                                ) : null }
                            </div>
                            <div className="mb-4">
                                <label 
                                    className="text-gray-800"
                                    htmlFor="empresa"
                                >Empresa:</label>
                                <Field 
                                    id="empresa"
                                    type="text"    
                                    className="mt-2 block w-full p-3 bg-gray-50 shadow"
                                    placeholder="Empresa del Cliente"
                                    name="empresa"
                                />
                                {errors.empresa && touched.empresa ? (
                                    <Alerta>
                                        {errors.empresa}
                                    </Alerta>
                                ) : null }                            
                            </div> 
                            <div className="mb-4">
                                <label 
                                    className="text-gray-800"
                                    htmlFor="email"
                                >Email:</label>
                                <Field 
                                    id="email"
                                    type="email"    
                                    className="mt-2 block w-full p-3 bg-gray-50 shadow"
                                    placeholder="Email del Cliente"
                                    name="email"
                                />
                                {errors.email && touched.email ? (
                                    <Alerta>
                                        {errors.email}
                                    </Alerta>
                                ) : null }                            
                            </div>      
                            <div className="mb-4">
                                <label 
                                    className="text-gray-800"
                                    htmlFor="telefono"
                                >Teléfono:</label>
                                <Field 
                                    id="telefono"
                                    type="tel"    
                                    className="mt-2 block w-full p-3 bg-gray-50 shadow"
                                    placeholder="Teléfono del Cliente"
                                    name="telefono"
                                />
                                {errors.telefono && touched.telefono ? (
                                    <Alerta>
                                        {errors.telefono}
                                    </Alerta>
                                ) : null }
                            </div>    
                            <div className="mb-4">
                                <label 
                                    className="text-gray-800"
                                    htmlFor="notas"
                                >Notas:</label>
                                <Field 
                                    as="textarea"
                                    id="notas"
                                    type="text"    
                                    className="mt-2 block w-full p-3 bg-gray-50 shadow h-40"
                                    placeholder="Notas del Cliente"
                                    name="notas"
                                />
                            </div>
                            <input 
                                type="submit"
                                value={cliente.nombre ? "Actualizar Cliente" : "Agregar cliente" }
                                className="mt-5 w-full bg-blue-800 p-3 text-white uppercase font-bold cur hover:bg-blue-700 cursor-pointer"
                            />                                                                                
                        </Form>
                    )
                }}            
            </Formik>
        </div>
    )
  )
}
Formulario.defaultProps = {
    cliente: {},
    cargando: false
}
export default Formulario