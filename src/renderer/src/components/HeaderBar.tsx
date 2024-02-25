import CloseIcon from '@mui/icons-material/Close';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import MinimizeIcon from '@mui/icons-material/Minimize';
import { sendData } from '@renderer/helpers/sendData';

function HeaderBar() {
  return (
    <div className="fixed top-0 left-0 w-full h-5 z-50 flex justify-end items-center bg-black bar">
      <MinimizeIcon onClick={()=>sendData("minimize")} className='text-white h-full px-2 w-max py-[2px] hover:bg-gray-950 transition-all duration-150 cursor-pointer' />
      <WebAssetIcon onClick={()=>sendData("maximize")} className='text-white h-full px-2 w-max py-[2px] hover:bg-gray-900 transition-all duration-150 cursor-pointer' />
      <CloseIcon onClick={()=>sendData("close-app")} className='text-white h-full px-2 w-max py-[2px] hover:bg-red-500 transition-all duration-150 cursor-pointer' />
    </div>
  )
}

export default HeaderBar