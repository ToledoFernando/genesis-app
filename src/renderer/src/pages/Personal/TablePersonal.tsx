import { IPersonal } from './types'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { gridLocaleText } from '@renderer/config'
import { Button, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import WarningIcon from '@mui/icons-material/Warning';
import { sendData } from '@renderer/helpers/sendData'
import { formatName } from '@renderer/helpers/format'
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { formatTime } from '@renderer/helpers/time'
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

interface IProps {
  data: IPersonal[]
  get: any
}

function TablePersonal({data, get}:IProps) {

  const navigate = useNavigate()

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
        get(idUser)
      } else {
        toast.error(response.error as string, {id})
      }
    } catch (e: any) {
      toast.error(e.message, {id})
    }
  }
  
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
            <IconButton onClick={() => handleDelete(params.row)} className="group">
              <DeleteIcon className="group-hover:text-red-900" />
            </IconButton>
            {/*
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

  return (
    <DataGrid
      className="bg-white h-full w-max max-w-full"
      localeText={gridLocaleText}
      columns={columns}
      // rows={allPersonal}
      rows={data}
      pageSizeOptions={[10000]}
      hideFooter
      autoHeight
    />
  )
}

export default TablePersonal