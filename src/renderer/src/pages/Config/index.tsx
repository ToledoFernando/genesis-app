import { Button } from '@mui/material'
import { Config } from '@renderer/store/config'
import { useState } from 'react'

function Index() {
  const [newColor, setNewColor] = useState<string>("")
  const config = Config.getState()

  const confirmChange = (c: string) => {
    config.setColor(c)
    window.location.reload()
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold py-6">Crear nuevo registro</h1>
      <input type="color" className='w-[100px] h-[50px]' value={newColor} onChange={(e) => setNewColor(e.target.value)} />
      <div className='flex gap-4'> 
      <Button variant='contained' onClick={()=> confirmChange(newColor)}>Cambiar color Primario</Button>
      <Button variant='contained' onClick={()=> confirmChange("#009688")}>Reiniciar Color</Button>
      </div>
    </div>
    )
}

export default Index