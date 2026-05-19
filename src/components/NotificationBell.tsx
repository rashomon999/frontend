import { useState } from "react";

import {
  Badge,
  IconButton,
  Menu,
  Typography,
  Box,
  Divider,
  Button,
  Chip,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";

import { useNotifications } from "../hooks/useNotifications";

function NotificationBell() {
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    clearNotifications,
  } = useNotifications();

  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);

    if (unreadCount > 0) {
      markAllAsRead();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getChipColor = (
    type: string
  ):
    | "success"
    | "info"
    | "warning"
    | "error"
    | "default" => {
    switch (type) {
      case "success":
        return "success";

      case "warning":
        return "warning";

      case "error":
        return "error";

      default:
        return "info";
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleOpen}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: 380,
              maxHeight: 500,
            },
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold" }}
          >
            Notificaciones
          </Typography>

          {notifications.length > 0 && (
            <Button
              size="small"
              color="error"
              onClick={clearNotifications}
            >
              Limpiar
            </Button>
          )}
        </Box>

        <Divider />

        {notifications.length === 0 ? (
          <Box
            sx={{
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              No tienes notificaciones
            </Typography>
          </Box>
        ) : (
          notifications.map(
            (notification) => (
              <Box
                key={notification.id}
                sx={{
                  p: 2,
                  borderBottom:
                    "1px solid #f0f0f0",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    {notification.title ||
                      "Notificación"}
                  </Typography>

                  <Chip
                    label={notification.type}
                    size="small"
                    color={getChipColor(
                      notification.type
                    )}
                  />
                </Box>

                <Typography
                  variant="body2"
                  sx={{ mb: 1 }}
                >
                  {notification.message}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {new Date(
                    notification.timestamp
                  ).toLocaleString()}
                </Typography>
              </Box>
            )
          )
        )}
      </Menu>
    </>
  );
}

export default NotificationBell;