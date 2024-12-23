import { useAppTheme } from '@hooks/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCreateOrdersMutation } from '@services/order.service';
import { useCreatePayOSPaymentMutation } from '@services/payment.service';
import { getVietQrCodeLink } from '@utils/qrcode';
import { OrderStackParamList } from 'app/types/navigation';
import { useCallback, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, IconButton, Text } from 'react-native-paper';
import Toast from 'react-native-root-toast';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';

export const OrderPayment = (
  props: NativeStackScreenProps<OrderStackParamList, 'OrderPayment'>
) => {
  const theme = useAppTheme();
  const [createOrder, { isLoading }] = useCreateOrdersMutation();
  const [getLinkPayment, { isLoading: isGettingLink }] = useCreatePayOSPaymentMutation();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const getPayment = useCallback(() => {
    getLinkPayment({
      amount: props.route.params.amount,
      description: 'Thanh toán đơn hàng',
      returnUrl: 'localhost:3000',
      cancelUrl: 'localhost:3000'
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
        console.log(res.paymentLink);
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
              <QRCode value={qrCodeUrl} size={200} quietZone={16} />
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
                  <Text style={{ fontSize: 16 }}>
                    {amount.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    })}
                  </Text>
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
