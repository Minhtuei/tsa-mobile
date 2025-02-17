import { UserInfo } from 'app/shared/state/auth.slice';
import { apiService } from '../../../shared/services/api.service';

const profileApi = apiService.injectEndpoints({
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
export const { useGetUserInfoQuery, useUpdateUserInfoMutation } = profileApi;
