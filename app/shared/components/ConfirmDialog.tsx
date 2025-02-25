import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { Button, Dialog, Text } from 'react-native-paper';
type ConfirmationDialogProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onSubmit: () => void;
  title: string;
  content: string;
  notShowCancel?: boolean;
  isErr?: boolean;
  renderContent?: () => JSX.Element;
};

export const ConfirmationDialog = (props: ConfirmationDialogProps) => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();

  return (
    <Dialog
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: 10
      }}
      visible={props.visible}
      onDismiss={() => props.setVisible(false)}
    >
      <Dialog.Title style={[globalStyles.title, { color: theme.colors.onSurface, fontSize: 20 }]}>
        {props.title}
      </Dialog.Title>
      <Dialog.Content>
        <Text style={{ color: theme.colors.onSurface, fontSize: 16 }}>{props.content}</Text>
        {props.renderContent && props.renderContent()}
      </Dialog.Content>
      <Dialog.Actions>
        {!props.notShowCancel && (
          <Button
            onPress={() => {
              props.setVisible(false);
            }}
            buttonColor={theme.colors.error}
            textColor={theme.colors.onError}
            style={{ minWidth: 60, marginRight: 12 }}
          >
            Hủy
          </Button>
        )}
        <Button
          onPress={() => {
            props.onSubmit();
            props.setVisible(false);
          }}
          style={{ minWidth: 60 }}
          buttonColor={props.isErr ? theme.colors.error : theme.colors.primary}
          textColor={theme.colors.onPrimary}
        >
          {props.notShowCancel ? 'OK' : 'Xác nhận'}
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};
