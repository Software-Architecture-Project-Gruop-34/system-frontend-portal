import React from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function showSuccess(message: string) {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    pauseOnHover: true,
    draggable: true,
    transition: Slide,
  });
}

export function showError(message: string) {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    pauseOnHover: true,
    draggable: true,
    transition: Slide,
  });
}

/**
 * Mount this once (e.g. in App.tsx). It renders the toast container.
 */
const AppToast: React.FC = () => <ToastContainer limit={3} />;

export default AppToast;