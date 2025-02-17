import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Mapbox, {
  Camera,
  MapView,
  ShapeSource,
  SymbolLayer,
  Images,
  LineLayer,
  CircleLayer
} from '@rnmapbox/maps';
import { getDirection } from 'app/shared/utils/getDirection';
import { coordinateList } from 'app/shared/constants/coordinate';
import { SCREEN } from 'app/shared/constants/screen';
import { Order } from 'app/shared/types/order';
import { useSocketContext } from 'app/shared/context/SocketContext';

Mapbox.setAccessToken((process.env.EXPO_MAPBOX_ACCESS_TOKEN as string) || '');
Mapbox.setTelemetryEnabled(false);

const shipperLogo = require('../../../../assets/shipperBackground.png');
const studentLogo = require('../../../../assets/student.png');
const wareHouseLogo = require('../../../../assets/warehouse.png');

interface OrderMapProps {
  order: Order;
  setDistance: (distance: string) => void;
}

const OrderMap: React.FC<OrderMapProps> = ({ order, setDistance }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const { socket } = useSocketContext();

  const [shipperCoordinate, setShipperCoordinate] = useState<[number, number]>([
    106.80712035274313, 10.878177113714147
  ]);
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
    const fetchDirection = async () => {
      try {
        if (shipperCoordinate && studentCoordinate) {
          const direction = await getDirection(shipperCoordinate, studentCoordinate);
          setRouteCoordinates(direction.routes[0].geometry.coordinates);
          setDistance(direction.routes[0].distance);
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
    if (socket && order.shipperId) {
      socket.emit('subscribeToShipper', { shipperId: order.shipperId });
      console.log(`Subscribed to shipper with ID ${order.shipperId}`);

      socket.on(
        'locationUpdate',
        (data: { shipperId: string; latitude: number; longitude: number; isFinished: boolean }) => {
          setShipperCoordinate([Number(data.longitude), Number(data.latitude)]);
          console.log(`Received location update: ${JSON.stringify(data)}`);
          if (data.isFinished) {
          }
        }
      );
      return () => {
        socket.off('locationUpdate');
        socket.emit('unsubscribeToShipper', { shipperId: order.shipperId });
        console.log(`Unsubscribed to shipper with ID ${order.shipperId}`);
      };
    }
  }, [socket, order.shipperId]);

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
        {mapLoaded && (
          <Camera
            zoomLevel={17}
            centerCoordinate={studentCoordinate}
            animationMode={'easeTo'}
            animationDuration={3000}
            pitch={60}
          />
        )}
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
              <ShapeSource id='shipper' shape={{ type: 'Point', coordinates: shipperCoordinate }}>
                <SymbolLayer id='shipper-icons' style={{ iconImage: 'shipper', iconSize: 0.05 }} />
              </ShapeSource>
            ) : (
              <ShapeSource id='warehouse' shape={{ type: 'Point', coordinates: shipperCoordinate }}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SCREEN.height,
    width: SCREEN.width
  },
  map: {
    flex: 1
  }
});

export default OrderMap;
