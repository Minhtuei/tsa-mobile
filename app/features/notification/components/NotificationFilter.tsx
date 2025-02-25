import { useAppTheme } from 'app/shared/hooks/theme';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, LayoutChangeEvent } from 'react-native';
import { Button } from 'react-native-paper';
import { NotificationFilterType } from 'app/shared/constants/notification';
import { useAppSelector } from 'app/shared/hooks/redux';

type notificationFilterMetadata = { name: string; value: NotificationFilterType };

const queryType: { name: string; value: NotificationFilterType }[] = [
  {
    name: 'Tất cả',
    value: NotificationFilterType.ALL
  },
  {
    name: 'Hệ thống',
    value: NotificationFilterType.SYSTEM
  },
  {
    name: 'Đơn hàng',
    value: NotificationFilterType.ORDER
  },
  {
    name: 'Chuyến đi',
    value: NotificationFilterType.DELIVERY
  },
  {
    name: 'Báo cáo',
    value: NotificationFilterType.REPORT
  }
];

type NotificationFilterButtonProps = {
  isActive: boolean;
  item: notificationFilterMetadata;
  handlePress: (input: NotificationFilterType) => void;
  onLayout: (event: LayoutChangeEvent) => void;
};
const NotificationFilterButton = memo(
  function NotificationFilter({
    isActive,
    item,
    handlePress,
    onLayout
  }: NotificationFilterButtonProps) {
    const theme = useAppTheme();

    return (
      <Button
        onLayout={onLayout}
        key={item.value}
        mode={'outlined'}
        onPress={() => handlePress(item.value)}
        labelStyle={[styles.notificationFilterButtonLabel]}
        style={[
          styles.notificationFilterButton,
          { borderColor: isActive ? theme.colors.outline : theme.colors.outlineVariant }
        ]}
        textColor={isActive ? theme.colors.outline : theme.colors.outlineVariant}
      >
        {item.name}
      </Button>
    );
  },
  (prev, next) => prev.isActive === next.isActive
);

type NotificationFilterProps = {
  currentNotificationType: NotificationFilterType;
  onChange: (notificationType: NotificationFilterType) => void;
};
export const NotificationFilter = memo(function NotificationFilter({
  currentNotificationType,
  onChange
}: NotificationFilterProps) {
  const ref = useRef<FlatList>(null);
  const theme = useAppTheme();
  const [itemWidths, setItemWidths] = useState<number[]>([]);
  const auth = useAppSelector((state) => state.auth);
  // Store each item's width when it's laid out
  const handleItemLayout = (width: number, index: number) => {
    setItemWidths((prev) => {
      const newWidths = [...prev];
      newWidths[index] = width;
      return newWidths;
    });
  };

  // Calculate and scroll to the target offset
  useEffect(() => {
    const index = queryType.findIndex((item) => item.value === currentNotificationType);
    if (index !== -1) {
      // Calculate offset based on item widths
      const offset = itemWidths.slice(0, index).reduce((acc, width) => acc + width, 0);
      ref.current?.scrollToOffset({ animated: true, offset });
    }
  }, [currentNotificationType, itemWidths]);

  const handlePress = useCallback(
    (value: NotificationFilterType) => {
      if (currentNotificationType !== value) {
        onChange(value); // Pass the new notificationType to the parent component
      }
    },
    [currentNotificationType, onChange]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: notificationFilterMetadata; index: number }) => {
      if (auth.userInfo?.role !== 'STAFF' && item.value === NotificationFilterType.DELIVERY) {
        return null;
      }
      const isActive = currentNotificationType === item.value;
      return (
        <NotificationFilterButton
          isActive={isActive}
          handlePress={handlePress}
          item={item}
          // Measure and save the width of each item
          onLayout={(event) => handleItemLayout(event.nativeEvent.layout.width, index)}
        />
      );
    },
    [currentNotificationType, handlePress, auth.userInfo?.role]
  );

  return (
    <FlatList
      data={queryType}
      horizontal={true}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.value.toString()}
      contentContainerStyle={[
        styles.queryTime,
        {
          backgroundColor: theme.colors.background
        }
      ]}
      ref={ref}
    />
  );
});

const styles = StyleSheet.create({
  queryTime: {
    paddingVertical: 8,
    gap: 8
  },
  notificationFilterButtonLabel: {},
  notificationFilterButton: {
    borderRadius: 32
  }
});
