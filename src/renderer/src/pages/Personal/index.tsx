import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Store from "../../store"
import TablePersonal from './TablePersonal'
import { IPersonal } from './types'

function Index() {
  const store = Store.General.getState()

  
  const [showAlert, setShowAlert] = useState<boolean>(false)
  // const [searchTerm, setSearchTerm] = useState<string>("")
  const [allPersonal, setAllPersonal] = useState<IPersonal[]>([...store.personal])
  const [_, setAllPersonalAux] = useState<IPersonal[]>([])
  
  
  const getPersonal = async (id?: string) => {
    await store.getPersonal()
    if (id) {
      const result = store.personal.filter(item => item.id === id)
      setAllPersonal(result)
    } else  setAllPersonal(store.personal)
    
  }
  
  

  useEffect(()=> {{
    setAllPersonal(store.personal)
    setAllPersonalAux(store.personal)
    console.log("===============")
    console.log("AQUII")
    console.log(store.personal)
    console.log("===============")
  }}, [store.personal])


  useEffect(()=>{
    getPersonal()
    setAllPersonal(store.personal)
    setAllPersonalAux(store.personal)
  },[])

  // useEffect(()=>{
  //   if(searchTerm.length > 0){
  //     const result = allPersonalAux.filter(item => {
  //       const fullName = `${item.name} ${item.lastName}`
  //       return fullName.toLowerCase().includes(searchTerm.toLowerCase())
  //     })
  //     console.log(result)
  //     setAllPersonal(result)
  //   }else{
  //     setAllPersonal(allPersonalAux)
  //     console.log("aqui")
  //   }
  // },[searchTerm])

  return (
    <>
      <div className="pr-4">
        <h1 className="text-2xl font-semibold py-6">Administrador de Personal</h1>
        {/* <TextField
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
        /> */}
        <div className="mb-4">
          <Link to="/personal/create">
            <Button variant="contained">Agregar Personal</Button>
          </Link>
        </div>
        <TablePersonal data={allPersonal} get={getPersonal} />
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
