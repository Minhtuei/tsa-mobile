import { ImageSourcePropType } from 'react-native';

const shopeeIcon = require('../../assets/icons/Shopee.jpg') as ImageSourcePropType;
const lazadaIcon = require('../../assets/icons/Lazada.png') as ImageSourcePropType;
const tikiIcon = require('../../assets/icons/Tiki.png') as ImageSourcePropType;
const tikTokIcon = require('../../assets/icons/Tiktok.png') as ImageSourcePropType;
const sendoIcon = require('../../assets/icons/Sendo.png') as ImageSourcePropType;
const bachhoaxanhIcon = require('../../assets/icons/Bachhoaxanh.png') as ImageSourcePropType;

const cashIcon = require('../../assets/icons/Cash.png') as ImageSourcePropType;
const creditIcon = require('../../assets/icons/Credit.png') as ImageSourcePropType;
const momoIcon = require('../../assets/icons/Momo.png') as ImageSourcePropType;

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
    case 'Bachhoaxanh':
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
