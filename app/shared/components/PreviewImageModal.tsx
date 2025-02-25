import { SCREEN } from 'app/shared/constants/screen';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { Button, Modal, Text } from 'react-native-paper';

interface PreViewImageModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  proofUri: string | null | undefined;
  setValue: (field: string, value: any) => void;
  disabled?: boolean;
  title: string;
}

export const PreViewImageModal: React.FC<PreViewImageModalProps> = ({
  visible,
  setVisible,
  proofUri,
  setValue,
  disabled,
  title
}) => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();

  return (
    <Modal
      style={{
        paddingHorizontal: 16
      }}
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
      <ScrollView
        style={{
          width: '100%',
          maxHeight: 500
        }}
        contentContainerStyle={{ alignItems: 'center' }}
        nestedScrollEnabled={true}
      >
        <Text style={[globalStyles.title, { marginBottom: 16 }]}>{title}</Text>
        {proofUri && (
          <ScrollView
            horizontal
            style={{
              width: '100%',
              maxHeight: 350
            }}
          >
            <Image
              source={{ uri: proofUri }}
              style={{
                width: 350,
                height: 350
              }}
            />
          </ScrollView>
        )}

        <View style={{ flexDirection: 'row', gap: 32, marginTop: 16 }}>
          {!disabled ? (
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
          ) : null}
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
