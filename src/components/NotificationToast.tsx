import { Snackbar, Alert } from "@mui/material";

import {
  NotificationType,
} from "../services/websocketService";

interface Props {
  open: boolean;
  message: string;
  type?: NotificationType;
  onClose: () => void;
}

function NotificationToast({
  open,
  message,
  type = "info",
  onClose,
}: Props) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Alert
        severity={type}
        variant="filled"
        onClose={onClose}
        sx={{
          width: "100%",
          minWidth: 320,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default NotificationToast;