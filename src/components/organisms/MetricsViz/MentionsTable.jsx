import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';
import { separateNumberWithCommas } from '../../atoms/functions';

const MentionsTable = (metrics) => {
  const mentionedUsers = metrics.metrics['mentioned_users'];
  const mentionFreqs = metrics.metrics['mention_freqs'];

  const rows = mentionFreqs.map((freq, i) => ({
    user: '@' + mentionedUsers[i],
    freq: separateNumberWithCommas(freq),
  }));

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ユーザー</TableCell>
            <TableCell align="right">メンション回数</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              <TableCell key={row.user} component="th" scope="row">
                {row.user}
              </TableCell>
              <TableCell key={row.freq} align="right">
                {row.freq}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

MentionsTable.propTypes = {
  metrics: PropTypes.object.isRequired,
};

export default MentionsTable;
