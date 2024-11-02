import { SCREEN } from '@constants/screen';
import Mapbox, {
  Camera,
  MapView,
  PointAnnotation,
  ShapeSource,
  SymbolLayer,
  Images,
  LineLayer
} from '@rnmapbox/maps';
import { OrderStackParamList } from 'app/types/navigation';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { getDirection } from '@utils/getDirection';
import BottomSheet from '@gorhom/bottom-sheet';
import { Text } from 'react-native-paper';

Mapbox.setAccessToken((process.env.EXPO_MAPBOX_ACCESS_TOKEN as string) || '');
Mapbox.setTelemetryEnabled(false);

const shipper = require('../../../../assets/shipperBackground.png'); // Ensure the correct path and file type

export const TrackOrder = (props: NativeStackScreenProps<OrderStackParamList, 'TrackOrder'>) => {
  const shipperCoordinate = [106.80660217405375, 10.877388183554231];
  const studentCoordinate = [106.80703872956525, 10.878102666077439];
  const [direction, setDirection] = useState<any>(null);

  const fetchDirection = async () => {
    try {
      const direction = await getDirection(studentCoordinate, shipperCoordinate);
      setDirection(direction);
    } catch (error) {
      console.error('Error fetching direction:', error);
    }
  };

  useEffect(() => {
    fetchDirection();
  }, []);

  const directionCoordinates = direction?.routes[0]?.geometry?.coordinates;
  const snapPoints = useMemo(() => ['20%', '50%'], []);
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          zoomEnabled={true}
          styleURL='mapbox://styles/mapbox/streets-v12'
        >
          <Camera
            zoomLevel={18}
            centerCoordinate={studentCoordinate}
            animationMode={'flyTo'}
            animationDuration={3000}
            pitch={75}
          />
          {directionCoordinates && (
            <ShapeSource
              id='routeSource'
              lineMetrics={true}
              shape={{
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: directionCoordinates
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
          <PointAnnotation id='marker' coordinate={studentCoordinate}>
            <View />
          </PointAnnotation>
          <ShapeSource id='shipper' shape={{ type: 'Point', coordinates: shipperCoordinate }}>
            <SymbolLayer id='shipper-icons' style={{ iconImage: 'shipper', iconSize: 0.05 }} />
          </ShapeSource>
          <Images images={{ shipper: shipper }} />
        </MapView>
      </View>
      {/* <BottomSheet 

      snapPoints={snapPoints}>
        <View>
          <Text>BottomSheet Content</Text>
        </View>
      </BottomSheet> */}
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    height: SCREEN.height,
    width: SCREEN.width
  },
  map: {
    flex: 1
  }
});
