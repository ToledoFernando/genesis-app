export interface IDataClient {
  [key: string]: string | number | Date;
  name: string;
  lastName: string;
  phono: string;
  date: Date;
  nickname: string;
}

export interface IColorsBG {
  color1: string;
  color2: string;  
}

export const initialState: IDataClient = {
  date: new Date(),
  lastName: "",
  name: "",
  phono: "",
  nickname: ""
}

export interface IJob {
  job: string;
  date: Date;
  observation: string;
  personal_id: string;
  price: string;
}