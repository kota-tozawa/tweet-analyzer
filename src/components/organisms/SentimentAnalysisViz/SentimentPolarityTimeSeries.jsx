import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import { theme } from '../../atoms/theme';
import { roundDecimal, separateNumberWithCommas } from '../../atoms/functions';

const labels = [
  {
    key: 'score',
    name: '感情極性値',
    color: theme.palette.primary.main,
    yAxisId: 'left',
  },
  {
    key: 'length',
    name: '文長',
    color: theme.palette.secondary.main,
    yAxisId: 'right',
  },
];

// TODO ラベルにツイートへのリンクをつけて、ツイート内容が見れるようにする
const SentimentPolarityTimeSeries = ({ breaks, scores, lengths }) => {
  const [lineProps, setLineProps] = useState(
    labels.reduce(
      (a, { key }) => {
        a[key] = false;
        return a;
      },
      { hover: null }
    )
  );

  // グラフの線を toggleable にする
  const handleLegendMouseEnter = (e) => {
    if (!lineProps[e.dataKey]) {
      setLineProps({ ...lineProps, hover: e.dataKey });
    }
  };

  const handleLegendMouseLeave = (e) => {
    setLineProps({ ...lineProps, hover: null });
  };

  const selectLine = (e) => {
    setLineProps({
      ...lineProps,
      [e.dataKey]: !lineProps[e.dataKey],
      hover: null,
    });
  };

  const data = scores.map((score, i) => ({
    period: breaks[i],
    score: score,
    length: lengths[i],
  }));

  return (
    <Paper>
      <ResponsiveContainer width="100%" height={600}>
        <LineChart
          width={700}
          height={500}
          data={data}
          margin={{
            top: 30,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="period"
            domain={['dataMin', 'dataMax']}
            interval="preserveStartEnd"
            label={{
              value: '年月日',
              offset: 25,
              position: 'left',
            }}
            angle={-90}
            textAnchor="end"
            height={150}
          />
          <YAxis
            dataKey="score"
            yAxisId="left"
            label={{ value: '感情極性値', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            dataKey="length"
            yAxisId="right"
            orientation="right"
            label={{
              value: '文長',
              angle: -90,
              position: 'insideLeft',
              offset: 50,
            }}
          />
          <Tooltip
            formatter={(value) =>
              separateNumberWithCommas(roundDecimal(value, 2))
            }
          />
          <Legend
            verticalAlign="top"
            onClick={selectLine}
            onMouseOver={handleLegendMouseEnter}
            onMouseOut={handleLegendMouseLeave}
          />
          {labels.map((label, i) => (
            <Line
              key={i}
              yAxisId={label.yAxisId}
              type="monotone"
              dataKey={label.key}
              name={label.name}
              stroke={label.color}
              dot={false}
              hide={lineProps[label.key]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

SentimentPolarityTimeSeries.propTypes = {
  breaks: PropTypes.arrayOf(PropTypes.string).isRequired,
  scores: PropTypes.arrayOf(PropTypes.number).isRequired,
  lengths: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default SentimentPolarityTimeSeries;
