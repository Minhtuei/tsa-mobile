import React from 'react';
import { DatePickerModal } from 'react-native-paper-dates';

type DatePickerProps = {
  shown: boolean;
  setShown: (value: boolean) => void;
  setStartDate: (value: Date | null) => void;
  setEndDate?: (value: Date | null) => void; // Optional for single mode
  startDate: Date | null;
  endDate?: Date | null; // Optional for single mode
  mode: 'single' | 'range';
};

type OnConfirmParams =
  | { date: Date | undefined } // single mode
  | { startDate: Date | undefined; endDate: Date | undefined }; // range mode

const DatePicker = (props: DatePickerProps) => {
  const { shown, setShown, setStartDate, setEndDate, startDate, endDate, mode } = props;

  return (
    <DatePickerModal
      locale='vi'
      mode={mode}
      visible={shown}
      onDismiss={() => setShown(false)}
      startWeekOnMonday
      presentationStyle='pageSheet'
      saveLabel='Lưu'
      onConfirm={(params: OnConfirmParams) => {
        if (mode === 'range' && 'startDate' in params) {
          setStartDate(params.startDate ?? new Date());
          if (setEndDate) setEndDate(params.endDate ?? new Date());
        } else if ('date' in params) {
          setStartDate(params.date ?? new Date());
        }
        setShown(false);
      }}
      startDate={mode === 'range' ? (startDate ?? new Date()) : undefined}
      endDate={mode === 'range' ? (endDate ?? new Date()) : undefined}
      date={mode === 'single' ? (startDate ?? new Date()) : undefined}
    />
  );
};

export default DatePicker;
