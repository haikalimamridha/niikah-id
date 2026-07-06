import axios from 'axios';
import useAuthState from 'src/store/auth.state';
import useFeedbackState from 'src/store/feedback.state';
import config from 'src/constants/config';

const instance = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 8000,
});

instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  // function (error) {
  //   // Any status codes that falls outside the range of 2xx cause this function to trigger
  //   // Do something with response error
  //   if (error.message === 'Network Error') {
  //     useFeedbackState.getState().openErrorFeedback(error.message);
  //   } else if (error.response.status === 401) {
  //     // handle and automaticaly log out users when JWT token is expired
  //     useAuthState.getState().revokeAuth();
  //   } else {
  //     useFeedbackState.getState().openErrorFeedback(error.response.data.message);
  //   }

  //   return Promise.reject(error);
  // }
  error => {

    if (!error.response) {
      useFeedbackState
        .getState()
        .openErrorFeedback(error.message || 'Server tidak dapat diakses');

      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      useAuthState.getState().revokeAuth();
    } else {
      useFeedbackState
        .getState()
        .openErrorFeedback(
          error.response.data?.message || 'Terjadi kesalahan'
        );
    }

    return Promise.reject(error);
  }
);

const Api = (customToken) => {
  const token = useAuthState.getState().access_token || customToken;
  if (token) {
    instance.defaults.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return instance;
};

export default Api;
