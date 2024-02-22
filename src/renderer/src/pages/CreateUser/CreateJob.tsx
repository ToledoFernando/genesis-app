import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { IJob } from './type'
import { sendData } from '../../helpers/sendData'
import { DateTimePicker } from '@mui/x-date-pickers'
import { useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill'
import Store from '../../store'
import 'react-quill/dist/quill.snow.css'

function CreateJob({ id }: { id: string }) {
  const [data, setData] = useState<IJob>({ job: '', observation: '', date: new Date(), personal_id: "", price: "" })
  const [personalSelected, setpersonalSelected] = useState<string>('')
  const navigate = useNavigate()

  const generalStore = Store.General.getState()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    const response = await sendData('create-job', { ...data, id })
    if (response.success) {
      navigate('/')
      return toast.success('Trabajo agregado con exito' as string)
    }
    return toast.error(response.error as string)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="pb-10 mt-10 pt-4 h-full overflow-auto scroll-act pr-4">
        <div className="flex flex-col justify-between gap-8">
          <form className="flex flex-col gap-4 w-8/12 mx-auto">
            <div className="grid grid-cols-1 gap-8">
              <TextField
                onChange={handleChange}
                name="job"
                className="bg-white"
                label="Trabajo"
                variant="outlined"
              />
              <DateTimePicker
                onChange={({ $d }: any) => setData({ ...data, date: $d })}
                name="date"
                className="bg-white"
                label="Fecha"
              />

              <ReactQuill
                className="bg-white h-max"
                style={{ height: 200 }}
                onChange={(e) => setData({ ...data, observation: e as string })}
              />

              <div className='grid grid-cols-2 gap-8'>
              <FormControl>
                <InputLabel id="demo-simple-select-label">Selecciona un personal</InputLabel>
                <Select
                  className='bg-white'
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  onChange={(e) => setData({...data, personal_id: e.target.value})}
                  value={data.personal_id}
                  label="Selecciona un personal"
                >
                  {generalStore.personal.map((item, index) => (
                    <MenuItem key={index} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField value={data.price} onChange={(e) => setData({...data, price:e.target.value})} type='number' label='Precio del trabajo (sin puntos ni simbolos). Ej: 2300' className='bg-white' />
              </div>
            </div>
            <div className="flex gap-4 justify-between mt-10">
              <Button LinkComponent={'a'} href="/">
                Inicio
              </Button>
              <Button variant="contained" onClick={handleSubmit}>
                Guardar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </LocalizationProvider>
  )
}

export default CreateJob
