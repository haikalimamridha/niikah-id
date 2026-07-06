import PropTypes from 'prop-types';
import { Stack, Button } from '@mui/material';

export default function StepNavigator({ onBack, onNext, disabledBack, disabledNext, nextText, prevText }) {
  return (
    <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
      <Button color="error" variant="contained" onClick={onBack} disabled={disabledBack}>
        {prevText || 'Kembali'}
      </Button>
      <Button variant="contained" sx={{ ml: 3 }} onClick={onNext} disabled={disabledNext}>
        {nextText || 'Selanjutnya'}
      </Button>
    </Stack>
  );
}

StepNavigator.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  disabledBack: PropTypes.bool,
  disabledNext: PropTypes.bool,
  nextText: PropTypes.string,
  prevText: PropTypes.string,
};
