import useAppState from 'src/store/app.state';

export const getInvitationPackage = (pckgId) => {
  const packages = useAppState.getState().packages;
  return packages?.find((pckg) => pckg.id === pckgId) || {};
};
