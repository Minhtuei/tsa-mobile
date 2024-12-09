import { NotificationFilterType, NOTIFICATIONS } from '@constants/notification';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AppTheme, useAppTheme, useGlobalStyles } from '@hooks/theme';
import { NotificationFilter } from '@pages/notification/NotificationFilter';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, NotificationStackParamList } from 'app/types/navigation';
import moment from 'moment';
import { memo, useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Divider, Text } from 'react-native-paper';

export const NotificationList = (
  props: NativeStackScreenProps<NotificationStackParamList, 'NotificationList'>
) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const [notificationType, setNotificationType] = useState<NotificationFilterType>(
    NotificationFilterType.ALL
  );
  const filteredNotifications = useMemo(() => {
    if (notificationType === NotificationFilterType.ALL) {
      return NOTIFICATIONS;
    }
    return NOTIFICATIONS.filter((notification) => notification.type === notificationType);
  }, [notificationType]);
  const styles = createStyles(theme);

  return (
    <KeyboardAvoidingView
      style={globalStyles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        ListHeaderComponent={
          <NotificationFilter
            currentNotificationType={notificationType}
            onChange={setNotificationType}
          />
        }
        nestedScrollEnabled={true}
        stickyHeaderIndices={[0]}
        data={filteredNotifications}
        renderItem={({ index, item }) => {
          return <NotificationItem index={index} item={item} />;
        }}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Divider style={{ backgroundColor: theme.colors.outline }} />}
        contentContainerStyle={styles.contentContainer}
      />
    </KeyboardAvoidingView>
  );
};

const NotificationHeader = memo(function NotificationHeader() {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.headerContainer}>
      <Text style={[globalStyles.text, styles.headerText]}>Tất cả thông báo</Text>
      <TouchableOpacity>
        <View style={styles.iconButton}>
          <MaterialCommunityIcons
            name='checkbox-multiple-marked-outline'
            size={24}
            color={theme.colors.onBackground}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
});

const NotificationItem = memo(function NotificationItem({
  item,
  index
}: {
  item: NormalNotification;
  index: number;
}) {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [isRead, setIsRead] = useState<boolean>(item.isRead);
  return (
    <>
      {index === 0 && <NotificationHeader />}
      <TouchableOpacity
        onPress={() => {
          if (!isRead) {
            setIsRead(true);
          }
        }}
        disabled={isRead}
      >
        <View style={styles.notificationItemContainer}>
          <View style={styles.notificationIcon}>
            <Ionicons name='alert-outline' size={24} color={theme.colors.onBackground} />
          </View>
          <View style={styles.notificationContent}>
            <View style={styles.notificationRow}>
              <Text style={globalStyles.text}>{item.title}</Text>
            </View>
            <View style={styles.notificationRow}>
              <Text
                style={[
                  globalStyles.text,
                  styles.notificationContentText,
                  !isRead && styles.unreadText
                ]}
              >
                {item.content}
              </Text>
              {!isRead && <View style={styles.unreadIndicator} />}
            </View>
            <View style={styles.notificationRow}>
              <Text style={[globalStyles.text, styles.timeText]}>
                {moment(item.createdAt).fromNow()}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
});

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    headerText: {
      color: theme.colors.outline
    },
    iconButton: {
      padding: 8
    },
    notificationItemContainer: {
      flexDirection: 'row',
      paddingVertical: 8,
      alignItems: 'flex-start',
      gap: 6
    },
    notificationIcon: {
      borderRadius: 36,
      borderWidth: 0.5,
      borderColor: theme.colors.outline,
      width: 32,
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    },
    notificationContent: {
      flex: 1
    },
    notificationRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    notificationContentText: {
      flex: 0.9
    },
    unreadText: {
      fontWeight: 'bold'
    },
    unreadIndicator: {
      width: 12,
      height: 12,
      backgroundColor: theme.colors.error,
      borderRadius: 50
    },
    timeText: {
      color: theme.colors.outline,
      fontSize: 12,
      fontStyle: 'italic'
    },
    contentContainer: {
      paddingHorizontal: 16,
      paddingBottom: 32
    }
  });
