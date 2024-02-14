import { ipcMain } from "electron";
import db from "./db/conn";
import { get, post } from "./db/querys";
import { IClient } from "./types/client";
import v4 from "uuid4"

export const setupHandlers = () => {
  ipcMain.handle('get-all-users', async () => {
    try {
      const data = await new Promise((resolve, reject) => {
        db.all(get.getAllUser, (err, result) => {
          if (err) return reject(err)
          else return resolve(result)
        })
      })
      return {success: true, data}
    } catch (error: any) {
      return {success: false, error: error.message}
    }
  })
  
  ipcMain.handle('create-user', async (_, data) => {
    try {
      const clientInfo = data as IClient
      const idUser = v4();
      await new Promise((resolve, reject) => {
        db.run(post.createClient, [idUser, Math.floor(new Date().getTime()), clientInfo.lastName, clientInfo.nickname, clientInfo.name, clientInfo.phono], (result, err) => {
          if (err) return reject(err)
          else return resolve(result)
        })
      })
      return {success: true, data: idUser}
    } catch (error: any) {
      return {success: false, message: error.message}
    }
  })

  ipcMain.handle("create-job", async (_, data) => {
    try {
      const jobInfo = data as { job: string, observation: string, date: string, id: string }
      await new Promise((resolve, reject) => {
        db.run(post.createJob, [v4(), Math.floor(new Date(jobInfo.date).getTime()), jobInfo.job, jobInfo.observation, jobInfo.id], (result, err) => {
          if (err) return reject(err)
          else return resolve(result)
        }) 
      })
      return {success: true, data: "Registro creado"} 
    } catch (error: any) {
      return {success: false, error: error.message}
    }
  })

  ipcMain.handle("get-user", async (_, id) => {
    try {
      const data = await new Promise((resolve, reject) => {
        db.get(get.getUserById, [id], (err, result) => {
          if (err) return reject(err)
          else return resolve(result)
        })
      })
      return {success: true, data}
    } catch (error: any) {
      return {success: false, error: error.message}
    }
  })

  ipcMain.handle("get-jobs", async (_, id) => {
    try {
      const data = await new Promise((resolve, reject) => {
        db.all(get.getJobsByUser, [id], (err, result) => {
          if (err) return reject(err)
          else return resolve(result)
        })
      })
      return {success: true, data}
    } catch (error: any) {
      return {success: false, error: error.message}
    } 
  })

  // ipcMain.handle("add-job", async (_, data) => {
  //   // createJob
  // })
}