import DatePicker from '@components/order/DatePicker';
import { DropDownList } from '@components/order/DropDownList';
import { DropDownListWithImg } from '@components/order/DropDownListWithImg';
import { SearchInput } from '@components/order/SearchInput';
import { BUILDING_DATA, DOMITORY_DATA, PAYMENT_METHOD_DATA, ROOM_DATA } from '@constants/domitory';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCreateOrdersMutation } from '@services/order.service';
import { createOrderSchema, CreateOrderSchemaType } from '@validations/order.schema';
import { OrderStackParamList } from 'app/types/navigation';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Dialog, Portal, Text, TextInput } from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';
import Toast from 'react-native-root-toast';
export const CreateOrder = (props: NativeStackScreenProps<OrderStackParamList, 'CreateOrder'>) => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [visible, setVisible] = useState(false);
  const [createOrder, { isLoading }] = useCreateOrdersMutation();
  const {
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue
  } = useForm<CreateOrderSchemaType>({
    resolver: yupResolver(createOrderSchema),
    defaultValues: {
      checkCode: '',
      product: '',
      weight: '',
      deliveryDate: '',
      dormitory: '',
      building: '',
      room: '',
      paymentMethod: '',
      time: ''
    }
  });
  const domitory = watch('dormitory') as keyof typeof BUILDING_DATA;
  const onSubmit = (data: CreateOrderSchemaType) => {
    const { time, ...rest } = data;
    const validateData = {
      ...rest,
      deliveryDate: moment(data.deliveryDate + ' ' + time)
        .format('YYYY-MM-DDTHH:mm')
        .toString(),
      weight: parseFloat(data.weight.replace(',', '.'))
    };
    if (data.paymentMethod !== 'CASH') {
      props.navigation.navigate('OrderPayment', { order: data });
      return;
    }
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
    if (startDate) {
      setValue('deliveryDate', moment(startDate).format('YYYY-MM-DD'));
    }
  }, [startDate]);
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
          <View style={{ gap: 24 }}>
            <View style={globalStyles.vstack}>
              <View
                style={{
                  width: '100%',
                  gap: 8
                }}
              >
                <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', fontSize: 16 }}>
                  Mã kiểm tra
                </Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={{ backgroundColor: theme.colors.surface, height: 40 }}
                      mode='outlined'
                      placeholder='Nhập mã kiểm tra'
                    />
                  )}
                  name={'checkCode'}
                />
                {errors.checkCode && (
                  <Text style={{ color: 'red' }}>{errors.checkCode.message}</Text>
                )}
              </View>
              <View
                style={{
                  width: '100%',
                  gap: 8
                }}
              >
                <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', fontSize: 16 }}>
                  Sản phẩm
                </Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={{ backgroundColor: theme.colors.surface, height: 40 }}
                      mode='outlined'
                      placeholder='Nhập tên sản phẩm'
                    />
                  )}
                  name={'product'}
                />
                {errors.product && <Text style={{ color: 'red' }}>{errors.product.message}</Text>}
              </View>
              <View
                style={{
                  width: '100%',
                  gap: 8
                }}
              >
                <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', fontSize: 16 }}>
                  Cân nặng
                </Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={{ backgroundColor: theme.colors.surface, height: 40 }}
                      mode='outlined'
                      keyboardType='numeric'
                      placeholder='Nhập cân nặng'
                    />
                  )}
                  name={'weight'}
                />
                {errors.weight && <Text style={{ color: 'red' }}>{errors.weight.message}</Text>}
              </View>
              <View
                style={{
                  width: '100%',
                  gap: 8
                }}
              >
                <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', fontSize: 16 }}>
                  Thời gian giao hàng
                </Text>
                <Controller
                  control={control}
                  render={({ field: { onChange } }) => (
                    <SearchInput
                      value={moment({ hour, minute }).format('HH:mm')}
                      onChange={onChange}
                      placeholder='Thời gian giao hàng'
                      pressable={true}
                      containerStyle={{
                        backgroundColor: theme.colors.surface,
                        borderRadius: 0,
                        borderWidth: 1,
                        borderColor: theme.colors.outline,
                        height: 40,
                        pointerEvents: 'none',
                        paddingLeft: 6
                      }}
                      placeholderTextColor={theme.colors.onSurface}
                      onPress={() => setIsTimePickerVisible(true)}
                      right={
                        <MaterialIcons
                          name='schedule'
                          size={24}
                          color={theme.colors.onBackground}
                        />
                      }
                    />
                  )}
                  name={'time'}
                />
                {errors.time && <Text style={{ color: 'red' }}>{errors.time.message}</Text>}
              </View>
              <View
                style={{
                  width: '100%',
                  gap: 8
                }}
              >
                <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', fontSize: 16 }}>
                  Ngày giao hàng
                </Text>
                <Controller
                  control={control}
                  render={({ field: { onChange } }) => (
                    <SearchInput
                      value={startDate ? moment(startDate).format('DD/MM/YYYY') : ''}
                      onChange={onChange}
                      placeholder='Ngày giao hàng'
                      pressable={true}
                      containerStyle={{
                        backgroundColor: theme.colors.surface,
                        borderRadius: 0,
                        borderWidth: 1,
                        borderColor: theme.colors.outline,
                        height: 40,
                        pointerEvents: 'none',
                        paddingLeft: 6
                      }}
                      placeholderTextColor={theme.colors.onSurface}
                      onPress={() => setIsDatePickerVisible(true)}
                      right={
                        <MaterialIcons
                          name='date-range'
                          size={24}
                          color={theme.colors.onBackground}
                        />
                      }
                    />
                  )}
                  name={'deliveryDate'}
                />
                {errors.deliveryDate && (
                  <Text style={{ color: 'red' }}>{errors.deliveryDate.message}</Text>
                )}
              </View>
              <View
                style={{
                  width: '100%',
                  gap: 8
                }}
              >
                <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', fontSize: 16 }}>
                  Ký túc xá
                </Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DropDownList
                      data={DOMITORY_DATA}
                      value={value}
                      setValue={onChange}
                      placeholder='Chọn ký túc xá'
                      containerStyle={{
                        backgroundColor: theme.colors.surface,
                        borderRadius: 0,
                        borderWidth: 1,
                        borderColor: theme.colors.outline
                      }}
                    />
                  )}
                  name={'dormitory'}
                />
                {errors.dormitory && (
                  <Text style={{ color: 'red' }}>{errors.dormitory.message}</Text>
                )}
              </View>
              <View
                style={{
                  width: '100%',
                  gap: 8
                }}
              >
                <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', fontSize: 16 }}>
                  Tòa nhà
                </Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DropDownList
                      data={domitory ? BUILDING_DATA[domitory] : BUILDING_DATA['B']}
                      value={value}
                      setValue={onChange}
                      placeholder='Chọn tòa nhà'
                      containerStyle={{
                        backgroundColor: theme.colors.surface,
                        borderRadius: 0,
                        borderWidth: 1,
                        borderColor: theme.colors.outline
                      }}
                    />
                  )}
                  name={'building'}
                />
                {errors.building && <Text style={{ color: 'red' }}>{errors.building.message}</Text>}
              </View>
              <View
                style={{
                  width: '100%',
                  gap: 8
                }}
              >
                <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', fontSize: 16 }}>
                  Phòng
                </Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DropDownList
                      data={ROOM_DATA}
                      value={value}
                      setValue={onChange}
                      placeholder='Chọn phòng'
                      containerStyle={{
                        backgroundColor: theme.colors.surface,
                        borderRadius: 0,
                        borderWidth: 1,
                        borderColor: theme.colors.outline
                      }}
                    />
                  )}
                  name={'room'}
                />
                {errors.room && <Text style={{ color: 'red' }}>{errors.room.message}</Text>}
              </View>
              <View
                style={{
                  width: '100%',
                  gap: 8
                }}
              >
                <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', fontSize: 16 }}>
                  Phương thức thanh toán
                </Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DropDownListWithImg
                      data={PAYMENT_METHOD_DATA}
                      value={value}
                      setValue={onChange}
                      placeholder='Chọn phương thức thanh toán'
                      containerStyle={{
                        backgroundColor: theme.colors.surface,
                        borderRadius: 0,
                        borderWidth: 1,
                        borderColor: theme.colors.outline
                      }}
                    />
                  )}
                  name={'paymentMethod'}
                />
                {errors.paymentMethod && (
                  <Text style={{ color: 'red' }}>{errors.paymentMethod.message}</Text>
                )}
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button
                mode='contained'
                onPress={() => setVisible(true)}
                style={globalStyles.wideButton}
                loading={isLoading}
                disabled={isLoading}
              >
                Tạo đơn
              </Button>
            </View>
          </View>
          {isDatePickerVisible && (
            <DatePicker
              shown={isDatePickerVisible}
              setShown={setIsDatePickerVisible}
              mode='single'
              setStartDate={setStartDate}
              startDate={startDate}
            />
          )}
          {isTimePickerVisible && (
            <TimePickerModal
              visible={isTimePickerVisible}
              onDismiss={() => setIsTimePickerVisible(false)}
              onConfirm={({ hours, minutes }) => {
                setHour(hours);
                setMinute(minutes);
                setValue('time', moment({ hours, minutes }).format('HH:mm'));
                setIsTimePickerVisible(false);
              }}
              hours={hour}
              minutes={minute}
              label='Chọn giờ'
              cancelLabel='Hủy'
              confirmLabel='Xác nhận'
              animationType='fade'
              locale='vi'
            />
          )}
        </View>
        <Portal>
          <Dialog
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 10
            }}
            visible={visible}
            onDismiss={() => setVisible(false)}
          >
            <Dialog.Title
              style={[globalStyles.title, { color: theme.colors.onSurface, fontSize: 20 }]}
            >
              Tạo đơn hàng
            </Dialog.Title>
            <Dialog.Content>
              <Text style={{ color: theme.colors.onSurface, fontSize: 16 }}>
                Bạn xác nhận tạo đơn hàng này?
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => setVisible(false)}
                buttonColor={theme.colors.error}
                textColor={theme.colors.onError}
                style={{ minWidth: 60, marginRight: 12 }}
              >
                Hủy
              </Button>
              <Button
                onPress={() => {
                  handleSubmit(onSubmit)();
                  setVisible(false);
                }}
                style={{ minWidth: 60 }}
                buttonColor={theme.colors.primary}
                textColor={theme.colors.onPrimary}
              >
                Có, Tạo
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
