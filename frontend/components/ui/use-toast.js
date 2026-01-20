"use client"

import { createContext, useContext, useReducer } from "react"

const ToastContext = createContext(null)

const toastReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return [...state, { ...action.toast, id: Date.now() }]
    case "REMOVE_TOAST":
      return state.filter(toast => toast.id !== action.id)
    default:
      return state
  }
}

export function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(toastReducer, [])

  return (
    <ToastContext.Provider value={{ toasts, dispatch }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }

  const toast = ({ title, description, variant = "default" }) => {
    context.dispatch({
      type: "ADD_TOAST",
      toast: { title, description, variant }
    })

    setTimeout(() => {
      context.dispatch({ type: "REMOVE_TOAST", id: context.toasts[0]?.id })
    }, 3000)
  }

  return { toast, toasts: context.toasts }
}
