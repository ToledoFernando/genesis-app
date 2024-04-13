export interface IClient {
  date: string,
  lastName: string,
  name: string,
  phono: string,
  nickname: string
}

export interface IUpdateUser {
  id: string
  name: string
  lastName: string
  phono: string
  nickName: string
  createdAt: number
  updatedAt: any
  total_jobs: number
  last_job: any
}