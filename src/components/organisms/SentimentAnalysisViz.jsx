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
  Label,
} from 'recharts';

const labels = [
  { key: 'score', name: '感情極性値', color: '#F08080', yAxisId: 'left' },
  { key: 'length', name: '文長', color: '#80CEE1', yAxisId: 'right' },
];

const SentimentAnalysisViz = ({ breaks, scores, lengths }) => {
  const [lineProps, setLineProps] = useState(
    labels.reduce(
      (a, { key }) => {
        a[key] = false;
        return a;
      },
      { hover: null }
    )
  );

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
        <Tooltip />
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
            hide={lineProps[label.key] === true}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
export default SentimentAnalysisViz;
