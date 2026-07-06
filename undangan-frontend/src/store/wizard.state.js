import create from 'zustand';
import Api from 'src/utils/Api';

const initialState = {
  registedToken: null,
  invitation_id: null,
  wizard: {
    // steps: ['Data pengantin', 'Data Acara', 'Audio & Visual', 'Website Undangan', 'Buat Akun', 'Proses Data'],
    steps: ['Data pengantin', 'Data Acara', 'Website Undangan', 'Buat Akun', 'Proses Data'],
    activeStep: 0,
  },
  title: '',
  subdomain: '',
  package_id: '',
  template_name: '',
  male_name: '',
  female_name: '',
  male_parents: '',
  female_parents: '',
  male_nickname: '',
  female_nickname: '',
  photo_male: null,
  photo_female: null,
  photo_main: null,
  bg_music: null,
  url_youtube: '',
  subevent: {
    name: '',
    location_name: '',
    location_address: '',
    location_coordinate: '',
    time_start: null,
    time_end: null,
  },
  account: {
    name: '',
    email: '',
    phone: '',
    password: '',
  },
};

const useWizardState = create((set, get) => ({
  ...initialState,
  nextForm: () =>
    set((prev) => ({
      wizard: {
        ...get().wizard,
        activeStep: prev.wizard.activeStep + 1,
      },
    })),
  prevForm: () =>
    set((prev) => ({
      wizard: {
        ...get().wizard,
        activeStep: prev.wizard.activeStep - 1,
      },
    })),
  setBrideForm: (data) =>
    set({
      ...get(),
      male_name: data?.male_name,
      female_name: data?.female_name,
      male_parents: data?.male_parents,
      female_parents: data?.female_parents,
      photo_male: data?.photo_male,
      photo_female: data?.photo_female,
      male_nickname: data?.male_nickname,
      female_nickname: data?.female_nickname,
    }),
  setSubeventForm: (data) =>
    set({
      ...get(),
      subevent: {
        name: data?.name,
        location_name: data?.location_name,
        location_address: data?.location_address,
        location_coordinate: data?.location_coordinate || null,
        time_start: data?.time_start,
        time_end: data?.time_end,
      },
    }),
  setMultimediaForm: (data) =>
    set({
      ...get(),
      url_youtube: data?.url_youtube,
      photo_main: data?.photo_main,
      bg_music: data?.bg_music,
    }),
  setInvitationForm: (data) =>
    set({
      ...get(),
      title: data?.title,
      subdomain: data?.subdomain,
      package_id: data?.package_id,
      template_name: data?.template_name,
    }),
  setAccount: (data) =>
    set({
      ...get(),
      account: {
        name: data?.name,
        email: data?.email,
        phone: data?.phone,
        password: data?.password,
      },
    }),
  registerProcess: async (recaptcha_token) => {
    const data = Object.assign({}, get().account);
    const response = await Api().post('/auth/register', { ...data, recaptcha_token });
    set({ ...get(), registedToken: response.data.access_token });
  },
  invitationCreation: async () => {
    const data = new FormData();
    data.append('subdomain', get().subdomain);
    data.append('package_id', get().package_id);
    data.append('template_name', get().template_name);
    data.append('title', get().title);
    data.append('male_name', get().male_name);
    data.append('female_name', get().female_name);
    data.append('male_parents', get().male_parents);
    data.append('female_parents', get().male_parents);
    data.append('male_nickname', get().male_nickname);
    data.append('female_nickname', get().female_nickname);
    get().photo_male && data.append('photo_male', get().photo_male);
    get().photo_female && data.append('photo_female', get().photo_female);
    get().photo_main && data.append('photo_main', get().photo_main);
    get().bg_music && data.append('bg_music', get().bg_music);
    get().url_youtube && data.append('url_youtube', get().url_youtube);

    const response = await Api(get().registedToken).post('/invitations', data);
    set({ ...get(), invitation_id: response.data.item.id });
  },
  subeventCreation: () => {
    const data = Object.assign({}, get().subevent);
    return Api(get().registedToken).post(`/invitations/${get().invitation_id}/subevents`, data);
  },
  resetWizard: () => set({ ...get(), ...initialState }, true),
}));

export default useWizardState;
