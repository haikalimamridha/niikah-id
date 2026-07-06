import { CSVLink } from 'react-csv';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import cloudDownload from '@iconify/icons-eva/cloud-download-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import Api from 'src/utils/Api';

const csvHeaders = [
  { label: 'Nama', key: 'name' },
  { label: 'Ucapan', key: 'comment' },
  { label: 'Tanggal', key: 'createdAt' },
];

// ----------------------------------------------------------------------

export default function CommentMoreMenu({ invitationId }) {
  const ref = useRef(null);
  const csvRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [csvData, setCsvData] = useState([]);

  const exportCsv = async () => {
    const response = await Api().get(`/invitations/${invitationId}/comments?limit=1000&sort_by=id&order_by=desc`);
    setCsvData(
      response.data?.items?.map((val) => ({ ...val, createdAt: new Date(val.createdAt).toLocaleDateString() }))
    );
    csvRef.current.link.click();
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={exportCsv}>
          <ListItemIcon>
            <Icon icon={cloudDownload} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Expor ke CSV" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
      <CSVLink ref={csvRef} filename="daftar-ucapan.csv" data={csvData} headers={csvHeaders} />
    </>
  );
}
