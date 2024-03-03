import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { Dispatch, SetStateAction, useState } from 'react'
import { Button } from '@mui/material'
import CreateUser from './CreateUser'
import CreateJob from './CreateJob'

const stepsLabel = ['Creat cliente', 'Agregar el Trabajo (opcional)']

function Index() {
  const [stepAct, setStepAct] = useState<number>(0)
  const [newUserID, setNewUserID] = useState<string>("")

  return (
    <div>
      <h1 className="text-2xl font-semibold py-6">Crear nuevo registro</h1>
      <div className="my-6">
        <Stepper activeStep={stepAct} className="w-6/12 mx-auto scale-150">
          {stepsLabel.map((label, index) => {
            return (
              <Step key={index}>
                <StepLabel>{stepAct === index && label}</StepLabel>
              </Step>
            )
          })}
        </Stepper>
        <ShowScreens step={stepAct} set={setStepAct} setID={setNewUserID} id={newUserID} />
      </div>
    </div>
  )
}

export default Index

function ShowScreens({step, id, set, setID}:{step: number,id:string, set: Dispatch<SetStateAction<number>>, setID: Dispatch<SetStateAction<string>>}){
  switch(step){
    case 0:
      return <CreateUser set={set} setID={setID} />
    case 1:
      return <CreateJob id={id} />
    default:
      return <div>
        <h2>Volver a la pantalla principal</h2>
        <Button LinkComponent={'a'} href='/' >Volver</Button>
      </div>
  }
}