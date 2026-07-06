import create from 'zustand';
import { persist } from 'zustand/middleware';
import Api from 'src/utils/Api';
import useAppState from './app.state';

const useAuthState = create(
  persist(
    (set, get) => ({
      isLogin: false,
      access_token: null,
      user: null,
      saveAuth: (access_token, user) => {
        set({ isLogin: true, user, access_token });
        useAppState.getState().loadAppStorage();
      },
      revokeAuth: () => {
        set({ isLogin: false, user: null, access_token: null });
        useAppState.getState().resetAppStorage();
      },
      checkAuthRemotely: async () => {
        try {
          const { data } = await Api().get('/v1/auth/check');
          set({ isLogin: true, user: data.user });
        } catch (error) {
          get().revokeAuth();
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthState;
