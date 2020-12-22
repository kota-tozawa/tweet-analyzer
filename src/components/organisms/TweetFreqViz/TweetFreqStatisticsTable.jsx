import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const TweetFreqStatisticsTable = (summaryStatistics) => {
  const classes = useStyles();

  // データ構造が {summaryStatistics: {summaryStatistics: {sum, ...}}} になっているため、階層を一段上げる
  const data = summaryStatistics.summaryStatistics;

  const createData = (name, sum, min, max, mean, sd) => {
    return { name, sum, min, max, mean, sd };
  };

  const rows = [
    createData(
      'ツイート頻度',
      separateNumberWithCommas(data['sum']),
      data['min'],
      data['max'],
      roundDecimal(data['mean'], 3),
      roundDecimal(data['sd'], 3)
    ),
  ];

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{''}</TableCell>
            <TableCell align="right">合計</TableCell>
            <TableCell align="right">最小値</TableCell>
            <TableCell align="right">最大値</TableCell>
            <TableCell align="right">平均値</TableCell>
            <TableCell align="right">標準偏差</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              <TableCell key={row.name} component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell key={row.sum} align="right">
                {row.sum}
              </TableCell>
              <TableCell key={row.min} align="right">
                {row.min}
              </TableCell>
              <TableCell key={row.max} align="right">
                {row.max}
              </TableCell>
              <TableCell key={row.mean} align="right">
                {row.mean}
              </TableCell>
              <TableCell key={row.sd} align="right">
                {row.sd}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

TweetFreqStatisticsTable.propTypes = {
  summaryStatistics: PropTypes.object.isRequired,
};

export default TweetFreqStatisticsTable;
