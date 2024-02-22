export interface IDataClients {
  id: string
  name: string
  lastName: string
  phono: string
  nickName: string
  createdAt: number
  updatedAt: any
  total_jobs: number
  last_job: number
}

export interface IJobs {
  id: string
  job: string
  observation: string
  createdAt: number
  updatedAt: any
  clients_id: string
  price: number
  personal_id: string
  personalName: string
  personalLastName: string
}