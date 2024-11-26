import { UserInfo } from '@slices/auth.slice';
import { apiService } from './api.service';

const userService = apiService.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getUserInfo: build.query<UserInfo, void>({
      query: () => `users/profile`,
      providesTags: ['User']
    }),
    updateUserInfo: build.mutation<UserInfo, Partial<UserInfo>>({
      query: (body) => ({
        url: `users/profile`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['User']
    })
  })
});
export const { useGetUserInfoQuery, useUpdateUserInfoMutation } = userService;
