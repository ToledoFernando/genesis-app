/**
 * @description Datos general del local (personal, etc) 
 */
export interface IGeneralStore {
  personal: IPersonal[],
  setPersonal: (d: IPersonal[]) => void;
  getPersonal: () => Promise<void>;
}

export interface IPersonal {
  id: string;
  name: string;
  lastName: string;
  phono: string;
  createdAt: number;
  updatedAt: number;
}