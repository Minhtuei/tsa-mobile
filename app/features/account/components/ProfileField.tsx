import { DropDownList } from 'app/shared/components/order/DropDownList';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { Controller } from 'react-hook-form';
import { Image, TouchableOpacity, View } from 'react-native';
import { IconButton, Text, TextInput } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
export const OrderIdInput = ({
  control,
  errors,
  onPress,
  disabled,
  orderIdList,
  defaultValue
}: {
  control: any;
  errors: any;
  onPress: () => void;
  disabled: boolean;
  orderIdList: { label: string; value: string }[];
  defaultValue: string | undefined;
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
      <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', fontSize: 16 }}>
        Mã đơn hàng
      </Text>

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
            <DropDownList
              data={orderIdList}
              value={value}
              setValue={(value) => {
                onChange(value);
              }}
              placeholder='Chọn mã đơn hàng'
              containerStyle={{
                backgroundColor: theme.colors.surface,
                borderRadius: 0,
                borderWidth: 1,
                borderColor: theme.colors.outline,
                flex: 1
              }}
            />
            <IconButton
              icon={'hand-pointing-right'}
              onPress={onPress}
              style={{
                backgroundColor: theme.colors.secondary,
                borderRadius: 0,
                borderWidth: 1,
                borderColor: theme.colors.outline
              }}
              iconColor={theme.colors.onSecondary}
              disabled={disabled}
            />
          </View>
        )}
        name={'orderId'}
      />
      {errors.orderId && <Text style={{ color: 'red' }}>{errors.orderId.message}</Text>}
    </View>
  );
};

export const PhotoInput = ({
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
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  return (
    <View
      style={{
        width: '100%',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', fontSize: 16 }}>
        Ảnh đại diện
      </Text>

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
        name={'photoUrl'}
      />
      {errors.proof && <Text style={{ color: 'red' }}>{errors.proof.message}</Text>}
    </View>
  );
};
