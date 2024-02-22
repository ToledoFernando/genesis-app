import { Button, TextField } from '@mui/material'
import { sendData } from '@renderer/helpers/sendData'
import { ChangeEventHandler, useState } from 'react'
import toast from 'react-hot-toast'
import {useNavigate} from "react-router-dom"
import Store from "../../store"

const initialState = {
  name: '',
  lastName: '',
  phone: ""
}

function Index() {
  const [formData, setFormData] = useState(initialState)
  const navigate = useNavigate();

  const store = Store.General.getState()

  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async () => {
    const response = await sendData("create_personal", formData)
    if (response.success) {
      toast.success("Personal creado con exito")
      store.getPersonal()
      navigate("/personal")
    }else {
      toast.error(response.error as string)
    }
  }

  const handleCancel = () => {
    navigate("/")
  }

  return (
    <div className="pr-4 flex justify-center items-center h-screen">
      <div className='lg:w-5/12 md:w-7/12 w-10/12 mx-auto bg-white py-4 px-8'>
      <h1 className="text-2xl font-semibold pb-5">Agregar de Personal</h1>
      <div className="flex flex-col mx-auto gap-4 mb-4">
        <TextField onChange={handleChange} className='bg-white' name="name" label="Nombre" />
        <TextField onChange={handleChange} className='bg-white' name="lastName" label="Apellido" />
        <TextField onChange={handleChange} className='bg-white' name="phone" label="Celular" />
      </div>
      <div className="flex gap-8 mt-6 justify-end w-full">
        <Button onClick={handleCancel}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>Crear</Button>
      </div>
      </div>
    </div>
  )
}

export default Index
