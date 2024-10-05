import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Text, TextInput } from 'react-native-paper';
export const EmailInput = ({
  control,
  errors,
}: {
  control: any;
  errors: any;
}) => {
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
                backgroundColor: theme.colors.surfaceVariant,
              },
            ]}
            label="Email"
            mode="outlined"
            placeholder="Nhập email"
            value={field.value}
            onChangeText={field.onChange}
            error={!!errors.email}
          />
          {errors.email && (
            <Text style={globalStyles.error}>{errors.email.message}</Text>
          )}
        </>
      )}
      control={control}
      name="email"
    />
  );
};

export const PasswordInput = ({
  control,
  errors,
}: {
  control: any;
  errors: any;
}) => {
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
                backgroundColor: theme.colors.surfaceVariant,
              },
            ]}
            label="Mật khẩu"
            mode="outlined"
            placeholder="Nhập mật khẩu"
            secureTextEntry={!showPassword}
            value={field.value}
            onChangeText={field.onChange}
            error={!!errors.password}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          {errors.password && (
            <Text style={globalStyles.error}>{errors.password.message}</Text>
          )}
        </>
      )}
      control={control}
      name="password"
    />
  );
};
