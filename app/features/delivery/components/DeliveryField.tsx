import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { Controller } from 'react-hook-form';
import { Image, TouchableOpacity, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
export const FinishedImageInput = ({
  errors,
  control,
  setProofModalVisible,
  setViewImageModalVisible
}: {
  errors: any;
  control: any;
  setProofModalVisible: (visible: boolean) => void;
  setViewImageModalVisible: (visible: boolean) => void;
}) => {
  const theme = useAppTheme();
  return (
    <View
      style={{
        width: '100%',
        marginTop: 8
      }}
    >
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {value ? (
              <TouchableOpacity onPress={() => setViewImageModalVisible(true)}>
                <Image source={{ uri: value }} style={{ width: 100, height: 100 }} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setProofModalVisible(true);
                }}
              >
                <View
                  style={{
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: theme.colors.outline,
                    borderStyle: 'dashed',
                    padding: 8,
                    width: 100,
                    height: 100,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <MaterialCommunityIcons name='plus' size={24} color={theme.colors.primary} />
                  <Text style={{ color: theme.colors.onSurface }}>Thêm ảnh</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}
        name={'finishedImage'}
      />
      {errors.finishedImage && <Text style={{ color: 'red' }}>{errors.finishedImage.message}</Text>}
    </View>
  );
};

export const CanceledImageInput = ({
  errors,
  control,
  setProofModalVisible,
  setViewImageModalVisible
}: {
  errors: any;
  control: any;
  setProofModalVisible: (visible: boolean) => void;
  setViewImageModalVisible: (visible: boolean) => void;
}) => {
  const theme = useAppTheme();
  return (
    <View
      style={{
        width: '100%',
        marginTop: 8
      }}
    >
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {value ? (
              <TouchableOpacity onPress={() => setViewImageModalVisible(true)}>
                <Image source={{ uri: value }} style={{ width: 100, height: 100 }} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setProofModalVisible(true);
                }}
              >
                <View
                  style={{
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: theme.colors.outline,
                    borderStyle: 'dashed',
                    padding: 8,
                    width: 100,
                    height: 100,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <MaterialCommunityIcons name='plus' size={24} color={theme.colors.primary} />
                  <Text style={{ color: theme.colors.onSurface }}>Thêm ảnh</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}
        name={'canceledImage'}
      />
      {errors.canceledImage && <Text style={{ color: 'red' }}>{errors.canceledImage.message}</Text>}
    </View>
  );
};

export const ReasonInput = ({
  control,
  errors,
  disable
}: {
  control: any;
  errors: any;
  disable?: boolean;
}) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  return (
    <View
      style={{
        width: '100%',
        gap: 8
      }}
    >
      {/* <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', fontSize: 16 }}>Lí do</Text> */}

      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder='Nhập lí do'
              editable={!disable}
              style={{
                backgroundColor: disable ? theme.colors.surfaceDisabled : theme.colors.surface,
                borderRadius: 0,
                borderWidth: 1,
                borderColor: theme.colors.outline,
                flex: 1
              }}
              multiline
              numberOfLines={4}
            />
          </View>
        )}
        name={'reason'}
      />
      {errors.reason && <Text style={{ color: 'red' }}>{errors.reason.message}</Text>}
    </View>
  );
};

export const CancelReasonInput = ({ control, errors }: { control: any; errors: any }) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const orderCancelReasons = [
    { label: 'Địa chỉ sai', value: 'WRONG_ADDRESS' },
    { label: 'Không thể liên lạc', value: 'CAN_NOT_CONTACT' },
    { label: 'Vấn đề thanh toán', value: 'PAYMENT_ISSUE' },
    { label: 'Sản phẩm bị hư hỏng', value: 'DAMAGED_PRODUCT' },
    { label: 'Sản phẩm quá nặng', value: 'HEAVY_PRODUCT' },
    { label: 'Lý do cá nhân', value: 'PERSONAL_REASON' },
    { label: 'Xe giao hàng bị hư hỏng', value: 'DAMEGED_VEHICLE' },
    { label: 'Khác', value: 'OTHER' }
  ];
  return (
    <Controller
      render={({ field }) => (
        <View style={globalStyles.input}>
          <Dropdown
            label='Chọn lí do huỷ'
            mode='flat'
            value={field.value}
            onSelect={(value) => {
              field.onChange(value);
            }}
            placeholder='Chọn lí do huỷ'
            options={orderCancelReasons}
            menuContentStyle={{
              backgroundColor: theme.colors.surfaceVariant
            }}
          />
          {errors.cancelReasonType && (
            <Text style={globalStyles.error}>{errors.cancelReasonType.message}</Text>
          )}
        </View>
      )}
      control={control}
      name='cancelReasonType'
    />
  );
};
