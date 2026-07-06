import { Icon } from '@iconify/react';
import { useQuery } from 'react-query';
import contactsOutlined from '@iconify/icons-ant-design/contacts-outlined';
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
import Api from 'src/utils/Api';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter,
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
    theme.palette.primary.dark,
    0.24
  )} 100%)`,
}));

// ----------------------------------------------------------------------

export default function InvitationStats() {
  // Queries
  const { data } = useQuery('userInvitationStats', () => Api().get('/v1/stats/invitation'));

  return (
    <RootStyle>
      <IconWrapperStyle>
        <Icon icon={contactsOutlined} width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">{data?.data?.total_invitation || 0}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Total Undangan
      </Typography>
    </RootStyle>
  );
}
