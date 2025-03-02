import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { useAppDispatch } from './redux';
import { setLocation } from '@slices/app.slice';
import { Socket } from 'socket.io-client';

export const useLocationPermission = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const requestPermission = useCallback(async () => {
    const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      setPermissionGranted(true);
    } else if (canAskAgain) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionGranted(status === 'granted');
    } else {
      setPermissionGranted(false);
    }
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
  staffId?: string,
  updateInterval = 5000
) => {
  const dispatch = useAppDispatch();
  const { permissionGranted } = useLocationPermission();
  console.log('permissionGranted', permissionGranted);
  useEffect(() => {
    if (!permissionGranted || !socket || !orderId || !staffId) return;

    const sendLocation = async () => {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest
        });
        const { latitude, longitude } = location.coords;

        console.log(
          `Sent location update: ${JSON.stringify({ orderId, staffId, latitude, longitude })}`
        );

        dispatch(setLocation({ latitude, longitude }));

        socket.emit('locationUpdate', {
          orderId,
          staffId,
          latitude,
          longitude
        });
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    const intervalId = setInterval(sendLocation, updateInterval);

    return () => clearInterval(intervalId);
  }, [permissionGranted, socket, orderId, staffId, updateInterval, dispatch]);
};

export default useLocationUpdater;
