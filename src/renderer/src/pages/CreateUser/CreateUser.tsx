import { Backdrop, Button, CircularProgress, TextField } from "@mui/material"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import toast from "react-hot-toast";
import { Dispatch, SetStateAction, useState } from "react";
import { IDataClient, initialState } from "./type";
import { sendData } from "../../helpers/sendData";

function CreateUser({set, setID}:{set: Dispatch<SetStateAction<number>>, setID: Dispatch<SetStateAction<string>>}) {
  const [data, setData] = useState<IDataClient>(initialState)
  const [isLoad, setIsLoad] = useState<boolean>(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({...data, [e.target.name]: e.target.value})
  }

  const saveData = async () => {
    setIsLoad(true)
    const response = await sendData("create-user", data)
    console.log(response)
    if (!response.success) return toast.error(response.error as string)
    setID(response.data as string)
    set(1)
    setIsLoad(false)
    return toast.success("Registro creado correctamente")
  }

  const validateData = () => {
    if (data.name.length == 0) return toast.error("El nombre es obligatorio")
    if (data.lastName.length == 0) return toast.error("El apellido es obligatorio")
    return saveData();
  }

  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="pb-10 mt-10 pt-4 h-full overflow-auto scroll-act pr-4">
        <div className="flex flex-col justify-between gap-8">
          <form className="flex flex-col gap-4 w-8/12 mx-auto">
            <div className="grid grid-cols-1 gap-8">
            <TextField onChange={handleChange} name="name" className="bg-white" label="Primer Nombre" variant="outlined" />
            <TextField onChange={handleChange} name="lastName" className="bg-white" label="Apellido" variant="outlined" />
            </div>
            <div className="flex flex-col gap-8">
              <TextField onChange={handleChange} name="phono" className="bg-white" label="Numero de celular (opcional)" variant="outlined" />
              <TextField onChange={handleChange} label="Apodo (opcional)" name="nickname" className="bg-white" />
            </div>
            <div className="flex gap-4 justify-between mt-10">
            <Button LinkComponent={"a"} href="/" >Cancelar</Button>
            <Button variant="contained" onClick={()=>validateData()} >Guardar</Button>
            </div>
          </form>
        </div>
      </div>
    </LocalizationProvider>
    <Backdrop
      sx={{ color: (theme) => theme.palette.primary.main, zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isLoad}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
</>
  )
}

export default CreateUser