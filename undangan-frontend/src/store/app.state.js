import create from 'zustand';
import Api from 'src/utils/Api';
import { persist } from 'zustand/middleware';

const initialState = {
  userInvitation: [],
  packages: [],
  templates: [],
};

const useAppState = create(
  persist(
    (set) => ({
      ...initialState,
      getUserInvitation: async () => {
        try {
          const { data } = await Api().get('/v1/invitations');
          set({ userInvitation: data.items });
        } catch (error) {
          set({ userInvitation: [] });
        }
      },
      getPackages: async () => {
        const { data } = await Api().get('/v1/packages');
        set({ packages: data.items });
      },
      getTemplates: async () => {
        const { data } = await Api().get('/v1/templates');
        set({ templates: data.items });
      },
      loadAppStorage: async () => {
        useAppState.getState().getUserInvitation();
        useAppState.getState().getPackages();
        useAppState.getState().getTemplates();
      },
      resetAppStorage: () => set({ ...initialState }),
    }),
    {
      name: 'app-storage',
    }
  )
);

export default useAppState;
