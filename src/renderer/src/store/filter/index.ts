import {create} from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { IFiltersClients } from "./types"

export const Filter = create(
  persist<IFiltersClients>((set, _) => ({
    create: null,
    quantity: null,
    register: null,
    set: (key, value) => set({ [key]: value }),
  }),{
    name: "filter-app",
    storage: createJSONStorage(() => localStorage)
  })
)