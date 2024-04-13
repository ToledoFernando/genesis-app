import { Backdrop, CircularProgress, Dialog, DialogContent, LinearProgress, ThemeProvider } from '@mui/material'
import { theme } from './components/ThemeProvider'
import toast, { Toaster, useToaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import SideBar from './components/SideBar/SideBar'
import Home from './pages/Home'
import CreateUser from './pages/CreateUser'
import AllHistories from './pages/AllHistories'
import DetailClient from './pages/DetailClient'
import Config from './pages/Config'
import Personal from './pages/Personal'
import PersonalDetail from './pages/PersonalDetail'
import CreatePersonal from './pages/CreatePersonal'
import { useEffect, useState } from 'react'
import Store from './store'
import HeaderBar from './components/HeaderBar'
import { onEvent } from './helpers/sendData'
import { downloadUpdate } from './helpers/update'

interface IProgressDownload {
  total: number
  current: number
  percent: number
  transferred: number
  delta: number
  bytesPerSecond: number
}

const statusText: {[key: number]: string} = {
  0: "Descargando",
  1: "Instalando"
}

function App() {
  const [progress, setProgress] = useState<number>(0)
  const [status, setStatus] = useState<number>(0)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [showBD, setShowBD] = useState<boolean>(false)

  const upAvalible = (_, v: string) => {    
    toast.error(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white rounded-lg pointer-events-auto flex`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <p></p>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">Nueva version disponible</p>
                <p className="mt-1 text-sm text-gray-500">Actualizar version a la {v}</p>
              </div>
            </div>
          </div>
          <div className="flex">
            <button
              onClick={() => downloadUpdate(t.id, setShowDialog) }
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Actualizar
            </button>
          </div>
        </div>
      ),
      {
        duration: 8000,
        style: {
          minWidth: '400px',
          padding: 0,
          paddingLeft: 20
        }
      }
    )
  }

  const {toasts} = useToaster();

  useEffect(()=>{
    if (toast.length === 0) setShowBD(false)
    const isLoad = toasts.find(t => t.type === "loading")
    if (isLoad) setShowBD(true)
    else setShowBD(false)
  },[toasts])

  useEffect(() => {
    Store.General.getState().getPersonal()
    onEvent('up', upAvalible)

    onEvent('progress2', (_, b: IProgressDownload) => {
      setProgress(b.percent)
    })

    onEvent("downloaded", () => {
      setStatus(1)
    })
  }, [])

  return (
    <>
      <Backdrop className='backdrop-blur-sm' open={showBD} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} />
      <ThemeProvider theme={theme}>
        <div className="bg-gray-100 relative h-screen w-screen gap-4 flex overflow-hidden">
          <HeaderBar />
          <Toaster
            position="bottom-left"
            toastOptions={{ style: { boxShadow: '0px 5px 15px #00000054' }, duration: 2000 }}
          />
          <SideBar />
          <div className="w-full pt-4 overflow-auto scroll-act">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create_user" element={<CreateUser />} />
              <Route path="/all_histories" element={<AllHistories />} />
              <Route path="/detail/:id" element={<DetailClient />} />
              <Route path="/settings" element={<Config />} />
              <Route path="/personal" element={<Personal />} />
              <Route path="/personal/create" element={<CreatePersonal />} />
              <Route path="/personal/detail/:id" element={<PersonalDetail />} />
            </Routes>
          </div>
        </div>
        <Dialog open={showDialog} maxWidth="md" className='w-max mx-auto' fullWidth>
          <DialogContent className='flex flex-col items-center justify-center gap-4'>
            <h2 className='text-center'>{statusText[status]} {status === 0 && `${progress.toFixed(2)} %`}</h2>
            {status === 0 ? <LinearProgress className='w-full min-w-[500px]' variant="determinate" value={progress} />
            : <CircularProgress />
            }
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    </>
  )
}

export default App
