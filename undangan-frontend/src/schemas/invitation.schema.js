import * as Yup from 'yup';
import { omit } from 'lodash-es';

const base_schema = {
  title: Yup.string().required('Judul undangan wajib diisi'),
  subdomain: Yup.string().matches(/^\S*$/, 'Tidak boleh ada spasi').required('Subdomain wajib diisi'),
  template_name: Yup.string().required('Template wajib diisi'),
  url_youtube: Yup.string().url(),
  male_name: Yup.string().required('Nama Pengantin laki-laki wajib diisi'),
  female_name: Yup.string().required('Nama Pengantin perempuan wajib diisi'),
  male_parents: Yup.string().required('Nama wali wajib diisi'),
  female_parents: Yup.string().required('Nama wali wajib diisi'),
  package_id: Yup.number().required('Paket Undangan wajib diisi'),
  male_nickname: Yup.string().required('Nama Panggilan mempelai laki-laki wajib diisi'),
  female_nickname: Yup.string().required('Nama Panggilan mempelai perempuan wajib diisi'),
};

export const websiteWizardSchema = Yup.object().shape({
  title: Yup.string().required('Judul undangan wajib diisi'),
  subdomain: Yup.string().matches(/^\S*$/, 'Tidak boleh ada spasi').required('Subdomain wajib diisi'),
  package_id: Yup.number().required('Paket Undangan wajib diisi'),
  template_name: Yup.string().required('Template wajib diisi'),
});

export const invitationSchema = Yup.object().shape({ ...base_schema });

export const editInvitationSchema = Yup.object().shape({ ...omit(base_schema, ['package_id']) });
