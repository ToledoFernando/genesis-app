import { Button, IconButton, InputAdornment, TextField } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { gridLocaleText } from '@renderer/config'
import { sendData } from '@renderer/helpers/sendData'
import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { IPersonal } from './types'
import { formatName } from '@renderer/helpers/format'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { formatTime } from '@renderer/helpers/time'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

function Index() {
  const [personal, setPersonal] = useState<IPersonal[]>([])

  const getAllPersonal = async () => {
    const response = await sendData('get-personal')
    if (response.success) {
      const data = response.data as IPersonal[]
      setPersonal(data)
    }
  }

  useEffect(() => {
    getAllPersonal()
  }, [])

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
      renderCell: (params) => {
        return (
          <div>
            <IconButton onClick={()=>console.log(params.row)} className='group'>
              <DeleteIcon className='group-hover:text-red-500' />
            </IconButton>
            <IconButton>
              <EditIcon />
            </IconButton>
          </div>
        )
      }
    }
  ]

  return (
    <div className="pr-4">
      <h1 className="text-2xl font-semibold py-6">Administrador de Personal</h1>
      <TextField
        className="w-6/12 mb-4"
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
        className="bg-white h-full w-max"
        localeText={gridLocaleText}
        columns={columns}
        rows={personal}
        pageSizeOptions={[10000]}
        hideFooter
        autoHeight
      />
    </div>
  )
}

export default Index
