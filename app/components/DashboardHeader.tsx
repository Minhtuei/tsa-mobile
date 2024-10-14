import QueryTypeBtnTab from '@components/QueryTypeBtnTab';
import { DASHBOARD_HEADER_HEIGHT, SCREEN } from '@constants/screen';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Animated, ImageBackground, Platform, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import InfoCard from '../pages/home/InfoCard';
const BackgroundImg = require('../../assets/header-background.png');
import HeaderLogo from '../../assets/tsa-header.svg';
import { useAppSelector } from '@hooks/redux';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import Constants from 'expo-constants';
import { useState } from 'react';
export const DashboardHeader = ({
  opacity,
  animation,
}: {
  opacity: Animated.AnimatedInterpolation<string | number>;
  animation: any;
}) => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();
  const auth = useAppSelector((state) => state.auth);
  const [selectedType, setSelectedType] = useState<
    'today' | 'yesterday' | 'week' | 'month'
  >('today');
  const AnimatedImageBackground =
    Animated.createAnimatedComponent(ImageBackground);
  return (
    <View style={{ height: SCREEN.height / 2 }}>
      <AnimatedImageBackground
        source={BackgroundImg}
        style={[
          {
            width: SCREEN.width,
            height: DASHBOARD_HEADER_HEIGHT,
          },
          animation,
        ]}
      >
        <View
          style={[
            {
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -60,
            },
            Platform.OS === 'ios' && {
              paddingTop: Constants.statusBarHeight,
            },
          ]}
        >
          <HeaderLogo width={SCREEN.width / 2} height={SCREEN.width / 2} />
          <Animated.View
            style={[
              globalStyles.SurfaceContainer,
              {
                width:
                  Platform.OS === 'ios'
                    ? SCREEN.width * 0.8
                    : SCREEN.width * 0.9,
                alignItems: 'center',
                marginTop: 24,
                position: 'absolute',
                top: Platform.OS === 'android' ? '50%' : '75%',
                zIndex: 1,
                opacity,
              },
            ]}
          >
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center',
                marginBottom: 16,
                paddingHorizontal: 16,
                paddingTop: 16,
              }}
            >
              <View
                style={{
                  backgroundColor: theme.colors.primary,
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FontAwesome
                  name="user"
                  size={24}
                  color={theme.colors.onPrimary}
                />
              </View>
              <View style={{ gap: 2, flex: 1 }}>
                <Text
                  style={[
                    globalStyles.text,
                    {
                      fontStyle: 'italic',
                    },
                  ]}
                >
                  Xin chào,
                </Text>
                <Text
                  style={[
                    globalStyles.text,
                    {
                      fontWeight: 'bold',
                      fontSize: 18,
                      textTransform: 'capitalize',
                    },
                  ]}
                >{`${auth.userInfo?.lastName} ${auth.userInfo?.firstName}`}</Text>
              </View>
              <FontAwesome name="bell" size={24} color={theme.colors.primary} />
            </View>
            <QueryTypeBtnTab
              selectedType={selectedType}
              setSelectedType={setSelectedType}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                flexWrap: 'wrap',
                padding: 16,
              }}
            >
              <InfoCard iconName="account-box" itemName="Đơn hàng" value={25} />
              <InfoCard
                iconName="attach-money"
                itemName="Phí Ship"
                value={Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(250000)}
              />
            </View>
          </Animated.View>
        </View>
      </AnimatedImageBackground>
    </View>
  );
};
