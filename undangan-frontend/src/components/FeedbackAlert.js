import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/lab/Alert';
import useFeedbackState from 'src/store/feedback.state';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const FeedbackAlert = () => {
  const state = useFeedbackState();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    state.closeFeedback();
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={state.open}
      autoHideDuration={5000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={state.severity} sx={{ width: '100%' }}>
        {state.message}
      </Alert>
    </Snackbar>
  );
};

export default FeedbackAlert;
