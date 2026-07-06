import { useState } from 'react';
import truncate from 'lodash-es/truncate';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Typography,
  Card,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Checkbox,
  Portal,
} from '@mui/material';
import Api from 'src/utils/Api';
import { fDateTime } from 'src/utils/formatTime';
// components
import Scrollbar from 'src/components/Scrollbar';
import ConfirmDialog from 'src/components/ConfirmDialog';
import ListToolbar from './ListToolbar';
import ListHead from './ListHead';
import MoreMenu from './MoreMenu';
import TableEmptyPlaceholder from 'src/components/table/TableEmptyPlaceholder';
import Label from 'src/components/Label';

const TABLE_HEAD = [
  { id: 'name', label: 'Nama Acara', alignRight: false },
  { id: 'location_name', label: 'Lokasi Acara', alignRight: false },
  { id: 'time_start', label: 'Waktu Mulai', alignRight: false },
  { id: 'time_end', label: 'Waktu Selesai', alignRight: false },
  { id: 'is_primary', label: 'Status', alignRight: false },
  { id: 'location_address', label: 'Alamat Lokasi', alignRight: false },
  { id: '' },
];

const fetchEvents = (invitationId, { page }) => {
  return Api().get(`/invitations/${invitationId}/subevents`, { params: { page } });
};

const handleDelete = ({ invitationId, ids = [] }) => {
  return Api().post(`/invitations/${invitationId}/subevents/delete`, { subeventIds: ids });
};

export default function TableData({ invitationId, onEdit }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const { data, isSuccess, isLoading } = useQuery(
    ['events', invitationId, { page }],
    () => fetchEvents(invitationId, { page: page + 1 }),
    {
      enabled: !!invitationId,
      keepPreviousData: true,
    }
  );
  const [selected, setSelected] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const delMutation = useMutation(handleDelete, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['events', invitationId]);
      setSelected([]);
    },
  });

  const handleClick = (id) => {
    if (!selected.includes(id)) {
      setSelected((sct) => [...sct, id]);
    } else {
      setSelected((sct) => [...sct.filter((val) => val !== id)]);
    }
  };

  const handleChangePage = (event, newPage) => {
    if (newPage > data?.data?.pagination?.totalPages) {
      return;
    }
    setPage(newPage);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data?.data?.items?.map((row) => row.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const getPrimaryEvent = data?.data?.items?.filter((event) => event.is_primary === true)[0];

  return (
    <>
      <Card>
        <ListToolbar numSelected={selected.length} onBulkDelete={() => setConfirm(true)} />
        <Scrollbar>
          <Table>
            <ListHead
              headLabel={TABLE_HEAD}
              rowCount={data?.data?.items?.length || 0}
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {isSuccess &&
                data?.data?.items?.map((row) => {
                  const isItemSelected = selected.includes(row.id);
                  return (
                    <TableRow
                      hover
                      key={row.id}
                      role="checkbox"
                      tabIndex={-1}
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} onChange={(e) => handleClick(row.id)} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" noWrap>
                          {row.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{row.location_name}</TableCell>
                      <TableCell>{(row.time_start && fDateTime(row.time_start)) || '-'}</TableCell>
                      <TableCell>{(row.time_end && fDateTime(row.time_end)) || '-'}</TableCell>
                      <TableCell>
                        <Label variant="ghost" color={row.is_primary ? 'success' : 'info'}>
                          {row.is_primary ? 'Acara Utama' : 'Acara Sekunder'}
                        </Label>
                      </TableCell>
                      <TableCell>{truncate(row.location_address, { length: 30 }) || '-'}</TableCell>
                      <TableCell>
                        <MoreMenu
                          item={row}
                          isPrimaryAvailable={Boolean(getPrimaryEvent)}
                          onDelete={() => delMutation.mutate({ ids: [row.id], invitationId })}
                          onEdit={() => onEdit(row.id)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              {(isLoading || data?.data?.items?.length === 0) && (
                <TableEmptyPlaceholder isLoading={isLoading} colspan={7} />
              )}
            </TableBody>
          </Table>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={[25]}
          component="div"
          count={data?.data?.pagination?.totalItems || 0}
          rowsPerPage={25}
          page={page}
          onPageChange={handleChangePage}
        />
      </Card>
      <Portal>
        <ConfirmDialog
          isOpen={confirm}
          onClose={() => setConfirm(false)}
          onConfirm={() => delMutation.mutate({ ids: selected, invitationId })}
          title="Apakah kamu yakin ?"
          text="Tamu terpilih akan dihapus secara permanen"
        />
      </Portal>
    </>
  );
}
