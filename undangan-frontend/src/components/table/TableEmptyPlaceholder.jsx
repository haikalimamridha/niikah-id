import { TableRow, TableCell, CircularProgress } from '@mui/material';

function TableEmptyPlaceholder({ message, colspan, isLoading }) {
  return (
    <TableRow>
      <TableCell colSpan={colspan} style={{ textAlign: 'center' }}>
        {isLoading ? <CircularProgress /> : message}
      </TableCell>
    </TableRow>
  );
}

TableEmptyPlaceholder.defaultProps = {
  message: 'Data kosong atau tidak ditemukan',
  colspan: 6,
};

export default TableEmptyPlaceholder;
