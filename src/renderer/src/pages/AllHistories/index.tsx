import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { gridLocaleText } from '../../config'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { sendData } from '@renderer/helpers/sendData'
import { IDataClients } from './types'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import FeedIcon from '@mui/icons-material/Feed'
import { formatTime } from '@renderer/helpers/time'
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import DateRangeIcon from '@mui/icons-material/DateRange'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { Filter } from '@renderer/store/filter'
import HelpIcon from '@mui/icons-material/Help'
import { IKey } from '@renderer/store/filter/types'
import ReplayIcon from '@mui/icons-material/Replay';
import toast from 'react-hot-toast'

const formatName = (name: string) => {
  const palabras = name.split(' ')
  const palabrasCapitalizadas = palabras.map(
    (palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
  )
  const nombreFormateado = palabrasCapitalizadas.join(' ')
  return nombreFormateado
}

function Index() {
  const [data, setData] = useState<IDataClients[]>([])
  const [dataAux, setDataAux] = useState<IDataClients[]>([])
  const [isLoad, setIsLoad] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>('')

  //
  const [filterTurn, setFilterTurn] = useState<boolean>(false)
  const [filterRegister, setFilterRegister] = useState<boolean>(false)
  const [filterQuantity, setFilterQuantity] = useState<boolean>(false)

  const [filterTurnData, setFilterTurnData] = useState<number>(0)
  const [filterRegisterData, setFilterRegisterData] = useState<number>(0)
  const [filterQuantityData, setFilterQuantityData] = useState<number>(0)

  const filterStore = Filter()
  //

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const navigate = useNavigate()

  const column: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      maxWidth: 70,
      type: 'string',
      headerAlign: 'center'
    },
    {
      field: 'name',
      editable: true,
      headerName: 'Nombre',
      flex: 1,
      minWidth: 100,
      valueFormatter: (item) => formatName(item.value)
    },
    {
      field: 'lastName',
      headerName: 'Apellido',
      minWidth: 100,
      editable: true,
      width: 180,
      maxWidth: 250,
      valueFormatter: (item) => formatName(item.value)
    },
    {
      field: 'nickName',
      headerName: 'Apodo',
      editable: true,
      minWidth: 100,
      width: 140,
      maxWidth: 250,
      valueFormatter: (item) => formatName(item.value)
    },
    {
      field: 'phono',
      headerName: 'Celular',
      minWidth: 100,
      editable: true,
      width: 160,
      maxWidth: 250,
      renderCell: (params) => {
        return (
          <p className="flex items-center gap-1">
            <WhatsAppIcon color="success" />
            <b>{params.value}</b>
          </p>
        )
      }
    },
    {
      field: 'total_jobs',
      headerName: 'Turnos total',
      headerAlign: 'center',
      align: 'center',
      cellClassName: 'font-extrabold',
      flex: 1,
      minWidth: 100,
      maxWidth: 150
    },
    {
      field: 'last_job',
      headerName: 'Último turno',
      flex: 1,
      minWidth: 200,
      valueFormatter: (item) => {
        if (item.value) {
          return new Date(item.value).toLocaleDateString()
        }
        return 'Sin turnos'
      },
      renderCell: (params) => {
        return (
          <Tooltip
            title={params.row.last_job ? formatTime(params.row.last_job).Hora : 'No hay turnos'}
          >
            <span>
              {params.row.last_job ? formatTime(params.row.last_job).fecha : 'No hay turnos'}
            </span>
          </Tooltip>
        )
      }
    },
    {
      field: 'createdAt',
      headerName: 'Creado',
      headerAlign: 'center',
      flex: 1,
      align: 'center',
      minWidth: 150,
      maxWidth: 200, 
      valueFormatter: (item) => {
        return new Date(item.value).toLocaleDateString()
      }
    },
    {
      field: '000',
      headerName: '',
      align: 'center',
      type: 'actions',
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Tooltip title="Ver informacion del cliente">
              <IconButton onClick={() => navigate(`/detail/${params.row.id}`)}>
                <FeedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Actualizar datos">
              <IconButton onClick={()=>handleSubmit(params.row)}>
                <ReplayIcon />
              </IconButton>
            </Tooltip>
          </>
        )
      }
    }
  ]

  const handleSubmit = async (e: any) => {
    const t = toast.loading("Actualizando....")
    const response = await sendData('update-user', e)
    if (response.success) return toast.success("Actualizado con exito", {id: t})
    else return toast.error(`Error al actualizar: `+ response.error, {id: t})
  }

  const setFiltro = () => {
    let result: IDataClients[] = dataAux
    if (filterStore.register) {
      const num = filterStore.register as number
      result = result.filter((item) => item.createdAt >= num)
    }
    if (filterStore.create) {
      const num = filterStore.create as number
      result = result.filter((item) => item.last_job >= num)
    }
    if (filterStore.quantity) {
      const num = filterStore.quantity as number
      result = result.filter((item) => item.total_jobs >= num)
    }
    setData(result)
  }

  useEffect(() => {
    setFiltro()
  }, [filterStore])

  const getAllUsers = async () => {
    const response = await sendData('get-all-users')
    setIsLoad(false)
    if (response.success) {
      let result: IDataClients[] = response.data
      if (filterStore.register) {
        console.log('FILTRO DE REGISTRO')
        const num = filterStore.register as number
        result = result.filter((item) => item.createdAt >= num)
      }
      if (filterStore.create) {
        console.log('FILTRO DE ULTIMO TURNO')
        const num = filterStore.create as number
        result = result.filter((item) => item.last_job >= num)
      }
      if (filterStore.quantity) {
        console.log('FILTRO DE CANTIDAD')
        const num = filterStore.quantity as number
        result = result.filter((item) => item.total_jobs >= num)
      }
      console.log(result)
      console.log(response.data)
      setData(result)
      setDataAux(response.data)
    }
  }

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filteredData = dataAux.filter((item) => {
        const name = `${item.name} ${item.lastName} ${item.nickName}`
        return name.toLowerCase().includes(searchTerm.toLowerCase())
      })
      setData(filteredData)
    } else setData(dataAux)
  }, [searchTerm])

  useEffect(() => {
    getAllUsers()
  }, [])

  const selectedFilter = (set: Dispatch<SetStateAction<boolean>>) => {
    set(true)
    handleClose()
  }

  const handleFilter = (key: IKey, value: number) => {
    filterStore.set(key, value)
    handleClose()
    setFilterTurn(false)
    setFilterRegister(false)
    setFilterQuantity(false)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="pr-4 w-full h-full">
        <h1 className="text-2xl font-semibold py-6">Todos los Registros</h1>
        <div className="flex justify-between gap-5">
          <TextField
            className="flex-1"
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <FaSearch size={25} />
                </InputAdornment>
              )
            }}
            label="Buscar cliente por nombre, apellido o apodo"
          />
        </div>
        <div className="flex items-center gap-4 my-4">
          <Link to="/create_user">
            <Button variant="contained">Agregar nuevo cliente</Button>
          </Link>
          <div>
            <Button
              id="fade-button"
              aria-controls={open ? 'fade-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              variant="contained"
            >
              Filtro
            </Button>
            <Menu
              id="fade-menu"
              MenuListProps={{
                'aria-labelledby': 'fade-button'
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={() => selectedFilter(setFilterTurn)}>
                <ListItemIcon>
                  <DateRangeIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">Fecha de ultimo turno</Typography>
              </MenuItem>
              <MenuItem onClick={() => selectedFilter(setFilterRegister)}>
                <ListItemIcon>
                  <CalendarMonthIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">Fecha de registro</Typography>
              </MenuItem>
              <MenuItem onClick={() => selectedFilter(setFilterQuantity)}>
                <ListItemIcon>
                  <AssignmentTurnedInIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">Cantidad de turnos</Typography>
              </MenuItem>
              <Divider sx={{ width: '90%', margin: 'auto' }} />
            </Menu>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          {filterStore.create && (
            <Chip
              label="Filtro de Turno"
              variant="outlined"
              onDelete={() => filterStore.set('create', null)}
            />
          )}
          {filterStore.quantity && (
            <Chip
              label="Filtro por cantidad de Turno"
              variant="outlined"
              onDelete={() => filterStore.set('quantity', null)}
            />
          )}
          {filterStore.register && (
            <Chip
              label="Filtro por fecha de registro"
              variant="outlined"
              onDelete={() => filterStore.set('register', null)}
            />
          )}
        </div>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            className="bg-white shadow-md"
            localeText={gridLocaleText}
            rows={data}
            columns={column}
            loading={isLoad}
            rowSelection={false}
            autoHeight
          />
        </Box>
      </div>
      <Dialog fullWidth maxWidth="sm" open={filterTurn} onClose={() => setFilterTurn(false)}>
        <DialogTitle>Filtro de ultimo turno</DialogTitle>
        <DialogContent>
          <div className="flex items-center gap-4">
            <p>Selecciona la fecha para aplicar filtro</p>
            <Tooltip title="El filtro mostrara clientes con ultimo turno desde la fecha seleccionada hasta la fecha actual">
              <span>
                <HelpIcon className="text-gray-400 w-6 h-6" />
              </span>
            </Tooltip>
          </div>
          <DateCalendar
            className="mt-5"
            onChange={({ $d }: any) => setFilterTurnData(Math.floor(new Date($d).getTime()))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterTurn(false)}>Cancelar</Button>
          <Button variant="contained" onClick={() => handleFilter('create', filterTurnData)}>
            Aplicar filtro
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={filterRegister}
        onClose={() => setFilterRegister(false)}
      >
        <DialogTitle>Filtro por Fecha de registro</DialogTitle>
        <DialogContent>
          <div className="flex items-center gap-4">
            <p>Selecciona la fecha para aplicar filtro</p>
            <Tooltip title="El filtro mostrara clientes con fecha de registro desde la fecha seleccionada hasta la fecha actual">
              <span>
                <HelpIcon className="text-gray-400 w-6 h-6" />
              </span>
            </Tooltip>
          </div>
          <DateCalendar
            className="mt-5"
            onChange={({ $d }: any) => setFilterRegisterData(Math.floor(new Date($d).getTime()))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterRegister(false)}>Cancelar</Button>
          <Button variant="contained" onClick={() => handleFilter('register', filterRegisterData)}>
            Aplicar filtro
          </Button>{' '}
        </DialogActions>{' '}
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={filterQuantity}
        onClose={() => setFilterQuantity(false)}
      >
        <DialogTitle>Filtro por Cantidad de turnos</DialogTitle>
        <DialogContent>
          <div className="flex items-center gap-4">
            <p>Selecciona la cantidad de turnos</p>
            <Tooltip title="El filtro mostrara clientes con cantidad de turnos igual o mayor a la seleccionada">
              <span>
                <HelpIcon className="text-gray-400 w-6 h-6" />
              </span>
            </Tooltip>
          </div>
          <TextField
            type="number"
            className="w-full my-4"
            onChange={(e) => setFilterQuantityData(parseInt(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterQuantity(false)}>Cancelar</Button>
          <Button variant="contained" onClick={() => handleFilter('quantity', filterQuantityData)}>
            Aplicar filtro
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  )
}

export default Index
