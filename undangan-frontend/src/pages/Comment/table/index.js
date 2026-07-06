import { useState } from 'react';
import { format } from 'date-fns';
import localeId from 'date-fns/locale/id';
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
import useDebounce from 'src/hooks/useDebounce';
// components
import Scrollbar from 'src/components/Scrollbar';
import ConfirmDialog from 'src/components/ConfirmDialog';
import ListToolbar from './ListToolbar';
import ListHead from './ListHead';
import MoreMenu from './MoreMenu';
import TableEmptyPlaceholder from 'src/components/table/TableEmptyPlaceholder';

const TABLE_HEAD = [
  { id: 'name', label: 'Nama', alignRight: false },
  { id: 'comment', label: 'Ucapan', alignRight: false },
  { id: 'createdAt', label: 'Ditulis pada', alignRight: false },
  { id: '' },
];

const fetchComments = (invitationId, { page, sort_by, order_by, search }) => {
  return Api().get(`/invitations/${invitationId}/comments`, { params: { page, sort_by, order_by, search } });
};

const handleDelete = ({ invitationId, ids = [] }) => {
  return Api().post(`/invitations/${invitationId}/comments/delete`, { commentIds: ids });
};

export default function Guest({ invitationId, onEdit }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [order_by, setOrder_by] = useState('desc');
  const [sort_by, setSort_by] = useState('id');
  const search = useDebounce(filterName, 300);
  const { data, isSuccess, isLoading } = useQuery(
    ['comments', invitationId, { page, order_by, sort_by, search }],
    () => fetchComments(invitationId, { page: page + 1, order_by, sort_by, search }),
    {
      enabled: !!invitationId,
      keepPreviousData: true,
    }
  );
  const [selected, setSelected] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const delMutation = useMutation(handleDelete, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['comments', invitationId]);
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
                          {truncate(row.name, { length: 35 })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{row.comment}</Typography>
                      </TableCell>
                      <TableCell width="10%">{format(new Date(row.createdAt), 'PP', { locale: localeId })}</TableCell>
                      <TableCell>
                        <MoreMenu
                          onDelete={() => delMutation.mutate({ ids: [row.id], invitationId })}
                          onEdit={() => onEdit(row.id)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              {(isLoading || data?.data?.items?.length === 0) && (
                <TableEmptyPlaceholder isLoading={isLoading} colspan={5} />
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
          text="Ucapan terpilih akan dihapus secara permanen"
        />
      </Portal>
    </>
  );
}
