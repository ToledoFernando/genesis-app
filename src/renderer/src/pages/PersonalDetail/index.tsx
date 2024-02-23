import { sendData } from '@renderer/helpers/sendData'
import { IPersonal } from '@renderer/store/general/types'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IJobs } from '../AllHistories/types'
import { formatName, formatToMoney } from '@renderer/helpers/format'
import { formatTime } from '@renderer/helpers/time'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import { gridLocaleText } from '@renderer/config'

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
  const [colors, setColors] = useState({ color1: '', color2: '' })
  const [jobs, setJobs] = useState<IJobs[]>([])
  const [showDetail, setShowDetail] = useState<IJobs | null>(null)
  const [openShowDetail, setOpenShowDetail] = useState<boolean>(false)
  const { id } = useParams()

  const getData = async () => {
    const personalData = await sendData('get-personal', id)
    const jobsData = await sendData('get-jobs-by-personal', id)
    if (personalData.success) setPersonal(personalData.data)
    if (jobsData.success) setJobs(jobsData.data)
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
      type: "number",
      minWidth: 100,
      width: 100,
      maxWidth: 200,
      sortComparator: (a, b) => a < b ? -1 : 1,
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

  return (
    personal && (
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
        <div className='flex justify-between items-start gap-4'>
          <div className='w-[22%] sticky top-6 flex flex-col gap-2 bg-white shadow-sm rounded-sm py-4 px-2'>
            <h4 className='font-semibold'>{formatName(personal.name)} {formatName(personal.lastName)}</h4>
            <p>Celular: <b>{personal.phono}</b></p>
            <p>Fecha de registro: <b>{formatTime(personal.createdAt).fecha}</b></p>
            {personal.updatedAt && <p>Ultima actualización: <b>{personal.updatedAt}</b></p>}
          </div>
          <div className='w-[78%] flex justify-between gap-4 '>
          <DataGrid
              className="w-max max-w-full h-max bg-white sticky top-0 scroll-act"
              rows={[
                ...jobs,
              ]}
              columns={columns}
              autoHeight
              hideFooter
              disableRowSelectionOnClick
              disableDensitySelector
              isRowSelectable={() => false}
              localeText={gridLocaleText}
            />
            <div className="w-3/12 sticky max-h-[400px] h-max top-10 p-3 bg-white rounded-md shadow-md flex justify-center">
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
                    <Button className='w-full' onClick={() => setShowDetail(null)}>Cerrar</Button>
                    <Button className='w-full' variant="contained" onClick={() => setOpenShowDetail(true)}>
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
                    <hr className='mt-4' />
                    <div className='flex flex-col gap-2 my-2 mt-4'>
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
      </div>
    )
  )
}

export default index
