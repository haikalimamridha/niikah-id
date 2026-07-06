import { memo } from 'react';
import { InputLabel, MenuItem, Select, FormControl } from '@mui/material';
import useAppState from 'src/store/app.state';

function SelectInvitation({ onChange, value }) {
  const userInvitation = useAppState((state) => state.userInvitation);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <FormControl sx={{ width: 300 }}>
      <InputLabel id="demo-simple-select-label">Undangan</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label="Undangan"
        onChange={handleChange}
      >
        {userInvitation.map((inv, i) => (
          <MenuItem key={i} value={inv.id}>
            {inv.content.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default memo(SelectInvitation);
