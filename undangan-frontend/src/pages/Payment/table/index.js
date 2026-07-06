import { useQuery } from 'react-query';
import { Typography, Card, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { fDateTime } from 'src/utils/formatTime';
import { fRupiah } from 'src/utils/formatNumber';
// components
import Scrollbar from 'src/components/Scrollbar';
import Label from 'src/components/Label';
import ListHead from './ListHead';
import TableEmptyPlaceholder from 'src/components/table/TableEmptyPlaceholder';
import PaymentMoreMenu from './MoreMenu';
import { getMyInvoices } from 'src/services/invoice.service';

const TABLE_HEAD = [
  { id: 'meta.invitation.domain', label: 'Domain Undangan', alignRight: false },
  { id: 'meta.invitation.template_name', label: 'Nama Template', alignRight: false },
  { id: 'createdAt', label: 'Dibuat pada', alignRight: false },
  { id: 'total_price', label: 'Total Harga', alignRight: false },
  { id: 'payment_due_date', label: 'Tenggat Pembayaran', alignRight: false },
  { id: 'isPaid', label: 'Status', alignRight: false },
  { id: '' },
];

const invoiceStatus = {
  paid: {
    color: 'success',
    text: 'Sudah Dibayar',
  },
  not_paid: {
    color: 'error',
    text: 'Belum dibayar',
  },
  waiting: {
    color: 'warning',
    text: 'Menunggu konfirmasi',
  },
};

export default function PaymentTable({ onTriggerUploadModal }) {
  const { isSuccess, data, isLoading } = useQuery('userInvoices', getMyInvoices);

  return (
    <>
      <Card>
        <Scrollbar>
          <Table>
            <ListHead headLabel={TABLE_HEAD} />
            <TableBody>
              {isSuccess &&
                data?.data?.items?.map((row) => {
                  return (
                    <TableRow hover key={row.id} tabIndex={-1}>
                      <TableCell>
                        <Typography variant="subtitle2" noWrap>
                          {row?.meta?.invitation?.subdomain || ' - '}
                        </Typography>
                      </TableCell>
                      <TableCell>{row?.meta?.invitation?.template_name || ' - '}</TableCell>
                      <TableCell>{(row?.createdAt && fDateTime(row?.createdAt)) || ' - '}</TableCell>
                      <TableCell>{(row?.total_price && fRupiah(row?.total_price)) || ' - '}</TableCell>
                      <TableCell>{(row?.payment_due_date && fDateTime(row?.payment_due_date)) || ' - '}</TableCell>
                      <TableCell>
                        <Label variant="ghost" color={invoiceStatus[row.status].color}>
                          {invoiceStatus[row.status].text}
                        </Label>
                      </TableCell>
                      <TableCell>
                        <PaymentMoreMenu item={row} onUploadClick={onTriggerUploadModal} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              {(isLoading || data?.data?.items?.length === 0) && (
                <TableEmptyPlaceholder isLoading={isLoading} colspan={6} />
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </Card>
    </>
  );
}
