import { Dropdown } from 'react-native-element-dropdown';
import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { FILTER_DATA } from 'app/shared/constants/filter';
import { Text } from 'react-native-paper';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useAppTheme } from 'app/shared/hooks/theme';
export const FilterBtnDropdown = ({
  data,
  value,
  setValue
}: {
  data: { label: string; value: string }[];
  value: string | null;
  setValue: (value: string | null) => void;
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const theme = useAppTheme();
  return (
    <Dropdown
      style={[
        styles.dropdown,
        { backgroundColor: theme.colors.surface },
        isFocus && {
          borderColor: 'black'
        }
      ]}
      selectedTextStyle={styles.selectedTextStyle}
      containerStyle={{ width: 200, transform: [{ translateX: -160 }] }}
      data={data}
      maxHeight={200}
      minHeight={100}
      autoScroll={false}
      placeholder=''
      labelField='label'
      valueField='value'
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={(item) => {
        setValue(item.value);
        setIsFocus(false);
      }}
      renderRightIcon={() => (
        <SimpleLineIcons
          name='menu'
          size={20}
          style={
            !value
              ? {
                  transform: [{ translateX: -9 }]
                }
              : {}
          }
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 40,
    width: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
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
    display: 'none'
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
