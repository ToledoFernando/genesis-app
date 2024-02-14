import LinkOptions, { IProps as PropsLink } from "./LinkOptions"
import { FaHome } from "react-icons/fa";
import Store from "../../store/index"
import { FaChevronLeft } from "react-icons/fa";
import { IconButton } from "@mui/material";
import { IoCreate } from "react-icons/io5";
import { FaThList } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import FeedIcon from '@mui/icons-material/Feed';
import Person2Icon from '@mui/icons-material/Person2';

const LinksPages: PropsLink[] = [
    { href: "/", name: "Inicio", Icon: FaHome },
    { href: "/all_histories", name: "Todos los registros", Icon: FaThList },
    { href: "/create_user", name: "Nuevo cliente", Icon: IoCreate },
    { href: "/personal", name: "Personal", Icon: Person2Icon}
]

function SideBar() {
  const config = Store.Config()

  return (
    <div className={`${config.openMenu ? "w-[20%]": "w-[80px]" } pr-2 transition-all duration-300 h-screen relative border-r border-gray-300`}>
      <div className='h-5/6 mt-4 flex flex-col gap-4'>
        {LinksPages.map((option, index) => <LinkOptions key={index} {...option} /> )}
        <LinkOptions Icon={FeedIcon} hidden={true} href="/detail" name="Detalle de cliente" />
      </div>
      <div className="h-1/6 flex flex-col justify-end pb-8">
      <LinkOptions Icon={IoSettingsSharp} href="/settings" name="Configuración" />
      </div>
      <IconButton onClick={()=>config.setOpenMenu()} className="absolute -right-4 bottom-12 bg-white" style={{border: "rgb(156 163 175) solid 1px"}}>
        <FaChevronLeft color="#000" size={15} className={`${config.openMenu ? "rotate-0" : "rotate-180"} transition-transform duration-300`} />
      </IconButton>
    </div>
  )
}

export default SideBar