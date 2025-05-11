import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { useAppDispatch, useAppSelector } from './redux';
import { setLocation } from '@slices/app.slice';
import { Socket } from 'socket.io-client';

export const useLocationPermission = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const requestPermission = useCallback(async () => {
    const { status: fgStatus, canAskAgain: fgCanAskAgain } =
      await Location.requestForegroundPermissionsAsync();

    if (fgStatus !== 'granted' && fgCanAskAgain) {
      const retry = await Location.requestForegroundPermissionsAsync();
      if (retry.status !== 'granted') {
        setPermissionGranted(false);
        return;
      }
    } else if (fgStatus !== 'granted') {
      setPermissionGranted(false);
      return;
    }

    // Foreground permission granted, now request background (Android only)
    const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();

    setPermissionGranted(bgStatus === 'granted');
  }, []);

  useEffect(() => {
    requestPermission();
  }, []);
  return {
    permissionGranted,
    requestPermission
  };
};

const useLocationUpdater = (
  socket: Socket | null,
  orderId?: string,
  permissionGranted = false,
  updateInterval = 5000
) => {
  const dispatch = useAppDispatch();
  const app = useAppSelector((state) => state.app);
  const auth = useAppSelector((state) => state.auth);
  const staffId = auth.userInfo?.id;
  const skip = auth.userInfo?.role !== 'STAFF' || !permissionGranted || !socket || !orderId;

  useEffect(() => {
    if (skip) return;

    const sendLocation = async () => {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest
        });
        const { latitude, longitude } = location.coords;

        console.log(
          `Sent location update: ${JSON.stringify({ orderId, staffId, latitude, longitude })}`
        );
        if (latitude !== app.location?.latitude || longitude !== app.location?.longitude) {
          dispatch(setLocation({ latitude, longitude }));
        }

        socket.emit('locationUpdate', {
          orderId,
          staffId,
          latitude,
          longitude
        });
      } catch (error) {
        if (app.location?.latitude && app.location?.longitude) {
          socket.emit('locationUpdate', {
            orderId,
            staffId,
            latitude: app.location?.latitude,
            longitude: app.location?.longitude
          });
        } else {
          console.error('Error getting location:', error);
        }
      }
    };

    const intervalId = setInterval(sendLocation, updateInterval);

    return () => clearInterval(intervalId);
  }, [permissionGranted, socket, orderId, staffId, updateInterval, dispatch]);
};

export default useLocationUpdater;
