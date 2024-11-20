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
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { getDirection } from '@utils/getDirection';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Avatar, Button, IconButton, Text } from 'react-native-paper';
import { useAppDispatch } from '@hooks/redux';
import { setHideTabBar } from '@slices/app.slice';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import OrderStatusStepIndicator from '../components/OrderStatusStepIndicator';
Mapbox.setAccessToken((process.env.EXPO_MAPBOX_ACCESS_TOKEN as string) || '');
Mapbox.setTelemetryEnabled(false);

const shipper = require('../../../../assets/shipperBackground.png'); // Ensure the correct path and file type

export const TrackOrder = (props: NativeStackScreenProps<OrderStackParamList, 'TrackOrder'>) => {
  const order = props.route.params.order;
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const shipperCoordinate = [106.80660217405375, 10.877388183554231];
  const studentCoordinate = [106.80703872956525, 10.878102666077439];
  const [direction, setDirection] = useState<any>(null);
  const snapPoints = useMemo(() => ['5%', '40%', '90%'], []);
  const dispatch = useAppDispatch();
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

  useEffect(() => {
    dispatch(setHideTabBar(true));
    return () => {
      dispatch(setHideTabBar(false));
    };
  }, [dispatch]);

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          zoomEnabled={true}
          styleURL='mapbox://styles/quancao2310/cm2zqn7lb000a01o25jafeyvq'
        >
          <Camera
            zoomLevel={18}
            centerCoordinate={studentCoordinate}
            animationMode={'flyTo'}
            animationDuration={3000}
            pitch={60}
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
      <BottomSheet index={1} snapPoints={snapPoints}>
        <BottomSheetView style={{ padding: 12, gap: 8 }}>
          <View
            style={[
              {
                padding: 16,
                borderRadius: 8,
                gap: 8,
                borderWidth: 1
              }
            ]}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.colors.outlineVariant,
                marginHorizontal: -16,
                marginTop: -16
              }}
            >
              <Text style={[globalStyles.text, { fontWeight: 'bold', padding: 16 }]}>
                Nhân viên đang đến
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar.Image
                size={36}
                source={{ uri: 'https://i.pravatar.cc/300' }}
                style={{ marginRight: 16 }}
              />
              <Text
                style={[
                  globalStyles.text,
                  {
                    fontWeight: 'semibold'
                  }
                ]}
              >
                Trần Nguyễn Minh Tuệ
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Button
                icon={'chat'}
                mode='contained'
                disabled
                style={{ flex: 0.95 }}
                onPress={() => {
                  // props.navigation.navigate('Chat', { user: shipper });
                }}
              >
                Chat với nhân viên
              </Button>
              <IconButton
                icon={'phone'}
                size={24}
                onPress={() => {
                  Linking.openURL(`tel:${'0123456789'}`);
                }}
                mode='outlined'
              />
            </View>
          </View>
          <OrderStatusStepIndicator historyTime={order.historyTime} />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  container: {
    height: SCREEN.height,
    width: SCREEN.width
  },
  map: {
    flex: 1
  }
});

export default TrackOrder;
