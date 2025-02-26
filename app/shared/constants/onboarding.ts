import { ImageSourcePropType } from 'react-native';
const createFormImg: ImageSourcePropType = require('../../../assets/onboarding/onboarding_1.png');
const chooseLocationImg: ImageSourcePropType = require('../../../assets/onboarding/onboarding_2.png');
const paymentImg: ImageSourcePropType = require('../../../assets/onboarding/onboarding_3.png');
export const ONBOARDING_DATA = [
  {
    key: 1,
    title: 'Tạo đơn hàng',
    description: 'Sinh viên tiến hành nhập thông tin đơn hàng cần vận chuyển lên hệ thống',
    image: createFormImg
  },

  {
    key: 2,
    title: 'Chọn vị trí',
    description:
      'Lựa chọn vị trí giao đơn hàng để quản trị viên tiến hành chỉ định nhân viên giao hàng',
    image: chooseLocationImg
  },
  {
    key: 3,
    title: 'Thanh toán',
    description: 'Lựa chọn phương thức thanh toán phù hợp',
    image: paymentImg
  }
];
export type OnboardingDataType = (typeof ONBOARDING_DATA)[number];
