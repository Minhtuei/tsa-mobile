import { DropDownList } from 'app/shared/components/order/DropDownList';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { Controller } from 'react-hook-form';
import { Image, TouchableOpacity, View } from 'react-native';
import { IconButton, Text, TextInput } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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
