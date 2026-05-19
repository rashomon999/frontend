import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../store";

import {
  addNotification,
  markAllAsRead,
  clearNotifications,
} from "../store/slices/notificationSlice";

export function useNotifications() {
  const dispatch = useDispatch();

  const notifications = useSelector(
    (state: RootState) =>
      state.notifications.notifications
  );

  const unreadCount = useSelector(
    (state: RootState) =>
      state.notifications.unreadCount
  );

  return {
    notifications,

    unreadCount,

    addNotification: (
      title: string,
      message: string,
      type:
        | "success"
        | "info"
        | "warning"
        | "error" = "info"
    ) =>
      dispatch(
        addNotification({
          title,
          message,
          type,
        })
      ),

    markAllAsRead: () =>
      dispatch(markAllAsRead()),

    clearNotifications: () =>
      dispatch(clearNotifications()),
  };
}