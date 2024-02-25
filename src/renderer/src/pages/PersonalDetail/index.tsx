import { sendData } from '@renderer/helpers/sendData'
import { IPersonal } from '@renderer/store/general/types'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IJobs } from '../AllHistories/types'
import { formatName, formatToMoney } from '@renderer/helpers/format'
import { formatTime } from '@renderer/helpers/time'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip
} from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import { gridLocaleText } from '@renderer/config'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  DateCalendar,
  LocalizationProvider
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

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

const columnsPerformans: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    headerAlign: 'center',
    width: 60
  },
  {
    field: 'job',
    headerName: 'Trabajo',
    headerAlign: 'center',
    width: 150
  },
  {
    field: 'price',
    headerName: 'Precio',
    headerAlign: 'center',
    align: 'center',
    width: 150,
    valueFormatter: (params) => formatToMoney(params.value?.toString() || '0')
  },
  {
    field: 'performans',
    headerName: 'Rendimiento',
    headerAlign: 'center',
    align: 'center',
    width: 150,
    valueFormatter: (params) => formatToMoney(params.value?.toString() || '0'),
    renderCell: (params) => {
      return <Chip variant="outlined" color="success" className='font-bold bg-green-50' label={params.formattedValue} />
    }
  },
  {
    field: "performansNumber",
    headerName: "Porcentaje",
    renderCell: (params) => {
      return <Chip variant="outlined" color="error" className='font-bold bg-red-50' label={`${params.value || 0}%`} />
    }
  }
]

function generateColor() {
  const letrasHex = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letrasHex[Math.floor(Math.random() * 16)]
  }
  return color
}

