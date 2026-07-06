import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useQuery } from 'react-query';
import { formatDistance } from 'date-fns';
import { id } from 'date-fns/locale';
import { Link as RouterLink } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import { Box, Stack, Link, Card, Button, Divider, Typography, CardHeader } from '@mui/material';
import Api from 'src/utils/Api';

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
};

function CommentItem(props) {
  const { name, comment, createdAt } = props.comment;

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" flex={1}>
        <Box sx={{ width: '90%' }}>
          <Link to="#" color="inherit" underline="hover" component={RouterLink}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Link>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} paragraph>
            {comment}
          </Typography>
        </Box>
      </Stack>
      <Typography variant="caption" sx={{ pr: 4, flexShrink: 0, color: 'text.secondary' }}>
        {formatDistance(new Date(createdAt), new Date(), { locale: id })}
      </Typography>
    </Stack>
  );
}

function EmptyComments() {
  return (
    <Stack direction="row">
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Typography variant="subtitle2">Tidak ada ucapan masuk</Typography>
      </Box>
    </Stack>
  );
}

export default function LatestComment() {
  const { data } = useQuery('userLatestComments', () => Api().get('/v1/stats/latest-comments'));

  return (
    <Card>
      <CardHeader title="Ucapan Terkini" />

      <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
        {data?.data?.data.map((comment, i) => (
          <CommentItem key={i} comment={comment} />
        ))}
        {!data?.data?.data?.length && <EmptyComments />}
      </Stack>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          to="/dashboard/comment"
          size="small"
          color="inherit"
          component={RouterLink}
          endIcon={<Icon icon={arrowIosForwardFill} />}
        >
          Lihat Semua
        </Button>
      </Box>
    </Card>
  );
}
