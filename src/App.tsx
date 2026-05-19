import {
  useEffect,
  useState,
} from "react";

import { useSelector } from "react-redux";

import AppRouter from "./routes/AppRouter";

import NotificationToast from "./components/NotificationToast";

import { RootState } from "./store";

import {
  connectWebSocket,
  disconnectWebSocket,
  NotificationMessage,
} from "./services/websocketService";

import { useNotifications } from "./hooks/useNotifications";

function App() {
  const { isAuthenticated, user } =
    useSelector(
      (state: RootState) => state.auth
    );

  const { addNotification } =
    useNotifications();

  const [toastOpen, setToastOpen] =
    useState(false);

  const [toastMessage, setToastMessage] =
    useState("");

  const [toastType, setToastType] =
    useState<
      | "success"
      | "info"
      | "warning"
      | "error"
    >("info");

  useEffect(() => {
    if (
      !isAuthenticated ||
      !user?.role
    ) {
      return;
    }

    connectWebSocket({
      role: user.role,

      onMessageReceived: (
        message: NotificationMessage
      ) => {
        addNotification(
          message.title ||
            "Notificación",

          message.message,

          message.type || "info"
        );

        setToastMessage(
          message.title
            ? `${message.title}: ${message.message}`
            : message.message
        );

        setToastType(
          message.type || "info"
        );

        setToastOpen(true);
      },
    });

    return () => {
      disconnectWebSocket();
    };
  }, [
    isAuthenticated,
    user,
    addNotification,
  ]);

  return (
    <>
      <AppRouter />

      <NotificationToast
        open={toastOpen}
        message={toastMessage}
        type={toastType}
        onClose={() =>
          setToastOpen(false)
        }
      />
    </>
  );
}

export default App;