import { Button, TextField } from '@mui/material'

// name TEXT,
// lastName TEXT,
// phono TEXT,
// email TEXT,
// createdAt INTEGER,
// updatedAT INTEGER

function Index() {
  return (
    <div className="pr-4">
      <h1 className="text-2xl font-semibold py-6">Agregar de Personal</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <TextField className='bg-white' label="Nombre" />
        <TextField className='bg-white' label="Apellido" />
        <TextField className='bg-white' label="Celular" />
        <TextField className='bg-white' label="Email" />
      </div>
      <div className="flex gap-4 items-center">
        <Button>Cancelar</Button>
        <Button variant="contained">Crear</Button>
      </div>
    </div>
  )
}

export default Index
