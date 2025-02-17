import { Delivery } from 'app/shared/state/delivery.slice';
import { Order, OrderStatus } from 'app/shared/state/order.slice';
import { Report } from 'app/shared/state/report.slice';
import { DeliveryStatus } from 'app/shared/types/delivery';
import { PaymentMethod } from 'app/shared/types/order';
import { ReportStatus } from 'app/shared/types/report';

export const AddressData = {
  dormitories: ['A', 'B'],
  buildings: {
    A: [
      'A1',
      'A2',
      'A3',
      'A4',
      'A5',
      'A6',
      'A7',
      'A8',
      'A9',
      'A10',
      'A11',
      'A12',
      'A13',
      'A14',
      'A15',
      'A16',
      'A17',
      'A18',
      'A19',
      'A20',
      'AG1',
      'AG2',
      'AH1',
      'AH2'
    ],
    B: [
      'B1',
      'B2',
      'B3',
      'B4',
      'B5',
      'B6',
      'B7',
      'B8',
      'B9',
      'B10',
      'B11',
      'B12',
      'B13',
      'B14',
      'B15',
      'B16',
      'B17',
      'B18',
      'B19',
      'B20',
      'BG1',
      'BG2',
      'BH1',
      'BH2'
    ]
  },
  rooms: ['100', '101', '102', '200', '201', '202', '300', '301', '302']
};

// Generating mock reports
export const initialReportList: Report[] = [];

const getRandomContent = (): string => {
  const contents = [
    'Lorem ipsum dolor sit amet.',
    'Consectetur adipiscing elit.',
    'Sed do eiusmod tempor incididunt.',
    'Ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam.'
  ];
  return contents[Math.floor(Math.random() * contents.length)];
};

const getRandomImageUrl = (): string => {
  const images = [
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/200',
    'https://via.placeholder.com/250',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/350'
  ];
  return images[Math.floor(Math.random() * images.length)];
};

const getRandomUUID = (): string => {
  return 'chovy123';
};

const getRandomReportStatus = (): ReportStatus => {
  const statuses: ReportStatus[] = ['PENDING', 'REPLIED'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const generateReportsForMonth = (year: number, month: number) => {
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dayString = day.toString().padStart(2, '0');
    const date = new Date(`${year}-${month.toString().padStart(2, '0')}-${dayString}T00:00:00Z`);
    const unixTimestamp = Math.floor(date.getTime() / 1000);

    initialReportList.push({
      id: `${year}-${month}-${day}`,
      orderId: `${year}-${month}-${day}`,
      orderCode: `${year}-${month}-${day}`,
      reportedAt: unixTimestamp.toString(),
      content: getRandomContent(),
      proof: getRandomImageUrl(),
      reply: getRandomContent(),
      repliedAt: unixTimestamp.toString(),
      status: getRandomReportStatus(),
      replierId: getRandomUUID(),
      studentId: getRandomUUID()
    });
  }
};

// Example usage
for (let month = 1; month <= 12; month++) {
  generateReportsForMonth(2024, month);
}

// Generating mock orders
export const initialOrderList: Order[] = [];

const getRandomOrderStatus = (): OrderStatus => {
  const statuses: OrderStatus[] = ['CANCELLED', 'DELIVERED', 'PENDING', 'REJECTED', 'IN_TRANSPORT'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const getRandomPaymentMethod = (): PaymentMethod => {
  const methods: PaymentMethod[] = ['CASH', 'MOMO', 'CREDIT'];
  return methods[Math.floor(Math.random() * methods.length)];
};

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const generateOrdersForMonth = (year: number, month: number) => {
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dayString = day.toString().padStart(2, '0');
    const randomShippingFee = Math.floor(Math.random() * 10000) + 1000;
    const date = new Date(`${year}-${month.toString().padStart(2, '0')}-${dayString}T00:00:00Z`);
    const unixTimestamp = Math.floor(date.getTime() / 1000);
    const randomIsPaid = Math.random() > 0.5 ? true : false;

    const dormitory = getRandomElement(AddressData.dormitories);
    const building = getRandomElement(
      AddressData.buildings[dormitory as keyof typeof AddressData.buildings]
    );
    const room = getRandomElement(AddressData.rooms);

    initialOrderList.push({
      id: `${year}-${month}-${day}`,
      checkCode: (123456 + initialOrderList.length).toString(),
      product: 'Bánh mì',
      room,
      building,
      dormitory,
      weight: 2,
      deliveryDate: unixTimestamp.toString(),
      shippingFee: randomShippingFee,
      paymentMethod: getRandomPaymentMethod(),
      isPaid: randomIsPaid,
      latestStatus: getRandomOrderStatus(),
      historyTime: [
        {
          id: `${year}-${month}-${day}`,
          orderId: `${year}-${month}-${day}`,
          time: unixTimestamp.toString(),
          status: 'PENDING'
        }
      ]
    });
  }
};

for (let month = 1; month <= 12; month++) {
  generateOrdersForMonth(2024, month);
}

// Generating mock deliveries
export const initialDeliveryList: Delivery[] = [];

const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomValueInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const toUnixTimestamp = (date: Date): string => {
  return Math.floor(date.getTime() / 1000).toString();
};

const generateDeliveryList = (length: number): Delivery[] => {
  for (let i = 0; i < length; i++) {
    const createdAtDate = getRandomDate(new Date(2022, 0, 1), new Date(2022, 11, 31));
    const deliveryAtDate = new Date(createdAtDate);
    deliveryAtDate.setDate(createdAtDate.getDate() + 1);

    const delivery: Delivery = {
      id: i.toString(),
      createdAt: toUnixTimestamp(createdAtDate),
      deliveryAt: toUnixTimestamp(deliveryAtDate),
      delayTime: getRandomValueInRange(3, 5),
      limitTime: getRandomValueInRange(10, 20),
      status: getRandomDeliveryStatus(),
      orders: initialOrderList,
      staffId: i.toString()
    };

    initialDeliveryList.push(delivery);
  }
  return initialDeliveryList;
};

const getRandomDeliveryStatus = (): DeliveryStatus => {
  const statuses: DeliveryStatus[] = ['FINISHED', 'ACCEPTED', 'PENDING', 'CANCELED'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

generateDeliveryList(20);
