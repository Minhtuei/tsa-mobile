import {
  CreateAccountSchemaType,
  SignInSchemaType,
  SignUpSchemaType,
} from '@validations/auth.schema';
import { apiService } from './api.service';
const authService = apiService.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    signIn: build.mutation<void, SignInSchemaType>({
      query: (body) => ({
        url: `auth/signin`,
        method: 'POST',
        body,
      }),
    }),
    signUp: build.mutation<void, SignUpSchemaType>({
      query: (body) => ({
        url: `auth/signup/initiate`,
        method: 'POST',
        body,
      }),
    }),
    verifyEmail: build.query({
      query: (token: string) => `auth/signup/verify?token=${token}`,
    }),

    completeRegistration: build.mutation<
      void,
      Omit<CreateAccountSchemaType, 'confirmPassword'>
    >({
      query: (body) => ({
        url: `auth/signup/complete`,
        method: 'POST',
        body,
      }),
    }),
    refreshToken: build.mutation({
      query: (body) => ({
        url: `auth/refresh`,
        method: 'POST',
        body,
      }),
    }),
  }),
});
export const {
  useSignInMutation,
  useSignUpMutation,
  useVerifyEmailQuery,
  useCompleteRegistrationMutation,
  useRefreshTokenMutation,
} = authService;
