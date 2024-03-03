import { BrowserWindow, ipcMain } from "electron";
import {autoUpdater} from "electron-updater"

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

export const checkUpdate = (mainWindow: BrowserWindow) => {
  autoUpdater.setFeedURL("https://github.com/ToledoFernando/genesis-app/releases/latest/download/")

  autoUpdater.checkForUpdates();

  autoUpdater.on("update-available", (e)=> {
    mainWindow.webContents.send("up", e.version)
  })

  ipcMain.handle("downloadUp", async () => {
    try {
      await autoUpdater.downloadUpdate();
      return {success: true, data: "okok"}
    } catch (error: any) {
      return {success: false, error: error.message}
    }
  })

  autoUpdater.on("download-progress", (info) => {
    const body = {
      total: info.total,
      current: info.bytesPerSecond,
      percent: info.percent,
      transferred: info.transferred,
      delta: info.delta,
      bytesPerSecond: info.bytesPerSecond,
    }  
    mainWindow.webContents.send("progress2", body)
  })
  
  autoUpdater.on("update-downloaded", (info) => {
    mainWindow.webContents.send("downloaded", info.downloadedFile)
  })

  ipcMain.handle("install", async () => {
    try {
      await autoUpdater.quitAndInstall();
      return {success: true, data: "okok"}
    } catch (error: any) {
      return {success: false, error: error.message}
    }
  })

}