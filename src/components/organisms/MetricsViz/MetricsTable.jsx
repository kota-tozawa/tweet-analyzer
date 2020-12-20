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
import { roundDecimal, separateNumberWithCommas } from '../../atoms/functions';

const MetricsTable = (metrics) => {
  const data = metrics.metrics;

  const createData = (user, retweetRatio, totalFavs, totalRetweets) => {
    return { user, retweetRatio, totalFavs, totalRetweets };
  };

  const parseRetweetRatio = (retweetRatio) => {
    return roundDecimal(retweetRatio, 3) * 100 + '%';
  };

  const rows = [
    createData(
      '@' + data['user'],
      parseRetweetRatio(data['retweet_ratio']),
      separateNumberWithCommas(data['total_favs']),
      separateNumberWithCommas(data['total_retweets'])
    ),
  ];

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ユーザー</TableCell>
            <TableCell align="right">リツイート割合</TableCell>
            <TableCell align="right">いいねされた数</TableCell>
            <TableCell align="right">リツイートされた数</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              <TableCell component="th" scope="row">
                {row.user}
              </TableCell>
              <TableCell key={row.retweetRatio} align="right">
                {row.retweetRatio}
              </TableCell>
              <TableCell key={row.totalFavs} align="right">
                {row.totalFavs}
              </TableCell>
              <TableCell key={row.totalRetweets} align="right">
                {row.totalRetweets}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

MetricsTable.propTypes = {
  metrics: PropTypes.object.isRequired,
};

export default MetricsTable;
