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

  const createData = (name, sum, minFreq, maxFreq, meanFreq, sdFreq) => {
    return { name, sum, minFreq, maxFreq, meanFreq, sdFreq };
  };

  const rows = [
    createData(
      'ツイート頻度',
      separateNumberWithCommas(data['sum']),
      data['min_freq'],
      data['max_freq'],
      roundDecimal(data['mean_freq'], 3),
      roundDecimal(data['sd_freq'], 3)
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
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.sum}</TableCell>
              <TableCell align="right">{row.minFreq}</TableCell>
              <TableCell align="right">{row.maxFreq}</TableCell>
              <TableCell align="right">{row.meanFreq}</TableCell>
              <TableCell align="right">{row.sdFreq}</TableCell>
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
