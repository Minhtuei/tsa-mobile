import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
export const EmailInput = ({ control, errors }: { control: any; errors: any }) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  return (
    <Controller
      render={({ field }) => (
        <>
          <TextInput
            style={[
              globalStyles.input,
              {
                backgroundColor: theme.colors.surfaceVariant
              }
            ]}
            label='Email'
            mode='outlined'
            placeholder='Nhập email'
            value={field.value}
            onChangeText={field.onChange}
            error={!!errors.email}
          />
          {errors.email && <Text style={globalStyles.error}>{errors.email.message}</Text>}
        </>
      )}
      control={control}
      name='email'
    />
  );
};

export const PasswordInput = ({ control, errors }: { control: any; errors: any }) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Controller
      render={({ field }) => (
        <>
          <TextInput
            style={[
              globalStyles.input,
              {
                backgroundColor: theme.colors.surfaceVariant
              }
            ]}
            label='Mật khẩu'
            mode='outlined'
            placeholder='Nhập mật khẩu'
            secureTextEntry={!showPassword}
            value={field.value}
            onChangeText={field.onChange}
            error={!!errors.password}
            right={
              <TextInput.Icon
                icon={!showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          {errors.password && <Text style={globalStyles.error}>{errors.password.message}</Text>}
        </>
      )}
      control={control}
      name='password'
    />
  );
};

export const ConfirmPasswordInput = ({ control, errors }: { control: any; errors: any }) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Controller
      render={({ field }) => (
        <>
          <TextInput
            style={[
              globalStyles.input,
              {
                backgroundColor: theme.colors.surfaceVariant
              }
            ]}
            label='Nhập lại mật khẩu'
            mode='outlined'
            placeholder='Nhập lại mật khẩu'
            secureTextEntry={!showPassword}
            value={field.value}
            onChangeText={field.onChange}
            error={!!errors.confirmPassword}
            right={
              <TextInput.Icon
                icon={!showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          {errors.confirmPassword && (
            <Text style={globalStyles.error}>{errors.confirmPassword.message}</Text>
          )}
        </>
      )}
      control={control}
      name='confirmPassword'
    />
  );
};

export const FirstNameInput = ({ control, errors }: { control: any; errors: any }) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  return (
    <Controller
      render={({ field }) => (
        <>
          <TextInput
            style={[
              globalStyles.input,
              {
                backgroundColor: theme.colors.surfaceVariant
              }
            ]}
            label='Tên'
            mode='outlined'
            placeholder='Nhập tên'
            value={field.value}
            onChangeText={field.onChange}
            error={!!errors.firstName}
          />
          {errors.firstName && <Text style={globalStyles.error}>{errors.firstName.message}</Text>}
        </>
      )}
      control={control}
      name='firstName'
    />
  );
};

export const LastNameInput = ({ control, errors }: { control: any; errors: any }) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  return (
    <Controller
      render={({ field }) => (
        <>
          <TextInput
            style={[
              globalStyles.input,
              {
                backgroundColor: theme.colors.surfaceVariant
              }
            ]}
            label='Họ'
            mode='outlined'
            placeholder='Nhập họ'
            value={field.value}
            onChangeText={field.onChange}
            error={!!errors.lastName}
          />
          {errors.lastName && <Text style={globalStyles.error}>{errors.lastName.message}</Text>}
        </>
      )}
      control={control}
      name='lastName'
    />
  );
};

export const PhoneNumberInput = ({ control, errors }: { control: any; errors: any }) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  return (
    <Controller
      render={({ field }) => (
        <>
          <TextInput
            style={[
              globalStyles.input,
              {
                backgroundColor: theme.colors.surfaceVariant
              }
            ]}
            label='Số điện thoại'
            mode='outlined'
            placeholder='Nhập số điện thoại'
            value={field.value}
            onChangeText={field.onChange}
            error={!!errors.phoneNumber}
          />
          {errors.phoneNumber && (
            <Text style={globalStyles.error}>{errors.phoneNumber.message}</Text>
          )}
        </>
      )}
      control={control}
      name='phoneNumber'
    />
  );
};

export const DormitorySelect = ({
  control,
  errors,
  dormitories
}: {
  control: any;
  errors: any;
  dormitories: string[];
}) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const options = dormitories.map((dormitory) => ({
    label: `KTX ${dormitory}`,
    value: dormitory
  }));
  return (
    <Controller
      render={({ field }) => (
        <View style={globalStyles.input}>
          <Dropdown
            label='Chọn kí túc xá'
            mode='flat'
            value={field.value}
            onSelect={(value) => {
              field.onChange(value);
            }}
            placeholder='Chọn kí túc xá'
            options={options}
            menuContentStyle={{
              backgroundColor: theme.colors.surfaceVariant
            }}
          />
          {errors.dormitory && <Text style={globalStyles.error}>{errors.dormitory.message}</Text>}
        </View>
      )}
      control={control}
      name='dormitory'
    />
  );
};

export const RoomSelect = ({
  control,
  errors,
  rooms
}: {
  control: any;
  errors: any;
  rooms: string[];
}) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const options = rooms.map((room) => ({
    label: `Phòng ${room}`,
    value: room
  }));
  return (
    <Controller
      render={({ field }) => (
        <View style={globalStyles.input}>
          <Dropdown
            label='Chọn phòng'
            mode='flat'
            value={field.value}
            onSelect={(value) => {
              field.onChange(value);
            }}
            placeholder='Chọn phòng'
            options={options}
            menuContentStyle={{
              backgroundColor: theme.colors.surfaceVariant
            }}
          />
          {errors.room && <Text style={globalStyles.error}>{errors.room.message}</Text>}
        </View>
      )}
      control={control}
      name='room'
    />
  );
};

export const BuildingSelect = ({
  control,
  errors,
  buildings
}: {
  control: any;
  errors: any;
  buildings: string[];
}) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const options = buildings.map((building) => ({
    label: `Tòa nhà ${building}`,
    value: building
  }));
  return (
    <Controller
      render={({ field }) => (
        <View style={globalStyles.input}>
          <Dropdown
            label='Chọn tòa nhà'
            mode='flat'
            value={field.value}
            onSelect={(value) => {
              field.onChange(value);
            }}
            placeholder='Chọn tòa nhà'
            options={options}
            menuContentStyle={{
              backgroundColor: theme.colors.surfaceVariant
            }}
          />
          {errors.building && <Text style={globalStyles.error}>{errors.building.message}</Text>}
        </View>
      )}
      control={control}
      name='building'
    />
  );
};
