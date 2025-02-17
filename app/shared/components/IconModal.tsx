import { Button, Icon, Modal, Text } from 'react-native-paper';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
const icons = {
  error: 'alert-circle-outline',
  success: 'check-circle-outline',
  warning: 'alert',
  primary: 'information-outline'
};

export default function IconModal({
  variant,
  message,
  onDismiss
}: {
  variant: 'error' | 'success' | 'warning' | 'primary';
  message: string;
  onDismiss: () => void;
}) {
  const theme = useAppTheme();
  const styles = useGlobalStyles();

  return (
    <Modal
      visible={message !== ''}
      dismissable={true}
      onDismiss={onDismiss}
      contentContainerStyle={[styles.modal, { alignItems: 'center' }]}
    >
      <Icon source={icons[variant]} color={theme.colors[variant]} size={48} />
      <Text variant='titleMedium'>{message}</Text>
      <Button style={[styles.wideButton, { margin: 0 }]} onPress={onDismiss}>
        OK
      </Button>
    </Modal>
  );
}
