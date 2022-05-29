import type { InjectionKey } from "vue"
import { createStore, useStore as baseUseStore, Store } from "vuex"

export interface State {
  consoleMsg: string,
  ffFilename: string,
  ffProgress: number
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    consoleMsg: "",
    ffFilename: "",
    ffProgress: 0
  },
  mutations: {
    consoleMsg (state, data) {
      state.consoleMsg = data
    },
    ffFilename (state, data) {
      state.ffFilename = data
    },
    ffProgress (state, data) {
      if (data > 0 && data < 101) {
        state.ffProgress = data
      }
    },
  }
})

// define your own `useStore` composition function
export function useStore () {
  return baseUseStore(key)
}