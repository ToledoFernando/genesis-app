import CloseIcon from '@mui/icons-material/Close';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import MinimizeIcon from '@mui/icons-material/Minimize';
import { sendData } from '@renderer/helpers/sendData';
import { useEffect, useState } from 'react';

function HeaderBar() {
  const [v, setV] = useState<string>("")

  const getV = async () => {
    const response = await sendData("get_version")
    if (response.success) {
      console.log(response)
      setV(response.data)
    }
  }

  useEffect(()=>{
    getV();
  },[])

  return (
    <div style={{zIndex: 9999999}} className="fixed top-0 left-0 w-full h-5 flex justify-between items-center bg-black bar">
      <p className='text-[10px] pl-3 text-gray-300 font-semibold'>v{v}</p>
      <div className='w-max top-0 left-0 h-5 flex justify-end items-center'>
        <MinimizeIcon onClick={()=>sendData("minimize")} className='text-white h-full px-2 w-max py-[2px] hover:bg-gray-950 transition-all duration-150 cursor-pointer' />
        <WebAssetIcon onClick={()=>sendData("maximize")} className='text-white h-full px-2 w-max py-[2px] hover:bg-gray-900 transition-all duration-150 cursor-pointer' />
        <CloseIcon onClick={()=>sendData("close-app")} className='text-white h-full px-2 w-max py-[2px] hover:bg-red-500 transition-all duration-150 cursor-pointer' />
      </div>
    </div>
  )
}

export default HeaderBar