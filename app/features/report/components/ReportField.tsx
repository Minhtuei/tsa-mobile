import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { Controller } from 'react-hook-form';
import { Image, TouchableOpacity, View } from 'react-native';
import { IconButton, Text, TextInput } from 'react-native-paper';
export const OrderIdInput = ({
  control,
  errors,
  onPress,
  disabled,
  defaultValue
}: {
  control: any;
  errors: any;
  onPress?: () => void;
  disabled: boolean;
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
            {/* <DropDownList
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
            /> */}
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder='Nhập mã đơn hàng'
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: 0,
                borderWidth: 1,
                borderColor: theme.colors.outline,
                flex: 1
              }}
              numberOfLines={1}
            />
            {onPress && (
              <IconButton
                icon={'text-search'}
                onPress={onPress}
                style={{
                  backgroundColor: theme.colors.secondary,
                  borderRadius: 0,
                  borderWidth: 1,
                  borderColor: theme.colors.outline,
                  alignSelf: 'center'
                }}
                iconColor={theme.colors.onSecondary}
                disabled={disabled}
              />
            )}
          </View>
        )}
        name={'orderId'}
      />
      {errors.orderId && <Text style={{ color: 'red' }}>{errors.orderId.message}</Text>}
    </View>
  );
};

export const ContentInput = ({
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
      <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', fontSize: 16 }}>
        Nội dung
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
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder='Nhập nội dung'
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
        name={'content'}
      />
      {errors.content && <Text style={{ color: 'red' }}>{errors.content.message}</Text>}
    </View>
  );
};

export const ProofInput = ({
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
        gap: 8
      }}
    >
      <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', fontSize: 16 }}>
        Minh chứng
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
        name={'proof'}
      />
      {errors.proof && <Text style={{ color: 'red' }}>{errors.proof.message}</Text>}
    </View>
  );
};
