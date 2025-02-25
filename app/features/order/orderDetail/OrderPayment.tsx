import { useAppTheme } from 'app/shared/hooks/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { formatVNDcurrency } from 'app/shared/utils/format';
import { useSocketContext } from 'app/shared/context/SocketContext';
import { useCreateOrdersMutation } from 'app/features/order/api/order.api';
import { useCreatePayOSPaymentMutation } from 'app/features/order/api/payment.api';
import { OrderStackParamList } from 'app/shared/types/navigation';
import * as Clipboard from 'expo-clipboard';
import { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, IconButton, Text } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import Toast from 'react-native-root-toast';
const VietQrLogo = require('../../../../assets/icons/VietQr.png');
export const OrderPayment = (
  props: NativeStackScreenProps<OrderStackParamList, 'OrderPayment'>
) => {
  const theme = useAppTheme();
  const order = props.route.params.order;
  const [createOrder, { isLoading }] = useCreateOrdersMutation();
  const [getLinkPayment, { isLoading: isGettingLink }] = useCreatePayOSPaymentMutation();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [gotLink, setGotLink] = useState(false);
  const { socket } = useSocketContext();

  const getPayment = useCallback(() => {
    getLinkPayment({
      amount: order.remainingAmount!,
      description: `Thanh toán đơn hàng`,
      returnUrl: 'localhost:3000',
      cancelUrl: 'localhost:3000',
      orderId: order.id
    })
      .unwrap()
      .then((res) => {
        setAmount(res.paymentLink.amount);
        setAccountNumber(res.paymentLink.accountNumber);
        setDescription(res.paymentLink.description);
        // const qrCodeLink = getVietQrCodeLink({
        //   amount: res.paymentLink.amount,
        //   bankBin: res.paymentLink.bin,
        //   description: res.paymentLink.description,
        //   accountNumber: res.paymentLink.accountNumber
        // });
        setGotLink(true);
        setQrCodeUrl(res.paymentLink.qrCode);
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
  }, [getLinkPayment]);
  const copyToClipboard = useCallback(async (text: string) => {
    await Clipboard.setStringAsync(text);
    Toast.show('Đã sao chép', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      backgroundColor: theme.colors.primary,
      textColor: theme.colors.onPrimary
    });
  }, []);
  useEffect(() => {
    if (socket && order.id && gotLink) {
      const paymentUpdateHandler = (data: any) => {
        console.log(`Received payment update: ${JSON.stringify(data)}`);
        if (data.isPaid) {
          Toast.show('Thanh toán thành công', {
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
        }
      };

      socket.emit('subscribeToPayment', { orderId: order.id });
      console.log(`Subscribed to payment with order ID ${order.id}`);

      socket.on('paymentUpdate', paymentUpdateHandler);

      return () => {
        // Cleanup event listener when dependencies change or component unmounts.
        socket.emit('unsubscribeFromPayment', { orderId: order.id });
        console.log(`Unsubscribed from payment with order ID ${order.id}`);
        socket.off('paymentUpdate', paymentUpdateHandler);
      };
    }
  }, [socket, order.id, gotLink]);

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
          <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Lấy link thanh toán:</Text>
            <Button
              mode='contained'
              loading={isGettingLink}
              onPress={getPayment}
              style={{ width: 150 }}
            >
              Lấy link
            </Button>
          </View>
          {qrCodeUrl && (
            <View
              style={{
                marginTop: 16,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <QRCode logo={VietQrLogo} value={qrCodeUrl} size={200} quietZone={16} />
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', width: '40%' }}>
                    Số tài khoản:
                  </Text>
                  <Text style={{ fontSize: 16, width: '45%' }}>{accountNumber}</Text>
                  <IconButton
                    style={{
                      marginLeft: 'auto'
                    }}
                    icon='content-copy'
                    onPress={() => copyToClipboard(accountNumber)}
                  />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', width: '40%' }}>Số tiền:</Text>
                  <Text style={{ fontSize: 16 }}>{formatVNDcurrency(amount)}</Text>
                  <IconButton
                    style={{
                      marginLeft: 'auto'
                    }}
                    icon='content-copy'
                    onPress={() => copyToClipboard(amount.toString())}
                  />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', width: '40%' }}>Mô tả:</Text>
                  <Text style={{ fontSize: 16, width: '45%' }}>{description}</Text>
                  <IconButton
                    style={{
                      marginLeft: 'auto'
                    }}
                    icon='content-copy'
                    onPress={() => copyToClipboard(description)}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
