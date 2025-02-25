import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
GoogleSignin.configure({
  webClientId: process.env.EXPO_GOOGLE_WEB_CLIENT_ID || ''
});
interface GoogleSignInResult {
  idToken: string | null;
  error: string | null;
}

export const googleSignIn = async (): Promise<GoogleSignInResult> => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    if (isSuccessResponse(response)) {
      const idToken = response.data.idToken;
      if (!idToken) {
        return { idToken: null, error: 'Không thể lấy idToken' };
      }
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      const firebaseIdToken = await userCredential.user.getIdToken(true);
      return { idToken: firebaseIdToken, error: null };
    } else {
      return { idToken: null, error: null };
    }
  } catch (err) {
    let errorMessage = 'Lỗi không xác định trong quá trình đăng nhập';
    if (isErrorWithCode(err)) {
      switch (err.code) {
        case statusCodes.IN_PROGRESS:
          errorMessage = 'Đang xử lý';
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          errorMessage = 'Google Play Services không khả dụng';
          break;
        case statusCodes.SIGN_IN_CANCELLED:
          errorMessage = 'Đăng nhập đã bị hủy';
          break;
        case statusCodes.SIGN_IN_REQUIRED:
          errorMessage = 'Yêu cầu đăng nhập';
          break;
      }
    }
    return { idToken: null, error: errorMessage };
  }
};

export const googleSignOut = async (): Promise<{ error: string | null }> => {
  try {
    await GoogleSignin.signOut();
    return { error: null };
  } catch {
    return { error: 'Lỗi không xác định trong quá trình đăng xuất' };
  }
};

export const revokeAccess = async (): Promise<{ error: string | null }> => {
  try {
    await GoogleSignin.revokeAccess();
    return { error: null };
  } catch {
    return { error: 'Lỗi không xác định trong quá trình thu hồi quyền truy cập' };
  }
};
