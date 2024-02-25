import { NavLink, useLocation } from "react-router-dom";
import store from "../../store";
import { getContrastColor } from "@renderer/helpers/format";
import { useEffect, useState } from "react";

export interface IProps {
  href: string;
  name: string;
  Icon: any;
  iconSize?: number;
  hidden?: boolean;
}

const formatname = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

function LinkOptions({ href, Icon, name, hidden = false }: IProps) {
  const [isActive, setIsActive] = useState<boolean>(false)
  const config = store.Config();
  const location = useLocation();

  useEffect(()=>{
    setIsActive(location.pathname === (href))
  },[location])

  const checkActive = ({isActive}: any) => {
    return `${
      isActive
        ? "bg-gradient-to-tr from-purple-500 text-white to-cyan-600 shadow-lg translate-x-0"
        : "hover:bg-gray-200 -translate-x-1"
    } ${hidden && !isActive && "hidden invert"} transition-transform duration-200 flex items-center w-full rounded-r-full px-5 py-3 gap-4`
  }

  return (
    <NavLink
      to={href}
      onClick={(e)=> hidden && e.preventDefault()}
      className={checkActive}>
        <Icon size={20} style={{color: isActive ? "#fff" : getContrastColor(config.sideBarBg)}} />
        {config.openMenu && <span className="min-w-max">{formatname(name)}</span>}
    </NavLink>
  );
}

export default LinkOptions;
