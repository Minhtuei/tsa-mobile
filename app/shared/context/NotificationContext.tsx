import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import { Subscription } from 'expo-modules-core';
import { registerForPushNotificationsAsync } from '@services/pushNotification.service';

interface NotificationContextType {
  deviceToken: string | undefined;
  notification: Notifications.Notification | null;
  error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [deviceToken, setDeviceToken] = useState<string | undefined>(undefined);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => setDeviceToken(token),
      (error) => setError(error)
    );

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('🔔 Notification Received: ', notification);
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(
        '🔔 Notification Response: ',
        JSON.stringify(response, null, 2),
        JSON.stringify(response.notification.request.content.data, null, 2)
      );
      // Handle the notification response here
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ deviceToken, notification, error }}>
      {children}
    </NotificationContext.Provider>
  );
};
