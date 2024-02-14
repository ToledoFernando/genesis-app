export type IKey = "quantity" | "register" | "create"

export interface IFiltersClients {
  quantity: number | null
  register: number | null
  create: number | null
  set: (key: IKey, data: number | null) => void;
}