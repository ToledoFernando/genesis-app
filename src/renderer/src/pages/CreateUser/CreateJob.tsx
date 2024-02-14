import { Button, TextField } from "@mui/material"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import toast from "react-hot-toast";
import { useState } from "react";
import { IJob } from "./type";
import { sendData } from "../../helpers/sendData";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function CreateJob({id}:{ id: string}) {
  const [data, setData] = useState<IJob>({job: "", observation: "", date: new Date()})
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({...data, [e.target.name]: e.target.value})
  }

  const handleSubmit = async () => {
    const response = await sendData("create-job", {...data, id})
    if (response.success) {
      navigate("/")
      return toast.success("Trabajo agregado con exito" as string)
    }
    return toast.error(response.error as string)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="pb-10 mt-10 pt-4 h-full overflow-auto scroll-act pr-4">
        <div className="flex flex-col justify-between gap-8">
          <form className="flex flex-col gap-4 w-8/12 mx-auto">
            <div className="grid grid-cols-1 gap-8">
            <TextField onChange={handleChange} name="job" className="bg-white" label="Trabajo" variant="outlined" />
            <DateTimePicker onChange={({$d}: any)=> setData({...data, date: $d})} name="date" className="bg-white" label="Fecha" />

            {/* <TextField multiline={true} rows={4} onChange={handleChange} name="observation" className="bg-white" label="Observación" variant="outlined" /> */}
            <ReactQuill className='bg-white h-max' style={{height: 200}} onChange={(e) => setData({...data, observation: e as string})} />

            </div>
            <div className="flex gap-4 justify-between mt-10">
            <Button LinkComponent={"a"} href="/" >Inicio</Button>
            <Button variant="contained" onClick={handleSubmit} >Guardar</Button>
            </div>
          </form>
        </div>
      </div>
    </LocalizationProvider>      
  )
}

export default CreateJob