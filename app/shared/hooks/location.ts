import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { useAppDispatch } from './redux';
import { setLocation } from '@slices/app.slice';
import { Socket } from 'socket.io-client';

const useLocationUpdater = (
  socket: Socket | null,
  orderId: string | null,
  staffId: string | null,
  updateInterval = 5000
) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionGranted(status === 'granted');
    };

    requestPermission();
  }, []);

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
