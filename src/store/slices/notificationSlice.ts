import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NotificationType =
  | "success"
  | "info"
  | "warning"
  | "error";

export interface NotificationItem {
  id: string;
  title?: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
}

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notifications",

  initialState,

  reducers: {
    addNotification: (
      state,
      action: PayloadAction<
        Omit<NotificationItem, "id" | "timestamp" | "read">
      >
    ) => {
      const notification: NotificationItem = {
        id: crypto.randomUUID(),

        timestamp: new Date().toISOString(),

        read: false,

        type: action.payload.type || "info",

        title: action.payload.title,

        message: action.payload.message,
      };

      state.notifications.unshift(notification);

      state.unreadCount += 1;
    },

    markAllAsRead: (state) => {
      state.notifications = state.notifications.map(
        (notification) => ({
          ...notification,
          read: true,
        })
      );

      state.unreadCount = 0;
    },

    clearNotifications: (state) => {
      state.notifications = [];

      state.unreadCount = 0;
    },
  },
});

export const {
  addNotification,
  markAllAsRead,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;