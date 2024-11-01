import { TextStyle, ViewStyle, TextInput, View, Platform, TouchableOpacity } from 'react-native';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  disabled?: boolean;
  pressable?: boolean;
  onPress?: () => void;
  placeholderTextColor?: string;
};
export const SearchInput = ({
  value,
  onChange,
  placeholder,
  left,
  right,
  containerStyle,
  inputStyle,
  disabled,
  pressable,
  onPress,
  placeholderTextColor
}: SearchInputProps) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={!pressable}>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F5F5F5',
            borderRadius: 10,
            paddingLeft: 16,
            paddingRight: 24,
            paddingVertical: Platform.OS === 'android' ? 0 : 8
          },
          containerStyle
        ]}
      >
        {left}
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor || '#9E9E9E'}
          editable={!disabled}
          numberOfLines={2}
          style={[
            {
              flex: 1,
              marginLeft: 10,
              fontSize: 16
            },
            inputStyle,
            pressable && { color: 'black' }
          ]}
        />
        {right}
      </View>
    </TouchableOpacity>
  );
};
