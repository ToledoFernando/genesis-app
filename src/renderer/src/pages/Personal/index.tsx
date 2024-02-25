import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { gridLocaleText } from '@renderer/config'
import { sendData } from '@renderer/helpers/sendData'
import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { IPersonal } from './types'
import { formatName } from '@renderer/helpers/format'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { formatTime } from '@renderer/helpers/time'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import toast from 'react-hot-toast'
import WarningIcon from '@mui/icons-material/Warning'
import Store from "../../store"
import InfoIcon from '@mui/icons-material/Info';

function Index() {
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [allPersonal, setAllPersonal] = useState<IPersonal[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [allPersonalAux, setAllPersonalAux] = useState<IPersonal[]>([])
  const navigate = useNavigate()
  const store = Store.General.getState()

  const handleDelete = (item: IPersonal) => {
    toast(
      (event) => (
        <div>
          <p>Esto eliminara el registro y sus trabajos asociados. </p>
          <b>¡No se puede deshacer!</b>
          <div className="flex justify-end gap-3 items-center mt-4">
            <Button onClick={() => toast.remove(event.id)} color="error">
              Cancelar
            </Button>
            <Button
              onClick={() => confirmDelete(item.id, event.id)}
              variant="contained"
              color="error"
            >
              Eliminar
            </Button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        icon: (
          <div className="h-5/6">
            <WarningIcon className="text-4xl text-red-500" />
          </div>
        )
      }
    )
  }

  const confirmDelete = async (idUser: string, idToast: string) => {
    const id = toast.loading("Eliminando datos...")
    try {
      toast.remove(idToast)
      const response = await sendData('delete-personal', idUser)
      if (response.success) {
        toast.success('Personal eliminado con exito!', {id})
        const newState = allPersonal.filter(item => item.id !== idUser)
        store.setPersonal(newState)
        setAllPersonal(newState)
      } else {
        toast.error(response.error as string, {id})
      }
    } catch (e: any) {
      toast.error(e.message, {id})
    }
  }

  useEffect(()=> {{
    setAllPersonal(store.personal)
    setAllPersonalAux(store.personal)
  }}, [store.personal])

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      headerAlign: 'center',
      width: 150
    },
    {
      field: 'name',
      headerName: 'Nombre',
      headerAlign: 'center',
      width: 150,
      valueFormatter: (params) => {
        const result = formatName(params.value)
        return result
      }
    },
    {
      field: 'lastName',
      headerName: 'Apellido',
      headerAlign: 'center',
      width: 150,
      valueFormatter: (params) => {
        const result = formatName(params.value)
        return result
      }
    },
    {
      field: 'phono',
      headerName: 'Celular',
      headerAlign: 'center',
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
      field: 'createdAt',
      headerName: 'Fecha de registro',
      headerAlign: 'center',
      width: 150,
      align: 'center',
      valueFormatter: (params) => {
        return formatTime(params.value).fecha
      }
    },
    {
      field: 'action',
      headerName: 'Acciones',
      headerAlign: 'center',
      width: 180,
      align: "center",
      renderCell: (params) => {
        return (
          <div>
            {/* <IconButton onClick={() => handleDelete(params.row)} className="group">
              <DeleteIcon className="group-hover:text-red-900" />
            </IconButton>
            <IconButton>
              <EditIcon />
            </IconButton> */}
            <IconButton onClick={()=>navigate(`/personal/detail/${params.row.id}`)}>
              <InfoIcon />
            </IconButton>
          </div>
        )
      }
    }
  ]

  useEffect(()=>{
    if(searchTerm.length > 0){
      const result = allPersonalAux.filter(item => {
        const fullName = `${item.name} ${item.lastName}`
        return fullName.toLowerCase().includes(searchTerm.toLowerCase())
      })
      console.log(result)
      setAllPersonal(result)
    }else{
      setAllPersonal(allPersonalAux)
      console.log("aqui")
    }
  },[searchTerm])

  return (
    <>
      <div className="pr-4">
        <h1 className="text-2xl font-semibold py-6">Administrador de Personal</h1>
        <TextField
          className="w-6/12 mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <FaSearch size={25} />
              </InputAdornment>
            )
          }}
          label="Buscar personal por nombre o apellido"
        />
        <div className="mb-4">
          <Link to="/personal/create">
            <Button variant="contained">Agregar Personal</Button>
          </Link>
        </div>
        <DataGrid
          className="bg-white h-full w-max max-w-full"
          localeText={gridLocaleText}
          columns={columns}
          rows={allPersonal}
          pageSizeOptions={[10000]}
          hideFooter
          autoHeight
        />
      </div>
      <Dialog open={showAlert} onClose={() => setShowAlert(false)}>
        <DialogTitle>Eliminar personal</DialogTitle>
        <DialogContent>
          Esto eliminará el registro <b>No se puede deshacer</b>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAlert(false)}>Cancelar</Button>
          <Button variant="contained">Confirmar</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Index
