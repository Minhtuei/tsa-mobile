import React from 'react';
import { Modal, Button, Text } from 'react-native-paper';
import { ScrollView, Image, View } from 'react-native';
import { SCREEN } from '@constants/screen';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';

interface PreViewImageModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  proofUri: string | null;
  setValue: (field: string, value: any) => void;
}

export const PreViewImageModal: React.FC<PreViewImageModalProps> = ({
  visible,
  setVisible,
  proofUri,
  setValue
}) => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();

  return (
    <Modal
      contentContainerStyle={{
        backgroundColor: theme.colors.surface,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24
      }}
      visible={visible}
      onDismiss={() => setVisible(false)}
    >
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        <Text style={[globalStyles.title, { marginBottom: 16 }]}>Ảnh minh chứng</Text>
        {proofUri && (
          <Image
            source={{ uri: proofUri }}
            style={{
              width: 350,
              height: 350
            }}
            resizeMethod='scale'
            resizeMode='contain'
          />
        )}
        <View style={{ flexDirection: 'row', gap: 32, marginTop: 16 }}>
          <Button
            onPress={() => {
              setValue('proof', '');
              setVisible(false);
            }}
            buttonColor={theme.colors.error}
            textColor={theme.colors.onError}
          >
            Gỡ ảnh
          </Button>
          <Button
            onPress={() => {
              setVisible(false);
            }}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
          >
            OK
          </Button>
        </View>
      </ScrollView>
    </Modal>
  );
};
