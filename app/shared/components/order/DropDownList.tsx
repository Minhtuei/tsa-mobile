import React, { useState } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

export const DropDownList = ({
  data,
  value,
  setValue,
  placeholder,
  containerStyle
}: {
  data: { label: string; value: string }[];
  value: string | null;
  setValue: (value: string | null) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
}) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <Dropdown
      style={[styles.dropdown, isFocus && { borderColor: 'black' }, containerStyle]}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={data}
      maxHeight={200}
      minHeight={100}
      autoScroll={false}
      labelField='label'
      valueField='value'
      placeholder={!isFocus ? placeholder : 'Chọn'}
      searchPlaceholder='Search...'
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={(item) => {
        setValue(item.value);
        setIsFocus(false);
      }}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: 'white'
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14
  },
  placeholderStyle: {
    fontSize: 16
  },
  selectedTextStyle: {
    fontSize: 16
  },
  iconStyle: {
    width: 20,
    height: 20
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16
  }
});
