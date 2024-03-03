import toast from "react-hot-toast"
import { sendData } from "./sendData"

export const downloadUpdate = async (id: string, set?: any) => {
  set(true)
  toast.dismiss(id)
  const response = await sendData("downloadUp")
  if (response.success) {
    await sendData("install")
  }

}