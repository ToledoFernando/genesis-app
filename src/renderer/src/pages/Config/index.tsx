import { Button, Step, StepLabel, Stepper } from '@mui/material'
import ColorPallet from '@renderer/components/ColorPallet'
import style from 'styled-components'
import { Config } from '@renderer/store/config'
import { useState } from 'react'
import { IColor } from 'react-color-palette'

function Index() {
  const [newColor, setNewColor] = useState<string>('')
  const [sideBar, setSideBar] = useState<string>('')
  const config = Config.getState()

  const confirmChange = (c: string) => {
    config.setColor(c)
    window.location.reload()
  }

  const confirmChangeSideBar = (b?: boolean) => {
    if (b) config.setSideBarBg("#00000000")
    else config.setSideBarBg(sideBar)
    window.location.reload();
  }

  const handleChangeSidebar = (c: IColor) => {
    setSideBar(c.hex)
  }

  const StyleStep = style(Stepper)`
    & .Mui-completed {
      color: ${newColor}
    }
    & .Mui-active {
      color: ${newColor}
    }
  `

  const handleChange = (c: IColor) => {
    setNewColor(c.hex)
  }

  return (
    <div className='mb-8'>
      <h1 className="text-2xl font-semibold py-6">Crear nuevo registro</h1>
      <div className="flex items-center justify-between">
        <div className="w-9/12">
          <div>
            <h2 className="mb-2">Color primario</h2>
            <ColorPallet className="w-7/12" change={handleChange} />
          </div>
          <div className="flex gap-4">
            <Button variant="contained" onClick={() => confirmChange(newColor)}>
              Cambiar color Primario
            </Button>
            <Button variant="contained" onClick={() => confirmChange('#009688')}>
              Reiniciar Color
            </Button>
          </div>
        </div>
        <div className="w-3/12 flex flex-col gap-4 pr-4">
          <Button sx={{ backgroundColor: newColor }} variant="contained">
            Ejemplo de boton
          </Button>
          <Button sx={{ color: newColor }} variant="text">
            Ejemplo de boton
          </Button>
          <StyleStep activeStep={1} alternativeLabel>
            <Step>
              <StepLabel>Paso 1</StepLabel>
            </Step>
            <Step>
              <StepLabel>Paso 2</StepLabel>
            </Step>
            <Step>
              <StepLabel>Paso 3</StepLabel>
            </Step>
          </StyleStep>
        </div>
      </div>
      <hr className="my-8 h-[2px] bg-gray-400 w-[98%]" />
      <div>
        <h2>Barra lateral</h2>
        <ColorPallet className="w-[44%] my-4" change={handleChangeSidebar} />
        <div className='flex items-center gap-4'>
          <Button onClick={()=>confirmChangeSideBar(false)} variant="contained">Cambiar color de barra lateral</Button>
          <Button onClick={()=>confirmChangeSideBar(true)} variant="contained">Reiniciar color</Button>
        </div>
      </div>
    </div>
  )
}

export default Index
