import { NavLink } from "react-router-dom";
import store from "../../store";

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
  const config = store.Config();
  return (
    <NavLink
      to={href}
      onClick={(e)=> hidden && e.preventDefault()}
      className={({ isActive }) =>
        `${
          isActive
            ? "bg-gradient-to-tr from-purple-500 text-white to-cyan-600 shadow-lg translate-x-0"
            : "hover:bg-gray-200 -translate-x-1"
        } ${hidden && !isActive && "hidden"} transition-transform duration-200 flex items-center w-full rounded-r-full px-5 py-3 gap-4`
      }
    >
        <Icon size={20} />
        {config.openMenu && <span className="min-w-max">{formatname(name)}</span>}
    </NavLink>
  );
}

export default LinkOptions;
