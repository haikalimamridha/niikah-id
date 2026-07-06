import { styled } from '@mui/material/styles';

const ImagePreview = styled('img')(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: '60%',
  height: 140,
  objectFit: 'cover',
}));

export default ImagePreview;
