import { View, Text } from 'react-native';
import React, { useState } from 'react';
import moment from 'moment';
import { DatePickerModal } from 'react-native-paper-dates';
type DatePickerProps = {
  shown: boolean;
  setShown: (value: boolean) => void;
  setStartDate: (value: Date | null) => void;
  setEndDate: (value: Date | null) => void;
  startDate: Date | null;
  endDate: Date | null;
};
const DatePicker = (props: DatePickerProps) => {
  const { shown, setShown, setStartDate, setEndDate, startDate, endDate } =
    props;

  return (
    <DatePickerModal
      locale="vi"
      mode="range"
      visible={shown}
      onDismiss={() => setShown(false)}
      startWeekOnMonday
      presentationStyle="pageSheet"
      saveLabel="Lưu"
      onConfirm={({ startDate, endDate }) => {
        setStartDate(startDate ?? new Date());
        setEndDate(endDate ?? new Date());
        setShown(false);
      }}
      startDate={startDate ?? new Date()}
      endDate={endDate ?? new Date()}
    />
  );
};

export default DatePicker;
