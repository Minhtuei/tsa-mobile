import { EcommerceBrand } from 'app/shared/constants/status';
import { ImageSourcePropType } from 'react-native';

const shopeeIcon = require('../../../assets/icons/Shopee.jpg') as ImageSourcePropType;
const lazadaIcon = require('../../../assets/icons/Lazada.png') as ImageSourcePropType;
const tikiIcon = require('../../../assets/icons/Tiki.png') as ImageSourcePropType;
const tikTokIcon = require('../../../assets/icons/Tiktok.png') as ImageSourcePropType;
const sendoIcon = require('../../../assets/icons/Sendo.png') as ImageSourcePropType;
const bachhoaxanhIcon = require('../../../assets/icons/Bachhoaxanh.png') as ImageSourcePropType;

const cashIcon = require('../../../assets/icons/Cash.png') as ImageSourcePropType;
const creditIcon = require('../../../assets/icons/Credit.png') as ImageSourcePropType;
const momoIcon = require('../../../assets/icons/Momo.png') as ImageSourcePropType;

export const getBrandIcon = (brand: string) => {
  switch (brand) {
    case 'Shopee':
      return shopeeIcon;
    case 'Lazada':
      return lazadaIcon;
    case 'Tiki':
      return tikiIcon;
    case 'TikTok':
      return tikTokIcon;
    case 'Sendo':
      return sendoIcon;
    case 'Bách hoá xanh':
      return bachhoaxanhIcon;
    default:
      return shopeeIcon;
  }
};

export const getPamentMethodIcon = (method: string) => {
  switch (method) {
    case 'CASH':
      return cashIcon;
    case 'CREDIT':
      return creditIcon;
    case 'MOMO':
      return momoIcon;
    default:
      return cashIcon;
  }
};

export const getBrandColor = (brand: string) => {
  switch (brand) {
    case EcommerceBrand.SHOPEE:
      return '#fe5a37';
    case EcommerceBrand.TIKTOK:
      return '#333';
    case EcommerceBrand.LAZADA:
      return '#000bb5';
    case EcommerceBrand.SENDO:
      return '#fe3636';
    case EcommerceBrand.TIKI:
      return '#27c7fe';
    case EcommerceBrand.BACHHOAXANH:
      return '#02ba4a';
    default:
      return 'gray';
  }
};
