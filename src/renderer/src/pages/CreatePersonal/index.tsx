import { Button, TextField } from '@mui/material'
import { ChangeEventHandler, useState } from 'react'
import {useNavigate} from "react-router-dom"

const initialState = {
  name: '',
  lastName: '',
  phone: ""
}

function Index() {
  const [formData, setFormData] = useState(initialState)
  const navigate = useNavigate();

  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async () => {
    const response = await window.electron.ipcRenderer.invoke("create_personal", formData)
    console.log(response)
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
