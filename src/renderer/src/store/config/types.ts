/**
 * @description Configuracion de la app en lo visual 
 */
export interface IConfigApp {
  colors: string
  sideBarBg: string;
  openMenu: boolean;
  setOpenMenu: () => void;
  setColor: (c: string) => void;
  setSideBarBg: (c: string) => void;
}