import { TouchableOpacity, View } from 'react-native';
import { Modal, Text } from 'react-native-paper';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import * as ImagePicker from 'expo-image-picker';
type ChooseImageModalProps = {
  visible: boolean;
  title: string;
  onSuccess: ({
    uri,
    name,
    type
  }: {
    uri: string;
    name: string | null | undefined;
    type: string | null | undefined;
  }) => void;
  setVisible: (visible: boolean) => void;
};

export const ChooseImageModal = (props: ChooseImageModalProps) => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();
  const uploadProof = async (mode: 'camera' | 'gallery') => {
    try {
      let result: ImagePicker.ImagePickerResult;
      if (mode === 'gallery') {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1
        });
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.back,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1
        });
      }
      if (!result.canceled) {
        console.log(result);
        props.onSuccess({
          uri: result.assets[0].uri,
          name: result.assets[0].fileName,
          type: result.assets[0].mimeType
        });
        props.setVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal
      visible={props.visible}
      contentContainerStyle={{
        backgroundColor: theme.colors.surface,
        padding: 24,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
      }}
      style={{ padding: 36 }}
    >
      <Text style={[globalStyles.title]}>{props.title}</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          paddingHorizontal: 36,
          paddingVertical: 12
        }}
      >
        <TouchableOpacity
          onPress={() => {
            uploadProof('camera');
          }}
        >
          <View
            style={{
              gap: 2,
              alignItems: 'center',
              backgroundColor: theme.colors.surfaceVariant,
              padding: 12,
              borderRadius: 10
            }}
          >
            <MaterialCommunityIcons name='camera-outline' size={36} color={theme.colors.primary} />
            <Text style={{ color: theme.colors.onSurfaceVariant }}>Chụp ảnh</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            uploadProof('gallery');
          }}
        >
          <View
            style={{
              gap: 2,
              alignItems: 'center',
              backgroundColor: theme.colors.surfaceVariant,
              padding: 12,
              borderRadius: 10
            }}
          >
            <MaterialCommunityIcons name='image-outline' size={36} color={theme.colors.primary} />
            <Text style={{ color: theme.colors.onSurfaceVariant }}>Chọn ảnh</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
