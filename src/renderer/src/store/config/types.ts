/**
 * @description Configuracion de la app en lo visual 
 */
export interface IConfigApp {
  colors: string
  openMenu: boolean;
  setOpenMenu: () => void;
  setColor: (c: string) => void;
}