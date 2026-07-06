import { useState } from 'react';
import { truncate } from 'lodash-es';
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
  IconButton,
  Tooltip,
  Box,
  Stack,
} from '@mui/material';
import useDebounce from 'src/hooks/useDebounce';
// components
import Scrollbar from 'src/components/Scrollbar';
import ConfirmDialog from 'src/components/ConfirmDialog';
import ListToolbar from './ListToolbar';
import ListHead from './ListHead';
import MoreMenu from './MoreMenu';
import { deleteMultipleGuest, getGuests } from 'src/services/guest.service';
import TableEmptyPlaceholder from 'src/components/table/TableEmptyPlaceholder';
import { getLocalInvitationById } from 'src/services/invitation.service';
import { copyToClipBoard, replaceAll } from 'src/utils/helpers';
import { Icon } from '@iconify/react';
import copyOutline from '@iconify/icons-eva/copy-outline';

const TABLE_HEAD = [
  { id: 'name', label: 'Nama', alignRight: false },
  { id: 'code', label: 'Kode Unik', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'wa_number', label: 'Nomor Whatsapp', alignRight: false },
  { id: 'address', label: 'Alamat', alignRight: false },
  { id: 'invitation_url', label: 'Link undangan', alignRight: false },
  { id: '' },
];

export default function Guest({ invitationId, onEdit }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [order_by, setOrder_by] = useState('desc');
  const [sort_by, setSort_by] = useState('id');
  const search = useDebounce(filterName, 300);
  const { data, isSuccess, isLoading } = useQuery(
    ['guests', invitationId, { page, order_by, sort_by, search }],
    () => getGuests({ invitationId, params: { page: page + 1, order_by, sort_by, search } }),
    {
      enabled: !!invitationId,
      keepPreviousData: true,
    }
  );
  const [selected, setSelected] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const delMutation = useMutation(deleteMultipleGuest, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['guests', invitationId]);
      setSelected([]);
    },
  });

  const currentInvitation = getLocalInvitationById(invitationId);

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

  const handleRequestSort = (event, property) => {
    const isAsc = sort_by === property && order_by === 'asc';
    setOrder_by(isAsc ? 'desc' : 'asc');
    setSort_by(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data?.data?.items?.map((row) => row.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const generateMessage = (guestName, url) => {
    let message = currentInvitation.content.broadcast_template;
    message = replaceAll(message, '__NAMA__', guestName);
    message = replaceAll(message, '__LINK__', url || '{{Link undangan sudah tidak berlaku}}');
    return message;
  };

  const sendMessage = (waNumber, guestName, url) => {
    let message = generateMessage(guestName, url);
    window.open(`https://api.whatsapp.com/send?phone=${waNumber}&text=${message}`, '_blank');
  };

  const copyMessage = async (guestName) => {
    const message = generateMessage(guestName);
    await copyToClipBoard(message);
  };

  const copyInvitationUrl = async (url) => {
    await copyToClipBoard(url);
  };

  return (
    <>
      <Card>
        <ListToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={(e) => setFilterName(e.target.value)}
          onBulkDelete={() => setConfirm(true)}
        />
        <Scrollbar>
          <Table>
            <ListHead
              orderBy={order_by}
              sortBy={sort_by}
              headLabel={TABLE_HEAD}
              rowCount={data?.data?.items?.length || 0}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
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
                      <TableCell>{row.code}</TableCell>
                      <TableCell>{row.email || '-'}</TableCell>
                      <TableCell>{row.wa_number || '-'}</TableCell>
                      <TableCell>{truncate(row.address, { length: 30 }) || '-'}</TableCell>
                      <TableCell>
                        <Stack flexDirection="row" alignItems="center">
                          <Tooltip title={row?.invitation_url || ''}>
                            <Box sx={{ display: 'inline-block' }}>
                              {truncate(row?.invitation_url, { length: 25 }) || '-'}
                            </Box>
                          </Tooltip>
                          {row.invitation_url && (
                            <Tooltip title="Salin alamat undangan">
                              <IconButton onClick={() => copyInvitationUrl(row.invitation_url)}>
                                <Icon icon={copyOutline} width={20} height={20} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <MoreMenu
                          onDelete={() => delMutation.mutate({ ids: [row.id], invitationId })}
                          onEdit={() => onEdit(row.id)}
                          sendMessage={() => sendMessage(row.wa_number, row.name, row.invitation_url)}
                          copyMessage={() => copyMessage(row.name)}
                        />
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
