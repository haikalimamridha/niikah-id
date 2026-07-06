import { useState, memo } from 'react';
import { TextField } from '@mui/material';
import { InputAdornment, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';

export default memo(function PasswordInput(props) {
  const [isShow, setIsShow] = useState(false);

  return (
    <TextField
      {...props}
      type={isShow ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setIsShow(!isShow)} edge="end">
              <Icon icon={isShow ? eyeFill : eyeOffFill} />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
});
