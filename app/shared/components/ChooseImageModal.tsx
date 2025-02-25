import { Alert, Linking, TouchableOpacity, View } from 'react-native';
import { Modal, Text } from 'react-native-paper';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import * as ImagePicker from 'expo-image-picker';
import { useEffect } from 'react';
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
  forceCamera?: boolean;
};

export const ChooseImageModal = (props: ChooseImageModalProps) => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();
  const uploadProof = async (mode: 'camera' | 'gallery') => {
    try {
      let result: ImagePicker.ImagePickerResult;
      let permission: ImagePicker.PermissionResponse;

      if (mode === 'gallery') {
        // Check existing permission
        permission = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          // Request permission if not granted
          permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        }

        if (!permission.granted) {
          // If permission is still not granted, show alert
          showPermissionDeniedModal('gallery');
          return;
        }

        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          aspect: [1, 1],
          quality: 1
        });
      } else {
        // Check existing permission
        permission = await ImagePicker.getCameraPermissionsAsync();
        if (!permission.granted) {
          // Request permission if not granted
          permission = await ImagePicker.requestCameraPermissionsAsync();
        }

        if (!permission.granted) {
          // If permission is still not granted, show alert
          showPermissionDeniedModal('camera');
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.back,
          allowsEditing: false,
          aspect: [1, 1],
          quality: 1
        });
      }

      // Handle result
      if (!result.canceled) {
        console.log(result);
        props.onSuccess({
          uri: result.assets[0].uri,
          name: result.assets[0].fileName,
          type: result.assets[0].mimeType
        });
        props.setVisible(false);
      } else {
        props.setVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Show alert when permission is denied
  const showPermissionDeniedModal = (mode: 'camera' | 'gallery') => {
    Alert.alert(
      `Quyền truy cập ${mode === 'camera' ? 'camera' : 'thư viện ảnh'} bị từ chối`,
      `Vui lòng vào cài đặt để bật quyền truy cập ${mode === 'camera' ? 'camera' : 'thư viện ảnh'}`,
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Đi đến cài đặt',
          onPress: () => Linking.openSettings()
        }
      ]
    );
  };
  useEffect(() => {
    if (props.forceCamera) {
      uploadProof('camera');
    }
  }, [props.forceCamera]);
  return (
    <Modal
      visible={props.visible && !props.forceCamera}
      contentContainerStyle={{
        backgroundColor: theme.colors.surface,
        padding: 24,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
      }}
      style={{ padding: 36 }}
      onDismiss={() => props.setVisible(false)}
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
