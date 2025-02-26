import { DASHBOARD_HEADER_HEIGHT, SCREEN } from 'app/shared/constants/screen';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAppSelector } from 'app/shared/hooks/redux';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import Constants from 'expo-constants';
import { Image, ImageBackground, Platform, View } from 'react-native';
import { Text } from 'react-native-paper';
import HeaderLogo from '../../../assets/tsa-header.svg';
const BackgroundImg = require('../../../assets/header-background.png');
export const DashboardHeader = () => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();
  const auth = useAppSelector((state) => state.auth);
  return (
    <View>
      <ImageBackground
        source={BackgroundImg}
        style={[
          {
            width: SCREEN.width,
            height: DASHBOARD_HEADER_HEIGHT
          }
        ]}
      >
        <View
          style={[
            {
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -60
            },
            Platform.OS === 'ios' && {
              paddingTop: Constants.statusBarHeight
            }
          ]}
        >
          <HeaderLogo width={SCREEN.width / 2} height={SCREEN.width / 2} />
          <View
            style={[
              globalStyles.SurfaceContainer,
              {
                width: Platform.OS === 'ios' ? SCREEN.width * 0.8 : SCREEN.width * 0.9,
                alignItems: 'center',
                marginTop: 24,
                position: 'absolute',
                top: Platform.OS === 'android' ? '50%' : '75%',
                zIndex: 1
              }
            ]}
          >
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center',
                marginBottom: 16,
                paddingHorizontal: 16,
                paddingTop: 16
              }}
            >
              <View
                style={{
                  backgroundColor: theme.colors.primary,
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {auth.userInfo?.photoUrl ? (
                  <Image
                    source={{ uri: auth.userInfo?.photoUrl }}
                    style={{ width: 48, height: 48, borderRadius: 24 }}
                  />
                ) : (
                  <FontAwesome name='user' size={24} color='white' />
                )}
              </View>
              <View style={{ gap: 2, flex: 1 }}>
                <Text
                  style={[
                    globalStyles.text,
                    {
                      fontStyle: 'italic'
                    }
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
                      textTransform: 'capitalize'
                    }
                  ]}
                >{`${auth.userInfo?.lastName} ${auth.userInfo?.firstName}`}</Text>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
