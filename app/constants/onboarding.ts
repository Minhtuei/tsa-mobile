import { ImageSourcePropType } from 'react-native';
import { Image } from 'react-native';
export const ONBOARDING_DATA = [
  {
    title: 'Tạo đơn hàng',
    subtitle:
      'Sinh viên tiến hành nhập thông tin đơn hàng cần vận chuyển lên hệ thống',
    imageUri: Image.resolveAssetSource(require('../../assets/onboarding/onboarding_1.png')).uri
  },

  {
    title: 'Chọn vị trí',
    subtitle:
      'Lựa chọn vị trí giao đơn hàng để quản trị viên tiến hành chỉ định nhân viên giao hàng',
    imageUri: Image.resolveAssetSource(require('../../assets/onboarding/onboarding_2.png')).uri,
  },
  {
    title: 'Thanh toán',
    subtitle: 'Lựa chọn phương thức thanh toán phù hợp để thanh toán đơn hàng',
    imageUri: Image.resolveAssetSource(require('../../assets/onboarding/onboarding_3.png')).uri,
  },
];
export type OnboardingDataType = (typeof ONBOARDING_DATA)[number];
