import React, { useState } from 'react';
import { ImageSourcePropType, StyleSheet, ViewStyle } from 'react-native';
import { SelectCountry } from 'react-native-element-dropdown';

export const DropDownListWithImg = ({
  data,
  value,
  setValue,
  placeholder,
  containerStyle
}: {
  data: {
    label: string;
    value: string;
    image: ImageSourcePropType;
  }[];
  value: string | null;
  setValue: (value: string | null) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
}) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <SelectCountry
      style={[styles.dropdown, isFocus && { borderColor: 'black' }, containerStyle]}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      containerStyle={styles.containerStyle}
      data={data}
      maxHeight={200}
      minHeight={100}
      autoScroll={false}
      labelField='label'
      valueField='value'
      imageField='image'
      placeholder={!isFocus ? placeholder : 'Chọn'}
      searchPlaceholder='Search...'
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      imageStyle={{ width: 24, height: 24, marginRight: 10 }}
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
  containerStyle: {
    padding: 10
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
