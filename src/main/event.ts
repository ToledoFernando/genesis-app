import { app, ipcMain } from "electron";
import db from "./db/conn";
import { del, get, post } from "./db/querys";
import { IClient } from "./types/client";
import v4 from "uuid4"

export const setupHandlers = () => {

  ipcMain.handle("get_version", async () => {
    return {
      success: true,
      data: app.getVersion(),
    };
  })

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
      const jobInfo = data as { job: string, observation: string, date: string, id: string, personal_id: string; price: string }
      await new Promise((resolve, reject) => {
        db.run(post.createJob, [v4(), Math.floor(new Date(jobInfo.date).getTime()), jobInfo.job, jobInfo.observation, jobInfo.id, jobInfo.personal_id, Number(jobInfo.price)], (result, err) => {
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

  ipcMain.handle("create_personal", async (_, data) => {
    try {
      
      const {lastName, name, phone} = data as {name: string, lastName: string, phone: string }
      await new Promise((resolve, reject) => {
        db.run(post.createPersonal, [v4(), Math.floor(new Date().getTime()), lastName, name, phone], (err, result) => {
          if (err) return reject(err)
          else return resolve(result)
        }) 
      })
      return {success: true, data: "Registro creado"} 
    } catch (error: any) {
      return {success: false, error: error.message}
    }
  })

  ipcMain.handle("get-all-personal", async () => {
    try {
      const data = await new Promise((resolve, reject) => {
        db.all(get.getAllPersonal, (err, result) => {
          if (err) return reject(err)
          else return resolve(result)
        })
      })
      return {success: true, data}
    } catch (error: any) {
      return {success: false, error: error.message}
    } 
  })

  ipcMain.handle("delete-personal", async (_, id) => {
    try {
      await new Promise((resolve, reject) => {
        db.run(del.personalById,[id], (err, result) => {
          if (err) return reject(err)
          else return resolve(result)
        })
      })

      await new Promise((resolve, reject) => {
        db.run(del.allJobsByPersonalId,[id], (err, result) => {
          if (err) return reject(err)
          else return resolve(result)
        })
      })

      return {success: true, data: "Datos eliminados"}
    } catch (error: any) {
      return {success: false, error: error.message}
    } 
  })

  ipcMain.handle("get-personal", async (_, id) => {
    try {
      const data = await new Promise((resolve, reject) => {
        db.get(get.getPersonalById, [id], (err, result) => {
          if (err) return reject(err)
          else return resolve(result)
        })
      })
      return {success: true, data}
    } catch (error: any) {
      return {success: false, error: error.message}
    }
  })

  ipcMain.handle("get-jobs-by-personal", async(_, id) => {
    try {
      const data = await new Promise((resolve, reject) => {
        db.all(get.getJobsByPersonal, [id], (err, result) => {
          if (err) return reject(err)
          else return resolve(result)
        })
      })
      return {success: true, data}
    } catch (error: any) {
      return {success: false, error: error.message}
    } 
  })
}