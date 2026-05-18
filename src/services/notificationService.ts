import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface NotificationMessage {
  id?: number;
  title?: string;
  message: string;
  type?: string;
  createdAt?: string;
}

export const createWebSocketClient = (
  onMessageReceived: (message: NotificationMessage) => void
) => {
  const client = new Client({
    brokerURL: "ws://localhost:8081/compunet2-2026/ws",

    webSocketFactory: () =>
      new SockJS(
        "http://localhost:8081/compunet2-2026/ws"
      ),

    debug: (str) => {
      console.log(str);
    },

    reconnectDelay: 5000,

    heartbeatIncoming: 4000,

    heartbeatOutgoing: 4000,
  });

  client.onConnect = () => {
    console.log("Connected to WebSocket");

    client.subscribe(
      "/topic/notifications",
      (message) => {
        onMessageReceived(
          JSON.parse(message.body) as NotificationMessage
        );
      }
    );
  };

  client.onStompError = (frame) => {
    console.error(
      "Broker reported error: " +
        frame.headers["message"]
    );

    console.error(
      "Additional details: " + frame.body
    );
  };

  return client;
};