import { yupResolver } from '@hookform/resolvers/yup';
import { useAppTheme } from '@hooks/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCreateOrdersMutation } from '@services/order.service';
import { useCreatePayOSPaymentMutation } from '@services/payment.service';
import { createOrderSchema, CreateOrderSchemaType } from '@validations/order.schema';
import { OrderStackParamList } from 'app/types/navigation';
import moment from 'moment';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import Toast from 'react-native-root-toast';

export const OrderPayment = (
  props: NativeStackScreenProps<OrderStackParamList, 'OrderPayment'>
) => {
  const theme = useAppTheme();
  const [createOrder, { isLoading }] = useCreateOrdersMutation();
  const [getLinkPayment, { isLoading: isGettingLink }] = useCreatePayOSPaymentMutation();
  const { handleSubmit } = useForm<CreateOrderSchemaType>({
    resolver: yupResolver(createOrderSchema),
    defaultValues: props.route.params.order
  });
  const onSubmit = (data: CreateOrderSchemaType) => {
    const { time, ...rest } = data;
    const validateData = {
      ...rest,
      deliveryDate: moment(data.deliveryDate + ' ' + time)
        .format('YYYY-MM-DDTHH:mm')
        .toString(),
      weight: parseFloat(data.weight.replace(',', '.'))
    };
    createOrder(validateData)
      .unwrap()
      .then(() => {
        Toast.show('Tạo đơn hàng thành công', {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: theme.colors.success,
          textColor: theme.colors.onSuccess
        });
        props.navigation.navigate('OrderList');
      })
      .catch(() => {
        Toast.show('Tạo đơn hàng thất bại', {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: theme.colors.error,
          textColor: theme.colors.onError
        });
      });
  };
  useEffect(() => {
    getLinkPayment({
      amount: 5000,
      description: 'Thanh toán đơn hàng',
      returnUrl: 'localhost:3000',
      cancelUrl: 'localhost:3000'
    })
      .unwrap()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            Vui lòng thanh toán đơn hàng trước
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
