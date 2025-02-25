import { getBrandIcon, getPamentMethodIcon } from 'app/shared/utils/getBrandIcon';
import { ImageSourcePropType } from 'react-native';
import { EcommerceBrand } from './status';

export const DOMITORIES = ['A', 'B'];
export const BUILDINGS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
export const ROOMS = [
  '100',
  '101',
  '102',
  '103',
  '200',
  '201',
  '202',
  '203',
  '300',
  '301',
  '302',
  '303',
  '400',
  '401',
  '402',
  '403'
];

export const DOMITORY_DATA = [
  {
    label: 'A',
    value: 'A'
  },
  {
    label: 'B',
    value: 'B'
  }
];

export const BUILDING_DATA = {
  A: [
    {
      label: 'A1',
      value: 'A1'
    },
    {
      label: 'A2',
      value: 'A2'
    },
    {
      label: 'A3',
      value: 'A3'
    },
    {
      label: 'A4',
      value: 'A4'
    },
    {
      label: 'A5',
      value: 'A5'
    },
    {
      label: 'A6',
      value: 'A6'
    },
    {
      label: 'A7',
      value: 'A7'
    },
    {
      label: 'A8',
      value: 'A8'
    },
    {
      label: 'A9',
      value: 'A9'
    },
    {
      label: 'A10',
      value: 'A10'
    },
    {
      label: 'A11',
      value: 'A11'
    },
    {
      label: 'A12',
      value: 'A12'
    },
    {
      label: 'A13',
      value: 'A13'
    },
    {
      label: 'A14',
      value: 'A14'
    },
    {
      label: 'A15',
      value: 'A15'
    },
    {
      label: 'A16',
      value: 'A16'
    },
    {
      label: 'A17',
      value: 'A17'
    },
    {
      label: 'A18',
      value: 'A18'
    },
    {
      label: 'A19',
      value: 'A19'
    },
    {
      label: 'A20',
      value: 'A20'
    },
    {
      label: 'AG3',
      value: 'AG3'
    },
    {
      label: 'AG4',
      value: 'AG4'
    },
    {
      label: 'AH1',
      value: 'AH1'
    },
    {
      label: 'AH2',
      value: 'AH2'
    }
  ],
  B: [
    {
      label: 'BA1',
      value: 'BA1'
    },
    {
      label: 'BA2',
      value: 'BA2'
    },
    {
      label: 'BA3',
      value: 'BA3'
    },
    {
      label: 'BA4',
      value: 'BA4'
    },
    {
      label: 'BA5',
      value: 'BA5'
    },

    {
      label: 'BB1',
      value: 'BB1'
    },
    {
      label: 'BB2',
      value: 'BB2'
    },
    {
      label: 'BB3',
      value: 'BB3'
    },
    {
      label: 'BB4',
      value: 'BB4'
    },
    {
      label: 'BB5',
      value: 'BB5'
    },
    {
      label: 'BC1',
      value: 'BC1'
    },
    {
      label: 'BC2',
      value: 'BC2'
    },
    {
      label: 'BC3',
      value: 'BC3'
    },
    {
      label: 'BC4',
      value: 'BC4'
    },
    {
      label: 'BC5',
      value: 'BC5'
    },
    {
      label: 'BC6',
      value: 'BC6'
    },
    {
      label: 'BD1',
      value: 'BD1'
    },
    {
      label: 'BD2',
      value: 'BD2'
    },
    {
      label: 'BD3',
      value: 'BD3'
    },
    {
      label: 'BD4',
      value: 'BD4'
    },
    {
      label: 'BD5',
      value: 'BD5'
    },
    {
      label: 'BD6',
      value: 'BD6'
    },
    {
      label: 'BE1',
      value: 'BE1'
    },
    {
      label: 'BE2',
      value: 'BE2'
    },
    {
      label: 'BE3',
      value: 'BE3'
    },
    {
      label: 'BE4',
      value: 'BE4'
    }
  ]
};

export const ROOM_DATA = [
  {
    label: '100',
    value: '100'
  },
  {
    label: '101',
    value: '101'
  },
  {
    label: '102',
    value: '102'
  },
  {
    label: '200',
    value: '200'
  },
  {
    label: '201',
    value: '201'
  },
  {
    label: '202',
    value: '202'
  },
  {
    label: '300',
    value: '300'
  },
  {
    label: '301',
    value: '301'
  },
  {
    label: '302',
    value: '302'
  }
];

export const PAYMENT_METHOD_DATA = [
  {
    label: 'Tiền mặt',
    value: 'CASH',
    image: getPamentMethodIcon('CASH')
  },
  {
    label: 'Chuyển khoản',
    value: 'CREDIT',
    image: getPamentMethodIcon('CREDIT')
  },
  {
    label: 'Momo',
    value: 'MOMO',
    image: getPamentMethodIcon('MOMO')
  }
];

export const ECOMMERCE_DATA = [
  {
    label: EcommerceBrand.SHOPEE,
    value: EcommerceBrand.SHOPEE,
    image: getBrandIcon(EcommerceBrand.SHOPEE)
  },
  {
    label: EcommerceBrand.LAZADA,
    value: EcommerceBrand.LAZADA,
    image: getBrandIcon(EcommerceBrand.LAZADA)
  },
  {
    label: EcommerceBrand.TIKI,
    value: EcommerceBrand.TIKI,
    image: getBrandIcon(EcommerceBrand.TIKI)
  },
  {
    label: EcommerceBrand.TIKTOK,
    value: EcommerceBrand.TIKTOK,
    image: getBrandIcon(EcommerceBrand.TIKTOK)
  },
  {
    label: EcommerceBrand.SENDO,
    value: EcommerceBrand.SENDO,
    image: getBrandIcon(EcommerceBrand.SENDO)
  },
  {
    label: EcommerceBrand.BACHHOAXANH,
    value: EcommerceBrand.BACHHOAXANH,
    image: getBrandIcon(EcommerceBrand.BACHHOAXANH)
  }
];
