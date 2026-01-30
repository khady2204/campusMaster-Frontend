// toast.service.ts
import Toastify from "toastify-js"
import "toastify-js/src/toastify.css"

type ToastType = "success" | "error" | "warning" | "info"

interface ToastOptions {
  message: string
  duration?: number
  position?: "left" | "center" | "right"
  gravity?: "top" | "bottom"
}

const getBackgroundColor = (type: ToastType): string => {
  switch (type) {
    case "success":
      return "#16a34a" // vert
    case "error":
      return "#dc2626" // rouge
    case "warning":
      return "#f59e0b" // orange
    case "info":
      return "#0A3282" // bleu
    default:
      return "#374151" // gris par défaut
  }
}

export const showToast = (type: ToastType, options: ToastOptions) => {
  Toastify({
    text: options.message,
    duration: options.duration ?? 3000,
    gravity: options.gravity ?? "top",
    position: options.position ?? "right",
    backgroundColor: getBackgroundColor(type),
    stopOnFocus: true,
    close: true, // bouton de fermeture
  }).showToast()
}