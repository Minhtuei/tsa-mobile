import { UserInfo } from 'app/state/auth.slice';
import { apiService } from '../../../services/api.service';

const userService = apiService.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getUserInfo: build.query<UserInfo, void>({
      query: () => `users/profile`,
      providesTags: ['Profile']
    }),
    updateUserInfo: build.mutation<UserInfo, Partial<UserInfo>>({
      query: (body) => ({
        url: `users/profile`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['Profile']
    })
  })
});
export const { useGetUserInfoQuery, useUpdateUserInfoMutation } = userService;
