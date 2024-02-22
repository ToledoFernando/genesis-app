import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { gridLocaleText } from '@renderer/config'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IDataClients, IJobs } from '../AllHistories/types'
import { sendData } from '@renderer/helpers/sendData'
import { formatTime } from '@renderer/helpers/time'
import InfoIcon from '@mui/icons-material/Info'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast'
import { formatToMoney } from '@renderer/helpers/format'

function stringToColor(string: string) {
  let hash = 0
  let i: number
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }

  return color
}

const formatName = (name: string) => {
  const palabras = name.split(' ')
  const palabrasCapitalizadas = palabras.map(
    (palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
  )
  const nombreFormateado = palabrasCapitalizadas.join(' ')
  return nombreFormateado
}

const InicialJob: IJobs = {
  clients_id: "",
  createdAt: Math.floor(new Date().getTime()),
  job: "",
  observation: "",
  id: "",
  updatedAt: Math.floor(new Date().getTime()),
  personal_id: "",
  personalLastName: "",
  personalName: "",
  price: 0
}

function Index() {
  const [job, setJob] = useState<IJobs>(InicialJob)
  const [isLoad, setIsLoad] = useState<boolean>(false)
  const { id } = useParams()
  const [data, setData] = useState<IDataClients>()
  const [jobs, setJobs] = useState<IJobs[]>([])
  const [showDetail, setShowDetail] = useState<IJobs | null>(null)
  const [colors, setColors] = useState<{ color1: string; color2: string }>({
    color1: '',
    color2: ''
  })
  const [openShowDetail, setOpenShowDetail] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)

  function generateColor() {
    const letrasHex = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letrasHex[Math.floor(Math.random() * 16)]
    }
    return color
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 60,
      width: 60,
    },
    {
      field: 'job',
      headerName: 'Trabajo',
      minWidth: 100,
      width: 150,
      maxWidth: 200
    },
    {
      field: 'observation',
      headerName: 'Observación',
      minWidth: 100,
      width: 150,
      maxWidth: 250,
      renderCell: (params) => {
        return (
          <div
            dangerouslySetInnerHTML={{ __html: params.row.observation.replace(/<h[1-6]>(.*?)<\/h[1-6]>/g, '<p>$1</p>') }}
            className="truncate h-2/6"
          ></div>
        )
      }
    },
    {
      field: "price",
      headerName: "Precio",
      minWidth: 100,
      valueFormatter: (params) => formatToMoney(params.value.toString())
    },
    {
      field: 'createdAt',
      headerName: 'Fecha',
      minWidth: 100,
      width: 100,
      maxWidth: 200,
      renderCell: (params) => {
        return (
          <Tooltip title={formatTime(params.row.createdAt).Hora}>
            <span>{formatTime(params.row.createdAt).fecha}</span>
          </Tooltip>
        )
      }
    },
    {
      field: 'action',
      headerName: 'Acción',
      headerAlign: 'center',
      minWidth: 100,
      width: 100,
      maxWidth: 200,
      align: 'center',
      renderCell: (params) => {
        return (
          <IconButton onClick={() => setShowDetail(params.row)}>
            <InfoIcon />
          </IconButton>
        )
      }
    }
  ]

  const getAllData = async () => {
    const jobsResponse = await sendData('get-jobs', id)
    const userResponse = await sendData('get-user', id)
    if (jobsResponse.success) setJobs(jobsResponse.data)
    if (userResponse.success) setData(userResponse.data)
  }

  useEffect(() => {
    getAllData()
    setColors({
      color1: generateColor(),
      color2: generateColor()
    })
  }, [])

  const handleSubmit = async () => {
    if (job.job.length === 0) return toast.error("El campo 'Trabajo' no debe estar vacío")
    const body: any = {
      ...job,
      id: id as string,
      date: job.createdAt
    }
    setIsLoad(true)
    const response = await sendData('create-job', body)
    if (response.success) {
      setShowForm(false);
      toast.success("Trabajo agregado con exito")
      const jobsResponse = await sendData('get-jobs', id)
      if (jobsResponse.success) setJobs(jobsResponse.data)
    }
  setJob(InicialJob)
    return setIsLoad(false)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="pr-4 py-4 relative">
        <div
          className="relative mb-28 w-full rounded-md h-[230px]"
          style={{
            backgroundImage: `linear-gradient(to top left, ${colors.color1}, ${colors.color2})`
          }}
        >
          <div
            className="flex items-center justify-center text-5xl font-bold absolute w-[160px] -bottom-20 left-12 h-[160px] rounded-full border-[10px] border-gray-100"
            style={{ background: stringToColor((data?.name || '') + (data?.lastName || '')) }}
          >
            <span className="invert">
              {data?.name?.charAt(0).toLocaleUpperCase() +
                '' +
                data?.lastName?.charAt(0).toLocaleUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex gap-8">
          <div className="w-2/12 pr-2 flex flex-col sticky top-10 gap-4 border-r-2 h-max border-black">
            <ul className="flex text-sm flex-col gap-2">
              <li>
                Nombre:{' '}
                <b>
                  {formatName(data?.name || '')} {formatName(data?.lastName || '')}
                </b>
              </li>
              <li>
                Celular: <b>{data?.phono}</b>
              </li>
              <li>
                Total de Turnos: <b>{data?.total_jobs} Turnos</b>
              </li>
              <li>
                Ultimo Turno:{' '}
                <b>{formatTime(data?.last_job || Math.floor(new Date().getTime())).fecha}</b>
              </li>
              <li className="flex justify-center mt-4">
                <Button variant="contained" onClick={()=>setShowForm(true)} className="px-0 w-full" size="small">
                  Agregar Trabajo
                </Button>
              </li>
            </ul>
          </div>
          <div className="w-7/12">
            <DataGrid
              className="w-full h-max bg-white sticky top-0 scroll-act"
              rows={jobs}
              columns={columns}
              autoHeight
              hideFooter
              disableRowSelectionOnClick
              disableDensitySelector
              isRowSelectable={() => false}
              localeText={gridLocaleText}
            />
          </div>
          <div className="w-3/12 sticky max-h-[400px] h-max top-10 bg-white rounded-md shadow-md flex justify-center">
            {!showDetail ? (
              <div className="flex flex-col items-center gap-4 py-6 px-2 text-center text-gray-500 justify-center">
                <InfoIcon />
                <p>Seleccione un trabajo para ver los detalles</p>
              </div>
            ) : (
              <>
                <div className="w-full pt-2">
                  <h3 className="text-xl h-1/6 text-center flex items-center justify-center">
                    <b>{showDetail.job}</b>
                  </h3>
                  <div
                    className="w-full px-3 h-[150px] overflow-auto"
                    dangerouslySetInnerHTML={{
                      __html: showDetail.observation
                    }}
                  ></div>
                  <div className="mt-5 h-1/6 items-center flex justify-around">
                    <Button onClick={() => setShowDetail(null)}>Cerrar</Button>
                    <Button variant="contained" onClick={() => setOpenShowDetail(true)}>
                      Pantalla completa
                    </Button>
                  </div>
                  <p className='pt-2'>Fecha: {formatTime(showDetail.createdAt).fecha}</p>
                </div>
                <Dialog
                  fullWidth
                  maxWidth="md"
                  open={openShowDetail}
                  onClose={() => setOpenShowDetail(false)}
                >
                  <DialogTitle>
                    <b>{showDetail.job}</b>
                  </DialogTitle>
                  <DialogContent>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: showDetail.observation.replaceAll('\n', '</br>')
                      }}
                    ></div>
                    <div className='flex flex-col gap-2 my-2 mt-4'>
                      <p>Personal: <b>{formatName(showDetail.personalName)} {formatName(showDetail.personalLastName)}</b></p>
                      <p>Precio del trabajo: <b>{formatToMoney(showDetail.price.toString())}</b></p>
                    </div>
                  </DialogContent>
                  <DialogActions>
                    <Tooltip className='mr-4' title={formatTime(showDetail.createdAt).Hora}>
                      <span>{formatTime(showDetail.createdAt).fecha}</span>
                    </Tooltip>
                    <Button onClick={() => setOpenShowDetail(false)} variant="contained">
                      Cerrar
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
          </div>
        </div>
      </div>
      <Dialog fullWidth maxWidth="md" open={showForm} onClose={()=>setShowForm(false)}>
        <DialogTitle><b>Agregar un trabajo nuevo</b></DialogTitle>
        <DialogContent className='flex py-2 min-h-[400px] flex-col gap-4'>
          <TextField label="Trabajo" onChange={(e) => setJob({...job, job: e.target.value})} />
          <DateTimePicker format='DD/MM/YYYY hh:mm a' className='w-max' onChange={({$d}: any) => setJob({...job, createdAt: $d})} />
          <ReactQuill className='min-h-[200px]' style={{height: 200}} value={job?.observation} onChange={(e) => setJob({...job, observation: e as string})} />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setShowForm(false)}>Cerrar</Button>
          <Button variant="contained" onClick={handleSubmit}>Guardar</Button>
        </DialogActions>
      </Dialog>
      <Backdrop open={isLoad}>
        <CircularProgress />
      </Backdrop>
    </LocalizationProvider>
 )
}

export default Index
