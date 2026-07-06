import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const AddPhotoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: 200,
  height: 200,
  borderRadius: 12,
  marginRight: 20,
  borderColor: theme.palette.primary.main,
  borderWidth: 2,
  borderStyle: 'dashed',
  marginBottom: '20px',
  transition: 'all 0.15s ease',
  ':hover': {
    cursor: 'pointer',
    backgroundColor: theme.palette.primary.lighter,
  },
  ':active': {
    transform: 'scale(0.98)',
  },
}));

export default AddPhotoBox;
