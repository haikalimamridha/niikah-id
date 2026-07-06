import PropTypes from 'prop-types';
// material
import { visuallyHidden } from '@mui/utils';
import { Box, TableRow, TableCell, TableHead } from '@mui/material';

// ----------------------------------------------------------------------

ListHead.propTypes = {
  // orderBy: PropTypes.oneOf(['asc', 'desc']),
  // sortBy: PropTypes.string,
  headLabel: PropTypes.array,
  // onRequestSort: PropTypes.func,
};

export default function ListHead({ orderBy, sortBy, headLabel, onRequestSort }) {
  // const createSortHandler = (property) => (event) => {
  //   onRequestSort(event, property);
  // };

  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? 'right' : 'left'}
            // sortDirection={sortBy === headCell.id ? orderBy : false}
          >
            {/* <TableSortLabel
              hideSortIcon
              active={sortBy === headCell.id}
              direction={sortBy === headCell.id ? orderBy : 'asc'}
              onClick={createSortHandler(headCell.id)}
            > */}
            {headCell.label}
            {sortBy === headCell.id ? (
              <Box sx={{ ...visuallyHidden }}>{orderBy === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
            ) : null}
            {/* </TableSortLabel> */}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
