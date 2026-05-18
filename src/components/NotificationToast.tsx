import { useEffect, useState } from 'react';
import { createWebSocketClient } from '../services/notificationService';
import { Snackbar, Alert } from '@mui/material';

export const NotificationToast = () => {
  const [notification, setNotification] = useState<{ message: string } | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const client = createWebSocketClient((data) => {
      setNotification(data);
      setOpen(true);
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
        {notification?.message || 'Nueva notificación'}
      </Alert>
    </Snackbar>
  );
};