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

const WordFreqTable = ({ words, freqs }) => {
  const rows = freqs
    .map((freq, i) => ({
      word: words[i],
      freq: separateNumberWithCommas(freq),
    }))
    .slice(0, 20);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">単語</TableCell>
            <TableCell align="center">出現頻度</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              <TableCell key={row.word} align="center">
                {row.word}
              </TableCell>
              <TableCell key={row.freq} align="center">
                {row.freq}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

WordFreqTable.propTypes = {
  words: PropTypes.arrayOf(PropTypes.string).isRequired,
  freqs: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default WordFreqTable;
