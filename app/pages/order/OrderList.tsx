import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OrderStackParamList } from 'app/types/navigation';
import { StudentOrderList } from './student/StudentOrderList';

export const OrderList = (props: NativeStackScreenProps<OrderStackParamList, 'OrderList'>) => {
  return <StudentOrderList {...props} />;
};
