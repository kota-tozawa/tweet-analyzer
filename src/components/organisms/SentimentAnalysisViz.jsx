import React from 'react';
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

const SentimentAnalysisViz = ({ breaks, scores, lengths }) => {
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
          // interval="preserveStartEnd"
          label={{ value: '感情極性値', angle: -90, position: 'insideLeft' }}
        />
        <YAxis
          dataKey="length"
          yAxisId="right"
          orientation="right"
          // interval="preserveStartEnd"
          label={{
            value: '文長',
            angle: -90,
            position: 'insideLeft',
            offset: 50,
          }}
        />
        <Tooltip />
        <Legend verticalAlign="top" />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="score"
          name="極性値"
          stroke="#F08080"
          dot={false}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="length"
          name="文長"
          stroke="#80CEE1"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
export default SentimentAnalysisViz;
