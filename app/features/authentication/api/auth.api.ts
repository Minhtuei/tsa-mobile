import { AuthState } from 'app/shared/state/auth.slice';
import {
  CreateAccountSchemaType,
  SignInSchemaType,
  SignUpSchemaType
} from 'app/features/authentication/schema/auth.schema';
import { apiService } from '@services/api.service';
const authenticationApi = apiService.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    signIn: build.mutation<AuthState, SignInSchemaType>({
      query: (body) => ({
        url: `auth/signin`,
        method: 'POST',
        body
      })
    }),
    signUp: build.mutation<void, SignUpSchemaType>({
      query: (body) => ({
        url: `auth/signup/initiate`,
        method: 'POST',
        body
      })
    }),
    verifyEmail: build.query({
      query: (token: string) => `auth/signup/verify?token=${token}`
    }),

    completeRegistration: build.mutation<void, Omit<CreateAccountSchemaType, 'confirmPassword'>>({
      query: (body) => ({
        url: `auth/signup/complete`,
        method: 'POST',
        body
      })
    }),
    refreshToken: build.mutation({
      query: (body) => ({
        url: `auth/refresh`,
        method: 'POST',
        body
      })
    }),
    logout: build.mutation<void, { refreshToken: string }>({
      query: (body) => ({
        url: `auth/signout`,
        method: 'POST',
        body
      })
    }),
    googleSignIn: build.mutation<AuthState, { idToken: string }>({
      query: (body) => ({
        url: `auth/signin/google`,
        method: 'POST',
        body
      })
    })
  })
});
export const {
  useSignInMutation,
  useSignUpMutation,
  useVerifyEmailQuery,
  useCompleteRegistrationMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGoogleSignInMutation
} = authenticationApi;
