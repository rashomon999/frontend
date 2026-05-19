import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient: Client | null = null;

export type NotificationType =
  | "success"
  | "info"
  | "warning"
  | "error";

export interface NotificationMessage {
  title?: string;

  message: string;

  type?: NotificationType;

  timestamp?: string;
}

interface ConnectProps {
  role: string;

  onMessageReceived: (
    message: NotificationMessage
  ) => void;
}

export const connectWebSocket = ({
  role,
  onMessageReceived,
}: ConnectProps) => {
  const socket = new SockJS(
    "http://localhost:8081/compunet2-2026/ws"
  );

  stompClient = new Client({
    webSocketFactory: () => socket,

    reconnectDelay: 5000,

    onConnect: () => {
      console.log(
        "Connected to WebSocket"
      );

      // GLOBAL
      stompClient?.subscribe(
        "/topic/notifications",
        (message) => {
          const body: NotificationMessage =
            JSON.parse(message.body);

          onMessageReceived({
            ...body,
            timestamp:
              new Date().toLocaleTimeString(),
          });
        }
      );

      // ROLE BASED
      stompClient?.subscribe(
        `/topic/notifications/${role}`,
        (message) => {
          const body: NotificationMessage =
            JSON.parse(message.body);

          onMessageReceived({
            ...body,
            timestamp:
              new Date().toLocaleTimeString(),
          });
        }
      );
    },

    onStompError: (frame) => {
      console.error(
        "Broker error:",
        frame.headers["message"]
      );
    },
  });

  stompClient.activate();
};

export const disconnectWebSocket =
  () => {
    stompClient?.deactivate();
  };

export const sendNotification = (
  message: NotificationMessage
) => {
  stompClient?.publish({
    destination: "/app/notify",

    body: JSON.stringify(message),
  });
};

// DEBUG ONLY
declare global {
  interface Window {
    sendNotification: typeof sendNotification;
  }
}

window.sendNotification =
  sendNotification;