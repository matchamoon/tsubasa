import type { InjectionKey } from "vue"
import { createStore, useStore as baseUseStore, Store } from "vuex"

export interface State {
  consoleMsg: string,
  ffProgress: number
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    consoleMsg: "",
    ffProgress: 0
  },
  mutations: {
    consoleMsg (state, data) {
      state.consoleMsg = data
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
