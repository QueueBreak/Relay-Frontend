"use client"

import * as React from "react"
import { ToastActionElement, type ToastProps } from "./toast"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

type Toast = Omit<ToasterToast, "id">

let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

type State = {
  toasts: ToasterToast[]
}

const initialState: State = {
  toasts: [],
}

type Action =
  | {
  type: "ADD_TOAST"
  toast: ToasterToast
}
  | {
  type: "UPDATE_TOAST"
  toast: Partial<ToasterToast>
}
  | {
  type: "DISMISS_TOAST"
  toastId?: string
}
  | {
  type: "REMOVE_TOAST"
  toastId?: string
}

function toastReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }
    case "DISMISS_TOAST": {
      const { toastId } = action
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((t) => addToRemoveQueue(t.id))
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined ? { ...t, open: false } : t
        ),
      }
    }
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []
let memoryState = initialState

function dispatch(action: Action) {
  memoryState = toastReducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  const toast = React.useCallback((props: Toast) => {
    const id = genId()
    const update = (props: Partial<ToasterToast>) =>
      dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } })
    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

    dispatch({
      type: "ADD_TOAST",
      toast: {
        ...props,
        id,
        open: true,
        onOpenChange: (open) => !open && dismiss(),
      },
    })

    return { id, dismiss, update }
  }, [])

  return {
    toasts: state.toasts,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast }
