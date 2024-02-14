import { Button, InputAdornment, TextField } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { gridLocaleText } from '@renderer/config'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    headerAlign: 'center'
  }
]

function Index() {
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
      <div className='mb-4'>
        <Link to="/personal/create">
          <Button variant='contained'>Agregar Personal</Button>
        </Link>
      </div>
      <DataGrid
        className="bg-white h-full"
        localeText={gridLocaleText}
        columns={columns}
        rows={[]}
        pageSizeOptions={[10000]}
        hideFooter
        autoHeight
      />
    </div>
  )
}

export default Index
