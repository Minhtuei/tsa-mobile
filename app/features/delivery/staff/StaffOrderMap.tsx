import { coordinateList } from 'app/shared/constants/coordinate';
import { SCREEN } from 'app/shared/constants/screen';
import Mapbox, {
  Camera,
  CircleLayer,
  Images,
  LineLayer,
  MapView,
  ShapeSource,
  SymbolLayer
} from '@rnmapbox/maps';
import { getDirection } from 'app/shared/utils/getDirection';
import { useSocketContext } from 'app/shared/context/SocketContext';
import { DeliverOrderDetail } from 'app/shared/state/delivery.slice';
import * as Location from 'expo-location';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

Mapbox.setAccessToken((process.env.EXPO_MAPBOX_ACCESS_TOKEN as string) || '');
Mapbox.setTelemetryEnabled(false);

const shipperLogo = require('../../../../assets/shipperBackground.png');
const studentLogo = require('../../../../assets/student.png');
const wareHouseLogo = require('../../../../assets/warehouse.png');

interface StaffOrderMapProps {
  order: DeliverOrderDetail;
  setDistance: (distance: string) => void;
}

export const StaffOrderMap: React.FC<StaffOrderMapProps> = memo(function StaffOrderMap({
  order,
  setDistance
}) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const { socket } = useSocketContext();

  const [shipperCoordinate, setShipperCoordinate] = useState<[number, number] | null>(null);
  const studentCoordinate = useMemo(() => {
    const foundCoordinate = coordinateList.find((coordinate) => {
      return order.building === coordinate.address[0] && order.dormitory === coordinate.address[1];
    });
    if (!foundCoordinate) {
      return [106.80712035274313, 10.878177113714147];
    }
    return [foundCoordinate.value[1], foundCoordinate.value[0]];
  }, [order, coordinateList]);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    const fetchDirection = async () => {
      try {
        if (shipperCoordinate && studentCoordinate) {
          const direction = await getDirection(shipperCoordinate, studentCoordinate);
          if (
            direction &&
            direction.routes &&
            direction.routes[0] &&
            direction.routes[0].geometry &&
            direction.routes[0].geometry.coordinates
          ) {
            setRouteCoordinates(direction.routes[0].geometry.coordinates);
            setDistance(direction.routes[0].distance.toString());
          } else {
            console.error('Invalid direction response:', direction);
          }
        }
      } catch (error) {
        console.error('Error fetching direction:', error);
      }
    };

    if (shipperCoordinate && studentCoordinate) {
      fetchDirection();
    }
  }, [shipperCoordinate, studentCoordinate]);

  useEffect(() => {
    const sendLocation = async () => {
      if (socket) {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest
        });
        console.log([location.coords.longitude, location.coords.latitude]);
        setShipperCoordinate([location.coords.longitude, location.coords.latitude]);
        socket.emit('locationUpdate', {
          orderId: order.id,
          staffId: order.shipperId,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
        // console.log(`Sent location update: ${JSON.stringify(shipperCoordinate)}`);
      }
    };

    // sendLocation();

    const intervalId = setInterval(() => {
      sendLocation();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [socket, shipperCoordinate, order.shipperId, order.id]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        zoomEnabled={true}
        styleURL='mapbox://styles/quancao2310/cm2zqn7lb000a01o25jafeyvq'
        onDidFinishLoadingMap={() => {
          setMapLoaded(true);
        }}
      >
        <Camera
          zoomLevel={17}
          centerCoordinate={studentCoordinate}
          animationMode={'easeTo'}
          animationDuration={3000}
          pitch={20}
        />
        {mapLoaded && routeCoordinates && (
          <ShapeSource
            id='routeSource'
            lineMetrics={true}
            shape={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates
              },
              properties: {}
            }}
          >
            <LineLayer
              id='routeFill'
              style={{
                lineColor: 'red',
                lineWidth: 3,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          </ShapeSource>
        )}
        {mapLoaded && (
          <>
            <ShapeSource id='student' shape={{ type: 'Point', coordinates: studentCoordinate }}>
              <SymbolLayer id='student-icons' style={{ iconImage: 'student', iconSize: 0.08 }} />
              <CircleLayer
                id='student-radius'
                style={{
                  circleRadius: 50,
                  circleColor: 'rgba(0, 122, 255, 0.3)',
                  circleStrokeWidth: 2,
                  circleStrokeColor: 'rgba(0, 122, 255, 0.5)'
                }}
              />
            </ShapeSource>

            {order.latestStatus === 'IN_TRANSPORT' ? (
              <ShapeSource
                id='shipper'
                shape={{ type: 'Point', coordinates: shipperCoordinate || [0, 0] }}
              >
                <SymbolLayer id='shipper-icons' style={{ iconImage: 'shipper', iconSize: 0.05 }} />
              </ShapeSource>
            ) : (
              <ShapeSource
                id='warehouse'
                shape={{ type: 'Point', coordinates: shipperCoordinate || [0, 0] }}
              >
                <SymbolLayer
                  id='warehouse-icons'
                  style={{ iconImage: 'warehouse', iconSize: 0.2 }}
                />
              </ShapeSource>
            )}
            <Images
              images={{ shipper: shipperLogo, student: studentLogo, warehouse: wareHouseLogo }}
            />
          </>
        )}
      </MapView>
      {/* <View>
        <Text>{JSON.stringify(shipperCoordinate)}</Text>
        <Text>{JSON.stringify(studentCoordinate)}</Text>
      </View> */}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: SCREEN.height,
    width: SCREEN.width
  },
  map: {
    flex: 1
  }
});
