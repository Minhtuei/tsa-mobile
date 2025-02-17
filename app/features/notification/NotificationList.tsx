import { ConfirmationDialog } from 'app/shared/components/ConfirmDialog';
import { LoadingScreen } from 'app/shared/components/LoadingScreen';
import { NotificationFilterType } from 'app/shared/constants/notification';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAppDispatch } from 'app/shared/hooks/redux';
import { AppTheme, useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getErrorMessage } from 'app/shared/utils/helper';
import { NotificationFilter } from 'app/features/notification/components/NotificationFilter';
import { setReadAllNotification, setReadNotifcation } from 'app/shared/state/app.slice';
import { NotificationStackParamList } from 'app/shared/types/navigation';
import moment from 'moment';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Divider, Portal, Text } from 'react-native-paper';
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useReadAllNotiMutation
} from './api/notification.api';

export const NotificationList = (
  props: NativeStackScreenProps<NotificationStackParamList, 'NotificationList'>
) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const [notificationType, setNotificationType] = useState<NotificationFilterType>(
    NotificationFilterType.ALL
  );
  const [err, setErr] = useState<string>('');
  const {
    data: notifications,
    isFetching,
    refetch,
    isError
  } = useGetNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true
  });
  const [readNoti] = useMarkAsReadMutation();
  const [readAllNoti] = useReadAllNotiMutation();
  const [isReadAll, setIsReadAll] = useState<boolean>(false);
  const markAsRead = useCallback((notiId: string) => {
    readNoti({ id: notiId })
      .unwrap()
      .then(() => {
        dispatch(setReadNotifcation());
      })
      .catch((err) => {
        setErr(getErrorMessage(err));
      });
  }, []);
  const markAllAsRead = useCallback(() => {
    readAllNoti()
      .unwrap()
      .then(() => {
        refetch();
        dispatch(setReadAllNotification());
      })
      .catch((err) => {
        setErr(getErrorMessage(err));
      });
  }, []);
  const filteredNotifications = useMemo(() => {
    if (!notifications || !notifications.notifications) {
      return [];
    }
    if (notificationType === NotificationFilterType.ALL) {
      return notifications.notifications;
    }
    return notifications.notifications.filter(
      (notification) => notification.type === notificationType
    );
  }, [notificationType, notifications]);
  const styles = createStyles(theme);
  useEffect(() => {
    if (isError) {
      setErr('Lỗi trong quá trình tải thông báo');
    }
  }, [isError]);
  if (isFetching) {
    return <LoadingScreen />;
  }
  return (
    <KeyboardAvoidingView
      style={globalStyles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Portal>
        <ConfirmationDialog
          visible={!!err}
          setVisible={() => {
            setErr('');
          }}
          onSubmit={() => {
            setErr('');
          }}
          title='Lỗi'
          content={err}
          notShowCancel
          isErr
        />
        <ConfirmationDialog
          visible={isReadAll}
          setVisible={() => {
            setIsReadAll(false);
          }}
          onSubmit={() => {
            setIsReadAll(false);
            markAllAsRead();
          }}
          title='Thông báo'
          content='Đánh dấu tất cả thông báo đã đọc'
        />
      </Portal>
      <FlatList
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={() => refetch()} />}
        ListHeaderComponent={
          <NotificationFilter
            currentNotificationType={notificationType}
            onChange={setNotificationType}
          />
        }
        ListEmptyComponent={
          <View
            style={[
              globalStyles.center,
              {
                marginTop: 32
              }
            ]}
          >
            <Text style={globalStyles.text}>Không có thông báo</Text>
          </View>
        }
        nestedScrollEnabled={true}
        stickyHeaderIndices={[0]}
        data={filteredNotifications}
        renderItem={({ index, item }) => {
          return (
            <NotificationItem
              index={index}
              item={item}
              onMarkAsRead={markAsRead}
              onReadAll={
                notificationType === NotificationFilterType.ALL
                  ? () => setIsReadAll(true)
                  : undefined
              }
            />
          );
        }}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Divider style={{ backgroundColor: theme.colors.outline }} />}
        contentContainerStyle={styles.contentContainer}
      />
    </KeyboardAvoidingView>
  );
};

const NotificationHeader = memo(function NotificationHeader({
  onReadAll
}: {
  onReadAll?: () => void;
}) {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.headerContainer}>
      <Text style={[globalStyles.text, styles.headerText]}>Tất cả thông báo</Text>
      {onReadAll && (
        <TouchableOpacity onPress={onReadAll}>
          <View style={styles.iconButton}>
            <MaterialCommunityIcons
              name='checkbox-multiple-marked-outline'
              size={24}
              color={theme.colors.onBackground}
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
});

const NotificationItem = memo(function NotificationItem({
  item,
  index,
  onMarkAsRead,
  onReadAll
}: {
  item: NormalNotification;
  index: number;
  onMarkAsRead?: (id: string) => void;
  onReadAll?: () => void;
}) {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [isRead, setIsRead] = useState<boolean>(true);
  useEffect(() => {
    setIsRead(item.isRead);
  }, [item.isRead]);
  return (
    <>
      {index === 0 && <NotificationHeader onReadAll={onReadAll} />}
      <TouchableOpacity
        onPress={() => {
          if (!isRead) {
            setIsRead(true);
            onMarkAsRead?.(item.id);
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
                {moment.unix(Number(item.createdAt)).fromNow()}
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
      paddingBottom: 120
    }
  });
