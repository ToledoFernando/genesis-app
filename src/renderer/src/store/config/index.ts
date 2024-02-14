import {create} from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { IConfigApp } from "./types"

export const Config = create(
  persist<IConfigApp>((set, _) => ({
    colors: "red",
    openMenu: true,
    setOpenMenu: ()=>set((state)=>({openMenu: !state.openMenu})),
    setColor: (c) => set({colors: c})
  }),{
    name: "config-app",
    storage: createJSONStorage(() => localStorage)
  })
)