import {create} from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { IConfigApp } from "./types"

export const Config = create(
  persist<IConfigApp>((set, _) => ({
    colors: "#009688",
    sideBarBg: "#00000000",
    openMenu: true,
    setOpenMenu: ()=>set((state)=>({openMenu: !state.openMenu})),
    setColor: (c) => set({colors: c}),
    setSideBarBg: (c) => set({sideBarBg: c})
  }),{
    name: "config-app",
    storage: createJSONStorage(() => localStorage)
  })
)