function index() {
  const [personal, setPersonal] = useState<IPersonal | null>(null)
  const [rowSelected, setRowSelected] = useState<string[]>([])
  const [colors, setColors] = useState({ color1: '', color2: '' })
  const [jobs, setJobs] = useState<IJobs[]>([])
  const [jobsAux, setJobsAux] = useState<IJobs[]>([])
  const [showDetail, setShowDetail] = useState<IJobs | null>(null)
  const [openShowDetail, setOpenShowDetail] = useState<boolean>(false)
  const [showCalendarfilter, setShowFilterCalendar] = useState<boolean>(false)
  const [desde, setDesde] = useState<number>(0)
  const [hasta, setHasta] = useState<number>(0)
  const [filter, setFilter] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [jobsPerformans, setJobsPerformans] = useState<IJobs[]>([])
  const [performans, setPerformans] = useState<number>(0)
  const [totalPerformans, setTotalPerformans] = useState<number>(0)
  const { id } = useParams()

  const getData = async () => {
    const personalData = await sendData('get-personal', id)
    const jobsData = await sendData('get-jobs-by-personal', id)
    if (personalData.success) setPersonal(personalData.data)
    if (jobsData.success) {
      setJobs(jobsData.data)
      setJobsAux(jobsData.data)
    }
  }

  useEffect(() => {
    getData()
    setColors({
      color1: generateColor(),
      color2: generateColor()
    })
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 60,
      width: 60
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
            dangerouslySetInnerHTML={{
              __html: params.row.observation.replace(/<h[1-6]>(.*?)<\/h[1-6]>/g, '<p>$1</p>')
            }}
            className="truncate h-2/6"
          ></div>
        )
      }
    },
    {
      field: 'price',
      headerName: 'Precio',
      minWidth: 100,
      valueFormatter: (params) => formatToMoney(params.value.toString())
    },
    {
      field: 'createdAt',
      headerName: 'Fecha',
      type: 'number',
      minWidth: 100,
      width: 100,
      maxWidth: 200,
      sortComparator: (a, b) => (a < b ? -1 : 1),
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
      width: 200,
      maxWidth: 200,
      align: 'center',
      renderCell: (params) => {
        return (
          <>
            <IconButton onClick={() => setShowDetail(params.row)}>
              <InfoIcon />
            </IconButton>
            <IconButton className="group">
              <DeleteIcon className="group-hover:text-red-500" />
            </IconButton>
          </>
        )
      }
    }
  ]

  const applyFilter = () => {
    const newJobs = jobsAux.filter((job) => job.createdAt >= desde && job.createdAt <= hasta)
    setJobs(newJobs)
    setFilter(true)
    setShowFilterCalendar(false)
  }

  const cancelFilter = () => {
    setJobs(jobsAux)
    setShowFilterCalendar(false)
    setFilter(false)
  }

  useEffect(() => {
    setTotalPerformans(0);
    let jobsSelected = jobsAux.filter((item) => rowSelected.includes(item.id))
    jobsSelected = jobsSelected.map((item) => {
      const thisPerformans = (Number(item.price) * performans) / 100;
      setTotalPerformans((state) => state + thisPerformans)
      return {
        ...item,
        price: item.price,
        performans: thisPerformans,
        performansNumber: performans
      }
    })
    setJobsPerformans(jobsSelected)
  }, [rowSelected])

  useEffect(() => {
    setTotalPerformans(0)
    const newData = jobsPerformans.map((item) => {
      const thisPerformans = (Number(item.price) * performans) / 100;
      console.log(thisPerformans)
      setTotalPerformans((state) => state + thisPerformans)
      return {
        ...item,
        performans: thisPerformans,
        performansNumber: performans
      }
    })
    setJobsPerformans(newData)
  }, [performans])

  const handleChangePerformans = (e: any) => {
    const p = Number(e.target.value || "0");
    if (isNaN(p)) return;
    if (p < 0 || p > 99) return;
    setPerformans(p)
  }

  return (
    personal && (
      <>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="pr-4 pt-4">
            <div
              className="relative mb-28 w-full rounded-md h-[200px]"
              style={{
                backgroundImage: `linear-gradient(to top left, ${colors.color1}, ${colors.color2})`
              }}
            >
              <div
                className="flex items-center justify-center text-5xl font-bold absolute w-[160px] -bottom-20 left-12 h-[160px] rounded-full border-[10px] border-gray-100"
                style={{ background: stringToColor(personal.name + personal.lastName) }}
              >
                <span className="invert">
                  {personal.name.charAt(0).toLocaleUpperCase() +
                    '' +
                    personal.lastName.charAt(0).toLocaleUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-start gap-4">
              <div className="w-[22%] sticky top-6 flex flex-col gap-2 bg-white shadow-sm rounded-sm py-4 px-2">
                <h4 className="font-semibold">
                  {formatName(personal.name)} {formatName(personal.lastName)}
                </h4>
                <p>
                  Celular: <b>{personal.phono}</b>
                </p>
                <p>
                  Fecha de registro: <b>{formatTime(personal.createdAt).fecha}</b>
                </p>
                {personal.updatedAt && (
                  <p>
                    Ultima actualización: <b>{personal.updatedAt}</b>
                  </p>
                )}
                <div className="flex flex-col mt-4 gap-4 items-center">
                  <Tooltip
                    title={
                      rowSelected.length === 0
                        ? 'Seleccione los trabajos para obtener el rendimiento'
                        : `Obtener rendimiento de ${rowSelected} trabajos`
                    }
                  >
                    <div>
                      <Button
                        onClick={() => setOpen(true)}
                        variant="contained"
                        disabled={rowSelected.length === 0}
                      >
                        Rendicion
                      </Button>
                    </div>
                  </Tooltip>
                </div>
              </div>
              <div className="w-[78%] flex justify-between gap-4 ">
                <div className="mx-auto w-[70%]">
                  <h2 className="font-semibold mb-2">Trabajos Realizados</h2>
                  <div className="mb-4 flex items-center gap-4">
                    <Button
                      variant="contained"
                      onClick={() => setShowFilterCalendar(!showCalendarfilter)}
                    >
                      Filtro por Fecha
                    </Button>
                    <Button disabled={!filter} onClick={cancelFilter}>
                      Quitar Filtro
                    </Button>
                  </div>
                  <div
                    className="bg-white px-2 overflow-hidden"
                    style={{
                      height: showCalendarfilter ? 'max-content' : 0,
                      marginBottom: showCalendarfilter ? '1rem' : 0
                    }}
                  >
                    <div className="flex justify-around gap-4">
                      <div>
                        <p>Desde</p>
                        <DateCalendar
                          onChange={({ $d }: any) => setDesde(Math.floor(new Date($d).getTime()))}
                        />
                      </div>
                      <div>
                        <p>Hasta</p>
                        <DateCalendar
                          onChange={({ $d }: any) => setHasta(new Date($d).setHours(23, 59, 59))}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between px-4 pb-4">
                      <Button onClick={() => setShowFilterCalendar(false)}>Cancelar</Button>
                      <Button
                        variant="contained"
                        disabled={desde === 0 || hasta === 0}
                        onClick={applyFilter}
                      >
                        Filtrar
                      </Button>
                    </div>
                  </div>
                  <DataGrid
                    className="w-max max-w-full h-max bg-white sticky top-0 scroll-act"
                    rows={jobs}
                    columns={columns}
                    autoHeight
                    hideFooter
                    checkboxSelection
                    isRowSelectable={() => true}
                    localeText={gridLocaleText}
                    onRowSelectionModelChange={(e: any) => setRowSelected(e)}
                  />
                </div>
                <div className="w-[30%] sticky max-h-[400px] h-max top-10 p-3 bg-white rounded-md shadow-md flex justify-center">
                  {!showDetail ? (
                    <div className="flex flex-col items-center gap-4 py-6 px-2 text-center text-gray-500 justify-center">
                      <InfoIcon />
                      <p>Seleccione un trabajo para ver los detalles</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-full pt-2 flex flex-col">
                        <h3 className="text-xl h-1/6 text-center flex items-center justify-center">
                          <b>{showDetail.job}</b>
                        </h3>
                        <div
                          className="w-full px-3 h-[150px] overflow-auto"
                          dangerouslySetInnerHTML={{
                            __html: showDetail.observation
                          }}
                        ></div>
                        <div className="mt-5 h-1/6 items-center flex gap-2 flex-col mb-6">
                          <Button className="w-full" onClick={() => setShowDetail(null)}>
                            Cerrar
                          </Button>
                          <Button
                            className="w-full"
                            variant="contained"
                            onClick={() => setOpenShowDetail(true)}
                          >
                            Pantalla completa
                          </Button>
                        </div>
                        <p className="pt-2">Fecha: {formatTime(showDetail.createdAt).fecha}</p>
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
                          <hr className="mt-4" />
                          <div className="flex flex-col gap-2 my-2 mt-4">
                            <p>
                              Precio del trabajo:{' '}
                              <b>{formatToMoney(showDetail.price.toString())}</b>
                            </p>
                          </div>
                        </DialogContent>
                        <DialogActions>
                          <Tooltip className="mr-4" title={formatTime(showDetail.createdAt).Hora}>
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
          </div>
        </LocalizationProvider>
        <Dialog fullWidth maxWidth="md" open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Rendicion de los trabajos</DialogTitle>
          <DialogContent>
            <div className="flex items-center mb-4 gap-4">
              <div className="flex items-center">
                <TextField
                  className="w-[50px]"
                  value={performans}
                  onChange={handleChangePerformans}
                  size="small"
                />
                <p className="text-3xl font-semibold">%</p>
              </div>
              <p className="text-2xl">Porcentaje del rendimiento.</p>
            </div>
            <DataGrid localeText={gridLocaleText} className='w-max mx-auto' rows={jobsPerformans} columns={columnsPerformans} hideFooter />
            <p className='mt-4'>Rendimiento total: <b>{formatToMoney(totalPerformans.toString())}</b></p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  )
}

export default index
