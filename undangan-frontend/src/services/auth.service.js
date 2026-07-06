import Api from 'src/utils/Api';
import useAuthState from 'src/store/auth.state';
import useFeedbackState from 'src/store/feedback.state';

const feedBack = useFeedbackState.getState();

export const registerUser = async (body) => {
  await Api().post('/v1/auth/register', body);
  feedBack.openSuccessFeedback('Registrasi berhasil, silahkan cek email untuk konfirmasi alamat email !');
};

export const loginUser = async (body) => {
  try {
    const response = await Api().post('/v1/auth/login', body);
    useAuthState.getState().saveAuth(response.data.access_token, response.data.user);
  } catch (error) {
    if (error.response.data.message === 'wrong email or password') {
      feedBack.openErrorFeedback('Email atau kata sandi tidak cocok !');
    } else if (
      error.response.data.message === 'user email is not verified, please check your email for the verification'
    ) {
      feedBack.openErrorFeedback('Email belum diverifikasi, silahkan cek email untuk konfirmasi alamat email !');
    }
    throw error;
  }
};
