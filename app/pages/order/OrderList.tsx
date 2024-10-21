import { useAppSelector } from '@hooks/redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OrderStackParamList } from 'app/types/navigation';
import { StaffOrderList } from './staff/StaffOrderList';
import { StudentOrderList } from './student/StudentOrderList';

export const OrderList = (props: NativeStackScreenProps<OrderStackParamList, 'OrderList'>) => {
  const auth = useAppSelector((state) => state.auth);
  return auth.userInfo?.role === 'STUDENT' ? (
    <StudentOrderList {...props} />
  ) : (
    <StaffOrderList {...props} />
  );
};
