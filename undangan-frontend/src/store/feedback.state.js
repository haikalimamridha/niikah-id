import create from 'zustand';

const useFeedbackState = create((set) => ({
  severity: null,
  open: false,
  message: '',
  closeFeedback: () => set({ open: false }),
  openSuccessFeedback: (message) => set({ open: true, severity: 'success', message }),
  openErrorFeedback: (message) => set({ open: true, severity: 'error', message }),
  openWarningFeedback: (message) => set({ open: true, severity: 'warning', message }),
  openInfoFeedback: (message) => set({ open: true, severity: 'info', message }),
}));

export default useFeedbackState;
