import {create} from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { IGeneralStore, IPersonal } from "./types"
import { sendData } from "@renderer/helpers/sendData"

export const General = create(
  persist<IGeneralStore>((set, _) => ({
    personal: [],
    setPersonal: (data) => set({personal: data}),
    getPersonal: async () => {
      const response = await sendData('get-personal')
    if (response.success) {
      const data = response.data as IPersonal[]
      console.log(data)
      set({personal: data})
    }
    },
  }),{
    name: "general-app",
    storage: createJSONStorage(() => localStorage)
  })
)