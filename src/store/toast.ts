import { create } from 'zustand'

export type ToastMessage = {
  id: string
  text: string
}

type ToastState = {
  toasts: readonly ToastMessage[]
  push: (text: string) => void
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (text) => {
    const next = { id: crypto.randomUUID(), text }
    set((state) => ({ toasts: [...state.toasts, next] }))
  },
  dismiss: (id) => {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
  },
}))
